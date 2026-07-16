import { Suspense } from "react"
import { GallerySkeleton } from "@/components/gallary"
import LogoIcon from "@/components/logo-icon"
import { CheckoutToast } from "./checkout-toast"
import { PromptSection } from "./prompt-section"
import { ProjectList } from "./project-list"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import Image from "next/image"

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
      <div className="pt-20 pb-20 md:px-5 max-w-200 mx-auto">
        <Tabs>
          <TabsList className="h-10! rounded-lg mx-auto">
            <TabsTrigger className="px-3 rounded-md" value="generate">
              資料を生成
            </TabsTrigger>
            <TabsTrigger className="px-3 rounded-md" value="edit">
              画像を読み込む
            </TabsTrigger>
          </TabsList>
          <TabsContent className="mt-6" value="generate">
            <div className="flex mx-auto mb-6 px-1.5 items-center gap-3">
              <LogoIcon width={30} />
              <div className="text-balance text-xl">何を作りますか？</div>
            </div>
            <PromptSection initialPrompt={initialPrompt ?? ""} />
          </TabsContent>
          <TabsContent className="mt-6" value="edit">
            <div className="max-w-80 mx-auto flex flex-col items-end">
              <Image
                src="/image-upload.png"
                alt=""
                className="w-full dark:hidden"
                width={255}
                height={151}
              />
              <Image
                src="/image-upload-dark.png"
                alt=""
                className="hidden w-full dark:block"
                width={255}
                height={151}
              />
              <div className="text-sm text-center w-full text-muted-foreground mt-4">
                ChatGPT等の外部サービスで生成した
                <br />
                画像をアップロードします
              </div>
              <button
                className="mt-6 border-dashed p-3 flex items-center justify-center gap-4 border w-full rounded-lg cursor-pointer active:scale-98 transition"
                type="button"
              >
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <PlusIcon className="w-6 h-6 text-muted-foreground" />
                </div>
                <div className="flex flex-col text-left text-sm gap-0.5">
                  <div className="text-primary font-bold">画像を追加</div>
                  <div className="text-muted-foreground">
                    PNG, JPG, WebP形式
                  </div>
                </div>
              </button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <h1 className="py-10 text-2xl font-bold pl-1">最近</h1>
      <Suspense fallback={<GallerySkeleton />}>
        <ProjectList />
      </Suspense>
    </div>
  )
}
