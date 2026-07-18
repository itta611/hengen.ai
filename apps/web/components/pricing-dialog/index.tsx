"use client"

import { useQueryClient } from "@tanstack/react-query"
import { CheckIcon, Loader2 } from "lucide-react"
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBillingSubscription } from "@/hooks/use-billing-subscription"
import { type UserPlan, useCurrentPlan } from "@/hooks/use-current-plan"
import { apiClient } from "@/lib/api-client"
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
  const { data: sessionPlan } = useCurrentPlan()
  const isPaidPlan = sessionPlan === "basic" || sessionPlan === "premium"
  const subscriptionQuery = useBillingSubscription(isPaidPlan)
  const currentPlan =
    isPaidPlan && subscriptionQuery.isPending
      ? undefined
      : (subscriptionQuery.data?.subscription?.plan ?? sessionPlan)

  const open = useCallback(() => {
    setOpen(true)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      close,
      isOpen,
      open,
      setOpen,
    }),
    [close, isOpen, open]
  )

  return (
    <PricingDialogContext.Provider value={value}>
      {children}
      <PricingDialog
        currentPlan={currentPlan}
        isPlanLoading={isPaidPlan && subscriptionQuery.isPending}
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
  isPlanLoading,
}: {
  currentPlan: UserPlan | undefined
  isPlanLoading: boolean
}) {
  const { isOpen, setOpen } = usePricingDialog()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[680px]! w-[90%] gap-0 overflow-y-auto rounded-3xl p-8!">
        <div className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-normal">
            プランを選択
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            プランを選択してください。
          </DialogDescription>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PlanCard
            currentPlan={currentPlan}
            isPlanLoading={isPlanLoading}
            plan="basic"
            name="ベーシック"
            price="3000"
            credits="240"
          />
          <PlanCard
            currentPlan={currentPlan}
            isPlanLoading={isPlanLoading}
            plan="premium"
            name="プレミアム"
            price="9000"
            credits="720"
          />
        </div>

        <div className="mt-6 text-center">
          <a
            className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:opacity-80"
            href="/specified"
          >
            特定商取引に関する表示
          </a>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function FeatureItem({ children }: { children: ReactNode }) {
  return (
    <li className="flex items-center gap-2 text-base font-medium text-muted-foreground sm:text-lg">
      <CheckIcon className="size-6 shrink-0 text-primary" />
      <span className="text-sm">{children}</span>
    </li>
  )
}

function PlanCard({
  currentPlan,
  isPlanLoading,
  plan,
  name,
  price,
  credits,
}: {
  currentPlan: UserPlan | undefined
  isPlanLoading: boolean
  plan: PricingPlan
  name: string
  price: string
  credits: string
}) {
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
      if (isDowngrade) {
        const succeeded = await downgradeToBasic()

        if (!succeeded) {
          toast.error("プランを変更できませんでした。")
          setIsRedirecting(false)
          return
        }

        await queryClient.invalidateQueries({
          queryKey: ["billing-subscription"],
        })
        close()
        toast.success("ベーシックプランにダウングレードしました")
        setIsRedirecting(false)
        return
      }

      const url =
        currentPlan === "basic" && plan === "premium"
          ? await upgradeToPremium()
          : await startSubscriptionCheckout(plan)

      if (!url) {
        toast.error("決済ページを開けませんでした。")
        setIsRedirecting(false)
        return
      }

      window.location.assign(url)
    } catch {
      toast.error("決済ページを開けませんでした。")
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
        <span className="text-lg text-muted-foreground">/月</span>
      </div>

      <ul className="mt-4 space-y-2">
        <FeatureItem>{`月あたり${credits}クレジット付与`}</FeatureItem>
        <FeatureItem>画像編集機能</FeatureItem>
        <FeatureItem>商用利用可能</FeatureItem>
        <FeatureItem>
          <a
            href="httpps://x.com/IttaFunahashi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4"
          >
            開発者
          </a>
          を{plan === "premium" && "さらに"}応援
        </FeatureItem>
      </ul>

      <Button
        disabled={isPlanLoading || isCurrentPlan || isRedirecting}
        onClick={handleStartCheckout}
        type="button"
        size="lg"
        className="w-full shadow shadow-primary/10 mt-4"
      >
        {isCurrentPlan && <CheckIcon />}
        {isRedirecting && <Loader2 className="animate-spin" />}
        {isCurrentPlan
          ? "現在のプラン"
          : isDowngrade
            ? "ダウングレードする"
            : `${name}プランを開始`}
      </Button>
    </div>
  )
}

async function upgradeToPremium() {
  const response = await apiClient.billing.subscription.upgrade.$post()

  if (!response.ok) {
    return
  }

  const result = await response.json()
  return result.url
}

async function downgradeToBasic() {
  const result = await authClient.subscription.upgrade({
    plan: "basic",
    successUrl: "/home?checkout=success",
    cancelUrl: "/home?checkout=cancel",
    returnUrl: "/home",
    scheduleAtPeriodEnd: true,
    disableRedirect: true,
  })

  return !result.error
}

async function startSubscriptionCheckout(plan: PricingPlan) {
  const result = await authClient.subscription.upgrade({
    plan,
    successUrl: "/home?checkout=success",
    cancelUrl: "/home?checkout=cancel",
    returnUrl: "/home",
    disableRedirect: true,
  })

  return result.error ? undefined : result.data?.url
}

export { PricingDialogProvider, usePricingDialog }
