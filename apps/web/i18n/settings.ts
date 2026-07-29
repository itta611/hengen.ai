export const fallbackLocale = "ja"
export const supportedLocales = ["ja", "en"] as const
export type Locale = (typeof supportedLocales)[number]

export const languageCookie = "preferred_language"

export function resolveLocale(value: string | null | undefined): Locale {
  const language = value?.split(/[-_]/)[0]?.toLowerCase()
  return supportedLocales.find((locale) => locale === language) ?? fallbackLocale
}
