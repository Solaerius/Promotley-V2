

# Total omskrivning -- Linear/Vercel-stil

Problemet: Förra omgångarna ändrade bara wrappers och routing, men de faktiska komponenterna (AIChat, AnalyticsContent, AccountContent, OrganizationContent, AppSettingsContent, TikTokProfileSection, Calendar) är helt orörda och fulla av `liquid-glass`, `bg-gradient-primary`, `shadow-elegant`, `shadow-glow`, `motion.section`, `dashboard-heading-dark`, `variant="gradient"` och emojis.

**Denna gång skrivs varje komponent om från scratch** -- inte "ta bort klass X", utan ny JSX med ny struktur.

---

## Vad som ska skrivas om (12 filer)

### 1. `AIChat.tsx` (500 rader) -- Skrivs om helt
- Ta bort: `Card`/`CardContent` wrapper, `shadow-elegant`, alla `bg-gradient-primary`, `animate-fade-in-up`, `animate-fade-in-scale`, `shadow-soft`, `shadow-glow`, gradient quick commands
- Ny struktur: Ren `div` med `bg-background`, user-bubblor i `bg-primary text-primary-foreground rounded-xl`, AI-bubblor i `bg-muted rounded-xl`, inga gradienter
- Quick commands: `bg-muted` ikon-rutor, ingen gradient-bakgrund
- Input: Enkel `bg-muted` textarea, `bg-primary` send-knapp (ej gradient)
- Scroll-knapp: `bg-primary rounded-full`
- `variant="gradient"` -> `variant="default"` överallt

### 2. `AnalyticsContent.tsx` (233 rader) -- Skrivs om helt
- Ta bort: `liquid-glass-light`, `liquid-glass`, `dashboard-heading-dark`, `dashboard-subheading-dark`, `bg-gradient-primary`, `bg-white/10 backdrop-blur-sm border border-white/10`, `variant="gradient"`
- Nya stats-kort: `bg-card shadow-sm rounded-xl` med neutral ikon i `bg-muted`
- Diagram: Behåll recharts men med neutral färger, enklare containers (`div` istället för `Card`)
- Platform tabs: `bg-muted` TabsList, `data-[state=active]:bg-background` (ej `bg-white/20`)
- Empty state: Minimal text + länk, inga stora ikoner

### 3. `AnalyticsPage.tsx` -- Rensa header
- `text-3xl md:text-4xl font-bold dashboard-heading-dark` -> `text-xl font-semibold text-foreground`
- `dashboard-subheading-dark` -> `text-sm text-muted-foreground`

### 4. `AccountContent.tsx` (647 rader) -- Skrivs om helt
- Ta bort: Alla `motion.section` + `sectionVariants`, `motion` import
- Ta bort: `bg-muted/30 rounded-2xl` -> `bg-card shadow-sm rounded-xl`
- Kompaktare sektions-headers: `text-base font-medium` (ej `text-lg font-semibold`)
- Inputs: `bg-background border-border` (ej `bg-muted/30`)
- Ta bort "Navigering"-sektionen (redan i sidebar)
- Ta bort emoji (om några finns)

### 5. `OrganizationContent.tsx` (339 rader) -- Skrivs om
- Ta bort: `motion` import, `motion.section`
- Byt `Tabs` med centrerad `TabsList` mot enklare sektionsindelning eller renare tabs med `bg-muted` styling
- `bg-muted/30 rounded-2xl` -> `bg-card shadow-sm rounded-xl`
- Badges och knappar: standard variant, inga gradienter

### 6. `AppSettingsContent.tsx` -- Skrivs om
- Ta bort `Card` imports
- `bg-gradient-to-r from-purple-500 to-pink-500` på plattforms-ikoner -> `bg-muted` med neutral ikon
- Instagram: Behåll men markera "Kommer snart"
- TikTok: Enda aktiva

### 7. `TikTokProfileSection.tsx` (300 rader) -- Skrivs om
- Ta bort: `bg-white/10 backdrop-blur-sm border border-white/10`, `dashboard-heading-dark`, `dashboard-subheading-dark`, `text-white/60`
- Ny stil: `bg-card shadow-sm rounded-xl`, `text-foreground`, `text-muted-foreground`

### 8. `Calendar.tsx` (508 rader) -- Cleanup
- `variant="gradient"` -> `variant="default"` på AI-knappen
- Dialogs: Rena, inga tunga Card-wrappers
- Renare kalender-grid

### 9. `Dashboard.tsx` -- Ta bort emoji
- Rad 128: `👋` tas bort

### 10. `App.tsx` -- Routing fix
- `/analytics` route: Ändra så den pekar korrekt (importera `Analytics` som AnalyticsPage eller uppdatera AnalyticsPage att använda de nya stilarna)

### 11. `CreditsDisplay.tsx` -- Kontrollera för gradienter
### 12. `index.css` -- Ta bort legacy klasser

---

## Designsystem som appliceras överallt

| Element | Gammal stil | Ny stil |
|---------|-----------|---------|
| Kort | `liquid-glass-light`, `Card` med tunga borders | `bg-card shadow-sm rounded-xl` |
| Rubriker | `dashboard-heading-dark text-3xl` | `text-foreground text-base font-medium` |
| Undertext | `dashboard-subheading-dark` | `text-muted-foreground text-sm` |
| Knappar | `variant="gradient"` | `variant="default"` |
| Ikoner bakgrund | `bg-gradient-primary`, `bg-gradient-to-r` | `bg-muted` |
| Bubblor (chat) | `bg-gradient-primary text-white` | `bg-primary text-primary-foreground` |
| Animationer | `motion.section`, `animate-fade-in-up` | Ingen, eller `opacity` transition |
| Input-fält | `bg-muted/30 border border-border` | `bg-background border-border` |

## Fas-ordning

**Fas 1** (viktigast): AIChat + AnalyticsContent + AnalyticsPage + TikTokProfileSection + Dashboard emoji-fix + App.tsx routing
**Fas 2**: AccountContent + OrganizationContent + AppSettingsContent + Calendar
**Fas 3**: CSS cleanup (ta bort oanvända klasser)

Totalt ~12 filer skrivs om. All funktionalitet bevaras, bara utseendet byts ut från grunden.

