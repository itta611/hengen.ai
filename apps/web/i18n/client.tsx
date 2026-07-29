"use client"

import i18next from "i18next"
import { useRouter } from "next/navigation"
import type { PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"
import { initReactI18next, useTranslation as useReactTranslation } from "react-i18next"

import { switchLocale } from "@/actions/switch-locale"
import en from "./locales/en.json"
import ja from "./locales/ja.json"
import { fallbackLocale, type Locale } from "./settings"

i18next.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  fallbackLng: fallbackLocale,
  lng: fallbackLocale,
  interpolation: { escapeValue: false },
  initAsync: false,
})

type LocaleContextValue = {
  locale: Locale
  setLocale: (locale: Locale) => Promise<void>
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function LocaleProvider({
  children,
  initialLocale,
}: PropsWithChildren<{ initialLocale: Locale }>) {
  const router = useRouter()
  const [locale, setActiveLocale] = useState(initialLocale)

  async function setLocale(locale: Locale) {
    setActiveLocale(locale)
    document.documentElement.lang = locale
    await switchLocale(locale)
    router.refresh()
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider")
  }

  return context
}

export function useTranslation() {
  const { locale } = useLocale()
  return useReactTranslation("translation", { lng: locale })
}
