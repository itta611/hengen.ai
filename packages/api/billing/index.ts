import { zValidator } from "@hono/zod-validator"
import { db } from "@mutar/db"
import { subscriptions, users } from "@mutar/db/schema"
import { and, desc, eq, inArray } from "drizzle-orm"
import { Hono } from "hono"
import Stripe from "stripe"
import { z } from "zod"

import { env } from "@/lib/env"
import { type SessionEnv, sessionMiddleware } from "../session"

const stripeConfig = {
  apiVersion: "2026-06-24.dahlia",
} as const
const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, stripeConfig)
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
type UserPlan = "free" | "basic" | "premium"

function dateFromUnix(timestamp: number | null) {
  return timestamp ? new Date(timestamp * 1000) : null
}

function isoDate(date: Date | null) {
  return date?.toISOString() ?? null
}

function normalizePlan(plan: string): UserPlan {
  if (plan === "basic" || plan === "premium") {
    return plan
  }

  return "free"
}

async function findCurrentSubscription(userId: string) {
  const [subscription] = await db
    .select({
      cancelAt: subscriptions.cancelAt,
      cancelAtPeriodEnd: subscriptions.cancelAtPeriodEnd,
      id: subscriptions.id,
      periodEnd: subscriptions.periodEnd,
      plan: subscriptions.plan,
      status: subscriptions.status,
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

function serializeSubscription(
  subscription: Awaited<ReturnType<typeof findCurrentSubscription>>,
  scheduledPlan: UserPlan | null = null
) {
  if (!subscription) {
    return null
  }

  return {
    cancelAt: isoDate(subscription.cancelAt),
    cancelAtPeriodEnd: subscription.cancelAtPeriodEnd ?? false,
    periodEnd: isoDate(subscription.periodEnd),
    plan: normalizePlan(subscription.plan),
    scheduledPlan,
    status: subscription.status,
  }
}

async function getScheduledPlan(
  subscription: Awaited<ReturnType<typeof findCurrentSubscription>>
): Promise<UserPlan | null> {
  if (!subscription) {
    return null
  }

  if (subscription.cancelAtPeriodEnd || subscription.cancelAt) {
    return "free"
  }

  if (!stripe || !subscription.stripeScheduleId) {
    return null
  }

  const schedule = await stripe.subscriptionSchedules.retrieve(
    subscription.stripeScheduleId,
    { expand: ["phases.items.price"] }
  )

  if (schedule.status !== "active" && schedule.status !== "not_started") {
    return null
  }

  const nextPhase = schedule.phases.at(-1)

  for (const item of nextPhase?.items ?? []) {
    const price = item.price

    if (typeof price === "string" || price.deleted) {
      continue
    }

    if (price.lookup_key === "basic" || price.lookup_key === "premium") {
      return price.lookup_key
    }
  }

  return null
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
  .get("/subscription", async (c) => {
    const session = c.get("session")
    const subscription = await findCurrentSubscription(session.user.id)
    const scheduledPlan = await getScheduledPlan(subscription)

    return c.json(
      {
        subscription: serializeSubscription(subscription, scheduledPlan),
      },
      200
    )
  })
  .post("/subscription/upgrade", async (c) => {
    const session = c.get("session")

    if (!stripe) {
      return c.json({ message: "Stripe is not configured" }, 503)
    }

    const subscription = await findCurrentSubscription(session.user.id)

    if (!subscription?.stripeSubscriptionId) {
      return c.json({ message: "Subscription not found" }, 404)
    }

    if (
      subscription.cancelAtPeriodEnd ||
      subscription.cancelAt ||
      subscription.stripeScheduleId
    ) {
      return c.json({ message: "Subscription has a scheduled change" }, 409)
    }

    if (subscription.plan !== "basic") {
      return c.json({ message: "Subscription is not on the basic plan" }, 409)
    }

    const [basicPrices, premiumPrices, stripeSubscription] = await Promise.all([
      stripe.prices.list({ active: true, limit: 1, lookup_keys: ["basic"] }),
      stripe.prices.list({ active: true, limit: 1, lookup_keys: ["premium"] }),
      stripe.subscriptions.retrieve(subscription.stripeSubscriptionId),
    ])
    const basicPrice = basicPrices.data[0]
    const premiumPrice = premiumPrices.data[0]

    if (!basicPrice || !premiumPrice) {
      return c.json({ message: "Subscription price not found" }, 503)
    }

    const subscriptionItem = stripeSubscription.items.data.find(
      (item) => item.price.id === basicPrice.id
    )

    if (!subscriptionItem) {
      return c.json({ message: "Subscription item not found" }, 409)
    }

    if (stripeSubscription.pending_update) {
      const pendingInvoiceId =
        typeof stripeSubscription.latest_invoice === "string"
          ? stripeSubscription.latest_invoice
          : stripeSubscription.latest_invoice?.id

      if (!pendingInvoiceId) {
        return c.json({ message: "Pending invoice not found" }, 409)
      }

      const pendingInvoice = await stripe.invoices.retrieve(pendingInvoiceId)

      if (!pendingInvoice.hosted_invoice_url) {
        return c.json({ message: "Invoice payment is required" }, 409)
      }

      return c.json({ url: pendingInvoice.hosted_invoice_url }, 200)
    }

    const updatedSubscription = await stripe.subscriptions.update(
      stripeSubscription.id,
      {
        items: [
          {
            id: subscriptionItem.id,
            price: premiumPrice.id,
            quantity: subscriptionItem.quantity ?? 1,
          },
        ],
        payment_behavior: "pending_if_incomplete",
        proration_behavior: "always_invoice",
      }
    )
    const invoiceId =
      typeof updatedSubscription.latest_invoice === "string"
        ? updatedSubscription.latest_invoice
        : updatedSubscription.latest_invoice?.id

    if (!invoiceId) {
      return c.json({ message: "Upgrade invoice not found" }, 502)
    }

    const invoice = await stripe.invoices.retrieve(invoiceId)

    if (updatedSubscription.pending_update) {
      if (!invoice.hosted_invoice_url) {
        return c.json({ message: "Invoice payment is required" }, 409)
      }

      return c.json({ url: invoice.hosted_invoice_url }, 200)
    }

    await db
      .update(subscriptions)
      .set({
        plan: "premium",
        status: updatedSubscription.status,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))

    return c.json({ url: "/home?checkout=success" }, 200)
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

      if (subscription.cancelAtPeriodEnd) {
        return c.json(
          {
            cancelAtPeriodEnd: true,
            endsAt: isoDate(subscription.periodEnd),
          },
          200
        )
      }

      if (subscription.stripeScheduleId) {
        const schedule = await stripe.subscriptionSchedules.retrieve(
          subscription.stripeScheduleId
        )

        if (schedule.status === "active" || schedule.status === "not_started") {
          await stripe.subscriptionSchedules.release(schedule.id)
        }
      }

      const stripeSubscription = await stripe.subscriptions.update(
        subscription.stripeSubscriptionId,
        {
          cancel_at_period_end: true,
          cancellation_details: { feedback },
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
          stripeScheduleId: null,
          updatedAt: new Date(),
        })
        .where(eq(subscriptions.id, subscription.id))

      return c.json(
        {
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          endsAt: isoDate(cancelAt) ?? isoDate(subscription.periodEnd),
        },
        200
      )
    }
  )
  .post("/subscription/restore", async (c) => {
    const session = c.get("session")

    if (!stripe) {
      return c.json({ message: "Stripe is not configured" }, 503)
    }

    const subscription = await findCurrentSubscription(session.user.id)

    if (!subscription?.stripeSubscriptionId) {
      return c.json({ message: "Subscription not found" }, 404)
    }

    if (!subscription.cancelAtPeriodEnd && !subscription.cancelAt) {
      return c.json(
        {
          subscription: serializeSubscription(subscription),
        },
        200
      )
    }

    const updateParams: Stripe.SubscriptionUpdateParams = subscription.cancelAt
      ? { cancel_at: "" }
      : { cancel_at_period_end: false }
    const stripeSubscription = await stripe.subscriptions.update(
      subscription.stripeSubscriptionId,
      updateParams
    )

    await db
      .update(subscriptions)
      .set({
        cancelAt: null,
        cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
        canceledAt: null,
        endedAt: null,
        status: stripeSubscription.status,
        updatedAt: new Date(),
      })
      .where(eq(subscriptions.id, subscription.id))

    return c.json(
      {
        subscription: {
          cancelAt: null,
          cancelAtPeriodEnd: stripeSubscription.cancel_at_period_end,
          periodEnd: isoDate(subscription.periodEnd),
          status: stripeSubscription.status,
        },
      },
      200
    )
  })
