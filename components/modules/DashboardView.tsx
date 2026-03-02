'use client';

import React, { useEffect, useState } from 'react';

type Summary = {
  posts: number;
  postStatus: Record<string, number>;
  articles: number;
  companies: number;
  topics: number;
  connections: number;
  connectionsInvited: number;
  comments: number;
  commentsPosted: number;
};

const empty: Summary = {
  posts: 0,
  postStatus: {},
  articles: 0,
  companies: 0,
  topics: 0,
  connections: 0,
  connectionsInvited: 0,
  comments: 0,
  commentsPosted: 0,
};

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  const width = max === 0 ? 0 : Math.round((value / max) * 100);
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-2 rounded-full bg-zinc-800">
        <div className="h-full rounded-full bg-[#22c55e]" style={{ width: `${width}%` }} />
      </div>
    </div>
  );
}

export function DashboardView({ onNavigate }: { onNavigate: (module: string) => void }) {
  const [summary, setSummary] = useState<Summary>(empty);

  useEffect(() => {
    fetch('/api/v1/summary')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setSummary({ ...empty, ...data.data });
      })
      .catch(() => {});
  }, []);

  const postMax = Math.max(1, ...Object.values(summary.postStatus), summary.posts);
  const cards = [
    { label: 'Posts', value: summary.posts, mod: 'content' },
    { label: 'Articles', value: summary.articles, mod: 'articles' },
    { label: 'Companies', value: summary.companies, mod: 'companies' },
    { label: 'Topics', value: summary.topics, mod: 'topics' },
    { label: 'Connections waiting', value: summary.connections - summary.connectionsInvited, mod: 'prospector' },
    { label: 'Comments waiting', value: summary.comments - summary.commentsPosted, mod: 'engagement' },
  ];

  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100">Dashboard</h1>
        <p className="mt-1 text-xs text-zinc-400">What the daily run has drafted, and what is still waiting on you.</p>
      </div>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.mod)}
            className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4 text-left"
          >
            <div className="text-[10px] uppercase tracking-wider text-zinc-500">{card.label}</div>
            <div className="mt-2 text-2xl font-bold text-emerald-300">{card.value}</div>
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
          <h2 className="text-sm font-bold">Posts by status</h2>
          {Object.keys(summary.postStatus).length === 0 && <p className="text-xs text-zinc-500">No posts yet.</p>}
          {Object.entries(summary.postStatus).map(([status, value]) => (
            <Bar key={status} label={status} value={value} max={postMax} />
          ))}
        </div>
        <div className="space-y-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
          <h2 className="text-sm font-bold">Outreach</h2>
          <Bar label="Connections found" value={summary.connections} max={Math.max(summary.connections, 1)} />
          <Bar label="Invites marked ready" value={summary.connectionsInvited} max={Math.max(summary.connections, 1)} />
          <Bar label="Comments prepared" value={summary.comments} max={Math.max(summary.comments, 1)} />
          <Bar label="Comments posted" value={summary.commentsPosted} max={Math.max(summary.comments, 1)} />
        </div>
      </div>
    </div>
  );
}
