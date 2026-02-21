"use client"

import { useEffect, useRef, useState } from "react"
import { GraduationCap } from "lucide-react"

const education = [
  {
    icon: GraduationCap,
    degree: "PhD Astrophysics",
    institution: "Durham University",
    location: "Durham, UK",
    period: "Oct 2022 -- Mar 2026",
    detail:
      "Thesis: Physical Properties of Submillimetre Galaxies from Integrated Gas Kinematics.",
  },
  {
    icon: GraduationCap,
    degree: "MPhys Astrophysics",
    institution: "University of Liverpool",
    location: "Liverpool, UK",
    period: "Oct 2017 -- Jun 2021",
    detail:
      "First Class Honours. Thesis: What influences the efficiency of galaxy formation?",
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
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {education.map((item, i) => (
            <div
              key={item.degree}
              className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/30 hover:bg-secondary ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-white">
                {item.degree}
              </h3>
              <p className="mt-1 text-sm font-medium text-primary/80">
                {item.institution} &middot; {item.location}
              </p>
              <p className="mt-0.5 text-xs text-foreground/50">
                {item.period}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">
                {item.detail}
              </p>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
