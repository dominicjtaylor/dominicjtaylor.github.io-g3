"use client"

import { useEffect, useRef, useState } from "react"

const experiences = [
  {
    period: "2023 — Present",
    role: "Quantitative Researcher",
    org: "Apex Capital",
    description:
      "Developing systematic equity and derivatives strategies. Building factor models and execution algorithms for a $2B multi-strategy fund.",
    skills: ["Python", "C++", "Statistical Arbitrage", "Risk Models"],
  },
  {
    period: "2021 — 2023",
    role: "Research Fellow, Astrophysics",
    org: "Caltech / JPL",
    description:
      "Led computational research on exoplanet characterization using JWST data. Published 4 first-author papers in The Astrophysical Journal.",
    skills: ["JWST", "Bayesian Inference", "HPC", "Spectral Analysis"],
  },
  {
    period: "2019 — 2021",
    role: "Data Scientist",
    org: "Stripe",
    description:
      "Built ML models for fraud detection and revenue optimization. Designed A/B testing frameworks processing 100M+ daily events.",
    skills: ["ML/AI", "A/B Testing", "SQL", "Spark"],
  },
  {
    period: "2017 — 2019",
    role: "Ph.D. Candidate",
    org: "MIT Department of Physics",
    description:
      "Doctoral research in computational astrophysics and statistical methods. Developed open-source tools for stellar population modeling.",
    skills: ["Fortran", "Python", "Monte Carlo", "N-body Simulations"],
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
      { threshold: 0.1 }
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
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            A path across disciplines.
          </h2>
        </div>

        <div className="relative mt-16">
          {/* Timeline line */}
          <div className="absolute top-0 bottom-0 left-0 hidden w-px bg-border md:left-[199px] md:block" />

          <div className="flex flex-col gap-12">
            {experiences.map((exp, i) => (
              <div
                key={exp.role}
                className={`flex flex-col gap-4 transition-all duration-700 md:flex-row md:gap-16 ${
                  visible
                    ? "translate-y-0 opacity-100"
                    : "translate-y-8 opacity-0"
                }`}
                style={{ transitionDelay: `${200 + i * 150}ms` }}
              >
                {/* Period */}
                <div className="shrink-0 md:w-[180px] md:text-right">
                  <span className="text-sm text-muted-foreground">
                    {exp.period}
                  </span>
                </div>

                {/* Timeline dot */}
                <div className="relative hidden md:block">
                  <div className="absolute top-1.5 left-[-4px] h-2 w-2 rounded-full bg-primary" />
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-xl font-semibold tracking-tight text-foreground">
                    {exp.role}
                  </h3>
                  <p className="mt-1 text-base font-medium text-primary">
                    {exp.org}
                  </p>
                  <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">
                    {exp.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {exp.skills.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
