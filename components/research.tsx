"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArrowUpRight } from "lucide-react"

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
  const [centerIndex, setCenterIndex] = useState(0)

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

  const updateCenterSlide = useCallback(() => {
    const el = scrollRef.current
    if (!el) return
    const scrollCenter = el.scrollLeft + el.clientWidth / 2
    const slides = el.querySelectorAll<HTMLElement>("[data-slide]")
    let closestIdx = 0
    let closestDist = Infinity
    slides.forEach((slide, i) => {
      const slideCenter = slide.offsetLeft + slide.offsetWidth / 2
      const dist = Math.abs(scrollCenter - slideCenter)
      if (dist < closestDist) {
        closestDist = dist
        closestIdx = i
      }
    })
    setCenterIndex(closestIdx)
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    el.addEventListener("scroll", updateCenterSlide, { passive: true })
    updateCenterSlide()
    return () => el.removeEventListener("scroll", updateCenterSlide)
  }, [updateCenterSlide])

  return (
    <section
      ref={sectionRef}
      id="research"
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
      </div>

      {/* Carousel -- no arrows, no dots, trackpad/swipe/wheel scroll */}
      <div
        ref={scrollRef}
        className={`scrollbar-hide mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{
          WebkitOverflowScrolling: "touch",
          transitionDelay: "200ms",
          paddingLeft: "max(1.5rem, calc((100vw - 440px) / 2))",
          paddingRight: "max(1.5rem, calc((100vw - 440px) / 2))",
        }}
      >
        {projects.map((project, i) => {
          const isCenter = i === centerIndex
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
              className={`group flex w-[82vw] max-w-[440px] shrink-0 snap-center flex-col overflow-hidden rounded-3xl border bg-card transition-all duration-500 ease-out ${
                isCenter
                  ? "scale-100 opacity-100 border-primary/25 shadow-lg shadow-primary/5"
                  : "scale-[0.92] opacity-70 border-border"
              } ${project.link ? "cursor-pointer" : ""}`}
            >
              {/* Image placeholder */}
              <div className="relative flex aspect-[16/10] items-center justify-center bg-secondary/50">
                <div className="flex flex-col items-center gap-2.5 text-foreground/25">
                  <div className="h-10 w-10 rounded-xl border border-foreground/10 bg-foreground/5" />
                  <span className="text-[11px] tracking-wide">
                    {"[Project graphic placeholder]"}
                  </span>
                </div>
                {project.link && (
                  <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    <ArrowUpRight className="h-3.5 w-3.5 text-foreground/60" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-5 md:p-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs font-medium uppercase tracking-widest text-primary">
                    {project.category}
                  </span>
                  <span className="text-xs text-foreground/40">
                    {project.year}
                  </span>
                </div>
                <h3 className="mt-2.5 text-base font-semibold tracking-tight text-white leading-snug md:text-lg">
                  {project.title}
                </h3>
                {project.journal && (
                  <p className="mt-1 text-sm font-medium text-primary/70">
                    {project.journal}
                  </p>
                )}
                <p className="mt-2 text-sm leading-relaxed text-foreground/60">
                  {project.description}
                </p>
                <div className="mt-auto pt-4">
                  <p className="text-xs leading-relaxed text-foreground/50">
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
