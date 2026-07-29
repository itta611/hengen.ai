"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"
import { useTranslation } from "@/i18n/client"

export function CheckoutToast({ checkout }: { checkout?: string }) {
  const { t } = useTranslation()
  const hasShownToast = useRef(false)

  useEffect(() => {
    if (
      (checkout !== "success" && checkout !== "cancel") ||
      hasShownToast.current
    ) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      if (hasShownToast.current) {
        return
      }

      hasShownToast.current = true
      if (checkout === "success") {
        toast.success(t("home.checkoutSuccess"))
      }
      window.history.replaceState(window.history.state, "", "/home")
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [checkout, t])

  return null
}
