'use client';

import React, { useState } from 'react';
import { X, Sparkles, Send, Copy, Check, RefreshCw, Terminal } from 'lucide-react';

interface AIModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIModal({ isOpen, onClose }: AIModalProps) {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [selectedTask, setSelectedTask] = useState<'comment' | 'article_outline' | 'signal_analysis'>('comment');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setResponse(null);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          type: selectedTask,
          model: 'gemini-2.5-flash',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setResponse(data.text);
      } else {
        setResponse('Signal engine received empty response. Please retry.');
      }
    } catch (err: any) {
      setResponse(`Error generating intelligence: ${err.message || 'Network anomaly'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (response) {
      navigator.clipboard?.writeText(response);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-2xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            <h3 className="font-bold text-sm text-emerald-300">Forge AI Intelligence Terminal</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Task Selection Pills */}
        <div className="px-4 py-2 border-b border-[#22c55e]/15 bg-[#0e1710]/40 flex items-center gap-2 text-xs">
          <span className="text-[10px] font-mono text-zinc-500 uppercase">Mode:</span>
          {[
            { id: 'comment', label: 'Comment Angles' },
            { id: 'article_outline', label: 'Article Deep-Dive' },
            { id: 'signal_analysis', label: 'Signal Breakdown' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTask(t.id as any)}
              className={`px-2.5 py-1 rounded text-[11px] font-mono transition ${
                selectedTask === t.id
                  ? 'bg-[#22c55e] text-black font-semibold'
                  : 'bg-black/40 text-zinc-400 hover:text-emerald-300 border border-white/5'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Main Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="text-[11px] font-mono text-zinc-400 block mb-1.5">
              Enter target post, architecture topic, or prompt:
            </label>
            <textarea
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Paste text or describe what you want the assistant to analyze..."
              className="w-full p-3 rounded-lg bg-[#0e1710] border border-[#22c55e]/30 text-xs text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e] font-mono resize-none"
            />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono text-zinc-500">
              Powered by @google/genai (gemini-2.5-flash)
            </span>
            <button
              onClick={handleGenerate}
              disabled={loading || !prompt.trim()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#22c55e] hover:bg-emerald-400 disabled:opacity-50 text-black font-bold text-xs transition"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Generate Intelligence</span>
                </>
              )}
            </button>
          </div>

          {/* Response Output */}
          {response && (
            <div className="p-4 rounded-lg bg-[#0e1710] border border-[#22c55e]/30 space-y-3">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5" />
                  SignalForge Output
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-emerald-300"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <div className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-mono">
                {response}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
