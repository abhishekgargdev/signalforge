'use client';

import React from 'react';
import {
  Target,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Building,
  CheckCircle2,
  ArrowRight,
  Shield
} from 'lucide-react';
import { CareerGoal } from '@/lib/signalforge-data';

interface CareerViewProps {
  career: CareerGoal;
  onNavigateToContent: () => void;
}

export function CareerView({ career, onNavigateToContent }: CareerViewProps) {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Career Signals & Market Technology Alignment
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Bridge your engineering background with frontier systems demands at target tech organizations.
          </p>
        </div>

        <span className="text-xs font-mono text-emerald-400 bg-[#0e1710] px-3 py-1.5 rounded-lg border border-[#22c55e]/20">
          Target role: {career.targetRole || 'Not set'}
        </span>
      </div>

      {/* Target Focus Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Target Trajectory
          </span>
          <div className="font-bold text-sm text-slate-100">{career.targetRole}</div>
          <div className="text-xs text-zinc-400 font-mono">{career.experienceLevel}</div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Target Companies
          </span>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {career.targetCompanies.length === 0 ? (
              <span className="text-xs text-zinc-500">Add target companies in Settings or Companies.</span>
            ) : (
              career.targetCompanies.map((c) => (
                <span key={c} className="text-xs font-mono px-2 py-0.5 rounded bg-black/50 text-emerald-300 border border-[#22c55e]/20">
                  {c}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-2">
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">
            Strategy Objective
          </span>
          <p className="text-xs text-zinc-300 leading-snug">
            Define how you want to position your expertise for inbound outreach.
          </p>
        </div>
      </div>

      {/* Rising Skills & Demand Analysis */}
      <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-4">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300 font-mono flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22c55e]" />
            High-Velocity Skill Alignment Matrix
          </h3>
          <span className="text-[10px] font-mono text-zinc-500">From your saved career profile</span>
        </div>

        <div className="space-y-3">
          {career.risingSkills.length === 0 && (
            <p className="text-xs text-zinc-500 font-mono p-4 text-center border border-white/5 rounded-lg">
              No skill alignment data yet.
            </p>
          )}
          {career.risingSkills.map((sk, i) => (
            <div key={i} className="p-3.5 rounded-lg bg-black/40 border border-white/5 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-200">{sk.name}</span>
                <div className="flex items-center gap-2 font-mono">
                  <span className={`text-[10px] px-2 py-0.5 rounded ${
                    sk.demand === 'Surging' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-zinc-900 text-zinc-400'
                  }`}>
                    {sk.demand} Demand
                  </span>
                  <span className="font-bold text-emerald-400">{sk.matchPercent}% Match</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-1.5 rounded-full bg-zinc-800 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-600 to-[#22c55e] rounded-full"
                  style={{ width: `${sk.matchPercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Skill Gaps & Strategic Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Identified Skill Gaps */}
        <div className="p-5 rounded-xl bg-[#0e1710] border border-amber-500/20 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-[#f59e0b] font-mono flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
            Identified Exploration Frontiers (Not Deficiencies)
          </h3>
          <p className="text-xs text-zinc-400">
            Target teams value transparency on emerging topics you are actively exploring:
          </p>
          <div className="space-y-2">
            {career.skillGaps.length === 0 && (
              <p className="text-xs text-zinc-500 font-mono">No exploration topics listed.</p>
            )}
            {career.skillGaps.map((gap, i) => (
              <div key={i} className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-slate-300">
                • {gap}
              </div>
            ))}
          </div>
        </div>

        {/* Content Strategy Recommendations */}
        <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3">
          <h3 className="font-bold text-xs uppercase tracking-wider text-emerald-300 font-mono flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-[#22c55e]" />
            Authority-Building Content Strategy
          </h3>
          <p className="text-xs text-zinc-400">
            Publish these exact angles to close domain perception gaps:
          </p>
          <div className="space-y-2">
            {career.recommendedAngles.length === 0 && (
              <p className="text-xs text-zinc-500 font-mono">Add content angles as you define your strategy.</p>
            )}
            {career.recommendedAngles.map((ang, i) => (
              <div
                key={i}
                onClick={onNavigateToContent}
                className="p-3 rounded-lg bg-black/40 border border-white/5 text-xs text-emerald-300 hover:border-[#22c55e]/40 transition cursor-pointer flex items-center justify-between group"
              >
                <span>{ang}</span>
                <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition flex-shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
