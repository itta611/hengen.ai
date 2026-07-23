function Feature({
  title,
  subtitle,
  description,
  imagePosition = "left",
}: {
  title: string
  subtitle: string
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
        <h3 className="mt-3 text-xl font-bold leading-normal">{subtitle}</h3>
        <p className="mt-3 leading-normal">{description}</p>
      </div>
    </div>
  )
}

export function Features3() {
  return (
    <div className="mx-auto flex w-full max-w-300 px-5 flex-col gap-30 py-20">
      <Feature
        title="AIに聞くだけで分析"
        subtitle="AIに聞くだけで分析"
        description="文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。"
      />
      <Feature
        title="すぐに貼り付けられる"
        subtitle="AIに聞くだけで分析"
        description="文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。"
        imagePosition="right"
      />
    </div>
  )
}
