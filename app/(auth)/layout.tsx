import React from 'react';
import Link from 'next/link';
import { BrandMark } from '@/components/BrandMark';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 font-mono flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <BrandMark size={40} className="rounded-xl shadow-lg shadow-[#22c55e]/30" />
          </Link>
          <div className="font-extrabold text-lg tracking-wider text-emerald-400">
            SIGNALFORGE
          </div>
          <p className="text-xs text-zinc-500">
            Discover • Understand • Create • Engage • Grow
          </p>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#0e1710] border border-[#22c55e]/30 shadow-2xl">
          {children}
        </div>

        <div className="text-center text-xs text-zinc-600 font-mono">
          <Link href="/" className="hover:text-emerald-400">
            &larr; Return to SignalForge Public
          </Link>
        </div>
      </div>
    </div>
  );
}
