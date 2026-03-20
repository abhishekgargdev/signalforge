'use client';

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  MessageSquare,
  Globe,
  Calendar,
  Share2,
  ArrowUpRight
} from 'lucide-react';

export function AnalyticsView() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stats = [
    { label: 'Cumulative Post Impressions', val: '48,920', delta: '+28.4%', icon: Eye, color: '#22c55e' },
    { label: 'Avg Technical Engagement Rate', val: '6.4%', delta: '+1.8%', icon: MessageSquare, color: '#38bdf8' },
    { label: 'Staff Profile Views', val: '1,420', delta: '+41.2%', icon: Users, color: '#f59e0b' },
    { label: 'Public Article Readers', val: '8,010', delta: '+19.6%', icon: Globe, color: '#a855f7' },
  ];

  const weeklyTraffic = [
    { week: 'Week 1', views: 6400, engagements: 480 },
    { week: 'Week 2', views: 9800, engagements: 720 },
    { week: 'Week 3', views: 14200, engagements: 980 },
    { week: 'Week 4', views: 18520, engagements: 1340 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Technical Brand & Audience Analytics
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Quantify inbound authority, readership duration, and recruiting decision-maker engagement.
          </p>
        </div>

        {/* Time range selector */}
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

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((st, i) => {
          const Icon = st.icon;
          return (
            <div
              key={i}
              className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{st.label}</span>
                <Icon className="w-4 h-4" style={{ color: st.color }} />
              </div>
              <div className="text-2xl font-bold font-mono text-slate-100">{st.val}</div>
              <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <ArrowUpRight className="w-3.5 h-3.5" />
                <span>{st.delta} vs previous period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Representation & Inbound Trajectory */}
      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-6">
        <div className="flex items-center justify-between border-b border-white/5 pb-3">
          <div>
            <h3 className="font-bold text-sm text-slate-100">Weekly Impressions & Engagement Velocity</h3>
            <p className="text-xs text-zinc-400">Demonstrates consistent technical momentum</p>
          </div>
          <span className="text-xs font-mono text-emerald-400">Target Role Trajectory: Strong</span>
        </div>

        {/* CSS Bar Chart Simulation */}
        <div className="space-y-4">
          {weeklyTraffic.map((w, idx) => {
            const maxViews = 20000;
            const pct = Math.round((w.views / maxViews) * 100);
            return (
              <div key={idx} className="space-y-1.5 text-xs font-mono">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="text-slate-200 font-semibold">{w.week}</span>
                  <span>{w.views.toLocaleString()} views • {w.engagements} comments & reposts</span>
                </div>
                <div className="w-full h-3 rounded-full bg-black/60 overflow-hidden border border-zinc-800 flex">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-600 to-[#22c55e] rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
