'use client';

import React from 'react';
import { ArrowLeft, BookOpen, FolderGit2 } from 'lucide-react';
import { ArticleItem, ProjectItem } from '@/lib/signalforge-data';

interface PublicAuthorViewProps {
  onBackToApp: () => void;
  articles?: ArticleItem[];
  projects?: ProjectItem[];
}

export function PublicAuthorView({ onBackToApp, articles = [], projects = [] }: PublicAuthorViewProps) {
  const published = articles.filter((a) => a.status === 'published');

  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 font-mono">
      <header className="border-b border-[#22c55e]/20 bg-[#080c08]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to workspace</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        <div className="p-6 rounded-2xl bg-[#0e1710] border border-[#22c55e]/30">
          <p className="text-xs text-zinc-400">Configure your public author profile in Settings.</p>
        </div>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#22c55e]" />
            Publications
          </h2>
          {published.length === 0 ? (
            <p className="text-xs text-zinc-500 p-6 rounded-xl border border-white/5">No published articles.</p>
          ) : (
            published.map((art) => (
              <div key={art.id} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20">
                <h3 className="font-bold text-xs text-slate-100">{art.title}</h3>
              </div>
            ))
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#22c55e]" />
            Projects
          </h2>
          {projects.length === 0 ? (
            <p className="text-xs text-zinc-500 p-6 rounded-xl border border-white/5">No projects listed.</p>
          ) : (
            projects.map((proj) => (
              <div key={proj.id} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20">
                <h3 className="font-bold text-xs text-slate-100">{proj.name}</h3>
                <p className="text-[11px] text-zinc-400 mt-1">{proj.description}</p>
              </div>
            ))
          )}
        </section>
      </main>
    </div>
  );
}
