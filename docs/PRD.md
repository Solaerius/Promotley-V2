# Promotley — Product Requirements Document

**Version:** 1.0
**Date:** 2026-03-27
**Status:** Active

---

## 1. Product Vision

Promotley is an AI-powered marketing SaaS platform for **Swedish Ungdomsföretag (UF) companies** — youth entrepreneurship firms run by high school students aged 15–19. The platform provides AI-driven content strategy, social media analytics, viral hook analysis, and a content calendar tailored to the specific rules and competition criteria of Ung Företagsamhet.

**Mission:** Make professional-grade marketing accessible to every UF company, regardless of prior experience.

---

## 2. Target User

| Attribute | Value |
|-----------|-------|
| Age range | 15–19 |
| Role | UF student/entrepreneur |
| Technical level | Consumer-grade (not developer) |
| Primary language | Swedish |
| Devices | Mobile-first, also desktop |
| Social platforms | TikTok (primary), Instagram/Meta |
| Pain point | Spending time on content nobody sees |

---

## 3. Core Features

### 3.1 AI Chat Assistant
- Conversational AI providing UF-specific marketing guidance
- Model tiers: Fast (Gemini Flash Lite), Standard (Gemini Flash), Premium (Gemini Pro)
- RAG-powered with UF knowledge base (`ai_knowledge` table)
- Credit-based consumption (1–3 credits per request depending on model tier)
- Conversation history persisted in `ai_conversations` + `ai_chat_messages`

### 3.2 Analytics Dashboard
- TikTok and Instagram/Meta metrics: followers, views, likes, comments, engagement rate
- Engagement trend chart (weekly)
- Content performance table (sortable by views, likes, engagement)
- Demo mode when no accounts connected (shows realistic sample data)
- Viral Hook Database (see 3.3)

### 3.3 Viral Hook Database
- Client-side classification of TikTok video titles into archetypes: Question, Number, POV, Story, Challenge, Other
- Bar chart of average views per hook archetype
- Top 5 best-performing videos with archetype badge
- Static UF-specific hook templates for inspiration
- Requires TikTok connected + minimum 3 videos

### 3.4 Content Calendar
- Visual weekly/monthly post planning
- AI-powered bulk schedule generation
- Supabase edge function: `calendar` (actions: `context`, `bulk_create`)

### 3.5 AI Specialized Tools
- Caption Generator
- Hashtag Suggestions
- Content Ideas (platform + count selection)
- Weekly Planner
- Campaign Strategy
- UF Tips

### 3.6 Organization Management
- Multi-member organizations with role-based access (founder, admin, member)
- Organization invites via code
- Shared organization profile and credits

---

## 4. User Flow

```
Landing page → Sign up (email / Google / Apple / TikTok)
→ Email verification
→ Onboarding tutorial (7-step overlay)
→ Dashboard (demo mode if no social connected)
→ Settings > App tab → Connect TikTok / Instagram
→ Analytics → Real data + Hook Database
→ AI Chat → First AI interaction
→ Calendar → Content planning
→ Upgrade (Pricing page) → Stripe checkout
```

---

## 5. Design System

| Token | Value |
|-------|-------|
| Brand color | `--primary: 326 56% 37%` (magenta-pink) |
| Background (dark) | `--background: 347 40% 5%` (wine) |
| Font | Poppins (Google Fonts) |
| Border radius | 12px cards, 8px buttons |
| Animation library | Framer Motion + CSS keyframes |
| Component library | shadcn/ui (Radix UI primitives) |

### Surface tokens (dark mode)
- `surface-base` → base background
- `surface-raised` → card level
- `surface-overlay` → modal level
- `surface-elevated` → tooltip/popover
- `surface-muted` → disabled states

### Interaction states
All interactive elements must have: default, hover (scale 1.02 or color shift), focus (ring), disabled (opacity 0.5), loading (skeleton or spinner).

---

## 6. Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Components | PascalCase | `AnalyticsContent.tsx` |
| Hooks | camelCase with `use` prefix | `useHookDatabase.ts` |
| Pages | PascalCase | `Dashboard.tsx` |
| Routes | kebab-case | `/ai/content-ideas` |
| i18n keys | dot.notation namespaced | `analytics.no_connections_title` |
| Supabase tables | snake_case | `ai_chat_messages` |
| CSS variables | kebab-case | `--surface-raised` |

---

## 7. File Structure

```
src/
├── assets/          Static assets (logo, images)
├── components/      Shared components
│   ├── ai/          AI-specific components
│   ├── analytics/   Analytics components
│   ├── account/     Account/settings components
│   ├── icons/       SVG icon components
│   ├── layouts/     Page layout wrappers
│   └── ui/          shadcn base components (do not edit)
├── hooks/           Custom React hooks
├── integrations/    Auto-generated Supabase client + types (do not edit)
├── lib/             Utilities (creditSystem, planConfig, i18n, etc.)
├── locales/         i18n JSON files (sv.json, en.json)
├── pages/           Route-level page components
│   ├── ai/          AI tool pages
│   ├── admin/       Admin-only pages
│   └── settings/    Settings tab pages
└── data/            Static/demo data
supabase/
├── functions/       Edge functions (Deno)
│   └── _shared/     Shared utilities (rateLimit.ts, logger.ts)
└── migrations/      SQL migrations (numbered chronologically)
docs/                Project documentation
```

---

## 8. Backend Architecture

**No custom backend server.** All server-side logic runs as Supabase Edge Functions (Deno).

| Layer | Technology |
|-------|-----------|
| Auth | Supabase Auth (email + OAuth: Google, Meta, TikTok) |
| Database | Supabase Postgres with RLS |
| Edge Functions | Deno (TypeScript), deployed on Supabase |
| Real-time | Supabase Realtime channels (notifications) |
| File storage | Supabase Storage (`promotley_knowledgebase` bucket) |
| Payments | Stripe (primary) + Swish (Swedish legacy) |
| AI models | Gemini Flash Lite / Flash / Pro via API |
| Email | Supabase Auth email hooks + custom templates |

---

## 9. Security Requirements

| Requirement | Implementation |
|-------------|----------------|
| Auth | JWT via Supabase Auth; all edge functions validate `Authorization: Bearer <token>` |
| Authorization | Row Level Security on ALL tables; users can only access their own + org data |
| Rate limiting | `_shared/rateLimit.ts` applied to AI, billing, social data endpoints |
| Input validation | Zod schemas on all form submissions; AI input stripped of injection patterns |
| CORS | All edge functions return appropriate CORS headers |
| Secrets | All API keys in Supabase secrets (never in client-side code) |
| Prompt injection | Pattern matching in `ai-assistant` edge function |
| Stripe webhooks | Signature verification via `stripe.webhooks.constructEvent` |
| Password reset | Token expiry handled by Supabase Auth (1-hour default) |

---

## 10. Localization Rules

1. **Default language:** Swedish (`sv`)
2. **All UI text** must use `t()` from `useTranslation()` — no hardcoded strings
3. **Both locales updated simultaneously:** When adding a key to `sv.json`, add the English equivalent to `en.json` immediately
4. **Swedish characters:** Always use Å, Ä, Ö — never substitute with A or O
5. **Date formatting:** Use `date-fns` with the appropriate locale (`sv` or `enUS` based on `i18n.language`)
6. **Currency:** `pricing.currency_symbol` key — `kr` in Swedish, `€` in English

---

## 11. Technical Constraints

1. **Credit system is in-memory only** — `creditSystem.ts` uses a JS Map. Do not design features that require persistent reservation state across edge function instances.
2. **Email verification gate** — `/ai/*` routes require verified email (`RequireVerifiedEmail`).
3. **Lazy loading required** — All dashboard/AI/admin pages MUST be lazy-loaded via `React.lazy`.
4. **Auto-generated files** — Never manually edit `src/integrations/supabase/client.ts` or `types.ts`.
5. **Model tier enforcement is server-side** — Client can select tiers but edge function validates against plan.
6. **RLS is the primary data auth layer** — All new tables require RLS policies before going to production.
7. **`ai_knowledge` categories are exact strings** — `uf_rules`, `competition_criteria`, etc. Mismatches silently return no results.
8. **TypeScript is intentionally lenient** — `noImplicitAny: false`, `strictNullChecks: false`. Do not tighten without explicit direction.

---

## 12. Roadmap (Planned)

- [ ] Persistent rate limiting via Supabase KV / table
- [ ] Discord/email alerts for CRITICAL edge function errors (logger.ts infrastructure ready)
- [ ] AI-powered hook classification (replace client-side regex with Gemini classification)
- [ ] YouTube analytics integration
- [ ] Automated competitor analysis via Sales Radar
- [ ] UF competition report generator
- [ ] Multi-language support beyond Swedish/English
