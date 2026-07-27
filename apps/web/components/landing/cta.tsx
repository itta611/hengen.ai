"use client"

import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export function CtaSection() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="px-5 py-20 max-w-300 mx-auto">
      {/* 円形グラデーション */}
      <div className="text-center overflow-hidden rounded-3xl bg-indigo-500 py-16 text-white px-12">
        <h2 className="mt-5 font-bold tracking-tight text-4xl">
          いつでも直せる資料画像を生成
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 sm:text-base">
          無料で始められます。まずは4枚までの生成をお試し。
        </p>
        <Button
          className="mt-10 bg-white! text-indigo-500 hover:bg-white/80!"
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
