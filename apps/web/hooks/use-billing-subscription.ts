"use client"

import { useQuery } from "@tanstack/react-query"

import { apiClient } from "@/lib/api-client"

async function getBillingSubscription() {
  const response = await apiClient.billing.subscription.$get()

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return response.json()
}

function useBillingSubscription(enabled: boolean) {
  return useQuery({
    enabled,
    queryKey: ["billing-subscription"],
    queryFn: getBillingSubscription,
  })
}

export { useBillingSubscription }
