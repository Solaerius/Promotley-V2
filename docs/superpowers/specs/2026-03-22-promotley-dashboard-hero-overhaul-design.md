# Promotley Dashboard & Hero Overhaul — Design Spec
**Date:** 2026-03-22
**Status:** Approved by user

---

## Overview
A multi-part overhaul covering: bug fixes, a scroll-linked hero animation, dashboard data density improvements, analytics enhancements, navigation restructure, and an "AI Profile" rename to "Company Information".

---

## Section 1: Bug Fixes

### 1.1 FAQ White Text (PricingFAQ.tsx)
- `text-white` → `text-foreground`
- `text-white/80` → `text-foreground/80`
- `text-white/60` → `text-muted-foreground`
- `border-white/10` → `border-border`
- Applies to: title, AccordionTrigger, AccordionContent, AccordionItem border

### 1.2 Auth Left Panel i18n (Auth.tsx)
- Hardcoded Swedish strings in the left brand panel must use i18n keys
- Add keys to both `sv.json` and `en.json`: `auth.brand_tagline`, `auth.brand_feature_1`, `auth.brand_feature_2`, `auth.brand_feature_3`

---

## Section 2: Hero Scroll Animation

### Architecture
- Landing page (`Index.tsx`): remove `<Navbar />`, replace with enhanced `<Hero />` that handles both expanded and collapsed (navbar) states
- Hero outer wrapper: `position: sticky; top: 0; z-index: 50; will-change: transform` — NO `overflow: hidden` on the outer wrapper (prevents mobile menu clipping)
- Inner collapsed-nav div: `overflow: hidden` only when hero is past 90% collapse progress
- Scroll tracking: `const bodyRef = useRef(document.body); const { scrollYProgress } = useScroll({ container: bodyRef, offset: ["start start", "600px start"] })`
- Wrap with `useSpring(scrollYProgress, { stiffness: 300, damping: 40 })` for smooth lag-free feel
- Mobile: the collapsed navbar shows hamburger menu; mobile menu dropdown is rendered outside the sticky container via a portal or is positioned fixed to avoid clipping

### Animated Transforms (via useTransform)
| Property | scrollY=0 | scrollY=600px |
|---|---|---|
| Hero height | `100vh` | `64px` |
| Dark overlay opacity | `0` | `0.6` |
| Hero content opacity | `1` | `0` |
| Hero content Y | `0px` | `-40px` |
| Glass auth card scale | `1` | `0.7` |
| Glass auth card opacity | `1` | `0` |
| "Promotley" text opacity | `1` | `0` |
| "Promotley" text translateX | `0px` | `-14px` |
| Logo scale | `1` | `1.2` |
| Collapsed nav opacity | `0` | `1` (starts at 70% progress) |

### Collapsed State (navbar)
When collapsed: shows `[P logo] [Nav links: Priser, Demo, Om oss] [Logga in ghost btn] [Kom igång gradient btn]`
- Glass effect: `backdrop-filter: blur(20px)`, `background: hsl(var(--card) / 0.8)`, `border-bottom: 1px solid hsl(var(--border))`
- Nav links fade in from opacity 0→1 between 70–100% scroll progress

### Constraint
- At `scrollY = 0`, the hero is pixel-identical to current. No visible change until user scrolls.
- Entrance animations (fade-in on mount) kept exactly as-is
- All animated properties are GPU-composited (transform + opacity only — no layout thrash)

### Other pages
- All other pages keep the existing `<Navbar />` unchanged

---

## Section 3: Dashboard Enhancements

### 3.1 Remove Instagram Platform Card
- Remove the Instagram `PlatformCard` from Dashboard.tsx
- Remove `useMetaData` import and usage from Dashboard.tsx
- TikTok card goes full-width (single column or `max-w-lg`)

### 3.2 Most Commented Videos Widget
- Source: `tiktokData.videos` sorted by `comments` desc, top 3
- Layout: card with header icon + title, list of 3 rows
- Each row: cover thumbnail (32×32 rounded), truncated title, comment count badge, external link
- Only shown when TikTok connected and `videos.length > 0`
- Empty state: "Koppla TikTok för att se data"
- Positioned: below the TikTok platform card

### 3.3 Top Performing Content Card
- Shows the single most-liked video
- Displays: cover image, title, likes, views, shares, computed engagement rate `((likes+comments)/views*100).toFixed(1)%`
- Positioned alongside Most Commented in a `grid lg:grid-cols-2` row

### 3.4 Engagement Sparkline
- Recharts `BarChart` of engagement rate per last 8 videos
- Compact height (80px), no axes labels, tooltip on hover
- Positioned: below the Most Commented / Top Content row

---

## Section 4: Analytics Enhancements

### 4.1 Most Liked Videos Analysis
- New section below platform breakdown tabs
- Takes top 5 videos by likes from `tiktokData.videos`
- Computes and displays as insight cards:
  - Average duration of top 5 vs overall average
  - Best day of week from `created_at` (most top videos posted on which day)
  - Average views-to-likes ratio for top 5
  - Most common caption keywords (word frequency, filter < 4 chars)
- Card UI: icon + label + computed value, 2×2 grid layout
- Only shown when TikTok connected and videos available

### 4.2 Content Performance Table
- Sortable table: Title | Likes | Comments | Shares | Views | Engagement Rate
- Default sort: by likes desc
- Click column header to sort
- Engagement rate = `((likes+comments)/views*100).toFixed(1)%`
- Replaces the mostly-empty TikTok tab content in the platform breakdown section

### 4.3 Engagement Breakdown Chart
- Stacked bar chart (Recharts): last 10 videos, bars = likes / comments / shares
- Legend, tooltip, X-axis shows truncated video title or index
- Height: 200px
- Positioned above the Content Performance Table

---

## Section 5: Navigation Restructure

### 5.1 Sidebar nav items (AppSidebar.tsx)
Old: `Home / Analytics / Tools / AI Chat / Calendar / Account`
New: `Home / Analytics / Tools / AI Chat / Calendar / Företagsinformation / Inställningar`

- Remove: Account (`/account`, CircleUser) — use `t('nav.account')` key already exists, but nav item is removed
- Add: Företagsinformation → `href: "/settings/company"`, icon: Building2, label: `t('nav.company')`
- Add: Inställningar → `href: "/settings"`, icon: Settings, label: `t('nav.settings_page')`
- Settings icon at bottom of sidebar stays — opens SettingsPopup (unchanged)

### 5.2 New unified Settings page (`/settings`)
- Route: `/settings` — replace the current `<Navigate to="/settings/profile" replace />` redirect (App.tsx line 163) with the new tabbed Settings page
- Tab bar at top: Profile | Företag | Organisation | Krediter | App
- `useSearchParams` for `?tab=` deep linking (e.g. `/settings?tab=credits`)
- Tab content components (all self-contained, no DashboardLayout wrapper):
  - Profile → `src/components/account/AccountContent.tsx`
  - Företag → inner content from `src/pages/settings/CompanySettings.tsx` (extract to `CompanyContent` component)
  - Organisation → `src/components/account/OrganizationContent.tsx` (already self-contained)
  - Krediter → inner content from `src/pages/settings/CreditsSettings.tsx` (extract to `CreditsContent` component)
  - App → `src/components/account/AppSettingsContent.tsx`
- Individual `/settings/profile`, `/settings/company`, `/settings/credits`, `/settings/app` sub-routes redirect to `/settings?tab=xxx` for canonical URLs
- Mobile: tabs render as a scrollable horizontal tab bar

### 5.3 Route in App.tsx
- Replace: `<Route path="/settings" element={<Navigate to="/settings/profile" replace />} />`
- With: `<Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />`
- Sub-routes `/settings/profile` etc. become redirects to `/settings?tab=profile` etc.
- `/account` redirect updated from `/settings/profile` to `/settings?tab=profile`

### 5.4 Platform connection link update
- Dashboard.tsx line 111: `<Link to="/account">` → `<Link to="/settings?tab=app">` (where social connections live)

---

## Section 6: AI Profile → Company Information + i18n Fixes

### 6.1 i18n Key Mismatches (AIProfileProgress.tsx)
Fix 3 broken key references:
- `field_company_name` → `field_company`
- `field_postcode` → `field_postal`
- `field_target` → `field_audience`

### 6.2 "AI Profile" rename — comprehensive i18n key list
Update ALL of the following values in sv.json ("AI-profil" → "Företagsinformation") and en.json ("AI Profile" → "Company Information"):
- `ai_profile_progress.title`, `ai_profile_progress.compact_label`
- `account.ai_profile`, `account.ai_profile_subtitle`, `account.save_ai_profile`, `account.ai_profile_saved`
- `ai.profile_incomplete`, `ai.profile_tip_title`, `ai.profile_tip_body`
- `calendar.ai_profile_link`, `calendar.ai_profile_required`
- `analysis.fill_profile_first`, `analysis.profile_required_title`, `analysis.profile_required_body`
- `chat.profile_required_title`, `chat.profile_required_desc`, `chat.placeholder_blocked`, `chat.footer_blocked`
- `sales_radar.fill_profile_first`, `sales_radar.profile_required_title`, `sales_radar.profile_required_body`
- `suggestions.profile_required_title`, `suggestions.profile_required_desc`, `suggestions.fill_profile_first`
- Strategy: grep for "AI-profil" and "AI Profile" in both locale files before editing to catch any not listed above
- Nav keys: add `nav.company`, `nav.settings_page` (sv+en)
- `created_at: null` guard: filter out videos with null `created_at` before day-of-week calculation
- `cover_image_url` fallback: render a `div` with `bg-muted` placeholder when undefined
- Caption keyword analysis uses `title` field (no separate caption field in TikTokVideo)
- BarChart imports: add `BarChart, Bar, Cell` to Recharts imports in Dashboard.tsx and AnalyticsContent.tsx
- ResponsiveContainer height: set on both the `ResponsiveContainer` component AND wrapping `div` to prevent 0-height bug

---

## Translation Keys to Add

### sv.json additions
```json
"auth": {
  "brand_tagline": "AI-driven marknadsföring för UF-företag",
  "brand_feature_1": "Analysera sociala medier med AI",
  "brand_feature_2": "Schemalägg och publicera innehåll",
  "brand_feature_3": "Väx din publik organiskt"
},
"nav": {
  "company": "Företagsinformation",
  "settings_page": "Inställningar"
},
"dashboard": {
  "most_commented": "Mest kommenterade",
  "top_content": "Toppinnehåll",
  "engagement_trend": "Engagemangstrend",
  "no_video_data": "Inga videodata tillgängliga",
  "connect_tiktok_data": "Koppla TikTok för att se data"
},
"analytics": {
  "most_liked_analysis": "Analys av mest gillade",
  "avg_duration_top": "Genomsnittlig längd (topp 5)",
  "best_posting_day": "Bästa dag att posta",
  "views_likes_ratio": "Visningar per gilla",
  "common_keywords": "Vanliga nyckelord",
  "content_performance": "Innehållsprestanda",
  "engagement_breakdown": "Engagemangsfördelning",
  "sort_by": "Sortera efter"
},
"settings": {
  "page_title": "Inställningar",
  "tab_profile": "Profil",
  "tab_company": "Företag",
  "tab_organisation": "Organisation",
  "tab_credits": "Krediter",
  "tab_app": "App"
}
```

---

## Constraints & Quality Gates
- No hardcoded color strings — all use CSS variables or Tailwind tokens
- No hardcoded Swedish — all strings through i18n
- Light mode + dark mode verified for every new component
- All new dashboard widgets have connected/empty states
- Hero at scrollY=0 is pixel-identical to current
- Only GPU-composited properties animated in the hero (transform, opacity)
- `will-change: transform` on sticky hero container
- All existing routes and pages unaffected except Dashboard, Analytics, AppSidebar, Settings
