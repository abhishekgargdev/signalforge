'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ArrowLeft } from 'lucide-react';

export default function NewCompanyPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('');
  const [priority, setPriority] = useState<'Tier 1' | 'Tier 2' | 'Tier 3'>('Tier 1');
  const [technologies, setTechnologies] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/companies');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Companies</span>
        </button>
      </div>

      <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-4 text-xs font-mono">
        <h1 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#22c55e]" />
          Track New Engineering Organization
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-zinc-400 block mb-1">Company Name:</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Company name"
              className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Industry / Domain:</label>
            <input
              type="text"
              required
              value={industry}
              onChange={(e) => setIndustry(e.target.value)}
              placeholder="Industry or focus area"
              className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none focus:border-[#22c55e]"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Priority Tier:</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as any)}
              className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-slate-200 focus:outline-none"
            >
              <option value="Tier 1">Tier 1 (High Recruitment Interest)</option>
              <option value="Tier 2">Tier 2 (Moderate Tracking)</option>
              <option value="Tier 3">Tier 3 (Passive Monitoring)</option>
            </select>
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Core Technologies (comma-separated):</label>
            <input
              type="text"
              value={technologies}
              onChange={(e) => setTechnologies(e.target.value)}
              placeholder="PyTorch, Triton, Kubernetes, Rust"
              className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none"
            />
          </div>

          <div>
            <label className="text-zinc-400 block mb-1">Target Mission & Description:</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe why this team is strategic for your career signals..."
              className="w-full p-2.5 rounded bg-black/60 border border-[#22c55e]/30 text-emerald-200 focus:outline-none"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-2.5 rounded-lg bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition"
            >
              Add Company to Radar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
