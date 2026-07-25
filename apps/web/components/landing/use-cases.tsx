import Image from "next/image"

function UseCaseCard({
  description,
  imageAlt,
  imageSrc,
  title,
}: {
  description: string
  imageAlt: string
  imageSrc: string
  title: string
}) {
  return (
    <article className="overflow-hidden">
      <Image
        alt={imageAlt}
        className="aspect-video w-full rounded-[10px] object-cover"
        height={600}
        src={imageSrc}
        width={800}
      />
      <div className="px-1.5 py-5">
        <h3 className="text-lg font-bold leading-normal">{title}</h3>
        <p className="mt-2 leading-normal">{description}</p>
      </div>
    </article>
  )
}

export function UseCasesSection() {
  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">こんなことに使えます</h2>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <UseCaseCard
          description="読みやすく整えた文字で、スライドにそのまま貼り付け。"
          imageAlt="3つの成長プロセスをまとめたビジネススライド"
          imageSrc="/landing/use-case-slides.png"
          title="スライド資料に使う図"
        />
        <UseCaseCard
          description="ポスターを生成したあとに、イベント名や日時、会場を変更。"
          imageAlt="デザインフォーラムのイベントポスター"
          imageSrc="/landing/use-case-poster.png"
          title="ポスター・チラシ"
        />
        <UseCaseCard
          description="画像を生成してから見出しや訴求を差し替え。"
          imageAlt="見出しと分析画面を組み合わせた広告クリエイティブ"
          imageSrc="/landing/use-case-social.png"
          title="SNS・広告クリエイティブ"
        />
        <UseCaseCard
          description="デザインを生成したあとに、商品名や価格を修正。"
          imageAlt="コーヒーや紅茶の価格を掲載したカフェメニュー表"
          imageSrc="/landing/use-case-menu.png"
          title="メニュー・料金表"
        />
      </div>
    </div>
  )
}
