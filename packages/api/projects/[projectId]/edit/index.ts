import { Buffer } from "node:buffer"
import { randomUUID } from "node:crypto"

import { zValidator } from "@hono/zod-validator"
import {
  cancelProjectCredits,
  createProject,
  findProjectDimensionsByUserId,
  reserveCreditsForProjects,
  updateProjectStatusByUserId,
} from "@mutar/db/repo"
import { Hono } from "hono"
import { z } from "zod"

import { env } from "@/lib/env"
import { projectImageKey, readImageFromR2 } from "../../../r2"
import { type SessionEnv, sessionMiddleware } from "../../../session"
import { projectParamsSchema } from "../../schema"

const editProjectSchema = z.object({
  instruction: z.string().trim().min(1).max(1200),
})

export const projectEditRoutes = new Hono<SessionEnv>().post(
  "/",
  sessionMiddleware,
  zValidator("param", projectParamsSchema),
  zValidator("json", editProjectSchema),
  async (c) => {
    const session = c.get("session")
    const { projectId: sourceProjectId } = c.req.valid("param")
    const { instruction } = c.req.valid("json")
    const sourceProject = await findProjectDimensionsByUserId({
      projectId: sourceProjectId,
      userId: session.user.id,
    })

    if (!sourceProject || sourceProject.status !== "ready") {
      return c.json({ message: "Not found" }, 404)
    }

    let originalImage: Awaited<ReturnType<typeof readImageFromR2>>

    try {
      originalImage = await readImageFromR2(
        projectImageKey(sourceProjectId, "original")
      )
    } catch (error) {
      console.error("[mutar] failed to read original project image", error)
      return c.json({ message: "Image not available" }, 404)
    }

    const projectId = randomUUID()
    const reservation = await reserveCreditsForProjects({
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

    try {
      await createProject({
        id: projectId,
        userId: session.user.id,
        prompt: instruction,
        aspectRatio: "auto",
        status: "generating",
        width: 0,
        height: 0,
        analysis: { summary: "", boxes: [] },
      })
    } catch {
      await cancelProjectCredits({
        projectIds: [projectId],
        userId: session.user.id,
      })
      return c.json({ message: "Edit failed" }, 502)
    }

    const response = await fetch(new URL("/generate", env.MUTAR_WORKER_URL), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.MUTAR_WORKER_SECRET}`,
      },
      body: JSON.stringify({
        projectId,
        prompt: instruction,
        aspectRatio: "auto",
        referenceImages: [
          `data:${originalImage.mediaType};base64,${Buffer.from(
            originalImage.bytes
          ).toString("base64")}`,
        ],
      }),
    })

    if (!response.ok) {
      await updateProjectStatusByUserId({
        projectId,
        status: "error",
        userId: session.user.id,
      })
      return c.json({ message: "Edit failed" }, 502)
    }

    return c.json({ projectId }, 200)
  }
)
