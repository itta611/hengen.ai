"use server"

import { cookies } from "next/headers"

import { languageCookie, resolveLocale } from "@/i18n/settings"

export async function switchLocale(value: string) {
  const cookieStore = await cookies()
  const locale = resolveLocale(value)

  cookieStore.set(languageCookie, locale, {
    path: "/",
    sameSite: "lax",
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 365,
  })

  return locale
}
