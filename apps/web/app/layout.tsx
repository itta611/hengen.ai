import type { Metadata } from "next"
import {
  Cormorant_Garamond,
  IBM_Plex_Sans,
  Manrope,
  Source_Serif_4,
} from "next/font/google"

import "./globals.css"
import { AuthDialog } from "@/components/auth-dialog"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { AuthDialogProvider } from "@/hooks/use-auth-dialog"
import { LocaleProvider } from "@/i18n/client"
import { getLocale, getTranslation } from "@/i18n/server"
import { cn } from "@/lib/utils"

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700", "800"],
})

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700"],
})

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getTranslation()

  return {
    title: t("metadata.title"),
    description: t("metadata.description"),
  }
}

const editorSans = Manrope({
  subsets: ["latin"],
  variable: "--font-editor-sans",
})

const editorDisplay = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-editor-display",
  weight: ["400", "500", "600", "700"],
})

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const locale = await getLocale()

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={cn(
        manrope.variable,
        cormorant.variable,
        editorSans.variable,
        editorDisplay.variable,
        "antialiased"
      )}
    >
      <body>
        <LocaleProvider initialLocale={locale}>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "18.75rem",
                "--sidebar-width-mobile": "18.75rem",
              } as React.CSSProperties
            }
          >
            <AuthDialogProvider>
              <ThemeProvider>
                {children}
                <AuthDialog />
                <Toaster position="bottom-center" />
              </ThemeProvider>
            </AuthDialogProvider>
          </SidebarProvider>
        </LocaleProvider>
      </body>
    </html>
  )
}
