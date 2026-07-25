"use client"

export const fallbackFontFamily = "Noto Sans JP"

const legacyFontFamilies: Record<string, string> = {
  gothic: fallbackFontFamily,
  mincho: "Noto Serif JP",
  pop: "M PLUS Rounded 1c",
}

const fontLoads = new Map<string, Promise<string>>()

export function normalizeFontFamily(fontFamily?: string) {
  const value = fontFamily?.trim()

  return value ? (legacyFontFamilies[value] ?? value) : fallbackFontFamily
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

  const load =
    family === fallbackFontFamily
      ? document.fonts.load(`16px "${fallbackFontFamily}"`).then(
          () => family,
          () => fallbackFontFamily
        )
      : new Promise<string>((resolve) => {
          const link = document.createElement("link")
          const url = new URL("https://fonts.googleapis.com/css2")

          url.searchParams.set("family", family)
          url.searchParams.set("display", "swap")
          link.rel = "stylesheet"
          link.href = url.toString()
          link.onload = () => {
            void document.fonts
              .load(`16px "${family.replaceAll('"', '\\"')}"`, "BESbswy")
              .then((fonts) =>
                resolve(fonts.length > 0 ? family : fallbackFontFamily)
              )
              .catch(() => resolve(fallbackFontFamily))
          }
          link.onerror = () => resolve(fallbackFontFamily)
          document.head.append(link)
        })

  fontLoads.set(family, load)
  return load
}
