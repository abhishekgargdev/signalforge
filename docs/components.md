# SignalForge Component Library Architecture

## Navigation & Structure
- `AppSidebar`: Collapsible sidebar with active section tracking, workspace picker, and quick stats.
- `AppHeader`: Search trigger (Cmd+K), quick create dropdown, AI launcher, notification bell, profile switcher.
- `Breadcrumbs`: Path-aware navigation breadcrumbs.
- `CommandPalette`: Keyboard-first modal (Cmd+K) supporting jump-to-route and immediate actions.

## Data Display & Feedback
- `StatCard`: Key metric card with delta indicator (+12%), sparklines, and contextual tooltips.
- `SignalCard`: Interactive tech signal card with freshness badge, relevance gauge, and 1-click "Create Post" action.
- `DataTable`: Responsive data table supporting multi-sort, category filter tags, search, and pagination.
- `KanbanPipeline`: Multi-lane drag/move pipeline for content stages.
- `CommentBox`: Multi-perspective comment cards with copy-to-clipboard, tone modifier, and anti-spam check.
- `RichTextEditor`: Split-screen editor with Markdown preview, code syntax highlighting, and table of contents generation.
- `SkeletonLoader`: Module-specific layout skeleton placeholders to prevent layout shift.
- `ToastProvider`: Standardized toasts for actions (Publishing, Saving, Cloudinary sync, AI completions).
