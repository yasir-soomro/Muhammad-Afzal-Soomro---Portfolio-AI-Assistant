'use client';

import React, { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const MAX_CHARACTERS = 500;

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');

  const trimmed = input.trim();
  const isTooLong = input.length > MAX_CHARACTERS;
  const canSubmit = trimmed.length > 0 && !isTooLong && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSendMessage(trimmed);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (canSubmit) {
        handleSubmit(e);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="pt-2">
      <div className="relative flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          maxLength={MAX_CHARACTERS + 10} // allow typing slightly over to show warning
          placeholder="Ask about Muhammad's projects or skills..."
          className={`w-full rounded-xl border bg-slate-900/90 py-2.5 pl-3.5 pr-20 text-xs sm:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none transition-colors ${
            isTooLong
              ? 'border-red-500 focus:border-red-400'
              : 'border-slate-700/80 focus:border-blue-500'
          }`}
          aria-label="Ask a question about the portfolio"
        />

        <div className="absolute right-1.5 flex items-center gap-1.5">
          <button
            type="submit"
            disabled={!canSubmit}
            className="flex items-center justify-center p-2 rounded-lg text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label="Send message"
          >
            {isLoading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* Character count & validation hints */}
      <div className="flex items-center justify-between px-1 mt-1.5 text-[10px] text-slate-500">
        <span>Grounded strictly in verified portfolio data</span>
        <span className={isTooLong ? 'text-red-400 font-medium' : ''}>
          {input.length}/{MAX_CHARACTERS}
        </span>
      </div>
    </form>
  );
}
