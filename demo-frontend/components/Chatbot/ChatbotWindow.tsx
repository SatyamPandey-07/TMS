'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PaperAirplaneIcon, 
  UserIcon,
  CpuChipIcon,
  XMarkIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  typing?: boolean;
}

interface ChatbotWindowProps {
  isOpen: boolean;
  onClose: () => void;
}

const PREDEFINED_RESPONSES = {
  greeting: [
    "Hello! 👋 Welcome to TurfMaster! I'm here to help you find and book the perfect turf for your game.",
    "Hi there! 🏟️ I'm your TurfMaster assistant. How can I help you today?",
    "Welcome! I can help you with turf bookings, finding locations, pricing, and more!"
  ],
  booking: [
    "I'd be happy to help you with booking! You can:",
    "• Browse available turfs in the 'Explore' section",
    "• Filter by sport type, location, and price",
    "• Check real-time availability", 
    "• Book instantly with advance payment",
    "",
    "Would you like me to guide you to the booking page?"
  ],
  pricing: [
    "Our turf pricing varies by location and facilities:",
    "• Football turfs: ₹600-₹1200 per hour",
    "• Cricket grounds: ₹800-₹1500 per hour", 
    "• Badminton courts: ₹400-₹800 per hour",
    "• Basketball courts: ₹500-₹900 per hour",
    "",
    "Prices may vary based on peak hours and location. Check specific turf pages for exact pricing!"
  ],
  location: [
    "We have turfs available in many locations:",
    "• Delhi NCR (Noida, Gurgaon, Delhi)",
    "• Mumbai (Andheri, Borivali, Thane)",
    "• Bangalore (Koramangala, Whitefield, BTM)",
    "• Pune (Hinjewadi, Kothrud, Aundh)",
    "",
    "Use our location filter to find turfs near you!"
  ],
  hours: [
    "Most turfs are available:",
    "• Morning: 6:00 AM - 11:00 AM",
    "• Evening: 4:00 PM - 10:00 PM", 
    "• Some 24/7 facilities available",
    "",
    "Note: Lunch breaks typically from 12-2 PM. Check individual turf timings for exact hours!"
  ],
  payment: [
    "Payment is easy and secure:",
    "• Advance payment (usually 50%) required to confirm booking",
    "• Accepted methods: UPI, Credit/Debit Cards, Net Banking",
    "• Remaining amount can be paid at the turf",
    "• Digital receipts provided instantly",
    "",
    "All payments are secured with 256-bit encryption!"
  ],
  cancellation: [
    "Our cancellation policy:",
    "• Free cancellation up to 24 hours before booking",
    "• 50% refund for cancellations 6-24 hours before",
    "• No refund for cancellations within 6 hours",
    "",
    "Weather-related cancellations are handled case-by-case with full refund eligibility."
  ],
  contact: [
    "Need to get in touch?",
    "• Email: support@turfmaster.com",
    "• Phone: +91 9876543210",
    "• Live Chat: Right here! 😊",
    "• Support Hours: 9 AM - 9 PM",
    "",
    "I'm available 24/7 for basic queries!"
  ]
};

const QUICK_REPLIES = [
  "Find football turfs",
  "Cricket grounds near me", 
  "What are the prices?",
  "How to book a turf?",
  "Available locations",
  "Payment methods",
  "Contact support"
];

export default function ChatbotWindow({ isOpen, onClose }: ChatbotWindowProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: PREDEFINED_RESPONSES.greeting[0],
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getRandomResponse = (responses: string[]) => {
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const getBotResponse = async (userMessage: string): Promise<string[]> => {
    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userMessage }),
      });

      if (response.ok) {
        const data = await response.json();
        return [data.response];
      } else {
        // Fallback to local responses if API fails
        return getLocalBotResponse(userMessage);
      }
    } catch (error) {
      console.error('Chatbot API error:', error);
      // Fallback to local responses
      return getLocalBotResponse(userMessage);
    }
  };

  const getLocalBotResponse = (userMessage: string): string[] => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('book') || message.includes('booking') || message.includes('reserve')) {
      return PREDEFINED_RESPONSES.booking;
    }
    if (message.includes('price') || message.includes('cost') || message.includes('fee') || message.includes('rate')) {
      return PREDEFINED_RESPONSES.pricing;
    }
    if (message.includes('location') || message.includes('where') || message.includes('near') || message.includes('area')) {
      return PREDEFINED_RESPONSES.location;
    }
    if (message.includes('time') || message.includes('hour') || message.includes('timing') || message.includes('open')) {
      return PREDEFINED_RESPONSES.hours;
    }
    if (message.includes('payment') || message.includes('pay') || message.includes('money') || message.includes('card')) {
      return PREDEFINED_RESPONSES.payment;
    }
    if (message.includes('cancel') || message.includes('refund') || message.includes('policy')) {
      return PREDEFINED_RESPONSES.cancellation;
    }
    if (message.includes('contact') || message.includes('support') || message.includes('help') || message.includes('phone') || message.includes('email')) {
      return PREDEFINED_RESPONSES.contact;
    }
    if (message.includes('hello') || message.includes('hi') || message.includes('hey') || message.includes('start')) {
      return [getRandomResponse(PREDEFINED_RESPONSES.greeting)];
    }
    
    return [
      "I'm here to help with turf bookings! Here are some things I can assist you with:",
      "",
      "🏟️ Turf booking process",
      "💰 Pricing information", 
      "📍 Available locations",
      "⏰ Timing and hours",
      "💳 Payment methods",
      "📞 Contact support",
      "",
      "Just ask me about any of these topics!"
    ];
  };

  const simulateTyping = (callback: () => void | Promise<void>, delay = 1000) => {
    setIsTyping(true);
    setTimeout(async () => {
      setIsTyping(false);
      await callback();
    }, delay);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setShowQuickReplies(false);

    // Get bot response
    simulateTyping(async () => {
      const responses = await getBotResponse(text);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responses.join('\n'),
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    });
  };

  const handleQuickReply = (reply: string) => {
    sendMessage(reply);
  };

  const clearChat = () => {
    setMessages([
      {
        id: '1',
        text: "Chat cleared! How can I help you today?",
        sender: 'bot',
        timestamp: new Date()
      }
    ]);
    setShowQuickReplies(true);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.8 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-24 right-6 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl z-50 flex flex-col border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <CpuChipIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">TurfMaster Assistant</h3>
                <p className="text-xs opacity-80">Online now</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Clear chat"
              >
                <ArrowPathIcon className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                title="Close chat"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex gap-2 max-w-[80%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-blue-500' 
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    {message.sender === 'user' ? (
                      <UserIcon className="w-3 h-3 text-white" />
                    ) : (
                      <CpuChipIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                    )}
                  </div>
                  <div className={`px-3 py-2 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                  }`}>
                    <pre className="whitespace-pre-wrap text-sm font-sans">{message.text}</pre>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="flex gap-2">
                  <div className="w-6 h-6 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                    <CpuChipIcon className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-700 px-3 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Quick replies */}
            {showQuickReplies && messages.length === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-2"
              >
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Quick questions:</p>
                <div className="flex flex-wrap gap-2">
                  {QUICK_REPLIES.map((reply, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickReply(reply)}
                      className="px-3 py-1 text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage(inputValue)}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white text-sm"
                disabled={isTyping}
              />
              <button
                onClick={() => sendMessage(inputValue)}
                disabled={!inputValue.trim() || isTyping}
                className="p-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 dark:disabled:bg-gray-600 text-white rounded-lg transition-colors"
              >
                <PaperAirplaneIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
