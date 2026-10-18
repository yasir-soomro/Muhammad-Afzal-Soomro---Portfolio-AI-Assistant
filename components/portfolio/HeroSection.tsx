'use client';

import React from 'react';
import { portfolioData } from '@/lib/portfolio-schema';
import { ArrowDown, Mail, MessageSquareCode } from 'lucide-react';

interface HeroSectionProps {
  onPromptClick: (prompt: string) => void;
}

export function HeroSection({ onPromptClick }: HeroSectionProps) {
  const { developer } = portfolioData;

  return (
    <section id="about" className="pt-6 pb-10 border-b border-slate-800/80">
      {/* Editorial Kicker & Unboxed Metadata */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400 mb-4">
        <span>{developer.title}</span>
        <span aria-hidden="true">·</span>
        <span>{developer.location || 'Pakistan'}</span>
        <span aria-hidden="true">·</span>
        <span>TypeScript & Next.js</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white max-w-2xl text-balance mb-4">
        {developer.name}
      </h1>

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
