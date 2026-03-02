'use client';

import React, { useState } from 'react';
import { Mail, MessageSquare, Terminal, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/v1/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error?.message || 'Could not send message');
      return;
    }
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-zinc-400 block">Work Email:</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@work-email.com"
                autoComplete="email"
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 placeholder-zinc-600 focus:outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="text-zinc-400 block">Message / Inquiry:</label>
              <textarea
                rows={4}
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="How can we help?"
                className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 placeholder-zinc-600 focus:outline-none resize-none"
              />
            </div>

            {error && <p className="text-xs text-red-300">{error}</p>}
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
            >
              Send message
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
