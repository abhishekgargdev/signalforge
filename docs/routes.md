# SignalForge Application Routes Specification

All routes follow the Next.js App Router structure:

### Dashboard & Workspace Routes
- `/dashboard` — Master command center (Today's Actions, Trending Signals, Pipeline, Recent Performance)
- `/discover` — Trending tech topics, signals, and curated sources
- `/discover/topics/[id]` — Deep topic analysis, timeline, and content angles
- `/companies` — Monitored companies, tech stacks, and hiring signals
- `/companies/[id]` — Detailed company dossier and key people
- `/companies/people` — Monitored tech leaders and decision makers
- `/engagement` — High-priority post opportunities from target companies
- `/engagement/[id]` — AI post analysis and multi-angle comment generator
- `/engagement/relationships` — Professional CRM pipeline
- `/content` — Content pipeline kanban board
- `/content/new` — 10-step content creation wizard
- `/content/carousel` — Visual multi-slide carousel builder
- `/content/calendar` — Month, week, and list publication calendar
- `/articles` — Technical articles and editorial repository
- `/articles/new` — Split-screen technical article editor with SEO
- `/media` — Cloudinary media library
- `/media/generate` — AI image and cover art studio
- `/social` — Connected accounts and cross-platform queue
- `/knowledge` — Personal experience vault & project architecture library
- `/career` — Career signals, target roles, and skill alignment
- `/analytics` — Traffic, impressions, engagement, and follower metrics
- `/ai` — AI prompts, generation history, and model settings
- `/settings` — Profile, brand style, integrations, notifications, and security

### Public Routes
- `/` — SignalForge homepage & interactive feature preview
- `/articles/[slug]` — High-readability public technical article
- `/author/[username]` — Public engineer portfolio & published signals
- `/about` — About the SignalForge platform
- `/contact` — Contact & feedback
- `/privacy` — Privacy policy
- `/terms` — Terms of service

### System & State Routes
- `loading.tsx` — Global and module skeleton loading states
- `error.tsx` — Interrupted signal error boundary
- `not-found.tsx` — Custom 404 signal-not-found screen
