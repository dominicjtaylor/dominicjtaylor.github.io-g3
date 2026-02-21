"use client"

import { useEffect, useRef, useState } from "react"
import { FlaskConical, Globe } from "lucide-react"

const experiences = [
  {
    icon: FlaskConical,
    role: "PhD Researcher",
    org: "Durham University",
    period: "Oct 2022 -- Mar 2026",
    highlights: [
      "Led international projects managing resources equivalent to \u00a31.4M, overseeing design and execution of large-scale data workflows.",
      "Built scalable Python pipelines to process terabytes of data, cutting manual effort by ~80% and supplying reproducible results across hundreds of datasets.",
      "Trained and applied a machine learning autoencoder to identify signal in noisy data, increasing identification by ~20%.",
      "Applied SQL/ADQL queries within automated Python workflows to extract and integrate multi-terabyte astronomical archive datasets, reducing data access time by ~95%.",
      "Tutorial Demonstrator in undergraduate computational workshops, delivering hands-on guidance in Python programming and data analysis.",
    ],
  },
  {
    icon: Globe,
    role: "Startup Web Developer",
    org: "TutorMia",
    period: "2024",
    highlights: [
      "Designed and launched a responsive website contributing to a 200% increase in client acquisition.",
      "Maintained and iteratively improved with modern web development practices and Git-based workflows.",
    ],
  },
  {
    icon: FlaskConical,
    role: "Research Intern",
    org: "Leibniz-Institute for Astrophysics Potsdam, Germany",
    period: "Summer 2021",
    highlights: [
      "Engineered classification pipelines to combine two datasets and identify population members previously under-represented in literature.",
      "Reported findings in an academic paper published in MNRAS.",
    ],
  },
  {
    icon: FlaskConical,
    role: "Research Intern, SDSS-IV APOGEE-2",
    org: "Liverpool John Moores University ARI",
    period: "Summer 2020",
    highlights: [
      "Manipulated large datasets using Python, applying random sampling methods for comparative statistical analysis.",
      "Results reported in a peer-reviewed journal publication.",
    ],
  },
  {
    icon: FlaskConical,
    role: "Research Intern, LUX-ZEPLIN Collaboration",
    org: "University of Liverpool",
    period: "Summer 2019",
    highlights: [
      "Designed and implemented an interactive educational webpage using Streamlit to translate complex physics results into clear, user-friendly formats.",
    ],
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
        </div>

        {/* Timeline */}
        <div className="mt-16 flex flex-col gap-8">
          {experiences.map((exp, i) => (
            <div
              key={`${exp.role}-${exp.org}`}
              className={`group rounded-2xl border border-border bg-card p-6 transition-all duration-700 hover:border-primary/30 hover:bg-secondary md:p-8 ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 100}ms` }}
            >
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <exp.icon className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-lg font-semibold tracking-tight text-white">
                      {exp.role}
                    </h3>
                    <span className="text-xs font-medium text-foreground/50">
                      {exp.period}
                    </span>
                  </div>
                  <p className="mt-0.5 text-sm font-medium text-primary/80">
                    {exp.org}
                  </p>
                  <ul className="mt-3 flex flex-col gap-2">
                    {exp.highlights.map((h, j) => (
                      <li
                        key={j}
                        className="flex items-start gap-2 text-sm leading-relaxed text-foreground/70"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary/60" />
                        {h}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>


      </div>
    </section>
  )
}
