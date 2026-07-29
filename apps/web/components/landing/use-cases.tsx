import Image from "next/image"
import { getTranslation } from "@/i18n/server"

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

export async function UseCasesSection() {
  const { t } = await getTranslation()

  return (
    <div className="mx-auto w-full max-w-300 px-5 py-20">
      <h2 className="text-4xl font-bold text-center">
        {t("landing.useCases.heading")}
      </h2>
      <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <UseCaseCard
          description={t("landing.useCases.slideDescription")}
          imageAlt={t("landing.useCases.slideAlt")}
          imageSrc="/landing/use-case-slides.png"
          title={t("landing.useCases.slideTitle")}
        />
        <UseCaseCard
          description={t("landing.useCases.posterDescription")}
          imageAlt={t("landing.useCases.posterAlt")}
          imageSrc="/landing/use-case-poster.png"
          title={t("landing.useCases.posterTitle")}
        />
        <UseCaseCard
          description={t("landing.useCases.socialDescription")}
          imageAlt={t("landing.useCases.socialAlt")}
          imageSrc="/landing/use-case-social.png"
          title={t("landing.useCases.socialTitle")}
        />
        <UseCaseCard
          description={t("landing.useCases.menuDescription")}
          imageAlt={t("landing.useCases.menuAlt")}
          imageSrc="/landing/use-case-menu.png"
          title={t("landing.useCases.menuTitle")}
        />
      </div>
    </div>
  )
}
