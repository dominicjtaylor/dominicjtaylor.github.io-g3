"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, animate } from "framer-motion"
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

const COUNT = projects.length

/* Wrap index into [0, COUNT) */
function wrap(i: number): number {
  return ((i % COUNT) + COUNT) % COUNT
}

/* Card width constants */
const CARD_W_MOBILE = 0.85 // 85vw
const CARD_W_DESKTOP = 440  // px
const GAP = 20              // px

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [cardWidth, setCardWidth] = useState(CARD_W_DESKTOP)

  /* Motion values for the track translateX */
  const rawX = useMotionValue(0)
  const x = useSpring(rawX, { stiffness: 300, damping: 35, mass: 0.8 })

  /* Wheel throttle */
  const wheelCooldownRef = useRef(false)
  const lastWheelTimeRef = useRef(0)

  /* ── Measure card width ──────────────────────────────────── */
  const measureCard = useCallback(() => {
    if (typeof window === "undefined") return CARD_W_DESKTOP
    const vw = window.innerWidth
    const w = vw < 768 ? vw * CARD_W_MOBILE : Math.min(CARD_W_DESKTOP, vw * 0.4)
    setCardWidth(w)
    return w
  }, [])

  useEffect(() => {
    measureCard()
    const handleResize = () => measureCard()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [measureCard])

  /* ── Section entrance observer ──────────────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── Compute track offset to center activeIndex ─────────── */
  const stride = cardWidth + GAP
  const getOffset = useCallback(
    (idx: number) => -idx * stride,
    [stride]
  )

  /* ── Snap to activeIndex ─────────────────────────────────── */
  useEffect(() => {
    rawX.set(getOffset(activeIndex))
  }, [activeIndex, getOffset, rawX])

  /* ── Navigate ────────────────────────────────────────────── */
  const goTo = useCallback((direction: number) => {
    setActiveIndex((prev) => prev + direction)
  }, [])

  /* ── Drag end handler ────────────────────────────────────── */
  const handleDragEnd = useCallback(
    (_: never, info: { offset: { x: number }; velocity: { x: number } }) => {
      const swipeThreshold = stride * 0.15
      const velocityThreshold = 200
      if (
        info.offset.x < -swipeThreshold ||
        info.velocity.x < -velocityThreshold
      ) {
        goTo(1)
      } else if (
        info.offset.x > swipeThreshold ||
        info.velocity.x > velocityThreshold
      ) {
        goTo(-1)
      } else {
        // Snap back
        rawX.set(getOffset(activeIndex))
      }
    },
    [stride, goTo, rawX, getOffset, activeIndex]
  )

  /* ── Wheel / trackpad ────────────────────────────────────── */
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      // Determine primary scroll axis
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      const delta = absX > absY ? e.deltaX : e.deltaY

      if (Math.abs(delta) < 15) return

      const now = Date.now()
      if (now - lastWheelTimeRef.current < 350) return
      lastWheelTimeRef.current = now

      e.preventDefault()

      if (delta > 0) {
        goTo(1)
      } else {
        goTo(-1)
      }
    }

    el.addEventListener("wheel", handleWheel, { passive: false })
    return () => el.removeEventListener("wheel", handleWheel)
  }, [goTo])

  /* ── Render slides: we render a window of slides around activeIndex ─ */
  const RENDER_RANGE = 3 // render -3..+3 around active = 7 slides visible
  const slides: { realIndex: number; offset: number }[] = []
  for (let i = -RENDER_RANGE; i <= RENDER_RANGE; i++) {
    slides.push({
      realIndex: wrap(activeIndex + i),
      offset: activeIndex + i,
    })
  }

  return (
    <section ref={sectionRef} id="research" className="relative py-24 md:py-32">
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

      {/* Carousel viewport */}
      <div
        ref={containerRef}
        className={`carousel-edge-fade relative mt-12 overflow-hidden transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "200ms", cursor: "grab" }}
      >
        <motion.div
          className="flex items-start justify-center"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          {slides.map(({ realIndex, offset }) => {
            const project = projects[realIndex]
            const distance = Math.abs(offset - activeIndex)
            const isCenter = distance === 0
            const scale = isCenter ? 1 : Math.max(0.88, 1 - distance * 0.04)
            const opacity = isCenter ? 1 : Math.max(0.35, 1 - distance * 0.25)

            const translateX = offset * stride

            const Wrapper = project.link ? "a" : "div"
            const linkProps = project.link
              ? {
                  href: project.link,
                  target: "_blank" as const,
                  rel: "noopener noreferrer",
                }
              : {}

            return (
              <motion.div
                key={`${realIndex}-${offset}`}
                className="shrink-0"
                style={{
                  width: cardWidth,
                  position: offset === activeIndex ? "relative" : "absolute",
                  left: "50%",
                  x: translateX - cardWidth / 2,
                  scale,
                  opacity,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Wrapper
                  {...linkProps}
                  className={`group flex flex-col overflow-hidden rounded-3xl border bg-card transition-colors duration-300 ${
                    isCenter
                      ? "border-primary/25 shadow-lg shadow-primary/5"
                      : "border-border"
                  } ${project.link ? "cursor-pointer" : ""}`}
                  onClick={(e: React.MouseEvent) => {
                    // Prevent link navigation if clicking a non-center card
                    if (!isCenter) {
                      e.preventDefault()
                      setActiveIndex(offset)
                    }
                  }}
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
                    <h3 className="mt-2.5 text-base font-semibold leading-snug tracking-tight text-white md:text-lg">
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
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </section>
  )
}
