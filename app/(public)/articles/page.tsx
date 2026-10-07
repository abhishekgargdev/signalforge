import React from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';
import { ArticleService } from '@/services/article-service';

export const metadata = {
  title: 'Technical Publications | SignalForge',
  description: 'Systems engineering essays and architectural breakdowns.',
};

export default async function PublicArticlesListPage() {
  const articles = await ArticleService.getAll();
  const published = articles.filter((a) => a.status === 'published');

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 sm:px-6 space-y-8 font-mono">
      <div className="space-y-3">
        <span className="text-[10px] text-[#f59e0b] uppercase tracking-wider block">PUBLICATIONS</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100">Systems Engineering Publications</h1>
        <p className="text-xs sm:text-sm text-zinc-400 font-sans max-w-2xl leading-relaxed">
          Essays and deep dives you publish from the dashboard appear here.
        </p>
      </div>

      {published.length === 0 ? (
        <div className="p-12 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 text-center">
          <BookOpen className="w-8 h-8 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm text-zinc-400">No published articles yet</p>
          <p className="text-xs text-zinc-500 mt-2">Create and publish from Technical Articles in your workspace.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {published.map((art) => (
            <div
              key={art.id}
              className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 hover:border-[#22c55e]/50 transition flex flex-col md:flex-row gap-6 items-start justify-between"
            >
              <div className="space-y-3 flex-1">
                <div className="flex items-center gap-3 text-xs text-[#f59e0b]">
                  <span>{art.category}</span>
                  <span>•</span>
                  <span>{art.publishedDate}</span>
                  <span>•</span>
                  <span>{art.readTime}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-100 hover:text-emerald-300 transition">
                  <Link href={`/articles/${art.slug}`}>{art.title}</Link>
                </h2>
                {art.subtitle && <p className="text-xs text-zinc-400 font-sans leading-relaxed">{art.subtitle}</p>}
              </div>
              {art.coverImage ? (
                <div className="w-full md:w-56 h-36 rounded-lg overflow-hidden border border-zinc-800 flex-shrink-0 bg-black/50">
                  <img src={art.coverImage} alt={art.title} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
