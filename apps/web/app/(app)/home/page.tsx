import { Suspense } from "react"
import { GallerySkeleton } from "@/components/gallary"
import LogoIcon from "@/components/logo-icon"
import { CheckoutToast } from "./checkout-toast"
import { PromptSection } from "./prompt-section"
import { ProjectList } from "./project-list"

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
      <div className="pt-36 pb-24 md:px-5 max-w-200 mx-auto">
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
