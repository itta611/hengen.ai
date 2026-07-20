"use client"

import Aurora from "@/components/Aurora"
import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

const auroraColorStops = ["#605FFF", "#605FFF", "#605FFF"]

export default function Page() {
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="w-full bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-325 flex-col px-5 text-center">
        <div className="py-4 flex items-center justify-between">
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
        <div className="py-36 flex flex-col items-center">
          <h2 className="text-4xl font-bold leading-normal font-features-['palt'] tracking-wide sm:text-6xl">
            生成して終わりだったAI画像を
            <br />
            <span className="text-primary">自由に編集できる形に。</span>
          </h2>
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
      <div className="relative mt-10 pb-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 -top-30 bottom-0 -scale-y-100 z-10 flex flex-col-reverse"
        >
          <div className="h-60 z-30">
            <Aurora
              colorStops={auroraColorStops}
              blend={0.8}
              amplitude={1}
              speed={0.6}
            />
          </div>
          <div className="bg-[#605FFF] grow shadow-[0_40px_40px_0px_var(--primary)] translate-y-px"></div>
        </div>
        <div className="mx-auto w-full max-w-325 px-20 relative z-20">
          <div className="aspect-video rounded-3xl bg-white outline-16 outline-white/20"></div>
        </div>
      </div>
      <footer className="bg-background">
        <div className="mx-auto flex w-full max-w-325 flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
          <Logo className="h-7 w-26 saturate-0 brightness-0 opacity-30" />
          <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
            <a
              className="transition-colors hover:text-foreground"
              href="/terms"
            >
              利用規約
            </a>
            <a
              className="transition-colors hover:text-foreground"
              href="/privacy"
            >
              プライバシーポリシー
            </a>
            <span>
              © 2026, <a href="https://x.com/IttaFunahashi">Itta Funahashi</a>
            </span>
          </nav>
        </div>
      </footer>
    </div>
  )
}
