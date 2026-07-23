function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="w-full">
      <div className="aspect-[16/9] rounded-xl bg-primary/10" />
      <div className="mt-6 px-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-4">{description}</p>
      </div>
    </div>
  )
}

export function WorkflowSection() {
  return (
    <div className="space-y-8 py-20 max-w-300 mx-auto px-5">
      <h2 className="text-4xl font-bold">利用の流れ</h2>
      <div className="flex gap-8 sm:flex-row">
        <FeatureCard
          title="画像を生成する"
          description="つくりたい内容を言葉で伝えるだけ。参考画像やテイストも指定して、用途に合った画像を生成できます。"
        />
        <FeatureCard
          title="文字を直接編集する"
          description="画像内の文字は、編集できるテキストとして表示。文章やフォント、色を、その場で調整できます。"
        />
        <FeatureCard
          title="使える形式で保存する"
          description="文章や見た目を整えたら、テキストボックスを維持してPowerPointに貼り付けることもできます。"
        />
      </div>
    </div>
  )
}
