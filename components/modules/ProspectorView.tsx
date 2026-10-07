'use client';

import React, { useState } from 'react';
import {
  Users,
  Sparkles,
  Clock,
  Send,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  Sliders,
  Check,
  Copy,
  Plus,
  Building,
  Target,
  Linkedin,
  AlertTriangle,
  History,
  Calendar,
  X,
  ChevronRight,
  UserCheck,
  Edit,
  Eye,
  Trash2,
  FileText
} from 'lucide-react';
import {
  INITIAL_LINKEDIN_PROSPECTS,
  INITIAL_PROSPECTING_CAMPAIGN,
  LinkedInProspect,
  ProspectingCampaign
} from '@/lib/signalforge-data';
import { SkeletonCard, ApiSpinner } from '@/components/ui/SkeletonLoader';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';

export function ProspectorView() {
  const [campaign, setCampaign] = useState<ProspectingCampaign>(INITIAL_PROSPECTING_CAMPAIGN);
  const [prospects, setProspects] = useState<LinkedInProspect[]>(INITIAL_LINKEDIN_PROSPECTS);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Natural Language Thought Input
  const [thoughtInput, setThoughtInput] = useState('');
  const [parsingThought, setParsingThought] = useState(false);
  const [aiRationale, setAiRationale] = useState<string | null>(null);

  // Structured Editable Filters
  const [filterCompanies, setFilterCompanies] = useState<string[]>(campaign.targetCriteria.companies);
  const [filterRoles, setFilterRoles] = useState<string[]>(campaign.targetCriteria.roles);
  const [filterTech, setFilterTech] = useState<string[]>(campaign.targetCriteria.technologies);
  const [newCompanyInput, setNewCompanyInput] = useState('');
  const [newRoleInput, setNewRoleInput] = useState('');
  const [newTechInput, setNewTechInput] = useState('');

  // Active filter state
  const [selectedCompanyTierFilter, setSelectedCompanyTierFilter] = useState<string>('All');
  const [selectedSeniorityFilter, setSelectedSeniorityFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(6);

  // Note editor modal state
  const [activeProspectForNote, setActiveProspectForNote] = useState<LinkedInProspect | null>(null);
  const [editedNote, setEditedNote] = useState('');
  const [generatingNote, setGeneratingNote] = useState(false);
  const [copiedNote, setCopiedNote] = useState(false);
  const [connectSuccessMessage, setConnectSuccessMessage] = useState<string | null>(null);

  // View Prospect Modal state
  const [viewingProspect, setViewingProspect] = useState<LinkedInProspect | null>(null);

  // Edit Prospect Modal state
  const [editingProspect, setEditingProspect] = useState<LinkedInProspect | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState<boolean>(false);

  // Add Prospect Modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [isSavingNew, setIsSavingNew] = useState<boolean>(false);
  const [newProspectData, setNewProspectData] = useState<Partial<LinkedInProspect>>({
    name: '',
    currentCompany: '',
    role: '',
    companyTier: 'FAANG',
    seniority: 'Staff',
    location: 'San Francisco Bay Area',
    techAlignment: ['Distributed Systems', 'LLM Inference'],
    profileUrl: 'https://linkedin.com/in/',
    aiMatchScore: 95,
    personalizedNote: '',
    hiringSignal: '',
  });
  const [newTechTagInput, setNewTechTagInput] = useState('');

  // Delete Prospect state
  const [prospectToDelete, setProspectToDelete] = useState<LinkedInProspect | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Cron state
  const [cronRunning, setCronRunning] = useState(false);
  const [cronFeedback, setCronFeedback] = useState<string | null>(null);
  const [cronHistory, setCronHistory] = useState<Array<{ time: string; count: number; status: string }>>([
    { time: 'Today at 09:00 UTC', count: 7, status: 'Completed (7 Invites Dispatched)' },
    { time: 'Yesterday at 09:00 UTC', count: 8, status: 'Completed (8 Invites Dispatched)' },
    { time: '2 days ago at 09:00 UTC', count: 6, status: 'Completed (6 Invites Dispatched)' },
  ]);

  // Handle AI thought parsing
  const handleParseThought = async (overridePrompt?: string) => {
    const promptToUse = overridePrompt || thoughtInput;
    if (!promptToUse.trim()) return;
    setParsingThought(true);
    setIsLoading(true);
    setAiRationale(null);

    try {
      const res = await fetch('/api/v1/prospector/parse-thought', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ thought: promptToUse }),
      });
      const data = await res.json();
      if (data.success && data.data?.criteria) {
        const crit = data.data.criteria;
        const newCompanies = crit.companies || filterCompanies;
        const newRoles = crit.roles || filterRoles;
        const newTech = crit.technologies || filterTech;

        setFilterCompanies(newCompanies);
        setFilterRoles(newRoles);
        setFilterTech(newTech);

        setCampaign((prev) => ({
          ...prev,
          targetCriteria: {
            ...prev.targetCriteria,
            companies: newCompanies,
            roles: newRoles,
            technologies: newTech,
            seniorities: crit.seniorities || prev.targetCriteria.seniorities,
          },
        }));
        setAiRationale(crit.searchRationale || 'Auto-parsed targeting parameters and updated criteria fields.');
        setCurrentPage(1);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setParsingThought(false);
      setIsLoading(false);
    }
  };

  // Open note generator
  const handleOpenNote = (p: LinkedInProspect) => {
    setActiveProspectForNote(p);
    setEditedNote(p.personalizedNote);
    setConnectSuccessMessage(null);
  };

  // Generate note with Gemini
  const handleRegenerateNote = async () => {
    if (!activeProspectForNote) return;
    setGeneratingNote(true);

    try {
      const res = await fetch('/api/v1/prospector/generate-note', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prospectName: activeProspectForNote.name,
          company: activeProspectForNote.currentCompany,
          role: activeProspectForNote.role,
          techAlignment: activeProspectForNote.techAlignment,
        }),
      });
      const data = await res.json();
      if (data.success && data.data?.note) {
        setEditedNote(data.data.note);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingNote(false);
    }
  };

  // Trigger immediate Cron batch
  const handleTriggerCronNow = async () => {
    setCronRunning(true);
    setCronFeedback(null);

    try {
      const res = await fetch('/api/v1/prospector/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'trigger_cron_now' }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaign(data.data.campaign);
        setCronFeedback(data.data.batchResult?.message || 'Daily batch executed successfully.');

        // Update queued prospects to invite_sent
        setProspects((prev) =>
          prev.map((pr) => (pr.connectionStatus === 'queued_cron' ? { ...pr, connectionStatus: 'invite_sent' } : pr))
        );

        setCronHistory((prev) => [
          { time: 'Just now (Manual Run)', count: 5, status: 'Completed (5 Invites Dispatched via Cron)' },
          ...prev,
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCronRunning(false);
    }
  };

  // Toggle Campaign active
  const handleToggleCampaign = async () => {
    try {
      const res = await fetch('/api/v1/prospector/campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'toggle_active' }),
      });
      const data = await res.json();
      if (data.success) {
        setCampaign(data.data.campaign);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleQueueProspect = (id: string) => {
    setProspects((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, connectionStatus: 'queued_cron' } : pr))
    );
  };

  const handleSendDirectConnect = (id: string) => {
    setProspects((prev) =>
      prev.map((pr) => (pr.id === id ? { ...pr, connectionStatus: 'invite_sent' } : pr))
    );
    setCampaign((prev) => ({
      ...prev,
      sentToday: prev.sentToday + 1,
      totalSent: prev.totalSent + 1,
    }));
    setConnectSuccessMessage(`Connection invite sent directly to ${activeProspectForNote?.name} via LinkedIn!`);
    setTimeout(() => {
      setActiveProspectForNote(null);
      setConnectSuccessMessage(null);
    }, 1800);
  };

  // Delete Prospect handler
  const handleConfirmDeleteProspect = async () => {
    if (!prospectToDelete) return;
    setIsDeleting(true);
    try {
      // Simulate API deletion delay
      await new Promise((r) => setTimeout(r, 600));
      setProspects((prev) => prev.filter((p) => p.id !== prospectToDelete.id));
      setProspectToDelete(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save Edited Prospect
  const handleSaveEditProspect = async () => {
    if (!editingProspect) return;
    setIsSavingEdit(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setProspects((prev) =>
        prev.map((p) => (p.id === editingProspect.id ? editingProspect : p))
      );
      setEditingProspect(null);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingEdit(false);
    }
  };

  // Save New Prospect
  const handleSaveNewProspect = async () => {
    if (!newProspectData.name || !newProspectData.currentCompany) return;
    setIsSavingNew(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const created: LinkedInProspect = {
        id: `prosp-${Date.now()}`,
        name: newProspectData.name || 'Anonymous Engineer',
        currentCompany: newProspectData.currentCompany || 'FAANG',
        role: newProspectData.role || 'Senior Staff Systems Engineer',
        companyTier: (newProspectData.companyTier as any) || 'FAANG',
        location: newProspectData.location || 'San Francisco, CA',
        profileUrl: newProspectData.profileUrl || 'https://linkedin.com/in/',
        avatar: '',
        aiMatchScore: newProspectData.aiMatchScore || 95,
        seniority: (newProspectData.seniority as any) || 'Staff',
        techAlignment: newProspectData.techAlignment || ['Distributed Systems'],
        connectionStatus: 'uncontacted',
        personalizedNote:
          newProspectData.personalizedNote ||
          `Hi ${newProspectData.name?.split(' ')[0]}, followed your work at ${newProspectData.currentCompany}. Would love to connect and follow your systems insights!`,
        lastActivity: 'Active today',
        hiringSignal: newProspectData.hiringSignal || 'Actively expanding systems team',
      };

      setProspects([created, ...prospects]);
      setIsAddModalOpen(false);
      setNewProspectData({
        name: '',
        currentCompany: '',
        role: '',
        companyTier: 'FAANG',
        seniority: 'Staff',
        location: 'San Francisco Bay Area',
        techAlignment: ['Distributed Systems', 'LLM Inference'],
        profileUrl: 'https://linkedin.com/in/',
        aiMatchScore: 95,
        personalizedNote: '',
        hiringSignal: '',
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSavingNew(false);
    }
  };

  // Filter prospects
  const filteredProspects = prospects.filter((p) => {
    const matchesTier =
      selectedCompanyTierFilter === 'All' || p.companyTier === selectedCompanyTierFilter;
    const matchesSeniority =
      selectedSeniorityFilter === 'All' || p.seniority === selectedSeniorityFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.currentCompany.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.techAlignment.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCompanyCriteria =
      filterCompanies.length === 0 ||
      filterCompanies.some(
        (c) =>
          p.currentCompany.toLowerCase().includes(c.toLowerCase()) ||
          c.toLowerCase().includes(p.currentCompany.toLowerCase())
      );

    return matchesTier && matchesSeniority && matchesSearch && matchesCompanyCriteria;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProspects.length / pageSize) || 1;
  const paginatedProspects = filteredProspects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* SECTION 0: LinkedIn Account Connection Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#004182]/20 via-[#0e1710] to-[#080c08] border border-[#0077b5]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#0077b5] text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-[#0077b5]/30">
            <Linkedin className="w-6 h-6 fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-100">
                Connected LinkedIn Account: Abhishek Garg
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-mono">
                OAuth 2.0 Active
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5 font-mono">
              Role Focus: <span className="text-emerald-400">Staff Systems & AI Architect</span> • Daily Quota:{' '}
              <span className="text-slate-200">{campaign.sentToday}/{campaign.dailyLimit} invites used</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <div className="px-3 py-1.5 rounded-lg bg-black/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
            <span>Anti-Spam Safety: Safe</span>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-3.5 py-1.5 rounded-lg bg-[#22c55e]/15 border border-[#22c55e]/40 text-emerald-300 font-bold text-xs hover:bg-[#22c55e]/25 transition flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span>Add Prospect</span>
          </button>

          <button
            onClick={() => handleTriggerCronNow()}
            disabled={cronRunning}
            className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
          >
            {cronRunning ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-black" />}
            <span>Sync & Run Batch</span>
          </button>
        </div>
      </div>

      {/* SECTION 1: Natural Language Thought Input (AI Integration) */}
      <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-emerald-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#22c55e]" />
            Natural Language Thought / Intent Query:
          </label>
          <span className="text-[10px] font-mono text-zinc-500">
            Powered by @google/genai (Gemini 2.5)
          </span>
        </div>

        <p className="text-xs text-zinc-400">
          Describe who you want to connect with in natural language. The AI will parse your thought, automatically populate all criteria fields below, and retrieve matching target profiles.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <textarea
            rows={2}
            value={thoughtInput}
            onChange={(e) => setThoughtInput(e.target.value)}
            placeholder="e.g. I want to connect with Engineering Managers and Staff AI engineers at FAANG (Google, Meta, Netflix) who post about distributed training and inference..."
            className="flex-1 p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-xs text-emerald-200 placeholder-zinc-600 focus:outline-none focus:border-[#22c55e] font-mono resize-none leading-relaxed"
          />

          <button
            onClick={() => handleParseThought()}
            disabled={parsingThought || !thoughtInput.trim()}
            className="px-5 py-3 rounded-lg bg-[#22c55e] hover:bg-emerald-400 disabled:opacity-50 text-black font-extrabold text-xs transition flex items-center justify-center gap-2 flex-shrink-0 shadow-md shadow-[#22c55e]/20"
          >
            {parsingThought ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Parsing Thought...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>AI Parse & Auto-Fill Fields</span>
              </>
            )}
          </button>
        </div>

        {aiRationale && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-[#22c55e]/40 text-xs font-mono text-emerald-300 flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
            <span>{aiRationale}</span>
          </div>
        )}

        {/* Auto-Populated & Editable Structured Criteria Fields */}
        <div className="pt-3 border-t border-white/5 space-y-3">
          <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono flex items-center justify-between">
            <span>Auto-Populated Criteria Fields (Editable):</span>
            <span className="text-[10px] text-zinc-500 font-normal">Add or remove criteria chips</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            {/* Target Companies Field */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <span className="text-zinc-400 text-[11px] font-semibold block">Target Companies:</span>
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {filterCompanies.map((c) => (
                  <span
                    key={c}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-slate-200 border border-white/20 text-[10px]"
                  >
                    <span>{c}</span>
                    <button
                      onClick={() => setFilterCompanies(filterCompanies.filter((x) => x !== c))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1 pt-1">
                <input
                  type="text"
                  placeholder="+ Add company"
                  value={newCompanyInput}
                  onChange={(e) => setNewCompanyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newCompanyInput.trim()) {
                      setFilterCompanies([...filterCompanies, newCompanyInput.trim()]);
                      setNewCompanyInput('');
                      setCurrentPage(1);
                    }
                  }}
                  className="flex-1 px-2 py-1 bg-black/60 border border-zinc-700 rounded text-[11px] text-emerald-300 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            {/* Target Roles Field */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <span className="text-zinc-400 text-[11px] font-semibold block">Target Roles:</span>
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {filterRoles.map((r) => (
                  <span
                    key={r}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-emerald-300 border border-[#22c55e]/30 text-[10px]"
                  >
                    <span>{r}</span>
                    <button
                      onClick={() => setFilterRoles(filterRoles.filter((x) => x !== r))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1 pt-1">
                <input
                  type="text"
                  placeholder="+ Add role title"
                  value={newRoleInput}
                  onChange={(e) => setNewRoleInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newRoleInput.trim()) {
                      setFilterRoles([...filterRoles, newRoleInput.trim()]);
                      setNewRoleInput('');
                      setCurrentPage(1);
                    }
                  }}
                  className="flex-1 px-2 py-1 bg-black/60 border border-zinc-700 rounded text-[11px] text-emerald-300 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            {/* Tech Stack Field */}
            <div className="p-3 rounded-lg bg-black/40 border border-white/10 space-y-2">
              <span className="text-zinc-400 text-[11px] font-semibold block">Tech Stack Focus:</span>
              <div className="flex flex-wrap gap-1.5 min-h-[32px]">
                {filterTech.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black text-[#f59e0b] border border-[#f59e0b]/40 text-[10px]"
                  >
                    <span>{t}</span>
                    <button
                      onClick={() => setFilterTech(filterTech.filter((x) => x !== t))}
                      className="text-zinc-500 hover:text-red-400"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-1 pt-1">
                <input
                  type="text"
                  placeholder="+ Add tech tag"
                  value={newTechInput}
                  onChange={(e) => setNewTechInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && newTechInput.trim()) {
                      setFilterTech([...filterTech, newTechInput.trim()]);
                      setNewTechInput('');
                      setCurrentPage(1);
                    }
                  }}
                  className="flex-1 px-2 py-1 bg-black/60 border border-zinc-700 rounded text-[11px] text-emerald-300 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: Daily Cron Automation Scheduler */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#0e1710] to-[#080c08] border border-[#22c55e]/25 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#22c55e]/20 border border-[#22c55e]/40 flex items-center justify-center text-[#22c55e]">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-slate-100">{campaign.name}</h3>
                <span
                  className={`text-[9px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    campaign.isActive
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {campaign.isActive ? 'Daily Cron Active' : 'Daily Cron Paused'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5 font-mono">
                Schedule: <span className="text-emerald-300 font-semibold">{campaign.scheduleHumanText}</span> ({campaign.cronExpression}) • Next Run: <span className="text-[#f59e0b] font-semibold">{campaign.nextRunAt}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleCampaign}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition border ${
                campaign.isActive
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:text-white'
                  : 'bg-[#22c55e]/20 border-[#22c55e] text-emerald-300'
              }`}
            >
              {campaign.isActive ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{campaign.isActive ? 'Pause Cron' : 'Activate Cron'}</span>
            </button>

            <button
              onClick={handleTriggerCronNow}
              disabled={cronRunning}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition shadow-sm shadow-[#22c55e]/20"
            >
              {cronRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Dispatching Daily Invites...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-black" />
                  <span>Run Daily Cron Batch Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Cron Telemetry Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-500 text-[10px] block">TODAY&apos;S CRON QUOTA</span>
            <div className="font-bold text-sm text-slate-100 flex items-center justify-between">
              <span>{campaign.sentToday} / {campaign.dailyLimit}</span>
              <span className="text-[10px] text-emerald-400 font-normal">Safe Buffer</span>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-500 text-[10px] block">TOTAL CRON INVITES SENT</span>
            <div className="font-bold text-sm text-slate-100">
              {campaign.totalSent} Outbound
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-500 text-[10px] block">ACCEPTANCE RATE</span>
            <div className="font-bold text-sm text-[#22c55e]">
              {campaign.acceptedCount} ({Math.round((campaign.acceptedCount / campaign.totalSent) * 100)}%)
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
            <span className="text-zinc-500 text-[10px] block">LINKEDIN COMPLIANCE</span>
            <div className="font-bold text-sm text-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#22c55e]" />
              <span>100% Anti-Ban Guard</span>
            </div>
          </div>
        </div>

        {cronFeedback && (
          <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#22c55e] flex-shrink-0" />
            <span>{cronFeedback}</span>
          </div>
        )}
      </div>

      {/* SECTION 3: Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by name, company, role, or tech tag..."
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0e1710] border border-[#22c55e]/30 rounded-lg text-emerald-200 placeholder-zinc-500 focus:outline-none focus:border-[#22c55e] font-mono"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-mono overflow-x-auto pb-1">
          <span className="text-zinc-500">Tier:</span>
          {['All', 'FAANG', 'Frontier AI', 'Fintech Core'].map((t) => (
            <button
              key={t}
              onClick={() => {
                setSelectedCompanyTierFilter(t);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
                selectedCompanyTierFilter === t
                  ? 'bg-[#22c55e]/20 text-emerald-300 border-[#22c55e]'
                  : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {t}
            </button>
          ))}

          <span className="text-zinc-500 ml-2">Seniority:</span>
          {['All', 'Staff', 'Principal', 'Engineering Manager', 'Director'].map((s) => (
            <button
              key={s}
              onClick={() => {
                setSelectedSeniorityFilter(s);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded border transition whitespace-nowrap ${
                selectedSeniorityFilter === s
                  ? 'bg-[#22c55e]/20 text-emerald-300 border-[#22c55e]'
                  : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 4: Matching Target Profiles Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono">
          <span className="text-zinc-400">
            Discovered Results ({filteredProspects.length} Matching Profiles)
          </span>
          <div className="flex items-center gap-3">
            {isLoading && <ApiSpinner label="Refreshing candidates..." />}
            <span className="text-zinc-500 hidden sm:inline">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </div>

        {/* Skeleton Loader vs Real Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <SkeletonCard count={pageSize} />
          ) : paginatedProspects.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-[#0e1710] border border-white/5 rounded-xl space-y-3 font-mono text-xs">
              <Users className="w-8 h-8 text-zinc-600 mx-auto" />
              <div className="text-zinc-300 font-bold">No prospects matching current criteria</div>
              <p className="text-zinc-500 text-[11px]">
                Try adjusting your search terms or click &quot;Add Prospect&quot; to register a new candidate.
              </p>
              <button
                onClick={() => {
                  setSelectedCompanyTierFilter('All');
                  setSelectedSeniorityFilter('All');
                  setSearchQuery('');
                  setFilterCompanies([]);
                }}
                className="px-3 py-1.5 rounded bg-zinc-800 text-emerald-400 hover:bg-zinc-700 text-xs"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            paginatedProspects.map((p) => {
              const isQueued = p.connectionStatus === 'queued_cron';
              const isSent = p.connectionStatus === 'invite_sent';
              const isConnected = p.connectionStatus === 'connected' || p.connectionStatus === 'chat_active';

              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/45 transition space-y-4 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center font-bold text-sm text-emerald-400 flex-shrink-0">
                          {p.avatar ? (
                            <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                          ) : (
                            p.name.slice(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                            <span
                              onClick={() => setViewingProspect(p)}
                              className="hover:text-emerald-300 cursor-pointer transition"
                            >
                              {p.name}
                            </span>
                            {p.profileUrl && !p.profileUrl.endsWith('/in/') && (
                              <a
                                href={p.profileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="text-[#0077b5] hover:text-[#38bdf8]"
                                title="Open LinkedIn Profile"
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                            )}
                          </h3>
                          <p className="text-xs text-emerald-400 font-semibold">{p.currentCompany}</p>
                          <p className="text-[11px] text-zinc-400 leading-snug line-clamp-1">{p.role}</p>
                        </div>
                      </div>

                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 flex-shrink-0">
                        {p.aiMatchScore}% Match
                      </span>
                    </div>

                    {p.hiringSignal && (
                      <div className="p-2 rounded bg-black/50 border border-amber-500/20 text-[10px] font-mono text-[#f59e0b] mb-2.5">
                        ⚡ {p.hiringSignal}
                      </div>
                    )}

                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-mono text-zinc-500 block">Mutual Systems Alignment:</span>
                      <div className="flex flex-wrap gap-1">
                        {p.techAlignment.map((tech) => (
                          <span
                            key={tech}
                            className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-zinc-300 border border-zinc-800"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-black/40 border border-white/5 text-[11px] font-mono text-zinc-400 italic line-clamp-2">
                      &ldquo;{p.personalizedNote}&rdquo;
                    </div>
                  </div>

                  {/* Action Buttons Row */}
                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-2">
                      {isQueued && (
                        <span className="text-[#f59e0b] text-[10px] font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Queued
                        </span>
                      )}
                      {isSent && (
                        <span className="text-cyan-400 text-[10px] font-semibold flex items-center gap-1">
                          <Send className="w-3 h-3" />
                          Sent
                        </span>
                      )}
                      {isConnected && (
                        <span className="text-[#22c55e] text-[10px] font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Connected
                        </span>
                      )}
                      {!isQueued && !isSent && !isConnected && (
                        <span className="text-zinc-500 text-[10px]">Ready</span>
                      )}

                      {/* View & Edit icons */}
                      <button
                        onClick={() => setViewingProspect(p)}
                        className="p-1 rounded text-zinc-500 hover:text-emerald-300 transition"
                        title="View Full Profile Details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setEditingProspect(p)}
                        className="p-1 rounded text-zinc-500 hover:text-amber-300 transition"
                        title="Edit Prospect Details"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setProspectToDelete(p)}
                        className="p-1 rounded text-zinc-500 hover:text-red-400 transition"
                        title="Delete Prospect"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleOpenNote(p)}
                        className="px-2.5 py-1 rounded bg-[#0077b5]/20 border border-[#0077b5]/50 text-sky-300 hover:bg-[#0077b5]/30 transition text-xs flex items-center gap-1"
                        title="Review Personalized Note & Connect"
                      >
                        <Linkedin className="w-3 h-3 fill-sky-300" />
                        <span>Connect</span>
                      </button>

                      {!isQueued && !isSent && !isConnected && (
                        <button
                          onClick={() => handleQueueProspect(p.id)}
                          className="px-2.5 py-1 rounded bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
                        >
                          Queue
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Reusable Pagination Component */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredProspects.length}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
          itemLabel="candidates"
        />
      </div>

      {/* SECTION 5: Cron Execution Audit Log */}
      <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3 font-mono text-xs">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <div className="flex items-center gap-2 text-slate-200 font-bold">
            <History className="w-4 h-4 text-[#22c55e]" />
            <span>Daily Cron Execution Audit History</span>
          </div>
          <span className="text-[11px] text-zinc-500">Autonomous Network Growth Log</span>
        </div>

        <div className="divide-y divide-white/5">
          {cronHistory.map((h, i) => (
            <div key={i} className="py-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
                <span className="text-slate-200">{h.time}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400">{h.status}</span>
                <span className="px-2 py-0.5 rounded bg-black/60 text-zinc-400 border border-zinc-800 text-[10px]">
                  Verified OAuth
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL 1: View Prospect Dossier */}
      {viewingProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-700 overflow-hidden flex items-center justify-center font-bold text-base text-emerald-400">
                  {viewingProspect.avatar ? (
                    <img src={viewingProspect.avatar} alt={viewingProspect.name} className="w-full h-full object-cover" />
                  ) : (
                    viewingProspect.name.slice(0, 2).toUpperCase()
                  )}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                    {viewingProspect.name}
                    <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                      {viewingProspect.aiMatchScore}% Match
                    </span>
                  </h3>
                  <p className="text-emerald-400 text-xs font-semibold">{viewingProspect.currentCompany} • {viewingProspect.role}</p>
                </div>
              </div>

              <button
                onClick={() => setViewingProspect(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-black/60 border border-white/5 text-[11px]">
                <div>
                  <span className="text-zinc-500 block">Seniority:</span>
                  <span className="text-slate-200 font-semibold">{viewingProspect.seniority}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Location:</span>
                  <span className="text-slate-200 font-semibold">{viewingProspect.location}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Company Tier:</span>
                  <span className="text-[#f59e0b] font-semibold">{viewingProspect.companyTier}</span>
                </div>
                <div>
                  <span className="text-zinc-500 block">Connection Status:</span>
                  <span className="text-emerald-300 font-semibold uppercase">{viewingProspect.connectionStatus}</span>
                </div>
              </div>

              {viewingProspect.hiringSignal && (
                <div className="p-2.5 rounded bg-amber-950/30 border border-amber-500/30 text-amber-300 text-xs">
                  ⚡ <strong>Hiring Signal:</strong> {viewingProspect.hiringSignal}
                </div>
              )}

              <div>
                <span className="text-zinc-400 font-semibold block mb-1">Mutual Systems Alignment:</span>
                <div className="flex flex-wrap gap-1.5">
                  {viewingProspect.techAlignment.map((tech) => (
                    <span
                      key={tech}
                      className="px-2 py-0.5 rounded bg-black/80 text-zinc-300 border border-zinc-800 text-[10px]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-zinc-400 font-semibold block mb-1">Personalized Connection Note:</span>
                <div className="p-3 rounded-lg bg-black/80 border border-[#22c55e]/20 text-emerald-200 italic leading-relaxed text-[11px]">
                  &ldquo;{viewingProspect.personalizedNote}&rdquo;
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              {viewingProspect.profileUrl && !viewingProspect.profileUrl.endsWith('/in/') ? (
                <a
                  href={viewingProspect.profileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[#0077b5] hover:underline flex items-center gap-1"
                >
                  <Linkedin className="w-3.5 h-3.5 fill-[#0077b5]" />
                  <span>Open LinkedIn profile</span>
                </a>
              ) : (
                <span className="text-[11px] text-zinc-500 font-mono">Add a profile URL to open LinkedIn</span>
              )}

              <div className="flex gap-2">
                <button
                  onClick={() => {
                    const toEdit = viewingProspect;
                    setViewingProspect(null);
                    setEditingProspect(toEdit);
                  }}
                  className="px-3 py-1.5 rounded bg-zinc-800 text-slate-200 hover:bg-zinc-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    const toNote = viewingProspect;
                    setViewingProspect(null);
                    handleOpenNote(toNote);
                  }}
                  className="px-3.5 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400"
                >
                  Connect Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Edit Prospect */}
      {editingProspect && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#22c55e]" />
                Edit Prospect: {editingProspect.name}
              </h3>
              <button
                onClick={() => setEditingProspect(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Name:</label>
                  <input
                    type="text"
                    value={editingProspect.name}
                    onChange={(e) => setEditingProspect({ ...editingProspect, name: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Current Company:</label>
                  <input
                    type="text"
                    value={editingProspect.currentCompany}
                    onChange={(e) => setEditingProspect({ ...editingProspect, currentCompany: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Role Title:</label>
                  <input
                    type="text"
                    value={editingProspect.role}
                    onChange={(e) => setEditingProspect({ ...editingProspect, role: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Seniority:</label>
                  <select
                    value={editingProspect.seniority}
                    onChange={(e) => setEditingProspect({ ...editingProspect, seniority: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Staff">Staff</option>
                    <option value="Principal">Principal</option>
                    <option value="Engineering Manager">Engineering Manager</option>
                    <option value="Director">Director</option>
                    <option value="Tech Lead">Tech Lead</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Hiring Signal / Open Roles:</label>
                <input
                  type="text"
                  value={editingProspect.hiringSignal || ''}
                  onChange={(e) => setEditingProspect({ ...editingProspect, hiringSignal: e.target.value })}
                  placeholder="e.g. Actively hiring Staff ML Infra Engineers"
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-amber-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Personalized Note Draft:</label>
                <textarea
                  rows={4}
                  value={editingProspect.personalizedNote}
                  onChange={(e) => setEditingProspect({ ...editingProspect, personalizedNote: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setEditingProspect(null)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditProspect}
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

      {/* MODAL 3: Add New Prospect */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Add New Target Prospect to Pipeline
              </h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Full Name *:</label>
                  <input
                    type="text"
                    placeholder="e.g. Sanjay Ghemawat"
                    value={newProspectData.name || ''}
                    onChange={(e) => setNewProspectData({ ...newProspectData, name: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Company *:</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={newProspectData.currentCompany || ''}
                    onChange={(e) => setNewProspectData({ ...newProspectData, currentCompany: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Role Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Google Fellow / Systems Architect"
                    value={newProspectData.role || ''}
                    onChange={(e) => setNewProspectData({ ...newProspectData, role: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Company Tier:</label>
                  <select
                    value={newProspectData.companyTier}
                    onChange={(e) => setNewProspectData({ ...newProspectData, companyTier: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="FAANG">FAANG</option>
                    <option value="Frontier AI">Frontier AI</option>
                    <option value="Fintech Core">Fintech Core</option>
                    <option value="Cloud Infra">Cloud Infra</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">LinkedIn Profile URL:</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={newProspectData.profileUrl || ''}
                  onChange={(e) => setNewProspectData({ ...newProspectData, profileUrl: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-sky-300 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Tech Stack Tags:</label>
                <div className="flex gap-1">
                  <input
                    type="text"
                    placeholder="Add tag and press Enter"
                    value={newTechTagInput}
                    onChange={(e) => setNewTechTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTechTagInput.trim()) {
                        e.preventDefault();
                        setNewProspectData({
                          ...newProspectData,
                          techAlignment: [...(newProspectData.techAlignment || []), newTechTagInput.trim()],
                        });
                        setNewTechTagInput('');
                      }
                    }}
                    className="flex-1 p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {(newProspectData.techAlignment || []).map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-black border border-zinc-800 text-[10px] text-zinc-300 flex items-center gap-1"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setNewProspectData({
                            ...newProspectData,
                            techAlignment: (newProspectData.techAlignment || []).filter((_, i) => i !== idx),
                          })
                        }
                        className="text-zinc-500 hover:text-red-400"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Personalized Connection Note:</label>
                <textarea
                  rows={3}
                  placeholder="Optional custom note (defaults to auto-generated invitation)"
                  value={newProspectData.personalizedNote || ''}
                  onChange={(e) => setNewProspectData({ ...newProspectData, personalizedNote: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveNewProspect}
                disabled={isSavingNew || !newProspectData.name || !newProspectData.currentCompany}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSavingNew ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add to Pipeline</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Personalized Connection Note Inspector & Direct Connect */}
      {activeProspectForNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-3">
              <div>
                <span className="text-[10px] text-[#0077b5] uppercase tracking-wider font-bold block flex items-center gap-1">
                  <Linkedin className="w-3 h-3 fill-[#0077b5]" />
                  LINKEDIN DIRECT CONNECTION REQUEST
                </span>
                <h3 className="font-bold text-sm text-slate-100 mt-0.5">
                  Connect with {activeProspectForNote.name} ({activeProspectForNote.currentCompany})
                </h3>
              </div>
              <button
                onClick={() => setActiveProspectForNote(null)}
                className="text-zinc-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {connectSuccessMessage ? (
              <div className="p-4 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 text-center space-y-2 py-8">
                <CheckCircle2 className="w-8 h-8 text-[#22c55e] mx-auto animate-bounce" />
                <div className="font-bold text-sm">{connectSuccessMessage}</div>
                <p className="text-[11px] text-zinc-400">
                  Profile marked as Invite Sent. Logged to your outreach audit trail.
                </p>
              </div>
            ) : (
              <>
                <div className="p-3 rounded-lg bg-black/50 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Role:</span>
                    <span className="text-slate-200">{activeProspectForNote.role}</span>
                  </div>
                  <div className="flex items-center justify-between text-zinc-400">
                    <span>Mutual Alignment:</span>
                    <span className="text-[#f59e0b]">{activeProspectForNote.techAlignment.join(', ')}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-zinc-400">Personalized Note (Max 300 Chars):</label>
                    <span
                      className={`text-[10px] font-bold ${
                        editedNote.length > 295 ? 'text-red-400' : 'text-emerald-400'
                      }`}
                    >
                      {editedNote.length} / 300 chars
                    </span>
                  </div>

                  <textarea
                    rows={5}
                    value={editedNote}
                    onChange={(e) => setEditedNote(e.target.value)}
                    maxLength={300}
                    className="w-full p-3 rounded-lg bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e] resize-none leading-relaxed"
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={handleRegenerateNote}
                    disabled={generatingNote}
                    className="flex items-center gap-1.5 text-zinc-400 hover:text-emerald-300 transition"
                  >
                    {generatingNote ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
                    )}
                    <span>Regenerate with Gemini</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(editedNote);
                        setCopiedNote(true);
                        setTimeout(() => setCopiedNote(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded bg-black border border-white/10 text-zinc-300 hover:text-white flex items-center gap-1"
                    >
                      {copiedNote ? <Check className="w-3.5 h-3.5 text-[#22c55e]" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedNote ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={() => handleSendDirectConnect(activeProspectForNote.id)}
                      className="px-4 py-1.5 rounded bg-[#0077b5] text-white font-extrabold hover:bg-[#005582] transition flex items-center gap-1.5 shadow-md shadow-[#0077b5]/25"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send LinkedIn Invite</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(prospectToDelete)}
        onClose={() => setProspectToDelete(null)}
        onConfirm={handleConfirmDeleteProspect}
        title="Delete Candidate from Pipeline"
        itemName={prospectToDelete ? `${prospectToDelete.name} (${prospectToDelete.currentCompany})` : ''}
        description="Are you sure you want to permanently delete this candidate from your prospect pipeline? This will remove them from your active targeting criteria and cancel any pending or queued cron invites."
        isDeleting={isDeleting}
      />
    </div>
  );
}
