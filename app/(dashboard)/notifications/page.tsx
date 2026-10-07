'use client';

import React from 'react';
import { Bell } from 'lucide-react';

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
            Radar triggers, publication milestones, and engagement alerts.
          </p>
        </div>
      </div>

      <div className="p-12 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 text-center">
        <p className="text-sm text-zinc-400 font-mono">No notifications</p>
        <p className="text-xs text-zinc-500 mt-2 max-w-md mx-auto">
          When your workspace has activity, items will show here without sample or demo entries.
        </p>
      </div>
    </div>
  );
}
