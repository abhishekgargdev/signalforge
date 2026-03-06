'use client';

import React from 'react';
import Link from 'next/link';
import { MailCheck, ArrowRight } from 'lucide-react';

export default function VerifyEmailPage() {
  return (
    <div className="space-y-6 text-center">
      <div className="w-12 h-12 rounded-xl bg-[#22c55e]/15 border border-[#22c55e]/40 flex items-center justify-center mx-auto text-[#22c55e]">
        <MailCheck className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h1 className="text-xl font-bold text-slate-100">Verify Your Email</h1>
        <p className="text-xs text-zinc-400 font-sans leading-relaxed">
          We have dispatched a cryptographic verification link to your inbox. Once verified, all pipeline publishing features will be activated.
        </p>
      </div>

      <div className="pt-2">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
        >
          <span>Continue to Command Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
