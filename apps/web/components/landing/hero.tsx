"use client"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { ArrowRightIcon } from "lucide-react"
import { useTranslation } from "@/i18n/client"

export function HeroSection() {
  const { t } = useTranslation()
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="mx-auto flex w-full max-w-300 flex-col px-10 text-center">
      <div className="flex flex-col items-center py-36">
        <h1 className="text-4xl font-extrabold leading-normal font-features-['palt'] tracking-tight sm:text-6xl">
          {t("landing.hero.titleLine1")}
          <br />
          <span className="text-primary">{t("landing.hero.titleLine2")}</span>
        </h1>
        <p className="mt-8 text-base text-muted-foreground sm:text-lg">
          {t("landing.hero.descriptionLine1")}
          <br />
          {t("landing.hero.descriptionLine2")}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          <Button onClick={() => openAuthDialog()} size="xl">
            {t("landing.hero.start")}
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </div>
  )
}
