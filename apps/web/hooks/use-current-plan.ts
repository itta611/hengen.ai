"use client"

import { authClient } from "@/lib/auth-client"

type UserPlan = "free" | "basic" | "premium"

export function useCurrentPlan() {
  const session = authClient.useSession()

  return {
    ...session,
    data: session.data?.user.plan ?? "free",
  }
}

export type { UserPlan }
