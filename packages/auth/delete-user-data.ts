import { db } from "@mutar/db"
import { subscriptions, verifications } from "@mutar/db/schema"
import { eq } from "drizzle-orm"
import Stripe from "stripe"

import { env } from "@/lib/env"

const stripe = env.STRIPE_SECRET_KEY
  ? new Stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    })
  : null

async function deleteStripeCustomer(
  userId: string,
  userStripeCustomerId: string | null | undefined
) {
  if (!stripe) {
    return
  }

  const [subscription] = await db
    .select({ stripeCustomerId: subscriptions.stripeCustomerId })
    .from(subscriptions)
    .where(eq(subscriptions.referenceId, userId))
    .limit(1)
  const customerId =
    userStripeCustomerId ?? subscription?.stripeCustomerId ?? null

  if (!customerId) {
    return
  }

  try {
    await stripe.customers.del(customerId)
  } catch (error) {
    if (
      error instanceof Stripe.errors.StripeInvalidRequestError &&
      error.code === "resource_missing"
    ) {
      return
    }

    throw error
  }
}

export async function deleteUserData(user: {
  email: string
  id: string
  stripeCustomerId?: string | null
}) {
  await deleteStripeCustomer(user.id, user.stripeCustomerId)

  await db.delete(verifications).where(eq(verifications.identifier, user.email))
}
