'use client';

import React from 'react';
import { ProjectItem } from '@/lib/portfolio-schema';
import { ArrowUpRight, MessageSquareCode, CheckCircle2, Clock } from 'lucide-react';

interface ProjectCardProps {
  project: ProjectItem;
  isHighlighted?: boolean;
  onSelect: (project: ProjectItem) => void;
  onAskAI: (project: ProjectItem) => void;
}

export function ProjectCard({ project, isHighlighted, onSelect, onAskAI }: ProjectCardProps) {
  const isInProgress = project.status === 'in_progress';

  return (
    <article
      id={`project-${project.id}`}
      className={`group relative flex flex-col justify-between p-5 sm:p-6 rounded-xl border transition-all duration-200 ${
        isHighlighted
          ? 'border-blue-500 bg-blue-950/20 shadow-lg shadow-blue-500/10 ring-1 ring-blue-500'
          : 'border-slate-800/90 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/60'
      }`}
    >
      <div>
        {/* Status & Category Row */}
        <div className="flex items-center justify-between gap-3 text-xs mb-3">
          <div className="flex items-center gap-1.5 font-medium">
            {isInProgress ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-amber-400">In Progress</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Completed Project</span>
              </>
            )}
          </div>

          <span className="text-slate-500 font-mono text-[11px]">
            ID: {project.id}
          </span>
        </div>

        {/* Project Title */}
        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight mb-2 group-hover:text-blue-400 transition-colors">
          {project.title}
        </h3>

        {/* Summary */}
        <p className="text-sm text-slate-300 leading-relaxed mb-4">
          {project.summary}
        </p>

        {/* Verified Tech Stack (Unboxed text with typographic separators) */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-400 mb-6 font-mono">
          {project.technologies.map((tech, idx) => (
            <React.Fragment key={tech}>
              {idx > 0 && <span className="text-slate-600" aria-hidden="true">·</span>}
              <span className="text-slate-300">{tech}</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-4 border-t border-slate-800/70 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelect(project)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer"
        >
          <span>View Details</span>
          <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => onAskAI(project)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-400 bg-blue-950/40 hover:bg-blue-900/40 border border-blue-900/50 rounded-lg transition-colors cursor-pointer"
          title={`Ask AI assistant about ${project.title}`}
        >
          <MessageSquareCode className="w-3.5 h-3.5" />
          <span>Ask AI</span>
        </button>
      </div>
    </article>
  );
}
