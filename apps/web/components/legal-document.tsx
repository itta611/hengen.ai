import LogoIcon from "@/components/logo-icon"

export function LegalDocument({
  children,
  effectiveDate,
  introduction,
  title,
}: {
  children: React.ReactNode
  effectiveDate: string
  introduction: string
  title: string
}) {
  return (
    <div className="min-h-full pb-10 px-5 sm:px-10">
      <div className="mx-auto max-w-200">
        <h1 className="mb-18 flex items-center justify-center gap-3.5 pt-14 text-center text-3xl font-bold">
          <LogoIcon width={30} />
          {title}
        </h1>
        <p className="leading-7 text-muted-foreground">{introduction}</p>
        {children}
        <div className="mt-10 text-right text-sm text-muted-foreground">
          {effectiveDate}
        </div>
      </div>
    </div>
  )
}

export function LegalSection({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <section className="mt-9">
      <h2 className="mb-3 text-lg font-bold">{title}</h2>
      <div className="space-y-3 leading-7 text-muted-foreground">
        {children}
      </div>
    </section>
  )
}

export function LegalList({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="list-decimal space-y-2 pl-5">
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ol>
  )
}
