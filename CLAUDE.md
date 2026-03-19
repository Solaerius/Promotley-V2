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
Before using or writing ANY code that requires external API docs or libraries, you MUST use the Context7 tools you have access to, to pull the lates documentation and ensure your code is up to date and accurate.

For frontend design use the skills and plugins available. Use specifically ui-ux-pro-max skill and the frontend-design.

When writing swedish you MUST use the letters "Å", "Ä", "Ö" when the word contains it instead of switching to "o" and "a". 



## Commands

```bash
npm run dev        # Start dev server on port 8080
npm run build      # Production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Environment Variables

```
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
VITE_SUPABASE_PROJECT_ID
VITE_DEV_EMAIL       # Optional: auto-login in dev
VITE_DEV_PASSWORD    # Optional: auto-login in dev
```

## Architecture

**Stack**: React 18 + TypeScript + Vite, Tailwind CSS + shadcn-ui, Supabase (auth + DB), React Query, Framer Motion.

**Path alias**: `@/` maps to `src/`.

### Routing (`src/App.tsx`)

40+ routes split into three categories:
- **Public**: `/`, `/auth`, `/pricing`, `/demo`, legal pages
- **Protected** (`ProtectedRoute` + `RequireVerifiedEmail`): `/dashboard`, `/ai/*`, `/calendar`, `/analytics`, `/account`, `/organization/*`
- **Admin** (`AdminRoute`): `/admin/*`

All dashboard/AI routes are lazy-loaded via `React.lazy`.

### Auth (`src/hooks/useAuth.tsx`)

`AuthProvider` context wraps the entire app. Supports email/password and OAuth (Google, Meta/Facebook). Sessions persist via Supabase Auth with localStorage. Route guards: `ProtectedRoute`, `RequireVerifiedEmail`, `AdminRoute`.

### AI System

- **Model tiers** (`src/lib/modelTiers.ts`): Fast (Gemini Flash Lite), Standard (Gemini Flash), Premium (Gemini Pro)
- **Credit system** (`src/lib/creditSystem.ts`): Reserve credits before request → settle after response → rollback on error. Uses idempotent `requestId`. In-memory store (not Redis).
- **AI hook** (`src/hooks/useAIAssistant.ts`): Manages AI requests with credit lifecycle
- **Plan config** (`src/lib/planConfig.ts`): Starter/Growth/Pro tiers with credit allowances

### Data Layer

- **Supabase client**: `src/integrations/supabase/client.ts` (auto-generated)
- **DB types**: `src/integrations/supabase/types.ts` (auto-generated — do not edit manually)
- **Query wrapper**: `src/hooks/useSupabaseQuery.ts` — prefer this over direct React Query usage
- React Query for all async state; React Context for Auth, Notifications, Organizations

### Styling

- Tailwind with CSS variables (HSL-based) defined in `src/index.css`
- Dark mode via class (`next-themes`)
- Custom font: Poppins
- Surface tokens: `surface-base`, `surface-raised`, `surface-overlay`, `surface-elevated`, `surface-muted`
- Animation utilities: `fade-in`, `slide-up`, `blur-in`, `bounce-in` (defined in `tailwind.config.ts`)

### Payment

Swish (Swedish payment method) via `src/lib/swishConfig.ts`. Checkout at `/swish-checkout`. Admin order management at `/admin/swish`.

### Localization

UI is in **Swedish**. Toast messages, validation errors, and user-facing text should be in Swedish.

### TypeScript

Config is intentionally lenient (`noImplicitAny: false`, `strictNullChecks: false`). Don't introduce stricter checks without user direction.
