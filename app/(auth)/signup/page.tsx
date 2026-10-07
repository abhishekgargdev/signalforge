'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User, Mail, Lock, ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, username, email, password, confirmPassword, acceptTerms }),
      });
      const data = await res.json();

      if (data.success) {
        router.push('/dashboard');
      } else {
        setError(data.error?.message || 'Registration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-xl font-bold text-slate-100">Create SignalForge Identity</h1>
        <p className="text-xs text-zinc-400">Position your technical authority and personal brand</p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-mono">
        <div>
          <label className="text-zinc-400 block mb-1">Full Legal / Engineering Name:</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Abhishek Garg"
            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e]"
          />
        </div>

        <div>
          <label className="text-zinc-400 block mb-1">Handle / Username:</label>
          <input
            type="text"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase())}
            placeholder="e.g. abhishekgarg"
            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e]"
          />
        </div>

        <div>
          <label className="text-zinc-400 block mb-1">Work Email Address:</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e]"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-zinc-400 block mb-1">Password:</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
            />
          </div>
          <div>
            <label className="text-zinc-400 block mb-1">Confirm:</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
            />
          </div>
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center justify-center gap-1.5 shadow-md shadow-[#22c55e]/20"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              <>
                <span>Initialize Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>
      </form>

      <div className="text-center text-xs text-zinc-500">
        Already registered?{' '}
        <Link href="/login" className="text-emerald-400 hover:underline font-semibold">
          Sign In
        </Link>
      </div>
    </div>
  );
}
