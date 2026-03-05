"use client"

import { useEffect, useRef, useState } from "react"
import { GraduationCap } from "lucide-react"

const education = [
  {
    degree: "PhD Astrophysics",
    institution: "Durham University",
    location: "Durham, UK",
    period: "Oct 2022 \u2013 Mar 2026",
    detail:
      "Physical Properties of Submillimetre Galaxies from Integrated Gas Kinematics.",
  },
  {
    degree: "MPhys Astrophysics",
    institution: "University of Liverpool",
    location: "Liverpool, UK",
    period: "Oct 2017 \u2013 Jun 2021",
    detail:
      "First Class Honours. What influences the efficiency of galaxy formation?",
  },
]

export function Education() {
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
      id="education"
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
            Education
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            Academic background.
          </h2>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-foreground/70">
            Trained in <span className="highlight">physics</span> and{" "}
            <span className="highlight">data-driven research</span> from
            undergraduate through doctoral level.
          </p>
        </div>

        <div className="mt-16 flex flex-col gap-8">
          {education.map((item, i) => (
            <div
              key={item.degree}
              className={`group flex flex-col gap-6 rounded-2xl border border-border bg-card p-8 transition-all duration-150 hover:border-primary/30 hover:bg-secondary md:flex-row md:items-start md:gap-10 md:p-10 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              {/* Icon */}
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
                <GraduationCap className="h-7 w-7 text-primary" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-2xl font-bold tracking-tight text-white md:text-3xl">
                  {item.degree}
                </h3>
                <p className="mt-2 text-base font-medium text-primary/80">
                  {item.institution} &middot; {item.location}
                </p>
                <p className="mt-1 text-sm text-foreground/50">
                  {item.period}
                </p>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-foreground/70">
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
