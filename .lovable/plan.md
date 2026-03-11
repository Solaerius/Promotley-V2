

# Dashboard Overhaul Plan

## Summary of Decisions (from interview)

- **Layout**: Sidebar + content (replaces floating navbar)
- **Sidebar**: Logo top, nav links, user profile at bottom, collapsible to icon-mini
- **Hero**: Compact greeting with 2-3 small action buttons
- **Stat cards**: Soft glass style, reworked
- **Quick links**: Subtler, smaller buttons
- **Growth chart**: Removed from dashboard (moved to Statistik page later)
- **Connection manager**: Compact icons with status badges
- **ChatWidget**: Move to sidebar as a chat button
- **Credits**: Thin progress bar in profile dropdown (color-coded green/yellow/red)
- **Upgrade CTA/promo**: Subtle banner only
- **Footer**: Minimal (copyright + 2 links)
- **Animations**: Minimal fade only, no staggered delays
- **Typography**: Compact & tight
- **Background**: Subtle gradient, no animated orbs
- **Dark mode toggle**: In profile dropdown
- **Notifications**: Bell icon in content header area
- **Navbar position toggle**: Keep (move to sidebar settings or footer)
- **Mobile nav**: Sidebar slides in from left

## Architecture Changes

```text
BEFORE:
┌──────────────────────────────────────┐
│  Floating navbar (top/bottom/L/R)    │
├──────────────────────────────────────┤
│  DashboardLayout (full-width)        │
│  ┌────────────────────────────────┐  │
│  │ Hero Banner (large)            │  │
│  │ Stats (4 cards)                │  │
│  │ Quick Links (3 large cards)    │  │
│  │ Growth Chart                   │  │
│  │ Connection Manager (full card) │  │
│  │ Promo/Upgrade banners          │  │
│  │ ChatWidget (floating)          │  │
│  └────────────────────────────────┘  │
│  Footer (3-col)                      │
└──────────────────────────────────────┘

AFTER:
┌─────────┬────────────────────────────┐
│ Sidebar │ Content Header (notifs)    │
│ ┌─────┐ ├────────────────────────────┤
│ │Logo │ │ Compact hero (greeting +   │
│ ├─────┤ │   2-3 action buttons)      │
│ │ Nav │ │                            │
│ │links│ │ Stats (4 glass cards)      │
│ │     │ │                            │
│ │Chat │ │ Connections (icon strip)   │
│ │     │ │                            │
│ │     │ │ Quick links (subtle)       │
│ │     │ │                            │
│ ├─────┤ │ Subtle upgrade banner      │
│ │User │ │                            │
│ │Prof │ │ Minimal footer             │
│ └─────┘ └────────────────────────────┘
```

## Files to Create/Modify

### 1. Create `src/components/AppSidebar.tsx` (NEW)
- Shadcn `Sidebar` component with `collapsible="icon"`
- Logo at top
- Nav links: Home, Statistik, AI, Kalender, Konto (same routes)
- Chat button (opens ChatWidget or navigates to /ai)
- Navbar position toggle
- User profile section at bottom: avatar, name, dropdown with credits (thin color-coded progress bar), dark mode toggle, settings, sign out
- On mobile: slides in from left via `SidebarTrigger`

### 2. Rewrite `src/components/layouts/DashboardLayout.tsx`
- Wrap in `SidebarProvider`
- Replace `DashboardNavbar` with `AppSidebar`
- Add a content header bar with: `SidebarTrigger` (mobile), page title, notification bell, and compact actions
- Remove animated blur orbs, keep only subtle gradient background
- Remove `useNavbarPosition` padding logic (sidebar handles its own space)
- Minimal footer inline

### 3. Rewrite `src/pages/Dashboard.tsx`
- Remove `HeroBanner` component usage, replace with a compact greeting section (one-liner "Välkommen tillbaka" + 2-3 small action links)
- Rework stat cards: keep 4 cards, soft glass, smaller padding, tighter typography
- Remove growth chart entirely (will be on /analytics)
- Rework `ConnectionManager` to compact icon strip with status badges
- Remove `ChatWidget` (moved to sidebar)
- Quick links: smaller, subtle text-based links or small icon buttons
- Subtle upgrade banner (only for free/starter)
- Remove promo code section from dashboard
- All animations reduced to simple opacity fade (no stagger delays)

### 4. Modify `src/components/CreditsDisplay.tsx`
- Fix the progress bar color bug: apply green (>50%), yellow (20-50%), red (<20%) based on percentage
- Remove "Avsluta prenumeration" references
- Compact design for dropdown placement

### 5. Modify `src/components/ConnectionManager.tsx`
- Redesign to show platforms as a horizontal row of small icons
- Each icon has a green checkmark badge if connected, gray if not
- Click to connect/disconnect via popover or inline action
- Much more compact than current full-card layout

### 6. Modify `src/components/DashboardFooter.tsx`
- Reduce to single line: copyright + privacy policy + terms links
- No 3-column grid

### 7. Update `src/components/DashboardNavbar.tsx`
- Keep the component but it will only be used as fallback or eventually deprecated
- The new `AppSidebar` replaces its functionality

### 8. Update mobile: Remove/update `src/components/BottomTabBar.tsx`
- The bottom tab bar is replaced by the slide-in sidebar on mobile

### 9. CSS changes in `src/index.css`
- Remove or simplify `liquid-glass` styles if moving to cleaner look
- Ensure the soft glass cards work in both themes without the heavy orb backgrounds

## Key Design Principles
- **No staggered animations** -- single subtle fade-in for the whole page
- **Compact typography** -- smaller headings, tighter gaps, less padding
- **Clean white** in light mode, clean dark in dark mode
- **Color-coded credit bar** -- actually reflects usage level
- **No "avsluta prenumeration"** -- manual Swish model, no subscription management
- **Professional SaaS feel** -- inspired by Linear, Vercel, Lovable

## Implementation Order
1. Create `AppSidebar` + update `DashboardLayout` (structural change)
2. Rewrite `Dashboard.tsx` content sections
3. Fix `CreditsDisplay` color bug + compact design
4. Compact `ConnectionManager`
5. Minimal `DashboardFooter`
6. Clean up unused components/styles
7. Mobile sidebar behavior

This is a large change spanning 8+ files. It should be broken into 3-4 implementation messages to avoid overwhelming changes.

