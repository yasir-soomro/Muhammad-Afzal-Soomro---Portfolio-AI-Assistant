'use client';

import { useState, useCallback } from 'react';
import { ChatMessage } from '@/components/assistant/ChatMessageList';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Hello! I am Muhammad Afzal Soomro's portfolio assistant. You can ask me about his verified full-stack projects, architecture decisions, technical competencies, or contact details.`,
  citedProjectIds: [],
};

export function useAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);

  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isLoading) return;

    setLastUserMessage(trimmed);

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: trimmed,
    };

    // Construct history payload excluding error messages
    const validHistory = messages
      .filter((m) => !m.isError)
      .slice(-10)
      .map((m) => ({
        role: m.role,
        content: m.content,
      }));

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: trimmed,
          history: validHistory,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        const errorText = data.error || 'Failed to retrieve response from assistant';
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            role: 'assistant',
            content: errorText,
            isError: true,
          },
        ]);
        return;
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `asst-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          citedProjectIds: data.citedProjectIds || [],
        },
      ]);
    } catch (err: unknown) {
      console.error('[useAssistant Network Error]:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: 'Network connection error. Please check your internet or retry.',
          isError: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const retryLastMessage = useCallback(() => {
    if (lastUserMessage) {
      sendMessage(lastUserMessage);
    }
  }, [lastUserMessage, sendMessage]);

  const resetChat = useCallback(() => {
    setMessages([INITIAL_MESSAGE]);
    setLastUserMessage(null);
  }, []);

  return {
    messages,
    isLoading,
    sendMessage,
    retryLastMessage,
    resetChat,
  };
}
