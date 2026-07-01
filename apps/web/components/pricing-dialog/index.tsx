"use client"

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react"
import { CheckIcon, Loader2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { apiClient } from "@/lib/api-client"

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
      <PricingDialog />
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

function PricingDialog() {
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
            plan="basic"
            name="ベーシック"
            price="3000"
            features={[
              "月あたり300クレジット付与",
              "画像編集機能",
              "画像編集機能",
              "商用利用可能",
            ]}
          />
          <PlanCard
            plan="premium"
            name="プレミアム"
            price="9000"
            features={[
              "月あたり900クレジット付与",
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
  plan,
  name,
  price,
  features,
}: {
  plan: PricingPlan
  name: string
  price: string
  features: string[]
}) {
  const [isRedirecting, setIsRedirecting] = useState(false)

  const handleStartCheckout = async () => {
    setIsRedirecting(true)

    try {
      const response = await apiClient.checkout.sessions.$post({
        json: {
          lookup_key: plan,
        },
      })

      if (!response.ok) {
        toast.error("決済ページを開けませんでした。")
        return
      }

      const { url } = await response.json()

      if (!url) {
        toast.error("決済ページを開けませんでした。")
        return
      }

      window.location.assign(url)
    } catch {
      toast.error("決済ページを開けませんでした。")
    } finally {
      setIsRedirecting(false)
    }
  }

  return (
    <div className="rounded-3xl border-[8px] border-indigo-50/80 dark:border-indigo-950 bg-background dark:bg-white/5 p-4 shadow-lg/5">
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
        disabled={isRedirecting}
        onClick={handleStartCheckout}
        type="button"
        size="lg"
        className="w-full shadow shadow-primary/10 mt-4"
      >
        {isRedirecting && <Loader2 className="animate-spin" />}
        {`${name}プランを開始`}
      </Button>
    </div>
  )
}

export { PricingDialogProvider, usePricingDialog }
