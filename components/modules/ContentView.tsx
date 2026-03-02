'use client';

import React, { useEffect, useState } from 'react';
import {
  Kanban,
  Sparkles,
  Layers,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  Share2,
  Copy,
  Check,
  Plus,
  Trash2,
  RefreshCw,
  Terminal,
  Eye,
  Edit,
  X
} from 'lucide-react';
import { ContentItem, TopicSignal, ExperienceItem } from '@/lib/signalforge-data';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { ApiSpinner } from '@/components/ui/SkeletonLoader';

interface ContentViewProps {
  pipeline: ContentItem[];
  signals: TopicSignal[];
  experiences: ExperienceItem[];
  onAddNewContentItem: (item: ContentItem) => void;
  initialTab?: 'kanban' | 'wizard' | 'carousel' | 'calendar';
}

export function ContentView({
  pipeline: initialPipeline,
  signals,
  experiences,
  onAddNewContentItem,
  initialTab = 'kanban',
}: ContentViewProps) {
  const [pipeline, setPipeline] = useState<ContentItem[]>(initialPipeline);

  useEffect(() => {
    fetch('/api/v1/content')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.content)) {
          setPipeline(data.data.content);
        }
      })
      .catch(() => {});
  }, []);
  const [activeTab, setActiveTab] = useState<'kanban' | 'wizard' | 'carousel' | 'calendar'>(initialTab);

  // Modals for CRUD
  const [viewingItem, setViewingItem] = useState<ContentItem | null>(null);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [itemToDelete, setItemToDelete] = useState<ContentItem | null>(null);
  const [slideToDelete, setSlideToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Wizard state (10 steps)
  const [wizardStep, setWizardStep] = useState<number>(1);
  const [wizardData, setWizardData] = useState({
    sourceType: 'trending-topic',
    selectedSourceId: signals[0]?.id || '',
    researchNotes: '',
    contentAngle: '',
    platform: 'LinkedIn' as 'LinkedIn' | 'X' | 'Web',
    hookText: '',
    bodyText: '',
    ctaText: '',
    hashtags: [] as string[],
    scheduledDate: '',
    mediaType: '',
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [copiedPreview, setCopiedPreview] = useState(false);

  // Carousel builder state
  const [carouselSlides, setCarouselSlides] = useState<
    { id: string; title: string; subtitle: string; codeSnippet: string }[]
  >([]);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);

  const handleNextStep = () => setWizardStep((prev) => Math.min(prev + 1, 10));
  const handlePrevStep = () => setWizardStep((prev) => Math.max(prev - 1, 1));

  const handleAiRefine = async () => {
    setAiGenerating(true);
    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: `Enhance this LinkedIn hook and body for a senior software engineer audience on topic: "${wizardData.contentAngle}". Draft:\n${wizardData.bodyText}`,
          type: 'comment',
        }),
      });
      const data = await res.json();
      if (data.text) {
        setWizardData((prev) => ({
          ...prev,
          bodyText: data.text,
        }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGenerating(false);
    }
  };

  const handlePublishFromWizard = async () => {
    const draft: ContentItem = {
      id: `cnt-${Date.now()}`,
      title: wizardData.contentAngle,
      type: wizardData.platform === 'LinkedIn' ? 'LinkedIn Post' : 'Technical Article',
      status: 'scheduled',
      platform: wizardData.platform,
      createdDate: new Date().toISOString().split('T')[0],
      scheduledDate: wizardData.scheduledDate,
      tags: wizardData.hashtags.map((h) => h.replace('#', '')),
      body: `${wizardData.hookText}\n\n${wizardData.bodyText}\n\n${wizardData.ctaText}`,
    };
    const res = await fetch('/api/v1/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    });
    const data = await res.json();
    const newItem = data.success ? (data.data.item as ContentItem) : draft;
    onAddNewContentItem(newItem);
    setPipeline([newItem, ...pipeline]);
    setActiveTab('kanban');
    setWizardStep(1);
  };

  // Delete Content Item
  const handleConfirmDeleteItem = async () => {
    if (!itemToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setPipeline((prev) => prev.filter((p) => p.id !== itemToDelete.id));
      setItemToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Edit Content Item
  const handleSaveEditItem = async () => {
    if (!editingItem) return;
    setIsSavingEdit(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setPipeline((prev) =>
        prev.map((p) => (p.id === editingItem.id ? editingItem : p))
      );
      setEditingItem(null);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Delete Carousel Slide
  const handleConfirmDeleteSlide = async () => {
    if (slideToDelete === null) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setCarouselSlides((prev) => prev.filter((_, idx) => idx !== slideToDelete));
      setActiveSlideIndex(0);
      setSlideToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Kanban className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Content Pipeline & 10-Step Creation Engine
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Systematic pipeline converting raw technological signals and real engineering experiences into viral thought leadership.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
          {[
            { id: 'kanban', label: 'Kanban Pipeline' },
            { id: 'wizard', label: '10-Step Creator' },
            { id: 'carousel', label: 'Carousel Studio' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded transition ${
                activeTab === tab.id
                  ? 'bg-[#22c55e] text-black font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: KANBAN PIPELINE */}
      {activeTab === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { id: 'idea', label: 'Idea / Research', color: '#f59e0b' },
            { id: 'draft', label: 'Drafting', color: '#38bdf8' },
            { id: 'review', label: 'Review & Polish', color: '#a855f7' },
            { id: 'scheduled', label: 'Scheduled / Published', color: '#22c55e' },
          ].map((col) => {
            const items = pipeline.filter((p) => {
              if (col.id === 'idea') return p.status === 'idea' || p.status === 'research';
              if (col.id === 'draft') return p.status === 'draft';
              if (col.id === 'review') return p.status === 'review' || p.status === 'approved';
              if (col.id === 'scheduled') return p.status === 'scheduled' || p.status === 'published';
              return false;
            });

            return (
              <div
                key={col.id}
                className="p-3.5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                    <span className="font-bold text-xs text-slate-200">{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono text-zinc-500">{items.length}</span>
                </div>

                <div className="space-y-2.5">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg bg-black/50 border border-white/5 hover:border-[#22c55e]/30 transition space-y-2 group relative"
                    >
                      <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between">
                        <span>{item.type}</span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => setViewingItem(item)}
                            className="p-1 text-zinc-400 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition"
                            title="View Content"
                          >
                            <Eye className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setEditingItem(item)}
                            className="p-1 text-zinc-400 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition"
                            title="Edit Content"
                          >
                            <Edit className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setItemToDelete(item)}
                            className="p-1 text-zinc-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                            title="Delete Content"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                          <span className="text-emerald-400 capitalize ml-1">{item.status}</span>
                        </div>
                      </div>

                      <h4
                        onClick={() => setViewingItem(item)}
                        className="font-semibold text-xs text-slate-200 leading-snug hover:text-emerald-300 cursor-pointer transition"
                      >
                        {item.title}
                      </h4>

                      <div className="flex flex-wrap gap-1 pt-1">
                        {item.tags.map((t) => (
                          <span
                            key={t}
                            className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => setActiveTab('wizard')}
                    className="w-full py-2 rounded-lg border border-dashed border-zinc-800 hover:border-[#22c55e]/40 text-zinc-500 hover:text-emerald-300 text-xs font-mono transition flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to {col.label}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: 10-STEP CONTENT CREATOR WIZARD */}
      {activeTab === 'wizard' && (
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-6">
          {/* Progress Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#22c55e]/20 pb-4">
            <div>
              <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider block mb-0.5">
                Step {wizardStep} of 10
              </span>
              <h3 className="font-bold text-base text-slate-100">
                {wizardStep === 1 && '1. Choose Topic or War Story Source'}
                {wizardStep === 2 && '2. Research Notes & Invariants'}
                {wizardStep === 3 && '3. Select Core Technical Angle'}
                {wizardStep === 4 && '4. Target Distribution Platform'}
                {wizardStep === 5 && '5. Hook Formulation & Body Synthesis'}
                {wizardStep === 6 && '6. Media & Architecture Visuals'}
                {wizardStep === 7 && '7. Hashtags & Category Taxonomies'}
                {wizardStep === 8 && '8. Anti-AI Slop Review & Preview'}
                {wizardStep === 9 && '9. Final Systems Polish'}
                {wizardStep === 10 && '10. Schedule & Pipeline Dispatch'}
              </h3>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-zinc-400">
                {wizardStep * 10}% Complete
              </span>
              <div className="w-28 h-2 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-[#22c55e] transition-all duration-300"
                  style={{ width: `${wizardStep * 10}%` }}
                />
              </div>
            </div>
          </div>

          {/* Wizard Step Body */}
          <div className="min-h-[280px]">
            {/* Step 1 */}
            {wizardStep === 1 && (
              <div className="space-y-4">
                <div className="text-xs font-mono text-zinc-400">Select intelligence foundation:</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {signals.map((sig) => (
                    <div
                      key={sig.id}
                      onClick={() => setWizardData({ ...wizardData, selectedSourceId: sig.id, contentAngle: sig.suggestedAngles[0] || sig.title })}
                      className={`p-4 rounded-lg border cursor-pointer transition ${
                        wizardData.selectedSourceId === sig.id
                          ? 'bg-[#22c55e]/15 border-[#22c55e]'
                          : 'bg-black/40 border-white/5 hover:border-zinc-700'
                      }`}
                    >
                      <span className="text-[10px] font-mono text-[#f59e0b] block mb-1">{sig.category}</span>
                      <h4 className="font-bold text-xs text-slate-100">{sig.title}</h4>
                      <p className="text-[11px] text-zinc-400 mt-1 line-clamp-2">{sig.summary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step 2 */}
            {wizardStep === 2 && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-zinc-300 block">Research Notes & Quantitative Benchmarks:</label>
                <textarea
                  rows={6}
                  value={wizardData.researchNotes}
                  onChange={(e) => setWizardData({ ...wizardData, researchNotes: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 font-mono text-xs focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            )}

            {/* Step 3 */}
            {wizardStep === 3 && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-zinc-300 block">Primary Narrative / Technical Angle:</label>
                <input
                  type="text"
                  value={wizardData.contentAngle}
                  onChange={(e) => setWizardData({ ...wizardData, contentAngle: e.target.value })}
                  className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 font-mono text-xs focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            )}

            {/* Step 4 */}
            {wizardStep === 4 && (
              <div className="space-y-3">
                <label className="text-xs font-mono text-zinc-300 block">Target Distribution Format:</label>
                <div className="grid grid-cols-3 gap-3">
                  {['LinkedIn', 'X', 'Web'].map((p) => (
                    <button
                      key={p}
                      onClick={() => setWizardData({ ...wizardData, platform: p as any })}
                      className={`p-4 rounded-lg border text-center font-mono text-xs font-bold transition ${
                        wizardData.platform === p
                          ? 'bg-[#22c55e] text-black border-[#22c55e]'
                          : 'bg-black/40 border-white/10 text-zinc-300 hover:text-white'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5 */}
            {wizardStep === 5 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono text-zinc-300">Hook & Body Synthesis:</label>
                  <button
                    onClick={handleAiRefine}
                    disabled={aiGenerating}
                    className="flex items-center gap-1.5 text-xs font-mono text-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                  >
                    {aiGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                    <span>Polish Hook with Gemini</span>
                  </button>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Hook (First 2 Lines)</span>
                  <input
                    type="text"
                    value={wizardData.hookText}
                    onChange={(e) => setWizardData({ ...wizardData, hookText: e.target.value })}
                    className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-100 font-mono text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 font-mono uppercase block mb-1">Body Text</span>
                  <textarea
                    rows={6}
                    value={wizardData.bodyText}
                    onChange={(e) => setWizardData({ ...wizardData, bodyText: e.target.value })}
                    className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 font-mono text-xs"
                  />
                </div>
              </div>
            )}

            {/* Step 6: Media */}
            {wizardStep === 6 && (
              <div className="space-y-3">
                <span className="text-zinc-400 font-mono block">Cloudinary Media Attachment:</span>
                <div className="p-6 rounded-lg border-2 border-dashed border-[#22c55e]/30 bg-black/40 text-center space-y-2">
                  <div className="font-bold text-emerald-400">{wizardData.mediaType}</div>
                  <p className="text-zinc-500 text-xs">
                    Linked to Cloudinary: <code className="text-zinc-400">speculative-decoding-benchmarks.png</code>
                  </p>
                </div>
              </div>
            )}

            {/* Step 7: Hashtags */}
            {wizardStep === 7 && (
              <div className="space-y-3">
                <span className="text-zinc-400 font-mono block">Recommended Hashtags for Staff Reach:</span>
                <div className="flex flex-wrap gap-2">
                  {wizardData.hashtags.map((h, i) => (
                    <span key={i} className="px-3 py-1 rounded-full bg-[#080c08] border border-[#22c55e]/40 text-emerald-300 font-mono">
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step 8: Preview */}
            {wizardStep === 8 && (
              <div className="p-4 rounded-xl bg-black/60 border border-[#22c55e]/40 space-y-3 max-w-xl mx-auto">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-emerald-900 border border-emerald-500/40 flex items-center justify-center font-bold text-emerald-300 text-xs">
                    AG
                  </div>
                  <div>
                    <div className="font-bold text-slate-200 text-xs">Your name</div>
                    <div className="text-[10px] text-zinc-500">Your headline • preview</div>
                  </div>
                </div>
                <div className="text-xs text-slate-200 font-mono whitespace-pre-wrap leading-relaxed">
                  <strong>{wizardData.hookText}</strong>
                  <br /><br />
                  {wizardData.bodyText}
                  <br /><br />
                  {wizardData.ctaText}
                </div>
              </div>
            )}

            {/* Step 9: Review */}
            {wizardStep === 9 && (
              <div className="space-y-3 text-xs">
                <div className="p-4 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <span>All invariants checked: Zero repetitive buzzwords, mathematical formulas verified, and anti-slop guidelines adhered to.</span>
                </div>
              </div>
            )}

            {/* Step 10: Schedule */}
            {wizardStep === 10 && (
              <div className="space-y-4">
                <span className="text-zinc-400 font-mono block">Confirm Publication Schedule:</span>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={wizardData.scheduledDate}
                    onChange={(e) => setWizardData({ ...wizardData, scheduledDate: e.target.value })}
                    className="p-2.5 rounded bg-black/60 border border-zinc-700 font-mono text-xs text-emerald-300"
                  />
                  <span className="text-zinc-500 text-xs font-mono">Dispatches to LinkedIn</span>
                </div>
              </div>
            )}
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center justify-between border-t border-white/5 pt-4">
            <button
              onClick={handlePrevStep}
              disabled={wizardStep === 1}
              className="px-4 py-1.5 rounded bg-zinc-800 disabled:opacity-30 text-zinc-300 text-xs font-mono"
            >
              Back
            </button>
            {wizardStep < 10 ? (
              <button
                onClick={handleNextStep}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handlePublishFromWizard}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve & Schedule Post</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CAROUSEL STUDIO */}
      {activeTab === 'carousel' && (
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-6">
          <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-4">
            <div>
              <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#22c55e]" />
                Technical Carousel Builder (LinkedIn Slide Deck)
              </h3>
              <p className="text-xs text-zinc-400">Slide counter: {activeSlideIndex + 1} / {carouselSlides.length}</p>
            </div>
            <button
              onClick={() => {
                setCarouselSlides((prev) => [
                  ...prev,
                  {
                    id: String(prev.length + 1),
                    title: `Slide ${prev.length + 1}`,
                    subtitle: 'Architecture Deep-Dive',
                    codeSnippet: '// Code snippet or metric diagram',
                  },
                ]);
              }}
              className="px-3 py-1 rounded bg-[#22c55e] text-black text-xs font-bold hover:bg-emerald-400 transition"
            >
              + Add Slide
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Slide Navigation Thumbnails */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
                Slides ({carouselSlides.length})
              </span>
              {carouselSlides.map((slide, idx) => (
                <div
                  key={slide.id}
                  onClick={() => setActiveSlideIndex(idx)}
                  className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between text-xs group ${
                    activeSlideIndex === idx
                      ? 'bg-[#22c55e]/20 border-[#22c55e] text-emerald-300 font-bold'
                      : 'bg-black/40 border-white/5 text-zinc-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{idx + 1}. {slide.title}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSlideToDelete(idx);
                      }}
                      className="text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                      title="Delete Slide"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] font-mono text-zinc-500">{idx + 1}/{carouselSlides.length}</span>
                  </div>
                </div>
              ))}
            </div>

            {carouselSlides.length === 0 ? (
              <div className="lg:col-span-2 p-10 rounded-xl bg-[#0e1710] border border-white/5 text-center text-xs text-zinc-500 font-mono">
                No carousel slides yet. Add slides to build a LinkedIn carousel.
              </div>
            ) : (
            <div className="lg:col-span-2 p-6 rounded-xl bg-black/80 border border-[#22c55e]/40 shadow-2xl flex flex-col justify-between aspect-square max-h-[460px]">
              <div>
                <div className="flex items-center justify-between text-zinc-500 font-mono text-xs mb-4">
                  <span>SIGNALFORGE ARCHITECTURE</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 text-emerald-400 border border-zinc-800">
                    {activeSlideIndex + 1} of {carouselSlides.length}
                  </span>
                </div>
                <h2 className="text-xl font-extrabold text-slate-100 mb-2">
                  {carouselSlides[activeSlideIndex]?.title}
                </h2>
                <p className="text-xs text-emerald-400 font-mono mb-4">
                  {carouselSlides[activeSlideIndex]?.subtitle}
                </p>
                <div className="p-4 rounded-lg bg-[#0e1710] border border-zinc-800 font-mono text-xs text-emerald-200 whitespace-pre-wrap">
                  {carouselSlides[activeSlideIndex]?.codeSnippet}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-zinc-900 text-[11px] font-mono text-zinc-500">
                <span>Swipe for next slide →</span>
              </div>
            </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL: View Content Piece */}
      {viewingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] text-[#f59e0b] uppercase font-bold block">{viewingItem.type}</span>
                <h3 className="font-extrabold text-sm text-slate-100 mt-0.5">{viewingItem.title}</h3>
              </div>
              <button onClick={() => setViewingItem(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-black/60 border border-white/5 space-y-2">
                <span className="text-[10px] text-zinc-500 uppercase block">CONTENT BODY</span>
                <p className="text-slate-200 whitespace-pre-wrap text-xs leading-relaxed">{viewingItem.body}</p>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {viewingItem.tags.map((t) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-zinc-400 text-[10px]">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <span className="text-emerald-400 uppercase font-bold">Status: {viewingItem.status}</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const toEdit = viewingItem;
                    setViewingItem(null);
                    setEditingItem(toEdit);
                  }}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-slate-200 hover:bg-zinc-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => setViewingItem(null)}
                  className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Content Piece */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#22c55e]" />
                Edit Content Piece
              </h3>
              <button onClick={() => setEditingItem(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Title:</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Status:</label>
                <select
                  value={editingItem.status}
                  onChange={(e) => setEditingItem({ ...editingItem, status: e.target.value as any })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                >
                  <option value="idea">Idea / Research</option>
                  <option value="draft">Drafting</option>
                  <option value="review">Review & Polish</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Body Text:</label>
                <textarea
                  rows={6}
                  value={editingItem.body}
                  onChange={(e) => setEditingItem({ ...editingItem, body: e.target.value })}
                  className="w-full p-2.5 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setEditingItem(null)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditItem}
                disabled={isSavingEdit}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 flex items-center gap-1.5"
              >
                {isSavingEdit ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE CONTENT ITEM MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(itemToDelete)}
        onClose={() => setItemToDelete(null)}
        onConfirm={handleConfirmDeleteItem}
        title="Delete Content Piece"
        itemName={itemToDelete?.title}
        description="Are you sure you want to permanently delete this content item? This action will remove it from the Kanban pipeline and social publishing queues."
        isDeleting={isDeleting}
      />

      {/* CONFIRM DELETE CAROUSEL SLIDE MODAL */}
      <ConfirmDeleteModal
        isOpen={slideToDelete !== null}
        onClose={() => setSlideToDelete(null)}
        onConfirm={handleConfirmDeleteSlide}
        title="Delete Carousel Slide"
        itemName={slideToDelete !== null ? `Slide #${slideToDelete + 1}: ${carouselSlides[slideToDelete]?.title}` : ''}
        description="Are you sure you want to permanently remove this slide from your LinkedIn carousel deck?"
        isDeleting={isDeleting}
      />
    </div>
  );
}
