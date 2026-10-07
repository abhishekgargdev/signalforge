'use client';

import React, { useState } from 'react';
import { Share2, Smartphone, Monitor } from 'lucide-react';

export function SocialView() {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">Cross-Platform Social Hub</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Connect accounts and schedule posts from your content pipeline.</p>
        </div>
        <div className="flex items-center gap-2 bg-[#0e1710] p-1 rounded-lg border border-[#22c55e]/20 text-xs font-mono">
          <button
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              deviceMode === 'desktop' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded transition ${
              deviceMode === 'mobile' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      <div className="p-10 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 text-center space-y-3">
        <p className="text-sm text-zinc-400 font-mono">No connected social accounts</p>
        <p className="text-xs text-zinc-500 max-w-md mx-auto">
          Link LinkedIn or X in Settings → Integrations. Draft previews will use your scheduled content, not demo posts.
        </p>
      </div>
    </div>
  );
}
