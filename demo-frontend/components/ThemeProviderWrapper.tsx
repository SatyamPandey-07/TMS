'use client'

import { ThemeProvider } from "@/contexts/ThemeContext"

export default function ThemeProviderWrapper({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>
}
