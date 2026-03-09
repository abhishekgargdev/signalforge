'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  pageSize?: number;
  onPageSizeChange?: (pageSize: number) => void;
  pageSizeOptions?: number[];
  itemLabel?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize = 6,
  onPageSizeChange,
  pageSizeOptions = [3, 6, 9, 12],
  itemLabel = 'items',
}: PaginationProps) {
  if (totalPages <= 1 && (!totalItems || totalItems <= pageSize)) {
    return null;
  }

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems || currentPage * pageSize);

  // Generate page numbers window
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-white/5 font-mono text-xs">
      {/* Item Range Counter */}
      <div className="text-zinc-400 text-[11px] flex items-center gap-2">
        {totalItems !== undefined && (
          <span>
            Showing <strong className="text-emerald-400">{startItem}</strong> -{' '}
            <strong className="text-emerald-400">{endItem}</strong> of{' '}
            <strong className="text-slate-100">{totalItems}</strong> {itemLabel}
          </span>
        )}

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2">
            <span className="text-zinc-500">Per page:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                onPageSizeChange(Number(e.target.value));
                onPageChange(1);
              }}
              className="bg-black border border-zinc-800 rounded px-1.5 py-0.5 text-emerald-300 focus:outline-none focus:border-[#22c55e]"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1">
        {/* First Page Button */}
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-1.5 rounded-lg bg-black/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#22c55e]/40 disabled:opacity-30 disabled:pointer-events-none transition"
          title="First Page"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        {/* Previous Page Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2.5 py-1 rounded-lg bg-black/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#22c55e]/40 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 text-[11px]"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        {/* Numbered Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((p, idx) => {
            if (p === '...') {
              return (
                <span key={`ellipsis-${idx}`} className="px-1 text-zinc-600">
                  ...
                </span>
              );
            }
            const isCurrent = currentPage === p;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition flex items-center justify-center ${
                  isCurrent
                    ? 'bg-[#22c55e] text-black font-extrabold shadow-sm shadow-[#22c55e]/40 ring-1 ring-[#22c55e]'
                    : 'bg-black/50 border border-zinc-800 text-zinc-300 hover:text-white hover:border-[#22c55e]/40'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        {/* Next Page Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2.5 py-1 rounded-lg bg-black/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#22c55e]/40 disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 text-[11px]"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page Button */}
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-lg bg-black/50 border border-zinc-800 text-zinc-400 hover:text-white hover:border-[#22c55e]/40 disabled:opacity-30 disabled:pointer-events-none transition"
          title="Last Page"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
