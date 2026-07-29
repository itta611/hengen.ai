import { createInstance } from "i18next"
import { cookies, headers } from "next/headers"

import en from "./locales/en.json"
import ja from "./locales/ja.json"
import { languageCookie, resolveLocale } from "./settings"

const serverI18n = createInstance()
const serverI18nReady = serverI18n.init({
  resources: {
    en: { translation: en },
    ja: { translation: ja },
  },
  fallbackLng: "ja",
  lng: "ja",
  initAsync: false,
})

export async function getLocale() {
  const requestHeaders = await headers()
  const routeLocale = requestHeaders.get("x-mutar-locale")

  if (routeLocale) {
    return resolveLocale(routeLocale)
  }

  const cookieStore = await cookies()
  const savedLocale = cookieStore.get(languageCookie)?.value

  if (savedLocale) {
    return resolveLocale(savedLocale)
  }

  return resolveLocale(requestHeaders.get("accept-language"))
}

export async function getTranslation() {
  const locale = await getLocale()
  await serverI18nReady
  return { locale, t: serverI18n.getFixedT(locale, "translation") }
}
