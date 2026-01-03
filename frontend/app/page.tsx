import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"

export default function LandingPage() {
  return (
    <div className="relative min-h-screen font-sans selection:bg-primary/30">
      <div className="fixed inset-0 grid-lines pointer-events-none opacity-20" />
      <Navbar />
      <main>
        <Hero />
      </main>
    </div>
  )
}
