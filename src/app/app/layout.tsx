// src/app/app/layout.tsx
import { Header } from "@/components/app/header"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      <Header />
      <main className="flex-1 flex">
        {children}
      </main>
    </div>
  )
}
