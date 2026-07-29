"use client"

import { useTheme } from "next-themes"
import { toast } from "sonner"

import { Switch } from "@/components/ui/switch"
import {
  useEditorSettings,
  useUpdateEditorSettings,
} from "@/hooks/use-editor-settings"
import { useLocale, useTranslation } from "@/i18n/client"
import type { Locale } from "@/i18n/settings"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { SettingSection } from "./setting-section"

export function GeneralSettingsPage() {
  const { setTheme, theme } = useTheme()
  const { locale, setLocale } = useLocale()
  const { t } = useTranslation()
  const { data } = useEditorSettings()
  const updateEditorSettings = useUpdateEditorSettings()

  return (
    <div className="space-y-12">
      <div className="space-y-5">
        <h3 className="text-lg font-bold">{t("settings.display.heading")}</h3>
        <SettingSection title={t("settings.display.language")}>
          <Select
            value={locale}
            onValueChange={(value) => {
              if (value) void setLocale(value as Locale)
            }}
            items={[
              { label: t("common.language.ja"), value: "ja" },
              { label: t("common.language.en"), value: "en" },
            ]}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="ja">{t("common.language.ja")}</SelectItem>
                <SelectItem value="en">{t("common.language.en")}</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingSection>
        <SettingSection title={t("settings.display.theme")}>
          <Select
            value={theme}
            onValueChange={(value) => setTheme(value!)}
            items={[
              {
                label: t("settings.display.themeOptions.system"),
                value: "system",
              },
              { label: t("settings.display.themeOptions.dark"), value: "dark" },
              {
                label: t("settings.display.themeOptions.light"),
                value: "light",
              },
            ]}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="system">
                  {t("settings.display.themeOptions.system")}
                </SelectItem>
                <SelectItem value="dark">
                  {t("settings.display.themeOptions.dark")}
                </SelectItem>
                <SelectItem value="light">
                  {t("settings.display.themeOptions.light")}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </SettingSection>
      </div>
      <div className="space-y-5">
        <h3 className="text-lg font-bold">{t("settings.editor.heading")}</h3>
        <SettingSection
          title={t("settings.editor.snapTitle")}
          description={t("settings.editor.snapDescription")}
          horizontal
        >
          <Switch
            checked={data?.editorSettings.snapToGrid ?? true}
            disabled={!data}
            onCheckedChange={(snapToGrid) =>
              updateEditorSettings.mutate(
                { snapToGrid },
                {
                  onError: () => toast.error(t("settings.editor.updateError")),
                }
              )
            }
          />
        </SettingSection>
      </div>
    </div>
  )
}
