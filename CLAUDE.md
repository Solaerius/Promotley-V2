# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

<!-- rtk-instructions v2 -->
# RTK (Rust Token Killer) - Token-Optimized Commands

## Golden Rule

**Always prefix commands with `rtk`**. If RTK has a dedicated filter, it uses it. If not, it passes through unchanged. This means RTK is always safe to use.

**Important**: Even in command chains with `&&`, use `rtk`:
```bash
# ❌ Wrong
git add . && git commit -m "msg" && git push

# ✅ Correct
rtk git add . && rtk git commit -m "msg" && rtk git push
```

## RTK Commands by Workflow

### IMPORTANT RTK INSTRUCTIONS
When running rtk "filepath" you NEED to use forward slashes "/" instead of backward slashes "\". For example /Documents/Claude/promotley-93f7ced5 becomes /Documents/Claude/promotley-93f7ced5

### Build & Compile (80-90% savings)
```bash
rtk cargo build         # Cargo build output
rtk cargo check         # Cargo check output
rtk cargo clippy        # Clippy warnings grouped by file (80%)
rtk tsc                 # TypeScript errors grouped by file/code (83%)
rtk lint                # ESLint/Biome violations grouped (84%)
rtk prettier --check    # Files needing format only (70%)
rtk next build          # Next.js build with route metrics (87%)
```

### Test (90-99% savings)
```bash
rtk cargo test          # Cargo test failures only (90%)
rtk vitest run          # Vitest failures only (99.5%)
rtk playwright test     # Playwright failures only (94%)
rtk test <cmd>          # Generic test wrapper - failures only
```

### Git (59-80% savings)
```bash
rtk git status          # Compact status
rtk git log             # Compact log (works with all git flags)
rtk git diff            # Compact diff (80%)
rtk git show            # Compact show (80%)
rtk git add             # Ultra-compact confirmations (59%)
rtk git commit          # Ultra-compact confirmations (59%)
rtk git push            # Ultra-compact confirmations
rtk git pull            # Ultra-compact confirmations
rtk git branch          # Compact branch list
rtk git fetch           # Compact fetch
rtk git stash           # Compact stash
rtk git worktree        # Compact worktree
```

Note: Git passthrough works for ALL subcommands, even those not explicitly listed.

### GitHub (26-87% savings)
```bash
rtk gh pr view <num>    # Compact PR view (87%)
rtk gh pr checks        # Compact PR checks (79%)
rtk gh run list         # Compact workflow runs (82%)
rtk gh issue list       # Compact issue list (80%)
rtk gh api              # Compact API responses (26%)
```

### JavaScript/TypeScript Tooling (70-90% savings)
```bash
rtk pnpm list           # Compact dependency tree (70%)
rtk pnpm outdated       # Compact outdated packages (80%)
rtk pnpm install        # Compact install output (90%)
rtk npm run <script>    # Compact npm script output
rtk npx <cmd>           # Compact npx command output
rtk prisma              # Prisma without ASCII art (88%)
```

### Files & Search (60-75% savings)
```bash
rtk ls <path>           # Tree format, compact (65%)
rtk read <file>         # Code reading with filtering (60%)
rtk grep <pattern>      # Search grouped by file (75%)
rtk find <pattern>      # Find grouped by directory (70%)
```

### Analysis & Debug (70-90% savings)
```bash
rtk err <cmd>           # Filter errors only from any command
rtk log <file>          # Deduplicated logs with counts
rtk json <file>         # JSON structure without values
rtk deps                # Dependency overview
rtk env                 # Environment variables compact
rtk summary <cmd>       # Smart summary of command output
rtk diff                # Ultra-compact diffs
```

### Infrastructure (85% savings)
```bash
rtk docker ps           # Compact container list
rtk docker images       # Compact image list
rtk docker logs <c>     # Deduplicated logs
rtk kubectl get         # Compact resource list
rtk kubectl logs        # Deduplicated pod logs
```

### Network (65-70% savings)
```bash
rtk curl <url>          # Compact HTTP responses (70%)
rtk wget <url>          # Compact download output (65%)
```

### Meta Commands
```bash
rtk gain                # View token savings statistics
rtk gain --history      # View command history with savings
rtk discover            # Analyze Claude Code sessions for missed RTK usage
rtk proxy <cmd>         # Run command without filtering (for debugging)
rtk init                # Add RTK instructions to CLAUDE.md
rtk init --global       # Add RTK to ~/.claude/CLAUDE.md
```



## Token Savings Overview

| Category | Commands | Typical Savings |
|----------|----------|-----------------|
| Tests | vitest, playwright, cargo test | 90-99% |
| Build | next, tsc, lint, prettier | 70-87% |
| Git | status, log, diff, add, commit | 59-80% |
| GitHub | gh pr, gh run, gh issue | 26-87% |
| Package Managers | pnpm, npm, npx | 70-90% |
| Files | ls, read, grep, find | 60-75% |
| Infrastructure | docker, kubectl | 85% |
| Network | curl, wget | 65-70% |

Overall average: **60-90% token reduction** on common development operations.
<!-- /rtk-instructions -->


## IMPORTANT INSTRUCTIONS

- Before writing ANY code using external libraries, use **Context7 MCP tools** to pull latest docs — never assume API shape.
- For all frontend/UI work, invoke the **`ui-ux-pro-max`** skill and **`frontend-design`** skill.
- When writing Swedish text, ALWAYS use correct letters: **Å, Ä, Ö** — never substitute with "a" or "o".
- UI text, toasts, validation errors, and all user-facing copy must be in **Swedish**.

---

## Commands

```bash
npm run dev          # Start dev server on port 8080
npm run build        # Production build
npm run build:dev    # Dev-mode production build (with source maps)
npm run lint         # Run ESLint
npm run preview      # Preview production build
```

## Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_DEV_EMAIL       # Optional: auto-login in dev
VITE_DEV_PASSWORD    # Optional: auto-login in dev
```

---

## Product Domain

Promotely is a SaaS platform for **Swedish UF (Ungdomsföretag)** companies — youth entrepreneurship firms. The AI system provides UF-specific guidance (rules, competition criteria, business plans, sales events). Users are primarily high school students running small companies.

---

## Architecture

**Stack**: React 18 + TypeScript + Vite, Tailwind CSS + shadcn-ui, Supabase (auth + DB + real-time + edge functions), React Query, Framer Motion.

**Path alias**: `@/` → `src/`

### Routing (`src/App.tsx`)

40+ routes in three tiers:

| Guard | Routes |
|-------|--------|
| Public | `/`, `/auth`, `/pricing`, `/demo`, legal pages |
| `ProtectedRoute` | `/dashboard`, `/calendar`, `/analytics`, `/account`, `/organization/*` |
| `ProtectedRoute` + `RequireVerifiedEmail` | `/ai/*` |
| `AdminRoute` | `/admin/*` |

All dashboard/AI/admin routes are **lazy-loaded** via `React.lazy` + `Suspense`. Public/auth pages are eager.

**Adding a new route**: Create `src/pages/MyPage.tsx` → add `const MyPage = React.lazy(() => import('./pages/MyPage'))` → add `<Route>` in App.tsx with the appropriate guard.

### Auth (`src/hooks/useAuth.tsx`)

`AuthProvider` wraps the entire app. Email/password + OAuth (Google, Meta/Facebook). Sessions persist via Supabase Auth localStorage. Three route guards: `ProtectedRoute`, `RequireVerifiedEmail`, `AdminRoute`.

OAuth callback handled at `/auth/callback`.

### AI System

- **Model tiers** (`src/lib/modelTiers.ts`): Fast (Gemini Flash Lite), Standard (Gemini Flash), Premium (Gemini Pro)
- **Credit flow** (`src/lib/creditSystem.ts`): `reserveCredits()` → call AI → `settleCredits()` or `rollbackReservation()` on error. Uses `requestId` for idempotency.
- **AI hook** (`src/hooks/useAIAssistant.ts`): Manages messages, sends to edge function, fires `creditUpdateEvent` on completion
- **Plan config** (`src/lib/planConfig.ts`): Starter/Growth/Pro tiers with credit allowances and model mappings

**Edge function calls**:
```ts
supabase.functions.invoke('ai-assistant/chat', { body: { message, requestId, ... } })
supabase.functions.invoke('calendar', { body: { action: 'context' } })
supabase.functions.invoke('calendar', { body: { action: 'bulk_create', events: [...] } })
supabase.functions.invoke('generate-ai-analysis', { body: { category: 'uf_rules', ... } })
```

### AI Knowledge Base (RAG)

UF-specific AI guidance is stored in the `ai_knowledge` Supabase table (not in code).

- **Table**: `public.ai_knowledge` — columns: `title`, `content`, `category`, `updated_at`
- **Categories**: `uf_rules`, `competition_criteria`, `annual_report`, `business_plan`, `pitch_requirements`, `sales_events`, `budget_templates`
- **Storage bucket**: `promotley_knowledgebase` — stores source PDFs/docs
- Edge functions query this table to build the system prompt before each AI request. See `PROMOTELY_AI_KNOWLEDGE_SETUP.md` for setup guide.

### Data Layer

- **Supabase client**: `src/integrations/supabase/client.ts` — auto-generated, do not edit
- **DB types**: `src/integrations/supabase/types.ts` — auto-generated, do not edit manually
- **Query wrapper**: `src/hooks/useSupabaseQuery.ts` — prefer this over direct React Query usage
- React Query for async state; React Context for Auth, Notifications, Organizations

**Key tables**: `ai_conversations`, `ai_chat_messages`, `calendar_events`, `notifications`, `organizations`, `organization_members`, `ai_knowledge`

Real-time: `useNotifications` subscribes to INSERT on `notifications` table via Supabase channel.

### Key Hooks Reference

| Hook | Purpose |
|------|---------|
| `useAuth` | Auth context: sign in/up/out, OAuth, session |
| `useAIAssistant` | AI chat messages, send, implement plans |
| `useSupabaseQuery` | Generic Supabase query + loading/error |
| `useOrganization` | Org/team management, members, invites, credits |
| `useNotifications` | Real-time notification subscription |
| `useCalendar` | Calendar events CRUD |
| `useUserCredits` | Credit balance tracking |
| `useMarketingPlan` | Marketing plan creation |
| `useSalesRadar` | Sales radar tracking |
| `useTikTokData` | TikTok profile/analytics |
| `useMetaData` | Meta/Facebook platform data |
| `useFreeTierUsage` | Free tier usage limits |
| `useAdminStatus` | Admin role check |
| `useLanguage` | Language/locale state |
| `useConversations` | AI conversation history |

### Styling

- Tailwind + CSS variables (HSL-based) in `src/index.css`
- Brand color: magenta-pink (`--primary: 326 56% 37%`)
- Dark mode: wine-based theme (`--background: 347 40% 5%`) via `next-themes` class toggle
- Custom font: Poppins
- Surface tokens: `surface-base`, `surface-raised`, `surface-overlay`, `surface-elevated`, `surface-muted`
- Animation utilities: `fade-in`, `slide-up`, `blur-in`, `bounce-in` (defined in `tailwind.config.ts`)

### Payment

- **Stripe**: `src/lib/stripeConfig.ts`, checkout at `/checkout`, admin at `/admin/stripe`
- **Swish** (Swedish): `src/lib/swishConfig.ts`, admin at `/admin/swish`

### Localization

- i18next with `src/locales/sv.json` (Swedish) and `src/locales/en.json`
- Default language: Swedish (`sv`), saved to `localStorage` as `i18n_lang`
- **When adding new UI text**: add key to both `sv.json` and `en.json`, use `useTranslation()` hook
- All user-facing text must go through i18n — no hardcoded strings in Swedish

### TypeScript

Config is intentionally lenient (`noImplicitAny: false`, `strictNullChecks: false`). Don't introduce stricter checks without user direction.

---

## Gotchas

- **Credit system is in-memory only** — `creditSystem.ts` uses a JS Map, not Redis. On server restart all reservations are lost. Don't design features that depend on persistent reservation state.
- **Email verification gate** — `/ai/*` routes require verified email (`RequireVerifiedEmail`). If a user can't access AI tools, check this first.
- **Auto-generated files** — Never edit `src/integrations/supabase/client.ts` or `types.ts` by hand. Regenerate via Supabase CLI or Lovable Cloud.
- **Model tier enforcement is server-side** — `planConfig.ts` maps plans to models. The client can select tiers but the edge function validates against the user's plan. Don't rely on client-side enforcement.
- **Lazy-loading** — All dashboard/AI/admin pages must be lazy-loaded. Forgetting `React.lazy` will bloat the initial bundle.
- **RTK paths use forward slashes** — When using `rtk` with file paths on Windows, use `/` not `\`.
- **Supabase RLS** — All new tables need Row Level Security policies. Missing RLS will block queries for authenticated users.
- **`ai_knowledge` categories must match exactly** — Category strings like `uf_rules` are matched with `.eq()`. A mismatch (e.g. `uf-rules`) silently returns no results, causing generic AI responses.
