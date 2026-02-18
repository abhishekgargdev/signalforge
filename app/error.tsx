'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Terminal, ArrowLeft } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('SignalForge error caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 flex items-center justify-center p-4 font-mono">
      <div className="max-w-md w-full p-8 rounded-xl bg-[#0e1710] border border-red-500/30 text-center space-y-5 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-black/60 border border-red-500/40 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-mono text-red-400 uppercase tracking-wider block">
            SIGNAL DISRUPTION DETECTED
          </span>
          <h1 className="text-xl font-extrabold text-slate-100">
            Something Interrupted the Signal
          </h1>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Telemetry stream encountered an unexpected condition. You can re-establish the connection or inspect the console logs.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Re-establish Signal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
