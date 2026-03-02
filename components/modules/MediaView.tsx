'use client';

import React, { useEffect, useState } from 'react';
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
  const [assets, setAssets] = useState<
    { id: string; title: string; format: string; dimensions: string; size: string; folder: string; url: string }[]
  >([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadAssets = () => {
    fetch('/api/v1/media')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setAssets(data.data.assets || []);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadAssets();
  }, []);

  const handleUpload = async (file: File) => {
    setUploadError(null);
    const sigRes = await fetch('/api/v1/media/upload/signature', { method: 'POST' });
    const sigData = await sigRes.json();
    if (!sigData.success) {
      setUploadError(sigData.error?.message || 'Could not sign upload');
      return;
    }
    const { signature, timestamp, cloudName, apiKey, folder } = sigData.data;
    const body = new FormData();
    body.append('file', file);
    body.append('api_key', apiKey);
    body.append('timestamp', timestamp);
    body.append('signature', signature);
    body.append('folder', folder);
    const upload = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: 'POST',
      body,
    });
    if (!upload.ok) {
      setUploadError('Cloudinary rejected the upload');
      return;
    }
    loadAssets();
  };

  // Image prompt generator state
  const [promptTopic, setPromptTopic] = useState('');
  const [visualStyle, setVisualStyle] = useState('Cyber Technical Diagram');
  const [aspectRatio, setAspectRatio] = useState('16:9');
  const [generatedPrompt, setGeneratedPrompt] = useState('');

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
          <label className="p-6 rounded-xl border-2 border-dashed border-[#22c55e]/30 bg-[#0e1710] hover:border-[#22c55e]/60 transition text-center space-y-2 cursor-pointer block">
            <UploadCloud className="w-8 h-8 text-[#22c55e] mx-auto" />
            <div className="font-bold text-sm text-slate-200">Upload an image to Cloudinary</div>
            <p className="text-xs text-zinc-500 font-mono">Signed upload using your cloud name</p>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file);
              }}
            />
          </label>
          {uploadError && <p className="text-xs text-red-300 font-mono">{uploadError}</p>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {assets.length === 0 && (
              <div className="col-span-full p-10 rounded-xl border border-white/5 bg-[#0e1710] text-center text-xs text-zinc-500 font-mono">
                No media assets yet. Upload files to populate your library.
              </div>
            )}
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
