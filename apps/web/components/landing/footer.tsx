import { Logo } from "@/components/logo"

export function LandingFooter() {
  return (
    <footer className="bg-zinc-50 dark:bg-zinc-900">
      <div className="mx-auto flex w-full max-w-325 flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Logo className="h-7 w-26 saturate-0 contrast-0 opacity-45 dark:invert" />
        <nav className="flex flex-wrap items-center justify-center gap-5 text-sm text-muted-foreground">
          <a className="transition-colors hover:text-foreground" href="/terms">
            利用規約
          </a>
          <a
            className="transition-colors hover:text-foreground"
            href="/privacy"
          >
            プライバシーポリシー
          </a>
          <span>
            © 2026, <a href="https://x.com/IttaFunahashi">Itta Funahashi</a>
          </span>
        </nav>
      </div>
    </footer>
  )
}
