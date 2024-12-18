// src/hooks/use-media-query.ts
"use client"
import { useState, useEffect } from "react"

export function useMediaQuery(query: string): boolean {
  // Comenzamos con false en el server-side
  const [matches, setMatches] = useState(false)

  useEffect(() => {
    // Verificamos que estamos en el cliente y que matchMedia está disponible
    if (typeof window !== "undefined" && typeof window.matchMedia !== "undefined") {
      const mediaQuery = window.matchMedia(query)

      // Establecer el valor inicial
      setMatches(mediaQuery.matches)

      // Crear el listener
      const handler = (event: MediaQueryListEvent) => {
        setMatches(event.matches)
      }

      // Agregar el listener
      mediaQuery.addEventListener("change", handler)

      // Cleanup
      return () => {
        mediaQuery.removeEventListener("change", handler)
      }
    }
    
    // Retornar undefined para SSR
    return undefined
  }, [query])

  return matches
}