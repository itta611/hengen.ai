function FeatureCard({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="grid w-full row-span-2 grid-rows-subgrid">
      <div className="aspect-[16/9] rounded-xl bg-primary/10" />
      <div className="mt-6 px-2">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="mt-3">{description}</p>
      </div>
    </div>
  )
}

function WorkflowArrow() {
  return (
    <div className="self-center">
      <div className="block h-0 w-0 border-x-20 border-y-32 border-transparent border-l-primary translate-x-2.5 max-sm:hidden" />
    </div>
  )
}

export async function WorkflowSection() {
  const { t } = await getTranslation()

  return (
    <div className="space-y-8 py-20 max-w-300 mx-auto px-5">
      <h2 className="text-4xl font-bold">{t("landing.workflow.heading")}</h2>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto_minmax(0,1fr)] gap-x-5">
        <FeatureCard
          title={t("landing.workflow.generateTitle")}
          description={t("landing.workflow.generateDescription")}
        />
        <WorkflowArrow />
        <FeatureCard
          title={t("landing.workflow.editTitle")}
          description={t("landing.workflow.editDescription")}
        />
        <WorkflowArrow />
        <FeatureCard
          title={t("landing.workflow.saveTitle")}
          description={t("landing.workflow.saveDescription")}
        />
      </div>
    </div>
  )
}
import { getTranslation } from "@/i18n/server"
