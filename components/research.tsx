"use client"

import { useEffect, useRef, useState } from "react"
import { ArrowUpRight } from "lucide-react"

const projects = [
  {
    category: "Astrophysics",
    title: "Terzan 5 and the Formation of the Milky Way Bulge",
    description:
      "Investigated whether Terzan 5 is a primordial building block of the Milky Way bulge. Integrated heterogeneous stellar catalogues, standardised metallicity measurements across surveys, and compared full population distributions to evaluate competing formation scenarios.",
    tags: ["Cross-source Data Harmonisation", "Bias Mitigation", "Distribution-level Statistics"],
    year: "2022",
    journal: "Taylor et al. \u2014 MNRAS 2022",
    link: "https://academic.oup.com/mnras/article/513/3/3429/6565286",
  },
  {
    category: "Astrophysics",
    title: "CO Spectral Line Energy Distributions in SMGs",
    description:
      "Characterised molecular gas excitation in high-redshift submillimetre galaxies using multi-transition CO spectroscopy. Quantified intrinsic diversity beyond single-template models and evaluated how excitation assumptions propagate into downstream gas mass estimates.",
    tags: ["Multi-variable Inference", "Sensitivity Analysis", "Calibration Risk"],
    year: "2025",
    journal: "Taylor et al. \u2014 MNRAS 2025",
    link: "https://academic.oup.com/mnras/article/536/2/1149/7909089",
  },
  {
    category: "Astrophysics + ML",
    title: "KAOSS: Gas, Metals, Dust \u2014 and ML Signal Extraction",
    description:
      "Analysed the gas\u2013metallicity\u2013dust cycle in massive star-forming galaxies at z~2. Designed and trained an autoencoder to detect weak emission-line structure in low signal-to-noise 1D spectra, integrating ML outputs into a physically interpretable inference pipeline.",
    tags: ["Autoencoder", "Representation Learning", "Uncertainty Decomposition", "Bootstrap"],
    year: "In prep.",
    journal: "Taylor et al. \u2014 In preparation",
    link: null,
  },
  {
    category: "Quantitative Finance",
    title: "FX Machine Learning Volatility Forecasting",
    description:
      "Designed and evaluated ML models for forecasting FX volatility within a disciplined research pipeline. Built modular architecture for feature engineering, enforced strict in-sample/out-of-sample separation, and evaluated regime sensitivity with risk-adjusted metrics.",
    tags: ["Time-series ML", "Backtesting", "Risk Evaluation", "Python"],
    year: "2024",
    journal: null,
    link: "https://github.com/dominicjtaylor/fx-volatility-forecasting",
  },
  {
    category: "Data Engineering",
    title: "COVID-19 Data Analysis Web Application",
    description:
      "Built an end-to-end data pipeline and interactive Streamlit dashboard for analysing evolving COVID-19 case data. Automated ingestion and cleaning of dynamic public datasets with rolling metrics and time-series aggregation.",
    tags: ["Data Pipeline", "Streamlit", "Time-series", "Visualisation"],
    year: "2020",
    journal: null,
    link: "https://github.com/dominicjtaylor/COVID19",
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
          {projects.map((project, i) => {
            const Wrapper = project.link ? "a" : "div"
            const linkProps = project.link
              ? {
                  href: project.link,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : {}
            return (
              <Wrapper
                key={project.title}
                {...linkProps}
                className={`group rounded-2xl border border-border bg-card p-6 transition-all duration-700 hover:border-primary/30 hover:bg-secondary md:p-8 ${
                  project.link ? "cursor-pointer" : ""
                } ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + i * 100}ms` }}
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3">
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
                    {project.journal && (
                      <p className="mt-1 text-sm font-medium text-primary/70">
                        {project.journal}
                      </p>
                    )}
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
                  {project.link && (
                    <ArrowUpRight className="mt-2 h-5 w-5 shrink-0 text-muted-foreground transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-primary md:mt-0" />
                  )}
                </div>
              </Wrapper>
            )
          })}
        </div>
      </div>
    </section>
  )
}
