import { SparklesIcon } from "lucide-react"

function FeatureItem({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background">
        <SparklesIcon className="size-8.5 text-primary" />
      </div>
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export function AdvantagesSection() {
  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">
        生成した文字を、きれいに編集できる形へ。
      </h2>
      <p className="text-base text-center mt-5">
        画像と文字を分けて扱えるから、生成したあとも自由に整えられます。
      </p>
      <div className="mt-16 grid gap-x-16 gap-y-16 md:grid-cols-2">
        <FeatureItem
          description="画像内の文字を自動で検出し、生成した時点から編集できるテキストとして扱えます。"
          title="文字を編集できる状態で生成"
        />
        <FeatureItem
          description="見出しや本文、ラベルを意味のある単位で認識。文章をばらばらにせず編集できます。"
          title="文章のまとまりを保つ"
        />
        <FeatureItem
          description="ゴシック、明朝、丸ゴシックに対応。書体や大きさ、太さ、行間、字間、色も調整できます。"
          title="美しいフォントで描き直す"
        />
        <FeatureItem
          description="PNGで保存するほか、編集可能なSVGとしてPowerPointなどに貼り付けられます。"
          title="PNG・SVGで書き出す"
        />
      </div>
    </div>
  )
}
