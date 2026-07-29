import { Logo } from "@/components/logo"
import { getTranslation } from "@/i18n/server"

export async function LandingFooter() {
  const { locale, t } = await getTranslation()

  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900 px-5 py-10">
      <div className="mx-auto flex w-full max-w-300 flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="h-7 w-24 saturate-0 contrast-0 opacity-45 dark:invert" />
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          <a
            className="transition-colors hover:text-foreground"
            href="https://x.com/IttaFunahashi"
          >
            {t("landing.footer.operator")}
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href={locale === "en" ? "/en/terms" : "/terms"}
          >
            {t("landing.footer.terms")}
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href={locale === "en" ? "/en/privacy" : "/privacy"}
          >
            {t("landing.footer.privacy")}
          </a>
        </nav>
      </div>
    </footer>
  )
}
