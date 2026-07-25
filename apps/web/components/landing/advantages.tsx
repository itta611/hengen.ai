import {
  ScanTextIcon,
  SparklesIcon,
  TextCursorIcon,
  TypeIcon,
} from "lucide-react"
import type React from "react"

function FeatureItem({
  description,
  title,
  icon: Icon,
}: {
  description: string
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background">
        <Icon className="size-8 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export function AdvantagesSection() {
  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">特長</h2>
      <div className="mt-18 grid gap-x-16 gap-y-16 md:grid-cols-2">
        <FeatureItem
          icon={TextCursorIcon}
          title="テキストを自由に編集"
          description="画像内の文字を自動で検出し、生成時点からテキストを編集できる状態で出力します。"
        />
        <FeatureItem
          icon={SparklesIcon}
          title="高品質な画像生成"
          description="最先端のGPT Image 2モデルで高品質な画像を生成します。"
        />
        <FeatureItem
          icon={ScanTextIcon}
          title="高精度な文字検出"
          description="高精度なOCR技術で、画像内の文字を正確に検出。テキストを位置ズレなく美しく配置します。"
        />
        <FeatureItem
          icon={TypeIcon}
          title="文字の歪みなし"
          description="AI生成画像特有の文字の歪みなしで、フォントで文字を美しく描画します。"
        />
      </div>
    </div>
  )
}
