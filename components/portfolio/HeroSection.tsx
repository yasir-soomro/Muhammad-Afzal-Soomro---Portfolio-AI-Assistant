'use client';

import React from 'react';
import Image from 'next/image';
import { portfolioData } from '@/lib/portfolio-schema';
import { ArrowDown, Mail, MessageSquareCode } from 'lucide-react';

interface HeroSectionProps {
  onPromptClick: (prompt: string) => void;
}

export function HeroSection({ onPromptClick }: HeroSectionProps) {
  const { developer } = portfolioData;

  return (
    <section id="about" className="pt-6 pb-10 border-b border-slate-800/80">
      {/* Developer Profile Header with Personal Workspace Portrait */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mb-6">
        <div className="relative shrink-0">
          <Image
            src={developer.avatar || '/developer-portrait.jpg'}
            alt="Muhammad Afzal Soomro in developer workspace"
            width={112}
            height={112}
            priority
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-700/90 shadow-xl shadow-black/40 ring-1 ring-white/10"
            referrerPolicy="no-referrer"
          />
          <div className="absolute -bottom-1.5 -right-1.5 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 bg-slate-900 border border-emerald-500/30 rounded-full shadow-sm">
            Active
          </div>
        </div>

        <div>
          {/* Editorial Kicker & Unboxed Metadata */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-2">
            <span>{developer.title}</span>
            <span aria-hidden="true">·</span>
            <span>{developer.location || 'Pakistan'}</span>
            <span aria-hidden="true">·</span>
            <span>TypeScript & Next.js</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white text-balance">
            {developer.name}
          </h1>
        </div>
      </div>

      {/* Truthful Summary */}
      <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mb-8">
        {developer.summary}
      </p>

      {/* Action Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <a
          href="#projects"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
        >
          <span>View Verified Projects</span>
          <ArrowDown className="w-4 h-4 text-slate-400" />
        </a>

        <button
          type="button"
          onClick={() => onPromptClick('What are your core technical strengths?')}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-400 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-800/60 rounded-lg transition-colors whitespace-nowrap"
        >
          <MessageSquareCode className="w-4 h-4" />
          <span>Ask AI About Skills</span>
        </button>

        {developer.contact.email && (
          <a
            href={`mailto:${developer.contact.email}`}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors whitespace-nowrap"
          >
            <Mail className="w-4 h-4 text-slate-400" />
            <span>{developer.contact.email}</span>
          </a>
        )}
      </div>
    </section>
  );
}
