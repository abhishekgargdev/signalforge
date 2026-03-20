'use client';

import React, { useState } from 'react';
import {
  Bot,
  Sparkles,
  Terminal,
  Copy,
  Check,
  Zap,
  Code,
  Layers,
  Send,
  RefreshCw
} from 'lucide-react';
import { INITIAL_PROMPT_LIBRARY } from '@/lib/signalforge-data';

export function AiWorkspaceView() {
  const [prompts] = useState(INITIAL_PROMPT_LIBRARY);
  const [selectedPrompt, setSelectedPrompt] = useState(prompts[0]);
  const [copiedPromptId, setCopiedPromptId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedPromptId(id);
    setTimeout(() => setCopiedPromptId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              AI Intelligence Workspace & Prompt Engine
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Prompt recipes engineered for high-density, zero-slop systems engineering communications.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#0e1710] px-3 py-1.5 rounded-lg border border-[#22c55e]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Active Model: @google/genai (gemini-2.5-flash)</span>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Prompt Library list */}
        <div className="space-y-3">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Curated Systems Prompts
          </span>
          {prompts.map((p) => {
            const isSelected = selectedPrompt.id === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedPrompt(p)}
                className={`p-4 rounded-xl border transition cursor-pointer space-y-2 ${
                  isSelected
                    ? 'bg-[#0e1710] border-[#22c55e] ring-1 ring-[#22c55e]'
                    : 'bg-[#080c08] border-[#22c55e]/20 hover:border-[#22c55e]/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-[#f59e0b]">{p.category}</span>
                  <span className="text-[10px] font-mono text-zinc-500">~{p.tokens} tokens</span>
                </div>
                <h4 className="font-bold text-xs text-slate-200">{p.name}</h4>
                <p className="text-xs text-zinc-400 line-clamp-2">{p.promptText}</p>
              </div>
            );
          })}
        </div>

        {/* Right 2 Cols: Prompt Inspector & Execution Playground */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div>
                <span className="text-[10px] font-mono text-[#f59e0b] uppercase block">
                  Prompt Specification
                </span>
                <h3 className="font-bold text-sm text-slate-100">{selectedPrompt.name}</h3>
              </div>
              <button
                onClick={() => handleCopy(selectedPrompt.id, selectedPrompt.promptText)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white/10 hover:bg-white/15 text-xs text-slate-200 font-mono"
              >
                {copiedPromptId === selectedPrompt.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedPromptId === selectedPrompt.id ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-mono text-zinc-400 block">
                System Instruction & Context Framing:
              </label>
              <div className="p-4 rounded-lg bg-black/60 border border-[#22c55e]/25 text-xs text-emerald-200 font-mono leading-relaxed whitespace-pre-wrap">
                {selectedPrompt.promptText}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs font-mono text-zinc-400">
              <div className="p-3 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">ENGINEERING CONSTRAINTS</span>
                <span className="text-slate-200 mt-1 block">Anti-Slop, No Fluff, Math Invariants</span>
              </div>
              <div className="p-3 rounded bg-black/40 border border-white/5">
                <span className="text-zinc-500 block text-[10px]">ESTIMATED GENERATION LATENCY</span>
                <span className="text-slate-200 mt-1 block">~680ms (Streaming)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
