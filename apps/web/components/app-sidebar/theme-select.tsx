"use client"

import { Monitor, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTranslation } from "@/i18n/client"

export function ThemeSelect() {
  const { t } = useTranslation()
  const { setTheme, theme } = useTheme()
  const themes = [
    {
      label: t("settings.display.themeOptions.dark"),
      value: "dark",
      icon: Moon,
    },
    {
      label: t("settings.display.themeOptions.light"),
      value: "light",
      icon: Sun,
    },
    {
      label: t("settings.display.themeOptions.system"),
      value: "system",
      icon: Monitor,
    },
  ]

  return (
    <>
      <span>{t("settings.display.theme")}</span>
      <Tabs onValueChange={setTheme} value={theme}>
        <TabsList>
          {themes.map(({ icon: Icon, label, value }) => (
            <TabsTrigger aria-label={label} key={value} value={value}>
              <Icon />
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </>
  )
}
