'use client';

import React, { useRef, useEffect } from 'react';
import { portfolioData } from '@/lib/portfolio-schema';
import { Bot, User, ArrowUpRight, AlertCircle, RefreshCw } from 'lucide-react';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citedProjectIds?: string[];
  isError?: boolean;
}

interface ChatMessageListProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onCitationClick: (projectId: string) => void;
  onRetry?: () => void;
}

export function ChatMessageList({
  messages,
  isLoading,
  onCitationClick,
  onRetry,
}: ChatMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const projectsMap = new Map(portfolioData.projects.map((p) => [p.id, p]));

  return (
    <div className="flex-1 overflow-y-auto space-y-4 pr-1 text-xs sm:text-sm">
      {messages.map((msg) => {
        const isUser = msg.role === 'user';

        if (msg.isError) {
          return (
            <div
              key={msg.id}
              className="flex items-start gap-2.5 p-3 rounded-xl border border-red-900/50 bg-red-950/20 text-red-200"
            >
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-2">
                <p className="text-xs leading-relaxed">{msg.content}</p>
                {onRetry && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium text-red-300 bg-red-900/40 hover:bg-red-900/60 rounded border border-red-800 transition-colors"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Retry Question</span>
                  </button>
                )}
              </div>
            </div>
          );
        }

        return (
          <div
            key={msg.id}
            className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
          >
            {/* Avatar */}
            <div
              className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-[11px] ${
                isUser
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-800 border border-slate-700 text-blue-400'
              }`}
            >
              {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                isUser
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none shadow-sm'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Verified Citations Badge List */}
              {!isUser && msg.citedProjectIds && msg.citedProjectIds.length > 0 && (
                <div className="mt-2.5 pt-2 border-t border-slate-800/80 space-y-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    Verified Project Reference:
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.citedProjectIds.map((projectId) => {
                      const project = projectsMap.get(projectId);
                      if (!project) return null;

                      return (
                        <button
                          key={projectId}
                          type="button"
                          onClick={() => onCitationClick(projectId)}
                          className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium text-blue-400 bg-blue-950/40 hover:bg-blue-900/50 border border-blue-800/60 rounded-md transition-colors cursor-pointer"
                          title={`Click to inspect ${project.title}`}
                        >
                          <span>{project.title}</span>
                          <span className="text-slate-500">·</span>
                          <span className="text-[10px] text-slate-400">{project.statusLabel}</span>
                          <ArrowUpRight className="w-3 h-3 text-blue-400" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Loading Indicator */}
      {isLoading && (
        <div className="flex items-start gap-2.5">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-800 border border-slate-700 text-blue-400 shrink-0">
            <Bot className="w-3.5 h-3.5" />
          </div>
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:200ms]" />
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse [animation-delay:400ms]" />
            <span className="text-xs text-slate-400 ml-1.5">Grounded query in progress...</span>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
