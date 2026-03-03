"use client"

import { useEffect } from "react"

export function SvgFilterDebug() {
  useEffect(() => {
    const filter = document.getElementById("refraction")
    console.log("[v0] SVG filter #refraction element:", filter)
    if (!filter) {
      console.log("[v0] FILTER NOT FOUND - SVG is not mounting in the DOM")
    } else {
      console.log("[v0] FILTER FOUND - tagName:", filter.tagName, "parentElement:", filter.parentElement?.tagName)
    }
  }, [])

  return (
    <p
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        padding: "12px 24px",
        background: "rgba(255, 100, 50, 0.9)",
        color: "white",
        fontWeight: 700,
        fontSize: 14,
        borderRadius: 8,
        filter: "url(#refraction)",
      }}
    >
      SVG FILTER TEST - This text should be visibly distorted/wobbly
    </p>
  )
}
