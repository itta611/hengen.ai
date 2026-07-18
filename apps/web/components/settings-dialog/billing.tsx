"use client"

import { useQuery } from "@tanstack/react-query"
import { ArrowUpRightIcon, FileTextIcon, InfoIcon, Loader2 } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"

import { usePricingDialog } from "@/components/pricing-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { useBillingSubscription } from "@/hooks/use-billing-subscription"
import { useCurrentPlan } from "@/hooks/use-current-plan"
import { apiClient } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import {
  CancellationDialog,
  type CancellationFeedback,
} from "./cancellation-dialog"
import { SettingSection } from "./setting-section"
import { UsageCard } from "./usage-card"

type BillingAction = "cancel" | "downgrade" | "restore" | null

async function getInvoices() {
  const response = await apiClient.billing.invoices.$get()

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return response.json()
}

export function BillingSettingsPage() {
  const pricingDialog = usePricingDialog()
  const [isCancellationDialogOpen, setCancellationDialogOpen] = useState(false)
  const [billingAction, setBillingAction] = useState<BillingAction>(null)
  const { data: sessionPlan } = useCurrentPlan()
  const subscriptionQuery = useBillingSubscription()
  const subscription = subscriptionQuery.data
  const currentPlan = subscription?.plan ?? sessionPlan
  const isPaidPlan = currentPlan === "basic" || currentPlan === "premium"
  const isPendingDowngrade =
    currentPlan === "premium" && Boolean(subscription?.stripeScheduleId)
  const isPendingCancellation = isSubscriptionPendingCancellation(subscription)
  const subscriptionEndsAt = getSubscriptionEndsAt(subscription)
  const subscriptionId = subscription?.stripeSubscriptionId

  const handleCancelSubscription = async (feedback: CancellationFeedback) => {
    setBillingAction("cancel")

    try {
      const response = await apiClient.billing.subscription.cancel.$post({
        json: { feedback },
      })

      if (!response.ok) {
        toast.error("解約できませんでした。")
        await subscriptionQuery.refetch()
        setBillingAction(null)
        return
      }

      const result = await response.json()
      const endsAt = result.endsAt ? formatDate(result.endsAt) : null

      await subscriptionQuery.refetch()
      setCancellationDialogOpen(false)
      toast.success(
        endsAt
          ? `${endsAt}まで現在のプランを利用できます。`
          : "解約を受け付けました。"
      )
      setBillingAction(null)
    } catch {
      toast.error("解約できませんでした。")
      setBillingAction(null)
    }
  }

  const handleRestoreSubscription = async (
    action: "downgrade" | "restore",
    successMessage: string
  ) => {
    setBillingAction(action)

    try {
      const { error } = await authClient.subscription.restore({
        subscriptionId,
      })

      if (error) {
        toast.error(error.message || "プランを再開できませんでした。")
        await subscriptionQuery.refetch()
        setBillingAction(null)
        return
      }

      await subscriptionQuery.refetch()
      toast.success(successMessage)
      setBillingAction(null)
    } catch {
      toast.error("プランを再開できませんでした。")
      setBillingAction(null)
    }
  }

  return (
    <div className="space-y-12">
      <SettingSection title="クレジット使用量">
        <UsageCard />
      </SettingSection>

      {isPaidPlan && !isPendingCancellation && (
        <SettingSection title="プランを変更">
          <div className="space-y-3">
            {isPendingDowngrade && subscriptionEndsAt && (
              <Alert>
                <InfoIcon />
                <AlertTitle>
                  {subscriptionEndsAt}までプレミアムプランを利用できます
                </AlertTitle>
                <AlertDescription>
                  {subscriptionEndsAt}
                  に自動でベーシックプランに切り替わります。
                </AlertDescription>
              </Alert>
            )}
            {isPendingDowngrade ? (
              <Button
                disabled={billingAction === "downgrade"}
                onClick={() =>
                  handleRestoreSubscription(
                    "downgrade",
                    "プレミアムプランを再開しました。"
                  )
                }
                variant="outline"
              >
                {billingAction === "downgrade" && (
                  <Loader2 className="animate-spin" />
                )}
                プレミアムプランを再開する
              </Button>
            ) : (
              <Button onClick={pricingDialog.open} variant="outline">
                プランを変更する
              </Button>
            )}
          </div>
        </SettingSection>
      )}

      {isPaidPlan && isPendingCancellation ? (
        <SettingSection title="プランを再開">
          <div className="space-y-3">
            {subscriptionEndsAt && (
              <Alert>
                <InfoIcon />
                <AlertTitle>
                  {subscriptionEndsAt}まで
                  {formatPlanName(currentPlan)}を利用できます
                </AlertTitle>
                <AlertDescription>
                  {subscriptionEndsAt}に自動でプランが解約されます。
                </AlertDescription>
              </Alert>
            )}
            <Button
              disabled={billingAction === "restore"}
              onClick={() =>
                handleRestoreSubscription("restore", "プランを再開しました。")
              }
            >
              {billingAction === "restore" && (
                <Loader2 className="animate-spin" />
              )}
              プランを再開する
            </Button>
          </div>
        </SettingSection>
      ) : null}

      {isPaidPlan && !isPendingCancellation ? (
        <SettingSection title="プランを解約">
          <Button
            onClick={() => setCancellationDialogOpen(true)}
            variant="outline"
          >
            プランを解約する
          </Button>
        </SettingSection>
      ) : null}

      {isCancellationDialogOpen ? (
        <CancellationDialog
          isSubmitting={billingAction === "cancel"}
          onConfirm={handleCancelSubscription}
          onOpenChange={setCancellationDialogOpen}
          open
        />
      ) : null}

      {isPaidPlan && (
        <SettingSection title="請求履歴">
          <InvoiceHistory />
        </SettingSection>
      )}
    </div>
  )
}

function getSubscriptionEndsAt(
  subscription:
    | {
        cancelAt?: Date | string | null
        periodEnd?: Date | string | null
      }
    | null
    | undefined
) {
  const endsAt = subscription?.cancelAt ?? subscription?.periodEnd

  return endsAt ? formatDate(endsAt) : null
}

function isSubscriptionPendingCancellation(
  subscription:
    | {
        cancelAt?: Date | string | null
        cancelAtPeriodEnd?: boolean | null
        periodEnd?: Date | string | null
      }
    | null
    | undefined
) {
  const endsAt = subscription?.cancelAt ?? subscription?.periodEnd

  return Boolean(
    subscription?.cancelAtPeriodEnd &&
      endsAt &&
      new Date(endsAt).getTime() > Date.now()
  )
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

function formatPlanName(plan: string) {
  switch (plan) {
    case "basic":
      return "ベーシックプラン"
    case "premium":
      return "プレミアムプラン"
    default:
      return "無料プラン"
  }
}

function formatInvoiceAmount(amount: number, currency: string) {
  const normalizedCurrency = currency.toLowerCase()
  const value = normalizedCurrency === "jpy" ? amount : amount / 100

  return new Intl.NumberFormat("ja-JP", {
    currency: currency.toUpperCase(),
    style: "currency",
  }).format(value)
}

function formatInvoiceDate(created: number) {
  return new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(created * 1000))
}

function formatInvoiceStatus(status: string | null) {
  switch (status) {
    case "draft":
      return "下書き"
    case "open":
      return "未払い"
    case "paid":
      return "支払い済み"
    case "uncollectible":
      return "回収不能"
    case "void":
      return "無効"
    default:
      return "不明"
  }
}

function InvoiceHistory() {
  const { data, isError, isLoading } = useQuery({
    queryKey: ["billing-invoices"],
    queryFn: getInvoices,
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        読み込み中
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        請求履歴を取得できませんでした。
      </div>
    )
  }

  if (!data?.invoices.length) {
    return (
      <div className="rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        請求履歴はまだありません。
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border">
      {data.invoices.map((invoice) => {
        const invoiceUrl = invoice.hostedInvoiceUrl ?? invoice.invoicePdf

        return (
          <div
            className="flex items-center justify-between gap-4 border-b px-5 py-4 last:border-b-0"
            key={invoice.id}
          >
            <div className="min-w-0 space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium">
                <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
                <span className="truncate">{invoice.number ?? "請求書"}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatInvoiceDate(invoice.created)} ・{" "}
                {formatInvoiceStatus(invoice.status)}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-medium">
                {formatInvoiceAmount(invoice.amountPaid, invoice.currency)}
              </span>
              {invoiceUrl && (
                <Button
                  onClick={() => {
                    window.open(invoiceUrl, "_blank", "noopener,noreferrer")
                  }}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  <ArrowUpRightIcon />
                  表示
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
