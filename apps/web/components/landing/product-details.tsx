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
        <p className="mt-3 leading-normal">{description}</p>
      </div>
    </div>
  )
}

export function ProductDetailsSection() {
  return (
    <div className="mx-auto flex w-full max-w-300 px-5 flex-col gap-30 py-20">
      <Feature
        title="スマートに貼り付ける"
        description="パワーポイントに、テキストボックスを維持したまま貼り付けられます。"
      />
      <Feature
        title="ブランドのスタイルを維持"
        description="ブランドのフォントや色を指定して、資料のトーンを統一できます。"
        imagePosition="right"
      />
    </div>
  )
}
