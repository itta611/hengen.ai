"use client"

import Aurora from "@/components/Aurora"
import { Logo } from "@/components/logo"
import { PromptInput } from "@/components/prompt-input"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { Providers } from "./(app)/providers"

const auroraColorStops = ["#605FFF", "#605FFF", "#605FFF"]

export default function Page() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="w-full dark:bg-zinc-900">
      <div className="text-center w-[1300px] px-5 mx-auto flex flex-col">
        <div className="py-4 flex items-center justify-between">
          <Logo height={30} />
          <div className="flex gap-8 items-center">
            <a href="#features">特長</a>
            <a href="#how-it-works">使い方</a>
            <a href="#pricing">価格</a>
            <a href="#testimonials">レビュー</a>
          </div>
          <Button onClick={() => openAuthDialog()} size="lg">
            Mutarにログイン
          </Button>
        </div>
        <div className="py-36 flex flex-col items-center">
          <h2 className="text-6xl font-bold leading-normal text-shadow-lg text-shadow-black/2 font-features-['palt'] tracking-wide">
            生成して終わりだったAI画像、
            <br />
            <span className="text-primary">自由に編集できる形に。</span>
          </h2>
          <h2 className="text-lg text-muted-foreground mt-8">
            ワークフローを分断しません。チャットひとつでパターンだしからUI作成まで。
            <br />
            Figmaを開いたその瞬間から、クリエイティブな作業に集中できます。
          </h2>
          <div className="mt-8 flex gap-2">
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
      <div className="relative mt-10">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-30 bottom-0 -scale-y-100 -z-10 flex flex-col-reverse"
        >
          <div className="h-60">
            <Aurora
              colorStops={auroraColorStops}
              blend={0.8}
              amplitude={1}
              speed={0.6}
            />
          </div>
          <div className="bg-primary grow shadow-[0_5px_40px_40px_var(--primary)]"></div>
        </div>
        <div className="w-[1300px] mx-auto">
          <div className="mx-20 aspect-video bg-white outline-[16px] outline-white/10 rounded-3xl"></div>
        </div>
      </div>
    </div>
  )
}
