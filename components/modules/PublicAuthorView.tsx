'use client';

import React from 'react';
import {
  ArrowLeft,
  Terminal,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  ShieldCheck,
  Zap,
  BookOpen,
  FolderGit2
} from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_PROJECTS, INITIAL_EXPERIENCES } from '@/lib/signalforge-data';

interface PublicAuthorViewProps {
  onBackToApp: () => void;
}

export function PublicAuthorView({ onBackToApp }: PublicAuthorViewProps) {
  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 font-mono">
      {/* Top Header */}
      <header className="border-b border-[#22c55e]/20 bg-[#080c08]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SignalForge Console</span>
          </button>
          <span className="text-[11px] font-mono text-zinc-500">
            ENGINEER DOSSIER • PUBLIC PORTFOLIO
          </span>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">
        {/* Profile Hero */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#22c55e] text-black font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-[#22c55e]/20">
                AG
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100">Abhishek Garg</h1>
                <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                  Staff AI Infrastructure & Distributed Systems Architect
                </p>
                <div className="text-[11px] text-zinc-500 mt-1">
                  Targeting High Concurrency • Distributed Consensus • Low-Latency Inference
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href="mailto:abhishekgarg959@gmail.com"
                className="px-3 py-1.5 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Contact</span>
              </a>
            </div>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 font-sans">
            Specializing in high-throughput streaming systems, speculative inference decoding, eBPF Linux kernel tracing, and tiered WAL storage replication. Over 8 years designing production distributed topologies handling billions of daily records.
          </p>
        </div>

        {/* Featured Technical Articles */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#22c55e]" />
            Published Architectural Breakdowns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_ARTICLES.map((art) => (
              <div
                key={art.id}
                className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition space-y-2 flex flex-col justify-between"
              >
                <div>
                  <div className="text-[10px] text-[#f59e0b]">{art.category} • {art.readTime}</div>
                  <h3 className="font-bold text-xs text-slate-100 leading-snug">{art.title}</h3>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-1 font-sans">{art.subtitle}</p>
                </div>
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <span className="text-zinc-500">{art.views} reads</span>
                  <span className="text-[#22c55e]">Read Full Essay →</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Systems Projects */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
            <FolderGit2 className="w-4 h-4 text-[#22c55e]" />
            Featured Open-Source Architecture Systems
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {INITIAL_PROJECTS.map((proj) => (
              <div
                key={proj.id}
                className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-xs text-slate-100">{proj.name}</h3>
                  <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
                </div>
                <p className="text-[11px] text-zinc-400 font-sans">{proj.description}</p>
                <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[10px] text-zinc-300">
                  <span className="text-zinc-500 block mb-0.5">Architecture:</span>
                  {proj.architecture}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
