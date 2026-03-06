"use client"

import { useEffect, useRef, useState } from "react"
import {
  Signal,
  Settings2,
  BarChart3,
  GitCompare,
  Layers,
} from "lucide-react"

const principles = [
  {
    icon: Signal,
    title: "Signal from Noise",
    description:
      "Rigorous statistical and ML methods for extracting weak signals from noisy, high-dimensional systems.",
    example: "Autoencoder model identifying weak spectral emission lines in noisy astronomical spectra.",
  },
  {
    icon: Settings2,
    title: "Testable Assumptions",
    description:
      "Modelling assumptions treated as testable components with explicit sensitivity analysis.",
    example: "Modelling gas fractions in submillimetre galaxies while testing sensitivity to calibration assumptions.",
  },
  {
    icon: BarChart3,
    title: "Distribution-level Reasoning",
    description:
      "Full distribution comparisons with separate quantification of statistical and systematic uncertainty.",
    example: "Probabilistic modelling of FX volatility rather than point predictions.",
  },
  {
    icon: GitCompare,
    title: "Reproducible Infrastructure",
    description:
      "Modular, version-controlled pipelines with strict in-sample/out-of-sample separation.",
    example: "Automated Python pipelines for astronomical data analysis and financial strategy backtesting.",
  },
  {
    icon: Layers,
    title: "Cross-domain Transfer",
    description:
      "Inference techniques portable between astrophysics and financial time-series.",
    example: "Applying inference methods honed on galaxy spectra to financial time-series modelling.",
  },
]

export function Methodology() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="methodology"
      className="relative py-24 md:py-32"
    >
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Methodology
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            How I work.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/70">
            Across astronomy and quantitative finance, I apply a{" "}
            <span className="highlight">consistent analytical philosophy</span>.
            The domain changes; the rigour does not.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, i) => (
            <div
              key={item.title}
              className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-150 hover:border-primary/30 hover:bg-secondary ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-7 w-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                {item.description}
              </p>
              {item.example && (
                <p className="mt-2 text-sm italic leading-relaxed text-foreground/50">
                  e.g. {item.example}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
