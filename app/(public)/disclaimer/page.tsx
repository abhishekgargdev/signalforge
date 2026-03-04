import React from 'react';

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6 font-mono text-xs">
      <h1 className="text-2xl font-bold text-slate-100">AI Content Disclaimer</h1>
      <p className="text-zinc-400">Effective Date: September 2026</p>

      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4 text-zinc-300 font-sans leading-relaxed">
        <h2 className="text-sm font-bold text-[#f59e0b] font-mono">Human-in-the-Loop Imperative</h2>
        <p>
          SignalForge utilizes artificial intelligence models to assist with research summarization, technical commentary formulation, and draft structuring. AI-generated analyses do not represent peer-reviewed engineering certifications or infallible benchmarks without independent testing.
        </p>
        <p>
          Always verify mathematical formulas, kernel parameters, and concurrency guarantees before executing them in production distributed clusters.
        </p>
      </div>
    </div>
  );
}
