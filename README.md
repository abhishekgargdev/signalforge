# SignalForge

SignalForge is a workspace for technology research, content, company tracking, and career signals. Public pages are readable without an account. The workspace requires a session.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and fill in the values below. Do not commit `.env`.
3. Start the app: `npm run dev`

The app expects MongoDB at `MONGODB_URI`. Signup, login, and saved records use that database.

## Environment

- **App:** `NEXT_PUBLIC_APP_URL`, `AUTH_SECRET`, `ENCRYPTION_KEY`, `CRON_SECRET`
- **MongoDB:** `MONGODB_URI`
- **Gemini:** `GEMINI_API_KEY_1` through `GEMINI_API_KEY_6`, `GEMINI_MODEL`, `GEMINI_IMAGE_MODEL`. Requests try these keys in order.
- **NVIDIA:** `NVIDIA_API_KEY`, `NVIDIA_MODEL`, `NVIDIA_IMAGE_API_KEY`, `NVIDIA_IMAGE_MODEL`. Used when Gemini quota or errors exhaust the key list.
- **Groq:** `GROQ_API_KEY`, `GROQ_MODEL`. Used after NVIDIA.
- **Cloudinary:** `CLOUDINARY_URL` or `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`. The browser uses `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`.
- **LinkedIn:** `LINKEDIN_CLIENT_ID`, `LINKEDIN_CLIENT_SECRET`, `LINKEDIN_REDIRECT_URI` (default callback `/api/accounts/linkedin/callback`).
- **X:** `X_CLIENT_ID`, `X_CLIENT_SECRET`, `X_REDIRECT_URI` (default callback `/api/accounts/x/callback`).
- **Email:** `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `MAIL_FROM`. Contact, email verification, and password reset send table-based HTML through Nodemailer and EJS.

## Routes

Public: `/`, `/about`, `/contact`, `/privacy`, `/terms`, `/disclaimer`, `/articles`, `/articles/[slug]`, `/author/[username]`, and the auth pages under `/login`, `/signup`, `/forgot-password`, `/reset-password`, `/verify-email`.

Private (session cookie required): `/dashboard`, `/discover`, `/companies`, `/engagement`, `/prospector`, `/content`, `/dashboard/articles`, `/media`, `/social`, `/knowledge`, `/career`, `/analytics`, `/ai`, `/settings`, `/notifications`.

`/topics` and `/research` redirect to Discover. `/people` redirects to Companies. `/content/new` opens the content wizard.

Connect LinkedIn and X from Settings → Integrations. Social queue only lists accounts that finished OAuth.

## Docs

Module and data notes live in `docs/modules.md`, `docs/routes.md`, `docs/database.md`, and `docs/prompts/`.
