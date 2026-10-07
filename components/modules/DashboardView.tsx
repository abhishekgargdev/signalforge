'use client';

import React from 'react';
import {
  Zap,
  TrendingUp,
  Building2,
  MessageSquareQuote,
  Kanban,
  FileText,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Eye,
  Share2,
  ExternalLink,
  Target,
  UserPlus,
  Linkedin,
  MessageCircle
} from 'lucide-react';
import {
  TopicSignal,
  TargetCompany,
  EngagementOpportunity,
  ContentItem,
  ArticleItem,
  CareerGoal
} from '@/lib/signalforge-data';

interface DashboardViewProps {
  signals: TopicSignal[];
  companies: TargetCompany[];
  engagements: EngagementOpportunity[];
  pipeline: ContentItem[];
  articles: ArticleItem[];
  career: CareerGoal;
  onNavigate: (module: string) => void;
  onSelectTopic: (topic: TopicSignal) => void;
}

export function DashboardView({
  signals,
  companies,
  engagements,
  pipeline,
  articles,
  career,
  onNavigate,
  onSelectTopic,
}: DashboardViewProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner: Today's High-Level Briefing */}
      <div className="p-5 rounded-xl border border-[#22c55e]/25 bg-gradient-to-r from-[#0e1710] to-[#080c08] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-400">
              Active Strategy Engine
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-100 tracking-tight">
            Engineering Command Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            {career.targetRole ? (
              <>
                Positioning for <strong className="text-emerald-300 font-semibold">{career.targetRole}</strong> across{' '}
                {companies.length} tracked {companies.length === 1 ? 'company' : 'companies'}.
              </>
            ) : (
              <>Add career targets and companies to personalize this dashboard.</>
            )}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('discover')}
            className="px-3.5 py-2 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/40 text-emerald-300 text-xs font-semibold hover:bg-[#22c55e]/25 transition flex items-center gap-1.5"
          >
            <span>Scan Radar</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onNavigate('content')}
            className="px-3.5 py-2 rounded-lg bg-[#22c55e] text-black text-xs font-bold hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm shadow-[#22c55e]/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Wizard</span>
          </button>
        </div>
      </div>

      {/* Dual Spotlight: LinkedIn Auto-Connect & FAANG Comment Cron */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: LinkedIn AI Auto-Connect & Cron */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e1710] to-[#080c08] border border-[#0077b5]/40 hover:border-[#0077b5]/70 transition space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0077b5] text-white flex items-center justify-center font-bold">
                <Linkedin className="w-4 h-4 fill-white" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                  LinkedIn AI Prospector & Auto-Connect
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Configure daily invite limits in Prospector
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('prospector')}
              className="px-3 py-1.5 rounded-lg bg-[#0077b5] text-white font-bold text-xs hover:bg-[#005582] transition flex items-center gap-1"
            >
              <span>Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-snug">
            Describe who you want to reach in natural language; AI helps fill criteria and draft short connection notes.
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400 border-t border-white/5">
            <span>Queued: <strong className="text-emerald-400">—</strong></span>
            <span>Accepted rate: <strong className="text-[#22c55e]">—</strong></span>
          </div>
        </div>

        {/* Card 2: FAANG Post Auto-Commenter & Active Chat Studio */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-[#0e1710] to-[#080c08] border border-[#22c55e]/40 hover:border-[#22c55e]/70 transition space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#22c55e]/20 border border-[#22c55e]/40 text-[#22c55e] flex items-center justify-center font-bold">
                <MessageSquareQuote className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-xs text-slate-100 flex items-center gap-1.5">
                  FAANG Post Auto-Commenter & Chat Studio
                  <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-mono">
                    Cron Active
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400 font-mono">
                  Set comment cadence in Comment Studio
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigate('engagement')}
              className="px-3 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1"
            >
              <span>Launch</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-xs text-zinc-300 leading-snug">
            Track posts from target leaders, draft comments with AI, and prepare follow-up messages when you are ready.
          </p>

          <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-zinc-400 border-t border-white/5">
            <span>Profile views: <strong className="text-emerald-400">—</strong></span>
            <span>Inbounds: <strong className="text-[#f59e0b]">—</strong></span>
          </div>
        </div>
      </div>

      {/* Key Metric Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'High-Relevance Signals',
            value: `${signals.length} Active`,
            delta: signals.length ? 'From your radar' : 'Add signals in Discover',
            icon: Zap,
            color: '#22c55e',
            target: 'discover',
          },
          {
            label: 'Monitored Tech Leaders',
            value: `${companies.length} Companies`,
            delta: companies.length ? 'In your CRM' : 'Add companies',
            icon: Building2,
            color: '#f59e0b',
            target: 'companies',
          },
          {
            label: 'Engagement Queue',
            value: `${engagements.filter((e) => e.status === 'pending').length} Actionable`,
            delta: engagements.length ? 'Review queue' : 'No items queued',
            icon: MessageSquareQuote,
            color: '#10b981',
            target: 'engagement',
          },
          {
            label: 'Published articles',
            value: `${articles.filter((a) => a.status === 'published').length}`,
            delta: articles.length ? 'In your library' : 'Create in Articles',
            icon: TrendingUp,
            color: '#38bdf8',
            target: 'analytics',
          },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <button
              key={i}
              onClick={() => onNavigate(stat.target)}
              className="p-4 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] text-left hover:border-[#22c55e]/50 hover:bg-[#0e1710]/90 transition group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-medium">{stat.label}</span>
                <Icon className="w-4 h-4" style={{ color: stat.color }} />
              </div>
              <div className="text-xl font-bold font-mono text-slate-100 group-hover:text-emerald-300 transition">
                {stat.value}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono mt-1 flex items-center justify-between">
                <span>{stat.delta}</span>
                <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Signals + Priority Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High-Velocity Tech Signals */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-[#22c55e]" />
              <h2 className="text-sm font-bold text-slate-100">
                High-Velocity Signals (Today)
              </h2>
            </div>
            <button
              onClick={() => onNavigate('discover')}
              className="text-xs text-[#22c55e] hover:underline font-mono"
            >
              View all {signals.length} signals →
            </button>
          </div>

          <div className="space-y-3">
            {signals.length === 0 && (
              <div className="p-8 rounded-xl bg-[#0e1710] border border-white/5 text-center text-xs text-zinc-500 font-mono">
                No signals yet. Open Discover to add or import topics.
              </div>
            )}
            {signals.map((sig) => (
              <div
                key={sig.id}
                className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider block mb-1">
                      {sig.category} • {sig.freshness}
                    </span>
                    <h3 className="text-sm font-bold text-slate-100 hover:text-emerald-300 cursor-pointer"
                      onClick={() => onSelectTopic(sig)}
                    >
                      {sig.title}
                    </h3>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex-shrink-0">
                    {sig.trendScore}% Trend
                  </span>
                </div>

                <p className="text-xs text-zinc-400 leading-relaxed">{sig.summary}</p>

                <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-300 flex items-center justify-between">
                  <span className="text-zinc-500">Target Role Fit:</span>
                  <span className="text-emerald-400 font-semibold">{sig.careerRelevance}</span>
                </div>

                <div className="flex flex-wrap items-center justify-between pt-1 gap-2">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {sig.tags.map((tg) => (
                      <span
                        key={tg}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/50 text-zinc-400 border border-zinc-800"
                      >
                        #{tg}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectTopic(sig)}
                      className="text-xs px-2.5 py-1 rounded bg-[#080c08] border border-[#22c55e]/30 text-emerald-300 hover:bg-[#22c55e]/15 transition"
                    >
                      Inspect Dossier
                    </button>
                    <button
                      onClick={() => onNavigate('content')}
                      className="text-xs px-3 py-1 rounded bg-[#22c55e] text-black font-semibold hover:bg-emerald-400 transition"
                    >
                      Draft Content
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Today's Priority Queue & Content Pipeline */}
        <div className="space-y-6">
          {/* Priority Queue */}
          <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4">
            <div className="flex items-center justify-between border-b border-[#22c55e]/15 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-[#22c55e]" />
                Action Items (Today)
              </h3>
              <span className="text-[10px] font-mono text-zinc-500">
                {engagements.filter((e) => e.status === 'pending').length} pending
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {engagements.filter((e) => e.status === 'pending').length === 0 &&
                pipeline.filter((p) => ['draft', 'review', 'approved', 'scheduled'].includes(p.status)).length === 0 && (
                  <p className="p-4 rounded-lg bg-black/40 border border-white/5 text-zinc-500 font-mono text-[11px] text-center">
                    No action items. Add engagement opportunities or content drafts to see tasks here.
                  </p>
                )}
              {engagements
                .filter((e) => e.status === 'pending')
                .slice(0, 2)
                .map((e) => (
                  <button
                    type="button"
                    key={e.id}
                    onClick={() => onNavigate('engagement')}
                    className="w-full text-left p-3 rounded-lg bg-black/40 border border-emerald-500/20 hover:border-emerald-500/40 transition space-y-1"
                  >
                    <div className="font-semibold text-slate-200">Review comment for {e.author}</div>
                    <div className="text-[11px] text-zinc-400 line-clamp-2">{e.content}</div>
                  </button>
                ))}
              {pipeline
                .filter((p) => ['review', 'approved', 'scheduled'].includes(p.status))
                .slice(0, 2)
                .map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    onClick={() => onNavigate('content')}
                    className="w-full text-left p-3 rounded-lg bg-black/40 border border-white/5 hover:border-[#22c55e]/30 transition space-y-1"
                  >
                    <div className="font-semibold text-slate-200">{item.title}</div>
                    <div className="text-[11px] text-zinc-400 capitalize">{item.status}</div>
                  </button>
                ))}
            </div>
          </div>

          {/* Mini Pipeline Kanban */}
          <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3">
            <div className="flex items-center justify-between border-b border-[#22c55e]/15 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Kanban className="w-3.5 h-3.5 text-[#22c55e]" />
                Content Pipeline
              </h3>
              <button
                onClick={() => onNavigate('content')}
                className="text-[11px] font-mono text-[#22c55e] hover:underline"
              >
                Full Kanban →
              </button>
            </div>

            <div className="space-y-2">
              {pipeline.length === 0 && (
                <p className="text-[11px] text-zinc-500 font-mono p-2 text-center">Pipeline empty</p>
              )}
              {pipeline.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between text-xs"
                >
                  <div className="truncate mr-2">
                    <div className="font-medium text-slate-200 truncate">{item.title}</div>
                    <div className="text-[10px] text-zinc-500 font-mono">{item.type} • {item.platform}</div>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800 capitalize flex-shrink-0">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
