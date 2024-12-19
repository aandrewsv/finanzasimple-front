// src/app/app/layout.tsx
"use client"
import { Header } from "@/components/app/header"
import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { checkAuthAndRedirect, isCheckingAuth } = useAuth();

  useEffect(() => {
    checkAuthAndRedirect();
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  )
}
