import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Scrum Poker",
  description: "A collaborative planning poker app for agile teams",
    generator: 'Kosha'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider> */}
         <AuthProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
