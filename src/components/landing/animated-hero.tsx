// src/components/landing/animated-hero.tsx
"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LogIn } from "lucide-react"
// import { UserPlus } from "lucide-react"

export function AnimatedHero() {
  const quote = {
    text: "El precio de cualquier cosa es la cantidad de vida que intercambias por ella.",
    author: "Henry David Thoreau"
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.blue.900),theme(colors.gray.900))] opacity-20" />
      
      <div className="max-w-2xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-12"
        >
          {/* Quote */}
          <div className="mb-16">
            <blockquote className="text-lg italic text-gray-600 dark:text-gray-300">
              &quot;{quote.text}&quot;
            </blockquote>
            <cite className="text-sm text-gray-500 dark:text-gray-400 mt-2 block">
              — {quote.author}
            </cite>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 text-white shadow-md hover:shadow-lg transition-all duration-300"
            >
              <Link href="/auth" className="flex items-center">
                <LogIn className="mr-2 h-5 w-5" />
                Entrar
              </Link>
            </Button>
            
            {/* <Button
              asChild
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
            >
              <Link href="/register" className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Boton 2
              </Link>
            </Button> */}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
