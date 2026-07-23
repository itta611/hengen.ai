import { LandingCta } from "./cta"
import { LandingFeatures } from "./features"
import { Features2 } from "./features2"
import { Features3 } from "./features3"
import { LandingFooter } from "./footer"
import { LandingHeader } from "./header"
import { LandingHero } from "./hero"
import { UseCases } from "./use-cases"
import { LandingVideo } from "./video"

export function Landing() {
  return (
    <div className="w-full">
      <div className="bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <LandingHeader />
        <LandingHero />
        <LandingVideo />
      </div>
      <section>
        <LandingFeatures />
      </section>
      <section>
        <Features2 />
      </section>
      <section>
        <Features3 />
      </section>
      <section>
        <UseCases />
      </section>
      <section>
        <LandingCta />
      </section>
      <footer>
        <LandingFooter />
      </footer>
    </div>
  )
}
