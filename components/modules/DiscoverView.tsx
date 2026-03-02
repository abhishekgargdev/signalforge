'use client';

import React, { useEffect, useState } from 'react';
import {
  Radar,
  TrendingUp,
  Bookmark,
  Share2,
  Sparkles,
  ExternalLink,
  Filter,
  Check,
  Calendar,
  Building,
  Target,
  X,
  Layers,
  ArrowRight,
  Plus,
  Edit,
  Trash2,
  Eye,
  RefreshCw
} from 'lucide-react';
import { TopicSignal } from '@/lib/signalforge-data';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';
import { SkeletonCard, ApiSpinner } from '@/components/ui/SkeletonLoader';

interface DiscoverViewProps {
  signals: TopicSignal[];
  onSelectTopic: (topic: TopicSignal) => void;
  onDraftContent: (topic: TopicSignal) => void;
}

export function DiscoverView({ signals: initialSignals, onSelectTopic, onDraftContent }: DiscoverViewProps) {
  const [signals, setSignals] = useState<TopicSignal[]>(initialSignals);

  useEffect(() => {
    fetch('/api/v1/topics')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.topics)) {
          setSignals(data.data.topics);
        }
      })
      .catch(() => {});
  }, []);
  const [activeTab, setActiveTab] = useState<'All' | 'Trending' | 'AI & Inference' | 'Distributed Systems' | 'Database Engines' | 'Saved'>('All');
  const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicSignal | null>(null);
  const [savedTopics, setSavedTopics] = useState<string[]>([]);

  // Modals for CRUD
  const [addSignalModalOpen, setAddSignalModalOpen] = useState(false);
  const [editingSignal, setEditingSignal] = useState<TopicSignal | null>(null);
  const [signalToDelete, setSignalToDelete] = useState<TopicSignal | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(4);

  // Add Signal Form State
  const [newSignal, setNewSignal] = useState<Partial<TopicSignal>>({
    title: '',
    category: 'AI & Inference',
    summary: '',
    source: '',
    trendScore: 0,
    freshness: '',
    careerRelevance: '',
    companyRelevance: [],
    tags: [],
    keyFacts: [],
    timeline: [],
    suggestedAngles: [],
  });

  const toggleSave = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSavedTopics((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredSignals = signals.filter((s) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Trending') return s.trendScore >= 90;
    if (activeTab === 'Saved') return savedTopics.includes(s.id);
    return s.category === activeTab;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredSignals.length / pageSize) || 1;
  const paginatedSignals = filteredSignals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Delete Signal
  const handleConfirmDeleteSignal = async () => {
    if (!signalToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSignals((prev) => prev.filter((s) => s.id !== signalToDelete.id));
      setSignalToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save New Signal
  const handleSaveNewSignal = async () => {
    if (!newSignal.title) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/v1/topics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSignal),
      });
      const data = await res.json();
      if (!data.success) return;
      const created = data.data.topic as TopicSignal;
      setSignals([created, ...signals]);
      setAddSignalModalOpen(false);
      setNewSignal({
        title: '',
        category: 'AI & Inference',
        summary: '',
        source: '',
        trendScore: 0,
        freshness: '',
        careerRelevance: '',
        companyRelevance: [],
        tags: [],
        keyFacts: [],
        timeline: [],
        suggestedAngles: [],
      });
      setCurrentPage(1);
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edit Signal
  const handleSaveEditSignal = async () => {
    if (!editingSignal) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setSignals((prev) =>
        prev.map((s) => (s.id === editingSignal.id ? editingSignal : s))
      );
      setEditingSignal(null);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Radar className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">Technology Radar & Intelligence Signals</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time breakthroughs, systems architecture shifts, and curated engineering angles.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setAddSignalModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-sm shadow-[#22c55e]/20"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Signal</span>
          </button>

          <div className="flex items-center gap-2 text-xs font-mono text-zinc-400 px-3 py-1 rounded bg-[#0e1710] border border-white/5">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            <span>48 Outlets Live</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-mono">
        {['All', 'Trending', 'AI & Inference', 'Distributed Systems', 'Database Engines', 'Saved'].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setActiveTab(tab as any);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-lg border transition whitespace-nowrap ${
              activeTab === tab
                ? 'bg-[#22c55e] text-black font-bold border-[#22c55e]'
                : 'bg-[#0e1710] text-zinc-400 hover:text-emerald-300 border-[#22c55e]/20'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paginatedSignals.map((sig) => {
          const isSaved = savedTopics.includes(sig.id);
          return (
            <div
              key={sig.id}
              onClick={() => setSelectedTopicDetail(sig)}
              className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/45 transition cursor-pointer flex flex-col justify-between space-y-4 group relative"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider">
                    {sig.category} • {sig.freshness}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      {sig.trendScore}%
                    </span>
                    <button
                      onClick={(e) => toggleSave(sig.id, e)}
                      className={`p-1 rounded transition ${
                        isSaved ? 'text-[#22c55e]' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                      title={isSaved ? 'Remove from saved' : 'Save topic'}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isSaved ? '#22c55e' : 'none'} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingSignal(sig);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition"
                      title="Edit Signal"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSignalToDelete(sig);
                      }}
                      className="p-1 rounded text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                      title="Delete Signal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-bold text-sm text-slate-100 group-hover:text-emerald-300 transition leading-snug mb-2">
                  {sig.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                  {sig.summary}
                </p>
              </div>

              <div className="space-y-3 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="truncate mr-2">Source: {sig.source}</span>
                  <span className="text-emerald-400 flex items-center gap-1 flex-shrink-0">
                    Dossier <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition" />
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {sig.tags.map((t) => (
                    <span
                      key={t}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-zinc-400 border border-zinc-800"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Component */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={filteredSignals.length}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        itemLabel="signals"
      />

      {/* Topic Detail Modal */}
      {selectedTopicDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-3xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col justify-between">
            {/* Modal Header */}
            <div className="p-6 border-b border-[#22c55e]/20 bg-[#0e1710] flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2 font-mono">
                  <span className="text-xs font-bold text-[#f59e0b]">{selectedTopicDetail.category}</span>
                  <span className="text-xs text-zinc-500">•</span>
                  <span className="text-xs text-zinc-400">{selectedTopicDetail.freshness}</span>
                  <span className="text-xs px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 ml-2">
                    {selectedTopicDetail.trendScore}% Velocity
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">{selectedTopicDetail.title}</h2>
              </div>
              <button
                onClick={() => setSelectedTopicDetail(null)}
                className="p-1 rounded text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 text-xs font-mono text-zinc-300">
              <div className="p-4 rounded-lg bg-black/60 border border-[#22c55e]/20 space-y-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Target Role Alignment</span>
                <p className="text-emerald-300 font-semibold text-sm">{selectedTopicDetail.careerRelevance}</p>
                <div className="flex items-center gap-2 text-zinc-400 text-[11px] pt-1">
                  <span>Relevance:</span>
                  {selectedTopicDetail.companyRelevance.map((comp) => (
                    <span key={comp} className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-slate-300">
                      {comp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Summary</span>
                <p className="leading-relaxed text-slate-200">{selectedTopicDetail.summary}</p>
              </div>

              {/* Key Facts */}
              <div className="space-y-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Quantitative Architectural Facts</span>
                <ul className="space-y-2">
                  {selectedTopicDetail.keyFacts.map((fact, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-zinc-300">
                      <span className="text-[#22c55e] font-bold">›</span>
                      <span>{fact}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Evolutionary Timeline</span>
                <div className="space-y-2 pl-2 border-l border-[#22c55e]/30">
                  {selectedTopicDetail.timeline.map((step, idx) => (
                    <div key={idx} className="relative pl-4">
                      <span className="absolute -left-[13px] top-1 w-2 h-2 rounded-full bg-[#22c55e]" />
                      <div className="font-bold text-slate-200">{step.year}</div>
                      <div className="text-zinc-400 text-[11px]">{step.milestone}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Suggested Content Angles */}
              <div className="space-y-2">
                <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Recommended Thought-Leadership Angles</span>
                <div className="space-y-2">
                  {selectedTopicDetail.suggestedAngles.map((angle, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-black/40 border border-white/5 text-emerald-300 flex items-center justify-between">
                      <span className="truncate pr-2">{angle}</span>
                      <Sparkles className="w-3.5 h-3.5 text-[#22c55e] flex-shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between">
              <span className="text-zinc-500 text-xs font-mono">
                Source: <strong className="text-slate-300">{selectedTopicDetail.source}</strong>
              </span>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedTopicDetail(null)}
                  className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono font-semibold"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    onDraftContent(selectedTopicDetail);
                    setSelectedTopicDetail(null);
                  }}
                  className="px-4 py-2 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs font-mono hover:bg-emerald-400 transition flex items-center gap-1.5 shadow-md shadow-[#22c55e]/25"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Draft in Content Wizard →</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Signal */}
      {addSignalModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Add Technology Radar Signal
              </h3>
              <button onClick={() => setAddSignalModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Signal Title *:</label>
                <input
                  type="text"
                  placeholder="e.g. Asynchronous Tree-Based Speculative Verification"
                  value={newSignal.title}
                  onChange={(e) => setNewSignal({ ...newSignal, title: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Category:</label>
                  <select
                    value={newSignal.category}
                    onChange={(e) => setNewSignal({ ...newSignal, category: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="AI & Inference">AI & Inference</option>
                    <option value="Distributed Systems">Distributed Systems</option>
                    <option value="Cloud & Infra">Cloud & Infra</option>
                    <option value="Database Engines">Database Engines</option>
                    <option value="Developer Tooling">Developer Tooling</option>
                  </select>
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Trend Score (%):</label>
                  <input
                    type="number"
                    value={newSignal.trendScore}
                    onChange={(e) => setNewSignal({ ...newSignal, trendScore: Number(e.target.value) })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technical Summary:</label>
                <textarea
                  rows={3}
                  value={newSignal.summary}
                  onChange={(e) => setNewSignal({ ...newSignal, summary: e.target.value })}
                  placeholder="Describe the architectural breakthrough..."
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Target Role Fit:</label>
                <input
                  type="text"
                  value={newSignal.careerRelevance}
                  onChange={(e) => setNewSignal({ ...newSignal, careerRelevance: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setAddSignalModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewSignal}
                disabled={isSaving || !newSignal.title}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Save Signal</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Signal */}
      {editingSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#22c55e]" />
                Edit Signal: {editingSignal.title}
              </h3>
              <button onClick={() => setEditingSignal(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Signal Title:</label>
                <input
                  type="text"
                  value={editingSignal.title}
                  onChange={(e) => setEditingSignal({ ...editingSignal, title: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Technical Summary:</label>
                <textarea
                  rows={4}
                  value={editingSignal.summary}
                  onChange={(e) => setEditingSignal({ ...editingSignal, summary: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setEditingSignal(null)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditSignal}
                disabled={isSaving}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SIGNAL MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(signalToDelete)}
        onClose={() => setSignalToDelete(null)}
        onConfirm={handleConfirmDeleteSignal}
        title="Delete Technology Signal"
        itemName={signalToDelete?.title}
        description="Are you sure you want to permanently delete this intelligence signal from your radar? Any linked drafts or scheduled content referencing this signal will remain in draft state."
        isDeleting={isDeleting}
      />
    </div>
  );
}
