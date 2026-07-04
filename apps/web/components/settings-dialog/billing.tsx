"use client"

import { ArrowUpRightIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { usePricingDialog } from "@/components/pricing-dialog"
import { Button } from "@/components/ui/button"
import { useCurrentPlan } from "@/hooks/use-current-plan"
import { authClient } from "@/lib/auth-client"
import { SettingSection } from "./setting-section"
import { UsageCard } from "./usage-card"

export function BillingSettingsPage() {
  const pricingDialog = usePricingDialog()
  const [openingPortalAction, setOpeningPortalAction] = useState<
    "billing" | "cancel" | null
  >(null)
  const { data: plan } = useCurrentPlan()
  const isPaidPlan = plan === "basic" || plan === "premium"
  const canUpgrade = plan === "free" || plan === "basic"

  const handleOpenBillingPortal = async () => {
    setOpeningPortalAction("billing")

    try {
      const result = await authClient.subscription.billingPortal({
        returnUrl: "/home",
        disableRedirect: true,
      })
      const url = result.data?.url

      if (result.error || !url) {
        toast.error("支払い管理ページを開けませんでした。")
        setOpeningPortalAction(null)
        return
      }

      window.location.assign(url)
    } catch {
      toast.error("支払い管理ページを開けませんでした。")
      setOpeningPortalAction(null)
    }
  }

  const handleCancelSubscription = async () => {
    setOpeningPortalAction("cancel")

    try {
      const result = await authClient.subscription.cancel({
        returnUrl: "/home",
        disableRedirect: true,
      })
      const url = result.data?.url

      if (result.error || !url) {
        toast.error("解約手続きページを開けませんでした。")
        setOpeningPortalAction(null)
        return
      }

      window.location.assign(url)
    } catch {
      toast.error("解約手続きページを開けませんでした。")
      setOpeningPortalAction(null)
    }
  }

  return (
    <div className="space-y-12">
      <SettingSection title="クレジット使用量">
        <UsageCard />
      </SettingSection>

      <SettingSection title="プラン">
        <div className="flex flex-wrap gap-2">
          {canUpgrade && (
            <Button onClick={pricingDialog.open}>
              {plan === "basic" ? "プレミアムに変更" : "プランを選択"}
            </Button>
          )}
          {isPaidPlan && (
            <Button
              disabled={openingPortalAction !== null}
              onClick={handleOpenBillingPortal}
              variant="outline"
            >
              {openingPortalAction === "billing" ? (
                <Loader2 className="animate-spin" />
              ) : (
                <ArrowUpRightIcon />
              )}
              支払い方法・請求書
            </Button>
          )}
        </div>
      </SettingSection>

      {isPaidPlan && (
        <SettingSection
          title="解約"
          description="Stripeの確認画面に移動して、現在の契約を解約します。"
        >
          <Button
            disabled={openingPortalAction !== null}
            onClick={handleCancelSubscription}
            variant="destructive"
          >
            {openingPortalAction === "cancel" && (
              <Loader2 className="animate-spin" />
            )}
            解約手続きへ
          </Button>
        </SettingSection>
      )}
    </div>
  )
}
