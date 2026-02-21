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
      "Extract weak signals from noisy, high-dimensional systems using rigorous statistical and ML methods.",
  },
  {
    icon: Settings2,
    title: "Testable Assumptions",
    description:
      "Treat modelling assumptions as testable components rather than fixed inputs, enabling explicit sensitivity analysis.",
  },
  {
    icon: BarChart3,
    title: "Distribution-level Reasoning",
    description:
      "Compare full distributions, not just summary statistics. Quantify statistical and systematic uncertainty separately.",
  },
  {
    icon: GitCompare,
    title: "Reproducible Infrastructure",
    description:
      "Build modular, version-controlled research pipelines with strict in-sample/out-of-sample separation and audit trails.",
  },
  {
    icon: Layers,
    title: "Cross-domain Transfer",
    description:
      "Apply inference techniques honed in astrophysics to financial time-series, and vice versa. The methods are portable; only the data changes.",
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
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            How I work.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            Across astronomy and quantitative finance, I apply a consistent
            analytical philosophy. The domain changes; the rigour does not.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((item, i) => (
            <div
              key={item.title}
              className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/30 hover:bg-secondary ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
