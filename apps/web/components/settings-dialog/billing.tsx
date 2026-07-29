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
import { useLocale, useTranslation } from "@/i18n/client"
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
  const { t } = useTranslation()
  const { locale } = useLocale()
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
  const subscriptionEndsAt = getSubscriptionEndsAt(subscription, locale)
  const subscriptionId = subscription?.stripeSubscriptionId

  const handleCancelSubscription = async (feedback: CancellationFeedback) => {
    setBillingAction("cancel")

    try {
      const response = await apiClient.billing.subscription.cancel.$post({
        json: { feedback },
      })

      if (!response.ok) {
        toast.error(t("settings.billing.cancelError"))
        await subscriptionQuery.refetch()
        setBillingAction(null)
        return
      }

      const result = await response.json()
      const endsAt = result.endsAt ? formatDate(result.endsAt, locale) : null

      await subscriptionQuery.refetch()
      setCancellationDialogOpen(false)
      toast.success(
        endsAt
          ? t("settings.billing.availableUntil", { date: endsAt })
          : t("settings.billing.cancelAccepted")
      )
      setBillingAction(null)
    } catch {
      toast.error(t("settings.billing.cancelError"))
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
        toast.error(error.message || t("settings.billing.resumeError"))
        await subscriptionQuery.refetch()
        setBillingAction(null)
        return
      }

      await subscriptionQuery.refetch()
      toast.success(successMessage)
      setBillingAction(null)
    } catch {
      toast.error(t("settings.billing.resumeError"))
      setBillingAction(null)
    }
  }

  return (
    <div className="space-y-12">
      <SettingSection title={t("settings.billing.creditUsage")}>
        <UsageCard />
      </SettingSection>

      {isPaidPlan && !isPendingCancellation && (
        <SettingSection title={t("settings.billing.changePlan")}>
          <div className="space-y-3">
            {isPendingDowngrade && subscriptionEndsAt && (
              <Alert>
                <InfoIcon />
                <AlertTitle>
                  {t("settings.billing.premiumUntil", {
                    date: subscriptionEndsAt,
                  })}
                </AlertTitle>
                <AlertDescription>
                  {t("settings.billing.switchesToBasic", {
                    date: subscriptionEndsAt,
                  })}
                </AlertDescription>
              </Alert>
            )}
            {isPendingDowngrade ? (
              <Button
                disabled={billingAction === "downgrade"}
                onClick={() =>
                  handleRestoreSubscription(
                    "downgrade",
                    t("settings.billing.premiumResumeSuccess")
                  )
                }
                variant="outline"
              >
                {billingAction === "downgrade" && (
                  <Loader2 className="animate-spin" />
                )}
                {t("settings.billing.premiumResumeButton")}
              </Button>
            ) : (
              <Button onClick={pricingDialog.open} variant="outline">
                {t("settings.billing.changePlanButton")}
              </Button>
            )}
          </div>
        </SettingSection>
      )}

      {isPaidPlan && isPendingCancellation ? (
        <SettingSection title={t("settings.billing.resumePlan")}>
          <div className="space-y-3">
            {subscriptionEndsAt && (
              <Alert>
                <InfoIcon />
                <AlertTitle>
                  {t("settings.billing.planUntil", {
                    date: subscriptionEndsAt,
                    plan: t(`common.plan.${currentPlan}`),
                  })}
                </AlertTitle>
                <AlertDescription>
                  {t("settings.billing.endsOn", { date: subscriptionEndsAt })}
                </AlertDescription>
              </Alert>
            )}
            <Button
              disabled={billingAction === "restore"}
              onClick={() =>
                handleRestoreSubscription(
                  "restore",
                  t("settings.billing.resumeSuccess")
                )
              }
            >
              {billingAction === "restore" && (
                <Loader2 className="animate-spin" />
              )}
              {t("settings.billing.resumeButton")}
            </Button>
          </div>
        </SettingSection>
      ) : null}

      {isPaidPlan && !isPendingCancellation ? (
        <SettingSection title={t("settings.billing.cancelPlan")}>
          <Button
            onClick={() => setCancellationDialogOpen(true)}
            variant="outline"
          >
            {t("settings.billing.cancelButton")}
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
        <SettingSection title={t("settings.billing.invoiceHistory")}>
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
    | undefined,
  locale: string
) {
  const endsAt = subscription?.cancelAt ?? subscription?.periodEnd

  return endsAt ? formatDate(endsAt, locale) : null
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

function formatDate(value: Date | string, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(value))
}

function formatInvoiceAmount(amount: number, currency: string, locale: string) {
  const normalizedCurrency = currency.toLowerCase()
  const value = normalizedCurrency === "jpy" ? amount : amount / 100

  return new Intl.NumberFormat(locale, {
    currency: currency.toUpperCase(),
    style: "currency",
  }).format(value)
}

function formatInvoiceDate(created: number, locale: string) {
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(created * 1000))
}

function InvoiceHistory() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { data, isError, isLoading } = useQuery({
    queryKey: ["billing-invoices"],
    queryFn: getInvoices,
  })

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        {t("settings.billing.loading")}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        {t("settings.billing.invoiceError")}
      </div>
    )
  }

  if (!data?.invoices.length) {
    return (
      <div className="rounded-xl border px-5 py-4 text-sm text-muted-foreground">
        {t("settings.billing.invoiceEmpty")}
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
                <span className="truncate">
                  {invoice.number ?? t("settings.billing.invoice")}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {formatInvoiceDate(invoice.created, locale)} ・{" "}
                {t(
                  `settings.billing.invoiceStatus.${invoice.status ?? "unknown"}`
                )}
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-medium">
                {formatInvoiceAmount(
                  invoice.amountPaid,
                  invoice.currency,
                  locale
                )}
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
                  {t("common.button.view")}
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
