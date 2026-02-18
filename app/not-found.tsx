'use client';

import React from 'react';
import Link from 'next/link';
import { Radar, ArrowLeft, RefreshCw, Terminal } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full p-8 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-black/60 border border-[#22c55e]/40 flex items-center justify-center mx-auto text-[#22c55e]">
          <Radar className="w-8 h-8 animate-spin" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider block">
            HTTP 404 // SIGNAL LOST
          </span>
          <h1 className="text-2xl font-extrabold text-slate-100">
            Signal Not Found
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            The requested trajectory, article dossier, or telemetry record does not exist in the active frequency band.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Re-align to Command Hub</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
