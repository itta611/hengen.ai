function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="grid w-full row-span-2 grid-rows-subgrid">
      <div className="aspect-[16/9] rounded-xl bg-primary/10" />
      <div className="mt-6 px-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3">{description}</p>
      </div>
    </div>
  )
}

function WorkflowArrow() {
  return (
    <div className="self-center">
      <div className="block h-0 w-0 border-x-20 border-y-32 border-transparent border-l-primary translate-x-2.5 max-sm:hidden" />
    </div>
  )
}

export function WorkflowSection() {
  return (
    <div className="space-y-8 py-20 max-w-300 mx-auto px-5">
      <h2 className="text-4xl font-bold">利用の流れ</h2>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-5">
        <FeatureCard
          title="画像を生成する"
          description="つくりたい内容を言葉で伝えるだけ。他のサービスで作った画像を読み込むこともできます。"
        />
        <WorkflowArrow />
        <FeatureCard
          title="文字を直接編集する"
          description="画像内の文字は、編集できるテキストボックスに変換されます。本文やフォントを、その場で編集できます。"
        />
        <WorkflowArrow />
        <FeatureCard
          title="画像を保存する"
          description="画像をPNGまたはSVG形式保存します。"
        />
      </div>
    </div>
  )
}
