'use client';

import React, { useEffect, useState } from 'react';
import { IdeaBox } from '@/components/IdeaBox';
import { Pagination } from '@/components/ui/Pagination';

type Draft = {
  id: string;
  author: string;
  excerpt: string;
  comment: string;
  status: string;
  dayKey: string;
};

export function CommentsView() {
  const [rows, setRows] = useState<Draft[]>([]);
  const [page, setPage] = useState(1);
  const [notice, setNotice] = useState<string | null>(null);
  const pageSize = 5;

  const load = () => {
    fetch('/api/v1/comments')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setRows(data.data.comments || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (row: Draft, status: string, comment = row.comment) => {
    const res = await fetch('/api/v1/comments', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: row.id, comment, status }),
    });
    const data = await res.json();
    if (data.success) setNotice(data.data.message);
    load();
  };

  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-4">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100">Comments</h1>
        <p className="mt-1 text-xs text-zinc-400">Up to five comments prepared each day. Edit them, then mark them posted after you reply.</p>
      </div>
      {notice && <p className="text-xs text-emerald-300">{notice}</p>}
      {visible.length === 0 && <p className="text-xs text-zinc-500">No comments yet. Add topics, then wait for the daily run.</p>}
      {visible.map((row) => (
        <div key={row.id} className="space-y-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold text-sm">{row.author}</div>
              <p className="text-xs text-zinc-400">{row.excerpt}</p>
            </div>
            <span className="text-[10px] uppercase text-emerald-300">{row.status}</span>
          </div>
          <IdeaBox label="Change the comment" onFill={(text) => update(row, row.status, text)} />
          <textarea
            rows={4}
            defaultValue={row.comment}
            key={row.comment}
            onBlur={(e) => {
              if (e.target.value !== row.comment) update(row, row.status, e.target.value);
            }}
            className="w-full rounded border border-[#22c55e]/30 bg-black/40 p-2 text-xs"
          />
          <button type="button" className="rounded bg-[#22c55e] px-3 py-1 text-xs font-bold text-black" onClick={() => update(row, 'posted')}>
            Mark posted
          </button>
        </div>
      ))}
      <Pagination currentPage={page} totalPages={Math.max(1, Math.ceil(rows.length / pageSize))} totalItems={rows.length} pageSize={pageSize} onPageChange={setPage} itemLabel="comments" />
    </div>
  );
}
