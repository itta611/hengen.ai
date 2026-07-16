"use client"

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
import { type UserPlan, useCurrentPlan } from "@/hooks/use-current-plan"
import { authClient } from "@/lib/auth-client"

type PricingPlan = "basic" | "premium"
type StripeSubscriptionStatus = "active" | "trialing"

type PricingDialogContextValue = {
  close: () => void
  isOpen: boolean
  open: () => void
  setOpen: (open: boolean) => void
}

const PricingDialogContext = createContext<PricingDialogContextValue | null>(
  null
)

function isActiveSubscription(
  status: string
): status is StripeSubscriptionStatus {
  return status === "active" || status === "trialing"
}

function PricingDialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false)
  const { data: currentPlan } = useCurrentPlan()

  const open = useCallback(() => {
    if (currentPlan === "premium") {
      return
    }

    setOpen(true)
  }, [currentPlan])

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
      <PricingDialog currentPlan={currentPlan} />
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

function PricingDialog({ currentPlan }: { currentPlan: UserPlan }) {
  const { isOpen, setOpen } = usePricingDialog()

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] max-w-[680px]! w-[90%] gap-0 overflow-y-auto rounded-3xl p-8!">
        <div className="space-y-3">
          <DialogTitle className="text-2xl font-bold tracking-normal">
            プランをアップグレード
          </DialogTitle>
          <DialogDescription className="text-base text-muted-foreground">
            プランを選択してください。
          </DialogDescription>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <PlanCard
            currentPlan={currentPlan}
            plan="basic"
            name="ベーシック"
            price="3000"
            features={[
              "月あたり240クレジット付与",
              "画像編集機能",
              "画像編集機能",
              "商用利用可能",
            ]}
          />
          <PlanCard
            currentPlan={currentPlan}
            plan="premium"
            name="プレミアム"
            price="9000"
            features={[
              "月あたり720クレジット付与",
              "画像編集機能",
              "画像編集機能",
              "商用利用可能",
            ]}
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

function PlanCard({
  currentPlan,
  plan,
  name,
  price,
  features,
}: {
  currentPlan: UserPlan
  plan: PricingPlan
  name: string
  price: string
  features: string[]
}) {
  const [isRedirecting, setIsRedirecting] = useState(false)
  const isCurrentPlan = currentPlan === plan

  const handleStartCheckout = async () => {
    if (isCurrentPlan) {
      return
    }

    setIsRedirecting(true)

    try {
      const subscriptionId =
        currentPlan === "free" ? undefined : await getActiveSubscriptionId()

      if (currentPlan !== "free" && !subscriptionId) {
        toast.error("現在の契約情報を確認できませんでした。")
        setIsRedirecting(false)
        return
      }

      const result = await authClient.subscription.upgrade({
        plan,
        ...(subscriptionId ? { subscriptionId } : {}),
        successUrl: "/home?checkout=success",
        cancelUrl: "/home?checkout=cancel",
        returnUrl: "/home",
        disableRedirect: true,
      })

      if (result.error) {
        toast.error("決済ページを開けませんでした。")
        setIsRedirecting(false)
        return
      }

      const url = result.data?.url

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
        {features.map((feature, index) => (
          <li
            className="flex items-center gap-2 text-base font-medium text-muted-foreground sm:text-lg"
            key={`${feature}-${index}`}
          >
            <CheckIcon className="size-6 shrink-0 text-primary" />
            <span className="text-sm">{feature}</span>
          </li>
        ))}
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
        {isCurrentPlan ? "現在のプラン" : `${name}プランを開始`}
      </Button>
    </div>
  )
}

async function getActiveSubscriptionId() {
  const result = await authClient.subscription.list()

  if (result.error) {
    return
  }

  const activeSubscription = result.data?.find((subscription) =>
    isActiveSubscription(subscription.status)
  )

  return activeSubscription?.stripeSubscriptionId ?? undefined
}

export { PricingDialogProvider, usePricingDialog }
