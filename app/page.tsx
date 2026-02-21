import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Research } from "@/components/research"
import { Methodology } from "@/components/methodology"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { WebGLBackground } from "@/components/webgl-background"

export default function Home() {
  return (
    <main className="relative min-h-svh text-foreground">
      <WebGLBackground />
      <div className="relative z-10">
        <Navigation />
        <Hero />
        <div className="relative bg-background/90 backdrop-blur-sm">
          <About />
          <Research />
          <Methodology />
          <Contact />
          <Footer />
        </div>
      </div>
    </main>
  )
}
