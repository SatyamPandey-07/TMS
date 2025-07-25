'use client'

import { motion } from 'framer-motion'
import { useTheme } from '@/contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-16 h-8 rounded-full p-1 cursor-pointer transition-all duration-500 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 
        dark:focus:ring-offset-gray-900 hover:scale-105 transform
        ${theme === 'light' 
          ? 'bg-gradient-to-r from-sky-100 to-sky-200 border border-sky-200' 
          : 'bg-gradient-to-r from-gray-700 to-gray-800 border border-gray-600'
        }
      `}
      whileTap={{ scale: 0.95 }}
      initial={false}
      transition={{ duration: 0.3 }}
    >
      {/* Sliding Circle */}
      <motion.div
        className={`
          absolute top-1 w-6 h-6 rounded-full flex items-center justify-center text-lg
          shadow-lg transition-all duration-500 ease-in-out
          ${theme === 'light' 
            ? 'bg-white border-2 border-yellow-300 shadow-yellow-200/50' 
            : 'bg-gray-900 border-2 border-gray-700'
          }
        `}
        animate={{
          x: theme === 'light' ? 2 : 32,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
      >
        {/* Animated Icon */}
        <motion.span
          animate={{
            rotate: theme === 'light' ? 0 : 180,
            scale: theme === 'light' ? 1 : 0.9,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut"
          }}
          className="block"
        >
          {theme === 'light' ? '🌞' : '🌙'}
        </motion.span>
      </motion.div>

      {/* Background Icons */}
      <div className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none">
        <motion.span
          animate={{
            opacity: theme === 'light' ? 0.3 : 0.1,
            scale: theme === 'light' ? 0.8 : 0.6,
          }}
          transition={{ duration: 0.5 }}
          className="text-xs"
        >
          ☀️
        </motion.span>
        <motion.span
          animate={{
            opacity: theme === 'dark' ? 0.3 : 0.1,
            scale: theme === 'dark' ? 0.8 : 0.6,
          }}
          transition={{ duration: 0.5 }}
          className="text-xs"
        >
          🌙
        </motion.span>
      </div>
    </motion.button>
  )
}
