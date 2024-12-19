// src/app/app/layout.tsx
"use client"
import { Header } from "@/components/app/header"
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/app/loading-screen";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, token, isCheckingAuth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isCheckingAuth && (!user || !token)) {
      router.push("/");
    }
  }, [isCheckingAuth, user, token, router]);

  // Mostrar loading mientras verificamos auth o si no hay user/token
  if (isCheckingAuth || !user || !token) {
    return <LoadingScreen />;
  }

  // Solo renderizamos el contenido si hay usuario autenticado
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  )
}
