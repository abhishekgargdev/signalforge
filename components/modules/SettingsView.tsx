'use client';

import React, { useEffect, useState } from 'react';
import {
  Settings,
  User,
  Shield,
  Palette,
  Bell,
  Sliders,
  CheckCircle2,
  Key,
  Layers,
  History
} from 'lucide-react';
import { INITIAL_AUDIT_LOGS } from '@/lib/signalforge-data';

type SocialId = 'linkedin' | 'x';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState<'profile' | 'brand' | 'integrations' | 'audit'>('profile');
  const [profileLoading, setProfileLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [connectNotice, setConnectNotice] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/v1/auth/session')
      .then((res) => res.json())
      .then((data) => {
        const user = data?.data?.user;
        if (cancelled || !user) return;
        setName(user.name || '');
        setUsername(user.username || '');
        setEmail(user.email || '');
        setHeadline(user.headline || '');
        setBio(user.bio || '');
      })
      .finally(() => {
        if (!cancelled) setProfileLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSaveProfile = async () => {
    setSaving(true);
    setSaveMessage(null);
    try {
      const res = await fetch('/api/v1/auth/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, headline, bio }),
      });
      const data = await res.json();
      if (!data.success) {
        setSaveMessage(data.error?.message || 'Could not save profile');
        return;
      }
      setSaveMessage('Profile saved');
    } catch {
      setSaveMessage('Could not save profile');
    } finally {
      setSaving(false);
    }
  };

  const socialAccounts: { id: SocialId; name: string; desc: string }[] = [
    { id: 'linkedin', name: 'LinkedIn', desc: 'Publish posts, comments, and connection notes from your account.' },
    { id: 'x', name: 'X (Twitter)', desc: 'Schedule threads and posts from the social hub.' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              System Configuration & Audit Logs
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your personal engineering brand settings, integration credentials, and security history.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono overflow-x-auto">
          {[
            { id: 'profile', label: 'Engineer Profile' },
            { id: 'brand', label: 'Brand & Theme' },
            { id: 'integrations', label: 'Integrations' },
            { id: 'audit', label: 'Audit Logs' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1 rounded transition whitespace-nowrap ${
                activeTab === tab.id ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: Profile */}
      {activeTab === 'profile' && (
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-4 max-w-2xl text-xs">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100">Professional Engineering Persona</h3>
            <p className="text-zinc-400">Used by Forge AI to ensure realistic, grounded content synthesis.</p>
          </div>

          {profileLoading ? (
            <p className="text-xs text-zinc-500 font-mono">Loading your account…</p>
          ) : (
          <div className="space-y-3">
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Username:</label>
              <input
                type="text"
                value={username}
                readOnly
                className="w-full p-2.5 rounded bg-black/40 border border-zinc-800 text-zinc-400 font-mono"
              />
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Email:</label>
              <input
                type="email"
                value={email}
                readOnly
                className="w-full p-2.5 rounded bg-black/40 border border-zinc-800 text-zinc-400 font-mono"
              />
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Target Role Headline:</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="Target role or headline"
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none placeholder-zinc-600"
              />
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Technical Bio:</label>
              <textarea
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Short technical bio for your public profile"
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none placeholder-zinc-600"
              />
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleSaveProfile}
                disabled={saving}
                className="px-4 py-2 rounded bg-[#22c55e] text-black font-bold hover:bg-emerald-400 transition disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save Profile Changes'}
              </button>
              {saveMessage && <span className="text-[11px] font-mono text-zinc-400">{saveMessage}</span>}
            </div>
          </div>
          )}
        </div>
      )}

      {/* TAB 2: Brand & Theme */}
      {activeTab === 'brand' && (
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-4 max-w-2xl text-xs font-mono">
          <div className="border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100">Visual Theme Configuration</h3>
            <p className="text-zinc-400">Applied Cyber / Developer design tokens.</p>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded bg-black/50 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Selected Theme:</span>
              <span className="text-emerald-400 font-bold">4. Cyber / Developer</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Primary Color:</span>
              <span className="text-[#22c55e] font-bold">#22c55e (Matrix Phosphor)</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Secondary Color:</span>
              <span className="text-[#f59e0b] font-bold">#f59e0b (Amber Alert)</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Typography Font:</span>
              <span className="text-slate-200">JetBrains Mono / System Monospace</span>
            </div>
            <div className="p-3 rounded bg-black/50 border border-white/5 flex items-center justify-between">
              <span className="text-zinc-400">Border Radius:</span>
              <span className="text-slate-200">Medium (8px rounded-lg)</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Integrations */}
      {activeTab === 'integrations' && (
        <div className="space-y-4 max-w-2xl text-xs">
          <p className="text-zinc-400">
            Connect a social account to publish from SignalForge. Nothing is connected until you complete OAuth.
          </p>
          {connectNotice && (
            <p className="text-[11px] font-mono text-amber-300/90">{connectNotice}</p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {socialAccounts.map((account) => (
              <div key={account.id} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-slate-100">{account.name}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-700">
                    Not connected
                  </span>
                </div>
                <p className="text-zinc-400">{account.desc}</p>
                <button
                  type="button"
                  onClick={() =>
                    setConnectNotice(
                      `${account.name} OAuth is not configured yet. Add the provider credentials, then connect from here.`
                    )
                  }
                  className="px-3 py-1.5 rounded bg-[#22c55e]/15 border border-[#22c55e]/40 text-emerald-300 font-semibold hover:bg-[#22c55e]/25"
                >
                  Connect {account.name}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: Audit Logs */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-xl bg-[#0e1710] border border-[#22c55e]/25 space-y-4">
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <History className="w-4 h-4 text-[#22c55e]" />
              Security & Action Audit Trail
            </h3>
            <span className="text-xs font-mono text-zinc-500">Immutable Log</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-500 uppercase tracking-wider text-[10px]">
                  <th className="py-2 px-3">Action</th>
                  <th className="py-2 px-3">Target Resource</th>
                  <th className="py-2 px-3">Timestamp</th>
                  <th className="py-2 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {INITIAL_AUDIT_LOGS.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-8 px-3 text-center text-zinc-500">
                      No audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  INITIAL_AUDIT_LOGS.map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3 font-semibold text-slate-200">{log.action}</td>
                      <td className="py-3 px-3 text-zinc-400">{log.resource}</td>
                      <td className="py-3 px-3 text-zinc-500">{log.timestamp}</td>
                      <td className="py-3 px-3 text-right">
                        <span className="text-emerald-400">{log.status}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
