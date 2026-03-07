'use client';

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { QuickCreateModal } from '@/components/QuickCreateModal';
import { AIModal } from '@/components/AIModal';
import { INITIAL_NOTIFICATIONS } from '@/lib/signalforge-data';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);

  // Derive current module from pathname e.g. /discover -> 'discover'
  const currentModule = pathname?.includes('/dashboard/articles')
    ? 'articles'
    : pathname?.split('/')[1] || 'dashboard';

  const handleNavigate = (mod: string) => {
    if (mod === 'dashboard') router.push('/dashboard');
    else if (mod === 'articles') router.push('/dashboard/articles');
    else if (mod.startsWith('public-')) {
      if (mod === 'public-article') router.push('/articles/speculative-decoding-production-llms');
      else router.push('/author/abhishekgarg');
    } else {
      router.push(`/${mod}`);
    }
  };

  return (
    <div className="flex h-screen bg-[#080c08] text-slate-100 overflow-hidden font-mono antialiased">
      {/* Persistent Responsive Sidebar */}
      <Sidebar
        currentModule={currentModule}
        onSelectModule={handleNavigate}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header */}
        <Header
          currentModule={currentModule}
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          onOpenQuickCreate={() => setQuickCreateOpen(true)}
          onOpenNotifications={() => setNotificationsOpen(true)}
          onOpenAiAssistant={() => setAiAssistantOpen(true)}
          unreadNotificationsCount={INITIAL_NOTIFICATIONS.filter((n) => !n.read).length}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 pb-16">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Quick Create Action Modal */}
      <QuickCreateModal
        isOpen={quickCreateOpen}
        onClose={() => setQuickCreateOpen(false)}
        onSelectAction={handleNavigate}
      />

      {/* Real-Time Notifications Drawer */}
      <NotificationDrawer
        isOpen={notificationsOpen}
        onClose={() => setNotificationsOpen(false)}
        onNavigate={handleNavigate}
      />

      {/* Forge AI Studio Modal */}
      <AIModal
        isOpen={aiAssistantOpen}
        onClose={() => setAiAssistantOpen(false)}
      />
    </div>
  );
}
