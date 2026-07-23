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

export function LandingFeatures() {
  return (
    <div className="space-y-8 py-20 max-w-300 mx-auto px-5">
      <h2 className="text-4xl font-bold">特長</h2>
      <p>
        ここにひとこと。ここにひとこと。ここにひとこと。ここにひとこと。ここにひとこと。
      </p>
      <div className="flex gap-8 sm:flex-row">
        <FeatureCard
          title="手軽な資料生成"
          description="文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。"
        />
        <FeatureCard
          title="高品質な画像生成"
          description="GPT Image 2.0が、レイアウトから細部まで整った、そのまま使える資料画像を生成します。"
        />
        <FeatureCard
          title="生成後の編集"
          description="生成した文字をその場で修正。小さな変更のたびに、最初から作り直す必要はありません。"
        />
      </div>
    </div>
  )
}
