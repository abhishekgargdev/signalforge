'use client';

import React, { useState } from 'react';
import {
  Share2,
  Calendar,
  CheckCircle2,
  Clock,
  Smartphone,
  Monitor,
  ExternalLink,
  ShieldCheck,
  Send
} from 'lucide-react';

export function SocialView() {
  const [previewPlatform, setPreviewPlatform] = useState<'linkedin' | 'x'>('linkedin');
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');

  const accounts = [
    { platform: 'LinkedIn', account: 'Abhishek Garg', status: 'Connected', lastSync: '10m ago' },
    { platform: 'X (Twitter)', account: '@abhishekgarg_sys', status: 'Connected', lastSync: '1h ago' },
    { platform: 'Instagram (Tech)', account: '@signalforge_eng', status: 'Standby', lastSync: '1d ago' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Cross-Platform Social Hub & Multi-Device Previews
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Maintain synchronized engineering brand presence across LinkedIn and X with pixel-accurate previews.
          </p>
        </div>

        {/* Device Switcher */}
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

      {/* Account Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {accounts.map((acc, i) => (
          <div
            key={i}
            className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-sm text-slate-200">{acc.platform}</div>
              <div className="text-xs text-zinc-400 font-mono">{acc.account}</div>
              <div className="text-[10px] text-zinc-500 font-mono mt-1">Sync: {acc.lastSync}</div>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
              {acc.status}
            </span>
          </div>
        ))}
      </div>

      {/* Social Preview Stage */}
      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
        <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-zinc-400 uppercase">Platform Preview:</span>
            <div className="flex gap-2">
              <button
                onClick={() => setPreviewPlatform('linkedin')}
                className={`px-3 py-1 rounded text-xs font-mono transition ${
                  previewPlatform === 'linkedin'
                    ? 'bg-[#22c55e] text-black font-bold'
                    : 'bg-black text-zinc-400'
                }`}
              >
                LinkedIn Post Card
              </button>
              <button
                onClick={() => setPreviewPlatform('x')}
                className={`px-3 py-1 rounded text-xs font-mono transition ${
                  previewPlatform === 'x'
                    ? 'bg-[#22c55e] text-black font-bold'
                    : 'bg-black text-zinc-400'
                }`}
              >
                X / Twitter Thread
              </button>
            </div>
          </div>
          <span className="text-xs font-mono text-emerald-400">
            Render Mode: {deviceMode.toUpperCase()}
          </span>
        </div>

        {/* Visual Simulated Mockup Container */}
        <div className="flex justify-center p-4">
          <div
            className={`border border-white/10 rounded-xl bg-black/90 p-5 space-y-3 transition-all ${
              deviceMode === 'mobile' ? 'max-w-sm w-full' : 'max-w-xl w-full'
            }`}
          >
            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
                  AG
                </div>
                <div>
                  <div className="font-bold text-xs text-slate-100">Abhishek Garg</div>
                  <div className="text-[10px] text-zinc-400">
                    Staff AI & Systems Architect • Targeting High Concurrency
                  </div>
                  <div className="text-[9px] text-zinc-500 font-mono">1h ago • Edited</div>
                </div>
              </div>
            </div>

            {/* Post text */}
            <div className="text-xs text-slate-200 font-mono leading-relaxed whitespace-pre-wrap">
              Speculative decoding is not a free lunch. If your draft model has less than 70% acceptance rate on code generation, rollback thrashing will degrade your p95 latency.
              <br /><br />
              1. Token generation is bounded by HBM3e bandwidth, not compute.
              <br />
              2. Single forward verification pass evaluates K tokens for free.
              <br />
              3. Dynamic entropy gating prevents speculative penalties on edge branches.
              <br /><br />
              <span className="text-emerald-400 font-semibold">#LLMInference #DistributedSystems #vLLM</span>
            </div>

            {/* Simulated Banner Attachment */}
            <div className="rounded-lg overflow-hidden border border-zinc-800 bg-[#0e1710] p-4 text-center">
              <span className="text-[10px] font-mono text-zinc-500 block">ATTACHED ASSET</span>
              <div className="font-bold text-xs text-emerald-300 mt-1">
                Speculative Draft Model Memory Throughput Benchmarks
              </div>
            </div>

            {/* Reactions / Stats bar */}
            <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[10px] font-mono text-zinc-500">
              <span>👍 248 engineering reactions</span>
              <span>38 reposts • 42 comments</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
