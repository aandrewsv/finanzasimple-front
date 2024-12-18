// src/app/auth/page.tsx
"use client"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { ArrowLeft, Mail, KeyRound, Loader2 } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"




export default function AuthPage() {
  const router = useRouter()
  const { login, user, isLoading: isAuthLoading } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const [email, setEmail] = useState("") // Login
  const [password, setPassword] = useState("") // Login
  const [requestAccessEmail, setRequestAccessEmail] = useState("") // Solicitar acceso
  const { toast } = useToast()

  // Redireccionar si ya está autenticado
  useEffect(() => {
    if (!isAuthLoading && user) {
      router.push("/app")
    }
  }, [user, isAuthLoading, router])

    // Si está cargando o hay usuario, no mostrar nada
    if (isAuthLoading || user) {
      return null
    }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${process.env.BACK_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      console.log(response)
      
      if (!response.ok) throw new Error('Error al enviar la solicitud')
      
      const data = await response.json()
      login(data)

      toast({
        title: "Inicio de sesión correcto",
        description: "Bienvenido de nuevo!",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error al iniciar sesión",
        description: "Las credenciales no son válidas.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  
  }

  const handleAccessRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch('/api/request-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestAccessEmail }),
      })
      
      if (!response.ok) throw new Error('Error al enviar la solicitud')
      
      toast({
        title: "Solicitud enviada",
        description: "Te contactaré pronto con los detalles de acceso.",
      })
      setRequestAccessEmail("")
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo enviar la solicitud. Intenta nuevamente.",
      })
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Back button */}
        <Link 
          href="/"
          className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver al inicio
        </Link>

        <Card className="backdrop-blur-sm bg-white/90 dark:bg-gray-800/90 border-gray-200/50 dark:border-gray-700/50">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-gray-50">Bienvenido</CardTitle>
            <CardDescription className="text-gray-500 dark:text-gray-400">
              Accede a tu cuenta o solicita acceso
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">Iniciar Sesión</TabsTrigger>
                <TabsTrigger value="register">Solicitar Acceso</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      icon={<Mail className="h-4 w-4" />}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                    <Input
                      type="password"
                      placeholder="Contraseña"
                      icon={<KeyRound className="h-4 w-4" />}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Iniciar Sesión'
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleAccessRequest} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="correo@ejemplo.com"
                      icon={<Mail className="h-4 w-4" />}
                      value={requestAccessEmail}
                      onChange={(e) => setRequestAccessEmail(e.target.value)}
                      required
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Ingresa tu correo electrónico para solicitar acceso y cuando vea tu mensaje te contacto con las credenciales 😉.
                    </p>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      'Solicitar Acceso'
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}