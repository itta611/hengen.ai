"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export function LandingHeader() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <nav className="px-5">
      <div className="flex items-center justify-between py-4 mx-auto max-w-300">
        <Logo height={30} />
        <div className="hidden items-center gap-8 md:flex">
          <a href="#workflow">使い方</a>
          <a href="#advantages">特長</a>
          <a href="#editing">編集例</a>
          <a href="#use-cases">ユースケース</a>
        </div>
        <Button onClick={() => openAuthDialog()} size="lg">
          Mutarにログイン
        </Button>
      </div>
    </nav>
  )
}
