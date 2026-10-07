'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ApiSpinner, TopProgress } from '@/components/ui/SkeletonLoader';

const ApiActivityContext = createContext(0);

const listeners = new Set<(count: number) => void>();
let depth = 0;
let installed = false;

function emit() {
  listeners.forEach((listener) => listener(depth));
}

function requestUrl(input: RequestInfo | URL) {
  if (typeof input === 'string') return input;
  if (input instanceof URL) return input.toString();
  return input.url;
}

function ensureFetchTracker() {
  if (installed || typeof window === 'undefined') return;
  installed = true;
  const original = window.fetch.bind(window);
  window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = requestUrl(input);
    const track = url.includes('/api/');
    if (track) {
      depth += 1;
      emit();
    }
    try {
      return await original(input, init);
    } finally {
      if (track) {
        depth = Math.max(0, depth - 1);
        emit();
      }
    }
  };
}

export function useApiActivity() {
  return useContext(ApiActivityContext);
}

export function AppLoaders({ children }: { children: React.ReactNode }) {
  const [pending, setPending] = useState(0);

  useEffect(() => {
    ensureFetchTracker();
    const listener = (count: number) => setPending(count);
    listeners.add(listener);
    listener(depth);
    return () => {
      listeners.delete(listener);
    };
  }, []);

  return (
    <ApiActivityContext.Provider value={pending}>
      <TopProgress active={pending > 0} />
      {pending > 0 && (
        <div className="fixed bottom-4 left-1/2 z-[80] -translate-x-1/2 rounded-full border border-[#22c55e]/40 bg-[#0e1710] px-3 py-2 shadow-lg shadow-black/40">
          <ApiSpinner label="Loading" />
        </div>
      )}
      {children}
    </ApiActivityContext.Provider>
  );
}
