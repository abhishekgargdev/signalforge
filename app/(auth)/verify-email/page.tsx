'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MailCheck, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const verify = async () => {
    setError(null);
    const res = await fetch('/api/v1/auth/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: searchParams.get('token') }),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error?.message || 'Could not verify email');
      return;
    }
    setStatus('Email verified');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-center mx-auto text-[#22c55e]">
        <MailCheck className="w-6 h-6" />
      </div>
      <div className="space-y-2">
        <h1 className="text-xl font-bold text-slate-100">Verify your email</h1>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          Use the link from your inbox, or confirm the token in this page.
        </p>
      </div>
      {error && <p className="text-xs text-red-300">{error}</p>}
      {status && <p className="text-xs text-emerald-300">{status}</p>}
      <button
        type="button"
        onClick={verify}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs"
      >
        Confirm email
      </button>
      <div>
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-xs text-emerald-400">
          <span>Continue to dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
