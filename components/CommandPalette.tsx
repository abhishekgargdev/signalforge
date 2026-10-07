'use client';

import React, { useState, useEffect } from 'react';
import { Search, Plus, Users, Sparkles, ArrowRight, X } from 'lucide-react';

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
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();
  const navTargets = [
    { mod: 'dashboard', label: 'Dashboard', keywords: ['dashboard', 'home', 'charts'] },
    { mod: 'content', label: 'Content Pipeline', keywords: ['content', 'post', 'draft'] },
    { mod: 'topics', label: 'Topics', keywords: ['topic', 'subject'] },
    { mod: 'companies', label: 'Target Companies', keywords: ['company', 'target'] },
    { mod: 'occasions', label: 'Occasions', keywords: ['holiday', 'celebration', 'occasion'] },
    { mod: 'articles', label: 'Technical Articles', keywords: ['article', 'publish', 'essay'] },
    { mod: 'prospector', label: 'Connections', keywords: ['linkedin', 'connect', 'invite'] },
    { mod: 'engagement', label: 'Comments', keywords: ['comment', 'reply'] },
    { mod: 'calendar', label: 'Calendar', keywords: ['calendar', 'schedule', 'date'] },
    { mod: 'settings', label: 'Settings', keywords: ['settings', 'profile', 'integration'] },
  ].filter(
    (item) =>
      !q ||
      item.label.toLowerCase().includes(q) ||
      item.keywords.some((k) => k.includes(q) || q.includes(k))
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-2xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl overflow-hidden text-slate-100">
        <div className="flex items-center px-4 py-3 border-b border-[#22c55e]/20 bg-[#0e1710]">
          <Search className="w-4 h-4 text-[#22c55e] mr-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search modules or type a command..."
            className="w-full bg-transparent text-sm text-emerald-200 placeholder-zinc-500 focus:outline-none font-mono"
            autoFocus
          />
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-96 overflow-y-auto p-3 space-y-4 text-xs">
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
                  <span>New content draft</span>
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
                  <span>LinkedIn prospecting</span>
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
                  <span>Comment studio</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400" />
              </button>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-2 px-2">
              Go to module
            </div>
            {navTargets.length === 0 ? (
              <p className="px-3 py-4 text-zinc-500 font-mono text-[11px]">
                No matching modules. Try &quot;content&quot;, &quot;discover&quot;, or &quot;settings&quot;.
              </p>
            ) : (
              <div className="space-y-1">
                {navTargets.map((item) => (
                  <button
                    key={item.mod}
                    onClick={() => {
                      onNavigate(item.mod);
                      onClose();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-[#0e1710]/40 hover:bg-[#22c55e]/10 border border-white/5 hover:border-[#22c55e]/30 transition text-left text-slate-300"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2 border-t border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between text-[11px] font-mono text-zinc-500">
          <span>Esc to close</span>
          <span>No demo search results</span>
        </div>
      </div>
    </div>
  );
}
