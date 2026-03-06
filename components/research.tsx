"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, animate, useMotionValueEvent } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

/* ── Featured Project data ──────────────────────────────────── */
const featuredProject = {
  title: "Machine Learning Models for FX Volatility",
  description: [
    "Financial markets generate highly noisy and non-linear time-series data, making reliable volatility forecasting difficult. This project investigates whether machine learning methods can extract predictive structure from foreign-exchange market behaviour using historical price data and engineered time-series features.",
    "A modelling pipeline was developed in Python to construct features from historical FX data and train machine learning models designed to learn patterns in volatility dynamics. The approach evaluates model performance against baseline volatility estimators to determine whether statistical learning techniques can improve predictive accuracy in noisy financial environments.",
    "The results demonstrate that data-driven models can identify meaningful predictive signals within FX time series, highlighting how machine learning methods can complement traditional statistical approaches in modelling complex financial systems.",
  ],
  tags: ["Python", "Machine Learning", "Time-Series Modelling", "Financial Data"],
  link: "https://github.com/dominicjtaylor/fx-volatility-forecasting",
  image: "/images/applied_model_dark.png",
}

/* ── Project data ───────────────────────────────────────────── */
const projects = [
  {
    domain: "Astrophysics",
    type: "Machine Learning",
    title: "Galaxy Gas–Metal–Dust Cycles and ML Signal Extraction",
    description:
      "Understanding how gas, metals, and dust evolve together in galaxies is key to explaining the regulation of star formation and galaxy growth. This project combines observational measurements with machine learning techniques to analyse relationships between these components across galaxy datasets, revealing patterns that help constrain the physical processes governing galaxy evolution.",
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
      "Interpreting molecular line emission from galaxies requires understanding how gas excitation depends on the physical conditions of the interstellar medium. This project models molecular gas excitation using observational constraints to explore how different gas phases contribute to observed emission, providing insights into the structure and energetics of star-forming galaxies.",
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
      "Evaluating trading strategies requires robust testing against historical market data to distinguish genuine signals from noise. This project implements a Python-based backtesting framework for systematic trading strategies, enabling strategies to be tested across historical price series while analysing performance metrics such as returns, volatility, and risk-adjusted outcomes.",
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
      "The formation history of the Milky Way's bulge remains an open question in galactic archaeology. This project analyses large stellar datasets using statistical methods to investigate structural and chemical patterns within the bulge population, providing constraints on competing scenarios for how the central regions of the Galaxy formed.",
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
      "Public health data became a critical resource during the COVID-19 pandemic, but communicating trends clearly required accessible visual tools. This project developed an interactive web application that allows users to explore COVID-19 datasets through dynamic visualisations, enabling intuitive exploration of infection trends and regional patterns.",
    tags: ["Data Pipeline", "Streamlit", "Time-series", "Visualisation"],
    year: "2020",
    journal: null,
    link: "https://covid19-data.streamlit.app",
    image: "/images/covid_app.png",
  },
]

const N = projects.length

/* ── Spring settings - responsive and smooth ──────────────── */
const SNAP_SPRING = {
  type: "spring" as const,
  stiffness: 150,
  damping: 22,
  mass: 0.8,
}

export function Research() {
  const sectionRef = useRef<HTMLElement>(null)
  const viewportRef = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [cardW, setCardW] = useState(520)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isMobile, setIsMobile] = useState(false)
  const [viewportWidth, setViewportWidth] = useState(1200)

  const x = useMotionValue(0)
  const isDragging = useRef(false)
  const lastWheelTime = useRef(0)
  const isAnimating = useRef(false)

  // Gap: tighter on mobile, normal on desktop
  const gap = isMobile ? 12 : 32
  const stride = cardW + gap

  /* ── Measure card width and viewport ─────────────────────── */
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth
      const mobile = vw < 768
      setIsMobile(mobile)
      setViewportWidth(vw)
      // Mobile: 78vw cards; Desktop: larger cards (620px max)
      if (mobile) {
        setCardW(vw * 0.78)
      } else {
        setCardW(Math.min(620, vw * 0.48))
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

  /* ── Compute track x to align active card with section padding ─ */
  const centerX = useCallback(
    (idx: number) => {
      // Use same padding as section titles (px-6 = 24px, max-w-6xl centered)
      // On mobile: 24px left padding; Desktop: calc to align with "Selected projects"
      // Use viewportWidth state (never access window directly in callback)
      const padding = isMobile ? 24 : Math.max(24, (viewportWidth - 1152) / 2 + 24)
      return padding - idx * stride
    },
    [stride, isMobile, viewportWidth],
  )

  /* ── Snap: smooth spring animation ─���────────────────────── */
  const snapTo = useCallback(
    (idx: number, instant = false) => {
      // Clamp to valid range
      const clampedIdx = Math.max(0, Math.min(N - 1, idx))
      const target = centerX(clampedIdx)
      if (instant) {
        x.jump(target)
        return
      }
      isAnimating.current = true
      animate(x, target, {
        ...SNAP_SPRING,
        onComplete: () => {
          isAnimating.current = false
        },
      })
    },
    [centerX, x],
  )

  /* ── On mount + resize: position immediately ───────────────── */
  useEffect(() => {
    snapTo(activeIndex, true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cardW, isMobile])

  /* ── When activeIndex changes: animate ─ */
  useEffect(() => {
    snapTo(activeIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex])

  /* ── Navigate exactly +-1 slide (clamped) ────────────────── */
  const go = useCallback((dir: number) => {
    if (isAnimating.current) return
    setActiveIndex((prev) => Math.max(0, Math.min(N - 1, prev + dir)))
  }, [])

  /* ── Drag end: advance slide if any meaningful movement ──── */
  const handleDragEnd = useCallback(
    (_: unknown, info: { offset: { x: number }; velocity: { x: number } }) => {
      isDragging.current = false
      // Ultra-low thresholds - even small swipes should trigger
      const offsetThreshold = 10 // Just 10px movement
      const velocityThreshold = 15 // Very low velocity threshold
      
      const movedLeft = info.offset.x < -offsetThreshold || info.velocity.x < -velocityThreshold
      const movedRight = info.offset.x > offsetThreshold || info.velocity.x > velocityThreshold
      
      if (movedLeft && activeIndex < N - 1) {
        // Move to next card
        go(1)
      } else if (movedRight && activeIndex > 0) {
        // Move to previous card - always works with small swipes
        go(-1)
      } else {
        // Snap back to current card
        snapTo(activeIndex)
      }
    },
    [go, snapTo, activeIndex],
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

  /* ── Track visual index from x position ─────────────────── */
  const [visualIndex, setVisualIndex] = useState(activeIndex)
  
  useMotionValueEvent(x, "change", (latestX) => {
    const padding = isMobile ? 24 : 48
    const idx = (padding - latestX) / stride
    setVisualIndex(idx)
  })

  /* ── Pill slider width calculation ──────────────────────── */
  const sliderTrackWidth = isMobile ? 200 : 140
  const pillWidth = sliderTrackWidth / N
  const pillOffset = (activeIndex / (N - 1)) * (sliderTrackWidth - pillWidth)

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

      {/* Featured Project */}
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`mt-16 transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "100ms" }}
        >
          <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
            Featured Project
          </h3>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-card">
            {/* Image - full width banner, natural height based on image aspect ratio */}
            <div className="pt-6 md:pt-8 px-6 md:px-8">
              <img
                src={featuredProject.image}
                alt={`${featuredProject.title} visualization`}
                className="w-full h-auto block"
                crossOrigin="anonymous"
              />
            </div>
            {/* Content - spacing below image */}
            <div className="px-6 pb-6 pt-8 md:px-8 md:pb-8 md:pt-10">
              <h4 className="text-xl font-semibold tracking-tight text-white md:text-2xl">
                {featuredProject.title}
              </h4>
              <div className="mt-4 space-y-4">
                {featuredProject.description.map((para, idx) => (
                  <p key={idx} className="text-sm leading-relaxed text-foreground/80 text-justify md:text-base">
                    {para}
                  </p>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-3">
                <a
                  href={featuredProject.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary/10 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                >
                  View on GitHub
                  <ArrowUpRight className="h-4 w-4" />
                </a>
              </div>
              <div className="mt-4">
                <p className="text-xs leading-relaxed text-foreground/65">
                  {featuredProject.tags.join(" \u2022 ")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Other Projects Header */}
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`mt-20 transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
          style={{ transitionDelay: "150ms" }}
        >
          <h3 className="text-lg font-semibold tracking-tight text-white md:text-xl">
            Other Projects
          </h3>
          <p className="mt-2 max-w-2xl text-pretty text-base leading-relaxed text-foreground/60">
            Additional projects exploring how complex data can reveal structure in physical and observational systems.
          </p>
        </div>
      </div>

      {/* Carousel viewport */}
      <div
        ref={viewportRef}
        className={`relative mt-12 overflow-hidden transition-all duration-1000 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
        }`}
        style={{ transitionDelay: "200ms" }}
      >
        <motion.div
          className="flex"
          style={{ x, gap, cursor: "grab", touchAction: "pan-x" }}
          drag="x"
          dragConstraints={{ 
            left: centerX(N - 1) - stride * 0.2, 
            right: centerX(0) + (activeIndex === 0 ? 0 : stride * 0.2) 
          }}
          dragElastic={0.15}
          dragMomentum={false}
          onDragStart={() => {
            isDragging.current = true
          }}
          onDragEnd={handleDragEnd}
          whileDrag={{ cursor: "grabbing" }}
        >
          {projects.map((project, slideIndex) => {
            // Distance from active - use visualIndex for smooth interpolation
            const dist = slideIndex - visualIndex
            const absDist = Math.abs(dist)
            const isActive = absDist < 0.5
            
            // Scale: center 1.0, others 0.88
            const scale = absDist < 0.5 ? 1 : 0.88
            
            // Opacity: active card always full opacity
            // First card (index 0) never fades on mobile
            // Neighbors fade with gradient (left brighter, right more faded)
            let opacity: number
            if (absDist < 0.5) {
              // Active card - never fade
              opacity = 1
            } else if (slideIndex === 0 && isMobile) {
              // First card on mobile - never fade
              opacity = 1
            } else if (isMobile) {
              // Mobile gradient: left neighbors brighter, right neighbors more faded
              if (dist > 0) {
                // Cards to the right - gradient from brighter (left edge) to faded (right edge)
                opacity = Math.max(0.35, 0.6 - dist * 0.12)
              } else {
                // Cards to the left (previous) - less faded
                opacity = Math.max(0.45, 0.7 - absDist * 0.12)
              }
            } else {
              // Desktop: neighbors uniformly faded
              opacity = Math.max(0.25, 0.5 - absDist * 0.1)
            }
            
            const zIndex = Math.round(10 - absDist)

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
                style={{ 
                  width: cardW, 
                  zIndex,
                }}
                animate={{ scale, opacity }}
                transition={{ type: "spring", stiffness: 100, damping: 16, mass: 0.9 }}
              >
                <Wrapper
                  {...linkProps}
                  className={`group flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-card transition-all duration-300 ${
                    isActive ? "shadow-lg shadow-black/20" : ""
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
                  {/* Image area - natural height, no fixed aspect ratio */}
                  <div className={`relative w-full overflow-hidden bg-card ${project.image ? "px-3 pt-4 md:px-4 md:pt-5" : "flex aspect-[16/9] items-center justify-center"}`}>
                    {project.image ? (
                      <img
                        src={project.image}
                        alt={`${project.title} visualization`}
                        className="w-full h-auto block"
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

      {/* Apple-style pill slider indicator */}
      <div className="mt-8 flex items-center justify-center">
        <div 
          className="relative h-1.5 rounded-full bg-foreground/10"
          style={{ width: sliderTrackWidth }}
        >
          <motion.div
            className="absolute top-0 h-full rounded-full bg-primary/80"
            style={{ width: pillWidth }}
            animate={{ x: pillOffset }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </div>
      </div>

      {/* Dot indicators for direct navigation */}
      <div className={`mt-4 flex items-center justify-center ${isMobile ? "gap-4" : "gap-3"}`}>
        {projects.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setActiveIndex(idx)}
            aria-label={`Go to project ${idx + 1}`}
            className={`rounded-full transition-all duration-500 ease-out ${
              isMobile ? "h-3 w-3" : "h-2.5 w-2.5"
            } ${
              idx === activeIndex 
                ? "bg-primary scale-150 shadow-sm shadow-primary/50" 
                : "bg-foreground/30 hover:bg-foreground/50"
            }`}
          />
        ))}
      </div>
    </section>
  )
}
