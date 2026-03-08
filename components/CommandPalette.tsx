'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  FileText,
  Building2,
  Users,
  BrainCircuit,
  Radar,
  ArrowRight,
  Plus,
  Sparkles,
  X
} from 'lucide-react';
import {
  INITIAL_TOPIC_SIGNALS,
  INITIAL_COMPANIES,
  INITIAL_PEOPLE,
  INITIAL_ARTICLES,
  INITIAL_EXPERIENCES,
} from '@/lib/signalforge-data';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export function CommandPalette({ isOpen, onClose, onNavigate }: CommandPaletteProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        // Toggle palette
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredTopics = INITIAL_TOPIC_SIGNALS.filter((t) =>
    t.title.toLowerCase().includes(query.toLowerCase()) || t.tags.some((tg) => tg.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredCompanies = INITIAL_COMPANIES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase()) || c.technologies.some((tc) => tc.toLowerCase().includes(query.toLowerCase()))
  );
  const filteredArticles = INITIAL_ARTICLES.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) || a.category.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl overflow-hidden text-slate-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-[#22c55e]/20 bg-[#0e1710]">
          <Search className="w-4 h-4 text-[#22c55e] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a topic, company, article, or command..."
            className="w-full bg-transparent text-sm text-emerald-200 placeholder-zinc-500 focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
          {/* Quick Actions */}
          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-2">
              Quick Actions
            </div>
            <div className="space-y-1">
              <button
                onClick={() => {
                  onNavigate('content');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e1710]/60 hover:bg-[#22c55e]/15 border border-transparent hover:border-[#22c55e]/30 transition group"
              >
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-emerald-300">
                  <Plus className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>Launch 10-Step Content Creator Wizard</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  onNavigate('prospector');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e1710]/60 hover:bg-[#22c55e]/15 border border-transparent hover:border-[#22c55e]/30 transition group"
              >
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-emerald-300">
                  <Users className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>LinkedIn AI Prospector & Daily Auto-Connect Cron</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
              </button>

              <button
                onClick={() => {
                  onNavigate('engagement');
                  onClose();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e1710]/60 hover:bg-[#22c55e]/15 border border-transparent hover:border-[#22c55e]/30 transition group"
              >
                <div className="flex items-center gap-2 text-zinc-300 group-hover:text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
                  <span>FAANG Post Auto-Commenter & Active Chat Studio</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
              </button>
            </div>
          </div>

          {/* Topics & Signals */}
          {filteredTopics.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-2">
                Tech Signals ({filteredTopics.length})
              </div>
              <div className="space-y-1">
                {filteredTopics.slice(0, 3).map((topic) => (
                  <button
                    key={topic.id}
                    onClick={() => {
                      onNavigate('discover');
                      onClose();
                    }}
                    className="w-full flex items-start justify-between p-2.5 rounded-lg bg-[#0e1710]/40 hover:bg-[#22c55e]/10 border border-white/5 hover:border-[#22c55e]/30 transition text-left"
                  >
                    <div>
                      <div className="font-semibold text-emerald-300">{topic.title}</div>
                      <div className="text-[11px] text-zinc-400 truncate">{topic.summary}</div>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-2 flex-shrink-0">
                      {topic.trendScore}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Target Companies */}
          {filteredCompanies.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-2">
                Target Companies
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredCompanies.map((comp) => (
                  <button
                    key={comp.id}
                    onClick={() => {
                      onNavigate('companies');
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-lg bg-[#0e1710]/40 hover:bg-[#22c55e]/10 border border-white/5 hover:border-[#22c55e]/30 transition text-left"
                  >
                    <Building2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
                    <div className="truncate">
                      <div className="font-semibold text-slate-200">{comp.name}</div>
                      <div className="text-[10px] text-zinc-400">{comp.priority} • {comp.industry}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Articles */}
          {filteredArticles.length > 0 && (
            <div>
              <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-2">
                Articles & Publications
              </div>
              <div className="space-y-1">
                {filteredArticles.map((art) => (
                  <button
                    key={art.id}
                    onClick={() => {
                      onNavigate('articles');
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-[#0e1710]/40 hover:bg-[#22c55e]/10 border border-white/5 hover:border-[#22c55e]/30 transition text-left"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="font-medium text-slate-300">{art.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500">{art.views} reads</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 border-t border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Esc to close</span>
          <span>Tab to navigate</span>
        </div>
      </div>
    </div>
  );
}
