"use client"

import { useEffect, useRef } from "react"

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 20
      container.style.setProperty("--mouse-x", `${x}px`)
      container.style.setProperty("--mouse-y", `${y}px`)
    }

    container.addEventListener("mousemove", handleMouseMove)
    return () => container.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-svh items-center justify-center overflow-hidden"
      style={{
        ["--mouse-x" as string]: "0px",
        ["--mouse-y" as string]: "0px",
      }}
    >
      {/* Background image with parallax */}
      <div
        className="absolute inset-[-20px] bg-cover bg-center transition-transform duration-700 ease-out"
        style={{
          backgroundImage: "url(/images/hero-space.jpg)",
          transform:
            "translate(var(--mouse-x), var(--mouse-y)) scale(1.05)",
        }}
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/30 to-background" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/40 via-transparent to-background/40" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
        <p className="mb-4 text-sm font-medium uppercase tracking-[0.3em] text-primary md:text-base">
          Astronomy &middot; Data Analytics &middot; Quantitative Finance
        </p>
        <h1 className="text-balance text-5xl font-bold leading-[1.08] tracking-tight text-foreground md:text-7xl lg:text-8xl">
          Extracting signal
          <br />
          <span className="text-primary">from the noise.</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
          Dominic J. Taylor. Researcher bridging astrophysics, quantitative
          modelling, and data science to uncover structure in noisy,
          high-dimensional systems.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <a
            href="#research"
            className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-primary-foreground transition-all duration-300 hover:brightness-110"
          >
            View Research
          </a>
          <a
            href="#contact"
            className="inline-flex h-12 min-w-[180px] items-center justify-center rounded-full border border-border px-8 text-sm font-medium text-foreground transition-all duration-300 hover:bg-secondary"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Scroll
          </span>
          <div className="h-8 w-px animate-pulse bg-gradient-to-b from-primary to-transparent" />
        </div>
      </div>
    </section>
  )
}
