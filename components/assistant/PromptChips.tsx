'use client';

import React from 'react';
import { portfolioData } from '@/lib/portfolio-schema';
import { Sparkles } from 'lucide-react';

interface PromptChipsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

export function PromptChips({ onSelectPrompt, disabled }: PromptChipsProps) {
  const { frequentlyAsked } = portfolioData;

  return (
    <div className="py-2.5">
      <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 mb-2">
        <Sparkles className="w-3 h-3 text-blue-400" />
        <span>Suggested Questions</span>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {frequentlyAsked.map((faq) => (
          <button
            key={faq.question}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(faq.question)}
            className="px-2.5 py-1 text-xs text-left text-slate-300 bg-slate-800/80 hover:bg-slate-700/80 hover:text-white border border-slate-700/60 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-normal"
          >
            {faq.question}
          </button>
        ))}
      </div>
    </div>
  );
}
