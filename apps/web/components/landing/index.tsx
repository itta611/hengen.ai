import { LandingFooter } from "./footer"
import { LandingHeader } from "./header"
import { LandingFeatures } from "./features"
import { Features2 } from "./features2"
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
      <div className="px-5">
        <div className="max-w-300 mx-auto">
          <Features2 />
          <LandingFeatures />
        </div>
      </div>
      <LandingFooter />
    </div>
  )
}
