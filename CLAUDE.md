# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.


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
