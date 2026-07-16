import { zValidator } from "@hono/zod-validator"
import {
  deleteProjectByUserId,
  findProjectForEditorByUserId,
  findProjectStatusByUserId,
  restoreProjectByUserId,
  updateProjectAnalysisByUserId,
} from "@mutar/db/repo"
import { Hono } from "hono"
import { z } from "zod"

import { type SessionEnv, sessionMiddleware } from "../../session"
import { projectParamsSchema } from "../schema"

const updateProjectSchema = z.object({
  boxes: z.array(z.unknown()),
})

export const projectRoutes = new Hono<SessionEnv>()
  .use(sessionMiddleware)
  .get("/status", zValidator("param", projectParamsSchema), async (c) => {
    const session = c.get("session")
    const { projectId } = c.req.valid("param")
    const project = await findProjectStatusByUserId({
      projectId,
      userId: session.user.id,
    })

    if (!project) {
      return c.json({ message: "Not found" }, 404)
    }

    return c.json(project, 200)
  })
  .get("/", zValidator("param", projectParamsSchema), async (c) => {
    const session = c.get("session")
    const { projectId } = c.req.valid("param")
    const project = await findProjectForEditorByUserId({
      projectId,
      userId: session.user.id,
    })

    if (!project) {
      return c.json({ message: "Not found" }, 404)
    }

    if (project.status !== "ready") {
      return c.json({ message: "Project is not ready" }, 409)
    }

    return c.json(project, 200)
  })
  .put(
    "/",
    zValidator("json", updateProjectSchema),
    zValidator("param", projectParamsSchema),
    async (c) => {
      const session = c.get("session")
      const { boxes } = c.req.valid("json")
      const { projectId } = c.req.valid("param")

      await updateProjectAnalysisByUserId({
        boxes,
        projectId,
        userId: session.user.id,
      })

      return c.json({ ok: true }, 200)
    }
  )
  .delete("/", zValidator("param", projectParamsSchema), async (c) => {
    const session = c.get("session")

    const { projectId } = c.req.valid("param")
    const project = await deleteProjectByUserId({
      projectId,
      userId: session.user.id,
    })

    if (!project) {
      return c.json({ message: "Not found" }, 404)
    }

    return c.json({ ok: true }, 200)
  })
  .post("/restore", zValidator("param", projectParamsSchema), async (c) => {
    const session = c.get("session")

    const { projectId } = c.req.valid("param")
    const project = await restoreProjectByUserId({
      projectId,
      userId: session.user.id,
    })

    if (!project) {
      return c.json({ message: "Not found" }, 404)
    }

    return c.json({ ok: true }, 200)
  })
