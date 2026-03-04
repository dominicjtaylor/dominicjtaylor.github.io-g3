"use client"

import { useEffect, useRef, useState } from "react"
import { Github, Linkedin, Mail } from "lucide-react"

const socialLinks = [
  { icon: Github, label: "GitHub", href: "https://github.com/dominicjtaylor" },
  { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/in/dominic-taylor-004a8b196" },
  { icon: Mail, label: "Email", href: "mailto:dom.taylor111@gmail.com" },
]

export function Contact() {
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
      id="contact"
      className="relative py-24 md:py-32"
    >
      <div className="absolute top-0 left-1/2 h-px w-1/2 -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent" />

      <div className="mx-auto max-w-6xl px-6">
        <div
          className={`flex flex-col items-center text-center transition-all duration-1000 ${
            visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
          }`}
        >
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-primary">
            Contact
          </p>
          <h2 className="mt-4 text-balance text-3xl font-bold tracking-tight text-white md:text-5xl">
            {"Let's connect."}
          </h2>
          <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-foreground/70">
            Open to collaborations in{" "}
            <span className="highlight">research</span>,{" "}
            <span className="highlight">quantitative finance</span>, and
            data-driven projects. Always interested in discussing galaxies,
            markets, or methodology.
          </p>

          <a
            href="mailto:dom.taylor111@gmail.com"
            className="btn-accent mt-10 inline-flex h-12 min-w-[200px] items-center justify-center rounded-full px-8 text-sm font-medium text-white"
          >
            Send a Message
          </a>

          <div className="mt-12 flex items-center gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
                className="btn flex h-12 w-12 items-center justify-center rounded-full"
              >
                <link.icon className="h-5 w-5 text-white/70" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
