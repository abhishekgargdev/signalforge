'use client';

import React from 'react';
import { X, Check, Bell, ExternalLink, Zap, MessageSquare, TrendingUp } from 'lucide-react';
import { INITIAL_NOTIFICATIONS } from '@/lib/signalforge-data';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (module: string) => void;
}

export function NotificationDrawer({ isOpen, onClose, onNavigate }: NotificationDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end animate-in fade-in">
      <div className="w-full max-w-sm bg-[#080c08] border-l border-[#22c55e]/30 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#22c55e]" />
            <h3 className="font-bold text-sm text-emerald-300">Live Signal Feed & Alerts</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {INITIAL_NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="p-3 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 space-y-2 hover:border-[#22c55e]/40 transition"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="font-semibold text-xs text-slate-200">{n.title}</span>
                <span className="text-[10px] font-mono text-zinc-500">{n.timestamp}</span>
              </div>
              <p className="text-xs text-zinc-400 leading-snug">{n.message}</p>
              <div className="flex items-center justify-between pt-1 border-t border-white/5">
                <span className="text-[10px] font-mono uppercase text-[#f59e0b]">{n.type}</span>
                <button
                  onClick={() => {
                    const mod = n.link.replace('/', '');
                    onNavigate(mod);
                    onClose();
                  }}
                  className="text-xs text-[#22c55e] hover:underline flex items-center gap-1 font-mono"
                >
                  <span>Open Signal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between text-xs text-zinc-400">
          <span>All signals verified</span>
          <button className="text-emerald-400 hover:underline">Mark all read</button>
        </div>
      </div>
    </div>
  );
}
