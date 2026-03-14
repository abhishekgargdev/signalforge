'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Radar, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { INITIAL_TOPIC_SIGNALS } from '@/lib/signalforge-data';

export default function ResearchPage() {
  const router = useRouter();

  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Radar className="w-5 h-5 text-[#22c55e]" />
          Deep Systems Research & Verification Lab
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Automated multi-source fact-checking, mathematical invariant extraction, and peer analysis.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {INITIAL_TOPIC_SIGNALS.map((topic) => (
          <div
            key={topic.id}
            className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3 flex flex-col justify-between"
          >
            <div>
              <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider block mb-1">
                {topic.category}
              </span>
              <h2 className="font-bold text-sm text-slate-100 leading-snug">{topic.title}</h2>
              <p className="text-xs text-zinc-400 mt-1">{topic.summary}</p>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
              <span className="text-zinc-500 font-mono text-[10px]">{topic.source}</span>
              <button
                onClick={() => router.push('/content')}
                className="px-3 py-1 rounded bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
              >
                Synthesize Post →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
