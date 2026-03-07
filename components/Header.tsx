'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Zap,
  Search,
  Bell,
  Plus,
  Sparkles,
  User,
  Shield,
  ExternalLink,
  ChevronDown,
  Moon,
  Sun,
  Laptop
} from 'lucide-react';

interface HeaderProps {
  currentModule: string;
  onOpenCommandPalette: () => void;
  onOpenQuickCreate: () => void;
  onOpenNotifications: () => void;
  onOpenAiAssistant: () => void;
  unreadNotificationsCount: number;
}

export function Header({
  currentModule,
  onOpenCommandPalette,
  onOpenQuickCreate,
  onOpenNotifications,
  onOpenAiAssistant,
  unreadNotificationsCount,
}: HeaderProps) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const getModuleTitle = (mod: string) => {
    switch (mod) {
      case 'dashboard':
        return 'Engineering Command Hub';
      case 'discover':
        return 'Technology Radar & Signal Discovery';
      case 'prospector':
        return 'LinkedIn AI Prospector & Automated Connection Cron';
      case 'companies':
        return 'Target Companies & Decision Makers';
      case 'engagement':
        return 'FAANG Comment Studio & AI Outreach Engine';
      case 'content':
        return 'Content Pipeline & 10-Step Wizard';
      case 'articles':
        return 'Technical Articles & Editorial Publisher';
      case 'media':
        return 'Media Library & Cloudinary Hub';
      case 'social':
        return 'Cross-Platform Social Scheduler';
      case 'knowledge':
        return 'STAR Experience Vault & Architecture Projects';
      case 'career':
        return 'Career Signals & Market Alignment';
      case 'analytics':
        return 'Traffic, Engagement & Audience Analytics';
      case 'ai':
        return 'AI Workspace & Prompt Library';
      case 'settings':
        return 'System Configuration & Audit Logs';
      case 'public-article':
        return 'Public Technical Article View';
      case 'public-author':
        return 'Public Engineer Profile & Portfolio';
      default:
        return 'SignalForge Console';
    }
  };

  return (
    <header className="h-14 border-b border-[#22c55e]/20 bg-[#080c08]/90 backdrop-blur-md px-4 lg:px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left: Breadcrumbs & Module Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-[#22c55e]">
          <Terminal className="w-3.5 h-3.5 text-[#22c55e]" />
          <span className="text-zinc-500">signalforge</span>
          <span className="text-zinc-600">/</span>
          <span className="font-semibold text-emerald-400 capitalize">{currentModule}</span>
        </div>
        <div className="h-3 w-px bg-zinc-800 hidden md:block" />
        <span className="text-xs text-zinc-400 hidden md:inline truncate max-w-xs lg:max-w-md">
          {getModuleTitle(currentModule)}
        </span>
      </div>

      {/* Right: Actions, Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Global Search trigger (Ctrl+K) */}
        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#0e1710] border border-[#22c55e]/25 text-zinc-400 hover:text-emerald-300 hover:border-[#22c55e]/50 transition group"
          title="Command Palette (Ctrl + K)"
        >
          <Search className="w-3.5 h-3.5 text-[#22c55e] group-hover:scale-110 transition-transform" />
          <span className="hidden sm:inline">Search Signals...</span>
          <kbd className="hidden sm:inline text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/60 border border-zinc-800 text-zinc-400">
            Ctrl+K
          </kbd>
        </button>

        {/* AI Assistant Quick Launcher */}
        <button
          onClick={onOpenAiAssistant}
          className="flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60 transition"
          title="Open AI Studio Prompt"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
          <span className="hidden md:inline font-semibold">Forge AI</span>
        </button>

        {/* Quick Create Dropdown */}
        <button
          onClick={onOpenQuickCreate}
          className="flex items-center gap-1.5 text-xs px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#22c55e] text-black font-semibold hover:bg-emerald-400 transition shadow-sm shadow-[#22c55e]/20"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span className="hidden sm:inline">Create</span>
        </button>

        {/* Notifications Bell */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-[#0e1710] transition border border-transparent hover:border-[#22c55e]/20"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#f59e0b] ring-2 ring-[#080c08]" />
          )}
        </button>

        {/* User Profile Menu */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 pl-2 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/40 transition text-xs"
          >
            <div className="w-5 h-5 rounded bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-[10px] font-bold text-emerald-300">
              AG
            </div>
            <span className="font-semibold text-zinc-200 hidden lg:inline">Abhishek</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {profileDropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg bg-[#0e1710] border border-[#22c55e]/30 shadow-xl py-1 text-xs z-50 animate-in fade-in zoom-in-95">
              <div className="px-3 py-2 border-b border-[#22c55e]/15">
                <div className="font-bold text-emerald-300">Abhishek Garg</div>
                <div className="text-[11px] text-zinc-400 truncate">abhishekgarg959@gmail.com</div>
                <div className="text-[10px] text-[#f59e0b] font-mono mt-1">Staff Systems Candidate</div>
              </div>

              <div className="py-1">
                <a
                  href="#settings"
                  className="flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:bg-[#22c55e]/10 hover:text-emerald-300"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Public Portfolio</span>
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-2 px-3 py-1.5 text-zinc-300 hover:bg-[#22c55e]/10 hover:text-emerald-300"
                >
                  <Shield className="w-3.5 h-3.5" />
                  <span>Security & Sessions</span>
                </a>
              </div>

              <div className="border-t border-[#22c55e]/15 px-3 py-1.5 text-[11px] text-zinc-500 font-mono">
                Theme: Cyber / Developer
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
