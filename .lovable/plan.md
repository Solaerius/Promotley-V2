
# Tydligare kort och textrutor for en snyggare hemsida

## Problem

Korten pa landningssidan -- sarskilt de pa morka gradient-sektioner -- anvander extremt laga opacitetsvarden (`bg-white/5`, `border-white/10`) som gor dem nastan osynliga. Textrutor och inmatningsfalt har liknande problem med bristande kontrast.

## Losning

Oka opacitet pa bakgrund och kanter for alla kort pa morka sektioner, och forbattra inmatningsfaltens synlighet i bade ljust och morkt lage.

## Andringar per fil

### 1. `src/components/HowItWorks.tsx`
- Kort: `bg-white/5 border-white/10` -> `bg-white/10 border-white/20`
- Hover: `hover:bg-white/10 hover:border-white/20` -> `hover:bg-white/[0.15] hover:border-white/30`
- Ikon-bakgrund: `bg-white/10` -> `bg-white/15`

### 2. `src/components/ResultsSection.tsx`
- Stat-rutor: `bg-white/5 border-white/10` -> `bg-white/10 border-white/20`
- Hover: `hover:bg-white/10 hover:border-white/20` -> `hover:bg-white/[0.15] hover:border-white/30`

### 3. `src/components/Testimonials.tsx`
- Kort: `bg-white/5 border-white/10` -> `bg-white/10 border-white/20`
- Hover: `hover:bg-white/10 hover:border-white/20` -> `hover:bg-white/[0.15] hover:border-white/30`

### 4. `src/components/TrustSection.tsx`
- Kort: `bg-white/5 border-white/10` -> `bg-white/10 border-white/20`
- Hover: samma monster som ovan
- Bottom Trust Badge: samma justering

### 5. `src/components/Pricing.tsx`
- Vanliga kort: `bg-white/5 border-white/10` -> `bg-white/10 border-white/20`
- Popular-kort: `bg-white/15 border-white/40` -> `bg-white/20 border-white/50`
- Checkmark-ikoner: `bg-white/10` -> `bg-white/15`

### 6. `src/components/ProblemSection.tsx`
- "Innan Promotley"-kortet: `border-destructive/20 bg-destructive/5` -> `border-destructive/30 bg-destructive/8`
- "Med Promotley"-kortet: `border-primary/30` -> `border-primary/40`

### 7. `src/index.css` -- Forbattra textrutor/inmatningsfalt
- `.input-field`: Oka border-opacitet och lagg till tydligare bakgrund
- Uppdatera `--border` CSS-variabeln fran `30 15% 88%` (ljust) till nagot med mer kontrast, t.ex. `30 15% 82%`
- I dark mode: `--border` fran `344 25% 18%` till `344 25% 22%`
- Lagg till en subtil `shadow-sm` pa `.input-field` for bade ljust och morkt lage

### 8. `src/components/ui/card.tsx`
- Lagg till en fallback `shadow-sm` sa att alla Card-komponenter har en subtil skugga aven i vilolagen (redan `shadow-card`, men vi forstarker CSS-variabeln)

### 9. CSS-variablar i `src/index.css`
- `--shadow-card`: Oka opacity fran `0.06/0.04` till `0.1/0.06` for tydligare kortskuggor i ljust lage
- `--shadow-card-hover`: Oka fran `0.12/0.06` till `0.16/0.08`
- I dark mode: justera skuggvarden uppat pa liknande satt

## Temamedvetenhet

Alla andringar respekterar ljust/morkt lage:
- Morka sektioner (gradient-diagonal): hojer white-opacity for synlighet
- Ljusa sektioner (bg-background): forstarker border och shadow-variablar
- Inmatningsfalt: tydligare kanter i bada teman genom CSS-variablar
