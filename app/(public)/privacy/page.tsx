import React from 'react';

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 space-y-6 font-mono text-xs">
      <h1 className="text-2xl font-bold text-slate-100">SignalForge Privacy Policy</h1>
      <p className="text-zinc-400">Effective Date: September 2026</p>

      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4 text-zinc-300 font-sans leading-relaxed">
        <h2 className="text-sm font-bold text-emerald-400 font-mono">1. Zero Scraping Policy</h2>
        <p>
          SignalForge processes only publicly available research papers, technology blog posts, and user-provided experience vault records. We never scrape private accounts or violate platform terms.
        </p>

        <h2 className="text-sm font-bold text-emerald-400 font-mono">2. AI Generation Privacy</h2>
        <p>
          Your experience vault stories and unpublished draft posts are treated as confidential. They are passed to AI inference providers with zero data retention enabled.
        </p>

        <h2 className="text-sm font-bold text-emerald-400 font-mono">3. Security</h2>
        <p>
          All API secrets, OAuth tokens, and Cloudinary keys are stored server-side with encryption and are never sent to the client browser.
        </p>
      </div>
    </div>
  );
}
