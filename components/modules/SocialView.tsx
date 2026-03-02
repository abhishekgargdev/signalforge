'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Share2 } from 'lucide-react';

export function SocialView() {
  const [accounts, setAccounts] = useState<{ provider: string; displayName: string }[]>([]);

  useEffect(() => {
    fetch('/api/accounts')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAccounts(data.data.accounts || []);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="space-y-6">
      <div className="border-b border-[#22c55e]/20 pb-4">
        <div className="flex items-center gap-2">
          <Share2 className="w-5 h-5 text-[#22c55e]" />
          <h1 className="text-xl font-bold text-slate-100">Social queue</h1>
        </div>
        <p className="text-xs text-zinc-400 mt-1">Accounts connected in Settings appear here.</p>
      </div>

      {accounts.length === 0 ? (
        <div className="p-10 rounded-xl bg-[#0e1710] border border-[#22c55e]/20 text-center space-y-3">
          <p className="text-sm text-zinc-400 font-mono">No social accounts connected</p>
          <Link href="/settings" className="text-xs text-emerald-400 hover:underline">
            Connect LinkedIn or X in Settings
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {accounts.map((account) => (
            <div key={account.provider} className="p-4 rounded-xl bg-[#0e1710] border border-[#22c55e]/20">
              <div className="font-bold text-sm text-slate-200 capitalize">{account.provider}</div>
              <div className="text-xs text-zinc-400 font-mono mt-1">{account.displayName || 'Connected'}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
