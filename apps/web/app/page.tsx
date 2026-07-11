"use client"

import LogoIcon from "@/components/logo-icon"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"

export default function Page() {
  const { openAuthDialog } = useAuthDialog()
  return (
    <div className="flex flex-col space-y-8 min-h-dvh w-full items-center justify-center">
      <LogoIcon className="saturate-0 opacity-20 size-12" />
      <Button onClick={() => openAuthDialog()} size="lg">
        Mutarにログイン
      </Button>
    </div>
  )
}

// "use client"

// import {
//   ArrowDownIcon,
//   FileTextIcon,
//   Layers2Icon,
//   PencilLineIcon,
//   SparklesIcon,
// } from "lucide-react"
// import Image from "next/image"
// import type { ComponentType, ReactNode } from "react"

// import { Logo } from "@/components/logo"
// import LogoIcon from "@/components/logo-icon"
// import { PromptInput } from "@/components/prompt-input"
// import { Button } from "@/components/ui/button"
// import { useAuthDialog } from "@/hooks/use-auth-dialog"
// import { Providers } from "./(app)/providers"

// function FeatureCard({
//   children,
//   icon: Icon,
//   image,
//   title,
// }: {
//   children: ReactNode
//   icon: ComponentType<{ className?: string }>
//   image: string
//   title: string
// }) {
//   return (
//     <article>
//       <div className="overflow-hidden rounded-[28px] border bg-background p-2 shadow-sm">
//         <Image
//           src={image}
//           alt=""
//           width={720}
//           height={500}
//           className="aspect-[1.62] rounded-[22px] object-cover"
//         />
//       </div>
//       <div className="mt-5 flex items-start gap-3">
//         <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
//           <Icon className="size-5" />
//         </div>
//         <div>
//           <h3 className="text-xl font-bold">{title}</h3>
//           <p className="mt-2 leading-7 text-muted-foreground">{children}</p>
//         </div>
//       </div>
//     </article>
//   )
// }

// function StepCard({
//   children,
//   number,
// }: {
//   children: ReactNode
//   number: number
// }) {
//   return (
//     <div className="rounded-[24px] border bg-background p-5 shadow-sm">
//       <div className="mb-7 flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
//         {number}
//       </div>
//       <p className="text-lg font-bold leading-7">{children}</p>
//     </div>
//   )
// }

// function FaqCard({
//   children,
//   question,
// }: {
//   children: ReactNode
//   question: string
// }) {
//   return (
//     <article className="rounded-[24px] border bg-background p-6 shadow-sm">
//       <h3 className="text-lg font-bold leading-7">{question}</h3>
//       <p className="mt-3 leading-7 text-muted-foreground">{children}</p>
//     </article>
//   )
// }

// export default function Page() {
//   const { openAuthDialog } = useAuthDialog()

//   return (
//     <main className="min-h-dvh w-full flex-1 bg-transparent text-zinc-900">
//       <header className="flex h-16 items-center justify-between border-b bg-white px-4 sm:px-6">
//         <Logo className="h-7 w-26" />
//         <Button type="button" size="lg" onClick={() => openAuthDialog()}>
//           ログイン・新規登録
//         </Button>
//       </header>

//       <section className="flex min-h-[calc(100dvh-4rem)] flex-col items-center px-4 pt-10 pb-16 sm:px-6 md:pt-16">
//         <div className="mb-5 flex size-20 items-center justify-center rounded-[24px] bg-white shadow-sm ring-1 ring-black/5">
//           <LogoIcon className="size-12" />
//         </div>

//         <h1 className="text-center font-[var(--font-display)] text-5xl font-bold leading-none sm:text-6xl">
//           Mutar!?
//         </h1>
//         <p className="mt-4 text-center text-xl font-bold text-muted-foreground">
//           AI画像生成を、あとから直せる資料画像へ。
//         </p>

//         <div className="mt-9 flex flex-col items-center text-center text-base font-bold text-primary">
//           <span>ログインせずにプロンプトを書いて試す</span>
//           <ArrowDownIcon className="mt-1 size-7 stroke-[2.5]" />
//         </div>

//         <div className="mt-4 w-full max-w-200">
//           <Providers>
//             <PromptInput />
//           </Providers>
//         </div>
//       </section>

//       <section className="border-t bg-muted/40 px-4 py-20 sm:px-6 md:py-28">
//         <div className="mx-auto max-w-185">
//           <h2 className="text-center text-3xl font-bold leading-tight sm:text-5xl">
//             生成したあとも、
//             <span className="rounded-xl bg-primary/15 px-2 text-primary">
//               直せる
//             </span>
//             画像を。
//           </h2>
//           <div className="mt-12 grid gap-8 md:grid-cols-2">
//             <FeatureCard
//               icon={SparklesIcon}
//               image="/project-sample-2.png"
//               title="文章から完成案を生成"
//             >
//               投稿、広告、資料に使える見出し付きの画像を、自然文からまとめて作成できます。
//             </FeatureCard>
//             <FeatureCard
//               icon={FileTextIcon}
//               image="/project-sample-3.png"
//               title="資料向けの構成に強い"
//             >
//               ロードマップ、比較表、GTM計画など、説明が必要な画像も1枚に整理します。
//             </FeatureCard>
//             <FeatureCard
//               icon={PencilLineIcon}
//               image="/project-sample-4.png"
//               title="あとから文字を編集"
//             >
//               生成後にテキストを選んで直せるので、最後の言い回し調整で作り直しません。
//             </FeatureCard>
//             <FeatureCard
//               icon={Layers2Icon}
//               image="/project-sample-1.png"
//               title="複数案を並べて検討"
//             >
//               枚数、比率、スタイルを選んで、同じ目的に対する複数案をすぐ比較できます。
//             </FeatureCard>
//           </div>
//         </div>
//       </section>

//       <section className="border-t bg-background px-4 py-20 sm:px-6 md:py-28">
//         <div className="mx-auto max-w-185">
//           <h2 className="text-center text-3xl font-bold leading-tight sm:text-5xl">
//             プロンプトから公開前の修正まで、
//             <span className="rounded-xl bg-primary/15 px-2 text-primary">
//               同じ流れ
//             </span>
//             で。
//           </h2>
//           <div className="mt-12 grid gap-4 md:grid-cols-4">
//             <StepCard number={1}>作りたい画像を自然文で書く</StepCard>
//             <StepCard number={2}>比率や枚数、スタイルを選ぶ</StepCard>
//             <StepCard number={3}>
//               ログイン後、入力内容を引き継いで生成
//             </StepCard>
//             <StepCard number={4}>
//               生成した画像の文字を編集して仕上げる
//             </StepCard>
//           </div>
//         </div>
//       </section>

//       <section className="border-t bg-muted/40 px-4 py-20 sm:px-6 md:py-28">
//         <div className="mx-auto max-w-185">
//           <h2 className="text-center text-3xl font-bold sm:text-5xl">FAQs</h2>
//           <div className="mt-10 grid gap-4 md:grid-cols-3">
//             <FaqCard question="ログイン前に生成ボタンを押すと生成されますか？">
//               押しません。ログインダイアログが開くだけで、ログイン後にもう一度生成できます。
//             </FaqCard>
//             <FaqCard question="ログイン前の入力内容はどう引き継がれますか？">
//               プロンプトだけをURLで引き継ぎます。枚数や比率などの設定はCookieに保存します。
//             </FaqCard>
//             <FaqCard question="どんな画像に向いていますか？">
//               SNS投稿、広告バナー、記事アイキャッチ、ロードマップ、比較表、ピッチ資料などを想定しています。
//             </FaqCard>
//           </div>
//         </div>
//       </section>

//       <section className="border-t bg-background px-4 py-16 sm:px-6">
//         <div className="mx-auto flex max-w-185 flex-col items-center rounded-[32px] border bg-muted/40 px-6 py-12 text-center">
//           <LogoIcon className="size-12" />
//           <h2 className="mt-5 text-3xl font-bold leading-tight sm:text-5xl">
//             まずは1枚、作ってみる。
//           </h2>
//           <p className="mt-4 max-w-120 leading-7 text-muted-foreground">
//             生成ボタンを押すとログイン画面が開きます。ログイン後、入力したプロンプトから続きを始められます。
//           </p>
//           <Button
//             type="button"
//             size="lg"
//             className="mt-8 rounded-full px-7"
//             onClick={() => openAuthDialog()}
//           >
//             Start for free
//           </Button>
//         </div>
//       </section>

//       <footer className="border-t bg-background px-4 py-8 sm:px-6">
//         <div className="mx-auto flex max-w-185 flex-col gap-5 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
//           <Logo className="h-7 w-26" />
//           <nav className="flex flex-wrap gap-4">
//             <a className="hover:text-foreground" href="/terms">
//               Terms
//             </a>
//             <a className="hover:text-foreground" href="/privacy">
//               Privacy
//             </a>
//             <span>© Mutar</span>
//           </nav>
//         </div>
//       </footer>
//     </main>
//   )
// }
