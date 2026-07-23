import { SparklesIcon } from "lucide-react"

function FeatureItem() {
  return (
    <div className="flex items-center gap-6">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background">
        <SparklesIcon className="size-8.5 text-primary" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">手軽な資料作成</h3>
        <p>
          文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。
        </p>
      </div>
    </div>
  )
}

export function Features2() {
  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-3xl font-bold">特長</h2>
      <div className="mt-16 grid gap-x-16 gap-y-16 md:grid-cols-2">
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
        <FeatureItem />
      </div>
    </div>
  )
}
