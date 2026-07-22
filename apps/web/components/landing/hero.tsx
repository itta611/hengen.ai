"use client"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export function LandingHero() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col px-10 text-center">
      <div className="flex flex-col items-center py-36">
        <h1 className="text-4xl font-bold leading-normal font-features-['palt'] tracking-wide sm:text-6xl">
          生成して終わりだったAI画像を
          <br />
          <span className="text-primary">自由に編集できる形に。</span>
        </h1>
        <p className="mt-8 text-base text-muted-foreground sm:text-lg">
          ワークフローを分断しません。チャットひとつでパターンだしからUI作成まで。
          <br />
          Figmaを開いたその瞬間から、クリエイティブな作業に集中できます。
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-2">
          <Button onClick={() => openAuthDialog()} size="xl">
            今すぐ始める
          </Button>
          <Button onClick={() => openAuthDialog()} size="xl" variant="outline">
            料金プランを見る
          </Button>
        </div>
      </div>
    </div>
  )
}
