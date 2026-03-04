'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 space-y-8 font-mono">
      <div className="space-y-2">
        <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider block">
          COMMUNICATION CHANNEL
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Connect with SignalForge
        </h1>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          For technical collaborations, enterprise deployment reviews, or signal radar partnerships.
        </p>
      </div>

      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4 text-xs">
        {sent ? (
          <div className="p-6 text-center space-y-3">
            <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto" />
            <h3 className="font-bold text-slate-100 text-sm">Message Transmitted</h3>
            <p className="text-zinc-400">Your dispatch has been delivered to the SignalForge queue.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-zinc-400 block">Your Name / Handle:</label>
              <input
                type="text"
                required
                placeholder="e.g. Elena Rostova"
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-zinc-400 block">Work Email:</label>
              <input
                type="email"
                required
                placeholder="elena@company.com"
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-zinc-400 block">Message / Inquiry:</label>
              <textarea
                rows={4}
                required
                placeholder="Describe your inquiry..."
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
            >
              Transmit Dispatch
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
