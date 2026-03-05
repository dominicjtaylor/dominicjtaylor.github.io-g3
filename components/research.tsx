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

const N = projects.length
const COPIES = 3 // render 3 full copies: [copy0][copy1=center][copy2]
const TOTAL = N * COPIES
const CENTER_START = N // first index of the center copy

const GAP = 24

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cardW, setCardW] = useState(440)
  const [activeIndex, setActiveIndex] = useState(CENTER_START) // start on first card of center copy

  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const lastWheelTime = useRef(0)

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
      { threshold: 0.05 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── Stride (card + gap) ─────────────────────────────────── */
  const stride = cardW + GAP

  /* ── Compute track x to center a given index ─────────────── */
  const centerX = useCallback(
    (idx: number) => {
      // The track is a flex row. The left edge of card[i] = i * stride.
      // The center of card[i] = i * stride + cardW / 2.
      // We want that to be at viewport center, so:
      //   trackX + i * stride + cardW / 2 = viewportW / 2
      //   trackX = viewportW / 2 - i * stride - cardW / 2
      const vw = viewportRef.current?.offsetWidth ?? (typeof window !== "undefined" ? window.innerWidth : 1200)
      return vw / 2 - idx * stride - cardW / 2
    },
    [stride, cardW]
  )

  /* ── Track last index for overshoot direction ────────────── */
  const prevIndex = useRef(activeIndex)

  /* ── Animate to active index with elastic overshoot ──────── */
  const snapTo = useCallback(
    (idx: number, instant = false) => {
      const target = centerX(idx)
      if (instant) {
        x.jump(target)
        return
      }
      // Determine overshoot direction from navigation direction
      const dir = idx > prevIndex.current ? -1 : idx < prevIndex.current ? 1 : 0
      const overshoot = dir * 14 // 14px past target
      prevIndex.current = idx

      if (overshoot !== 0) {
        // Animate past, then settle back
        animate(x, target + overshoot, {
          type: "spring",
          stiffness: 400,
          damping: 28,
          mass: 0.7,
        }).then(() => {
          animate(x, target, {
            type: "spring",
            stiffness: 300,
            damping: 26,
            mass: 0.8,
          })
        })
      } else {
        animate(x, target, { type: "spring", stiffness: 300, damping: 30, mass: 0.8 })
      }
    },
    [centerX, x]
  )

  /* ── On mount + resize: center immediately ───────────────── */
  useEffect(() => {
    snapTo(activeIndex, true)
  }, [cardW]) // re-center when card width changes (resize)

  /* ── When activeIndex changes: animate to it, then check bounds ── */
  useEffect(() => {
    snapTo(activeIndex)

    // After animation, check if we need to jump to the center copy
    const timeout = setTimeout(() => {
      let newIdx = activeIndex
      if (activeIndex < N) {
        // In left clone region -> jump to center copy
        newIdx = activeIndex + N
      } else if (activeIndex >= N * 2) {
        // In right clone region -> jump to center copy
        newIdx = activeIndex - N
      }
      if (newIdx !== activeIndex) {
        x.jump(centerX(newIdx))
        setActiveIndex(newIdx)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [activeIndex, snapTo, centerX, x])

  /* ── Navigate helper ─────────────────────────────────────── */
  const go = useCallback((dir: number) => {
    setActiveIndex((prev) => prev + dir)
  }, [])

  /* ── Drag end handler ────────────────────────────────────── */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false
      const swipeThresh = stride * 0.12
      const velThresh = 150
      if (info.offset.x < -swipeThresh || info.velocity.x < -velThresh) {
        go(1)
      } else if (info.offset.x > swipeThresh || info.velocity.x > velThresh) {
        go(-1)
      } else {
        snapTo(activeIndex)
      }
    },
    [stride, go, snapTo, activeIndex]
  )

  /* ── Wheel / trackpad ────────────────────────────────────── */
  useEffect(() => {
    const el = viewportRef.current
    if (!el) return
    const handler = (e: WheelEvent) => {
      const absX = Math.abs(e.deltaX)
      const absY = Math.abs(e.deltaY)

      // Only handle predominantly horizontal gestures or shift+wheel
      const isHorizontal = absX > absY && absX > 8
      const isShiftWheel = e.shiftKey && absY > 8
      if (!isHorizontal && !isShiftWheel) return // let page scroll normally

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

  /* ── Build the tripled slide array ───────────────────────── */
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
        style={{ transitionDelay: "200ms", cursor: "grab", touchAction: "pan-x" }}
      >
        <motion.div
          className="flex"
          style={{ x, gap: GAP }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          onDragStart={() => { isDragging.current = true }}
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
              ? { href: project.link, target: "_blank" as const, rel: "noopener noreferrer" }
              : {}

            return (
              <motion.div
                key={slideIndex}
                className="shrink-0"
                style={{ width: cardW, zIndex }}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 300, damping: 28, mass: 0.8 }}
              >
                <Wrapper
                  {...linkProps}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-card transition-colors duration-200 ${
                    isActive
                      ? "border-primary/25 shadow-lg shadow-primary/5"
                      : "border-border"
                  } ${project.link ? "cursor-pointer" : ""}`}
                  onClick={(e: React.MouseEvent) => {
                    if (isDragging.current) { e.preventDefault(); return }
                    if (!isActive) {
                      e.preventDefault()
                      setActiveIndex(slideIndex)
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

        {/* Navigation buttons */}
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="Previous project"
          className="glass absolute left-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full md:left-5 md:h-11 md:w-11"
        >
          <span className="glass-edge" aria-hidden="true" />
          <ChevronLeft className="relative z-10 h-5 w-5 text-white/80" />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="Next project"
          className="glass absolute right-3 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full md:right-5 md:h-11 md:w-11"
        >
          <span className="glass-edge" aria-hidden="true" />
          <ChevronRight className="relative z-10 h-5 w-5 text-white/80" />
        </button>
      </div>
    </section>
  )
}
