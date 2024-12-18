// src/components/app/header.tsx
"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Plus, BarChart2, Menu, X, History } from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { useState } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function Header() {
  const pathname = usePathname()
  const { logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <div className="container flex h-14 max-w-[1400px] items-center">
        {/* Logo section */}
        <motion.div
          className="flex-shrink-0"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-blue-400 flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg md:text-xl">F</span>
            </div>
            <span className="text-lg md:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              FinanzaSimple
            </span>
          </Link>
        </motion.div>

        {/* Mobile menu button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="ml-auto md:hidden p-2"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-gray-500" />
          ) : (
            <Menu className="h-6 w-6 text-gray-500" />
          )}
        </button>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
          <DesktopNavItems pathname={pathname} />
        </nav>

        {/* Desktop logout button */}
        <div className="hidden md:block ml-auto">
          <LogoutButton onClick={logout} />
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm">
          <nav className="flex flex-col py-4">
            <MobileNavItems pathname={pathname} />
            <div className="px-4 pt-4 border-t border-gray-200 dark:border-gray-800">
              <LogoutButton onClick={logout} />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}

function DesktopNavItems({ pathname }: { pathname: string }) {
  return (
    <>
      <Link
        href="/app"
        className={cn(
          "transition-colors hover:text-gray-900 dark:hover:text-white",
          pathname === "/app" 
            ? "text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Registrar
        </span>
      </Link>
      <Link
        href="/app/historial"
        className={cn(
          "transition-colors hover:text-gray-900 dark:hover:text-white",
          pathname === "/app/historial" 
            ? "text-gray-900 dark:text-white" 
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <span className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historial
        </span>
      </Link>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="transition-colors text-gray-500 dark:text-gray-400 cursor-not-allowed flex items-center gap-2">
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
    </>
  )
}

function MobileNavItems({ pathname }: { pathname: string }) {
  return (
    <>
      <Link
        href="/app"
        className={cn(
          "px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
          pathname === "/app" 
            ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800" 
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <span className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Registrar
        </span>
      </Link>
      <Link
        href="/app/historial"
        className={cn(
          "px-4 py-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800",
          pathname === "/app/historial" 
            ? "text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800" 
            : "text-gray-500 dark:text-gray-400"
        )}
      >
        <span className="flex items-center gap-2">
          <History className="h-4 w-4" />
          Historial
        </span>
      </Link>
      <span className="px-4 py-2 flex items-center gap-2 text-gray-500 dark:text-gray-400">
        <BarChart2 className="h-4 w-4" />
        Estadísticas
        <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-700">
          Próximamente
        </span>
      </span>
    </>
  )
}

function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="text-sm text-red-500 hover:text-red-800 transition-colors"
    >
      Cerrar sesión
    </button>
  )
}