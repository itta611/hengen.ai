"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

export function CheckoutToast({ checkout }: { checkout?: string }) {
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
        toast.success("支払いに成功しました。")
      } else {
        toast.error("支払いに失敗しました。")
      }
      window.history.replaceState(window.history.state, "", "/home")
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [checkout])

  return null
}
