import Image from "next/image"
import { getTranslation } from "@/i18n/server"

function Feature({
  title,
  description,
  imageAlt,
  imagePosition = "left",
  imageSrc,
}: {
  title: string
  description: string
  imageAlt: string
  imagePosition?: "left" | "right"
  imageSrc: string
}) {
  const imageOrder = imagePosition === "right" ? "md:order-2" : ""
  const contentOrder = imagePosition === "right" ? "md:order-1" : ""

  return (
    <div className="grid items-center gap-10 md:grid-cols-2 md:gap-20">
      <Image
        alt={imageAlt}
        className={`aspect-square w-full rounded-2xl object-cover md:h-120 ${imageOrder}`}
        height={640}
        src={imageSrc}
        width={640}
      />
      <div className={contentOrder}>
        <h2 className="text-3xl font-bold leading-normal sm:text-4xl">
          {title}
        </h2>
        <p className="mt-3 leading-normal text-lg">{description}</p>
      </div>
    </div>
  )
}

export async function ProductDetailsSection() {
  const { t } = await getTranslation()

  return (
    <div className="mx-auto flex w-full max-w-300 px-5 flex-col gap-30 py-20">
      <Feature
        title={t("landing.details.sourceTitle")}
        description={t("landing.details.sourceDescription")}
        imageAlt={t("landing.details.sourceAlt")}
        imageSrc="/landing/feature-sources.webp"
      />
      <Feature
        title={t("landing.details.brandTitle")}
        description={t("landing.details.brandDescription")}
        imageAlt={t("landing.details.brandAlt")}
        imagePosition="right"
        imageSrc="/landing/feature-brand-style.webp"
      />
      <Feature
        title={t("landing.details.appsTitle")}
        description={t("landing.details.appsDescription")}
        imageAlt={t("landing.details.appsAlt")}
        imageSrc="/landing/feature-editable-export.webp"
      />
    </div>
  )
}
