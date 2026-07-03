import { NextResponse } from "next/server"
import { isUserPlan, updateUserPlanById } from "@mutar/db/repo"
import Stripe from "stripe"

import { env } from "@/lib/env"

export const runtime = "nodejs"

const ACTIVE_SUBSCRIPTION_STATUSES = new Set<Stripe.Subscription.Status>([
  "active",
  "trialing",
])

function getPlanFromPrice(price: string | Stripe.Price | null | undefined) {
  if (!price || typeof price === "string") {
    return null
  }

  return isUserPlan(price.lookup_key) ? price.lookup_key : null
}

function getPlanFromSubscription(subscription: Stripe.Subscription) {
  if (isUserPlan(subscription.metadata.plan)) {
    return subscription.metadata.plan
  }

  const price = subscription.items.data[0]?.price
  return getPlanFromPrice(price)
}

async function updatePlanFromSubscription(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId

  if (!userId) {
    return
  }

  const plan = ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)
    ? getPlanFromSubscription(subscription)
    : "free"

  await updateUserPlanById(userId, plan ?? "free")
}

async function handleCheckoutSessionCompleted(
  stripe: Stripe,
  session: Stripe.Checkout.Session
) {
  if (session.mode !== "subscription" || !session.subscription) {
    return
  }

  const userId = session.client_reference_id ?? session.metadata?.userId

  if (!userId) {
    return
  }

  const subscriptionId =
    typeof session.subscription === "string"
      ? session.subscription
      : session.subscription.id
  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price"],
  })
  const plan = ACTIVE_SUBSCRIPTION_STATUSES.has(subscription.status)
    ? getPlanFromSubscription(subscription)
    : "free"

  await updateUserPlanById(userId, plan ?? "free")
}

export async function POST(request: Request) {
  if (!(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET)) {
    return NextResponse.json(
      { message: "Stripe is not configured" },
      { status: 500 }
    )
  }

  const stripe = new Stripe(env.STRIPE_SECRET_KEY)
  const signature = request.headers.get("stripe-signature")

  if (!signature) {
    return NextResponse.json(
      { message: "Missing Stripe signature" },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      await request.text(),
      signature,
      env.STRIPE_WEBHOOK_SECRET
    )
  } catch {
    return NextResponse.json(
      { message: "Invalid Stripe signature" },
      { status: 400 }
    )
  }

  switch (event.type) {
    case "checkout.session.completed":
      await handleCheckoutSessionCompleted(
        stripe,
        event.data.object as Stripe.Checkout.Session
      )
      break
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted":
      await updatePlanFromSubscription(event.data.object as Stripe.Subscription)
      break
    default:
      break
  }

  return NextResponse.json({ received: true })
}
