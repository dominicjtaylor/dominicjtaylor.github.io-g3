"use client"

import dynamic from "next/dynamic"

const WebGLBackground = dynamic(
  () =>
    import("@/components/webgl-background").then((mod) => mod.WebGLBackground),
  { ssr: false }
)

export function WebGLWrapper() {
  return <WebGLBackground />
}
