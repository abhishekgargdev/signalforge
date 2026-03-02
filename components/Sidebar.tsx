'use client';

import React from 'react';
import {
  LayoutDashboard,
  Building2,
  MessageSquareQuote,
  Kanban,
  FileText,
  Image as ImageIcon,
  BrainCircuit,
  Target,
  Settings,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  CalendarDays,
  Hash
} from 'lucide-react';
import { BrandMark } from '@/components/BrandMark';

interface SidebarProps {
  currentModule: string;
  onSelectModule: (module: string) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({
  currentModule,
  onSelectModule,
  collapsed,
  onToggleCollapse,
}: SidebarProps) {
  const mainNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'content', label: 'Content Pipeline', icon: Kanban },
    { id: 'articles', label: 'Technical Articles', icon: FileText },
    { id: 'topics', label: 'Topics', icon: Hash },
    { id: 'companies', label: 'Target Companies', icon: Building2 },
    { id: 'occasions', label: 'Occasions', icon: CalendarDays },
    { id: 'prospector', label: 'Connections', icon: UserPlus },
    { id: 'engagement', label: 'Comments', icon: MessageSquareQuote },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'knowledge', label: 'Experience Vault', icon: BrainCircuit },
    { id: 'career', label: 'Career Signals', icon: Target },
  ];

  return (
    <aside
      className={`border-r border-[#22c55e]/20 bg-[#080c08] transition-all duration-300 flex flex-col justify-between flex-shrink-0 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Top Brand & Workspace */}
      <div>
        <div className="h-14 border-b border-[#22c55e]/20 px-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <BrandMark size={32} className="rounded-lg flex-shrink-0 shadow-sm shadow-[#22c55e]/40" />
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="font-extrabold text-sm tracking-wider text-emerald-400 block truncate">
                  SIGNALFORGE
                </span>
                <span className="text-[10px] text-zinc-500 font-mono block truncate">
                  TECH INTELLIGENCE
                </span>
              </div>
            )}
          </div>

          <button
            onClick={onToggleCollapse}
            className="p-1 rounded hover:bg-[#0e1710] text-zinc-400 hover:text-emerald-300 transition"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Workspace Selector */}
        {!collapsed && (
          <div className="px-3 py-2 border-b border-[#22c55e]/15 bg-[#0e1710]/40">
            <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider mb-1">
              Active Workspace
            </div>
            <div className="flex items-center justify-between text-xs font-semibold text-emerald-300">
              <span className="truncate">My workspace</span>
              <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-pulse" />
            </div>
          </div>
        )}

        {/* Primary Navigation List */}
        <nav className="p-2 space-y-1">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const isActive = currentModule === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectModule(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                  isActive
                    ? 'bg-[#0e1710] text-emerald-300 border border-[#22c55e]/40 font-semibold'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#0e1710]/60 border border-transparent'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <Icon
                  className={`w-4 h-4 flex-shrink-0 transition-transform ${
                    isActive ? 'text-[#22c55e] scale-110' : 'text-zinc-500 group-hover:text-emerald-400'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate text-left flex-1">{item.label}</span>
                )}
              </button>
            );
          })}
        </nav>

      </div>

      {/* Bottom Footer Section: Settings & Theme indicator */}
      <div className="p-2 border-t border-[#22c55e]/20 bg-[#080c08]">
        <button
          onClick={() => onSelectModule('settings')}
          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs transition ${
            currentModule === 'settings'
              ? 'bg-[#0e1710] text-emerald-300 border border-[#22c55e]/40 font-semibold'
              : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#0e1710]/60'
          }`}
          title="Settings"
        >
          <Settings className="w-4 h-4 text-zinc-500" />
          {!collapsed && <span>Settings & Logs</span>}
        </button>

        {!collapsed && (
          <div className="mt-2 pt-2 border-t border-zinc-900 text-[10px] font-mono text-zinc-600 flex items-center justify-between px-1">
            <span>THEME: CYBER_DEV</span>
            <span className="text-[#22c55e]">#22C55E</span>
          </div>
        )}
      </div>
    </aside>
  );
}
