function UseCaseCard({
  description,
  title,
}: {
  description: string
  title: string
}) {
  return (
    <article className="overflow-hidden">
      <div className="aspect-video w-full rounded-[10px] bg-primary/10" />
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
          title="スライド資料に使う図"
        />
        <UseCaseCard
          description="ポスターを生成したあとに、イベント名や日時、会場を変更。"
          title="ポスター・チラシ"
        />
        <UseCaseCard
          description="画像を生成してから見出しや訴求を差し替え。"
          title="SNS・広告クリエイティブ"
        />
        <UseCaseCard
          description="デザインを生成したあとに、商品名や価格を修正。"
          title="メニュー・料金表"
        />
      </div>
    </div>
  )
}
