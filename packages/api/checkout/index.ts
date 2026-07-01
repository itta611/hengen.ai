import { zValidator } from "@hono/zod-validator"
import { Hono } from "hono"
import Stripe from "stripe"
import { z } from "zod"

import { env } from "@/lib/env"
import { sessionMiddleware, type SessionEnv } from "../session"

const createCheckoutSessionSchema = z.object({
  lookup_key: z.enum(["basic", "premium"]),
})

export const checkoutRoutes = new Hono<SessionEnv>()
  .use(sessionMiddleware)
  .post(
    "/sessions",
    zValidator("json", createCheckoutSessionSchema),
    async (c) => {
      const session = c.get("session")
      const { lookup_key: lookupKey } = c.req.valid("json")

      if (!env.STRIPE_SECRET_KEY) {
        return c.json({ message: "Stripe is not configured" }, 500)
      }

      const stripe = new Stripe(env.STRIPE_SECRET_KEY)
      const prices = await stripe.prices.list({
        lookup_keys: [lookupKey],
        expand: ["data.product"],
        limit: 1,
      })
      const price = prices.data[0]

      if (!price) {
        return c.json({ message: "Price not found" }, 404)
      }

      const origin = new URL(c.req.url).origin

      const checkoutSession = await stripe.checkout.sessions.create({
        mode: "subscription",
        client_reference_id: session.user.id,
        success_url: new URL("/home?checkout=success", origin).toString(),
        cancel_url: new URL("/home?checkout=cancel", origin).toString(),
        customer_email: session.user.email || undefined,
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        metadata: {
          userId: session.user.id,
          plan: lookupKey,
        },
        subscription_data: {
          metadata: {
            userId: session.user.id,
            plan: lookupKey,
          },
        },
      })

      if (!checkoutSession.url) {
        return c.json({ message: "Checkout URL was not returned" }, 502)
      }

      return c.json({ url: checkoutSession.url }, 200)
    }
  )
