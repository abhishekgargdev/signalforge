'use client';

import React from 'react';
import {
  LayoutDashboard,
  Radar,
  Building2,
  MessageSquareQuote,
  Kanban,
  FileText,
  Image as ImageIcon,
  Share2,
  BrainCircuit,
  Target,
  BarChart3,
  Bot,
  Settings,
  ChevronLeft,
  ChevronRight,
  Zap,
  Globe,
  Radio,
  UserPlus
} from 'lucide-react';

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
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: 'Live' },
    { id: 'discover', label: 'Discover Radar', icon: Radar, count: '4' },
    { id: 'prospector', label: 'LinkedIn Auto-Connect', icon: UserPlus, badge: 'AI Cron', count: '6', highlight: true },
    { id: 'engagement', label: 'FAANG Comment Studio', icon: MessageSquareQuote, count: '2', highlight: true },
    { id: 'companies', label: 'Companies & People', icon: Building2, count: '4' },
    { id: 'content', label: 'Content Pipeline', icon: Kanban, count: '5' },
    { id: 'articles', label: 'Technical Articles', icon: FileText, count: '2' },
    { id: 'media', label: 'Media Library', icon: ImageIcon },
    { id: 'social', label: 'Social Scheduler', icon: Share2 },
    { id: 'knowledge', label: 'Experience Vault', icon: BrainCircuit, count: '2' },
    { id: 'career', label: 'Career Signals', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'ai', label: 'AI Workspace', icon: Bot },
  ];

  const publicViews = [
    { id: 'public-article', label: 'Public Article Reader', icon: Globe },
    { id: 'public-author', label: 'Public Author Portfolio', icon: Radio },
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
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] text-black font-bold flex items-center justify-center flex-shrink-0 shadow-sm shadow-[#22c55e]/40">
              <Zap className="w-4 h-4 stroke-[2.5]" />
            </div>
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
              <span className="truncate">Staff AI & Systems Eng</span>
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
                {!collapsed && item.count && (
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-emerald-400 border border-[#22c55e]/20">
                    {item.count}
                  </span>
                )}
                {!collapsed && item.badge && (
                  <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Public Views Navigation */}
        {!collapsed && (
          <div className="px-3 pt-3 pb-1 border-t border-[#22c55e]/15">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block mb-1">
              Public Portal
            </span>
            <div className="space-y-1">
              {publicViews.map((pub) => {
                const Icon = pub.icon;
                const isActive = currentModule === pub.id;
                return (
                  <button
                    key={pub.id}
                    onClick={() => onSelectModule(pub.id)}
                    className={`w-full flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs transition ${
                      isActive
                        ? 'bg-[#0e1710] text-emerald-300 border border-[#22c55e]/30'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#0e1710]/40'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-zinc-500" />
                    <span className="truncate">{pub.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
