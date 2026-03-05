"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

const projects = [
  {
    category: "Quantitative Finance",
    title: "Machine Learning Models for FX Volatility Forecasting",
    description:
      "Designed and evaluated ML models for forecasting FX volatility within a disciplined research pipeline. Built modular architecture for feature engineering, enforced strict in-sample/out-of-sample separation, and evaluated regime sensitivity with risk-adjusted metrics.",
    tags: ["Time-series ML", "Backtesting", "Risk Evaluation", "Python"],
    year: "2026",
    journal: null,
    link: "https://github.com/dominicjtaylor/fx-volatility-forecasting",
  },
  {
    category: "Astrophysics + ML",
    title: "Galaxy Gas\u2013Metal\u2013Dust Cycles and ML Signal Extraction",
    description:
      "Analysed the gas\u2013metallicity\u2013dust cycle in massive star-forming galaxies at z~2. Designed and trained an autoencoder to detect weak emission-line structure in low signal-to-noise 1D spectra, integrating ML outputs into a physically interpretable inference pipeline.",
    tags: ["Autoencoder", "Representation Learning", "Uncertainty Decomposition", "Bootstrap"],
    year: "In prep.",
    journal: "Taylor et al. \u2014 In preparation",
    link: null,
  },
  {
    category: "Astrophysics",
    title: "Modelling Molecular Gas Excitation in Distant Galaxies",
    description:
      "Characterised molecular gas excitation in high-redshift submillimetre galaxies using multi-transition CO spectroscopy. Quantified intrinsic diversity beyond single-template models and evaluated how excitation assumptions propagate into downstream gas mass estimates.",
    tags: ["Multi-variable Inference", "Sensitivity Analysis", "Calibration Risk"],
    year: "2025",
    journal: "Taylor et al. \u2014 MNRAS 2025",
    link: "https://academic.oup.com/mnras/article/536/2/1149/7909089",
  },
  {
    category: "Quantitative Finance",
    title: "Systematic Trading Strategy Backtesting Framework",
    description:
      "Developed a Python-based financial backtesting framework supporting modular trading strategies, moving average signals, and performance visualisation for systematic strategy evaluation.",
    tags: ["Backtesting", "Systematic Trading", "Python", "Modular Design"],
    year: "2025",
    journal: null,
    link: "https://github.com/dominicjtaylor/quantlab",
  },
  {
    category: "Astrophysics",
    title: "Data-Driven Analysis of the Milky Way Bulge Formation",
    description:
      "Investigated whether Terzan 5 is a primordial building block of the Milky Way bulge. Integrated heterogeneous stellar catalogues, standardised metallicity measurements across surveys, and compared full population distributions to evaluate competing formation scenarios.",
    tags: ["Cross-source Data Harmonisation", "Bias Mitigation", "Distribution-level Statistics"],
    year: "2022",
    journal: "Taylor et al. \u2014 MNRAS 2022",
    link: "https://academic.oup.com/mnras/article/513/3/3429/6565286",
  },
  {
    category: "Data Engineering",
    title: "Interactive Web Application for COVID-19 Data Analysis",
    description:
      "Built an end-to-end data pipeline and interactive Streamlit dashboard for analysing evolving COVID-19 case data. Automated ingestion and cleaning of dynamic public datasets with rolling metrics and time-series aggregation.",
    tags: ["Data Pipeline", "Streamlit", "Time-series", "Visualisation"],
    year: "2020",
    journal: null,
    link: "https://covid19-data.streamlit.app",
  },
]

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateScrollState, { passive: true })
    updateScrollState()
    return () => el.removeEventListener("scroll", updateScrollState)
  }, [updateScrollState])

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current
    if (!el) return
    const slideWidth = el.querySelector("[data-slide]")?.clientWidth ?? 400
    el.scrollBy({
      left: direction === "left" ? -slideWidth - 24 : slideWidth + 24,
      behavior: "smooth",
    })
  }

  return (
    <section
      ref={sectionRef}
      id="research"
      className="relative py-24 md:py-32"
    >
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`flex items-end justify-between transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
              Research
            </p>
            <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
              Selected projects.
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70">
              Spanning <span className="highlight">astrophysics</span> and{" "}
              <span className="highlight">quantitative finance</span>, each built
              on reproducible pipelines and rigorous evaluation.
            </p>
          </div>

          {/* Navigation arrows */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={() => scroll("left")}
              disabled={!canScrollLeft}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all duration-150 hover:border-primary/30 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4 text-foreground/70" />
            </button>
            <button
              onClick={() => scroll("right")}
              disabled={!canScrollRight}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card transition-all duration-150 hover:border-primary/30 hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4 text-foreground/70" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className={`scrollbar-hide mt-12 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-6 pb-4 md:px-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          transitionDelay: "200ms",
        }}
      >
        {projects.map((project) => {
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
              data-slide
              {...linkProps}
              className={`group flex w-[85vw] max-w-[480px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border border-border bg-card transition-all duration-250 hover:border-primary/30 hover:scale-[1.02] ${
                project.link ? "cursor-pointer" : ""
              }`}
            >
              {/* Visual placeholder area */}
              <div className="relative flex h-52 items-center justify-center bg-secondary/60 md:h-64">
                <div className="flex flex-col items-center gap-2 text-foreground/30">
                  <div className="h-12 w-12 rounded-xl bg-foreground/5" />
                  <span className="text-xs">{"[Insert research plot or diagram]"}</span>
                </div>
                {project.link && (
                  <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-background/60 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <ArrowUpRight className="h-4 w-4 text-foreground/70" />
                  </div>
                )}
              </div>

              {/* Content area */}
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-primary">
                    {project.category}
                  </span>
                  <span className="text-xs text-foreground/50">
                    {project.year}
                  </span>
                </div>
                <h3 className="mt-3 text-lg font-semibold tracking-tight text-white md:text-xl">
                  {project.title}
                </h3>
                {project.journal && (
                  <p className="mt-1 text-sm font-medium text-primary/80">
                    {project.journal}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-foreground/70">
                  {project.description}
                </p>
                <div className="mt-auto pt-5">
                  <p className="text-xs leading-relaxed text-foreground/60">
                    {project.tags.join(" \u2022 ")}
                  </p>
                </div>
              </div>
            </Wrapper>
          )
        })}
      </div>

    </section>
  )
}
