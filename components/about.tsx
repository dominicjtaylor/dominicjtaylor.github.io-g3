"use client"

import { useEffect, useRef, useState } from "react"
import { BarChart3, Telescope, TrendingUp } from "lucide-react"

const disciplines = [
  {
    icon: Telescope,
    title: "Astronomy Research",
    description:
      "Investigating the gas, dust, and chemical enrichment of galaxies across cosmic time. Published in MNRAS with expertise in multi-signal modelling and population analysis.",
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Building end-to-end data pipelines and ML tools for signal extraction. From autoencoder-based emission-line detection to production-ready interactive dashboards.",
  },
  {
    icon: TrendingUp,
    title: "Quantitative Finance",
    description:
      "Designing systematic volatility forecasting models for FX markets. Rigorous backtesting, regime sensitivity analysis, and risk-aware performance evaluation.",
  },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            About
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            Where curiosity meets precision.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-foreground/70">
            I work at the intersection of three domains: the vast scales of
            astrophysics, the complexity of financial markets, and the discipline
            of rigorous data science. The common thread is extracting weak
            signals from noisy, high-dimensional systems and treating modelling
            assumptions as testable components.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {disciplines.map((item, i) => (
            <div
              key={item.title}
              className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/30 hover:bg-secondary ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-foreground/70">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
