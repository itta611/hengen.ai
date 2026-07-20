"use client"

import Aurora from "@/components/Aurora"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

const auroraColorStops = ["#605FFF", "#605FFF", "#605FFF"]

export function LandingHero() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <>
      <div className="mx-auto flex w-full max-w-300 flex-col px-5 text-center">
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
            <Button
              onClick={() => openAuthDialog()}
              size="xl"
              variant="outline"
            >
              料金プランを見る
            </Button>
          </div>
        </div>
      </div>

      <div className="relative mt-10 pb-22">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-30 bottom-0 z-10 flex -scale-y-100 flex-col-reverse"
        >
          <div className="z-30 h-60">
            <Aurora
              colorStops={auroraColorStops}
              blend={0.8}
              amplitude={1}
              speed={0.6}
            />
          </div>
          <div className="grow bg-[#605FFF] shadow-[0_40px_40px_40px_var(--primary)]" />
        </div>
        <div className="relative z-20 mx-auto w-full max-w-300 px-10">
          <div className="aspect-video rounded-3xl bg-white outline-16 outline-white/20" />
        </div>
      </div>
    </>
  )
}
