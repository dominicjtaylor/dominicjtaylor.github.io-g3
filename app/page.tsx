import { Navigation } from "@/components/navigation"
import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Research } from "@/components/research"
import { Methodology } from "@/components/methodology"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="relative min-h-svh bg-background text-foreground">
      <Navigation />
      <Hero />
      <About />
      <Research />
      <Methodology />
      <Contact />
      <Footer />
    </main>
  )
}
