'use client';

import React, { useEffect, useState } from 'react';
import { IdeaBox } from '@/components/IdeaBox';
import { Pagination } from '@/components/ui/Pagination';
import { ConfirmDeleteModal } from '@/components/ui/ConfirmDeleteModal';

type Field = { key: string; label: string; multiline?: boolean };
type Row = { id: string } & Record<string, string>;

export function SimpleListView({
  title,
  subtitle,
  endpoint,
  listKey,
  fields,
  noun,
  fillKey,
}: {
  title: string;
  subtitle: string;
  endpoint: string;
  listKey: string;
  fields: Field[];
  noun: string;
  fillKey: string;
}) {
  const empty = Object.fromEntries(fields.map((field) => [field.key, '']));
  const [rows, setRows] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, string>>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<Row | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const pageSize = 6;

  const load = () => {
    fetch(endpoint)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data?.[listKey])) setRows(data.data[listKey]);
      })
      .catch(() => setError('Could not load this list'));
  };

  useEffect(() => {
    load();
  }, [endpoint, listKey]);

  const save = async () => {
    setError(null);
    const res = await fetch(endpoint, {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    const data = await res.json();
    if (!data.success) {
      setError(data.error?.message || 'Could not save');
      return;
    }
    setForm(empty);
    setEditingId(null);
    load();
  };

  const remove = async () => {
    if (!pendingDelete) return;
    setIsDeleting(true);
    setError(null);
    try {
      const res = await fetch(`${endpoint}?id=${pendingDelete.id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        setError(data.error?.message || 'Could not delete');
        return;
      }
      setPendingDelete(null);
      load();
    } finally {
      setIsDeleting(false);
    }
  };

  const pageCount = Math.max(1, Math.ceil(rows.length / pageSize));
  const visible = rows.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <h1 className="text-xl font-bold text-slate-100">{title}</h1>
        <p className="mt-1 text-xs text-zinc-400">{subtitle}</p>
      </div>

      <div className="grid gap-3 rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
        <IdeaBox onFill={(text) => setForm((prev) => ({ ...prev, [fillKey]: text }))} />
        {fields.map((field) =>
          field.multiline ? (
            <textarea
              key={field.key}
              rows={3}
              value={form[field.key] || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.label}
              className="w-full rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs text-slate-100"
            />
          ) : (
            <input
              key={field.key}
              value={form[field.key] || ''}
              onChange={(e) => setForm((prev) => ({ ...prev, [field.key]: e.target.value }))}
              placeholder={field.label}
              className="w-full rounded border border-[#22c55e]/30 bg-black/50 p-2 text-xs text-slate-100"
            />
          )
        )}
        {error && <p className="text-xs text-red-300">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={save} className="rounded-lg bg-[#22c55e] px-3 py-1.5 text-xs font-bold text-black">
            {editingId ? `Update ${noun}` : `Add ${noun}`}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm(empty);
              }}
              className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs text-zinc-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {visible.length === 0 && <p className="text-xs text-zinc-500">Nothing here yet.</p>}
        {visible.map((row) => (
          <div key={row.id} className="rounded-xl border border-[#22c55e]/20 bg-[#0e1710] p-4">
            <div className="font-semibold text-sm text-slate-100">{row[fields[0].key]}</div>
            {fields.slice(1).map((field) => (
              <p key={field.key} className="mt-1 text-xs text-zinc-400 whitespace-pre-wrap">
                {row[field.key]}
              </p>
            ))}
            <div className="mt-3 flex gap-2 text-xs">
              <button
                type="button"
                className="text-emerald-400"
                onClick={() => {
                  setEditingId(row.id);
                  setForm(Object.fromEntries(fields.map((field) => [field.key, row[field.key] || ''])));
                }}
              >
                Edit
              </button>
              <button type="button" className="text-red-300" onClick={() => setPendingDelete(row)}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <Pagination currentPage={page} totalPages={pageCount} totalItems={rows.length} pageSize={pageSize} onPageChange={setPage} itemLabel={noun} />
      <ConfirmDeleteModal
        isOpen={Boolean(pendingDelete)}
        onClose={() => {
          if (!isDeleting) setPendingDelete(null);
        }}
        onConfirm={remove}
        isDeleting={isDeleting}
        title={`Delete this ${noun}`}
        itemName={pendingDelete ? pendingDelete[fields[0].key] : undefined}
        description={`This ${noun} will be removed. You can add it again later.`}
      />
    </div>
  );
}
