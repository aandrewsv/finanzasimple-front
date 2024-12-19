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
  isCheckingAuth: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const storedToken = localStorage.getItem("token")
        
        if (!storedToken) {
          throw new Error('No token found');
        }

        // Verificar el token con el backend
        const response = await fetch(`${process.env.BACK_URL}/api/auth/verify`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Token verification failed');
        }

        const data = await response.json();
        
        if (data.autenticado) {
          setUser(data.usuario);
          setToken(storedToken);
        } else {
          throw new Error('Token not authenticated');
        }

      } catch (error) {
        // Si hay cualquier error, limpiamos el estado
        console.error('Auth verification error:', error);
        setUser(null);
        setToken(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
      } finally {
        setIsLoading(false);
        setIsCheckingAuth(false);
      }
    };

    verifyAuth();
  }, [router]);

  const login = (userData: { _id: string; email: string; token: string }) => {
    setUser({ _id: userData._id, email: userData.email })
    setToken(userData.token)
    localStorage.setItem("token", userData.token)
    localStorage.setItem("user", JSON.stringify({ 
      _id: userData._id, 
      email: userData.email 
    }))
    router.push("/app")
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    router.push("/")
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      isLoading, 
      isCheckingAuth 
    }}>
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