'use client';

import React, { useState } from 'react';
import ChatbotIcon from './ChatbotIcon';
import ChatbotWindow from './ChatbotWindow';

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChatbot = () => {
    setIsOpen(!isOpen);
  };

  const closeChatbot = () => {
    setIsOpen(false);
  };

  return (
    <>
      <ChatbotIcon onClick={toggleChatbot} isOpen={isOpen} />
      <ChatbotWindow isOpen={isOpen} onClose={closeChatbot} />
    </>
  );
}
