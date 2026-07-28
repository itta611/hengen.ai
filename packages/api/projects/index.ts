import { randomUUID } from "node:crypto"

import { zValidator } from "@hono/zod-validator"
import {
  cancelProjectCredits,
  createProject,
  listDeletedImagesByUserId,
  listGeneratedImagesByUserId,
  listStarredImagesByUserId,
  reserveCreditsForProjects,
  updateProjectStatusByUserId,
} from "@mutar/db/repo"
import { Hono } from "hono"
import { z } from "zod"

import { env } from "@/lib/env"
import { type SessionEnv, sessionMiddleware } from "../session"

const createProjectBaseSchema = z.object({
  prompt: z.string().trim().max(1200),
  aspectRatio: z.enum(["auto", "16:9", "4:3", "3:4", "1:1"]),
  count: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4)]),
  referenceImages: z.array(z.string().startsWith("data:image/")).optional(),
  style: z
    .object({
      texture: z.enum(["flat", "outline", "soft", "realistic"]).optional(),
      themeColor: z.string().optional(),
      backgroundColor: z.string().optional(),
    })
    .optional(),
})

const createProjectSchema = createProjectBaseSchema.extend({
  prompt: z.string().trim().min(1).max(1200),
})

const createProjectFromImageSchema = z.object({
  referenceImage: z.string().startsWith("data:image/"),
})

async function startProjectGeneration({
  aspectRatio,
  image,
  projectIds,
  prompt,
  referenceImages,
  style,
  userId,
}: {
  aspectRatio: z.infer<typeof createProjectBaseSchema>["aspectRatio"]
  image?: string
  projectIds: string[]
  prompt: string
  referenceImages?: string[]
  style?: z.infer<typeof createProjectBaseSchema>["style"]
  userId: string
}) {
  try {
    await Promise.all(
      projectIds.map((projectId) =>
        createProject({
          id: projectId,
          userId,
          prompt,
          aspectRatio,
          status: "generating",
          width: 0,
          height: 0,
          analysis: { summary: "", boxes: [] },
        })
      )
    )
  } catch {
    await cancelProjectCredits({ projectIds, userId })
    await Promise.allSettled(
      projectIds.map((projectId) =>
        updateProjectStatusByUserId({
          projectId,
          status: "error",
          userId,
        })
      )
    )

    return []
  }

  const results = await Promise.allSettled(
    projectIds.map(async (projectId) => {
      const response = await fetch(
        new URL(image ? "/from-image" : "/generate", env.MUTAR_WORKER_URL),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.MUTAR_WORKER_SECRET}`,
          },
          body: JSON.stringify(
            image
              ? { projectId, image }
              : {
                  projectId,
                  prompt,
                  aspectRatio,
                  referenceImages,
                  style,
                }
          ),
        }
      )

      if (!response.ok) {
        throw new Error("worker_failed")
      }

      return projectId
    })
  )
  const failedProjectIds = projectIds.filter((_, index) => {
    return results[index]?.status === "rejected"
  })

  if (failedProjectIds.length > 0) {
    await Promise.all(
      failedProjectIds.map((projectId) =>
        updateProjectStatusByUserId({
          projectId,
          status: "error",
          userId,
        })
      )
    )
  }

  return results.flatMap((result) =>
    result.status === "fulfilled" ? [result.value] : []
  )
}

export const projectsRoutes = new Hono<SessionEnv>()
  .use(sessionMiddleware)
  .get("/", async (c) => {
    const session = c.get("session")

    const projects =
      c.req.query("trash") === "true"
        ? await listDeletedImagesByUserId(session.user.id)
        : c.req.query("starred") === "true"
          ? await listStarredImagesByUserId(session.user.id)
          : await listGeneratedImagesByUserId(session.user.id)

    return c.json({ projects }, 200)
  })
  .post(
    "/from-image",
    zValidator("json", createProjectFromImageSchema),
    async (c) => {
      const session = c.get("session")
      const { referenceImage } = c.req.valid("json")
      const projectId = randomUUID()
      const reservation = await reserveCreditsForProjects({
        creditsPerProject: 5,
        projectIds: [projectId],
        userId: session.user.id,
      })

      if (!reservation.usage) {
        return c.json({ message: "Not found" }, 404)
      }

      if (!reservation.reserved) {
        return c.json(
          {
            message: "Insufficient credits",
            usage: reservation.usage,
          },
          402
        )
      }

      const startedProjectIds = await startProjectGeneration({
        aspectRatio: "auto",
        image: referenceImage,
        projectIds: [projectId],
        prompt: "",
        userId: session.user.id,
      })

      if (startedProjectIds.length === 0) {
        return c.json({ message: "Generation failed" }, 502)
      }

      return c.json({ projectId }, 200)
    }
  )
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const session = c.get("session")

    const { aspectRatio, count, prompt, referenceImages, style } =
      c.req.valid("json")
    const projectIds = Array.from({ length: count }, () => randomUUID())
    const reservation = await reserveCreditsForProjects({
      creditsPerProject: 10,
      projectIds,
      userId: session.user.id,
    })

    if (!reservation.usage) {
      return c.json({ message: "Not found" }, 404)
    }

    if (!reservation.reserved) {
      return c.json(
        {
          message: "Insufficient credits",
          usage: reservation.usage,
        },
        402
      )
    }

    const startedProjectIds = await startProjectGeneration({
      aspectRatio,
      projectIds,
      prompt,
      referenceImages,
      style,
      userId: session.user.id,
    })

    if (startedProjectIds.length === 0) {
      return c.json({ message: "Generation failed" }, 502)
    }

    return c.json({ projectIds: startedProjectIds }, 200)
  })
