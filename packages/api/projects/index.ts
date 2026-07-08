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

const createProjectSchema = z.union([
  createProjectBaseSchema.extend({
    prompt: z.string().trim().min(1).max(1200),
  }),
  createProjectBaseSchema.extend({
    referenceImages: z.array(z.string().startsWith("data:image/")).min(1),
  }),
])

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
  .post("/", zValidator("json", createProjectSchema), async (c) => {
    const session = c.get("session")

    const { aspectRatio, count, prompt, referenceImages, style } =
      c.req.valid("json")
    const projectIds = Array.from({ length: count }, () => randomUUID())
    const reservation = await reserveCreditsForProjects({
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

    try {
      await Promise.all(
        projectIds.map((projectId) =>
          createProject({
            id: projectId,
            userId: session.user.id,
            prompt,
            title: "新規プロジェクト",
            aspectRatio,
            status: "generating",
            width: 0,
            height: 0,
            analysis: { summary: "", boxes: [] },
          })
        )
      )
    } catch {
      await cancelProjectCredits({ projectIds, userId: session.user.id })
      await Promise.allSettled(
        projectIds.map((projectId) =>
          updateProjectStatusByUserId({
            projectId,
            status: "error",
            userId: session.user.id,
          })
        )
      )

      return c.json({ message: "Generation failed" }, 502)
    }

    const results = await Promise.allSettled(
      projectIds.map(async (projectId) => {
        const response = await fetch(
          new URL("/generate", env.MUTAR_WORKER_URL),
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${env.MUTAR_WORKER_SECRET}`,
            },
            body: JSON.stringify({
              projectId,
              prompt,
              aspectRatio,
              referenceImages,
              style,
            }),
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
            userId: session.user.id,
          })
        )
      )
    }

    const startedProjectIds = results.flatMap((result) =>
      result.status === "fulfilled" ? [result.value] : []
    )

    if (startedProjectIds.length === 0) {
      return c.json({ message: "Generation failed" }, 502)
    }

    return c.json({ projectIds: startedProjectIds }, 200)
  })
