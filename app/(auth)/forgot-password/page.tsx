'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-slate-100">Reset Credentials</h1>
        <p className="text-xs text-zinc-400">Transmit a secure recovery token to your registered email</p>
      </div>

      {sent ? (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 text-center">
          <CheckCircle2 className="w-6 h-6 mx-auto text-[#22c55e]" />
          <p>Recovery instructions have been transmitted to {email}.</p>
          <Link href="/login" className="inline-block text-xs text-[#22c55e] hover:underline pt-2 font-mono">
            Return to Sign In &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">Registered Work Email:</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition"
          >
            Send Recovery Dispatch
          </button>
        </form>
      )}

      <div className="text-center text-xs text-zinc-500">
        <Link href="/login" className="hover:text-emerald-400">
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
