import { db } from "@mutar/db"
import { subscriptions, users } from "@mutar/db/schema"
import { and, desc, eq, inArray } from "drizzle-orm"
import { Hono } from "hono"
import Stripe from "stripe"

import { env } from "@/lib/env"
import { sessionMiddleware, type SessionEnv } from "../session"

const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null

function dateFromUnix(timestamp: number | null) {
  return timestamp ? new Date(timestamp * 1000) : null
}

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
  .post("/subscription/cancel", async (c) => {
    const session = c.get("session")

    if (!stripe) {
      return c.json({ message: "Stripe is not configured" }, 503)
    }

    const [subscription] = await db
      .select({
        cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
        id: subscriptions.id,
        periodEnd: subscriptions.periodEnd,
        stripeSubscriptionId: subscriptions.stripeSubscriptionId,
      })
      .from(subscriptions)
      .where(
        and(
          eq(subscriptions.referenceId, session.user.id),
          inArray(subscriptions.status, ["active", "trialing"])
        )
      )
      .orderBy(
        desc(subscriptions.periodStart),
        desc(subscriptions.updatedAt),
        desc(subscriptions.createdAt)
      )
      .limit(1)

    if (!subscription?.stripeSubscriptionId) {
      return c.json({ message: "Subscription not found" }, 404)
    }

    if (subscription.cancelAtPeriodEnd) {
      return c.json(
        {
          cancelAtPeriodEnd: true,
          endsAt: subscription.periodEnd?.toISOString() ?? null,
        },
        200
      )
    }

    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      {
        cancel_at_period_end: true,
      }
    )

    const cancelAt = dateFromUnix(stripeSubscription.cancel_at)
    const canceledAt = dateFromUnix(stripeSubscription.canceled_at)
    const endedAt = dateFromUnix(stripeSubscription.ended_at)

    await db
      .update(subscriptions)
      .set({
        cancelAt,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt,
        endedAt,
        status: stripeSubscription.status,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))

    return c.json(
      {
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        endsAt:
          cancelAt?.toISOString() ??
          subscription.periodEnd?.toISOString() ??
          null,
      },
      200
    )
  })
