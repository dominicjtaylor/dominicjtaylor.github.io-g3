"use client"

import { useEffect, useRef, useState } from "react"
import { Briefcase, GraduationCap } from "lucide-react"

interface TimelineEntry {
  type: "career" | "education"
  title: string
  org: string
  period: string
  summary: string
  sortKey: number
}

const entries: TimelineEntry[] = [
  {
    type: "education",
    title: "PhD Astrophysics",
    org: "Durham University",
    period: "2022 \u2013 2026",
    summary:
      "Physical Properties of Submillimetre Galaxies from Integrated Gas Kinematics.",
    sortKey: 2026,
  },
  {
    type: "career",
    title: "Startup Web Developer",
    org: "TutorMia",
    period: "2024",
    summary:
      "Designed and launched a responsive website contributing to a 200% increase in client acquisition.",
    sortKey: 2024,
  },
  {
    type: "education",
    title: "MPhys Astrophysics",
    org: "University of Liverpool",
    period: "2017 \u2013 2021",
    summary:
      "First Class Honours. What influences the efficiency of galaxy formation?",
    sortKey: 2021,
  },
  {
    type: "career",
    title: "Research Intern",
    org: "Leibniz-Institute for Astrophysics Potsdam, Germany",
    period: "2021",
    summary:
      "Engineered classification pipelines to identify under-represented stellar populations. Published findings in MNRAS.",
    sortKey: 2021,
  },
  {
    type: "career",
    title: "Research Intern, SDSS-IV APOGEE-2",
    org: "Liverpool John Moores University ARI",
    period: "2020",
    summary:
      "Applied random sampling methods for comparative statistical analysis on large astronomical datasets.",
    sortKey: 2020,
  },
  {
    type: "career",
    title: "Research Intern, LUX-ZEPLIN Collaboration",
    org: "University of Liverpool",
    period: "2019",
    summary:
      "Built an interactive Streamlit application translating complex physics results into accessible formats.",
    sortKey: 2019,
  },
]

// Sort newest first by end year
const sorted = [...entries].sort((a, b) => b.sortKey - a.sortKey)

export function Timeline() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

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

  return (
    <section
      ref={sectionRef}
      id="experience"
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
            Timeline
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            Experience & education.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70">
            From <span className="highlight">international research</span> to
            building <span className="highlight">scalable systems</span>,
            spanning a decade of academic and applied work.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative mt-16 ml-4 md:ml-0">
          {/* Connecting line */}
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-primary/40 via-border to-transparent md:left-[7.5rem]" />

          {/* Upward arrow at top */}
          <div className="absolute left-[7px] -top-2 md:left-[7.12rem]">
            <div className="h-0 w-0 border-x-4 border-b-[6px] border-x-transparent border-b-primary/50" />
          </div>

          <div className="flex flex-col gap-10">
            {sorted.map((entry, i) => {
              const Icon = entry.type === "education" ? GraduationCap : Briefcase
              return (
                <div
                  key={`${entry.title}-${entry.org}`}
                  className={`group relative flex flex-col gap-1 pl-10 md:flex-row md:items-start md:gap-8 md:pl-0 transition-all duration-700 ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-6 opacity-0"
                  }`}
                  style={{ transitionDelay: `${300 + i * 100}ms` }}
                >
                  {/* Period label -- desktop */}
                  <div className="hidden w-24 shrink-0 pt-0.5 text-right md:block">
                    <span className="text-xs font-medium text-foreground/45">
                      {entry.period}
                    </span>
                  </div>

                  {/* Node */}
                  <div className="absolute left-0 top-0.5 md:static md:mt-0.5">
                    <div className="relative flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card transition-all duration-200 group-hover:border-primary/40">
                      <Icon className="h-3 w-3 text-primary/70 transition-colors duration-200 group-hover:text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    {/* Period -- mobile */}
                    <span className="text-xs font-medium text-foreground/45 md:hidden">
                      {entry.period}
                    </span>
                    <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
                      {entry.title}
                    </h3>
                    <p className="mt-0.5 text-sm font-medium text-primary/70">
                      {entry.org}
                    </p>
                    <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-foreground/60">
                      {entry.summary}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
