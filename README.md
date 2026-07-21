# Shri Parasram Holdings — Panipat

Production website for **Shri Parasram Holdings Pvt. Ltd.**, a SEBI-registered stockbroker
operating in Panipat, Haryana since 1970.

**Live:** [www.sphpnp.com](https://www.sphpnp.com)

Beyond a marketing site, this is a client-facing market-data application: live NSE prices,
an AI-assisted equity research tool, a stock screener, an F&O dashboard, and a set of
investor calculators — backed by Supabase Postgres and Deno edge functions.

---

## Features

| Area | What it does |
|---|---|
| **AI stock analysis** | Multi-provider research reports and Q&A over live market data, with a fallback cascade across OpenRouter, Groq, Gemini and Cerebras |
| **Market data** | Live quotes, charts, F&O dashboard, circuit watch, bulk/block deals, FII/DII flows, IPO tracker, results calendar |
| **Screener** | Filterable equity screener over an EOD bhavcopy dataset synced nightly from NSE |
| **Calculators** | Brokerage, margin, and SIP calculators |
| **Content** | Blog/articles, learning centre, daily research, Telegram-driven announcements |
| **Compliance** | Investor Corner, SEBI disclosures, policy documents, holiday calendar |
| **Admin** | Password-gated panels for unlisted shares, banners, and site content |

The site is server-prerendered at build time for SEO, ships as a PWA, and supports
multiple languages.

---

## Tech stack

**Frontend** — Vite · React 18 · TypeScript · Tailwind CSS · shadcn/ui · React Router ·
TanStack Query · Recharts · Zod

**Backend** — Supabase (Postgres + Auth + Storage) and 14 Deno edge functions

**Infra** — Vercel (hosting) · GitHub Actions (CI + scheduled data syncs) · Docker + nginx
(self-host option)

---

## Getting started

Requires **Node.js 22+**.

```sh
git clone https://github.com/AdityaRajGoel/panipat-investments-hub
cd panipat-investments-hub
npm install
cp .env.example .env    # then fill in your Supabase values
npm run dev
```

The dev server runs on <http://localhost:8080>.

### Environment

Only `VITE_*` variables belong in `.env`. They are **embedded in the client bundle and are
public by design** — the Supabase anon key is safe to expose because every table is
protected by Row Level Security.

```sh
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-anon-public-key
VITE_SUPABASE_PROJECT_ID=your-project-id
```

Server-side secrets are **never** stored in this repo or in `.env`. They are read via
`Deno.env` inside edge functions and set as Supabase secrets:

```sh
supabase secrets set OPENROUTER_API_KEY=...   # primary AI provider
supabase secrets set GROQ_API_KEY=...         # + _SECOND/_THIRD/_FOURTH for quota rotation
supabase secrets set GEMINI_API_KEY=...       # + _SECOND
supabase secrets set SYNC_SECRET=...          # guards the scheduled sync functions
supabase secrets set TELEGRAM_BOT_TOKEN=...
supabase secrets set TELEGRAM_WEBHOOK_SECRET=...
supabase secrets set ADMIN_PASSWORD=...
```

See [`.env.example`](.env.example) for the full annotated list.

---

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production build, then sitemap + prerender + IndexNow submit |
| `npm run preview` | Serve the production build locally |
| `npm test` | Unit tests (Vitest) |
| `npm run test:e2e` | End-to-end tests (Playwright) |
| `npm run lint` | ESLint |
| `npm run analyze` | Build with bundle-size visualiser |

---

## Project structure

```
src/
├── components/        # 55 feature components + ui/ (49 shadcn primitives), admin/, header/
├── pages/             # 33 routed pages
├── hooks/             # shared React hooks
├── integrations/      # Supabase client + generated DB types
├── i18n/              # language context and config
└── lib/               # utilities

supabase/
├── functions/         # 14 Deno edge functions
└── migrations/        # SQL schema migrations

scripts/               # sitemap generation, prerendering, IndexNow
e2e/                   # Playwright specs
```

### Edge functions

Data fetchers (`fetch-*`) proxy and cache third-party market data. Sync jobs
(`sync-market-feed`, `sync-bhavcopy`) are triggered on a cron by GitHub Actions and write
with the service-role key — both are guarded by `SYNC_SECRET`. `ai-stock-analysis` runs the
provider cascade and is rate-limited per client. `telegram-webhook` ingests channel posts
and verifies Telegram's `X-Telegram-Bot-Api-Secret-Token`.

---

## Testing & CI

CI runs on every push to `main` and on pull requests: typecheck, unit tests, production
build, Playwright smoke tests, and a Docker image build. Two scheduled workflows trigger
the NSE data syncs on weekday evenings (IST).

```sh
npm test           # unit
npm run test:e2e   # e2e (builds first)
npx tsc --noEmit   # typecheck
```

---

## Self-hosting

```sh
docker compose up --build   # → http://localhost:8090
```

Builds the Vite app and serves it via nginx.

---

## Security

- Every Postgres table has **Row Level Security** enabled; the anon key grants no
  privileged access.
- Privileged work happens in edge functions using the service-role key, which is injected
  by the Supabase runtime and never committed.
- Functions running with `verify_jwt = false` (`telegram-webhook`, `sync-*`) authenticate
  via their own shared secrets and **fail closed** if those secrets are unset.
- No credentials belong in this repository. `.env` is gitignored.

Found a security issue? Please report it privately to the maintainer rather than opening a
public issue.

---

## License

**Proprietary — all rights reserved.** See [`LICENSE`](LICENSE).

This source is published for transparency, security review, and reference. It is *not*
open source: no permission is granted to deploy, redistribute, or create derivative works.
Third-party dependencies remain under their own licenses.

Nothing here constitutes investment advice.
