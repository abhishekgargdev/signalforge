# SignalForge UI Modules Specification

## 1. Discover & Tech Intelligence Module
- **Purpose**: Real-time identification of trending AI architectures, cloud shifts, developer tooling, and engineering leadership signals.
- **Key Views**:
  - `/discover`: High-level trend radar, freshness scoring, source citations, career alignment index.
  - `/discover/topics/[id]`: Deep topic breakdown, timeline of breakthroughs, related tech leaders, curated content angles.

## 2. Company & People CRM Module
- **Purpose**: Target company intelligence and key tech decision-maker tracking.
- **Key Views**:
  - `/companies`: Priority tiering (Tier 1 Unicorns, Tier 2 Enterprise, Seed Stage), tech stack breakdown, recent signals.
  - `/companies/[id]`: Comprehensive dossier with open target roles, tech stack signals, employee leadership, and related content.
  - `/companies/people`: Target people directory with interaction history, relationship stage, and last touchpoints.

## 3. Engagement & Comment Generator Module
- **Purpose**: Intelligent, anti-spam, high-value professional commentary for LinkedIn & X posts.
- **Key Views**:
  - `/engagement`: Feed of detected posts from tracked companies and executives.
  - `/engagement/[id]`: Full post analysis with four comment vectors: Technical Insight, Personal Perspective, Thoughtful Counter-Question, Alternative Perspective.
  - `/engagement/relationships`: CRM pipeline tracking statuses (New -> Following -> Engaged -> Replied -> Connected -> Active Dialogue).

## 4. Content Creator & Pipeline Module
- **Purpose**: 10-step wizard converting tech signals or personal engineering experiences into viral LinkedIn posts, carousels, and long-form publications.
- **Key Views**:
  - `/content`: Kanban content pipeline (Idea -> Research -> Draft -> Review -> Approved -> Scheduled -> Published).
  - `/content/new`: 10-step wizard with persistent state, hook generation, CTA generation, and fact validation.
  - `/content/carousel`: Slide generator with visual layouts, code previews, and slide count trackers.

## 5. Article & Editorial Publishing Module
- **Purpose**: Long-form technical article creation with SEO optimization and public-facing author pages.
- **Key Views**:
  - `/articles`: Article manager with status, canonical tags, view metrics, and SEO health indicators.
  - `/articles/new`: Split-screen Markdown / Rich-text editor with Table of Contents, code blocks, and metadata side-panel.
  - `/articles/[slug]`: High-readability public reading experience with responsive typography and share triggers.

## 6. Media & Cloudinary Asset Hub
- **Purpose**: Cloudinary-ready asset management, AI image prompt generation, and social card rendering.
- **Key Views**:
  - `/media`: Asset browser with folders, dimension transformations, and CDN links.
  - `/media/generate`: AI prompt studio for article covers, quotes, and technical infographics.

## 7. Knowledge & Experience Vault
- **Purpose**: Structured repository of personal engineering victories, bug war-stories, architectural decisions, and portfolio projects that ground AI content in real experience.
- **Key Views**:
  - `/knowledge/experiences`: STAR-framework problem/solution repository.
  - `/knowledge/projects`: Architecture blueprints, GitHub links, and live URLs.

## 8. Career Signals & Market Alignment
- **Purpose**: Alignment between emerging tech signals and target role requirements.
- **Key Views**:
  - `/career`: Target roles, trending skill gaps, emerging library adoption, and tailored content ideas to prove domain authority.

## 9. AI Studio Workspace
- **Purpose**: Prompt template library, generation histories, token accounting, and model selector (@google/genai).
