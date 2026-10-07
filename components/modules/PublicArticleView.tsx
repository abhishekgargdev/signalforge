'use client';

import React from 'react';
import {
  ArrowLeft,
  Calendar,
  Clock,
  Share2,
  Bookmark,
  CheckCircle2,
  Terminal,
  Globe,
  Sparkles
} from 'lucide-react';
import { ArticleItem } from '@/lib/signalforge-data';

interface PublicArticleViewProps {
  article: ArticleItem;
  onBackToApp: () => void;
}

export function PublicArticleView({ article, onBackToApp }: PublicArticleViewProps) {
  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 font-mono">
      {/* Top Reading Navigation */}
      <header className="border-b border-[#22c55e]/20 bg-[#080c08]/90 backdrop-blur-md sticky top-0 z-40 px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to SignalForge Console</span>
          </button>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-zinc-500 font-mono hidden sm:inline">
              PUBLIC EDITORIAL VIEW
            </span>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('Article share link copied to clipboard!');
              }}
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded bg-[#0e1710] border border-[#22c55e]/30 text-emerald-300 hover:bg-[#22c55e]/15 transition"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Article</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading Container */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Article Header */}
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

          {/* Author Card */}
          <div className="flex items-center gap-3 pt-3 border-t border-zinc-800">
            <div className="w-10 h-10 rounded-full bg-emerald-900 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-sm">
              —
            </div>
            <div>
              <div className="font-bold text-xs text-slate-200">Author</div>
              <div className="text-[11px] text-zinc-400 font-sans">Set your public profile in Settings</div>
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

        {/* Article Body */}
        <article className="prose prose-invert max-w-none text-xs sm:text-sm text-zinc-300 leading-relaxed space-y-6">
          <div className="p-4 rounded-xl bg-black/60 border border-[#22c55e]/30 font-mono text-xs text-emerald-200 whitespace-pre-wrap leading-relaxed">
            {article.contentMarkdown}
          </div>
        </article>

        {/* Footer Author Box */}
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#22c55e] text-black font-extrabold flex items-center justify-center text-base">
              —
            </div>
            <div>
              <h4 className="font-bold text-sm text-slate-100">About the author</h4>
              <p className="text-xs text-zinc-400 font-sans">
                Bio and headline are configured in your workspace settings.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
