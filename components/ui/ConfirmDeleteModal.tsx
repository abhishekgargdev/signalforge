'use client';

import React from 'react';
import { AlertTriangle, Trash2, X, RefreshCw } from 'lucide-react';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  itemName?: string;
  description?: string;
  isDeleting?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Permanent Deletion',
  itemName,
  description = 'This operation will permanently remove the record from your pipeline and cron queues. This action cannot be reversed.',
  isDeleting = false,
}: ConfirmDeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-md rounded-xl bg-[#080c08] border border-red-500/40 shadow-2xl overflow-hidden font-mono text-xs text-slate-200">
        {/* Top Warning Banner */}
        <div className="p-4 bg-gradient-to-r from-red-950/40 to-transparent border-b border-red-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-red-400 font-bold">
            <div className="w-8 h-8 rounded-lg bg-red-950/80 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] text-red-500 uppercase tracking-wider block">
                IRREVERSIBLE ACTION
              </span>
              <h3 className="text-sm font-extrabold text-slate-100">{title}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="p-1 rounded text-zinc-400 hover:text-white transition disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          {itemName && (
            <div className="p-3 rounded-lg bg-black/60 border border-red-500/20 text-slate-200">
              <span className="text-[10px] text-zinc-500 uppercase block mb-0.5">TARGET RECORD</span>
              <strong className="text-sm text-red-300 font-bold block truncate">{itemName}</strong>
            </div>
          )}

          <p className="text-zinc-300 leading-relaxed text-xs">
            {description}
          </p>

          <div className="p-2.5 rounded bg-red-950/20 border border-red-900/40 text-[11px] text-red-400/90 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping flex-shrink-0" />
            <span>Warning: Active automations and scheduled cron jobs referencing this item will be cancelled.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-[#0e1710] border-t border-white/5 flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold transition disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-extrabold transition flex items-center gap-2 shadow-lg shadow-red-900/40"
          >
            {isDeleting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Delete</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
