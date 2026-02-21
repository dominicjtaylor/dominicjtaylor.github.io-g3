"use client"

import { useEffect, useRef, useState } from "react"
import { BarChart3, Telescope, TrendingUp } from "lucide-react"

const disciplines = [
  {
    icon: BarChart3,
    title: "Data Analytics",
    description:
      "Building scalable pipelines and ML models that transform raw data into actionable intelligence. Expertise in Python, SQL, and modern data stack.",
  },
  {
    icon: Telescope,
    title: "Astronomy Research",
    description:
      "Investigating exoplanet atmospheres and stellar evolution through computational methods. Published in peer-reviewed astrophysics journals.",
  },
  {
    icon: TrendingUp,
    title: "Quantitative Finance",
    description:
      "Designing systematic trading strategies and risk models. Applying statistical arbitrage and stochastic calculus to global markets.",
  },
]

export function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.15 }
    )
    if (sectionRef.current) observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            About
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-foreground md:text-5xl">
            Where curiosity meets precision.
          </h2>
          <p className="mt-6 max-w-3xl text-pretty text-lg leading-relaxed text-muted-foreground">
            I operate at the intersection of three worlds: the vastness of
            space, the complexity of financial markets, and the rigor of data
            science. Each discipline sharpens the others, creating a unique lens
            for pattern recognition and discovery.
          </p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {disciplines.map((item, i) => (
            <div
              key={item.title}
              className={`group rounded-2xl border border-border bg-card p-8 transition-all duration-700 hover:border-primary/30 hover:bg-secondary ${
                visible
                  ? "translate-y-0 opacity-100"
                  : "translate-y-8 opacity-0"
              }`}
              style={{ transitionDelay: `${200 + i * 150}ms` }}
            >
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold tracking-tight text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
