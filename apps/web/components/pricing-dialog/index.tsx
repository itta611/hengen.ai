"use client"

import { useQueryClient } from "@tanstack/react-query"
import { CheckIcon, InfoIcon, Loader2 } from "lucide-react"
import { createContext, type ReactNode, useContext, useState } from "react"
import { toast } from "sonner"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBillingSubscription } from "@/hooks/use-billing-subscription"
import type { UserPlan } from "@/hooks/use-current-plan"
import { useTranslation } from "@/i18n/client"
import { authClient } from "@/lib/auth-client"

type PricingPlan = "basic" | "premium"

type PricingDialogContextValue = {
  close: () => void
  isOpen: boolean
  open: () => void
  setOpen: (open: boolean) => void
}

const PricingDialogContext = createContext<PricingDialogContextValue | null>(
  null
)

function PricingDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const subscriptionQuery = useBillingSubscription()
  const currentPlan = subscriptionQuery.isPending
    ? undefined
    : ((subscriptionQuery.data?.plan ?? "free") as UserPlan)

  const open = () => {
    setOpen(true)
    void subscriptionQuery.refetch()
  }

  const close = () => {
    setOpen(false)
  }

  const value = { close, isOpen, open, setOpen }

  return (
    <PricingDialogContext.Provider value={value}>
      {children}
      <PricingDialog
        currentPlan={currentPlan}
        subscriptionId={
          subscriptionQuery.data?.stripeSubscriptionId ?? undefined
        }
      />
    </PricingDialogContext.Provider>
  )
}

function usePricingDialog() {
  const context = useContext(PricingDialogContext)

  if (!context) {
    throw new Error(
      "usePricingDialog must be used within PricingDialogProvider"
    )
  }

  return context
}

function PricingDialog({
  currentPlan,
  subscriptionId,
}: {
  currentPlan: UserPlan | undefined
  subscriptionId: string | undefined
}) {
  const { t } = useTranslation()
  const { isOpen, setOpen } = usePricingDialog()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[740px]! w-[90%] gap-0 overflow-y-auto rounded-3xl p-8!">
        <div className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-normal">
            {t("pricing.title")}
          </DialogTitle>
          {currentPlan !== "basic" && (
            <DialogDescription className="text-base text-muted-foreground">
              {t("pricing.description")}
            </DialogDescription>
          )}
        </div>

        {currentPlan === "basic" && (
          <Alert className="mt-6">
            <InfoIcon />
            <AlertTitle>{t("pricing.upgradeBillingTitle")}</AlertTitle>
            <AlertDescription>
              {t("pricing.upgradeBillingDescription")}
            </AlertDescription>
          </Alert>
        )}

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PlanCard
            currentPlan={currentPlan}
            plan="basic"
            name={t("pricing.basic")}
            price="3000"
            credits="240"
            subscriptionId={subscriptionId}
          />
          <PlanCard
            currentPlan={currentPlan}
            plan="premium"
            name={t("pricing.premium")}
            price="9000"
            credits="720"
            subscriptionId={subscriptionId}
          />
        </div>

        <div className="mt-6 text-center">
          <a
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:opacity-80"
            href="/specified"
          >
            {t("pricing.commercialTransaction")}
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FeatureItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-base font-medium text-muted-foreground sm:text-lg">
      <CheckIcon className="size-5 shrink-0 text-primary" />
      <span className="text-sm">{children}</span>
    </li>
  )
}

function PlanCard({
  currentPlan,
  plan,
  name,
  price,
  credits,
  subscriptionId,
}: {
  currentPlan: UserPlan | undefined
  plan: PricingPlan
  name: string
  price: string
  credits: string
  subscriptionId: string | undefined
}) {
  const { t } = useTranslation()
  const [isRedirecting, setIsRedirecting] = useState(false)
  const { close } = usePricingDialog()
  const queryClient = useQueryClient()
  const isCurrentPlan = currentPlan === plan
  const isDowngrade = currentPlan === "premium" && plan === "basic"

  const handleStartCheckout = async () => {
    if (isCurrentPlan) {
      return
    }

    setIsRedirecting(true)

    try {
      const { data, error } = await authClient.subscription.upgrade({
        plan,
        subscriptionId,
        successUrl: `${window.location.origin}/home?checkout=success`,
        cancelUrl: `${window.location.origin}/home?checkout=cancel`,
        returnUrl: `${window.location.origin}/home`,
        scheduleAtPeriodEnd: isDowngrade,
        disableRedirect: true,
      })

      if (error) {
        await queryClient.invalidateQueries({
          queryKey: ["billing-subscription"],
        })
        toast.error(error.message || t("pricing.changeError"))
        setIsRedirecting(false)
        return
      }

      if (isDowngrade) {
        await queryClient.invalidateQueries({
          queryKey: ["billing-subscription"],
        })
        close()
        toast.success(t("pricing.downgradeSuccess"))
        setIsRedirecting(false)
        return
      }

      if (data?.url) {
        window.location.assign(data.url)
        return
      }

      toast.error(t("pricing.checkoutError"))
      setIsRedirecting(false)
    } catch {
      toast.error(t("pricing.checkoutError"))
      setIsRedirecting(false)
    }
  }

  return (
    <div className="rounded-3xl bg-background dark:bg-white/5 p-4 border border-border/30 shadow-xl/6">
      <div className="text-lg font-bold text-primary">{name}</div>
      <div>
        <span className="text-3xl font-bold mr-1 font-[ui-sans-serif,system-ui,sans-serif]">
          ¥
        </span>
        <span className="text-4xl font-bold mr-1 tracking-tight font-[ui-sans-serif,system-ui,sans-serif]">
          {price}
        </span>
        <span className="text-lg text-muted-foreground">
          {t("pricing.perMonth")}
        </span>
      </div>

      <ul className="mt-4 space-y-2">
        <FeatureItem>{t("pricing.credits", { credits })}</FeatureItem>
        <FeatureItem>{t("pricing.imageEditing")}</FeatureItem>
        <FeatureItem>{t("pricing.svgExport")}</FeatureItem>
        <FeatureItem>{t("pricing.commercialUse")}</FeatureItem>
        <FeatureItem>
          <a
            href="https://x.com/IttaFunahashi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            {plan === "premium"
              ? t("pricing.supportDeveloperMore")
              : t("pricing.supportDeveloper")}
          </a>
        </FeatureItem>
      </ul>

      <Button
        disabled={isCurrentPlan || isRedirecting}
        onClick={handleStartCheckout}
        type="button"
        size="lg"
        className="w-full shadow shadow-primary/10 mt-4"
      >
        {isCurrentPlan && <CheckIcon />}
        {isRedirecting && <Loader2 className="animate-spin" />}
        {isCurrentPlan
          ? t("pricing.current")
          : isDowngrade
            ? t("pricing.downgrade")
            : t("pricing.start", { name })}
      </Button>
    </div>
  )
}

export { PricingDialogProvider, usePricingDialog }
