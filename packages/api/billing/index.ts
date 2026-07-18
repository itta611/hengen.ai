import { zValidator } from "@hono/zod-validator"
import { db } from "@mutar/db"
import { subscriptions, users } from "@mutar/db/schema"
import { and, desc, eq, inArray } from "drizzle-orm"
import { Hono } from "hono"
import Stripe from "stripe"
import { z } from "zod"

import { env } from "@/lib/env"
import { type SessionEnv, sessionMiddleware } from "../session"

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    })
  : null

const cancelSubscriptionSchema = z.object({
  feedback: z.enum([
    "customer_service",
    "low_quality",
    "missing_features",
    "other",
    "switched_service",
    "too_complex",
    "too_expensive",
    "unused",
  ]),
})

function dateFromUnix(timestamp: number | null) {
  return timestamp ? new Date(timestamp * 1000) : null
}

function isoDate(date: Date | null) {
  return date?.toISOString() ?? null
}

function getPeriodEnd(subscription: Stripe.Subscription) {
  const timestamp = Math.max(
    ...subscription.items.data.map((item) => item.current_period_end)
  )

  return Number.isFinite(timestamp) ? new Date(timestamp * 1000) : null
}

async function findCurrentSubscription(userId: string) {
  const [subscription] = await db
    .select({
      id: subscriptions.id,
      periodEnd: subscriptions.periodEnd,
      stripeScheduleId: subscriptions.stripeScheduleId,
      stripeSubscriptionId: subscriptions.stripeSubscriptionId,
    })
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.referenceId, userId),
        inArray(subscriptions.status, ["active", "trialing"])
      )
    )
    .orderBy(
      desc(subscriptions.periodStart),
      desc(subscriptions.updatedAt),
      desc(subscriptions.createdAt)
    )
    .limit(1)

  return subscription
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
  .post(
    "/subscription/cancel",
    zValidator("json", cancelSubscriptionSchema),
    async (c) => {
      const session = c.get("session")
      const { feedback } = c.req.valid("json")

      if (!stripe) {
        return c.json({ message: "Stripe is not configured" }, 503)
      }

      const subscription = await findCurrentSubscription(session.user.id)

      if (!subscription?.stripeSubscriptionId) {
        return c.json({ message: "Subscription not found" }, 404)
      }

      let stripeSubscription = await stripe.subscriptions.retrieve(
        subscription.stripeSubscriptionId
      )

      if (stripeSubscription.cancel_at_period_end) {
        const periodEnd = getPeriodEnd(stripeSubscription)

        await db
          .update(subscriptions)
          .set({
            cancelAt: dateFromUnix(stripeSubscription.cancel_at),
            cancelAtPeriodEnd: true,
            canceledAt: dateFromUnix(stripeSubscription.canceled_at),
            endedAt: dateFromUnix(stripeSubscription.ended_at),
            periodEnd,
            status: stripeSubscription.status,
            stripeScheduleId: null,
            updatedAt: new Date(),
          })
          .where(eq(subscriptions.id, subscription.id))

        return c.json(
          {
            cancelAtPeriodEnd: true,
            endsAt: isoDate(periodEnd) ?? isoDate(subscription.periodEnd),
          },
          200
        )
      }

      const scheduleId =
        typeof stripeSubscription.schedule === "string"
          ? stripeSubscription.schedule
          : (stripeSubscription.schedule?.id ?? subscription.stripeScheduleId)

      if (scheduleId) {
        const schedule = await stripe.subscriptionSchedules.retrieve(scheduleId)

        if (schedule.status === "active" || schedule.status === "not_started") {
          await stripe.subscriptionSchedules.release(schedule.id)
          stripeSubscription = await stripe.subscriptions.retrieve(
            subscription.stripeSubscriptionId
          )
        }
      }

      stripeSubscription = await stripe.subscriptions.update(
        stripeSubscription.id,
        {
          cancel_at_period_end: true,
          cancellation_details: { feedback },
        }
      )

      const cancelAt = dateFromUnix(stripeSubscription.cancel_at)
      const periodEnd = getPeriodEnd(stripeSubscription)

      await db
        .update(subscriptions)
        .set({
          cancelAt,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          canceledAt: dateFromUnix(stripeSubscription.canceled_at),
          endedAt: dateFromUnix(stripeSubscription.ended_at),
          periodEnd,
          status: stripeSubscription.status,
          stripeScheduleId: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id))

      return c.json(
        {
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          endsAt:
            isoDate(cancelAt) ??
            isoDate(periodEnd) ??
            isoDate(subscription.periodEnd),
        },
        200
      )
    }
  )
