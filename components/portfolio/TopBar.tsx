'use client';

import React from 'react';
import Image from 'next/image';
import { Mail, MessageSquare } from 'lucide-react';

interface TopBarProps {
  onOpenAssistantMobile?: () => void;
}

export function TopBar({ onOpenAssistantMobile }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-[#0B0F17]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Brand wordmark with portrait avatar */}
        <a
          href="#top"
          className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white hover:text-blue-400 transition-colors whitespace-nowrap shrink-0"
        >
          <Image
            src="/developer-portrait.jpg"
            alt="Muhammad Afzal Soomro"
            width={28}
            height={28}
            className="w-7 h-7 rounded-full object-cover border border-slate-700/80 shrink-0"
            referrerPolicy="no-referrer"
          />
          <span>Muhammad Afzal Soomro</span>
        </a>

        {/* Zone 2: Navigation Links (single-line text links) */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
          <a
            href="#projects"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Projects
          </a>
          <a
            href="#skills"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            Skills
          </a>
          <a
            href="#about"
            className="hover:text-white transition-colors whitespace-nowrap shrink-0"
          >
            About
          </a>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Mobile AI button */}
          {onOpenAssistantMobile && (
            <button
              type="button"
              onClick={onOpenAssistantMobile}
              className="flex lg:hidden items-center gap-2 px-3 py-1.5 text-xs font-medium text-blue-400 border border-blue-500/30 bg-blue-500/10 rounded-lg hover:bg-blue-500/20 transition-colors whitespace-nowrap shrink-0"
              aria-label="Open AI Assistant"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Ask AI</span>
            </button>
          )}

          {/* Email Contact CTA */}
          <a
            href="mailto:soomroyasir81@gmail.com"
            className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors whitespace-nowrap shrink-0 shadow-sm"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </a>
        </div>
      </div>
    </header>
  );
}
