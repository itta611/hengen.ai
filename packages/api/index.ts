import { Hono } from "hono"

import { accountRoutes } from "./account"
import { billingRoutes } from "./billing"
import { creditsRoutes } from "./credits"
import { projectsRoutes } from "./projects"
import { projectRoutes } from "./projects/[projectId]"
import { projectEditRoutes } from "./projects/[projectId]/edit"
import { projectImageRoutes } from "./projects/[projectId]/image"
import { projectStarRoutes } from "./projects/[projectId]/star"

const routes = new Hono()
  .route("/account", accountRoutes)
  .route("/billing", billingRoutes)
  .route("/credits", creditsRoutes)
  .route("/projects", projectsRoutes)
  .route("/projects/:projectId", projectRoutes)
  .route("/projects/:projectId/edit", projectEditRoutes)
  .route("/projects/:projectId/image", projectImageRoutes)
  .route("/projects/:projectId/star", projectStarRoutes)

export type AppType = typeof routes

export const app = new Hono().basePath("/api").route("/", routes)
