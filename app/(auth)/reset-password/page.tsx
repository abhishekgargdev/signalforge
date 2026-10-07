'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Lock, CheckCircle2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setSuccess(true);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-slate-100">Set New Password</h1>
        <p className="text-xs text-zinc-400">Enter your new secure cryptographic password</p>
      </div>

      {success ? (
        <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs space-y-2 text-center">
          <CheckCircle2 className="w-6 h-6 mx-auto text-[#22c55e]" />
          <p>Password updated successfully.</p>
          <Link href="/login" className="inline-block text-xs text-[#22c55e] hover:underline pt-2 font-mono">
            Sign In with New Password &rarr;
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="text-zinc-400 block mb-1">New Password:</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Confirm New Password:</label>
            <input
              type="password"
              required
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              className="w-full px-3 py-2.5 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition"
          >
            Update Credentials
          </button>
        </form>
      )}
    </div>
  );
}
