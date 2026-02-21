"use client"

import { useState, useEffect } from "react"

const navLinks = [
  { label: "About", href: "#about" },
  { label: "Research", href: "#research" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Methodology", href: "#methodology" },
  { label: "Contact", href: "#contact" },
]

export function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener("scroll", handler, { passive: true })
    return () => window.removeEventListener("scroll", handler)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
        }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <a
          href="#"
          className="text-lg font-semibold tracking-tight text-white"
        >
          Dominic Taylor
        </a>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-foreground/70 transition-colors duration-300 hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-11 w-11 items-center justify-center md:hidden"
          aria-label="Toggle navigation"
        >
          <div className="flex flex-col gap-1.5">
            <span
              className={`block h-px w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "translate-y-[3.5px] rotate-45" : ""
                }`}
            />
            <span
              className={`block h-px w-5 bg-foreground transition-all duration-300 ${mobileOpen ? "-translate-y-[3.5px] -rotate-45" : ""
                }`}
            />
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`overflow-hidden transition-all duration-500 md:hidden ${mobileOpen ? "max-h-96" : "max-h-0"
          }`}
      >
        <div className="flex flex-col gap-1 border-t border-border bg-background/95 px-6 py-4 backdrop-blur-xl">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg py-3 text-base text-foreground/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
