'use client';

import React, { useState } from 'react';
import { BarChart3, Eye, Users, MessageSquare, Globe } from 'lucide-react';

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    { label: 'Post impressions', val: '—', delta: 'Connect integrations', icon: Eye, color: '#22c55e' },
    { label: 'Engagement rate', val: '—', delta: 'No data', icon: MessageSquare, color: '#38bdf8' },
    { label: 'Profile views', val: '—', delta: 'No data', icon: Users, color: '#f59e0b' },
    { label: 'Article readers', val: '—', delta: 'Publish articles', icon: Globe, color: '#a855f7' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">Technical Brand & Audience Analytics</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">Metrics appear when you connect social accounts and publish content.</p>
        </div>
        <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
          {(['7d', '30d', '90d'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded transition ${
                timeRange === r ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div key={i} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{st.label}</span>
                <Icon className="w-4 h-4" style={{ color: st.color }} />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100">{st.val}</div>
              <div className="text-[11px] font-mono text-zinc-500">{st.delta}</div>
            </div>
          );
        })}
      </div>

      <div className="p-12 rounded-xl bg-[#0e1710] border border-white/5 text-center text-xs text-zinc-500 font-mono">
        Charts and trends will populate from live analytics—not sample data.
      </div>
    </div>
  );
}
