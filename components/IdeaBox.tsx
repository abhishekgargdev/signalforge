'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export function IdeaBox({
  label = 'Describe the idea',
  placeholder = 'Explain what you want, and the draft will use your profile, experience, companies, and topics.',
  onFill,
}: {
  label?: string;
  placeholder?: string;
  onFill: (text: string) => void;
}) {
  const [idea, setIdea] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async () => {
    if (!idea.trim()) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/ai/fill', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea }),
      });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message || 'Could not draft this');
        return;
      }
      onFill(data.data.text);
    } catch {
      setError('Could not reach the AI service');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2 rounded-lg border border-[#22c55e]/25 bg-black/30 p-3">
      <label className="text-[10px] font-mono uppercase tracking-wider text-zinc-500">{label}</label>
      <textarea
        rows={3}
        value={idea}
        onChange={(e) => setIdea(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded bg-black/60 border border-[#22c55e]/30 p-2 text-xs text-slate-100"
      />
      <div className="flex items-center justify-between gap-2">
        {error ? <p className="text-[11px] text-red-300">{error}</p> : <span />}
        <button
          type="button"
          onClick={run}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-60"
        >
          <Sparkles className="h-3.5 w-3.5" />
          {busy ? 'Drafting' : 'Fill with AI'}
        </button>
      </div>
    </div>
  );
}
