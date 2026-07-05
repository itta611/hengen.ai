import { db } from "@mutar/db"
import { users } from "@mutar/db/schema"
import { eq } from "drizzle-orm"
import { Hono } from "hono"
import Stripe from "stripe"

import { env } from "@/lib/env"
import { sessionMiddleware, type SessionEnv } from "../session"

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null

export const billingRoutes = new Hono<SessionEnv>()
  .use(sessionMiddleware)
  .get("/invoices", async (c) => {
    const session = c.get("session")

    if (!stripe) {
      return c.json({ invoices: [] }, 200)
    }

    const [user] = await db
      .select({ stripeCustomerId: users.stripeCustomerId })
      .from(users)
      .where(eq(users.id, session.user.id))
      .limit(1)

    if (!user?.stripeCustomerId) {
      return c.json({ invoices: [] }, 200)
    }

    const invoices = await stripe.invoices.list({
      customer: user.stripeCustomerId,
      limit: 12,
    })

    return c.json(
      {
        invoices: invoices.data.map((invoice) => ({
          id: invoice.id,
          amountPaid: invoice.amount_paid,
          created: invoice.created,
          currency: invoice.currency,
          hostedInvoiceUrl: invoice.hosted_invoice_url,
          invoicePdf: invoice.invoice_pdf,
          number: invoice.number,
          status: invoice.status,
        })),
      },
      200
    )
  })
