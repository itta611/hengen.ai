"use client"

import { Logo } from "@/components/logo"
import { Button } from "@/components/ui/button"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { useTranslation } from "@/i18n/client"
import Link from "next/link"

export function LandingHeader() {
  const { t } = useTranslation()
  const { openAuthDialog } = useAuthDialog()

  return (
    <nav className="px-5">
      <div className="flex items-center justify-between py-4 mx-auto max-w-300">
        <Link href="/">
          <Logo height={30} />
        </Link>
        <Button onClick={() => openAuthDialog()} size="lg">
          {t("landing.header.login")}
        </Button>
      </div>
    </nav>
  )
}
