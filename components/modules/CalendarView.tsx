'use client';

import React, { useEffect, useState } from 'react';

type Item = {
  id: string;
  kind: string;
  title: string;
  status: string;
  scheduledDate: string;
  source: string;
};

export function CalendarView() {
  const [items, setItems] = useState<Item[]>([]);
  const [dates, setDates] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const load = () => {
    fetch('/api/v1/schedule')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setItems(data.data.items || []);
      })
      .catch(() => setMessage('Could not load the calendar'));
  };

  useEffect(() => {
    load();
  }, []);

  const generate = async () => {
    setGenerating(true);
    setMessage(null);
    try {
      const res = await fetch('/api/v1/drafts/generate', { method: 'POST' });
      const data = await res.json();
      setMessage(data.success ? `Created ${data.data.created} drafts` : data.error?.message || 'Could not generate drafts');
      load();
    } finally {
      setGenerating(false);
    }
  };

  const schedule = async (item: Item) => {
    const scheduledDate = dates[item.id] || item.scheduledDate;
    const res = await fetch('/api/v1/schedule', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: item.id, source: item.source, scheduledDate }),
    });
    const data = await res.json();
    setMessage(data.success ? `Scheduled ${item.title}` : data.error?.message || 'Could not schedule');
    load();
  };

  const grouped = items
    .filter((item) => item.scheduledDate)
    .reduce<Record<string, Item[]>>((acc, item) => {
      acc[item.scheduledDate] = acc[item.scheduledDate] || [];
      acc[item.scheduledDate].push(item);
      return acc;
    }, {});
  const unscheduled = items.filter((item) => !item.scheduledDate);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#22c55e]/20 pb-4">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Calendar</h1>
          <p className="mt-1 text-xs text-zinc-400">Schedule a draft. The daily cron publishes it on that date.</p>
        </div>
        <button type="button" onClick={generate} disabled={generating} className="rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-bold text-black disabled:opacity-60">
          {generating ? 'Drafting…' : 'Generate drafts'}
        </button>
      </div>
      {message && <p className="text-xs text-emerald-300">{message}</p>}

      <section className="space-y-3">
        <h2 className="text-sm font-bold text-slate-100">Needs a date</h2>
        {unscheduled.length === 0 && <p className="text-xs text-zinc-500">Nothing waiting. Generate drafts from your occasions, companies, topics, and the day’s news.</p>}
        {unscheduled.map((item) => (
          <div key={`${item.source}-${item.id}`} className="flex flex-wrap items-center gap-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-3">
            <div className="min-w-0 flex-1">
              <div className="text-sm font-semibold text-slate-100">{item.title}</div>
              <div className="text-[10px] uppercase text-zinc-500">{item.kind} · {item.status}</div>
            </div>
            <input
              type="date"
              value={dates[item.id] || ''}
              onChange={(e) => setDates((prev) => ({ ...prev, [item.id]: e.target.value }))}
              className="rounded border border-[#22c55e]/30 bg-black/50 px-2 py-1 text-xs"
            />
            <button type="button" onClick={() => schedule(item)} className="rounded bg-[#22c55e] px-3 py-1 text-xs font-bold text-black">
              Schedule
            </button>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-sm font-bold text-slate-100">Scheduled</h2>
        {Object.keys(grouped).length === 0 && <p className="text-xs text-zinc-500">No dates yet.</p>}
        {Object.keys(grouped).sort().map((date) => (
          <div key={date} className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
            <div className="text-xs font-mono text-emerald-300">{date}</div>
            <ul className="mt-2 space-y-2">
              {grouped[date].map((item) => (
                <li key={`${item.source}-${item.id}`} className="text-sm text-slate-100">
                  {item.title}
                  <span className="ml-2 text-[10px] uppercase text-zinc-500">{item.kind} · {item.status}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
}
