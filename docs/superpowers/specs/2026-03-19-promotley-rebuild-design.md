# Promotley Rebuild — Design Spec
**Date:** 2026-03-19
**Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn-ui, Supabase, React Query, Framer Motion
**Language:** Swedish UI throughout
**Design language:** Minimal, premium, trust-building (reference: Anthropic.com + Lovable.dev)

---

## Task 1 — Bug Fixes: Silent Social Error Toasts

### Problem
`useTikTokData` and `useMetaData` both fire immediately on mount and show destructive toast errors when no social account is connected — even for brand-new users.

### Fix
Add `enabled?: boolean` option to both hooks.

**When `enabled=false`:**
- Skip all network calls
- Set `loading: false` immediately (NOT true — callers must not hang)
- Return null/empty data state silently

In `Dashboard.tsx`, pass `enabled` based on `useConnections` result, gating on `loading` explicitly:
```ts
const { isConnected, loading: connectionsLoading } = useConnections();
const tiktokData = useTikTokData({ enabled: !connectionsLoading && isConnected("tiktok") });
const metaData = useMetaData({ enabled: !connectionsLoading && (isConnected("meta_ig") || isConnected("meta_fb")) });
```

The `loading` guard is explicit — do NOT rely on `connections === []` as an implicit guard. This ensures hooks stay dormant while `useConnections` is loading AND after it resolves with no matching provider.

**Files changed:** `src/hooks/useTikTokData.ts`, `src/hooks/useMetaData.ts`, `src/pages/Dashboard.tsx`

**Stop condition:** Zero error toasts when no social accounts are connected.

---

## Task 2 — Organization Setup Wizard

### Database Migration (run before implementing)
Create a new `organization_profiles` table with a 1:1 relationship to `organizations`:

```sql
create table public.organization_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null unique references public.organizations(id) on delete cascade,
  industry text,
  website text,
  city text,
  target_audience text,
  unique_properties text,
  tone text,
  goals text,
  instagram_handle text,
  tiktok_handle text,
  facebook_handle text,
  linkedin_handle text,
  x_handle text,
  newsletter_opt_in boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.organization_profiles enable row level security;

create policy "Members can view org profile"
  on public.organization_profiles for select
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
    )
  );

create policy "Admins can insert org profile"
  on public.organization_profiles for insert
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('admin', 'owner')
    )
  );

create policy "Admins can update org profile"
  on public.organization_profiles for update
  using (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('admin', 'owner')
    )
  )
  with check (
    exists (
      select 1 from public.organization_members
      where organization_id = organization_profiles.organization_id
        and user_id = auth.uid()
        and role in ('admin', 'owner')
    )
  );
```

### Wizard Behavior
Replaces `CreateOrganization.tsx` at route `/organization/new` with a 4-step wizard.

On completion: create org → insert `organization_profiles` row → navigate to `/dashboard`.

### Steps

| # | Name | Required (★) | Optional |
|---|------|-------------|---------|
| 1 | Grundinfo | Företagsnamn | Bransch, Webbplats, Stad |
| 2 | Marknadsföring | Målgrupp, Unika egenskaper | Tonalitet, Mål |
| 3 | Sociala medier | _(none — entirely optional step)_ | Instagram, TikTok, Facebook, LinkedIn, X |
| 4 | Villkor | "Acceptera villkor" checkbox | "Ta emot nyhetsbrev" checkbox |

**Step 3 social fields are plain-text handle inputs** (e.g. `@mittforetag`), stored in `organization_profiles`. They are informational only — they do NOT interact with the `connections` table or OAuth flow.

### UX Rules
- Required fields marked with orange ★ above input label
- "Nästa" button disabled until all required fields in current step are filled
- "Föregående" button always enabled (except on Step 1)
- Textarea fields auto-grow with content (`resize: none`, height driven by `scrollHeight`)
- All fields: visible label above + placeholder text explaining what to enter with a Swedish example
- Vertical progress bar on right side of screen, checkmarks at each step
- When "Nästa" pressed on completed step: checkmark turns green, bar advances to next milestone
- All upcoming steps visible in progress bar at a glance

### Final Step (Step 4)
- Checkbox: "Acceptera våra villkor och regler" — REQUIRED (unchecked blocks submit)
- Checkbox: "Ta emot nyhetsbrev" — optional, unchecked by default
- CTA: "Skapa företaget nu"
- On validation failure: highlight missing/unchecked items in red border
- On second submit attempt: scroll to first unfilled required element + pulse animation (`animate-pulse`)

**Files changed:** `src/pages/CreateOrganization.tsx` (full replacement)

---

## Task 3 — Landing Page Redesign

### Scope
- `src/components/Navbar.tsx` — full rebuild
- `src/components/Hero.tsx` — full rebuild
- `src/components/LogoStrip.tsx` — new component
- `src/pages/Index.tsx` — insert `<LogoStrip />` immediately after `<Hero />`

### Navbar
- Transparent on initial load
- Scroll detection: use `IntersectionObserver` on the `LogoStrip` element. When LogoStrip leaves viewport (scrolled past) → apply frosted glass state
- Frosted glass state: `backdrop-filter: blur(12px)`, semi-transparent dark background, subtle `box-shadow`
- Transition: CSS `transition` on `background-color`, `backdrop-filter`, and `box-shadow` simultaneously — 300ms ease. No abrupt color swap.
- Logo: top-left
- Center links: "Pris" → `/pricing` | "Demo" → `/demo` | "Om oss" → `/om-oss` (or anchor on landing page if no separate Om oss page exists — use `#om-oss`)
- Right: "Registrera" button (primary) + "Logga in" button (ghost/outline) → both route to `/auth`

### Hero — Two-column layout
**Left column (larger):**
- Large animated heading: "Marknadsför nu"
- Subheading below: "Gör marknadsföringen rätt med våra verktyg"
- Framer Motion entrance animation (fade up)

**Right column:**
Three stacked OAuth buttons (Framer Motion staggered entrance):
- "Fortsätt med TikTok" → routes to `/auth` (the existing auth page handles TikTok connection; this is NOT a Supabase OAuth provider call)
- "Fortsätt med Google" → calls `supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: \`${window.location.origin}/auth/callback\` } })`
- "Fortsätt med Apple" → calls `supabase.auth.signInWithOAuth({ provider: 'apple', options: { redirectTo: \`${window.location.origin}/auth/callback\` } })`

Each button displays the platform's SVG logo inline.

### LogoStrip
Infinite horizontal scroll using pure CSS animation (`@keyframes scroll`), no JS. Contains SVG/img logos for: Meta, TikTok, Swish, OpenAI, Claude, Facebook, Instagram, LinkedIn, X. Logos duplicated to create seamless loop.

### Also update: Auth.tsx
Change lines 251 and 274 (`redirectTo: window.location.origin`) to `redirectTo: \`${window.location.origin}/auth/callback\`` for both `handleGoogleLogin` and `handleAppleLogin`. This is required for Task 6 to work.

---

## Task 4 — Dashboard Redesign

### Scope
Full UI rebuild of `src/pages/Dashboard.tsx`. Same hooks, same data sources, new design system.

### Design system
- Remove all current inline styles and class strings
- Apply Tailwind surface tokens: `surface-base`, `surface-raised`, `surface-overlay`, `surface-elevated`, `surface-muted`
- Poppins font, HSL CSS variables, dark mode via class
- Minimal card borders, subtle shadows, generous whitespace
- Reference: Anthropic.com card aesthetic — clean edges, no gradients unless intentional

### Layout sections (top to bottom)
1. Stat cards row — followers, credits, upcoming posts, engagement
2. Charts — area chart (follower history), bar chart (weekly activity)
3. Platform data sections — conditional on `isConnected()` for each platform
4. Upcoming posts grid
5. Recent activity feed

---

## Task 5 — Demo Page

### Existing files
`/demo` → `src/pages/Demo.tsx` + `src/data/demoData.ts`

### Changes to demoData.ts
Add `demoAIResponses` object mapping tool keys to pre-written Swedish responses:

```ts
export const demoAIResponses = {
  caption: `✨ Caption för @stockholmskaffet:\n\n"Måndag smakar bättre med rätt kaffe ☕ Vi har precis fått in vår nya single origin från Etiopien — blommig, ljus och helt underbar. Kom in och prova, vi bjuder på det första provet hela måndag förmiddag!\n\n#stockholmskaffet #nytkaffe #etiopiskt #specialtykaffe #stockholm #kaffeälskare #mondaymood #lokalkaffe"`,
  hashtags: `🏷️ Rekommenderade hashtags för Stockholms Kaffet:\n\nVolym (1M+): #kaffe #coffee #fika #stockholm\nMedel (100k–1M): #specialtycoffee #kaffekultur #stockholmcafe #swedishcoffee\nNisch (<100k): #stockholmskaffet #etiopiskkaffe #singOriginCoffee #kafferostning\n\n💡 Tips: Mixa 3–4 volymtaggar med 4–5 nischtaggar för bäst organisk räckvidd.`,
  contentIdeas: `💡 5 Content-idéer för Stockholms Kaffet:\n\n1. "Bakom kulisserna" — Visa rostningsprocessen i en 30 sek Reel\n2. "Kaffekunskap" — Förklara skillnaden mellan wash och natural process\n3. "Kundporträtt" — Intervjua en stamkund om deras morgonrutin\n4. "Produktlansering" — Teaser-serie inför nästa säsongskaffe\n5. "Before/after" — Visa kaffebönan från farm till kopp`,
  weeklyPlan: `📅 Veckoplanen för Stockholms Kaffet (v.12):\n\nMåndag: Instagram-Reel — Ny etiopisk single origin lansering\nTisdag: Story-poll — "Filter eller espresso?" (engagemang)\nOnsdag: Inlägg — Bakom kulisserna i rostningen\nTorsdag: TikTok — "3 saker du inte visste om kaffe"\nFredag: Story — Helgmeny + öppettider påminnelse\nLördag: Reel — Kundmoment / café-stämning\nSöndag: Citat-inlägg — Veckans kaffetanke`,
  campaign: `🎯 Kampanjstrategi: Påsklansering 2025\n\nMål: Öka butiksbesök +20% under påskhelgen\nMålgrupp: Stockholmare 25–45 år, kaffeintresserade\n\nFas 1 (v.13): Teaser — "Något nytt är på väg"\nFas 2 (v.14): Lansering — Påskkaffe + limited edition påse\nFas 3 (v.15): Avslut — "Sista chansen" + UGC från kunder\n\nKanaler: Instagram (primär), TikTok (räckvidd), e-post (lojala kunder)\nBudget: 80% organiskt, 20% boostat innehåll`,
  ufTips: `🚀 UF-tips för Stockholms Kaffet:\n\n1. Mässor: Anmäl dig till UF-mässan i god tid — din monter är ditt varumärke\n2. Årsredovisning: Börja dokumentera försäljning och marknadsföringsinsatser redan nu\n3. Sociala medier: Visa UF-resan! Följare älskar autentiska "vi bygger ett företag"-berättelser\n4. Samarbeten: Ta kontakt med andra UF-företag för cross-promo — inga konkurrenter, bara partners\n5. Prissättning: Räkna alltid in din arbetstid i priset. Sälj inte för billigt.`,
};
```

### Changes to Demo.tsx
1. On first click of any AI tool button: display the matching `demoAIResponses[key]` inline in a result panel below the button grid
2. On second click of the same button: show a full-screen modal with:
   - Heading: "Vill du se mer?"
   - "Skapa ett konto nu" with Google + Apple OAuth buttons. Use explicit `redirectTo: \`${window.location.origin}/auth/callback\`` (NOT `window.location.origin`) so Task 6's org-selection screen fires correctly.
   - "Registrera med e-post" button → `/auth`
3. Chat function: fully disabled — greyed out, lock icon overlay, no click handler
4. Zero live API calls — all content from `demoData.ts`
5. Route `/demo` must not share state with authenticated sessions (already true — Demo is unauthenticated)

---

## Task 6 — Post-OAuth Organization Selection Screen

### Trigger condition
Only for OAuth users (provider = `google` or `apple`) completing their **first-ever login** with no existing organization membership.

Returning users who have an org → navigate directly to `/dashboard`.

### Implementation in AuthCallback.tsx
After session is established and email is confirmed (or for OAuth which auto-confirms):

**Invite code takes precedence:** The existing `inviteCode` auto-join block (lines 68–99) runs first. If a user has an `invite_code` in metadata, they get auto-joined to an org. The subsequent org-membership check will then find a membership and navigate to `/dashboard` — this is the correct behaviour. `OAuthLandingScreen` only shows when the user has genuinely no org after all auto-join logic has run.

```
if user.app_metadata.provider in ['google', 'apple']:
  // Run existing invite_code auto-join block first (unchanged)
  // Run existing promo_code auto-redeem block (unchanged)
  // Then check org membership:
  check organization_members for this user
  if no org membership found:
    render OAuthLandingScreen (do NOT call navigate — render inline)
  else:
    navigate('/dashboard', { replace: true })
else:
  existing email verification flow unchanged
```

### OAuthLandingScreen component
New file: `src/components/OAuthLandingScreen.tsx`

Clean screen (no form fields) with two option cards:
1. **"Registrera ett företag"** — icon: Building2, subtext: "Skapa och anpassa din organisation", button → navigate to `/organization/new`
2. **"Anslut till ett företag"** — icon: Users, subtext: "Gå med i ett befintligt team med en inbjudningskod", button → navigate to `/organization/onboarding` (existing join flow)

### Also: Auth.tsx redirectTo fix (prerequisite for Task 6)
Already specified in Task 3 above — change `redirectTo: window.location.origin` to `redirectTo: \`${window.location.origin}/auth/callback\`` for both `handleGoogleLogin` and `handleAppleLogin`.

---

## Constraints (global)
- All auth logic changes are limited to what is explicitly described above
- No backend API routes removed or altered
- All user-facing text in Swedish with correct Å, Ä, Ö
- No lorem ipsum — all copy is production-ready Swedish
- Demo page: no live AI API calls, no shared auth state
- TypeScript config stays lenient (`noImplicitAny: false`, `strictNullChecks: false`)
- `src/integrations/supabase/types.ts` is auto-generated — do not edit manually
