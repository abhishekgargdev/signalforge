# SignalForge Design System Specification

## Visual Themes & Design Tokens

SignalForge supports dynamic theme configuration with semantic CSS variables and design tokens, adhering to the anti-slop, high-information-density principles for software engineers and technology leaders.

### Theme Variations
1. **Modern Dark AI**: Deep slate/zinc `#090d16`, electric cyan accent `#06b6d4`, violet highlights `#8b5cf6`, crisp high-contrast text.
2. **Premium SaaS**: Refined obsidian `#0f172a`, emerald signal `#10b981`, indigo branding `#6366f1`, subtle borders.
3. **Minimal Professional**: Balanced monochrome with warm slate `#1e293b`, surgical cobalt `#2563eb`, high clarity.
4. **Cyber/Developer**: Terminal black `#0a0e14`, phosphor matrix green `#10b981`, amber alerts `#f59e0b`, jet-brains monospace accents.
5. **Glassmorphism**: Translucent frosted panels `backdrop-blur-md`, subtle specular borders `rgba(255,255,255,0.08)`, futuristic depth.
6. **Light Editorial**: Crisp warm alabaster `#f8fafc`, editorial typography, deep navy headings `#0f172a`, tech journalism aesthetics.
7. **Dark + Neon**: Pitch void `#050508`, vibrant neon fuchsia `#ec4899` & neon cyan `#00f2fe`, high-energy developer aesthetics.
8. **Custom Theme**: User-tunable primary color, secondary color, surface luminance, border-radius, font-family, density, and animation scale.

---

## Typography Scale
- **Headings**: Inter / Outfit / JetBrains Mono (customizable)
  - Display: `text-4xl` / `text-5xl`, tracking tight, font-bold
  - Page Title: `text-2xl` / `text-3xl`, font-semibold
  - Section Title: `text-lg` / `text-xl`, font-semibold
  - Card Header: `text-base` / `text-md`, font-medium
- **Body**:
  - Regular: `text-sm`, leading-relaxed
  - Small / Caption: `text-xs`, tracking-normal
  - Monospace (Code / Signals): `font-mono text-xs` / `text-sm`

---

## Spacing & Density
- **Compact**: 4px base grid, condensed padding for high data throughput (monitoring terminals, CRM tables).
- **Default**: 6px-8px base grid, balanced SaaS workspace.
- **Comfortable**: 12px base grid, reading and long-form editorial views.

---

## Component Standards
- **Buttons**: Primary, Secondary, Outline, Ghost, AI Glow, Destructive. All support Loading, Success, Error, and Disabled states.
- **Cards**: Surface with 1px border, subtle shadow, interactive hover highlight.
- **Inputs**: Semantic focus ring, leading icon slot, trailing validation badge.
- **Badges**: Status pills with dot indicators (Draft, Researching, Review, Scheduled, Published, Verified Signal).
