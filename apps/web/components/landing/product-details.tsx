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
        title="文字が崩れただけで、その画像をあきらめない。"
        description="画像全体の雰囲気を保ちながら、文字だけを美しいフォントで描き直します。読みにくい文字や不自然な字形を整え、そのまま使える画像に仕上げます。"
      />
      <Feature
        title="生成したあとも、直したい一言だけを編集。"
        description="背景のデザインを活かしたまま、文章やフォント、文字サイズ、色、位置を調整できます。誤字の修正も、言い回しの変更も、その場ですぐに完了します。"
        imagePosition="right"
      />
    </div>
  )
}
