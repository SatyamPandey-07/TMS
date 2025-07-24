'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
  theme: Theme
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user has a theme preference in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
    setTheme(initialTheme)
    applyTheme(initialTheme)
    setIsLoading(false)
  }, [])

  const applyTheme = (newTheme: Theme) => {
    const root = document.documentElement
    const body = document.body
    
    // Remove previous theme classes
    root.classList.remove('dark')
    body.classList.remove('sparkle', 'glow', 'theme-transition')
    
    if (newTheme === 'dark') {
      root.classList.add('dark')
      body.classList.add('glow', 'theme-transition')
    } else {
      body.classList.add('sparkle', 'theme-transition')
    }
    
    // Add smooth transition
    body.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
    setTimeout(() => {
      body.style.transition = ''
    }, 400)
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    applyTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    
    // Add a little celebration effect
    if (newTheme === 'light') {
      // Sparkle burst effect
      createSparkleEffect()
    } else {
      // Glitch effect
      createGlitchEffect()
    }
  }

  const createSparkleEffect = () => {
    for (let i = 0; i < 10; i++) {
      const sparkle = document.createElement('div')
      sparkle.innerHTML = '✨'
      sparkle.style.position = 'fixed'
      sparkle.style.left = Math.random() * window.innerWidth + 'px'
      sparkle.style.top = Math.random() * window.innerHeight + 'px'
      sparkle.style.fontSize = '1.5rem'
      sparkle.style.pointerEvents = 'none'
      sparkle.style.zIndex = '9999'
      sparkle.style.animation = 'sparkle 2s ease-out forwards'
      document.body.appendChild(sparkle)
      
      setTimeout(() => sparkle.remove(), 2000)
    }
  }

  const createGlitchEffect = () => {
    const body = document.body
    body.style.animation = 'glitch 0.5s ease-out'
    setTimeout(() => {
      body.style.animation = ''
    }, 500)
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isLoading }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}
