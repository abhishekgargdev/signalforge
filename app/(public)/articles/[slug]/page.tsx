import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Share2, Globe, BookOpen } from 'lucide-react';
import { ArticleService } from '@/services/article-service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await ArticleService.getBySlug(slug);
  if (!article) return { title: 'Article Not Found | SignalForge' };

  return {
    title: `${article.title} | SignalForge`,
    description: article.subtitle,
    openGraph: {
      title: article.title,
      description: article.subtitle,
      images: [article.coverImage],
    },
  };
}

export default async function PublicArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await ArticleService.getBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8 font-mono">
      {/* Top back link */}
      <div>
        <Link
          href="/articles"
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Articles</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-xs font-mono text-[#f59e0b]">
          <span>{article.category}</span>
          <span>•</span>
          <span>{article.publishedDate}</span>
          <span>•</span>
          <span>{article.readTime}</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-400 leading-relaxed font-sans">
          {article.subtitle}
        </p>

        {/* Author snippet */}
        <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
          <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
            AG
          </div>
          <div>
            <div className="font-bold text-xs text-slate-200">Abhishek Garg</div>
            <div className="text-[11px] text-zinc-400 font-sans">
              Staff AI & Systems Architect • Targeting High Concurrency
            </div>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div className="rounded-xl overflow-hidden border border-[#22c55e]/25 bg-black/50 aspect-[16/9] max-h-96 w-full">
        <img
          src={article.coverImage}
          alt={article.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Table of Contents */}
      {article.toc && article.toc.length > 0 && (
        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Table of Contents
          </span>
          <div className="space-y-1 text-xs">
            {article.toc.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-emerald-400 hover:underline py-0.5"
              >
                {item.title}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-6">
        <div className="p-5 rounded-xl bg-black/60 border border-[#22c55e]/30 font-mono text-xs text-emerald-200 whitespace-pre-wrap leading-relaxed">
          {article.contentMarkdown}
        </div>
      </article>

      {/* Author Card Footer */}
      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#22c55e] text-black font-extrabold flex items-center justify-center text-base">
            AG
          </div>
          <div>
            <h4 className="font-bold text-sm text-slate-100">Authored by Abhishek Garg</h4>
            <p className="text-xs text-zinc-400 font-sans">
              Senior Infrastructure & AI Systems Architect writing deep-dives on speculative decoding, eBPF, and tiered storage engines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
