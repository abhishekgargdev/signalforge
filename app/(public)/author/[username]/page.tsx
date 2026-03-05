import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FolderGit2, Mail, ExternalLink } from 'lucide-react';
import { INITIAL_ARTICLES, INITIAL_PROJECTS, INITIAL_EXPERIENCES } from '@/lib/signalforge-data';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `Abhishek Garg (@${username}) — Staff Systems Architect | SignalForge`,
    description: 'Technical portfolio, architectural systems, and publications in distributed systems and AI inference.',
  };
}

export default async function PublicAuthorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 font-mono">
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="p-8 rounded-2xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#22c55e] text-black font-extrabold flex items-center justify-center text-2xl shadow-lg shadow-[#22c55e]/25">
              AG
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-100">Abhishek Garg</h1>
              <p className="text-xs sm:text-sm text-emerald-400 font-medium">
                @{username} • Staff AI Infrastructure & Systems Architect
              </p>
              <div className="text-[11px] text-zinc-500 mt-1">
                8+ Years Building High-Throughput & Low-Latency Engines
              </div>
            </div>
          </div>

          <a
            href="mailto:abhishekgarg959@gmail.com"
            className="px-4 py-2 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition inline-flex items-center gap-1.5"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Connect</span>
          </a>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed pt-2 border-t border-white/5 font-sans">
          Specializing in distributed streaming backbones, speculative draft validation, eBPF in-kernel telemetry, and tiered WAL Postgres replication.
        </p>
      </div>

      {/* Publications */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#22c55e]" />
          Published Deep Dives
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_ARTICLES.map((art) => (
            <Link
              key={art.id}
              href={`/articles/${art.slug}`}
              className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/45 transition space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] text-[#f59e0b]">{art.category} • {art.readTime}</span>
                <h3 className="font-bold text-xs text-slate-100 leading-snug">{art.title}</h3>
                <p className="text-[11px] text-zinc-400 font-sans line-clamp-2 mt-1">{art.subtitle}</p>
              </div>
              <div className="pt-2 border-t border-white/5 text-[11px] text-[#22c55e]">
                Read Essay →
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Projects */}
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#22c55e]" />
          Systems Architecture Repositories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {INITIAL_PROJECTS.map((proj) => (
            <div
              key={proj.id}
              className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3"
            >
              <h3 className="font-bold text-xs text-slate-100">{proj.name}</h3>
              <p className="text-[11px] text-zinc-400 font-sans leading-relaxed">{proj.description}</p>
              <div className="p-2.5 rounded bg-black/40 border border-white/5 text-[10px] text-emerald-300">
                {proj.architecture}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
