'use client';

import React from 'react';
import { RefreshCw } from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

interface SkeletonCardProps {
  count?: number;
}

export function SkeletonCard({ count = 3 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4 animate-pulse"
        >
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 w-3/4">
              <div className="w-11 h-11 rounded-xl bg-zinc-800/80 flex-shrink-0" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-zinc-700/80 rounded w-3/5" />
                <div className="h-3 bg-zinc-800/80 rounded w-2/5" />
              </div>
            </div>
            <div className="w-14 h-5 bg-zinc-800/80 rounded-full" />
          </div>

          {/* Hiring badge / tag placeholder */}
          <div className="h-6 bg-zinc-800/50 rounded w-4/5" />

          {/* Tags */}
          <div className="flex gap-2">
            <div className="h-4 bg-zinc-800/80 rounded w-16" />
            <div className="h-4 bg-zinc-800/80 rounded w-20" />
            <div className="h-4 bg-zinc-800/80 rounded w-14" />
          </div>

          {/* Body quote */}
          <div className="space-y-1.5 p-3 rounded bg-black/40 border border-white/5">
            <div className="h-3 bg-zinc-800/80 rounded w-full" />
            <div className="h-3 bg-zinc-800/80 rounded w-4/5" />
          </div>

          {/* Footer action buttons */}
          <div className="pt-3 border-t border-white/5 flex items-center justify-between">
            <div className="h-4 bg-zinc-800/80 rounded w-24" />
            <div className="flex gap-2">
              <div className="h-7 bg-zinc-800/80 rounded w-16" />
              <div className="h-7 bg-zinc-800/80 rounded w-20" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}

export function SkeletonTableRow({ count = 4, cols = 5 }: { count?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <tr key={i} className="animate-pulse border-b border-zinc-800/40">
          {Array.from({ length: cols }).map((_, c) => (
            <td key={c} className="py-3.5 px-3">
              <div
                className="h-3.5 bg-zinc-800/80 rounded"
                style={{ width: `${Math.max(40, 100 - c * 15)}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

export function SkeletonPostDetail() {
  return (
    <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-4 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="h-4 bg-zinc-700/80 rounded w-48" />
        <div className="h-4 bg-zinc-800/80 rounded w-28" />
      </div>
      <div className="h-16 bg-black/50 rounded-lg border border-white/5" />
      <div className="grid grid-cols-3 gap-2">
        <div className="h-14 bg-zinc-800/50 rounded-lg" />
        <div className="h-14 bg-zinc-800/50 rounded-lg" />
        <div className="h-14 bg-zinc-800/50 rounded-lg" />
      </div>
      <div className="h-28 bg-black/60 rounded-lg border border-white/10" />
    </div>
  );
}

export function ApiSpinner({ label = 'Processing...' }: { label?: string }) {
  return (
    <div className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400">
      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#22c55e]" />
      <span>{label}</span>
    </div>
  );
}

export function TopProgress({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <div className="fixed top-0 inset-x-0 z-[80] h-1 bg-emerald-950/80 overflow-hidden">
      <div className="sf-bar h-full w-1/3 bg-[#22c55e]" />
    </div>
  );
}

export function PageLoader({ message = 'Loading SignalForge...' }: { message?: string }) {
  return (
    <div className="min-h-[50vh] flex items-center justify-center p-8 font-mono">
      <div className="text-center space-y-3">
        <div className="w-12 h-12 rounded-xl bg-[#0e1710] border border-[#22c55e]/40 flex items-center justify-center mx-auto shadow-lg shadow-[#22c55e]/15">
          <BrandMark size={28} className="animate-pulse" />
        </div>
        <div className="text-xs text-emerald-400">{message}</div>
        <div className="w-48 h-1 bg-zinc-800 rounded-full mx-auto overflow-hidden">
          <div className="sf-bar h-full w-1/2 bg-[#22c55e]" />
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading page">
      <div className="space-y-2 border-b border-[#22c55e]/20 pb-4">
        <div className="h-6 w-64 bg-zinc-800/80 rounded animate-pulse" />
        <div className="h-3 w-96 max-w-full bg-zinc-800/60 rounded animate-pulse" />
      </div>
      <div className="flex gap-2">
        <div className="h-8 w-24 bg-zinc-800/80 rounded-lg animate-pulse" />
        <div className="h-8 w-28 bg-zinc-800/60 rounded-lg animate-pulse" />
        <div className="h-8 w-20 bg-zinc-800/60 rounded-lg animate-pulse" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SkeletonCard count={4} />
      </div>
    </div>
  );
}

export function GlobalPageLoader({ message = 'Loading SignalForge Workspace...' }: { message?: string }) {
  return <PageLoader message={message} />;
}
