'use client';

import React from 'react';
import { Terminal, Zap } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 flex items-center justify-center p-4 font-mono">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#0e1710] border border-[#22c55e]/40 flex items-center justify-center mx-auto text-[#22c55e] shadow-lg shadow-[#22c55e]/15">
          <Zap className="w-6 h-6 animate-pulse" />
        </div>
        <div className="text-xs font-mono text-emerald-400">
          Synchronizing SignalForge Telemetry...
        </div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
          <div className="h-full bg-[#22c55e] animate-pulse w-3/4 rounded-full" />
        </div>
      </div>
    </div>
  );
}
