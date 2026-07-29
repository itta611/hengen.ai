"use client"

import { ArrowRightIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { useTranslation } from "@/i18n/client"

export function CtaSection() {
  const { t } = useTranslation()
  const { openAuthDialog } = useAuthDialog()

  return (
    <div className="px-5 py-20 max-w-300 mx-auto">
      <div className="text-center overflow-hidden rounded-3xl bg-indigo-500 py-16 text-white px-12">
        <h2 className="mt-5 font-bold tracking-tight text-4xl">
          {t("landing.cta.title")}
        </h2>
        <p className="mx-auto mt-8 max-w-2xl text-sm leading-7 sm:text-base">
          {t("landing.cta.description")}
        </p>
        <Button
          className="mt-10 bg-white! text-indigo-500 hover:bg-white/80!"
          onClick={() => openAuthDialog()}
          size="xl"
          variant="secondary"
        >
          {t("landing.cta.button")}
          <ArrowRightIcon />
        </Button>
      </div>
    </div>
  )
}
