'use client';

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Eye,
  Edit3,
  Share2,
  ExternalLink,
  Search,
  CheckCircle2,
  Globe,
  Sliders,
  Calendar,
  Sparkles,
  Trash2,
  RefreshCw,
  X,
  Check
} from 'lucide-react';
import { ArticleItem } from '@/lib/signalforge-data';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';
import { ApiSpinner } from '@/components/ui/SkeletonLoader';

interface ArticlesViewProps {
  articles: ArticleItem[];
  onOpenPublicArticle: (article: ArticleItem) => void;
}

export function ArticlesView({ articles: initialArticles, onOpenPublicArticle }: ArticlesViewProps) {
  const [articles, setArticles] = useState<ArticleItem[]>(initialArticles);
  const [activeTab, setActiveTab] = useState<'list' | 'editor'>('list');
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem>(initialArticles[0] || {} as ArticleItem);

  // Editor states
  const [editedTitle, setEditedTitle] = useState(initialArticles[0]?.title || '');
  const [editedSubtitle, setEditedSubtitle] = useState(initialArticles[0]?.subtitle || '');
  const [editedMarkdown, setEditedMarkdown] = useState(initialArticles[0]?.contentMarkdown || '');
  const [seoTitle, setSeoTitle] = useState(initialArticles[0]?.seo?.metaTitle || '');
  const [seoDesc, setSeoDesc] = useState(initialArticles[0]?.seo?.metaDescription || '');
  const [seoSlug, setSeoSlug] = useState(initialArticles[0]?.slug || '');

  // Delete state
  const [articleToDelete, setArticleToDelete] = useState<ArticleItem | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  // Add Article Modal
  const [addArticleModalOpen, setAddArticleModalOpen] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState('Systems Architecture');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);
  const [searchQuery, setSearchQuery] = useState('');

  const handleEditArticle = (art: ArticleItem) => {
    setSelectedArticle(art);
    setEditedTitle(art.title);
    setEditedSubtitle(art.subtitle);
    setEditedMarkdown(art.contentMarkdown);
    setSeoTitle(art.seo.metaTitle);
    setSeoDesc(art.seo.metaDescription);
    setSeoSlug(art.slug);
    setActiveTab('editor');
  };

  const handleSaveArticle = async () => {
    setIsSaving(true);
    setSaveSuccess(null);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const updated: ArticleItem = {
        ...selectedArticle,
        title: editedTitle,
        subtitle: editedSubtitle,
        contentMarkdown: editedMarkdown,
        slug: seoSlug,
        seo: {
          ...selectedArticle.seo,
          metaTitle: seoTitle,
          metaDescription: seoDesc,
        },
      };
      setArticles((prev) =>
        prev.map((a) => (a.id === selectedArticle.id ? updated : a))
      );
      setSelectedArticle(updated);
      setSaveSuccess('Article and SEO metadata published successfully!');
      setTimeout(() => setSaveSuccess(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  const handleConfirmDeleteArticle = async () => {
    if (!articleToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const remaining = articles.filter((a) => a.id !== articleToDelete.id);
      setArticles(remaining);
      if (selectedArticle.id === articleToDelete.id && remaining.length > 0) {
        setSelectedArticle(remaining[0]);
      }
      setArticleToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreateNewArticle = () => {
    if (!newTitle) return;
    const slug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const created: ArticleItem = {
      id: `art-${Date.now()}`,
      slug,
      title: newTitle,
      subtitle: newSubtitle || 'Deep-dive technical investigation.',
      category: newCategory,
      status: 'draft',
      publishedDate: new Date().toISOString().split('T')[0],
      readTime: '6 min read',
      views: 0,
      coverImage: '',
      contentMarkdown: `# ${newTitle}\n\n## Abstract\n${newSubtitle}\n\n## System Architecture\nDetail the core system invariants and scaling trade-offs here.`,
      toc: [
        { id: 'abstract', title: 'Abstract' },
        { id: 'architecture', title: 'System Architecture' },
      ],
      seo: {
        metaTitle: newTitle,
        metaDescription: newSubtitle || newTitle,
        canonicalUrl: `https://signalforge.dev/articles/${slug}`,
        keywords: ['Distributed Systems', 'Architecture'],
        ogImage: '',
      },
    };
    setArticles([created, ...articles]);
    setAddArticleModalOpen(false);
    setNewTitle('');
    setNewSubtitle('');
    handleEditArticle(created);
  };

  // Filtered articles
  const filteredArticles = articles.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    a.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1;
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Technical Articles & Editorial Publisher
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Long-form architectural essays with Table of Contents, code blocks, and search-optimized public author pages.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
            <button
              onClick={() => setActiveTab('list')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'list' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Article Library ({articles.length})
            </button>
            <button
              onClick={() => setActiveTab('editor')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'editor' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Markdown Editor
            </button>
          </div>

          <button
            onClick={() => setAddArticleModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm shadow-[#22c55e]/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>New Article</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: Articles List with Pagination and Delete confirmation */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="relative max-w-sm w-full">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles by title or topic..."
                className="w-full pl-9 pr-3 py-1.5 bg-[#0e1710] border border-[#22c55e]/30 rounded-lg text-emerald-200 placeholder-zinc-500 text-xs font-mono focus:outline-none"
              />
            </div>
            <span className="text-zinc-500 text-xs font-mono">
              {filteredArticles.length} published essays
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedArticles.map((art) => (
              <div
                key={art.id}
                className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/45 transition space-y-4 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider">
                      {art.category} • {art.publishedDate}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-emerald-400">
                        {art.views.toLocaleString()} reads
                      </span>
                      <button
                        onClick={() => setArticleToDelete(art)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                        title="Delete Article"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-slate-100 leading-snug mb-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                    {art.subtitle}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <span className="text-[10px] text-zinc-500">
                    {art.readTime} • SEO Indexed
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEditArticle(art)}
                      className="px-2.5 py-1 rounded bg-black/40 border border-white/10 text-zinc-300 hover:text-emerald-300 transition"
                    >
                      Edit Markdown
                    </button>
                    <button
                      onClick={() => onOpenPublicArticle(art)}
                      className="flex items-center gap-1 px-3 py-1 rounded bg-[#22c55e] text-black font-bold hover:bg-emerald-400 transition"
                    >
                      <Globe className="w-3 h-3" />
                      <span>View Public</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredArticles.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            itemLabel="articles"
          />
        </div>
      )}

      {/* VIEW 2: Split-Screen Article Editor + SEO Inspector */}
      {activeTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Markdown & Preview Editor */}
          <div className="lg:col-span-2 space-y-4">
            <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-3 font-mono">
              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Article Title:</label>
                <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-100 font-bold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] text-zinc-400 block mb-1">Article Subtitle / Excerpt:</label>
                <input
                  type="text"
                  value={editedSubtitle}
                  onChange={(e) => setEditedSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-300 text-xs focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] text-zinc-400">Content Body (Markdown Supported):</label>
                  <span className="text-[10px] text-zinc-500">
                    {editedMarkdown.split(/\s+/).length} words • {Math.ceil(editedMarkdown.split(/\s+/).length / 200)} min read
                  </span>
                </div>
                <textarea
                  rows={14}
                  value={editedMarkdown}
                  onChange={(e) => setEditedMarkdown(e.target.value)}
                  className="w-full p-3 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 text-xs focus:outline-none leading-relaxed"
                />
              </div>

              {saveSuccess && (
                <div className="p-2.5 rounded bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#22c55e]" />
                  <span>{saveSuccess}</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <span className="text-[10px] text-zinc-500">Markdown syntax & code block highlighting active</span>
                <button
                  onClick={handleSaveArticle}
                  disabled={isSaving}
                  className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
                >
                  {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save & Publish Changes</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: SEO Metadata Panel */}
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-3 font-mono text-xs">
              <span className="font-bold text-slate-100 uppercase tracking-wider block text-[11px]">
                Search Engine Optimization
              </span>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Meta Title:</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full p-2 rounded bg-black/50 border border-zinc-700 text-emerald-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">URL Slug:</label>
                <input
                  type="text"
                  value={seoSlug}
                  onChange={(e) => setSeoSlug(e.target.value)}
                  className="w-full p-2 rounded bg-black/50 border border-zinc-700 text-sky-300 text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Meta Description:</label>
                <textarea
                  rows={3}
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full p-2 rounded bg-black/50 border border-zinc-700 text-slate-300 text-xs resize-none"
                />
              </div>

              <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                <button
                  onClick={() => onOpenPublicArticle(selectedArticle)}
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Globe className="w-3 h-3" />
                  <span>Preview Live Reader</span>
                </button>
                <button
                  onClick={() => setArticleToDelete(selectedArticle)}
                  className="text-red-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Create New Article */}
      {addArticleModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Create New Technical Article
              </h3>
              <button onClick={() => setAddArticleModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Article Headline *:</label>
                <input
                  type="text"
                  placeholder="e.g. Zero-Copy eBPF Ring Buffers in High-Throughput Storage"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Category:</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Subtitle / Excerpt:</label>
                <textarea
                  rows={3}
                  placeholder="Concise technical hook..."
                  value={newSubtitle}
                  onChange={(e) => setNewSubtitle(e.target.value)}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setAddArticleModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewArticle}
                disabled={!newTitle.trim()}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create & Open Editor</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ARTICLE MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(articleToDelete)}
        onClose={() => setArticleToDelete(null)}
        onConfirm={handleConfirmDeleteArticle}
        title="Delete Technical Article"
        itemName={articleToDelete?.title}
        description="Are you sure you want to permanently delete this technical essay? The public URL, Markdown content, and search index will be unlinked permanently."
        isDeleting={isDeleting}
      />
    </div>
  );
}
