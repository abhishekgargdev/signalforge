import React from 'react';
import Link from 'next/link';
import { Zap, Terminal, ArrowRight, BookOpen, FolderGit2, ShieldCheck } from 'lucide-react';
import { ArticleService } from '@/services/article-service';

export default async function PublicHomePage() {
  const articles = await ArticleService.getAll();
  const published = articles.filter((a) => a.status === 'published').slice(0, 4);

  return (
    <div className="space-y-16 py-8 px-4 sm:px-8 max-w-7xl mx-auto">
      <section className="relative overflow-hidden rounded-2xl p-8 sm:p-14 border border-[#22c55e]/30 bg-gradient-to-b from-[#0e1710] to-[#080c08] shadow-2xl">
        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-[#22c55e]/40 text-[#22c55e] text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span>SignalForge</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-100 leading-tight">
            Discover. Understand. Create. Engage. Grow.
          </h1>
          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed font-sans max-w-2xl">
            AI-powered technology intelligence and career-signal workspace for engineers and systems leaders.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition shadow-lg shadow-[#22c55e]/25"
            >
              <span>Sign in to workspace</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </Link>
            <Link
              href="/articles"
              className="flex items-center gap-2 px-5 py-3 rounded-lg bg-black/50 border border-[#22c55e]/40 text-emerald-300 text-xs font-bold hover:bg-[#22c55e]/10 transition"
            >
              <BookOpen className="w-4 h-4" />
              <span>Public articles</span>
            </Link>
          </div>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: Zap, title: 'Breakthrough discovery', desc: 'Track topics and signals that matter to your target role.' },
          { icon: ShieldCheck, title: 'Thoughtful engagement', desc: 'Draft comments and outreach from your own research—not demo threads.' },
          { icon: Terminal, title: 'Grounded content', desc: 'Turn experience vault entries into articles and social posts.' },
        ].map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div key={i} className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3">
              <Icon className="w-6 h-6 text-[#22c55e]" />
              <h3 className="font-bold text-sm text-slate-100">{feat.title}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-sans">{feat.desc}</p>
            </div>
          );
        })}
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#22c55e]" />
            Publications
          </h2>
          <Link href="/articles" className="text-xs text-[#22c55e] hover:underline font-mono">View all →</Link>
        </div>
        {published.length === 0 ? (
          <p className="text-xs text-zinc-500 font-mono p-6 rounded-xl bg-[#0e1710] border border-white/5">
            No published articles yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {published.map((art) => (
              <Link
                key={art.id}
                href={`/articles/${art.slug}`}
                className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/50 transition group"
              >
                <h3 className="font-bold text-base text-slate-100 group-hover:text-emerald-300 transition">{art.title}</h3>
                {art.subtitle && <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{art.subtitle}</p>}
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
          <FolderGit2 className="w-5 h-5 text-[#22c55e]" />
          Projects
        </h2>
        <p className="text-xs text-zinc-500 font-mono p-6 rounded-xl bg-[#0e1710] border border-white/5">
          Project highlights from your Experience Vault appear on your public author page when you add them.
        </p>
      </section>
    </div>
  );
}
