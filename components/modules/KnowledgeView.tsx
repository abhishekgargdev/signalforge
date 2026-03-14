'use client';

import React, { useState } from 'react';
import {
  BrainCircuit,
  Plus,
  Github,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  FolderGit2,
  Layers,
  ArrowRight,
  Edit,
  Trash2,
  Eye,
  RefreshCw,
  X,
  Check
} from 'lucide-react';
import { ExperienceItem, ProjectItem } from '@/lib/signalforge-data';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';

interface KnowledgeViewProps {
  experiences: ExperienceItem[];
  projects: ProjectItem[];
  onDraftContentFromExperience: (exp: ExperienceItem) => void;
}

export function KnowledgeView({
  experiences: initialExperiences,
  projects: initialProjects,
  onDraftContentFromExperience,
}: KnowledgeViewProps) {
  const [experiences, setExperiences] = useState<ExperienceItem[]>(initialExperiences);
  const [projects, setProjects] = useState<ProjectItem[]>(initialProjects);
  const [activeTab, setActiveTab] = useState<'experiences' | 'projects'>('experiences');

  // Modals for CRUD
  const [viewingExp, setViewingExp] = useState<ExperienceItem | null>(null);
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [addExpModalOpen, setAddExpModalOpen] = useState<boolean>(false);
  const [expToDelete, setExpToDelete] = useState<ExperienceItem | null>(null);

  const [viewingProj, setViewingProj] = useState<ProjectItem | null>(null);
  const [editingProj, setEditingProj] = useState<ProjectItem | null>(null);
  const [addProjModalOpen, setAddProjModalOpen] = useState<boolean>(false);
  const [projToDelete, setProjToDelete] = useState<ProjectItem | null>(null);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Pagination
  const [expPage, setExpPage] = useState<number>(1);
  const [expPageSize, setExpPageSize] = useState<number>(3);

  const [projPage, setProjPage] = useState<number>(1);
  const [projPageSize, setProjPageSize] = useState<number>(3);

  // New Experience Form
  const [newExp, setNewExp] = useState<Partial<ExperienceItem>>({
    title: '',
    project: '',
    problem: '',
    challenge: '',
    solution: '',
    result: '',
    lesson: '',
    technologies: ['Distributed Systems'],
    tags: ['Architecture'],
  });

  // New Project Form
  const [newProj, setNewProj] = useState<Partial<ProjectItem>>({
    name: '',
    description: '',
    problem: '',
    architecture: '',
    technologies: ['Go', 'eBPF'],
    githubUrl: 'https://github.com/abhishekgarg/',
    liveUrl: 'https://signalforge.dev/',
    lessons: '',
  });

  // Delete Experience Handler
  const handleConfirmDeleteExp = async () => {
    if (!expToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setExperiences((prev) => prev.filter((e) => e.id !== expToDelete.id));
      setExpToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Project Handler
  const handleConfirmDeleteProj = async () => {
    if (!projToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setProjects((prev) => prev.filter((p) => p.id !== projToDelete.id));
      setProjToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save New Experience
  const handleSaveNewExp = async () => {
    if (!newExp.title) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const created: ExperienceItem = {
        id: `exp-${Date.now()}`,
        title: newExp.title,
        project: newExp.project || 'Core Systems',
        problem: newExp.problem || 'Scaling challenge in production',
        challenge: newExp.challenge || 'Hardware and network limits',
        solution: newExp.solution || 'Architectural redesign with zero-copy',
        technologies: newExp.technologies || ['Distributed Systems'],
        result: newExp.result || 'Reduced p99 tail latency significantly',
        lesson: newExp.lesson || 'In-kernel ring buffers bypass context-switch latency',
        tags: newExp.tags || ['Systems'],
      };
      setExperiences([created, ...experiences]);
      setAddExpModalOpen(false);
      setNewExp({
        title: '',
        project: '',
        problem: '',
        challenge: '',
        solution: '',
        result: '',
        lesson: '',
        technologies: ['Distributed Systems'],
        tags: ['Architecture'],
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edited Experience
  const handleSaveEditExp = async () => {
    if (!editingExp) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setExperiences((prev) =>
        prev.map((e) => (e.id === editingExp.id ? editingExp : e))
      );
      setEditingExp(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Save New Project
  const handleSaveNewProj = async () => {
    if (!newProj.name) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const created: ProjectItem = {
        id: `proj-${Date.now()}`,
        name: newProj.name,
        description: newProj.description || 'Open source systems architecture',
        problem: newProj.problem || 'Latency bottlenecks in distributed pipelines',
        architecture: newProj.architecture || 'Decoupled ring-buffer architecture',
        technologies: newProj.technologies || ['Go', 'eBPF'],
        githubUrl: newProj.githubUrl || 'https://github.com/abhishekgarg/',
        liveUrl: newProj.liveUrl || 'https://signalforge.dev/',
        lessons: newProj.lessons || 'Zero-copy memory management in critical paths',
      };
      setProjects([created, ...projects]);
      setAddProjModalOpen(false);
      setNewProj({
        name: '',
        description: '',
        problem: '',
        architecture: '',
        technologies: ['Go', 'eBPF'],
        githubUrl: 'https://github.com/abhishekgarg/',
        liveUrl: 'https://signalforge.dev/',
        lessons: '',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edited Project
  const handleSaveEditProj = async () => {
    if (!editingProj) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 300));
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProj.id ? editingProj : p))
      );
      setEditingProj(null);
    } finally {
      setIsSaving(false);
    }
  };

  const paginatedExperiences = experiences.slice(
    (expPage - 1) * expPageSize,
    expPage * expPageSize
  );
  const expTotalPages = Math.ceil(experiences.length / expPageSize) || 1;

  const paginatedProjects = projects.slice(
    (projPage - 1) * projPageSize,
    projPage * projPageSize
  );
  const projTotalPages = Math.ceil(projects.length / projPageSize) || 1;

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              STAR Experience Vault & Architecture Repository
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Ground generated articles and posts in real production war-stories and benchmarked open-source systems.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'experiences' ? (
            <button
              onClick={() => setAddExpModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add War Story</span>
            </button>
          ) : (
            <button
              onClick={() => setAddProjModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Project</span>
            </button>
          )}

          <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
            <button
              onClick={() => setActiveTab('experiences')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'experiences' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              STAR Experiences ({experiences.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'projects' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Projects ({projects.length})
            </button>
          </div>
        </div>
      </div>

      {/* TAB 1: STAR Experiences */}
      {activeTab === 'experiences' && (
        <div className="space-y-4">
          <div className="space-y-4">
            {paginatedExperiences.map((exp) => (
              <div
                key={exp.id}
                className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition space-y-4 group relative"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                  <div>
                    <span className="text-[10px] font-mono text-[#f59e0b] uppercase tracking-wider block">
                      {exp.project}
                    </span>
                    <h3 className="font-bold text-sm text-slate-100">{exp.title}</h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setViewingExp(exp)}
                      className="p-1 text-zinc-500 hover:text-emerald-300 transition"
                      title="View Details"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setEditingExp(exp)}
                      className="p-1 text-zinc-500 hover:text-amber-300 transition"
                      title="Edit Story"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setExpToDelete(exp)}
                      className="p-1 text-zinc-500 hover:text-red-400 transition"
                      title="Delete Story"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDraftContentFromExperience(exp)}
                      className="flex items-center gap-1.5 px-3 py-1 rounded bg-[#22c55e]/15 border border-[#22c55e]/40 text-emerald-300 text-xs font-mono font-semibold hover:bg-[#22c55e]/25 transition ml-2"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>Turn into Post →</span>
                    </button>
                  </div>
                </div>

                {/* STAR Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-zinc-500 text-[10px] block font-bold">PROBLEM & SITUATION</span>
                    <p className="text-zinc-300">{exp.problem}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-zinc-500 text-[10px] block font-bold">SYSTEM CHALLENGE & TASK</span>
                    <p className="text-zinc-300">{exp.challenge}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-zinc-500 text-[10px] block font-bold">ARCHITECTURAL ACTION</span>
                    <p className="text-emerald-300">{exp.solution}</p>
                  </div>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1">
                    <span className="text-zinc-500 text-[10px] block font-bold">QUANTITATIVE RESULT</span>
                    <p className="text-slate-100 font-semibold">{exp.result}</p>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex flex-wrap gap-1">
                    {exp.technologies.map((t) => (
                      <span key={t} className="px-2 py-0.5 rounded bg-black text-zinc-400 border border-zinc-800 text-[10px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <span className="text-zinc-500 text-[11px] italic">💡 {exp.lesson}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={expPage}
            totalPages={expTotalPages}
            totalItems={experiences.length}
            pageSize={expPageSize}
            onPageChange={setExpPage}
            itemLabel="war stories"
          />
        </div>
      )}

      {/* TAB 2: Architecture Projects */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {paginatedProjects.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition space-y-4 flex flex-col justify-between group relative"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FolderGit2 className="w-4 h-4 text-[#22c55e]" />
                      <h3 className="font-bold text-sm text-slate-100">{p.name}</h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setViewingProj(p)}
                        className="p-1 text-zinc-500 hover:text-emerald-300 transition"
                        title="View Project"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setEditingProj(p)}
                        className="p-1 text-zinc-500 hover:text-amber-300 transition"
                        title="Edit Project"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setProjToDelete(p)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition"
                        title="Delete Project"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed mb-3">{p.description}</p>

                  <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-1.5 text-xs font-mono mb-3">
                    <span className="text-[10px] text-zinc-500 uppercase block">CORE ARCHITECTURE</span>
                    <p className="text-emerald-300 text-[11px]">{p.architecture}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                  <div className="flex gap-2">
                    <a
                      href={p.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-400 hover:text-white flex items-center gap-1 text-[11px]"
                    >
                      <Github className="w-3 h-3" />
                      <span>Code</span>
                    </a>
                    <a
                      href={p.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>System Specs</span>
                    </a>
                  </div>
                  <span className="text-zinc-500 text-[10px]">{p.technologies.join(', ')}</span>
                </div>
              </div>
            ))}
          </div>

          <Pagination
            currentPage={projPage}
            totalPages={projTotalPages}
            totalItems={projects.length}
            pageSize={projPageSize}
            onPageChange={setProjPage}
            itemLabel="projects"
          />
        </div>
      )}

      {/* MODAL: Add Experience */}
      {addExpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Add STAR War Story
              </h3>
              <button onClick={() => setAddExpModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-zinc-400 block mb-1">Story Title *:</label>
                <input
                  type="text"
                  placeholder="e.g. Tiered WAL Replication Failure at 150k TPS"
                  value={newExp.title}
                  onChange={(e) => setNewExp({ ...newExp, title: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Project Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Core Ledger"
                  value={newExp.project}
                  onChange={(e) => setNewExp({ ...newExp, project: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Problem (Situation):</label>
                <textarea
                  rows={2}
                  placeholder="What was broken or hitting limits?"
                  value={newExp.problem}
                  onChange={(e) => setNewExp({ ...newExp, problem: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Architectural Solution (Action):</label>
                <textarea
                  rows={2}
                  placeholder="How did you solve it technically?"
                  value={newExp.solution}
                  onChange={(e) => setNewExp({ ...newExp, solution: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 resize-none"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Quantitative Result:</label>
                <input
                  type="text"
                  placeholder="e.g. Reduced tail latency from 84ms to 12ms"
                  value={newExp.result}
                  onChange={(e) => setNewExp({ ...newExp, result: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setAddExpModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewExp}
                disabled={isSaving || !newExp.title}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Save War Story</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE EXPERIENCE MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(expToDelete)}
        onClose={() => setExpToDelete(null)}
        onConfirm={handleConfirmDeleteExp}
        title="Delete STAR Experience"
        itemName={expToDelete?.title}
        description="Are you sure you want to permanently delete this engineering war story from your vault?"
        isDeleting={isDeleting}
      />

      {/* CONFIRM DELETE PROJECT MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(projToDelete)}
        onClose={() => setProjToDelete(null)}
        onConfirm={handleConfirmDeleteProj}
        title="Delete Architecture Project"
        itemName={projToDelete?.name}
        description="Are you sure you want to permanently delete this architecture project from your repository?"
        isDeleting={isDeleting}
      />
    </div>
  );
}
