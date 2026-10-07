'use client';

import React from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export function NotificationDrawer({ isOpen, onClose }: NotificationDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-sm bg-[#080c08] border-l border-[#22c55e]/30 h-full flex flex-col justify-between shadow-2xl">
        <div className="p-4 border-b border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#22c55e]" />
            <h3 className="font-bold text-sm text-emerald-300">Signal Feed & Alerts</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-zinc-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex items-center justify-center">
          <p className="text-xs text-zinc-500 font-mono text-center max-w-[240px] leading-relaxed">
            No alerts yet. Notifications appear when you add signals, content, or engagement activity.
          </p>
        </div>

        <div className="p-3 border-t border-[#22c55e]/20 bg-[#0e1710] text-xs text-zinc-500 font-mono text-center">
          Feed updates from your workspace data
        </div>
      </div>
    </div>
  );
}
