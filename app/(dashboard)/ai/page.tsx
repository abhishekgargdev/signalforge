'use client';

import React, { useState } from 'react';
import { Bot } from 'lucide-react';
import { PROMPT_LIBRARY } from '@/lib/prompt-library';

export default function AiWorkspacePage() {
  const [selectedId, setSelectedId] = useState(PROMPT_LIBRARY[0].id);
  const [lastProvider, setLastProvider] = useState<string | null>(null);
  const [output, setOutput] = useState('');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const selected = PROMPT_LIBRARY.find((p) => p.id === selectedId) || PROMPT_LIBRARY[0];

  const run = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `${selected.promptText}\n\nUser input:\n${input}`,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message || 'Generation failed');
        return;
      }
      setOutput(data.data?.text || '');
      setLastProvider(data.data?.provider || null);
    } catch {
      setError('Generation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Bot className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">AI workspace</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Prompts run through Gemini, then NVIDIA, then Groq when a provider is over quota.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 bg-[#0e1710] px-3 py-1.5 rounded-lg border border-[#22c55e]/20">
          Last provider: {lastProvider || 'none yet'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-2">
          {PROMPT_LIBRARY.map((prompt) => (
            <button
              key={prompt.id}
              type="button"
              onClick={() => setSelectedId(prompt.id)}
              className={`w-full text-left p-4 rounded-xl border ${
                selected.id === prompt.id
                  ? 'bg-[#0e1710] border-[#22c55e]'
                  : 'bg-[#080c08] border-[#22c55e]/20'
              }`}
            >
              <span className="text-[10px] font-mono text-[#f59e0b]">{prompt.category}</span>
              <div className="font-bold text-xs text-slate-200 mt-1">{prompt.name}</div>
            </button>
          ))}
        </div>
        <div className="lg:col-span-2 space-y-3">
          <pre className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 text-xs text-emerald-200 whitespace-pre-wrap font-mono">
            {selected.promptText}
          </pre>
          <textarea
            rows={5}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Source text, notes, or the post you want this prompt applied to"
            className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-xs text-slate-200 placeholder-zinc-600 focus:outline-none"
          />
          <button
            type="button"
            onClick={run}
            disabled={loading || !input.trim()}
            className="px-4 py-2 rounded bg-[#22c55e] text-black text-xs font-bold disabled:opacity-50"
          >
            {loading ? 'Generating…' : 'Run prompt'}
          </button>
          {error && <p className="text-xs text-red-300">{error}</p>}
          {output && (
            <pre className="p-4 rounded-xl bg-black/50 border border-white/10 text-xs text-slate-200 whitespace-pre-wrap font-mono">
              {output}
            </pre>
          )}
        </div>
      </div>
    </div>
  );
}
