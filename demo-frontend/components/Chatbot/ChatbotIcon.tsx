'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';

interface ChatbotIconProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function ChatbotIcon({ onClick, isOpen }: ChatbotIconProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
        isOpen 
          ? 'bg-red-500 hover:bg-red-600' 
          : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
      }`}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      {isOpen ? (
        <motion.svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          className="text-white"
          initial={{ rotate: 0 }}
          animate={{ rotate: 45 }}
          transition={{ duration: 0.2 }}
        >
          <path
            d="M12 2L12 22M2 12L22 12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </motion.svg>
      ) : (
        <motion.div
          initial={{ rotate: 45 }}
          animate={{ rotate: 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChatBubbleLeftRightIcon className="w-6 h-6 text-white" />
        </motion.div>
      )}
      
      {/* Pulse animation for closed state */}
      {!isOpen && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 0.2, 0.7],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      )}
    </motion.button>
  );
}
