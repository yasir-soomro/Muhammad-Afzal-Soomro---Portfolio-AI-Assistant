'use client';

import React from 'react';
import { Bot, RotateCcw, X, ShieldCheck } from 'lucide-react';
import { ChatMessageList, ChatMessage } from './ChatMessageList';
import { PromptChips } from './PromptChips';
import { ChatInput } from './ChatInput';

interface AssistantPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (content: string) => void;
  onResetChat: () => void;
  onCitationClick: (projectId: string) => void;
  onRetry?: () => void;
  onCloseMobile?: () => void;
}

export function AssistantPanel({
  messages,
  isLoading,
  onSendMessage,
  onResetChat,
  onCitationClick,
  onRetry,
  onCloseMobile,
}: AssistantPanelProps) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800 bg-[#0E131F]/90 backdrop-blur-md p-4 sm:p-5 shadow-xl">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-950/60 border border-blue-800/50 text-blue-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-sm font-bold text-white tracking-tight">Portfolio Assistant</h2>
              <span className="flex items-center gap-1 text-[10px] text-blue-400 font-medium px-1.5 py-0.2 rounded bg-blue-950/60 border border-blue-900/40">
                <ShieldCheck className="w-2.5 h-2.5" />
                <span>Grounded</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Verified against Muhammad Afzal Soomro&apos;s profile
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onResetChat}
            disabled={isLoading || messages.length <= 1}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
            title="Reset conversation"
            aria-label="Reset conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {onCloseMobile && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors lg:hidden cursor-pointer"
              title="Close assistant"
              aria-label="Close assistant"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message List */}
      <ChatMessageList
        messages={messages}
        isLoading={isLoading}
        onCitationClick={onCitationClick}
        onRetry={onRetry}
      />

      {/* Suggested Prompt Chips */}
      <PromptChips onSelectPrompt={onSendMessage} disabled={isLoading} />

      {/* Input Box */}
      <ChatInput onSendMessage={onSendMessage} isLoading={isLoading} />
    </div>
  );
}
