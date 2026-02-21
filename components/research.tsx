"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    category: "Astrophysics",
    title: "Spectral Analysis of Exoplanet Atmospheres",
    description:
      "Developed a novel Bayesian framework for atmospheric retrieval using transmission spectroscopy data from JWST. Identified biosignature candidates across 12 exoplanets.",
    tags: ["Python", "MCMC", "Spectroscopy", "JWST"],
    year: "2025",
  },
  {
    category: "Quantitative Finance",
    title: "Multi-Factor Alpha Generation in Equity Markets",
    description:
      "Designed and backtested a systematic strategy combining momentum, value, and alternative data signals. Achieved 2.3 Sharpe ratio over a 10-year backtest window.",
    tags: ["Factor Models", "Time Series", "Risk Parity", "Python"],
    year: "2024",
  },
  {
    category: "Data Science",
    title: "Real-Time Anomaly Detection at Scale",
    description:
      "Built a streaming ML pipeline for detecting anomalies in high-frequency financial data. Reduced false positives by 40% using adaptive threshold algorithms.",
    tags: ["Kafka", "Spark", "XGBoost", "AWS"],
    year: "2024",
  },
  {
    category: "Astrophysics",
    title: "Stellar Evolution in Binary Systems",
    description:
      "Modeled mass transfer dynamics in close binary star systems using N-body simulations. Predicted orbital period changes matching observational data within 0.3% accuracy.",
    tags: ["N-body", "Fortran", "Monte Carlo", "HPC"],
    year: "2023",
  },
]

export function Research() {
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
      id="research"
      className="relative py-24 md:py-32"
    >
      {/* Subtle divider */}
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Research
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Selected projects.
          </h2>
        </div>

        <div className="mt-16 flex flex-col gap-6">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className={`group cursor-pointer rounded-2xl border border-border bg-card p-6 transition-all duration-700 hover:border-primary/30 hover:bg-secondary md:p-8 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-medium uppercase tracking-widest text-primary">
                      {project.category}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {project.year}
                    </span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground md:text-2xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-base leading-relaxed text-muted-foreground">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary md:mt-0" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
