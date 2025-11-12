'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface AIMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface AIContextType {
  isOpen: boolean;
  openAI: () => void;
  closeAI: () => void;
  toggleAI: () => void;
  messages: AIMessage[];
  addMessage: (message: AIMessage) => void;
  clearMessages: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export function AIProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: '1',
      text: '안녕하세요! AI 어시스턴트입니다. 무엇을 도와드릴까요?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);

  const openAI = () => setIsOpen(true);
  const closeAI = () => setIsOpen(false);
  const toggleAI = () => setIsOpen((prev) => !prev);

  const addMessage = (message: AIMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([
      {
        id: '1',
        text: '대화가 초기화되었습니다. 무엇을 도와드릴까요?',
        sender: 'ai',
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <AIContext.Provider
      value={{
        isOpen,
        openAI,
        closeAI,
        toggleAI,
        messages,
        addMessage,
        clearMessages,
      }}
    >
      {children}
    </AIContext.Provider>
  );
}

