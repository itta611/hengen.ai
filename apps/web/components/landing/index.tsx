import { LandingFooter } from "./footer"
import { LandingHeader } from "./header"
import { LandingFeatures } from "./features"
import { LandingHero } from "./hero"
import { LandingVideo } from "./video"

export function Landing() {
  return (
    <div className="w-full">
      <div className="bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <LandingHeader />
        <LandingHero />
        <LandingVideo />
      </div>
      <div className="px-5 max-w-300 mx-auto">
        <LandingFeatures />
      </div>
      <LandingFooter />
    </div>
  )
}
