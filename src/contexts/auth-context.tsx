// src/contexts/auth-context.tsx
"use client"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface User {
  _id: string
  email: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (userData: { _id: string; email: string; token: string }) => void
  logout: () => void
  isLoading: boolean
  checkAuthAndRedirect: () => void
  isCheckingAuth: boolean
  setIsCheckingAuth: React.Dispatch<React.SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Verificar si hay un token almacenado al cargar la página
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
    }
    setIsLoading(false)
    setIsCheckingAuth(false)
  }, [])

  const login = (userData: { _id: string; email: string; token: string }) => {
    setUser({ _id: userData._id, email: userData.email })
    setToken(userData.token)
    localStorage.setItem("token", userData.token)
    localStorage.setItem("user", JSON.stringify({ 
      _id: userData._id, 
      email: userData.email 
    }))
    router.push("/")
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/auth")
  }

  const checkAuthAndRedirect = () => {
    if (!user || !token) {
      router.push("/");
    } else {
      setIsCheckingAuth(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading, checkAuthAndRedirect, isCheckingAuth, setIsCheckingAuth }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}