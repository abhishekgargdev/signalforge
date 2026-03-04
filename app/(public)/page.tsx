import React from 'react';
import Link from 'next/link';
import {
  Zap,
  Terminal,
  ArrowRight,
  BookOpen,
  FolderGit2,
  TrendingUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_PROJECTS, INITIAL_TOPIC_SIGNALS } from '@/lib/signalforge-data';

export default function PublicHomePage() {
  return (
    <div className="space-y-16 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-2xl p-8 sm:p-14 border border-[#22c55e]/30 bg-gradient-to-b from-[#0e1710] to-[#080c08] shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#22c55e]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#22c55e]/40 text-[#22c55e] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
            <span>SignalForge Intelligence Engine • Live</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Discover. Understand. Create. Engage. Grow.
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-2xl">
            The AI-powered personal-brand, technology-intelligence, and career-signal engine for software engineers and systems leaders. Turn frontier breakthroughs into high-authority publications and strategic relationships.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition shadow-lg shadow-[#22c55e]/25"
            >
              <span>Launch Command Hub</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>

            <Link
              href="/articles"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-black/50 border border-[#22c55e]/40 text-emerald-300 text-xs font-bold hover:bg-[#22c55e]/10 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Explore Architectural Essays</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            icon: Zap,
            title: '1. Breakthrough Discovery',
            desc: 'Real-time telemetry on frontier AI models, kernel improvements, and distributed database shifts before they hit mainstream feeds.',
          },
          {
            icon: ShieldCheck,
            title: '2. Anti-Spam Engagement',
            desc: 'Context-specific, high-density commentary on posts from target engineering leaders at Anthropic, Stripe, and Datadog.',
          },
          {
            icon: Terminal,
            title: '3. Grounded Thought Leadership',
            desc: 'Convert real production incidents from your STAR experience vault into deep-dive technical publications and viral carousels.',
          },
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={i}
              className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3 hover:border-[#22c55e]/40 transition"
            >
              <Icon className="w-6 h-6 text-[#22c55e]" />
              <h3 className="font-bold text-sm text-slate-100">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{feat.desc}</p>
            </div>
          );
        })}
      </section>

      {/* Latest Technical Publications */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#22c55e]" />
              Featured Technical Publications
            </h2>
            <p className="text-xs text-zinc-400">Deep architectural breakdowns verified with concrete invariants</p>
          </div>
          <Link href="/articles" className="text-xs text-[#22c55e] hover:underline font-mono">
            View all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_ARTICLES.map((art) => (
            <Link
              key={art.id}
              href={`/articles/${art.slug}`}
              className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/50 transition group flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-[#f59e0b] mb-2 font-mono">
                  <span>{art.category}</span>
                  <span>{art.readTime}</span>
                </div>
                <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-300 transition leading-snug">
                  {art.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2 mt-2 font-sans">
                  {art.subtitle}
                </p>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">By Abhishek Garg</span>
                <span className="text-[#22c55e] group-hover:translate-x-1 transition flex items-center gap-1">
                  Read Essay <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Open Source Architecture Systems */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-[#22c55e]" />
              Grounded Systems Implementations
            </h2>
            <p className="text-xs text-zinc-400">Production repositories backing our editorial thesis</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {INITIAL_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3"
            >
              <h3 className="font-bold text-sm text-slate-100">{proj.name}</h3>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed">{proj.description}</p>
              <div className="p-3 rounded-lg bg-black/50 border border-white/5 text-[11px] font-mono text-emerald-300">
                {proj.architecture}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
