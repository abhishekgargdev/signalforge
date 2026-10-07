'use client';

import React from 'react';
import { Radar } from 'lucide-react';

export default function ResearchPage() {
  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
          <Radar className="w-5 h-5 text-[#22c55e]" />
          Deep Systems Research & Verification Lab
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Multi-source fact-checking and analysis tied to signals in Discover.
        </p>
      </div>
      <div className="p-12 rounded-xl bg-[#0e1710] border border-white/5 text-center text-xs text-zinc-500 font-mono">
        Add topics in Discover to run research workflows here.
      </div>
    </div>
  );
}
