'use client';

import React from 'react';
import {
  X,
  FilePlus,
  PenTool,
  Building,
  UserPlus,
  Brain,
  ImageIcon,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface QuickCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionKey: string) => void;
}

export function QuickCreateModal({ isOpen, onClose, onSelectAction }: QuickCreateModalProps) {
  if (!isOpen) return null;

  const actions = [
    {
      id: 'prospector-connect',
      module: 'prospector',
      title: 'Review connections',
      desc: 'People the daily run suggested you can invite',
      icon: UserPlus,
    },
    {
      id: 'new-content',
      module: 'content',
      title: 'New Content Piece',
      desc: 'Launch the 10-step wizard for LinkedIn posts or X threads',
      icon: PenTool,
    },
    {
      id: 'new-article',
      module: 'articles',
      title: 'New Technical Article',
      desc: 'Open split-screen Markdown editor with SEO metadata',
      icon: FilePlus,
    },
    {
      id: 'generate-comment',
      module: 'engagement',
      title: 'Review comments',
      desc: 'Comments prepared for posts found in the daily run',
      icon: Sparkles,
    },
    {
      id: 'add-experience',
      module: 'knowledge',
      title: 'Add STAR Experience',
      desc: 'Log engineering war stories for grounded content generation',
      icon: Brain,
    },
    {
      id: 'generate-image',
      module: 'media',
      title: 'Generate Image / Infographic',
      desc: 'Create Cloudinary-ready covers and social slide visuals',
      icon: ImageIcon,
    },
    {
      id: 'add-company',
      module: 'companies',
      title: 'Add a target company',
      desc: 'A company you want your posts and articles to reach',
      icon: Building,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-xl rounded-xl bg-[#080c08] border border-[#22c55e]/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#22c55e]/20 bg-[#0e1710] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#22c55e] animate-ping" />
            <h3 className="font-bold text-sm text-emerald-300">Quick Create Action</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Grid */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[70vh] overflow-y-auto">
          {actions.map((act) => {
            const Icon = act.icon;
            return (
              <button
                key={act.id}
                onClick={() => {
                  onSelectAction(act.module);
                  onClose();
                }}
                className="p-3.5 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/10 transition text-left group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-4 h-4 text-[#22c55e] group-hover:scale-110 transition-transform" />
                    <ArrowRight className="w-3.5 h-3.5 text-zinc-500 group-hover:text-emerald-400 group-hover:translate-x-1 transition" />
                  </div>
                  <h4 className="font-bold text-xs text-slate-200 group-hover:text-emerald-300 mb-1">
                    {act.title}
                  </h4>
                  <p className="text-[11px] text-zinc-400 leading-snug">{act.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
