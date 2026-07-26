"use client"

export const fallbackFontFamily = "Noto Sans JP"

export const fontFamilies = [
  { label: "Inter", value: "Inter" },
  { label: "Noto Sans JP", value: fallbackFontFamily },
  { label: "Noto Serif", value: "Noto Serif" },
  { label: "Noto Serif JP", value: "Noto Serif JP" },
  { label: "Roboto Mono", value: "Roboto Mono" },
] as const

const supportedFontFamilies = new Set<string>(
  fontFamilies.map(({ value }) => value)
)

const fontLoads = new Map<string, Promise<string>>()

export function normalizeFontFamily(fontFamily?: string) {
  const family = fontFamily?.trim() || fallbackFontFamily

  return supportedFontFamilies.has(family) ? family : fallbackFontFamily
}

export function getFontFamilyCss(fontFamily?: string) {
  const family = normalizeFontFamily(fontFamily)

  return family === fallbackFontFamily
    ? `"${fallbackFontFamily}", sans-serif`
    : `"${family.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}", "${fallbackFontFamily}", sans-serif`
}

export function loadGoogleFont(fontFamily?: string) {
  const family = normalizeFontFamily(fontFamily)
  const existingLoad = fontLoads.get(family)

  if (existingLoad) {
    return existingLoad
  }

  const load = Promise.all([
    document.fonts.load(`500 16px "${family}"`),
    document.fonts.load(`700 16px "${family}"`),
  ]).then(
    () => family,
    () => fallbackFontFamily
  )

  fontLoads.set(family, load)
  return load
}
