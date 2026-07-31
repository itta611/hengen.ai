import { and, desc, eq, inArray } from "drizzle-orm"

import { db } from ".."
import { subscriptions } from "../schema"

export const PLAN_CREDIT_QUOTAS = {
  free: 40,
  basic: 240,
  premium: 720,
} as const

export type UserPlan = keyof typeof PLAN_CREDIT_QUOTAS

export function isUserPlan(plan: string | null | undefined): plan is UserPlan {
  return plan === "free" || plan === "basic" || plan === "premium"
}

export function getCreditQuotaByPlan(plan: UserPlan) {
  return PLAN_CREDIT_QUOTAS[plan]
}

export async function getUserPlanById(userId: string) {
  const [activeSubscription] = await db
    .select({ plan: subscriptions.plan })
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
  return isUserPlan(activeSubscription?.plan) ? activeSubscription.plan : "free"
}
