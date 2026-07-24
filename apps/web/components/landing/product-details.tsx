function Feature({
  title,
  description,
  imagePosition = "left",
}: {
  title: string
  description: string
  imagePosition?: "left" | "right"
}) {
  const imageOrder = imagePosition === "right" ? "md:order-2" : ""
  const contentOrder = imagePosition === "right" ? "md:order-1" : ""

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
      <div
        className={`aspect-square w-full rounded-2xl bg-gray-100 md:aspect-auto md:h-120 ${imageOrder}`}
      />
      <div className={contentOrder}>
        <h2 className="text-3xl font-bold leading-normal sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 leading-normal text-lg">{description}</p>
      </div>
    </div>
  )
}

export function ProductDetailsSection() {
  return (
    <div className="mx-auto flex w-full max-w-300 px-5 flex-col gap-30 py-20">
      <Feature
        title="好きな材料から手軽に生成"
        description="文章のプロンプトだけでなく、手書きのスケッチや印刷物の写真から生成したり、他のAIサービスで作った画像を読み込めます。"
      />
      <Feature
        title="ブランドのスタイルを維持"
        description="ブランドカラーや質感、全体の雰囲気を細かく指定して、ブランドらしさを保った統一感のある資料に仕上げられます。"
        imagePosition="right"
      />
      <Feature
        title="使い慣れたアプリで編集する"
        description="生成した画像は、テキストを編集できる状態でPowerPointやIllustrator等のアプリに貼り付けることもできます。"
      />
    </div>
  )
}
