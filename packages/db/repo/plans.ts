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
