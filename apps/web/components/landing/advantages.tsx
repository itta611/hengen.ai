import {
  ScanTextIcon,
  SparklesIcon,
  TextCursorIcon,
  TypeIcon,
} from "lucide-react"
import type React from "react"
import { getTranslation } from "@/i18n/server"

function FeatureItem({
  description,
  title,
  icon: Icon,
}: {
  description: string
  title: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}) {
  return (
    <div className="flex items-center gap-6">
      <div className="flex size-20 shrink-0 items-center justify-center rounded-lg border bg-background">
        <Icon className="size-8 text-primary" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-bold">{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  )
}

export async function AdvantagesSection() {
  const { t } = await getTranslation()

  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">
        {t("landing.advantages.heading")}
      </h2>
      <div className="mt-18 grid gap-x-16 gap-y-16 md:grid-cols-2">
        <FeatureItem
          icon={TextCursorIcon}
          title={t("landing.advantages.editTextTitle")}
          description={t("landing.advantages.editTextDescription")}
        />
        <FeatureItem
          icon={SparklesIcon}
          title={t("landing.advantages.qualityTitle")}
          description={t("landing.advantages.qualityDescription")}
        />
        <FeatureItem
          icon={ScanTextIcon}
          title={t("landing.advantages.ocrTitle")}
          description={t("landing.advantages.ocrDescription")}
        />
        <FeatureItem
          icon={TypeIcon}
          title={t("landing.advantages.typeTitle")}
          description={t("landing.advantages.typeDescription")}
        />
      </div>
    </div>
  )
}
