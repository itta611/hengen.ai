"use client"

import { useQuery } from "@tanstack/react-query"
import { usePricingDialog } from "@/components/pricing-dialog"
import { apiClient } from "@/lib/api-client"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { Progress } from "../ui/progress"

async function getCreditUsage() {
  const response = await apiClient.credits.$get()

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return response.json()
}

function formatPlanName(plan: "free" | "basic" | "premium") {
  switch (plan) {
    case "basic":
      return "ベーシックプラン"
    case "premium":
      return "プレミアムプラン"
    default:
      return "無料プラン"
  }
}

function UsageCard() {
  const pricingDialog = usePricingDialog()
  const { data: creditUsage } = useQuery({
    queryKey: ["credit-usage"],
    queryFn: getCreditUsage,
  })
  const creditPercent = creditUsage
    ? Math.min(100, (creditUsage.used / creditUsage.quota) * 100)
    : 0
  const canUpgrade = creditUsage ? creditUsage.plan !== "premium" : false

  return (
    <div className="border rounded-xl px-5 space-y-4.5 py-4.5">
      <div className={cn("text-sm font-bold", { "pb-2": canUpgrade })}>
        {creditUsage ? formatPlanName(creditUsage.plan) : "-"}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>
          {creditUsage ? `${creditUsage.used} / ${creditUsage.quota}` : "- / -"}
        </span>
        <Progress className="grow" value={creditPercent} />
        <span className="text-muted-foreground">
          {creditPercent.toFixed(0)}% 使用済み
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">
          毎月1日にリセットされます。
        </span>
        {canUpgrade && (
          <Button onClick={pricingDialog.open}>アップグレード</Button>
        )}
      </div>
    </div>
  )
}

export { UsageCard }
