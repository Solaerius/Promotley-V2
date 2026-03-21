# Remaining Fixes Plan — Promotley v2

Last updated: second session (March 2026).

## COMPLETED IN SESSION 2
- ✅ AI → Verktyg in AppSidebar navItems
- ✅ Select/dropdown `position="popper"` — all dropdowns in Onboarding now open downward
- ✅ User name (full_name) field added to Onboarding step 1, saved to Supabase user metadata
- ✅ Navbar is now theme-aware: transparent→dark-glass on scroll, text uses opacity instead of hardcoded white, borders and hover states adapt to light/dark

## FOUND IN SESSION 2 — Add to top of light mode fix list
22 components have hardcoded `text-white` that breaks in light mode. The pattern is:
- Inline styles with `hsl(240 50% 4%)` or `hsl(240 50% 7%)` dark backgrounds
- `text-white` and `style={{ color: 'hsl(0 0% 100% / 0.7)' }}` text on those dark backgrounds
- The sections were designed dark-only and never adapted for light mode

**Files with text-white to fix (homepage sections — highest priority):**
1. `src/components/FinalCTA.tsx` — full-screen dark section, `hsl(240 50% 4%)` bg, `text-white` everywhere
2. `src/components/ProblemSection.tsx`
3. `src/components/HowItWorks.tsx`
4. `src/components/TrustSection.tsx`
5. `src/components/ResultsSection.tsx`
6. `src/components/DemoPreviewSection.tsx`
7. `src/components/Testimonials.tsx`
8. `src/components/Pricing.tsx`

**Fix pattern for each section:**
- Replace inline `background: 'hsl(240 50% 4%)'` → `background: 'hsl(var(--gradient-hero-bg))'`
- Replace inline `background: 'hsl(240 50% 7% / 0.85)'` → `background: 'hsl(var(--card) / 0.85)'`
- Replace className `text-white` → `text-foreground`
- Replace inline `color: 'hsl(0 0% 100% / 0.7)'` → `color: 'hsl(var(--muted-foreground))'`
- Replace inline `color: 'hsl(0 0% 100% / 0.6)'` → `color: 'hsl(var(--muted-foreground))'`
- Keep glow effects (`hsl(var(--primary) / 0.18)`) — those already use CSS variables and are fine

**Dashboard components with text-white (lower priority — dashboard is dark by default):**
- `src/components/ai/AIToolsContent.tsx`, `ChatSidebar.tsx`, `SalesRadarContent.tsx`, `AIChatContent.tsx`, `AIToolPageLayout.tsx`
- Fix same way: replace `text-white` → `text-foreground`, dark bg → `bg-card` or `bg-background`

Implement these in order of priority.

---

## BLOCKING UX BUGS (fix first)

### 1. Light mode — full product-wide audit
**Status:** Not done. This is the most critical remaining issue.
**Problem:** Switching to light mode leaves most surfaces, text, and components broken. Many things are unreadable (dark text on dark, white text on white). The theme system is wired but CSS variable coverage is incomplete.
**Fix required:**
- Audit every CSS class that uses hardcoded colors (not CSS variables) across all pages and components.
- In `src/index.css` `:root` (light mode), verify: `--background`, `--foreground`, `--card`, `--card-foreground`, `--muted`, `--muted-foreground`, `--border`, `--input` are all set to correct light values.
- All components that use `text-white`, `bg-black`, `bg-[hsl(347...)]` hardcoded dark colors must use `text-foreground`, `bg-background`, `bg-card` etc. instead.
- The Hero section in `Index.tsx` uses `bg-[hsl(var(--gradient-hero-bg))]`. In light mode `--gradient-hero-bg: 0 0% 99%` which is white — but most text in Hero.tsx is hardcoded white (`text-white`). These must become `text-foreground` in light mode.
- The Navbar text is hardcoded `text-white` — in light mode over a white hero, this is invisible. Fix: when not scrolled in light mode, use dark text. Use `dark:text-white text-foreground` or use CSS variables.
- `Hero.tsx`: Replace every `text-white`, `text-white/70`, `text-white/50`, `border-white/10` etc. with Tailwind dark: variants or CSS variable-based classes.
- All section components (ProblemSection, HowItWorks, etc.): audit for hardcoded dark colors.
- Dashboard: All `text-white` or hardcoded dark backgrounds must use CSS variable tokens.
- AuthCallback, VerifyEmail, Onboarding: check all form/card backgrounds.
**Key principle:** Use `text-foreground` not `text-white`, `bg-background` not `bg-[hsl(347...)]`, `border-border` not `border-white/10`.

### 2. Navbar initial transparency — light mode contrast problem
**Status:** Logic is correct (starts transparent) but visually broken in light mode.
**Problem:** In light mode, hero background is white, navbar text is hardcoded white → invisible on load.
**Fix:** In `Navbar.tsx`:
- When `!scrolled && !mobileOpen`: In dark mode, transparent works fine. In light mode, need slightly dark text.
- Solution: Replace `text-white` on nav links with `dark:text-white text-gray-900` (or `text-foreground`).
- The logo span `text-white` → `dark:text-white text-foreground`.
- Auth buttons `text-white/80` → `dark:text-white/80 text-foreground/80`.
- When scrolled: current glass style `bg-black/70` looks bad in light mode → use `bg-white/80 dark:bg-black/70` for the scrolled state.

### 3. i18n completeness — remaining hardcoded Swedish
**Status:** Partial. Many dashboard, AI tools, settings, and account pages still have hardcoded Swedish.
**Files to audit (in priority order):**
- `src/pages/AIPage.tsx` and all `src/pages/ai/*.tsx` — most likely fully Swedish
- `src/pages/AnalyticsPage.tsx`
- `src/pages/Calendar.tsx`
- `src/components/account/AccountContent.tsx`, `OrganizationContent.tsx`, `AppSettingsContent.tsx`
- `src/components/FreeTierWarningModal.tsx`, `UpgradePromptOverlay.tsx`, `IncompleteProfileModal.tsx`
- `src/components/GlobalTutorial.tsx`
- `src/components/ConnectionManager.tsx`
- `src/components/ChatWidget.tsx`
**Method:** For each file, grep for Swedish strings, add useTranslation, add keys to both locale files.

---

## LAYOUT / SCALE PROBLEMS

### 4. Reduce overall site size — everything too large
**Status:** Not done. This is a significant UX issue.
**Problem:** The whole product feels oversized. Cards, paddings, fonts, containers are all too large. Should be more compact and minimalist.
**Specific fixes needed:**
- `src/index.css`: Reduce global base font size slightly. Tighten up spacing utilities.
- Homepage sections: Reduce `py-24 md:py-32` to `py-12 md:py-16`. Reduce `text-4xl md:text-5xl` to `text-3xl md:text-4xl`.
- `Hero.tsx`: Reduce padding. The right-side auth card should be smaller. Reduce hero min-height from full viewport to something like `min-h-[85vh]`.
- `Dashboard.tsx`: The stat cards, chart section, and upcoming posts section all have too much padding. Use `p-4` instead of `p-6` in most places. Reduce gap between sections.
- `Onboarding.tsx`: The form area is fine but the overall page padding can be reduced.
- `Pricing.tsx`: Reduce plan card size. Use `p-6` instead of `p-8`. Reduce feature list font size.
- All section headings: Reduce `section-title` class in `index.css` from `text-3xl md:text-4xl lg:text-5xl` to `text-2xl md:text-3xl lg:text-4xl`.

### 5. Dashboard density — should fit in ~1.5 screens
**Status:** Not done.
**Problem:** Dashboard requires excessive scrolling to see all content.
**Fix:**
- Rearrange dashboard layout: Put stat cards in a single row of 4 (not 2x2 grid on medium screens).
- Make the follower chart smaller (reduce height from ~300px to ~200px).
- Put "Upcoming posts" and "Recent activity" side by side in a 2-column grid.
- Make "Quick actions" a horizontal row at the top or bottom, not a full-width section.
- Reduce padding on all dashboard cards from `p-6` to `p-4`.

### 6. Demo section — too large
**Status:** Not done.
**Problem:** The demo preview section takes up too much vertical space.
**Fix:** In `src/components/DemoPreviewSection.tsx`:
- Reduce the demo preview container height/scale.
- Reduce section padding.
- Make it more compact without removing functionality.

### 7. Homepage hero — signup area alignment in Swedish
**Status:** Not done.
**Problem:** On Swedish site, the right-side signup auth card overflows or misaligns because Swedish text is longer.
**Fix:** In `Hero.tsx`:
- The layout is two columns: `lg:grid lg:grid-cols-2`. The right column (auth card) needs `min-w-0` and `overflow-hidden`.
- Text in the left column that overflows: ensure all text uses `text-wrap: balance` or `break-words`.
- The auth card should have a fixed max-width and flex-shrink behavior: `flex-shrink-0 w-full max-w-[340px]`.
- Test in both Swedish and English — ensure nothing overflows at any reasonable viewport width.

---

## MISSING REDESIGN DEPTH

### 8. Icon system update
**Status:** Still using default lucide-react icons everywhere.
**Problem:** Icons feel generic and not tailored to the brand/audience.
**Fix:**
- The icon set is lucide-react which is fine quality-wise. The issue is which icons are chosen, not the library.
- In `AppSidebar.tsx`, replace icons with more distinctive alternatives from lucide-react:
  - LayoutDashboard → `Home` or `Gauge`
  - BarChart3 → `TrendingUp` or `LineChart`
  - Sparkles (now Verktyg/Tools) → `Wand2` or `Cpu`
  - MessageSquare (AI-Chat) → `Bot` or `BrainCircuit`
  - Calendar → keep or use `CalendarDays`
  - User (Konto) → `CircleUser` or `UserCircle`
- Audit other major icon uses in Dashboard, TopNav, Hero, Pricing, etc.

### 9. User name collection in Auth.tsx (alternative to onboarding approach)
**Status:** Name field added to Onboarding step 1, but email signup users don't set name until onboarding.
**Current state:** The dashboard greeting for fresh email signups will show the email prefix until after onboarding saves the name.
**This is acceptable** — the onboarding fix (saving full_name to user metadata) already addresses this. No further change needed here.

---

## IMPLEMENTATION NOTES

### What was already fixed in this session:
- AI → Verktyg in sidebar navItems
- Select dropdown `position="popper"` so it opens downward correctly
- Full_name field added to Onboarding step 1, saved to user metadata on submit

### Quick wins for next session:
1. Start with issue #2 (Navbar light mode text colors) — 10 min
2. Then issue #1 (Light mode CSS audit) — 1-2 hours
3. Then issue #4 (Size reduction) — 1 hour
4. Then issue #3 (i18n completeness) — 1-2 hours
5. Then issues #5-9

### Files most affected by light mode audit:
- `src/components/Hero.tsx` — most text is hardcoded `text-white`
- `src/components/Navbar.tsx` — hardcoded `text-white` on links
- `src/index.css` — need to verify all `:root` light tokens are correct
- `src/pages/Dashboard.tsx` — some hardcoded dark backgrounds may remain
- `src/components/Pricing.tsx` — gradient card backgrounds
- `src/components/FinalCTA.tsx` — dark radial gradient
- `src/components/ProblemSection.tsx`, `HowItWorks.tsx`, etc. — section backgrounds

### CSS variable audit checklist for light mode:
All of these must render correctly in `:root` (light mode):
- `--background: 0 0% 99%` — white ✓
- `--foreground: 347 30% 10%` — dark wine text ✓
- `--card: 0 0% 100%` — white card ✓
- `--primary: 326 56% 37%` — magenta (accessible on white: ~3.8:1, borderline WCAG AA)
  - For light mode primary text: darken to `326 56% 28%` for better contrast
- `--muted: 214 32% 95%` — light gray ✓
- `--muted-foreground: 215 16% 47%` — medium gray ✓
- Hero section in light mode: should have a light/white background with dark text
  - `--gradient-hero-bg: 0 0% 99%` ✓ but Hero.tsx text must not be `text-white`
