# Promotley Dashboard & Hero Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix broken FAQ colors, add scroll-linked hero collapse animation, enrich the dashboard and analytics with TikTok video data widgets, restructure navigation (Company Information + tabbed Settings page), and rename "AI Profile" to "Company Information" throughout.

**Architecture:** All new widgets read from the existing `useTikTokData()` hook (no new API calls). The hero animation uses Framer Motion `useScroll` + `useTransform` on the body scroll container — GPU-composited only. The Settings page refactors the existing monolithic `Settings.tsx` into a tab-router that renders existing content components. Navigation replaces the "Account" sidebar item with "Företagsinformation" and "Inställningar".

**Tech Stack:** React 18 + TypeScript + Vite, Tailwind CSS + shadcn-ui, Framer Motion v11, Recharts, i18next, Supabase.

---

## File Map

| File | Action | Reason |
|---|---|---|
| `src/components/PricingFAQ.tsx` | Modify | Fix hardcoded `text-white` → theme tokens |
| `src/pages/Auth.tsx` | Modify | Make left-panel strings use i18n keys |
| `src/locales/sv.json` | Modify | Add new keys + fix AI Profile rename |
| `src/locales/en.json` | Modify | Add new keys + fix AI Profile rename |
| `src/components/AIProfileProgress.tsx` | Modify | Fix 3 broken i18n key references |
| `src/components/Hero.tsx` | Modify | Add scroll-linked collapse animation, integrate nav |
| `src/pages/Index.tsx` | Modify | Remove `<Navbar />`, keep `<Hero />` |
| `src/pages/Dashboard.tsx` | Modify | Remove Instagram card, add Most Commented + Top Content + Sparkline |
| `src/components/analytics/AnalyticsContent.tsx` | Modify | Add Most Liked Analysis, Content Performance Table, Engagement Breakdown |
| `src/components/AppSidebar.tsx` | Modify | Replace Account with Company + Settings nav items |
| `src/pages/Settings.tsx` | Rewrite | Replace monolithic page with tabbed layout |
| `src/App.tsx` | Modify | Replace `/settings` redirect with tabbed page route; update sub-routes |

---

## Task 1: Fix FAQ White Text

**Files:**
- Modify: `src/components/PricingFAQ.tsx`

- [ ] **Step 1.1 — Fix color tokens in PricingFAQ.tsx**

Open `src/components/PricingFAQ.tsx`. Make these exact replacements:

```tsx
// Line 23: title
<h3 className="text-3xl font-bold text-center mb-8 text-foreground">

// Line 27: AccordionItem border
<AccordionItem key={index} value={`item-${index}`} className="border-border">

// Line 28: AccordionTrigger
<AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-foreground/80">

// Line 31: AccordionContent
<AccordionContent className="text-muted-foreground leading-relaxed">
```

- [ ] **Step 1.2 — Verify**

Run dev server (`npm run dev`) and navigate to `/` → scroll to pricing section → toggle light/dark mode. FAQ title and answers must be readable in both modes.

- [ ] **Step 1.3 — Commit**

```bash
rtk git add src/components/PricingFAQ.tsx && rtk git commit -m "fix(light-mode): FAQ text uses theme-aware color tokens instead of hardcoded white"
```

---

## Task 2: Auth Left Panel i18n

**Files:**
- Modify: `src/pages/Auth.tsx`
- Modify: `src/locales/sv.json`
- Modify: `src/locales/en.json`

- [ ] **Step 2.1 — Add i18n keys to sv.json**

Find the `"auth"` section in `src/locales/sv.json` and add these keys inside it (after the last existing auth key, before the closing `}`):

```json
"brand_tagline": "AI-driven marknadsföring för UF-företag",
"brand_feature_1": "Analysera sociala medier med AI",
"brand_feature_2": "Schemalägg och publicera innehåll",
"brand_feature_3": "Väx din publik organiskt"
```

- [ ] **Step 2.2 — Add i18n keys to en.json**

Find the `"auth"` section in `src/locales/en.json` and add:

```json
"brand_tagline": "AI-driven marketing for UF companies",
"brand_feature_1": "Analyze social media with AI",
"brand_feature_2": "Schedule and publish content",
"brand_feature_3": "Grow your audience organically"
```

- [ ] **Step 2.3 — Update Auth.tsx left panel**

In `src/pages/Auth.tsx`, find the left brand panel block (around line 339–359). Replace the hardcoded strings:

```tsx
<p className="text-white/70 text-lg max-w-sm">
  {t('auth.brand_tagline')}
</p>
<div className="mt-8 flex flex-col gap-3 text-sm text-white/60">
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-brand))]" />
    <span>{t('auth.brand_feature_1')}</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-brand))]" />
    <span>{t('auth.brand_feature_2')}</span>
  </div>
  <div className="flex items-center gap-2">
    <div className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--accent-brand))]" />
    <span>{t('auth.brand_feature_3')}</span>
  </div>
</div>
```

- [ ] **Step 2.4 — Commit**

```bash
rtk git add src/pages/Auth.tsx src/locales/sv.json src/locales/en.json && rtk git commit -m "fix(i18n): Auth left panel uses i18n keys instead of hardcoded Swedish strings"
```

---

## Task 3: Fix i18n Key Mismatches + Rename AI Profile → Company Information

**Files:**
- Modify: `src/components/AIProfileProgress.tsx`
- Modify: `src/locales/sv.json`
- Modify: `src/locales/en.json`

- [ ] **Step 3.1 — Fix broken key references in AIProfileProgress.tsx**

In `src/components/AIProfileProgress.tsx`, update lines 18–23:

```tsx
const fields = [
  { key: "foretagsnamn", label: t('ai_profile_progress.field_company') },
  { key: "branch",       label: t('ai_profile_progress.field_industry') },
  { key: "stad",         label: t('ai_profile_progress.field_city') },
  { key: "postnummer",   label: t('ai_profile_progress.field_postal') },
  { key: "malgrupp",     label: t('ai_profile_progress.field_audience') },
  { key: "produkt_beskrivning", label: t('ai_profile_progress.field_description') },
];
```

- [ ] **Step 3.2 — Rename in sv.json**

Find and update ALL values containing "AI-profil" or "AI profil" in `src/locales/sv.json`. Run this grep first to find every occurrence:

```bash
rtk grep "AI-profil\|AI profil\|AI Profile" src/locales/sv.json
```

Then update each found value — replace `"AI-profil"` → `"Företagsinformation"` and `"AI profil"` → `"Företagsinformation"` everywhere. Specifically:
- `ai_profile_progress.title`: `"Företagsinformation"`
- `ai_profile_progress.compact_label`: `"Företagsinformation:"`
- Any other keys matching the grep above

Also add these new keys. Find the `"nav"` section and add:
```json
"company": "Företagsinformation",
"settings_page": "Inställningar"
```

Add to `"settings"` section (if missing, create it):
```json
"settings": {
  "page_title": "Inställningar",
  "tab_profile": "Profil",
  "tab_company": "Företag",
  "tab_organisation": "Organisation",
  "tab_credits": "Krediter",
  "tab_app": "App"
}
```

Add to `"dashboard"` section:
```json
"most_commented": "Mest kommenterade",
"top_content": "Toppinnehåll",
"engagement_trend": "Engagemangstrend",
"no_video_data": "Inga videodata tillgängliga",
"connect_tiktok_data": "Koppla TikTok för att se data",
"metric_engagement": "Engagemang",
"metric_engagement_rate": "Engagemangsgrad",
"metric_views": "Visningar",
"metric_comments": "Kommentarer",
"view_on_tiktok": "Visa på TikTok"
```

Add to `"analytics"` section:
```json
"most_liked_analysis": "Analys av mest gillade videor",
"avg_duration_top": "Genomsnittlig längd (topp 5)",
"best_posting_day": "Bästa dag att posta",
"views_likes_ratio": "Visningar per gilla",
"common_keywords": "Vanliga nyckelord i titlar",
"content_performance": "Innehållsprestanda",
"engagement_breakdown": "Engagemangsfördelning",
"sort_by": "Sortera efter",
"col_title": "Titel",
"col_likes": "Gillar",
"col_comments": "Kommentarer",
"col_shares": "Delningar",
"col_views": "Visningar",
"col_engagement": "Engagemang",
"top_videos_insight": "Dina topp {{count}} videor",
"no_tiktok_videos": "Inga TikTok-videor tillgängliga"
```

- [ ] **Step 3.3 — Rename in en.json**

Same process for `src/locales/en.json`:
- `ai_profile_progress.title`: `"Company Information"`
- `ai_profile_progress.compact_label`: `"Company information:"`
- All other "AI Profile" → "Company Information" occurrences

Run grep first:
```bash
rtk grep "AI Profile\|AI profile" src/locales/en.json
```

Add the same new keys as sv.json but with English values:
```json
// nav section
"company": "Company Information",
"settings_page": "Settings"

// settings section
"settings": {
  "page_title": "Settings",
  "tab_profile": "Profile",
  "tab_company": "Company",
  "tab_organisation": "Organisation",
  "tab_credits": "Credits",
  "tab_app": "App"
}

// dashboard section
"most_commented": "Most commented",
"top_content": "Top content",
"engagement_trend": "Engagement trend",
"no_video_data": "No video data available",
"connect_tiktok_data": "Connect TikTok to see data",
"metric_engagement": "Engagement",
"metric_engagement_rate": "Engagement rate",
"metric_views": "Views",
"metric_comments": "Comments",
"view_on_tiktok": "View on TikTok"

// analytics section
"most_liked_analysis": "Most liked videos analysis",
"avg_duration_top": "Average duration (top 5)",
"best_posting_day": "Best day to post",
"views_likes_ratio": "Views per like",
"common_keywords": "Common title keywords",
"content_performance": "Content performance",
"engagement_breakdown": "Engagement breakdown",
"sort_by": "Sort by",
"col_title": "Title",
"col_likes": "Likes",
"col_comments": "Comments",
"col_shares": "Shares",
"col_views": "Views",
"col_engagement": "Engagement",
"top_videos_insight": "Your top {{count}} videos",
"no_tiktok_videos": "No TikTok videos available"
```

- [ ] **Step 3.4 — Commit**

```bash
rtk git add src/components/AIProfileProgress.tsx src/locales/sv.json src/locales/en.json && rtk git commit -m "fix(i18n): fix broken AIProfileProgress keys; rename AI Profile to Company Information throughout"
```

---

## Task 4: Dashboard Enhancements

**Files:**
- Modify: `src/pages/Dashboard.tsx`

This task removes the Instagram PlatformCard, adds Most Commented Videos, Top Content, and Engagement Sparkline widgets.

- [ ] **Step 4.1 — Remove Instagram from imports and state**

In `src/pages/Dashboard.tsx`:
1. Remove the `useMetaData` import (line 13) and its usage
2. Remove the `Instagram` icon import from lucide-react
3. Remove `metaData` from the component body
4. Remove `isConnected("meta_ig")` from `totalFollowers` calculation — keep only TikTok:

```tsx
const totalFollowers = isConnected("tiktok")
  ? (tiktokData.user?.follower_count || 0)
  : 0;
```

- [ ] **Step 4.2 — Remove Instagram PlatformCard, make TikTok full-width**

Find the platform row (around line 353–382):
```tsx
{/* ── Platform row ── */}
<div className="rounded-2xl overflow-hidden bg-card border border-border">
  <PlatformCard
    title="TikTok"
    icon={<TikTokIcon className="h-4 w-4" style={{ color: "white" }} />}
    iconBg="hsl(0 0% 50% / 0.15)"
    isConnected={isConnected("tiktok")}
    isLoading={tiktokData.loading}
    accentColor="hsl(var(--foreground))"
    metrics={[
      { label: t('dashboard.metric_followers'), value: formatNumber(tiktokData.user?.follower_count ?? 0) },
      { label: t('dashboard.metric_videos'), value: tiktokData.user?.video_count ?? 0 },
      { label: t('dashboard.metric_likes'), value: formatNumber(tiktokData.user?.likes_count ?? 0) },
      { label: t('dashboard.metric_following'), value: tiktokData.user?.following_count ?? 0 },
    ]}
  />
</div>
```

Replace the `grid lg:grid-cols-2 gap-3` wrapper with just the TikTok card (no grid, no Instagram card).

- [ ] **Step 4.3 — Add Most Commented + Top Content row**

After the platform card, add a new `grid lg:grid-cols-2 gap-3` row. Add these two new widgets. Add to the existing lucide-react import line (keep `BarChart3` and all other existing icons, just append the new ones):

```tsx
// Add to lucide-react import — keep BarChart3 and all existing icons:
ExternalLink, MessageCircle, ThumbsUp
```

Add to the existing recharts import line:
```tsx
// Add to recharts import:
BarChart, Bar, Cell
```

**Most Commented widget:**
```tsx
{isConnected("tiktok") && tiktokData.videos.length > 0 && (
  <motion.div
    initial={{ opacity: 0, y: 14 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.32, duration: 0.32, ease: "easeOut" }}
    className="rounded-2xl p-5 bg-card border border-border"
  >
    <div className="flex items-center gap-2.5 mb-4">
      <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted/60">
        <MessageCircle className="h-3.5 w-3.5" style={{ color: "hsl(210 78% 62%)" }} />
      </div>
      <h2 className="text-sm font-semibold text-foreground">
        {t('dashboard.most_commented')}
      </h2>
    </div>
    <div className="space-y-2.5">
      {[...tiktokData.videos]
        .sort((a, b) => b.comments - a.comments)
        .slice(0, 3)
        .map((video) => (
          <div key={video.id} className="flex items-center gap-3 rounded-xl p-2.5 bg-surface-raised border border-border/50">
            {video.cover_image_url ? (
              <img
                src={video.cover_image_url}
                alt=""
                className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-muted flex-shrink-0" />
            )}
            <p className="text-xs font-medium flex-1 line-clamp-2 leading-tight text-foreground">
              {video.title || "—"}
            </p>
            <div className="flex items-center gap-1 flex-shrink-0">
              <MessageCircle className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-semibold" style={{ color: "hsl(210 78% 62%)" }}>
                {formatNumber(video.comments)}
              </span>
            </div>
            {video.share_url && (
              <a href={video.share_url} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
                <ExternalLink className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
              </a>
            )}
          </div>
        ))}
    </div>
  </motion.div>
)}
```

**Top Content widget:**
```tsx
{isConnected("tiktok") && tiktokData.videos.length > 0 && (() => {
  const topVideo = [...tiktokData.videos].sort((a, b) => b.likes - a.likes)[0];
  const engRate = topVideo.views > 0
    ? (((topVideo.likes + topVideo.comments) / topVideo.views) * 100).toFixed(1)
    : "0.0";
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.36, duration: 0.32, ease: "easeOut" }}
      className="rounded-2xl p-5 bg-card border border-border"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted/60">
          <ThumbsUp className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
        </div>
        <h2 className="text-sm font-semibold text-foreground">
          {t('dashboard.top_content')}
        </h2>
      </div>
      <div className="flex gap-3">
        {topVideo.cover_image_url ? (
          <img src={topVideo.cover_image_url} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-muted flex-shrink-0" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium line-clamp-2 leading-snug mb-2 text-foreground">{topVideo.title || "—"}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              { label: t('dashboard.metric_likes'), value: formatNumber(topVideo.likes) },
              { label: t('dashboard.metric_views'), value: formatNumber(topVideo.views) },
              { label: t('dashboard.metric_comments'), value: formatNumber(topVideo.comments) },
              { label: t('dashboard.metric_engagement_rate'), value: `${engRate}%` },
            ].map(({ label, value }) => (
              <div key={label} className="rounded-lg p-1.5 bg-surface-raised border border-border/50">
                <p className="text-[10px] text-muted-foreground">{label}</p>
                <p className="text-xs font-bold text-foreground">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
})()}
```

Wrap both widgets in:
```tsx
<div className="grid lg:grid-cols-2 gap-3">
  {/* Most Commented */}
  {/* Top Content */}
</div>
```

- [ ] **Step 4.4 — Add Engagement Sparkline**

After the Most Commented + Top Content row, add the sparkline:

```tsx
{isConnected("tiktok") && tiktokData.videos.length >= 3 && (() => {
  const sparkData = [...tiktokData.videos]
    .slice(0, 8)
    .reverse()
    .map((v, i) => ({
      name: `${i + 1}`,
      rate: v.views > 0 ? parseFloat((((v.likes + v.comments) / v.views) * 100).toFixed(2)) : 0,
    }));
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.35 }}
      className="rounded-2xl p-5 bg-card border border-border"
    >
      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted/60">
          <BarChart3 className="h-3.5 w-3.5" style={{ color: "hsl(var(--accent-brand))" }} />
        </div>
        <h2 className="text-sm font-semibold text-foreground">{t('dashboard.engagement_trend')}</h2>
        <span className="ml-auto text-xs text-muted-foreground">{t('dashboard.metric_engagement_rate')}</span>
      </div>
      <div style={{ height: 80 }}>
        <ResponsiveContainer width="100%" height={80}>
          <BarChart data={sparkData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
            <Tooltip
              contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
              formatter={(val: number) => [`${val}%`, t('dashboard.metric_engagement_rate')]}
            />
            <Bar dataKey="rate" radius={[3, 3, 0, 0]}>
              {sparkData.map((_, idx) => (
                <Cell key={idx} fill={`hsl(var(--primary) / ${0.5 + (idx / sparkData.length) * 0.5})`} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
})()}
```

Add `BarChart, Bar, Cell` to the recharts import line at the top of Dashboard.tsx.

- [ ] **Step 4.5 — Update connection link**

Find `<Link to="/account">` in Dashboard.tsx (PlatformCard not-connected button). Update to:
```tsx
<Link to="/settings?tab=app">
```

- [ ] **Step 4.6 — Add missing metric key**

In `Dashboard.tsx` metric labels for Top Content widget, the key `dashboard.metric_views` should already exist. Verify it exists in sv.json/en.json. If not, add it.

- [ ] **Step 4.7 — Commit**

```bash
rtk git add src/pages/Dashboard.tsx && rtk git commit -m "feat(dashboard): remove Instagram card, add Most Commented, Top Content, and Engagement Sparkline widgets"
```

---

## Task 5: Analytics Enhancements

**Files:**
- Modify: `src/components/analytics/AnalyticsContent.tsx`

- [ ] **Step 5.1 — Add imports**

Add to existing imports in `AnalyticsContent.tsx`:
```tsx
import { BarChart, Bar, XAxis as BXAxis, YAxis as BYAxis, Tooltip as BTooltip, ResponsiveContainer as BRC, Legend as BLegend, Cell } from "recharts";
import { useState } from "react";
import { ExternalLink, TrendingUp, Clock, Calendar, Hash } from "lucide-react";
```

Note: Recharts components can be imported once and used multiple times. The `XAxis`, `YAxis` etc. are already imported in the file — use those directly, no renaming needed. Just add `BarChart, Bar, Cell` to the existing import.

- [ ] **Step 5.2 — Add Most Liked Analysis section**

After the closing `</div>` of the Platform Breakdown section, add:

```tsx
{/* Most Liked Analysis */}
{isConnected('tiktok') && tiktokData.videos.length >= 3 && (() => {
  const sorted = [...tiktokData.videos].sort((a, b) => b.likes - a.likes);
  const top5 = sorted.slice(0, 5);
  const overall = tiktokData.videos;

  // Average duration
  const avgDurTop = top5.filter(v => v.duration).reduce((s, v) => s + (v.duration || 0), 0) / (top5.filter(v => v.duration).length || 1);
  const avgDurAll = overall.filter(v => v.duration).reduce((s, v) => s + (v.duration || 0), 0) / (overall.filter(v => v.duration).length || 1);

  // Best posting day
  const dayCounts: Record<number, number> = {};
  top5.forEach(v => {
    if (!v.created_at) return;
    const day = new Date(v.created_at).getDay();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });
  const dayNames = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
  const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
  const bestDayName = bestDay ? dayNames[parseInt(bestDay[0])] : '–';

  // Views per like ratio
  const avgVPL = top5.filter(v => v.likes > 0)
    .reduce((s, v) => s + (v.views / v.likes), 0) / (top5.filter(v => v.likes > 0).length || 1);

  // Common keywords from titles
  const stopWords = new Set(['och', 'en', 'ett', 'den', 'det', 'de', 'som', 'är', 'på', 'i', 'att', 'the', 'a', 'an', 'and', 'of', 'to', 'in', 'is', 'it']);
  const wordFreq: Record<string, number> = {};
  top5.forEach(v => {
    (v.title || '').toLowerCase().replace(/[^a-zåäö0-9\s]/g, '').split(/\s+/).forEach(w => {
      if (w.length >= 4 && !stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
    });
  });
  const topKeywords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);

  const insights = [
    {
      icon: Clock,
      label: t('analytics.avg_duration_top'),
      value: avgDurTop > 0 ? `${Math.round(avgDurTop)}s` : '–',
      sub: avgDurAll > 0 && avgDurTop > 0 ? `${avgDurTop > avgDurAll ? '+' : ''}${Math.round(avgDurTop - avgDurAll)}s vs snitt` : undefined,
      color: "hsl(var(--primary))",
    },
    {
      icon: Calendar,
      label: t('analytics.best_posting_day'),
      value: bestDayName,
      color: "hsl(174 60% 50%)",
    },
    {
      icon: TrendingUp,
      label: t('analytics.views_likes_ratio'),
      value: avgVPL > 0 ? `${Math.round(avgVPL)}x` : '–',
      color: "hsl(var(--accent-brand))",
    },
    {
      icon: Hash,
      label: t('analytics.common_keywords'),
      value: topKeywords.length > 0 ? topKeywords.join(', ') : '–',
      color: "hsl(320 65% 62%)",
    },
  ];

  return (
    <div className="rounded-xl bg-card shadow-sm p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">{t('analytics.most_liked_analysis')}</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {insights.map(({ icon: Icon, label, value, sub, color }) => (
          <div key={label} className="rounded-xl p-3 bg-surface-raised border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                <Icon className="h-3.5 w-3.5" style={{ color }} />
              </div>
              <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
            </div>
            <p className="text-base font-bold text-foreground">{value}</p>
            {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
          </div>
        ))}
      </div>
    </div>
  );
})()}
```

- [ ] **Step 5.3 — Add Engagement Breakdown Chart**

After the Most Liked Analysis section, add:

```tsx
{isConnected('tiktok') && tiktokData.videos.length > 0 && (() => {
  // Use static English keys in data objects to avoid language-switch breakage.
  // Only translate in Legend formatter and Tooltip — never use t() as an object key.
  const breakdownData = [...tiktokData.videos]
    .slice(0, 10)
    .reverse()
    .map((v, i) => ({
      name: v.title ? v.title.substring(0, 12) + (v.title.length > 12 ? '…' : '') : `#${i + 1}`,
      likes: v.likes,
      comments: v.comments,
      shares: v.shares,
    }));

  return (
    <div className="rounded-xl bg-card shadow-sm p-5">
      <h3 className="text-sm font-medium text-foreground mb-4">{t('analytics.engagement_breakdown')}</h3>
      <div style={{ height: 200 }}>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={breakdownData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11 }}
              formatter={(val: number, key: string) => [val, key === 'likes' ? t('analytics.col_likes') : key === 'comments' ? t('analytics.col_comments') : t('analytics.col_shares')]}
            />
            <Legend formatter={(key) => key === 'likes' ? t('analytics.col_likes') : key === 'comments' ? t('analytics.col_comments') : t('analytics.col_shares')} wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="likes" stackId="a" fill="hsl(var(--primary))" />
            <Bar dataKey="comments" stackId="a" fill="hsl(210 78% 62%)" />
            <Bar dataKey="shares" stackId="a" fill="hsl(174 60% 50%)" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
})()}
```

- [ ] **Step 5.4 — Add Content Performance Table**

After Engagement Breakdown, add the sortable table.

**FIRST** — add sort state to the top of the `AnalyticsContent` component body (alongside existing state, before the `return`):

```tsx
const [sortKey, setSortKey] = useState<'likes' | 'comments' | 'shares' | 'views' | 'rate'>('likes');
const [sortAsc, setSortAsc] = useState(false);
```

Then in the JSX, add the table (no `useState` calls inside — use the component-level state above):

```tsx
{isConnected('tiktok') && tiktokData.videos.length > 0 && (() => {
  const tableData = [...tiktokData.videos].map(v => ({
    ...v,
    rate: v.views > 0 ? parseFloat((((v.likes + v.comments) / v.views) * 100).toFixed(1)) : 0,
  })).sort((a, b) => {
    const va = a[sortKey === 'rate' ? 'rate' : sortKey] as number;
    const vb = b[sortKey === 'rate' ? 'rate' : sortKey] as number;
    return sortAsc ? va - vb : vb - va;
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) setSortAsc(p => !p);
    else { setSortKey(key); setSortAsc(false); }
  };

  const SortHeader = ({ col, label }: { col: typeof sortKey; label: string }) => (
    <th
      onClick={() => handleSort(col)}
      className="text-right text-[11px] font-medium text-muted-foreground px-3 py-2 cursor-pointer select-none hover:text-foreground transition-colors"
    >
      {label} {sortKey === col ? (sortAsc ? '↑' : '↓') : ''}
    </th>
  );

  return (
    <div className="rounded-xl bg-card shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="text-sm font-medium text-foreground">{t('analytics.content_performance')}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/40">
            <tr>
              <th className="text-left text-[11px] font-medium text-muted-foreground px-3 py-2">{t('analytics.col_title')}</th>
              <SortHeader col="likes" label={t('analytics.col_likes')} />
              <SortHeader col="comments" label={t('analytics.col_comments')} />
              <SortHeader col="shares" label={t('analytics.col_shares')} />
              <SortHeader col="views" label={t('analytics.col_views')} />
              <SortHeader col="rate" label={t('analytics.col_engagement')} />
            </tr>
          </thead>
          <tbody>
            {tableData.map((v, i) => (
              <tr key={v.id} className={`border-t border-border/40 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                <td className="px-3 py-2.5 max-w-[180px]">
                  <div className="flex items-center gap-2">
                    {v.cover_image_url ? (
                      <img src={v.cover_image_url} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />
                    )}
                    <span className="text-xs text-foreground line-clamp-1">{v.title || '–'}</span>
                  </div>
                </td>
                <td className="text-right px-3 py-2.5 text-xs font-medium text-foreground">{formatNumber(v.likes)}</td>
                <td className="text-right px-3 py-2.5 text-xs text-foreground">{formatNumber(v.comments)}</td>
                <td className="text-right px-3 py-2.5 text-xs text-foreground">{formatNumber(v.shares)}</td>
                <td className="text-right px-3 py-2.5 text-xs text-foreground">{formatNumber(v.views)}</td>
                <td className="text-right px-3 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>{v.rate}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
})()}
```

**Note:** The `useState` inside an IIFE won't work — React hooks cannot be called inside callbacks. Refactor: instead of an IIFE, lift the sort state to the top of `AnalyticsContent` component and conditionally render:

At the top of the `AnalyticsContent` component body, add:
```tsx
const [sortKey, setSortKey] = useState<'likes' | 'comments' | 'shares' | 'views' | 'rate'>('likes');
const [sortAsc, setSortAsc] = useState(false);
```

Then replace the `useState` calls inside the table JSX with these component-level state variables.

- [ ] **Step 5.5 — Add BarChart and Cell to Recharts imports**

In AnalyticsContent.tsx, update the recharts import:
```tsx
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Legend, BarChart, Bar, Cell,
} from "recharts";
```

- [ ] **Step 5.6 — Add formatNumber helper to AnalyticsContent.tsx**

Add this helper at the top of the file (before the component):
```tsx
const fmt = (n: number) => n >= 1_000_000 ? (n/1_000_000).toFixed(1)+'M' : n >= 1_000 ? (n/1_000).toFixed(1)+'k' : String(n);
```

Then use `fmt()` in place of `formatNumber()` in AnalyticsContent.

- [ ] **Step 5.7 — Commit**

```bash
rtk git add src/components/analytics/AnalyticsContent.tsx && rtk git commit -m "feat(analytics): add Most Liked Analysis, Engagement Breakdown chart, and sortable Content Performance table"
```

---

## Task 6: Hero Scroll Animation

**Files:**
- Modify: `src/components/Hero.tsx`
- Modify: `src/pages/Index.tsx`

- [ ] **Step 6.1 — Add scroll hooks and logo import to Hero.tsx**

Add these imports to `src/components/Hero.tsx`. Check each one — avoid duplicates if already present:
```tsx
import { useRef } from "react";
import { useScroll, useTransform, useSpring } from "framer-motion";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";  // add this — Hero does not currently import the logo
```

(`motion` is already imported in Hero.tsx. `Link` check before adding.)

- [ ] **Step 6.2 — Set up scroll tracking inside Hero component**

Inside the `Hero` component body, before the return statement, add:

```tsx
// Scroll-linked animation — tracks first 600px of page scroll
const heroRef = useRef<HTMLElement>(null);
const { scrollY } = useScroll();
const smoothScrollY = useSpring(scrollY, { stiffness: 300, damping: 40, restDelta: 0.001 });

// All transforms derived from raw scrollY (not smoothed) for scroll-sync accuracy
// Use smoothScrollY for spring-smoothed values
const heroHeight = useTransform(smoothScrollY, [0, 600], ["100vh", "64px"]);
const overlayOpacity = useTransform(smoothScrollY, [0, 500], [0, 0.65]);
const contentOpacity = useTransform(smoothScrollY, [0, 300], [1, 0]);
const contentY = useTransform(smoothScrollY, [0, 300], [0, -40]);
const cardScale = useTransform(smoothScrollY, [0, 350], [1, 0.75]);
const cardOpacity = useTransform(smoothScrollY, [0, 320], [1, 0]);
const wordmarkOpacity = useTransform(smoothScrollY, [0, 280], [1, 0]);
const wordmarkX = useTransform(smoothScrollY, [0, 280], [0, -14]);
const logoScale = useTransform(smoothScrollY, [0, 400], [1, 1.2]);
const navOpacity = useTransform(smoothScrollY, [350, 560], [0, 1]);
const navPointerEvents = useTransform(smoothScrollY, [350, 360], ["none", "auto"]);
```

- [ ] **Step 6.3 — Wrap the Hero outer section in a sticky motion.section**

Replace the existing `<section className="relative min-h-[90vh] ...">` opening tag with:

```tsx
<motion.section
  ref={heroRef}
  className="relative overflow-visible"
  style={{
    height: heroHeight,
    position: "sticky",
    top: 0,
    zIndex: 50,
    willChange: "transform",
  }}
>
  {/* Dark scroll overlay */}
  <motion.div
    className="absolute inset-0 bg-black pointer-events-none"
    style={{ opacity: overlayOpacity, zIndex: 1 }}
  />
```

Close with `</motion.section>` at the end.

**IMPORTANT:** The existing background layer, orbs, and content div must all be wrapped inside this new `motion.section`. The existing `<div className="container mx-auto ...">` becomes a motion.div:

```tsx
<motion.div
  className="container mx-auto px-6 relative py-12"
  style={{ opacity: contentOpacity, y: contentY, zIndex: 2 }}
>
```

For the right column (auth card):
```tsx
<motion.div
  initial={{ opacity: 0, x: 24, y: 8 }}
  animate={{ opacity: 1, x: 0, y: 0 }}
  transition={{ duration: 0.55, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
  style={{ scale: cardScale, opacity: cardOpacity }}
  className="relative rounded-2xl p-7 ..."
>
```

For the "Promotley" logo+wordmark in the brand panel area, wrap the logo image in:
```tsx
<motion.img style={{ scale: logoScale }} src={logo} ... />
```

The wordmark text next to logo (if present) gets:
```tsx
<motion.span style={{ opacity: wordmarkOpacity, x: wordmarkX }}>Promotley</motion.span>
```

- [ ] **Step 6.4 — Add collapsed navbar inside the sticky hero**

After the container div (the hero content), add the collapsed nav bar that fades in as the hero collapses. This sits at the top of the sticky container, always positioned at the top:

```tsx
{/* Collapsed navbar — fades in as hero scrolls away */}
<motion.nav
  className="absolute inset-x-0 top-0 h-16 px-6 flex items-center justify-between"
  style={{
    opacity: navOpacity,
    pointerEvents: navPointerEvents,
    background: "hsl(var(--card) / 0.85)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    borderBottom: "1px solid hsl(var(--border))",
    zIndex: 3,
  }}
>
  {/* Logo + wordmark */}
  <Link to="/" className="flex items-center gap-2 font-bold text-lg shrink-0">
    <img src={logo} alt="Promotley" className="w-8 h-8" />
    <span className="text-foreground">Promotley</span>
  </Link>

  {/* Nav links — desktop only */}
  <div className="hidden md:flex items-center gap-6">
    {[
      { label: t('nav.pricing'), href: "/#pricing" },
      { label: t('nav.demo'), href: "/demo" },
      { label: t('nav.about'), href: "/about" },
    ].map(({ label, href }) => (
      <Link key={href} to={href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
        {label}
      </Link>
    ))}
  </div>

  {/* CTA buttons */}
  <div className="flex items-center gap-2">
    <Link to="/auth">
      <button className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-3 py-1.5">
        {t('nav.login')}
      </button>
    </Link>
    <Link to="/auth?mode=register">
      <button
        className="text-sm font-medium px-4 py-1.5 rounded-lg"
        style={{ background: "hsl(var(--primary))", color: "white" }}
      >
        {t('hero.cta_primary')}
      </button>
    </Link>
  </div>
</motion.nav>
```

- [ ] **Step 6.5 — Remove Navbar from Index.tsx**

In `src/pages/Index.tsx`:
1. Remove `import Navbar from "@/components/Navbar";`
2. Remove `<Navbar logoStripRef={logoStripRef} />` from the JSX

The Hero now handles the sticky navbar behavior. Other pages still use `<Navbar />` unchanged.

- [ ] **Step 6.6 — Add spacer div to Index.tsx**

After `<Hero />` in Index.tsx, add a spacer so the content below the hero doesn't jump when the hero becomes sticky:

```tsx
<Hero />
{/* Spacer compensates for the sticky hero so content begins below it on load */}
<div style={{ height: 0 }} />
```

Actually the content naturally flows after the sticky hero since sticky elements don't take up space in normal flow. No spacer needed — test and verify.

- [ ] **Step 6.7 — Verify hero behaviour**

Run `npm run dev`. Open `/`. Verify:
- At scrollY=0: hero looks exactly as before, no visible diff
- Scrolling slowly: hero gradually darkens and shrinks
- After ~600px scroll: hero is a compact 64px glass navbar
- Logo stays visible throughout, wordmark fades toward end
- Existing entrance animations still fire on mount

- [ ] **Step 6.8 — Commit**

```bash
rtk git add src/components/Hero.tsx src/pages/Index.tsx && rtk git commit -m "feat(hero): add scroll-linked collapse animation — hero compacts into sticky glass navbar on scroll"
```

---

## Task 7: Navigation Restructure + New Settings Page

**Files:**
- Modify: `src/components/AppSidebar.tsx`
- Rewrite: `src/pages/Settings.tsx`
- Modify: `src/App.tsx`

- [ ] **Step 7.1 — Update AppSidebar nav items**

In `src/components/AppSidebar.tsx`, update the `navItems` array (lines 56–63). Replace the `Account` item and add `Settings`:

```tsx
import { Home, TrendingUp, CalendarDays, Wand2, Building2, Settings2, BrainCircuit } from "lucide-react";

const navItems = [
  { title: t('nav.home'),         href: "/dashboard",         icon: Home },
  { title: t('nav.analytics'),    href: "/analytics",         icon: TrendingUp },
  { title: t('nav.tools'),        href: "/ai",                icon: Wand2 },
  { title: t('nav.ai_chat'),      href: "/ai/chat",           icon: BrainCircuit },
  { title: t('nav.calendar'),     href: "/calendar",          icon: CalendarDays },
  { title: t('nav.company'),      href: "/settings/company",  icon: Building2 },
  { title: t('nav.settings_page'),href: "/settings",          icon: Settings2 },
];
```

Note: Use `Settings2` (outlined settings icon) for the nav item to distinguish it from the `Settings` icon used in the popup trigger at the bottom of the sidebar.

Also in `AppSidebar.tsx`, find the `isActive` helper function and remove the hardcoded `/account` special case — it will be dead code after this task and can confuse future maintainers. The new items use standard path prefix matching which works correctly.

- [ ] **Step 7.2 — Rewrite Settings.tsx as tabbed layout**

Replace the entire content of `src/pages/Settings.tsx` with:

```tsx
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AccountContent from "@/components/account/AccountContent";
import OrganizationContent from "@/components/account/OrganizationContent";
import AppSettingsContent from "@/components/account/AppSettingsContent";
import CompanySettings from "@/pages/settings/CompanySettings";
import CreditsSettings from "@/pages/settings/CreditsSettings";
import { cn } from "@/lib/utils";
import { User, Building2, Users, CreditCard, Settings } from "lucide-react";

const TABS = [
  { id: "profile",      labelKey: "settings.tab_profile",       icon: User,        Component: AccountContent },
  { id: "company",      labelKey: "settings.tab_company",       icon: Building2,   Component: () => <CompanySettingsContent /> },
  { id: "organisation", labelKey: "settings.tab_organisation",  icon: Users,       Component: OrganizationContent },
  { id: "credits",      labelKey: "settings.tab_credits",       icon: CreditCard,  Component: () => <CreditsSettingsContent /> },
  { id: "app",          labelKey: "settings.tab_app",           icon: Settings,    Component: AppSettingsContent },
] as const;
```

**Important note:** `CompanySettings` and `CreditsSettings` currently wrap their content in `DashboardLayout`. We cannot render them inside another DashboardLayout. Options:
- **Option A (recommended):** Extract the inner content of CompanySettings and CreditsSettings into separate content components (`CompanySettingsContent`, `CreditsSettingsContent`) similar to how AccountContent, OrganizationContent, AppSettingsContent are already separated.
- **Option B:** Keep the sub-pages as standalone routes and just navigate to them from the Settings tabs.

Use Option A. In `src/pages/settings/CompanySettings.tsx`, extract everything inside `<DashboardLayout>` into a new `export function CompanySettingsInner()` and render that inside the DashboardLayout. Then import `CompanySettingsInner` in the Settings page.

Same for `CreditsSettings.tsx` → `CreditsSettingsInner`.

Full Settings.tsx:

```tsx
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import AccountContent from "@/components/account/AccountContent";
import OrganizationContent from "@/components/account/OrganizationContent";
import AppSettingsContent from "@/components/account/AppSettingsContent";
import { CompanySettingsInner } from "@/pages/settings/CompanySettings";
import { CreditsSettingsInner } from "@/pages/settings/CreditsSettings";
import { cn } from "@/lib/utils";
import { User, Building2, Users, CreditCard, Settings } from "lucide-react";

const TABS = [
  { id: "profile",      labelKey: "settings.tab_profile",       icon: User,       Content: AccountContent },
  { id: "company",      labelKey: "settings.tab_company",       icon: Building2,  Content: CompanySettingsInner },
  { id: "organisation", labelKey: "settings.tab_organisation",  icon: Users,      Content: OrganizationContent },
  { id: "credits",      labelKey: "settings.tab_credits",       icon: CreditCard, Content: CreditsSettingsInner },
  { id: "app",          labelKey: "settings.tab_app",           icon: Settings,   Content: AppSettingsContent },
];

const SettingsPage = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "profile";
  const currentTab = TABS.find(tab => tab.id === activeTab) || TABS[0];
  const { Content } = currentTab;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t('settings.page_title')}
          </h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-1 p-1 rounded-xl bg-muted/60 border border-border mb-6 overflow-x-auto">
          {TABS.map(({ id, labelKey, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSearchParams({ tab: id })}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                activeTab === id
                  ? "bg-card text-foreground shadow-sm border border-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {t(labelKey)}
            </button>
          ))}
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            <Content />
          </motion.div>
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
};

export default SettingsPage;
```

- [ ] **Step 7.3 — Extract CompanySettingsInner**

In `src/pages/settings/CompanySettings.tsx`:
1. Rename the existing default export function from `CompanySettings` to `CompanySettingsPage`
2. Extract the JSX inside `<DashboardLayout>` into a named export `CompanySettingsInner`:

```tsx
export function CompanySettingsInner() {
  // ... all the existing JSX and state that was inside <DashboardLayout>
}

export default function CompanySettings() {
  return (
    <DashboardLayout>
      <CompanySettingsInner />
    </DashboardLayout>
  );
}
```

- [ ] **Step 7.4 — Extract CreditsSettingsInner**

Do the same for `src/pages/settings/CreditsSettings.tsx`:

```tsx
export function CreditsSettingsInner() {
  // all inner content
}

export default function CreditsSettings() {
  return (
    <DashboardLayout>
      <CreditsSettingsInner />
    </DashboardLayout>
  );
}
```

- [ ] **Step 7.5 — Update App.tsx routing**

In `src/App.tsx`:

1. Add the lazy import for the Settings page — it is NOT currently imported and the `/settings` route only redirected before:
```tsx
// Add with the other lazy imports at the top of App.tsx:
const Settings = React.lazy(() => import("./pages/Settings"));
```

2. Replace line 163:
```tsx
// REMOVE:
<Route path="/settings" element={<Navigate to="/settings/profile" replace />} />

// ADD:
<Route path="/settings" element={<ProtectedRoute><PageTransition><Settings /></PageTransition></ProtectedRoute>} />
```

3. Update individual sub-routes to redirect to `/settings?tab=xxx`:
```tsx
<Route path="/settings/profile" element={<Navigate to="/settings?tab=profile" replace />} />
<Route path="/settings/company" element={<Navigate to="/settings?tab=company" replace />} />
<Route path="/settings/credits" element={<Navigate to="/settings?tab=credits" replace />} />
<Route path="/settings/app"     element={<Navigate to="/settings?tab=app" replace />} />
```

4. Update `/account` redirect:
```tsx
<Route path="/account" element={<Navigate to="/settings?tab=profile" replace />} />
```

- [ ] **Step 7.6 — Verify navigation**

Run `npm run dev`:
- Click "Företagsinformation" in sidebar → lands on `/settings/company` → redirects to `/settings?tab=company`
- Click "Inställningar" in sidebar → lands on `/settings` with Profile tab active
- Settings icon at bottom of sidebar → popup appears (unchanged)
- All 5 tabs render their content correctly
- Deep link `/settings?tab=credits` opens Credits tab directly

- [ ] **Step 7.7 — Commit**

```bash
rtk git add src/components/AppSidebar.tsx src/pages/Settings.tsx src/pages/settings/CompanySettings.tsx src/pages/settings/CreditsSettings.tsx src/App.tsx && rtk git commit -m "feat(nav): replace Account with Company Information nav item; add unified tabbed Settings page at /settings"
```

---

## Task 8: Final Verification Pass

- [ ] **Step 8.1 — Light mode check**

Toggle to light mode. Verify every new component:
- FAQ: readable text ✓
- Dashboard widgets (Most Commented, Top Content, Sparkline): correct colors ✓
- Analytics enhancements: correct colors ✓
- Hero collapsed nav: glass effect visible, text readable ✓
- Settings tab bar: active tab highlighted ✓

- [ ] **Step 8.2 — Dark mode check**

Toggle to dark mode. Same checks.

- [ ] **Step 8.3 — i18n check**

Switch language to English (if a language switcher is available) and verify:
- FAQ title: "Frequently asked questions"
- Sidebar: "Company Information", "Settings"
- AIProfileProgress: "Company information: X/6 fields"
- Dashboard widgets: English labels
- Analytics: English column headers and insight labels

- [ ] **Step 8.4 — Empty states**

Disconnect TikTok (or use a test account with no videos). Verify:
- Dashboard Most Commented: widget is hidden (not rendered when `videos.length === 0`)
- Dashboard Top Content: hidden
- Dashboard Sparkline: hidden
- Analytics new sections: show empty state text not crash

- [ ] **Step 8.5 — Hero animation performance**

Open Chrome DevTools → Performance tab. Record while scrolling on `/`. Verify no layout thrash (no yellow "Layout" events triggered by the scroll animation).

- [ ] **Step 8.6 — Final commit**

```bash
rtk git add -A && rtk git commit -m "chore: final verification pass — light/dark mode, i18n, empty states confirmed"
```

---

## Notes for Implementation

1. **Don't edit auto-generated files:** `src/integrations/supabase/client.ts` and `types.ts` — never touch these.

2. **Framer Motion combine styles:** When a `motion.div` has both `initial/animate` (entrance) AND `style` (scroll-driven), both work simultaneously. The entrance animation sets initial position, scroll-driven values override from there as user scrolls.

3. **`useTransform` returns a `MotionValue`** — pass it to `style` prop, not `className`. Never interpolate into a string directly.

4. **BarChart inside IIFE won't work for hooks** — always lift `useState` to the component level, never inside an IIFE or callback.

5. **Check for duplicate imports** before adding — Hero.tsx already imports `motion` and several hooks. Avoid re-importing.

6. **Settings "Company Information" tab:** The `CompanySettingsInner` component must NOT include a `<DashboardLayout>` wrapper. It renders directly inside the Settings page's DashboardLayout.
