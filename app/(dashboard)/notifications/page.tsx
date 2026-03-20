'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, ExternalLink, Check } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '@/lib/signalforge-data';

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-[#22c55e]/20 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Bell className="w-5 h-5 text-[#22c55e]" />
            Notification Intelligence Feed
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time radar triggers, publication milestones, and engagement alerts.
          </p>
        </div>
        <button className="text-xs font-mono text-[#22c55e] hover:underline">
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {INITIAL_NOTIFICATIONS.map((n) => (
          <div
            key={n.id}
            className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 flex items-center justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs text-slate-200">{n.title}</span>
                <span className="text-[10px] font-mono text-[#f59e0b] uppercase">{n.type}</span>
              </div>
              <p className="text-xs text-zinc-400 mt-1">{n.message}</p>
              <span className="text-[10px] font-mono text-zinc-500 mt-1 block">{n.timestamp}</span>
            </div>

            <Link
              href={n.link}
              className="px-3 py-1.5 rounded bg-[#22c55e]/15 border border-[#22c55e]/30 text-emerald-300 text-xs font-mono hover:bg-[#22c55e]/25 transition flex items-center gap-1 flex-shrink-0"
            >
              <span>Inspect</span>
              <ExternalLink className="w-3 h-3" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
