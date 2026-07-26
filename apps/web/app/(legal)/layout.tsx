import { LandingFooter } from "@/components/landing/footer"
import { LandingHeader } from "@/components/landing/header"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full">
      <LandingHeader />
      {children}
      <LandingFooter />
    </div>
  )
}
