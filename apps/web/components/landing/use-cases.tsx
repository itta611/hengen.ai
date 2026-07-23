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
        <h3 className="text-xl font-bold leading-normal">{title}</h3>
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
          description="業務フローや比較表、ロードマップを生成。読みやすく整えた文字で、スライドにそのまま使えます。"
          title="スライドに使う表や図"
        />
        <UseCaseCard
          description="ポスターを生成したあとに、イベント名や日時、会場を変更。元のデザインを活かして繰り返し使えます。"
          title="ポスター・チラシ"
        />
        <UseCaseCard
          description="画像を生成してから見出しや訴求を差し替え、ひとつのデザインから複数のパターンを展開できます。"
          title="SNS・広告クリエイティブ"
        />
        <UseCaseCard
          description="Mutarで生成した画像だけでなく、手元にある画像も読み込んで文章や日付、数字を修正できます。"
          title="手元にある画像の修正"
        />
      </div>
    </div>
  )
}
