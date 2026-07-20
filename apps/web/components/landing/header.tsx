"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export function LandingHeader() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <nav className="mx-auto max-w-300">
      <div className="flex items-center justify-between py-4">
        <Logo height={30} />
        <div className="hidden items-center gap-8 md:flex">
          <a href="#features">特長</a>
          <a href="#how-it-works">使い方</a>
          <a href="#pricing">価格</a>
          <a href="#testimonials">レビュー</a>
        </div>
        <Button onClick={() => openAuthDialog()} size="lg">
          Mutarにログイン
        </Button>
      </div>
    </nav>
  )
}
