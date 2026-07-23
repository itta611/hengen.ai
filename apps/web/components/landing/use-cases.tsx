function UseCaseCard() {
  return (
    <article className="overflow-hidden">
      <div className="h-[182px] w-full rounded-[10px] bg-primary/10" />
      <div className="px-1.5 py-5">
        <h3 className="text-2xl font-bold leading-normal">手軽な資料作成</h3>
        <p className="mt-3 leading-normal">
          文章からすぐに生成。PDFや写真を読み込めば、内容を活かした資料作成やデザインの再現もできます。
        </p>
      </div>
    </article>
  )
}

export function UseCases() {
  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">ユースケース</h2>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <UseCaseCard />
        <UseCaseCard />
        <UseCaseCard />
        <UseCaseCard />
      </div>
    </div>
  )
}
