import React from 'react';
import Link from 'next/link';
import { Zap, Terminal, Github, Linkedin, ArrowRight } from 'lucide-react';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#080c08] text-slate-100 font-mono flex flex-col justify-between selection:bg-[#22c55e] selection:text-black">
      {/* Public Top Header */}
      <header className="border-b border-[#22c55e]/20 bg-[#080c08]/90 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-[#22c55e] text-black font-extrabold flex items-center justify-center shadow-md shadow-[#22c55e]/30 group-hover:scale-105 transition-transform">
              <Zap className="w-4 h-4 stroke-[3]" />
            </div>
            <div>
              <span className="font-extrabold text-sm tracking-wider text-emerald-400">
                SIGNALFORGE
              </span>
              <span className="hidden sm:inline text-[10px] text-zinc-500 font-mono ml-2">
                Tech Intelligence Platform
              </span>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
            <Link href="/articles" className="hover:text-emerald-300 transition">
              Articles
            </Link>
            <Link href="/about" className="hover:text-emerald-300 transition">
              About
            </Link>
            <Link href="/contact" className="hover:text-emerald-300 transition">
              Contact
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-xs px-3 py-1.5 text-zinc-300 hover:text-white transition"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-lg bg-[#22c55e] text-black font-bold hover:bg-emerald-400 transition shadow-sm shadow-[#22c55e]/25"
            >
              <span>Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main Public Content */}
      <div className="flex-1">{children}</div>

      {/* Global Public Footer */}
      <footer className="border-t border-[#22c55e]/20 bg-[#060806] text-xs text-zinc-400 pt-12 pb-8 px-4 sm:px-8 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[#22c55e] text-black font-bold flex items-center justify-center text-xs">
                SF
              </div>
              <span className="font-bold text-sm text-slate-100 tracking-wider">SIGNALFORGE</span>
            </div>
            <p className="text-zinc-500 text-[11px] leading-relaxed">
              Discover. Understand. Create. Engage. Grow.
              <br />
              The technology intelligence and personal brand engineering suite for senior practitioners.
            </p>
          </div>

          {/* Col 2 */}
          <div className="space-y-2 text-[11px]">
            <span className="font-bold text-slate-200 uppercase tracking-wider block font-mono">
              SignalForge
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/about" className="hover:text-emerald-400 transition">
                  About the Platform
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-emerald-400 transition">
                  Technical Articles
                </Link>
              </li>
              <li>
                <Link href="/author/abhishekgarg" className="hover:text-emerald-400 transition">
                  Staff Engineer Portfolio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-emerald-400 transition">
                  Console Command Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2 text-[11px]">
            <span className="font-bold text-slate-200 uppercase tracking-wider block font-mono">
              Explore
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/articles" className="hover:text-emerald-400 transition">
                  Speculative Decoding & Inference
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-emerald-400 transition">
                  eBPF Linux Kernel Tracing
                </Link>
              </li>
              <li>
                <Link href="/articles" className="hover:text-emerald-400 transition">
                  Tiered WAL Storage Engines
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-emerald-400 transition">
                  Partner with Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4 */}
          <div className="space-y-2 text-[11px]">
            <span className="font-bold text-slate-200 uppercase tracking-wider block font-mono">
              Legal & Trust
            </span>
            <ul className="space-y-1.5">
              <li>
                <Link href="/privacy" className="hover:text-emerald-400 transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-emerald-400 transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-emerald-400 transition">
                  AI Content Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-zinc-900 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-zinc-600 gap-2">
          <span>&copy; {currentYear} SignalForge. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span className="text-emerald-500">Theme: Cyber / Developer</span>
            <span>Zero Slop Architecture</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
