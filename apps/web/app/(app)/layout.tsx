import type { Metadata } from "next"
import { AppSidebar } from "@/components/app-sidebar"
import { PricingDialogProvider } from "@/components/pricing-dialog"
import { Providers } from "./providers"
import { AppSidebarTrigger } from "./sidebar-trigger"

export const metadata: Metadata = {
  title: "Mutar",
  description:
    "Slide and poster oriented AI image generation with editable text layers.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <Providers>
      <PricingDialogProvider>
        <AppSidebar />
        <AppSidebarTrigger />
        <div className="flex h-dvh w-full min-w-0 flex-col">
          <div className="min-h-0 min-w-0 grow bg-background">{children}</div>
        </div>
      </PricingDialogProvider>
    </Providers>
  )
}
