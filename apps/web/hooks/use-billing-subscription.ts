"use client"

import { useQuery } from "@tanstack/react-query"

import { authClient } from "@/lib/auth-client"

async function getBillingSubscription() {
  const { data, error } = await authClient.subscription.list({})

  if (error) {
    throw new Error(error.message)
  }

  return (
    data?.find(
      (subscription) =>
        subscription.status === "active" || subscription.status === "trialing"
    ) ?? null
  )
}

function useBillingSubscription() {
  return useQuery({
    queryKey: ["billing-subscription"],
    queryFn: getBillingSubscription,
  })
}

export { useBillingSubscription }
