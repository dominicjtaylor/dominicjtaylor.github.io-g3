"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

/* ── Project data ───────────────────────────────────────────── */
const projects = [
  {
    domain: "Quant Finance",
    type: "ML Model",
    title: "Machine Learning Models for FX Volatility Forecasting",
    description:
      "Designed and evaluated ML models for forecasting FX volatility within a disciplined research pipeline. Built modular architecture for feature engineering, enforced strict in-sample/out-of-sample separation, and evaluated regime sensitivity with risk-adjusted metrics. Models were trained on multi-year historical data and validated across different market regimes.",
    tags: ["Time-series ML", "Backtesting", "Risk Evaluation", "Python"],
    year: "2026",
    journal: null,
    link: "https://github.com/dominicjtaylor/fx-volatility-forecasting",
    image: "/images/applied_model_dark.png",
  },
  {
    domain: "Astrophysics",
    type: "Machine Learning",
    title: "Galaxy Gas–Metal–Dust Cycles and ML Signal Extraction",
    description:
      "Analysed the gas–metallicity–dust cycle in massive star-forming galaxies at z~2. Designed and trained an autoencoder to detect weak emission-line structure in low signal-to-noise 1D spectra, integrating ML outputs into a physically interpretable inference pipeline. This approach enabled detection of signals previously hidden in the noise floor.",
    tags: ["Autoencoder", "Representation Learning", "Uncertainty Decomposition", "Bootstrap"],
    year: "In prep.",
    journal: "Taylor et al. — In preparation",
    link: null,
    image: "/images/mass_metallicity_dark.png",
  },
  {
    domain: "Astrophysics",
    type: "MNRAS Paper",
    title: "Modelling Molecular Gas Excitation in Distant Galaxies",
    description:
      "Characterised molecular gas excitation in high-redshift submillimetre galaxies using multi-transition CO spectroscopy. Quantified intrinsic diversity beyond single-template models and evaluated how excitation assumptions propagate into downstream gas mass estimates. Results inform calibration strategies for large galaxy surveys.",
    tags: ["Multi-variable Inference", "Sensitivity Analysis", "Calibration Risk"],
    year: "2025",
    journal: "Taylor et al. — MNRAS 2025",
    link: "https://academic.oup.com/mnras/article/536/2/1149/7909089",
    image: "/images/radex_conditions_dark.png",
  },
  {
    domain: "Quant Finance",
    type: "Backtest Tool",
    title: "Systematic Trading Strategy Backtesting Framework",
    description:
      "Developed a Python-based financial backtesting framework supporting modular trading strategies, moving average signals, and performance visualisation for systematic strategy evaluation. The framework enforces strict separation between signal generation and execution logic for realistic testing.",
    tags: ["Backtesting", "Systematic Trading", "Python", "Modular Design"],
    year: "2025",
    journal: null,
    link: "https://github.com/dominicjtaylor/quantlab",
    image: "/images/backtest.png",
  },
  {
    domain: "Astrophysics",
    type: "MNRAS Paper",
    title: "Data-Driven Analysis of the Milky Way Bulge Formation",
    description:
      "Investigated whether Terzan 5 is a primordial building block of the Milky Way bulge. Integrated heterogeneous stellar catalogues, standardised metallicity measurements across surveys, and compared full population distributions to evaluate competing formation scenarios. Published findings contributed to understanding of Galactic archaeology.",
    tags: ["Cross-source Data Harmonisation", "Bias Mitigation", "Distribution-level Statistics"],
    year: "2022",
    journal: "Taylor et al. — MNRAS 2022",
    link: "https://academic.oup.com/mnras/article/513/3/3429/6565286",
    image: "/images/terzan.png",
  },
  {
    domain: "Data Engineering",
    type: "Web App",
    title: "Interactive Web Application for COVID-19 Data Analysis",
    description:
      "Built an end-to-end data pipeline and interactive Streamlit dashboard for analysing evolving COVID-19 case data. Automated ingestion and cleaning of dynamic public datasets with rolling metrics and time-series aggregation. The tool provided real-time visualisations used by local public health discussions.",
    tags: ["Data Pipeline", "Streamlit", "Time-series", "Visualisation"],
    year: "2020",
    journal: null,
    link: "https://covid19-data.streamlit.app",
    image: "/images/covid_app.png",
  },
]

const N = projects.length
const COPIES = 3
const TOTAL = N * COPIES
const MID_START = N // first index of center copy

/* ── Spring settings ──────────────────────────────────────── */
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 100,
  damping: 20,
  mass: 1,
}

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cardW, setCardW] = useState(440)
  const [activeIndex, setActiveIndex] = useState(MID_START)
  const [isMobile, setIsMobile] = useState(false)

  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const lastWheelTime = useRef(0)
  const isAnimating = useRef(false)

  // Fixed gap: tighter on mobile, normal on desktop
  const gap = isMobile ? 8 : 24
  const stride = cardW + gap

  /* ── Measure card width ──────────────────────────────────── */
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      const mobile = vw < 768
      setIsMobile(mobile)
      // Mobile: 62vw cards; Desktop: wider cards (520px)
      if (mobile) {
        setCardW(vw * 0.62)
      } else {
        setCardW(Math.min(520, vw * 0.4))
      }
    }
    measure()
    window.addEventListener("resize", measure)
    return () => window.removeEventListener("resize", measure)
  }, [])

  /* ── Section entrance ────────────────────────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 },
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── Compute track x to center a given slide index ───────── */
  const centerX = useCallback(
    (idx: number) => {
      const vw =
        viewportRef.current?.offsetWidth ??
        (typeof window !== "undefined" ? window.innerWidth : 1200)
      return vw / 2 - idx * stride - cardW / 2
    },
    [stride, cardW],
  )

  /* ── Ref to skip animation on silent recenter ─────────────── */
  const skipAnim = useRef(false)

  /* ── Snap: smooth spring animation ──────────────────────── */
  const snapTo = useCallback(
    (idx: number, instant = false) => {
      const target = centerX(idx)
      if (instant) {
        x.jump(target)
        return
      }
      isAnimating.current = true
      animate(x, target, {
        ...SNAP_SPRING,
        onComplete: () => {
          isAnimating.current = false

          // After spring settles, silently recenter into middle copy
          let newIdx = idx
          if (idx < N) newIdx = idx + N
          else if (idx >= N * 2) newIdx = idx - N
          if (newIdx !== idx) {
            skipAnim.current = true
            x.jump(centerX(newIdx))
            setActiveIndex(newIdx)
          }
        },
      })
    },
    [centerX, x],
  )

  /* ── On mount + resize: center immediately ───────────────── */
  useEffect(() => {
    snapTo(activeIndex, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardW, isMobile])

  /* ── When activeIndex changes: animate (unless silent jump) ─ */
  useEffect(() => {
    if (skipAnim.current) {
      skipAnim.current = false
      return
    }
    snapTo(activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  /* ── Navigate exactly +-1 slide ──────────────────────────── */
  const go = useCallback((dir: number) => {
    if (isAnimating.current) return
    setActiveIndex((prev) => prev + dir)
  }, [])

  /* ── Drag end: advance slide if threshold crossed ────────── */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false
      const threshold = stride * 0.15
      const velThresh = 100
      if (info.offset.x < -threshold || info.velocity.x < -velThresh) {
        go(1)
      } else if (info.offset.x > threshold || info.velocity.x > velThresh) {
        go(-1)
      } else {
        snapTo(activeIndex)
      }
    },
    [stride, go, snapTo, activeIndex],
  )

  /* ── Wheel: horizontal-only, +-1 per gesture ────────────── */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)
      const isHorizontal = absX > absY && absX > 8
      const isShiftWheel = e.shiftKey && absY > 8
      if (!isHorizontal && !isShiftWheel) return

      const now = Date.now()
      if (now - lastWheelTime.current < 400) return
      lastWheelTime.current = now

      e.preventDefault()
      const delta = isHorizontal ? e.deltaX : e.deltaY
      go(delta > 0 ? 1 : -1)
    }
    el.addEventListener("wheel", handler, { passive: false })
    return () => el.removeEventListener("wheel", handler)
  }, [go])

  /* ── Tripled slide list ──────────────────────────────────── */
  const slides = Array.from({ length: TOTAL }, (_, i) => ({
    slideIndex: i,
    project: projects[i % N],
  }))

  /* ── Track visual index from x position ─────────────────── */
  const [visualIndex, setVisualIndex] = useState(activeIndex)
  
  useMotionValueEvent(x, "change", (latestX) => {
    const vw = viewportRef.current?.offsetWidth ?? window.innerWidth
    const centerOffset = vw / 2 - cardW / 2
    const idx = (centerOffset - latestX) / stride
    setVisualIndex(idx)
  })

  return (
    <section ref={sectionRef} id="research" className="relative py-24 md:py-32">
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      {/* Header */}
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
        ref={viewportRef}
        className={`carousel-edge-fade relative mt-12 overflow-hidden transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <motion.div
          className="flex"
          style={{ x, gap, cursor: "grab", touchAction: "pan-x" }}
          drag="x"
          dragConstraints={{ left: -stride, right: stride }}
          dragElastic={0.1}
          dragMomentum={false}
          onDragStart={() => {
            isDragging.current = true
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          {slides.map(({ slideIndex, project }) => {
            const dist = Math.abs(slideIndex - visualIndex)
            const isActive = dist < 0.5
            // All cards small (0.82), center scales to 1.0
            const scale = dist < 0.5 ? 1 : 0.82
            // Smooth opacity: center 1.0, neighbors fade
            const opacity = dist < 0.5 ? 1 : Math.max(0.15, 0.5 - dist * 0.2)
            const zIndex = Math.round(10 - dist)

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
                key={slideIndex}
                className="shrink-0"
                style={{ width: cardW, zIndex }}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              >
                <Wrapper
                  {...linkProps}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border transition-all duration-300 ${
                    isActive
                      ? "border-primary/30 shadow-lg shadow-primary/10"
                      : "border-border/50"
                  } ${project.link ? "cursor-pointer" : ""}`}
                  style={{ backgroundColor: "#222222" }}
                  onClick={(e: React.MouseEvent) => {
                    if (isDragging.current) {
                      e.preventDefault()
                      return
                    }
                    if (!isActive) {
                      e.preventDefault()
                      setActiveIndex(slideIndex)
                    }
                  }}
                >
                  {/* Image area */}
                  <div className={`relative flex aspect-[16/10] w-full items-center justify-center ${project.image ? "p-4 md:p-5" : ""} overflow-hidden`} style={{ backgroundColor: "#222222" }}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} visualization`}
                        className="h-full w-full rounded-xl object-contain"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2.5 text-foreground/25">
                        <div className="h-10 w-10 rounded-xl border border-foreground/10 bg-foreground/5" />
                        <span className="text-[11px] tracking-wide">
                          {"[Project graphic placeholder]"}
                        </span>
                      </div>
                    )}
                    {project.link && (
                      <div className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-background/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                        <ArrowUpRight className="h-3.5 w-3.5 text-foreground/60" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex flex-1 flex-col p-5 md:p-6">
                    {/* Domain / Type / Year tags */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase tracking-wider text-foreground/50">
                      <span>{project.domain}</span>
                      <span className="text-foreground/30">{"\u2022"}</span>
                      <span>{project.type}</span>
                      <span className="text-foreground/30">{"\u2022"}</span>
                      <span>{project.year}</span>
                    </div>
                    <h3 className="mt-2.5 text-base font-semibold leading-snug tracking-tight text-white md:text-lg">
                      {project.title}
                    </h3>
                    {project.journal && (
                      <p className="mt-1 text-sm font-medium text-primary/80">
                        {project.journal}
                      </p>
                    )}
                    <p className="mt-2 text-sm leading-relaxed text-foreground/80 text-justify">
                      {project.description}
                    </p>
                    <div className="mt-auto pt-4">
                      <p className="text-xs leading-relaxed text-foreground/65">
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

      {/* Grouped navigation buttons — centered below carousel */}
      <div className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="glass flex h-11 w-11 items-center justify-center rounded-full"
        >
          <span className="glass-edge" aria-hidden="true" />
          <ChevronLeft className="relative z-10 h-5 w-5 text-white/80" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="glass flex h-11 w-11 items-center justify-center rounded-full"
        >
          <span className="glass-edge" aria-hidden="true" />
          <ChevronRight className="relative z-10 h-5 w-5 text-white/80" />
        </button>
      </div>
    </section>
  )
}
