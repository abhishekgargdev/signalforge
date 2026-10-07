'use client';

import React, { useState } from 'react';
import { Bot, Zap } from 'lucide-react';
import { INITIAL_PROMPT_LIBRARY } from '@/lib/signalforge-data';

export function AiWorkspaceView() {
  const [prompts] = useState(INITIAL_PROMPT_LIBRARY);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">AI Intelligence Workspace & Prompt Engine</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Save and reuse prompt templates for content, engagement, and research workflows.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-[#0e1710] px-3 py-1.5 rounded-lg border border-[#22c55e]/20">
          <Zap className="w-3.5 h-3.5" />
          <span>Model: configure via GEMINI_API_KEY</span>
        </div>
      </div>

      {prompts.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 text-center space-y-2">
          <p className="text-sm text-zinc-400 font-mono">No saved prompts yet</p>
          <p className="text-xs text-zinc-500 max-w-md mx-auto">
            Prompt templates from docs or your own recipes can be added here when you implement persistence.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {prompts.map((p) => (
            <div key={p.id} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
              <span className="text-[10px] font-mono text-[#f59e0b]">{p.category}</span>
              <h4 className="font-bold text-xs text-slate-200">{p.name}</h4>
              <p className="text-xs text-zinc-400 line-clamp-4">{p.promptText}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
