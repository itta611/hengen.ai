"use client"

import { ArrowUpRightIcon, FileTextIcon, Loader2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { toast } from "sonner"

import { usePricingDialog } from "@/components/pricing-dialog"
import { Button } from "@/components/ui/button"
import { useCurrentPlan } from "@/hooks/use-current-plan"
import { apiClient } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import { SettingSection } from "./setting-section"
import { UsageCard } from "./usage-card"

const zeroDecimalCurrencies = new Set([
  "bif",
  "clp",
  "djf",
  "gnf",
  "jpy",
  "kmf",
  "krw",
  "mga",
  "pyg",
  "rwf",
  "ugx",
  "vnd",
  "vuv",
  "xaf",
  "xof",
  "xpf",
])

async function getInvoices() {
  const response = await apiClient.billing.invoices.$get()

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return response.json()
}

async function getSubscription() {
  const response = await apiClient.billing.subscription.$get()

  if (!response.ok) {
    throw new Error("request_failed")
  }

  return response.json()
}

function formatInvoiceAmount(amount: number, currency: string) {
  const normalizedCurrency = currency.toLowerCase()
  const value = zeroDecimalCurrencies.has(normalizedCurrency)
    ? amount
    : amount / 100

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

export function BillingSettingsPage() {
  const pricingDialog = usePricingDialog()
  const [openingPortalAction, setOpeningPortalAction] = useState<
    "billing" | "cancel" | "restore" | null
  >(null)
  const { data: plan } = useCurrentPlan()
  const isPaidPlan = plan === "basic" || plan === "premium"
  const canUpgrade = plan === "free" || plan === "basic"
  const subscriptionQuery = useQuery({
    enabled: isPaidPlan,
    queryKey: ["billing-subscription"],
    queryFn: getSubscription,
  })
  const isPendingCancellation = isSubscriptionPendingCancellation(
    subscriptionQuery.data?.subscription
  )
  const subscriptionEndsAt = getSubscriptionEndsAt(
    subscriptionQuery.data?.subscription
  )

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
      const response = await apiClient.billing.subscription.cancel.$post()

      if (!response.ok) {
        toast.error("解約できませんでした。")
        setOpeningPortalAction(null)
        return
      }

      const result = await response.json()
      const endsAt = result.endsAt
        ? formatInvoiceDateFromIso(result.endsAt)
        : null

      toast.success(
        endsAt
          ? `${endsAt} まで現在のプランを利用できます。`
          : "解約を受け付けました。"
      )
      await subscriptionQuery.refetch()
      setOpeningPortalAction(null)
    } catch {
      toast.error("解約できませんでした。")
      setOpeningPortalAction(null)
    }
  }

  const handleRestoreSubscription = async () => {
    setOpeningPortalAction("restore")

    try {
      const response = await apiClient.billing.subscription.restore.$post()

      if (!response.ok) {
        toast.error("プランを再開できませんでした。")
        setOpeningPortalAction(null)
        return
      }

      await subscriptionQuery.refetch()
      toast.success("プランを再開しました。")
      setOpeningPortalAction(null)
    } catch {
      toast.error("プランを再開できませんでした。")
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
              支払い方法
            </Button>
          )}
        </div>
      </SettingSection>

      {isPaidPlan && (
        <SettingSection title="請求履歴">
          <InvoiceHistory />
        </SettingSection>
      )}

      {isPaidPlan && (
        <SettingSection
          title={isPendingCancellation ? "プラン再開" : "解約"}
          description={
            isPendingCancellation && subscriptionEndsAt
              ? `${subscriptionEndsAt} まで現在のプランを利用できます。`
              : "現在の請求期間の終了時に、契約を解約します。"
          }
        >
          <Button
            disabled={
              openingPortalAction !== null || subscriptionQuery.isLoading
            }
            onClick={
              isPendingCancellation
                ? handleRestoreSubscription
                : handleCancelSubscription
            }
            variant={isPendingCancellation ? "default" : "destructive"}
          >
            {(openingPortalAction === "cancel" ||
              openingPortalAction === "restore") && (
              <Loader2 className="animate-spin" />
            )}
            {isPendingCancellation ? "プランを再開" : "解約する"}
          </Button>
        </SettingSection>
      )}
    </div>
  )
}

function getSubscriptionEndsAt(
  subscription:
    | {
        cancelAt: string | null
        periodEnd: string | null
      }
    | null
    | undefined
) {
  const endsAt = subscription?.cancelAt ?? subscription?.periodEnd

  return endsAt ? formatInvoiceDateFromIso(endsAt) : null
}

function isSubscriptionPendingCancellation(
  subscription:
    | {
        cancelAt: string | null
        cancelAtPeriodEnd: boolean
        periodEnd: string | null
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

function formatInvoiceDateFromIso(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
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
