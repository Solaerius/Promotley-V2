

# Total Dashboard & App Redesign -- Linear/Vercel-stil

## Design System

- **Stil**: Linear/Vercel -- extremt clean, svartvitt, minimal färg
- **Kort**: Inga borders, mjuka skuggor (`shadow-sm` / `shadow-md`)
- **Typografi**: Kompakt, tight, Inter-vikt
- **Bakgrund**: Ren vit (light) / ren svart-grå (dark), ingen gradient, inga orbs
- **Färg**: Primärfärg bara för accenter (knappar, badges), allt annat neutral
- **Animationer**: Enkel opacity-fade, inget staggerat

---

## 1. Sidebar (`AppSidebar.tsx`) -- Rework

**Aktiv markering**: Solid bakgrundsfärg + `shadow-sm` på aktiv knapp (tydlig kontrast)

**Dark mode toggle**: Egen knapp i sidebar (alltid synlig), ej i dropdown

**Footer**: Avatar + namn + snabbknappar (Inställningar, Logga ut) direkt synliga

**Logo**: Byt från `<img>` till SVG/text som renderas direkt (fixar flicker)

**Krediter**: Behåll i profil-dropdown (tunn bar)

**Ta bort**: "Flytta navbar"-knappen (den ger inget värde med sidebar)

---

## 2. DashboardLayout (`DashboardLayout.tsx`) -- Cleanup

- Ta bort gradient-bakgrund, byt till `bg-background` (ren vit/svart)
- Behåll content header med notis-klocka + SidebarTrigger
- Ta bort `motion` wrapper runt main (onödig re-render vid navigering, orsakar flicker)

---

## 3. Dashboard (`Dashboard.tsx`) -- Feed/Aktivitet-fokus

Ny layout:
```text
┌─────────────────────────────────────┐
│ Välkommen tillbaka, [namn]          │
│ Kompakt rad med nyckeltal           │
├─────────────────────────────────────┤
│ Aktivitets-feed:                    │
│  - Senaste AI-användning            │
│  - Planerade inlägg (närmaste)      │
│  - Kontostatus (TikTok ansluten)    │
│  - Tips/AI-insikter                 │
├─────────────────────────────────────┤
│ Plattformar (alla, med status)      │
│  TikTok ✓  Instagram [snart]  ...   │
├─────────────────────────────────────┤
│ Genvägar (3 kompakta knappar)       │
│ Subtil uppgraderings-banner         │
└─────────────────────────────────────┘
```

- Nyckeltal: 4 siffror utan kort-border, bara text + ikon + mjuk skugga
- Connections: Alla plattformar visas, "Kommer snart" badge på de som ej funkar, TikTok-klick -> `/account?tab=app`
- Feed-sektion: Visa senaste 5 händelser (planerade inlägg, AI-användning, anslutningar)

---

## 4. AI-sidan (`AIPage.tsx`) -- Verktygs-grid

- Ta bort tab-systemet
- Visa alla verktyg i ett rent grid (2x3 eller 3x2)
- Varje verktyg: ikon + titel + kort beskrivning, klick -> dedikerad sida
- Chat-knapp separat (redan i sidebar)
- AI-analys och Säljradar som egna kort i gridet
- Renare header utan `dashboard-heading-dark` klasser

---

## 5. Statistik (`Analytics.tsx`) -- Minimalistisk rework

- Kompakta nyckeltal överst (följare, views, likes, engagemang) utan tunga kort
- Plattforms-breakdown under, rena siffror utan stora `Card`-wrappers
- Diagram: enklare, mindre, neutral färgpalett
- Ta bort den stora "AI-analys"-bannern (den hör hemma på AI-sidan)
- Om inga konton: minimal empty state, direkt-länk till `Konto > App`

---

## 6. Konto & Inställningar (`AccountPage.tsx`) -- Sidebar + innehåll

Byt från tabs till sidebar-layout:
```text
┌──────────┬──────────────────────────┐
│ Profil   │ [Profilinnehåll]         │
│ AI-profil│                          │
│ Krediter │                          │
│ ─────── │                          │
│ Org.     │                          │
│ ─────── │                          │
│ Kopplingar│                         │
│ Tema     │                          │
│ ─────── │                          │
│ Radera   │                          │
└──────────┴──────────────────────────┘
```

- Vänster-meny med sektioner
- Innehåll till höger renderas baserat på vald sektion
- Varje sektion renare: mindre padding, inga tunga kort, mjuka skuggor
- Sociala kopplingar: TikTok fungerar, övriga "Kommer snart"
- På mobil: meny kollapsar till dropdown eller horisontella tabs

---

## 7. Kalender (`Calendar.tsx`) -- Cleanup

- Ta bort `liquid-glass-light` klasser
- Renare kalender-grid med mjuka skuggor
- Kompaktare header

---

## 8. CSS cleanup (`index.css`)

- Ta bort/deprecera `liquid-glass`, `dashboard-heading-dark`, `dashboard-subheading-dark`, `bg-gradient-hero`, `bg-gradient-primary` klasser
- Standardisera alla sidor till samma neutral stil

---

## Implementationsordning (3 faser)

**Fas 1**: Sidebar rework + DashboardLayout cleanup + Logo fix + Dashboard ny layout
**Fas 2**: AI-sidan grid + Statistik rework + Kalender cleanup
**Fas 3**: Konto sidebar-layout + CSS cleanup

Varje fas ändrar 3-4 filer. Totalt ~10 filer berörs.

