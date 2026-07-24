"use client"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { ArrowRightIcon } from "lucide-react"

export function HeroSection() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col px-10 text-center">
      <div className="flex flex-col items-center py-36">
        <h1 className="text-4xl font-bold leading-normal font-features-['palt'] tracking-wide sm:text-6xl">
          生成して終わりじゃない。
          <br />
          <span className="text-primary">作り直さず、即座に修正。</span>
        </h1>
        <p className="mt-8 text-base text-muted-foreground sm:text-lg">
          Mutarは、資料作成に特化したAI画像生成ツールです。
          <br />
          ビジネスなどの多様なシーンで、実用に耐える資料画像を生成します。
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Button onClick={() => openAuthDialog()} size="xl">
            無料ではじめる
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
