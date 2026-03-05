"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, animate } from "framer-motion"
import { ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"

/* ── Project data ───────────────────────────────────────────── */
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
    image: "/images/applied_model_dark.png",
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
    image: "/images/mass_metallicity_dark.png",
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
    image: "/images/radex_conditions_dark.png",
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
    image: "/images/backtest.png",
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
    image: null,
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
    image: null,
  },
]

const N = projects.length
const COPIES = 3
const TOTAL = N * COPIES
const MID_START = N // first index of center copy
const GAP = 24

/* ── Spring: critically-damped, no overshoot ──────────────── */
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 320,
  damping: 38,
  mass: 1,
}

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cardW, setCardW] = useState(440)
  const [activeIndex, setActiveIndex] = useState(MID_START)

  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const lastWheelTime = useRef(0)
  const isAnimating = useRef(false)

  /* ── Measure card width ──────────────────────────────────── */
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      setCardW(vw < 768 ? vw * 0.85 : Math.min(440, vw * 0.38))
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

  const stride = cardW + GAP

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

  /* ── Snap: clean spring, guard against overlapping anims ─── */
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
  }, [cardW])

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

  /* ── Drag end: max +-1 slide per gesture ─────────────────── */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false
      const threshold = stride * 0.15
      const velThresh = 200
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
      if (now - lastWheelTime.current < 450) return
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
        style={{ transitionDelay: "200ms", touchAction: "pan-y pinch-zoom" }}
      >
        <motion.div
          className="flex"
          style={{ x, gap: GAP, cursor: "grab" }}
          drag="x"
          dragConstraints={{ left: -stride, right: stride }}
          dragElastic={0.12}
          dragMomentum={false}
          onDragStart={() => {
            isDragging.current = true
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          {slides.map(({ slideIndex, project }) => {
            const dist = Math.abs(slideIndex - activeIndex)
            const isActive = dist === 0
            const scale = isActive ? 1 : dist === 1 ? 0.92 : 0.88
            const opacity = isActive ? 1 : dist === 1 ? 0.30 : 0.10
            const zIndex = 10 - dist

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
                transition={SNAP_SPRING}
              >
                <Wrapper
                  {...linkProps}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-colors duration-150 ${
                    isActive
                      ? "border-primary/25 shadow-lg shadow-primary/5"
                      : "border-border"
                  } ${project.link ? "cursor-pointer" : ""}`}
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
                  <div className={`relative flex aspect-[16/9] items-center justify-center ${project.image ? "p-5 md:p-6" : ""} overflow-hidden bg-secondary/50`}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} visualization`}
                        className="h-full w-full rounded-2xl object-cover"
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
