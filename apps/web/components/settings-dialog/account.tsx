"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
// import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useTranslation } from "@/i18n/client"
import { apiClient } from "@/lib/api-client"
import { authClient } from "@/lib/auth-client"
import { SettingSection } from "./setting-section"
import { UsageCard } from "./usage-card"

type AccountFormValues = {
  name: string
}

export function AccountSettingsPage() {
  const { t } = useTranslation()
  // const [confirmOpen, setConfirmOpen] = useState(false)
  // const [isDeleting, setIsDeleting] = useState(false)
  const [isSavingName, setIsSavingName] = useState(false)
  const [error, setError] = useState("")
  const session = authClient.useSession()
  const user = session.data?.user
  const router = useRouter()
  const accountForm = useForm<AccountFormValues>({
    defaultValues: { name: "" },
  })

  useEffect(() => {
    accountForm.reset({ name: user?.name ?? "" })
  }, [accountForm, user?.name])

  const handleUpdateAccount = accountForm.handleSubmit(async ({ name }) => {
    setIsSavingName(true)
    setError("")

    const response = await apiClient.account.$patch({
      json: { name },
    })

    setIsSavingName(false)

    if (!response.ok) {
      setError(t("settings.account.nameUpdateError"))
      return
    }

    router.refresh()
    toast.success(t("settings.account.nameUpdateSuccess"))
  })

  // const handleDeleteAccount = async () => {
  //   setIsDeleting(true)
  //   setError("")
  //
  //   const result = await authClient.deleteUser({
  //     callbackURL: "/",
  //   })
  //
  //   setIsDeleting(false)
  //
  //   if (result.error) {
  //     setError(t("settings.account.deleteError"))
  //     return
  //   }
  //
  //   router.push("/")
  //   router.refresh()
  // }

  return (
    <div className="space-y-12">
      <SettingSection title={t("settings.account.name")}>
        <form className="space-y-4" onSubmit={handleUpdateAccount}>
          <div className="max-w-90 flex gap-2">
            <Input {...accountForm.register("name")} />
            <Button disabled={isSavingName} type="submit">
              {t("settings.account.save")}
            </Button>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </form>
      </SettingSection>
      <SettingSection title={t("settings.account.creditUsage")}>
        <UsageCard />
      </SettingSection>
      <SettingSection
        title={t("settings.account.email")}
        description={user?.email}
      />
      <SettingSection
        title={t("settings.account.logout")}
        description={t("settings.account.logoutDescription")}
      >
        <Button
          onClick={async () => {
            await authClient.signOut()
            router.push("/")
          }}
          variant="outline"
        >
          {t("settings.account.logout")}
        </Button>
      </SettingSection>
      {/* <SettingSection
        title={t("settings.account.delete")}
        description={t("settings.account.deleteDescription")}
      >
        <Button onClick={() => setConfirmOpen(true)} variant="destructive">
          {t("settings.account.deleteButton")}
        </Button>
      </SettingSection>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-100!" forceRenderOverlay>
          <DialogTitle className="text-lg">
            {t("settings.account.deleteTitle")}
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {t("settings.account.deleteWarning")}
          </p>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <Button
              disabled={isDeleting}
              onClick={() => setConfirmOpen(false)}
              variant="outline"
            >
              {t("common.button.cancel")}
            </Button>
            <Button
              disabled={isDeleting}
              onClick={handleDeleteAccount}
              variant="destructive"
            >
              {t("common.button.delete")}
            </Button>
          </div>
        </DialogContent>
      </Dialog> */}
    </div>
  )
}
