import { LandingFooter } from "./footer"
import { LandingHeader } from "./header"
import { LandingHero } from "./hero"

export function Landing() {
  return (
    <div className="w-full">
      <div className="bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <LandingHeader />
        <LandingHero />
      </div>
      <LandingFooter />
    </div>
  )
}
