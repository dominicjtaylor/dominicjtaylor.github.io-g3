"use client"

import { useEffect, useRef, useState } from "react"

const experiences = [
  {
    role: "PhD Researcher",
    org: "Durham University",
    period: "Oct 2022 \u2013 Mar 2026",
    summary:
      "Led international research projects, built scalable Python pipelines for terabyte-scale data, and applied ML autoencoders for signal extraction in noisy datasets.",
  },
  {
    role: "Startup Web Developer",
    org: "TutorMia",
    period: "2024",
    summary:
      "Designed and launched a responsive website contributing to a 200% increase in client acquisition.",
  },
  {
    role: "Research Intern",
    org: "Leibniz-Institute for Astrophysics Potsdam, Germany",
    period: "Summer 2021",
    summary:
      "Engineered classification pipelines to identify under-represented stellar populations. Published findings in MNRAS.",
  },
  {
    role: "Research Intern, SDSS-IV APOGEE-2",
    org: "Liverpool John Moores University ARI",
    period: "Summer 2020",
    summary:
      "Applied random sampling methods for comparative statistical analysis on large astronomical datasets.",
  },
  {
    role: "Research Intern, LUX-ZEPLIN Collaboration",
    org: "University of Liverpool",
    period: "Summer 2019",
    summary:
      "Built an interactive Streamlit application translating complex physics results into accessible formats.",
  },
]

export function Experience() {
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
            Experience
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            Career timeline.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70">
            From <span className="highlight">international research</span> to
            building <span className="highlight">scalable systems</span>.
          </p>
        </div>

        {/* Vertical timeline */}
        <div className="relative mt-16 ml-4 md:ml-0">
          {/* Connecting line */}
          <div className="absolute left-3 top-2 bottom-2 w-px bg-gradient-to-b from-primary/40 via-border to-border md:left-[7.5rem]" />

          <div className="flex flex-col gap-10">
            {experiences.map((exp, i) => (
              <div
                key={`${exp.role}-${exp.org}`}
                className={`group relative flex flex-col gap-1 pl-10 md:flex-row md:items-start md:gap-8 md:pl-0 transition-all duration-700 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-6 opacity-0"
                }`}
                style={{ transitionDelay: `${300 + i * 120}ms` }}
              >
                {/* Period label — desktop only */}
                <div className="hidden w-24 shrink-0 pt-0.5 text-right md:block">
                  <span className="text-xs font-medium text-foreground/50">
                    {exp.period}
                  </span>
                </div>

                {/* Node dot */}
                <div className="absolute left-1 top-1.5 md:static md:mt-1.5">
                  <div className="relative flex h-5 w-5 items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-primary/70 ring-[3px] ring-background transition-all duration-200 group-hover:bg-primary group-hover:scale-110" />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  {/* Period — mobile only */}
                  <span className="text-xs font-medium text-foreground/50 md:hidden">
                    {exp.period}
                  </span>
                  <h3 className="text-base font-semibold tracking-tight text-white md:text-lg">
                    {exp.role}
                  </h3>
                  <p className="mt-0.5 text-sm font-medium text-primary/80">
                    {exp.org}
                  </p>
                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-foreground/60">
                    {exp.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Arrow at top indicating "present" */}
          <div className="absolute left-[7px] -top-2 md:left-[7.12rem]">
            <div className="h-0 w-0 border-x-4 border-b-[6px] border-x-transparent border-b-primary/60" />
          </div>
        </div>
      </div>
    </section>
  )
}
