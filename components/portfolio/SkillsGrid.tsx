'use client';

import React from 'react';
import { portfolioData } from '@/lib/portfolio-schema';
import { Code2, Layout, Server, Wrench } from 'lucide-react';

interface SkillsGridProps {
  onSkillClick?: (skill: string) => void;
}

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  'Core & Languages': Code2,
  'Frontend Development': Layout,
  'Backend & APIs': Server,
  'Tools & Workflow': Wrench,
};

export function SkillsGrid({ onSkillClick }: SkillsGridProps) {
  const { skills } = portfolioData;

  return (
    <section id="skills" className="py-8 border-b border-slate-800/80">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Technical Skills & Competencies</h2>
          <p className="text-xs text-slate-400 mt-1">Verified technical stack and tooling</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {skills.map((group) => {
          const Icon = CATEGORY_ICONS[group.category] || Code2;
          return (
            <div
              key={group.category}
              className="p-4 rounded-xl border border-slate-800/90 bg-slate-900/40 hover:border-slate-700/80 transition-colors"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon className="w-4 h-4 text-blue-400" />
                <h3 className="text-sm font-semibold text-slate-200">{group.category}</h3>
              </div>

              {/* Clean unboxed skill list with subtle separators */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-xs text-slate-300">
                {group.items.map((item, idx) => (
                  <React.Fragment key={item}>
                    {idx > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
                    <button
                      type="button"
                      onClick={() => onSkillClick?.(item)}
                      className="hover:text-blue-400 transition-colors cursor-pointer text-left focus-visible:outline-none focus-visible:text-blue-400"
                      title={`Ask assistant about ${item}`}
                    >
                      {item}
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
