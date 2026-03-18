'use client';

import React, { useState } from 'react';
import {
  Image as ImageIcon,
  UploadCloud,
  Sparkles,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  Layers,
  Search,
  Filter
} from 'lucide-react';

export function MediaView() {
  const [activeTab, setActiveTab] = useState<'library' | 'generator'>('library');
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Cloudinary media assets
  const [assets, setAssets] = useState([
    {
      id: 'med-1',
      title: 'Speculative Decoding Inference Architecture',
      format: 'PNG',
      dimensions: '1200x630',
      size: '240 KB',
      folder: 'Article Covers',
      url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&h=630&fit=crop',
    },
    {
      id: 'med-2',
      title: 'Kafka KRaft Ring Buffer Observability',
      format: 'PNG',
      dimensions: '1080x1080',
      size: '310 KB',
      folder: 'Social Slides',
      url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&h=630&fit=crop',
    },
    {
      id: 'med-3',
      title: 'Postgres Tiered WAL Page Server Blueprint',
      format: 'WEBP',
      dimensions: '1920x1080',
      size: '180 KB',
      folder: 'Infographics',
      url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=630&fit=crop',
    },
  ]);

  // Image prompt generator state
  const [promptTopic, setPromptTopic] = useState('Speculative decoding memory-bandwidth throughput in GPU clusters');
  const [visualStyle, setVisualStyle] = useState('Cyber Technical Diagram');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedPrompt, setGeneratedPrompt] = useState(
    'Isometric technical architecture diagram of a high-throughput GPU cluster, glowing green memory bus traces representing speculative draft model validation, dark carbon background, clean architectural wireframe lines, ultra-sharp vector details.'
  );

  const handleCopyUrl = (url: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#22c55e]/20 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#22c55e]" />
            <h1 className="text-xl font-bold text-slate-100">
              Media Library & Cloudinary Asset Engine
            </h1>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Store, transform, and generate production-grade technical diagrams, article covers, and slide assets.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex p-1 rounded-lg bg-[#0e1710] border border-[#22c55e]/20 text-xs font-mono">
          <button
            onClick={() => setActiveTab('library')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'library' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Cloudinary Assets ({assets.length})
          </button>
          <button
            onClick={() => setActiveTab('generator')}
            className={`px-3 py-1 rounded transition ${
              activeTab === 'generator' ? 'bg-[#22c55e] text-black font-bold' : 'text-zinc-400 hover:text-white'
            }`}
          >
            AI Prompt Studio
          </button>
        </div>
      </div>

      {/* VIEW 1: Asset Library */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Upload Dropzone Simulator */}
          <div className="p-6 rounded-xl border-2 border-dashed border-[#22c55e]/30 bg-[#0e1710] hover:border-[#22c55e]/60 transition text-center space-y-2 cursor-pointer">
            <UploadCloud className="w-8 h-8 text-[#22c55e] mx-auto animate-bounce" />
            <div className="font-bold text-sm text-slate-200">
              Drop images or click to upload to Cloudinary
            </div>
            <p className="text-xs text-zinc-500 font-mono">
              Auto-formats to WEBP / AVIF with dynamic CDN edge delivery
            </p>
          </div>

          {/* Asset Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.map((asset) => (
              <div
                key={asset.id}
                className="rounded-xl bg-[#0e1710] border border-[#22c55e]/20 overflow-hidden space-y-3 p-3 flex flex-col justify-between"
              >
                <div className="h-40 rounded-lg overflow-hidden bg-black/60 relative group">
                  {/* Image render */}
                  <img
                    src={asset.url}
                    alt={asset.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute bottom-2 left-2 px-1.5 py-0.5 rounded bg-black/80 font-mono text-[9px] text-emerald-300 border border-zinc-800">
                    {asset.dimensions} • {asset.format}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-xs text-slate-200 truncate">{asset.title}</h4>
                  <div className="text-[10px] font-mono text-zinc-500 flex items-center justify-between mt-1">
                    <span>{asset.folder}</span>
                    <span>{asset.size}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <button
                    onClick={() => handleCopyUrl(asset.url)}
                    className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-mono"
                  >
                    {copiedUrl === asset.url ? <Check className="w-3 h-3 text-[#22c55e]" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedUrl === asset.url ? 'Copied' : 'Copy CDN URL'}</span>
                  </button>
                  <a
                    href={asset.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-zinc-500 hover:text-white"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 2: AI Image Prompt Generator */}
      {activeTab === 'generator' && (
        <div className="p-6 rounded-xl bg-[#0e1710] border border-[#22c55e]/30 space-y-6">
          <div className="border-b border-[#22c55e]/20 pb-3">
            <h3 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#22c55e]" />
              Technical Prompt Studio for Cover Art & Infographics
            </h3>
            <p className="text-xs text-zinc-400">
              Generate precise, domain-authentic prompts that avoid generic AI slop.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-mono text-zinc-400 block mb-1">Architecture Topic:</label>
              <input
                type="text"
                value={promptTopic}
                onChange={(e) => setPromptTopic(e.target.value)}
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Visual Style:</label>
              <select
                value={visualStyle}
                onChange={(e) => setVisualStyle(e.target.value)}
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none"
              >
                <option>Cyber Technical Diagram</option>
                <option>Minimalist Travertine Studio</option>
                <option>Editorial Vector Blueprint</option>
                <option>Hardware Circuit Cross-Section</option>
              </select>
            </div>

            <div>
              <label className="font-mono text-zinc-400 block mb-1">Aspect Ratio:</label>
              <select
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full p-2.5 rounded bg-black/50 border border-[#22c55e]/30 text-slate-200 font-mono focus:outline-none"
              >
                <option>16:9 (Hero / Article Banner)</option>
                <option>1:1 (LinkedIn Square / Carousel)</option>
                <option>4:3 (Technical Card)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-emerald-400 block mb-1.5 text-xs">
              Synthesized High-Fidelity Prompt:
            </label>
            <div className="p-4 rounded-lg bg-black/60 border border-[#22c55e]/30 font-mono text-xs text-slate-300 leading-relaxed">
              {generatedPrompt}
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] font-mono text-zinc-500">
              Ready to feed directly to Cloudinary or image synthesis pipeline
            </span>
            <button
              onClick={() => handleCopyUrl(generatedPrompt)}
              className="px-4 py-1.5 rounded bg-[#22c55e] text-black font-bold text-xs hover:bg-emerald-400 transition flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Image Prompt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
