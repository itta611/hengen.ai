"use client"

import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export function LandingCta() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="px-5 py-20 max-w-300 mx-auto">
      <div className="text-center overflow-hidden rounded-3xl bg-primary py-16 text-primary-foreground px-12">
        <h2 className="mt-5 font-bold tracking-tight text-4xl">
          編集できるAI画像を、今すぐ。
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 sm:text-base">
          資料づくりも、デザインの再現も、チャットから。
          <br className="hidden sm:block" />
          生成した文字やレイアウトまで、自由に整えられます。
        </p>
        <Button
          className="mt-10 text-primary"
          onClick={() => openAuthDialog()}
          size="xl"
          variant="secondary"
        >
          無料で始める
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
