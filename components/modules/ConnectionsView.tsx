'use client';

import React, { useEffect, useState } from 'react';
import { IdeaBox } from '@/components/IdeaBox';
import { Pagination } from '@/components/ui/Pagination';

type Lead = {
  id: string;
  name: string;
  role: string;
  company: string;
  profileUrl: string;
  note: string;
  status: string;
  dayKey: string;
};

export function ConnectionsView() {
  const [rows, setRows] = useState<Lead[]>([]);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const pageSize = 5;

  const load = () => {
    fetch('/api/v1/connections')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRows(data.data.connections || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (row: Lead, status: string, note = row.note) => {
    const res = await fetch('/api/v1/connections', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, note, status }),
    });
    const data = await res.json();
    if (data.success) setNotice(data.data.message);
    load();
  };

  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100">Connections</h1>
        <p className="mt-1 text-xs text-zinc-400">People the daily run suggested. Mark an invite ready when you want to send it.</p>
      </div>
      {notice && <p className="text-xs text-emerald-300">{notice}</p>}
      {visible.length === 0 && <p className="text-xs text-zinc-500">No suggestions yet. The daily cron adds them from your company list.</p>}
      {visible.map((row) => (
        <div key={row.id} className="space-y-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-sm">{row.name}</div>
              <div className="text-xs text-zinc-400">{row.role} · {row.company} · {row.dayKey}</div>
            </div>
            <span className="text-[10px] uppercase text-emerald-300">{row.status}</span>
          </div>
          <IdeaBox label="Rewrite the note" onFill={(text) => update(row, row.status, text)} />
          <textarea
            rows={3}
            defaultValue={row.note}
            key={row.note}
            onBlur={(e) => {
              if (e.target.value !== row.note) update(row, row.status, e.target.value);
            }}
            className="w-full rounded border border-[#22c55e]/30 bg-black/40 p-2 text-xs"
          />
          <div className="flex gap-2 text-xs">
            <button type="button" className="rounded bg-[#22c55e] px-3 py-1 font-bold text-black" onClick={() => update(row, 'invited')}>
              Send invite
            </button>
            <button type="button" className="text-zinc-400" onClick={() => update(row, 'skipped')}>
              Skip
            </button>
          </div>
        </div>
      ))}
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(rows.length / pageSize))} totalItems={rows.length} pageSize={pageSize} onPageChange={setPage} itemLabel="people" />
    </div>
  );
}
