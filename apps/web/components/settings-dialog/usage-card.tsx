"use client"

import { useQuery } from "@tanstack/react-query"
import { usePricingDialog } from "@/components/pricing-dialog"
import { apiClient } from "@/lib/api-client"
import { useTranslation } from "@/i18n/client"
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

function UsageCard() {
  const { t } = useTranslation()
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
        {creditUsage ? t(`common.plan.${creditUsage.plan}`) : "-"}
      </div>
      <div className="flex items-center justify-between gap-3 text-sm">
        <span>
          {creditUsage ? `${creditUsage.used} / ${creditUsage.quota}` : "- / -"}
        </span>
        <Progress className="grow" value={creditPercent} />
        <span className="text-muted-foreground">
          {t("settings.usage.used", { percent: creditPercent.toFixed(0) })}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground">
          {t("settings.usage.reset")}
        </span>
        {canUpgrade && (
          <Button onClick={pricingDialog.open}>
            {t("settings.usage.upgrade")}
          </Button>
        )}
      </div>
    </div>
  )
}

export { UsageCard }
