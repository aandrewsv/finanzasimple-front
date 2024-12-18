// src/components/app/header.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, BarChart2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container flex h-14 max-w-[1400px] items-center">
        <div className="mr-4 flex">
          <motion.div
            className="flex-shrink-0"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">F</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                FinanzaSimple
              </span>
            </Link>
          </motion.div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-gray-900 dark:hover:text-white",
                pathname === "/" 
                  ? "text-gray-900 dark:text-white" 
                  : "text-gray-500 dark:text-gray-400"
              )}
            >
              <span className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Registrar
              </span>
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span
                    className={cn(
                      "transition-colors text-gray-500 dark:text-gray-400 cursor-not-allowed flex items-center gap-2"
                    )}
                  >
                    <BarChart2 className="h-4 w-4" />
                    Estadísticas
                    <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
                      Próximamente
                    </span>
                  </span>
                </TooltipTrigger>
                <TooltipContent className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-gray-200 dark:border-gray-700">
                  <p>Esta funcionalidad estará disponible pronto</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </nav>
        </div>
        <div className="ml-auto">
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-800 transition-colors"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  )
}