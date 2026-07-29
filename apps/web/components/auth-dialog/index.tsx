"use client"

import { useEffect, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuthDialog } from "@/hooks/use-auth-dialog"
import { useLocale, useTranslation } from "@/i18n/client"
import { authClient } from "@/lib/auth-client"
import LogoIcon from "../logo-icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../ui/dialog"
import GoogleIcon from "./google-icon"

function getNameFromEmail(email: string) {
  const localPart = email.trim().split("@")[0]?.trim()

  if (!localPart) {
    return ""
  }

  return localPart.charAt(0).toUpperCase() + localPart.slice(1).toLowerCase()
}

export function AuthDialog() {
  const { t } = useTranslation()
  const { locale } = useLocale()
  const { authCallbackURL, closeAuthDialog, isAuthDialogOpen } = useAuthDialog()
  const user = authClient.useSession().data?.user
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busyMode, setBusyMode] = useState<"email" | "google" | null>(null)

  useEffect(() => {
    if (isAuthDialogOpen && user) {
      closeAuthDialog()
    }
  }, [closeAuthDialog, isAuthDialogOpen, user])

  if (!isAuthDialogOpen) {
    return null
  }

  async function handleGoogleLogin() {
    setBusyMode("google")
    setError(null)

    const result = await authClient.signIn.social({
      provider: "google",
      callbackURL: authCallbackURL,
    })

    setBusyMode(null)

    if (result.error) {
      setError(t("auth.googleError"))
    }
  }

  async function handleMagicLink() {
    if (!email.trim()) {
      toast.error(t("auth.emailRequired"))
      return
    }

    setBusyMode("email")
    setError(null)

    const result = await authClient.signIn.magicLink({
      email: email.trim(),
      name: getNameFromEmail(email),
      callbackURL: authCallbackURL,
    })

    setBusyMode(null)

    if (result.error) {
      toast.error(t("auth.magicLinkError"))
      return
    }

    setEmail("")
    toast.success(t("auth.magicLinkSent"))
  }

  return (
    <Dialog
      open={isAuthDialogOpen}
      onOpenChange={(open) => !open && closeAuthDialog()}
    >
      <DialogContent className="sm:max-w-120 px-10 pt-11 pt-12">
        <LogoIcon width={40} height={40} className="mx-auto" />
        <DialogTitle className="text-xl font-bold text-center">
          {t("auth.title")}
        </DialogTitle>
        <DialogDescription className="text-center">
          {t("auth.description")}
        </DialogDescription>

        <div className="flex flex-col gap-3">
          <Button
            type="button"
            size="lg"
            variant="outline"
            onClick={handleGoogleLogin}
            disabled={busyMode === "google"}
          >
            <GoogleIcon className="size-4.5" />
            {t("auth.google")}
          </Button>

          <div className="flex items-center h-12">
            <div className="h-px flex-1 bg-border" />
            <span className="mx-3 text-sm text-muted-foreground">
              {t("auth.or")}
            </span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form
            className="flex flex-col gap-3"
            onSubmit={(event) => {
              event.preventDefault()
              handleMagicLink()
            }}
          >
            <Input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
            />

            <Button type="submit" size="lg" disabled={busyMode === "email"}>
              {busyMode === "email"
                ? t("auth.issuingLink")
                : t("auth.continue")}
            </Button>
          </form>
        </div>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          {t("auth.agreementPrefix")}
          <a
            className="underline underline-offset-4"
            href={locale === "en" ? "/en/terms" : "/terms"}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("auth.terms")}
          </a>
          {t("auth.and")}
          <a
            className="underline underline-offset-4"
            href={locale === "en" ? "/en/privacy" : "/privacy"}
            rel="noopener noreferrer"
            target="_blank"
          >
            {t("auth.privacy")}
          </a>
          {t("auth.agreementSuffix")}
        </p>

        {error ? (
          <p className="mt-4 rounded-xl px-4 text-sm leading-6 text-red-500">
            {error}
          </p>
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
