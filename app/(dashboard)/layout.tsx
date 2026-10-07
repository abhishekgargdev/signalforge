'use client';

import React, { useEffect, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Sidebar } from '@/components/Sidebar';
import { CommandPalette } from '@/components/CommandPalette';
import { NotificationDrawer } from '@/components/NotificationDrawer';
import { QuickCreateModal } from '@/components/QuickCreateModal';
import { AIModal } from '@/components/AIModal';
import { useApiActivity } from '@/components/AppLoaders';
import { PageSkeleton } from '@/components/ui/SkeletonLoader';
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Modals state
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const apiPending = useApiActivity();
  const [routeLoading, setRouteLoading] = useState(true);
  const sawRequest = useRef(false);

  // Derive current module from pathname e.g. /discover -> 'discover'
  const currentModule = pathname?.includes('/dashboard/articles')
    ? 'articles'
    : pathname?.split('/')[1] || 'dashboard';

  const handleNavigate = (mod: string) => {
    const next =
      mod === 'dashboard'
        ? '/dashboard'
        : mod === 'articles'
          ? '/dashboard/articles'
          : mod === 'public-article'
            ? '/articles'
            : mod === 'public-author'
              ? '/author/me'
              : `/${mod}`;
    if (next !== pathname) {
      sawRequest.current = false;
      setRouteLoading(true);
    }
    router.push(next);
  };

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement | null)?.closest('a');
      if (!anchor) return;
      const href = anchor.getAttribute('href');
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('http')) return;
      const next = href.split('?')[0];
      if (next && next !== pathname) {
        sawRequest.current = false;
        setRouteLoading(true);
      }
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, [pathname]);

  useEffect(() => {
    sawRequest.current = false;
    const waitForRequest = window.setTimeout(() => {
      if (!sawRequest.current) setRouteLoading(false);
    }, 700);
    return () => window.clearTimeout(waitForRequest);
  }, [pathname]);

  useEffect(() => {
    if (!routeLoading) return;
    if (apiPending > 0) sawRequest.current = true;
    if (sawRequest.current && apiPending === 0) setRouteLoading(false);
  }, [apiPending, routeLoading]);

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
          unreadNotificationsCount={0}
        />

        {/* Scrollable Viewport */}
        <main className="relative flex-1 overflow-y-auto p-4 lg:p-6 pb-16">
          <div className={routeLoading ? 'invisible' : undefined}>
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
          {routeLoading && (
            <div className="absolute inset-0 z-20 overflow-y-auto bg-[#080c08] p-4 lg:p-6">
              <div className="max-w-7xl mx-auto">
                <PageSkeleton />
              </div>
            </div>
          )}
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
