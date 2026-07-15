import { Suspense } from "react"
import { GallerySkeleton } from "@/components/gallary"
import LogoIcon from "@/components/logo-icon"
import { CheckoutToast } from "./checkout-toast"
import { PromptSection } from "./prompt-section"
import { ProjectList } from "./project-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type PageProps = {
  searchParams: Promise<{
    checkout?: string | string[]
    prompt?: string | string[]
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const { checkout, prompt } = await searchParams
  const checkoutStatus = Array.isArray(checkout) ? checkout[0] : checkout
  const initialPrompt = Array.isArray(prompt) ? prompt[0] : prompt

  return (
    <div className="pb-10 min-h-full sm:px-10 px-5">
      <Suspense fallback={null}>
        <CheckoutToast checkout={checkoutStatus} />
      </Suspense>
      <div className="pt-26 pb-24 md:px-5 max-w-200 mx-auto">
        <div className="flex justify-center mb-6">
          <Tabs>
            <TabsList className="h-10! bg-indigo-50 rounded-lg">
              <TabsTrigger className="px-3 rounded-md" value="generate">
                資料を生成
              </TabsTrigger>
              <TabsTrigger className="px-3 rounded-md" value="edit">
                画像から読み込む
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex mx-auto mb-6 px-1.5 items-center gap-3">
          <LogoIcon width={30} />
          <div className="text-balance text-xl">何を作りますか？</div>
        </div>
        <PromptSection initialPrompt={initialPrompt ?? ""} />
      </div>
      <h1 className="py-10 text-2xl font-bold pl-1">最近</h1>
      <Suspense fallback={<GallerySkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
