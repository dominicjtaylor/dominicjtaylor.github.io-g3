"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const publications = [
  {
    title:
      "Atmospheric Retrieval of TRAPPIST-1e Using Bayesian Neural Networks",
    journal: "The Astrophysical Journal",
    year: "2025",
    doi: "#",
  },
  {
    title:
      "Factor Momentum Decay and Regime-Dependent Portfolio Construction",
    journal: "Journal of Financial Economics",
    year: "2024",
    doi: "#",
  },
  {
    title:
      "Streaming Anomaly Detection for High-Frequency Market Microstructure",
    journal: "Quantitative Finance",
    year: "2024",
    doi: "#",
  },
  {
    title:
      "Mass Transfer Efficiency in Semi-Detached Binary Star Systems",
    journal: "Monthly Notices of the Royal Astronomical Society",
    year: "2023",
    doi: "#",
  },
  {
    title:
      "Cross-Asset Correlation Structures Under Tail Risk Regimes",
    journal: "Journal of Portfolio Management",
    year: "2023",
    doi: "#",
  },
]

export function Publications() {
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
      id="publications"
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
            Publications
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Selected writing.
          </h2>
        </div>

        <div className="mt-16 flex flex-col">
          {publications.map((pub, i) => (
            <a
              key={pub.title}
              href={pub.doi}
              className={`group flex items-start justify-between gap-4 border-b border-border py-6 transition-all duration-700 hover:px-4 hover:bg-secondary md:items-center md:py-8 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex-1">
                <h3 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                  {pub.title}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {pub.journal} &middot; {pub.year}
                </p>
              </div>
              <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-all duration-300 group-hover:text-primary md:mt-0" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
