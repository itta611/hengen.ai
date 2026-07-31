"use client"

import Aurora from "@/components/Aurora"
const auroraColorStops = ["#605FFF", "#605FFF", "#605FFF"]

export function ProductDemoSection() {
  return (
    <div className="relative mt-10 pb-22 px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-30 bottom-0 z-10 flex -scale-y-100 flex-col-reverse"
      >
        <div className="z-30 h-60">
          <Aurora
            colorStops={auroraColorStops}
            blend={0.8}
            amplitude={1}
            speed={0.6}
          />
        </div>
        <div className="grow from-indigo-500 to-background bg-linear-to-t shadow-[0_40px_40px_40px_var(--primary)]" />
      </div>
      <div className="relative z-20 mx-auto w-full max-w-280">
        <div className="aspect-video overflow-hidden rounded-3xl bg-background outline-16 outline-background/20">
          <video
            aria-hidden="true"
            autoPlay
            className="size-full object-cover"
            loop
            muted
            playsInline
            preload="metadata"
          >
            <source src="/landing/product-demo.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </div>
  )
}
