import React from 'react';
import Link from 'next/link';
import { ArrowLeft, BookOpen, FolderGit2 } from 'lucide-react';
import { ArticleService } from '@/services/article-service';

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  return {
    title: `@${username} | SignalForge`,
    description: 'Public author portfolio on SignalForge.',
  };
}

export default async function PublicAuthorPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const articles = await ArticleService.getAll();
  const published = articles.filter((a) => a.status === 'published');

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10 font-mono">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition">
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="p-8 rounded-2xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
        <h1 className="text-2xl font-extrabold text-slate-100">@{username}</h1>
        <p className="text-xs text-zinc-400 font-sans">
          Profile details come from your workspace settings. Add a bio and publish articles to fill this page.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#22c55e]" />
          Publications
        </h2>
        {published.length === 0 ? (
          <p className="text-xs text-zinc-500 p-6 rounded-xl bg-[#0e1710] border border-white/5">No published articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {published.map((art) => (
              <Link
                key={art.id}
                href={`/articles/${art.slug}`}
                className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition"
              >
                <h3 className="font-bold text-xs text-slate-100">{art.title}</h3>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
          <FolderGit2 className="w-4 h-4 text-[#22c55e]" />
          Projects
        </h2>
        <p className="text-xs text-zinc-500 p-6 rounded-xl bg-[#0e1710] border border-white/5">
          Projects from your Experience Vault will appear here when configured.
        </p>
      </section>
    </div>
  );
}
