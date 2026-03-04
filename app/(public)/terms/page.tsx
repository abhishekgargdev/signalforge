import React from 'react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6 font-mono text-xs">
      <h1 className="text-2xl font-bold text-slate-100">Terms of Service</h1>
      <p className="text-zinc-400">Effective Date: September 2026</p>

      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4 text-zinc-300 font-sans leading-relaxed">
        <h2 className="text-sm font-bold text-emerald-400 font-mono">1. Authentic Commentary Obligation</h2>
        <p>
          SignalForge users agree not to use the platform for automated bot spamming, mass non-reviewed commenting, or misleading technical claims. All generated content must undergo human verification prior to publication.
        </p>

        <h2 className="text-sm font-bold text-emerald-400 font-mono">2. Content Ownership</h2>
        <p>
          You retain full copyright and editorial ownership of all articles, carousels, and experience stories authored within the SignalForge environment.
        </p>
      </div>
    </div>
  );
}
