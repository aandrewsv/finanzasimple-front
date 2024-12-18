// src/app/page.tsx
import { Navbar } from "@/components/landing/navbar"
import { AnimatedHero } from "@/components/landing/animated-hero"
import { Footer } from "@/components/landing/footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main>
        <AnimatedHero/>
        <Footer />
      </main>
    </div>
  )
}
