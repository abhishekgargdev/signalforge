'use client';

import React, { useState } from 'react';
import {
  Building2,
  Users,
  Search,
  ExternalLink,
  Plus,
  Target,
  Sparkles,
  MessageSquareQuote,
  Shield,
  Briefcase,
  Edit,
  Trash2,
  Eye,
  Check,
  RefreshCw,
  X,
  MapPin
} from 'lucide-react';
import { TargetCompany, TargetPerson } from '@/lib/signalforge-data';
import { SkeletonCard, SkeletonTableRow, ApiSpinner } from '@/components/ui/SkeletonLoader';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';
import { Pagination } from '@/components/ui/Pagination';

interface CompaniesViewProps {
  companies: TargetCompany[];
  people: TargetPerson[];
  onNavigateToEngagement: () => void;
}

export function CompaniesView({
  companies: initialCompanies,
  people: initialPeople,
  onNavigateToEngagement
}: CompaniesViewProps) {
  const [companies, setCompanies] = useState<TargetCompany[]>(initialCompanies);
  const [people, setPeople] = useState<TargetPerson[]>(initialPeople);
  const [activeTab, setActiveTab] = useState<'companies' | 'people'>('companies');
  const [tierFilter, setTierFilter] = useState<'All' | 'Tier 1' | 'Tier 2'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<TargetCompany | null>(initialCompanies[0] || null);

  // Pagination states
  const [companiesPage, setCompaniesPage] = useState<number>(1);
  const [companiesPageSize, setCompaniesPageSize] = useState<number>(4);

  const [peoplePage, setPeoplePage] = useState<number>(1);
  const [peoplePageSize, setPeoplePageSize] = useState<number>(5);

  // Modals state
  const [viewCompanyModal, setViewCompanyModal] = useState<TargetCompany | null>(null);
  const [editCompanyModal, setEditCompanyModal] = useState<TargetCompany | null>(null);
  const [addCompanyModalOpen, setAddCompanyModalOpen] = useState<boolean>(false);
  const [companyToDelete, setCompanyToDelete] = useState<TargetCompany | null>(null);

  const [viewPersonModal, setViewPersonModal] = useState<TargetPerson | null>(null);
  const [editPersonModal, setEditPersonModal] = useState<TargetPerson | null>(null);
  const [addPersonModalOpen, setAddPersonModalOpen] = useState<boolean>(false);
  const [personToDelete, setPersonToDelete] = useState<TargetPerson | null>(null);

  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Add Company Form State
  const [newCompany, setNewCompany] = useState<Partial<TargetCompany>>({
    name: '',
    industry: 'Cloud Infrastructure & AI',
    priority: 'Tier 1',
    headquarters: 'San Francisco, CA',
    technologies: ['Distributed Systems', 'Kubernetes', 'Go'],
    description: '',
    openRolesCount: 5,
    recentSignalCount: 2,
    engagementCount: 0,
    targetRoles: ['Staff Systems Engineer'],
    signals: [],
  });
  const [techTagInput, setTechTagInput] = useState('');

  // Add Person Form State
  const [newPerson, setNewPerson] = useState<Partial<TargetPerson>>({
    name: '',
    company: 'Google',
    role: 'Staff Systems Engineer',
    priority: 'High',
    relationshipStatus: 'New',
    topics: ['Distributed Systems'],
    engagementCount: 0,
    lastInteraction: 'None',
    notes: '',
    profileUrl: 'https://linkedin.com/in/',
  });

  // Filter companies
  const filteredCompanies = companies.filter((c) => {
    const matchesTier = tierFilter === 'All' || c.priority === tierFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.industry.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.technologies.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTier && matchesSearch;
  });

  // Filter people
  const filteredPeople = people.filter((p) => {
    return (
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topics.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  // Pagination calculations
  const companiesTotalPages = Math.ceil(filteredCompanies.length / companiesPageSize) || 1;
  const paginatedCompanies = filteredCompanies.slice(
    (companiesPage - 1) * companiesPageSize,
    companiesPage * companiesPageSize
  );

  const peopleTotalPages = Math.ceil(filteredPeople.length / peoplePageSize) || 1;
  const paginatedPeople = filteredPeople.slice(
    (peoplePage - 1) * peoplePageSize,
    peoplePage * peoplePageSize
  );

  // Delete Company
  const handleConfirmDeleteCompany = async () => {
    if (!companyToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const remaining = companies.filter((c) => c.id !== companyToDelete.id);
      setCompanies(remaining);
      if (selectedCompany?.id === companyToDelete.id) {
        setSelectedCompany(remaining[0] || null);
      }
      setCompanyToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Delete Person
  const handleConfirmDeletePerson = async () => {
    if (!personToDelete) return;
    setIsDeleting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      setPeople((prev) => prev.filter((p) => p.id !== personToDelete.id));
      setPersonToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Save New Company
  const handleSaveNewCompany = async () => {
    if (!newCompany.name) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const created: TargetCompany = {
        id: `comp-${Date.now()}`,
        name: newCompany.name,
        logo: '',
        industry: newCompany.industry || 'Tech',
        priority: newCompany.priority || 'Tier 1',
        technologies: newCompany.technologies || ['Distributed Systems'],
        recentSignalCount: newCompany.recentSignalCount || 1,
        engagementCount: 0,
        headquarters: newCompany.headquarters || 'Remote',
        targetRoles: newCompany.targetRoles || ['Staff Software Engineer'],
        description: newCompany.description || `${newCompany.name} engineering organization.`,
        openRolesCount: newCompany.openRolesCount || 4,
        signals: [
          {
            title: `Infrastructure architecture initiative at ${newCompany.name}`,
            date: 'Today',
            relevance: 'High',
          },
        ],
      };
      setCompanies([created, ...companies]);
      setSelectedCompany(created);
      setAddCompanyModalOpen(false);
      setNewCompany({
        name: '',
        industry: 'Cloud Infrastructure & AI',
        priority: 'Tier 1',
        headquarters: 'San Francisco, CA',
        technologies: ['Distributed Systems', 'Kubernetes'],
        description: '',
        openRolesCount: 5,
        recentSignalCount: 2,
        engagementCount: 0,
        targetRoles: ['Staff Systems Engineer'],
        signals: [],
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edited Company
  const handleSaveEditCompany = async () => {
    if (!editCompanyModal) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setCompanies((prev) =>
        prev.map((c) => (c.id === editCompanyModal.id ? editCompanyModal : c))
      );
      if (selectedCompany?.id === editCompanyModal.id) {
        setSelectedCompany(editCompanyModal);
      }
      setEditCompanyModal(null);
    } finally {
      setIsSaving(false);
    }
  };

  // Save New Person
  const handleSaveNewPerson = async () => {
    if (!newPerson.name) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      const created: TargetPerson = {
        id: `person-${Date.now()}`,
        name: newPerson.name,
        company: newPerson.company || 'Tech Company',
        role: newPerson.role || 'Engineering Lead',
        avatar: '',
        profileUrl: newPerson.profileUrl || 'https://linkedin.com/in/',
        topics: newPerson.topics || ['Distributed Systems'],
        priority: newPerson.priority || 'High',
        lastInteraction: 'Initial Discovery',
        engagementCount: 0,
        notes: newPerson.notes || '',
        relationshipStatus: newPerson.relationshipStatus || 'New',
      };
      setPeople([created, ...people]);
      setAddPersonModalOpen(false);
      setNewPerson({
        name: '',
        company: 'Google',
        role: 'Staff Systems Engineer',
        priority: 'High',
        relationshipStatus: 'New',
        topics: ['Distributed Systems'],
        engagementCount: 0,
        lastInteraction: 'None',
        notes: '',
        profileUrl: 'https://linkedin.com/in/',
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Save Edited Person
  const handleSaveEditPerson = async () => {
    if (!editPersonModal) return;
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 400));
      setPeople((prev) =>
        prev.map((p) => (p.id === editPersonModal.id ? editPersonModal : p))
      );
      setEditPersonModal(null);
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
            <Building2 className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">Target Companies & Decision Makers</h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Monitor target engineering organizations, hiring signals, and leadership engagement histories.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {activeTab === 'companies' ? (
            <button
              onClick={() => setAddCompanyModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Company</span>
            </button>
          ) : (
            <button
              onClick={() => setAddPersonModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Add Key Person</span>
            </button>
          )}

          <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
            <button
              onClick={() => {
                setActiveTab('companies');
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'companies' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Companies ({companies.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('people');
                setSearchQuery('');
              }}
              className={`px-3 py-1 rounded transition ${
                activeTab === 'people' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Key People ({people.length})
            </button>
          </div>
        </div>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCompaniesPage(1);
              setPeoplePage(1);
            }}
            placeholder={activeTab === 'companies' ? 'Search company or tech stack...' : 'Search person or role...'}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#0e1710] border border-[#22c55e]/30 rounded-lg text-emerald-200 placeholder-zinc-500 focus:outline-none focus:border-[#22c55e] font-mono"
          />
        </div>

        {activeTab === 'companies' && (
          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-zinc-500">Tier:</span>
            {['All', 'Tier 1', 'Tier 2'].map((tier) => (
              <button
                key={tier}
                onClick={() => {
                  setTierFilter(tier as any);
                  setCompaniesPage(1);
                }}
                className={`px-2.5 py-1 rounded border transition ${
                  tierFilter === tier
                    ? 'bg-[#22c55e]/20 text-emerald-300 border-[#22c55e]'
                    : 'bg-black/40 text-zinc-400 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* TAB 1: Companies Grid + Detailed Dossier */}
      {activeTab === 'companies' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Companies Column with Pagination */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block">
                Tracked Organizations
              </span>
              <span className="text-zinc-500 text-[10px]">
                {filteredCompanies.length} organizations
              </span>
            </div>

            {paginatedCompanies.length === 0 ? (
              <div className="p-8 text-center bg-[#0e1710] border border-white/5 rounded-xl text-zinc-500 font-mono text-xs">
                No organizations match your query. Click &quot;Add Company&quot; to register a new one.
              </div>
            ) : (
              paginatedCompanies.map((c) => {
                const isSelected = selectedCompany?.id === c.id;
                return (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCompany(c)}
                    className={`p-4 rounded-xl border transition cursor-pointer space-y-2 group relative ${
                      isSelected
                        ? 'bg-[#0e1710] border-[#22c55e] ring-1 ring-[#22c55e]'
                        : 'bg-[#080c08] border-[#22c55e]/20 hover:border-[#22c55e]/40'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-xs text-slate-100">{c.name}</h3>
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                              c.priority === 'Tier 1'
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                                : 'bg-black text-[#f59e0b] border border-[#f59e0b]/40'
                            }`}
                          >
                            {c.priority}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-400 mt-0.5">{c.industry}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewCompanyModal(c);
                          }}
                          className="p-1 text-zinc-500 hover:text-emerald-300 opacity-0 group-hover:opacity-100 transition"
                          title="View Company Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditCompanyModal(c);
                          }}
                          className="p-1 text-zinc-500 hover:text-amber-300 opacity-0 group-hover:opacity-100 transition"
                          title="Edit Company"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCompanyToDelete(c);
                          }}
                          className="p-1 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition"
                          title="Delete Company"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-1 border-t border-white/5">
                      <span>{c.recentSignalCount} active signals</span>
                      <span className="text-emerald-400">{c.openRolesCount} open roles</span>
                    </div>
                  </div>
                );
              })
            )}

            {/* Pagination for Companies */}
            <Pagination
              currentPage={companiesPage}
              totalPages={companiesTotalPages}
              totalItems={filteredCompanies.length}
              pageSize={companiesPageSize}
              onPageChange={setCompaniesPage}
              itemLabel="companies"
            />
          </div>

          {/* Detailed Selected Company Dossier */}
          {selectedCompany && (
            <div className="lg:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4">
                <div className="flex items-start justify-between border-b border-white/10 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-base font-bold text-slate-100">{selectedCompany.name}</h2>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                        {selectedCompany.priority}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1 flex items-center gap-2 font-mono">
                      <span>{selectedCompany.industry}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-zinc-500" />
                        {selectedCompany.headquarters}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditCompanyModal(selectedCompany)}
                      className="px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-mono flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={onNavigateToEngagement}
                      className="px-3 py-1 rounded-lg bg-[#22c55e] text-black font-extrabold text-xs hover:bg-emerald-400 transition"
                    >
                      Engage Posts →
                    </button>
                  </div>
                </div>

                <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                  {selectedCompany.description}
                </p>

                {/* Tech Stack */}
                <div className="space-y-1.5 font-mono text-xs">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                    Core Engineering Stack:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCompany.technologies.map((t) => (
                      <span
                        key={t}
                        className="px-2 py-0.5 rounded bg-black/60 text-emerald-300 border border-[#22c55e]/20 text-[11px]"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Signals Timeline */}
                <div className="space-y-2 pt-2 border-t border-white/5 font-mono text-xs">
                  <span className="text-zinc-500 text-[10px] uppercase tracking-wider block">
                    Recent Architectural Signals:
                  </span>
                  <div className="space-y-2">
                    {selectedCompany.signals.map((sig, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg bg-black/40 border border-white/5 flex items-center justify-between"
                      >
                        <span className="text-slate-200 text-[11px] truncate">{sig.title}</span>
                        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                          <span className="text-[10px] text-zinc-500">{sig.date}</span>
                          <span className="text-[10px] text-[#f59e0b] font-bold">{sig.relevance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Key People Table with Pagination and Actions */}
      {activeTab === 'people' && (
        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4 font-mono text-xs">
          <div className="flex items-center justify-between border-b border-white/5 pb-2">
            <span className="font-bold text-slate-100 uppercase tracking-wider text-[11px]">
              Key Engineering Decision Makers ({filteredPeople.length})
            </span>
            <span className="text-zinc-500 text-[10px]">
              Monitored for Outreach & Commentary
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase text-[10px]">
                  <th className="py-2 px-3">Name</th>
                  <th className="py-2 px-3">Company & Role</th>
                  <th className="py-2 px-3">Topics</th>
                  <th className="py-2 px-3">Status</th>
                  <th className="py-2 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {paginatedPeople.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-zinc-500">
                      No decision makers match current query.
                    </td>
                  </tr>
                ) : (
                  paginatedPeople.map((p) => (
                    <tr key={p.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3 font-semibold text-slate-100">
                        <div className="flex items-center gap-2">
                          <span>{p.name}</span>
                          {p.profileUrl && !p.profileUrl.endsWith('/in/') && (
                            <a
                              href={p.profileUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[#0077b5] hover:text-sky-300"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-zinc-300">
                        <span className="text-emerald-400 font-semibold">{p.company}</span> • {p.role}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-wrap gap-1">
                          {p.topics.map((t) => (
                            <span
                              key={t}
                              className="px-1.5 py-0.2 rounded bg-black border border-zinc-800 text-[10px] text-zinc-400"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                          {p.relationshipStatus}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-right space-x-1.5">
                        <button
                          onClick={() => setViewPersonModal(p)}
                          className="p-1 text-zinc-400 hover:text-emerald-300 transition"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setEditPersonModal(p)}
                          className="p-1 text-zinc-400 hover:text-amber-300 transition"
                          title="Edit Person"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setPersonToDelete(p)}
                          className="p-1 text-zinc-400 hover:text-red-400 transition"
                          title="Delete Person"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* People Pagination */}
          <Pagination
            currentPage={peoplePage}
            totalPages={peopleTotalPages}
            totalItems={filteredPeople.length}
            pageSize={peoplePageSize}
            onPageChange={setPeoplePage}
            itemLabel="decision makers"
          />
        </div>
      )}

      {/* MODAL: Add Company */}
      {addCompanyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Add Target Organization
              </h3>
              <button onClick={() => setAddCompanyModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Company Name *:</label>
                  <input
                    type="text"
                    placeholder="e.g. Snowflake"
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Tier Priority:</label>
                  <select
                    value={newCompany.priority}
                    onChange={(e) => setNewCompany({ ...newCompany, priority: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Tier 1">Tier 1 (FAANG / Frontier)</option>
                    <option value="Tier 2">Tier 2 (High-Growth Infra)</option>
                    <option value="Tier 3">Tier 3 (Emerging)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Industry / Sector:</label>
                <input
                  type="text"
                  placeholder="e.g. Distributed Database Engine"
                  value={newCompany.industry}
                  onChange={(e) => setNewCompany({ ...newCompany, industry: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description:</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of the company and systems architecture..."
                  value={newCompany.description}
                  onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setAddCompanyModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewCompany}
                disabled={isSaving || !newCompany.name}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Company</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Edit Company */}
      {editCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Edit className="w-4 h-4 text-[#22c55e]" />
                Edit Company: {editCompanyModal.name}
              </h3>
              <button onClick={() => setEditCompanyModal(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Company Name:</label>
                  <input
                    type="text"
                    value={editCompanyModal.name}
                    onChange={(e) => setEditCompanyModal({ ...editCompanyModal, name: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Tier Priority:</label>
                  <select
                    value={editCompanyModal.priority}
                    onChange={(e) => setEditCompanyModal({ ...editCompanyModal, priority: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="Tier 1">Tier 1</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Industry:</label>
                <input
                  type="text"
                  value={editCompanyModal.industry}
                  onChange={(e) => setEditCompanyModal({ ...editCompanyModal, industry: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Description:</label>
                <textarea
                  rows={3}
                  value={editCompanyModal.description}
                  onChange={(e) => setEditCompanyModal({ ...editCompanyModal, description: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-slate-200 focus:outline-none focus:border-[#22c55e] resize-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setEditCompanyModal(null)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEditCompany}
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

      {/* MODAL: View Company Dossier */}
      {viewCompanyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                  {viewCompanyModal.name}
                  <span className="px-2 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px]">
                    {viewCompanyModal.priority}
                  </span>
                </h3>
                <p className="text-zinc-400 text-xs mt-0.5">{viewCompanyModal.industry} • {viewCompanyModal.headquarters}</p>
              </div>
              <button onClick={() => setViewCompanyModal(null)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <p className="text-zinc-300 leading-relaxed font-sans">{viewCompanyModal.description}</p>
              <div>
                <span className="text-zinc-500 text-[10px] uppercase block mb-1">TECH STACK</span>
                <div className="flex flex-wrap gap-1">
                  {viewCompanyModal.technologies.map((t) => (
                    <span key={t} className="px-2 py-0.5 rounded bg-black border border-[#22c55e]/30 text-emerald-300 text-[10px]">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-end">
              <button
                onClick={() => setViewCompanyModal(null)}
                className="px-4 py-1.5 rounded bg-zinc-800 text-slate-200 hover:bg-zinc-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add Key Person */}
      {addPersonModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl p-6 space-y-4 font-mono text-xs text-slate-200">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-extrabold text-sm text-slate-100 flex items-center gap-2">
                <Plus className="w-4 h-4 text-[#22c55e]" />
                Add Decision Maker
              </h3>
              <button onClick={() => setAddPersonModalOpen(false)} className="text-zinc-400 hover:text-white">✕</button>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Name *:</label>
                  <input
                    type="text"
                    placeholder="e.g. Jeff Dean"
                    value={newPerson.name}
                    onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Company *:</label>
                  <input
                    type="text"
                    placeholder="e.g. Google"
                    value={newPerson.company}
                    onChange={(e) => setNewPerson({ ...newPerson, company: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 block mb-1">Role Title:</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Director of Systems"
                    value={newPerson.role}
                    onChange={(e) => setNewPerson({ ...newPerson, role: e.target.value })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  />
                </div>
                <div>
                  <label className="text-zinc-400 block mb-1">Relationship Status:</label>
                  <select
                    value={newPerson.relationshipStatus}
                    onChange={(e) => setNewPerson({ ...newPerson, relationshipStatus: e.target.value as any })}
                    className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
                  >
                    <option value="New">New</option>
                    <option value="Following">Following</option>
                    <option value="Engaged">Engaged</option>
                    <option value="Connected">Connected</option>
                    <option value="Active Dialogue">Active Dialogue</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">LinkedIn Profile URL:</label>
                <input
                  type="text"
                  placeholder="https://linkedin.com/in/username"
                  value={newPerson.profileUrl}
                  onChange={(e) => setNewPerson({ ...newPerson, profileUrl: e.target.value })}
                  className="w-full p-2 rounded bg-black/60 border border-zinc-700 text-sky-300 focus:outline-none focus:border-[#22c55e]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/5">
              <button
                onClick={() => setAddPersonModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-900 text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewPerson}
                disabled={isSaving || !newPerson.name}
                className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-extrabold hover:bg-emerald-400 disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                <span>Add Person</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE COMPANY MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(companyToDelete)}
        onClose={() => setCompanyToDelete(null)}
        onConfirm={handleConfirmDeleteCompany}
        title="Delete Tracked Organization"
        itemName={companyToDelete?.name}
        description="Are you sure you want to permanently delete this organization? All monitored signals, role alignment data, and associated leader notes will be purged."
        isDeleting={isDeleting}
      />

      {/* CONFIRM DELETE PERSON MODAL */}
      <ConfirmDeleteModal
        isOpen={Boolean(personToDelete)}
        onClose={() => setPersonToDelete(null)}
        onConfirm={handleConfirmDeletePerson}
        title="Delete Decision Maker"
        itemName={personToDelete ? `${personToDelete.name} (${personToDelete.company})` : ''}
        description="Are you sure you want to permanently delete this contact from your relationship pipeline?"
        isDeleting={isDeleting}
      />
    </div>
  );
}
