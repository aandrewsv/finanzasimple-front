import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider"
import { ToastProvider } from "@/components/providers/toast-provider"
import { AuthProvider } from "@/contexts/auth-context";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";



const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FinanzaSimple",
  description: "Gestiona tus finanzas personales de manera simple y efectiva",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={geistMono.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>

            {children}
            <ToastProvider />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
