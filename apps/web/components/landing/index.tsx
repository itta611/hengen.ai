import { CtaSection } from "./cta"
import { WorkflowSection } from "./workflow"
import { AdvantagesSection } from "./advantages"
import { ProductDetailsSection } from "./product-details"
import { LandingFooter } from "./footer"
import { LandingHeader } from "./header"
import { HeroSection } from "./hero"
import { UseCasesSection } from "./use-cases"
import { ProductDemoSection } from "./product-demo"

export function Landing() {
  return (
    <div className="w-full">
      <div className="bg-zinc-50 dark:bg-zinc-900 overflow-hidden">
        <LandingHeader />
        <HeroSection />
        <ProductDemoSection />
      </div>
      {/* <section id="workflow">
        <WorkflowSection />
      </section> */}
      <section id="advantages">
        <AdvantagesSection />
      </section>
      <section id="editing">
        <ProductDetailsSection />
      </section>
      <section id="use-cases">
        <UseCasesSection />
      </section>
      <section>
        <CtaSection />
      </section>
      <footer>
        <LandingFooter />
      </footer>
    </div>
  )
}
