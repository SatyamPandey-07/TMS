'use client';

import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function ThemeToggle() {
  const { theme, toggleTheme, isLoading } = useTheme();

  if (isLoading) {
    return (
      <div className="w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
    );
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`
        relative w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ease-in-out
        ${theme === 'light' 
          ? 'bg-gray-200 border border-gray-300' 
          : 'bg-gray-800 border border-gray-600'
        }
        hover:scale-105 transform focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900
      `}
      whileTap={{ scale: 0.95 }}
      initial={false}
      transition={{ duration: 0.2 }}
    >
      {/* Track */}
      <motion.div
        className="absolute inset-1 rounded-full flex items-center justify-between px-1"
        initial={false}
        transition={{ duration: 0.3 }}
      >
        {/* Icons */}
        <SunIcon 
          className={`
            w-3 h-3 transition-all duration-300 z-10
            ${theme === 'light' 
              ? 'text-orange-500 opacity-100 scale-100' 
              : 'text-gray-500 opacity-40 scale-75'
            }
          `}
        />
        <MoonIcon 
          className={`
            w-3 h-3 transition-all duration-300 z-10
            ${theme === 'dark' 
              ? 'text-indigo-400 opacity-100 scale-100' 
              : 'text-gray-500 opacity-40 scale-75'
            }
          `}
        />
      </motion.div>

      {/* Switch Thumb */}
      <motion.div
        className={`
          absolute top-1 w-6 h-6 rounded-full shadow-lg
          ${theme === 'light' 
            ? 'bg-white border border-gray-200' 
            : 'bg-gray-700 border border-gray-600'
          }
        `}
        initial={false}
        animate={{
          x: theme === 'light' ? 2 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {/* Inner accent */}
        <motion.div
          className={`
            absolute inset-1 rounded-full
            ${theme === 'light' 
              ? 'bg-gradient-to-br from-orange-200 to-yellow-200' 
              : 'bg-gradient-to-br from-indigo-400 to-purple-500'
            }
          `}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>
    </motion.button>
  );
}
