'use client';

import React, { useState, useCallback } from 'react';
import { portfolioData, ProjectItem } from '@/lib/portfolio-schema';
import { TopBar } from '@/components/portfolio/TopBar';
import { HeroSection } from '@/components/portfolio/HeroSection';
import { SkillsGrid } from '@/components/portfolio/SkillsGrid';
import { ProjectCard } from '@/components/portfolio/ProjectCard';
import { ProjectModal } from '@/components/portfolio/ProjectModal';
import { AssistantPanel } from '@/components/assistant/AssistantPanel';
import { useAssistant } from '@/hooks/use-assistant';
import { MessageSquare, Sparkles } from 'lucide-react';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);
  const [isMobileAssistantOpen, setIsMobileAssistantOpen] = useState(false);

  const {
    messages,
    isLoading,
    sendMessage,
    retryLastMessage,
    resetChat,
  } = useAssistant();

  // Handler for clicking a project citation from the AI assistant
  const handleCitationClick = useCallback((projectId: string) => {
    const project = portfolioData.projects.find((p) => p.id === projectId);
    if (project) {
      setHighlightedProjectId(projectId);
      setSelectedProject(project);

      // Scroll to project card on the left showcase
      const cardElement = document.getElementById(`project-${projectId}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      // Remove temporary highlight ring after 3 seconds
      setTimeout(() => {
        setHighlightedProjectId(null);
      }, 3000);
    }
  }, []);

  // Handler for "Ask AI" button on a project card
  const handleAskAboutProject = useCallback(
    (project: ProjectItem) => {
      const prompt = `Tell me about the ${project.title} project and its architecture.`;
      sendMessage(prompt);
      setIsMobileAssistantOpen(true);
    },
    [sendMessage]
  );

  // Handler for hero/skills prompt clicks
  const handlePromptClick = useCallback(
    (prompt: string) => {
      sendMessage(prompt);
      setIsMobileAssistantOpen(true);
    },
    [sendMessage]
  );

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col font-sans selection:bg-blue-600/30 selection:text-blue-200">
      {/* Top Bar with 3-Zone Contract */}
      <TopBar onOpenAssistantMobile={() => setIsMobileAssistantOpen(true)} />

      {/* Main Dual-Pane Workstation Container */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Canvas: Portfolio Showcase (60% Desktop: col-span-7) */}
          <div className="lg:col-span-7 space-y-10">
            {/* Hero Section */}
            <HeroSection onPromptClick={handlePromptClick} />

            {/* Technical Skills Matrix */}
            <SkillsGrid onSkillClick={(skill) => handlePromptClick(`What experience do you have with ${skill}?`)} />

            {/* Verified Projects Section */}
            <section id="projects" className="py-2">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-white">Verified Projects</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Inspected and verified technical deliveries
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                  <span>2 projects on record</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {portfolioData.projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    isHighlighted={highlightedProjectId === project.id}
                    onSelect={setSelectedProject}
                    onAskAI={handleAskAboutProject}
                  />
                ))}
              </div>
            </section>

            {/* Truthful Footer Note */}
            <footer className="pt-8 pb-12 text-xs text-slate-500 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p>© {new Date().getFullYear()} Muhammad Afzal Soomro. All rights reserved.</p>
              <div className="flex items-center gap-3">
                <a
                  href={`mailto:${portfolioData.developer.contact.email}`}
                  className="hover:text-slate-300 transition-colors"
                >
                  {portfolioData.developer.contact.email}
                </a>
              </div>
            </footer>
          </div>

          {/* Right Canvas: Persistent AI Assistant (40% Desktop: col-span-5) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-24 h-[calc(100vh-8rem)]">
            <AssistantPanel
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onResetChat={resetChat}
              onCitationClick={handleCitationClick}
              onRetry={retryLastMessage}
            />
          </div>
        </div>
      </main>

      {/* Mobile / Tablet Floating AI Launcher Pill */}
      <div className="lg:hidden fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setIsMobileAssistantOpen(true)}
          className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-full shadow-lg shadow-blue-900/40 transition-transform active:scale-95 cursor-pointer"
          aria-label="Open AI Assistant"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask AI Assistant</span>
          {messages.length > 1 && (
            <span className="flex items-center justify-center w-5 h-5 text-[11px] font-bold bg-white text-blue-600 rounded-full">
              {messages.filter((m) => m.role === 'user').length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Assistant Drawer Modal Sheet */}
      {isMobileAssistantOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="lg:hidden fixed inset-0 z-50 flex flex-col justify-end bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsMobileAssistantOpen(false);
          }}
        >
          <div className="w-full h-[85vh] rounded-t-3xl border-t border-slate-700 bg-[#0E131F] p-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom duration-200">
            <AssistantPanel
              messages={messages}
              isLoading={isLoading}
              onSendMessage={sendMessage}
              onResetChat={resetChat}
              onCitationClick={(projectId) => {
                setIsMobileAssistantOpen(false);
                handleCitationClick(projectId);
              }}
              onRetry={retryLastMessage}
              onCloseMobile={() => setIsMobileAssistantOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Project Details Modal */}
      <ProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
        onAskAI={handleAskAboutProject}
      />
    </div>
  );
}
