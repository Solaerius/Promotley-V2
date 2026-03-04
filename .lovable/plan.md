

# Omdesign av Promotely e-postmallar -- Varm, Visuell & Handgjord

## Problem
Nuvarande mejl ar platta -- vit bakgrund, logga, rubrik, text, knapp, footer. Identisk struktur pa alla 6 mejl. Ser ut som varje annat SaaS-mejl. Ingen personlighet, ingen visuell identitet.

## Design-koncept

Inspirerat av er brand: varm, personlig, visuellt rik. Centrerad kortlayout mot en mjuk bakgrund. Varje mejl-typ far sin egen personlighet genom unika halsningar, ikoner/emojis och fargaccenter.

```text
+------------------------------------------+
|          ljus creme bakgrund (#FFF8F5)   |
|                                          |
|  +------------------------------------+  |
|  |                                    |  |
|  |  ┌──── gradient header-band ────┐  |  |
|  |  │  🔥  PROMOTELY logo          │  |  |
|  |  │  (gradient: coral → magenta) │  |  |
|  |  └──────────────────────────────┘  |  |
|  |                                    |  |
|  |  Hej, [namn]! 👋                  |  |
|  |                                    |  |
|  |  Personlig text som kanns          |  |
|  |  som ett meddelande fran en van.   |  |
|  |  Kort, varmt, direkt.             |  |
|  |                                    |  |
|  |  ┌────────────────────────────┐   |  |
|  |  │   [ Verifiera e-post ]     │   |  |
|  |  │   (gradient-knapp, glow)   │   |  |
|  |  └────────────────────────────┘   |  |
|  |                                    |  |
|  |  ── tunn linje ──                  |  |
|  |                                    |  |
|  |  📩 Promotely | Hjalp | Integritet|  |
|  |  Gamlagatan, Stockholm             |  |
|  |                                    |  |
|  +------------------------------------+  |
|                                          |
+------------------------------------------+
```

## Vad som andras

### 1. Yttre bakgrund
Varm creme-ton (`#FFF8F5`) istallet for rent vitt. Ger mejlet "djup" -- kortet floats mot bakgrunden.

### 2. Gradient header-band
Varje mejl far en gradient-stripe hogst upp i kortet (coral → magenta, era brandfarger). Loggan sitter centrerad i header-bandet mot gradienten. Detta ger omedelbar visuell identitet.

### 3. Kort-container med skugga
Vit `#FFFFFF` bakgrund, `20px` border-radius, soft box-shadow. Kanns som ett fysiskt kort.

### 4. Personlig copy
- Signup: "Hej! Kul att du ar har." (inte "Valkommen till Promotely!")
- Recovery: "Inga problem, det hander alla." (inte "Vi fick en forfragan")
- Invite: "Nagon tycker du ar grym!" (inte "Du har blivit inbjuden")
- Varje mejl far en unik emoji i rubriken

### 5. Gradient-knapp med avrundning
Knappen far en gradient (`#EE593D` → `#952A5E`) istallet for platt farg. Storre padding, mer rundad (`16px`).

### 6. Informativ footer
Separator-linje, sedan: logga (liten), lankar till Hjalp / Integritetspolicy / Kontakt, kort adress-rad. Allt i dampade farger.

### 7. OTP-mejl (reauthentication) -- speciell stil
Verifieringskoden visas i ett framhavt "code-card" med mjuk bakgrund och monospace-typsnitt, istallet for bara stor text.

## Unik copy per mejl

| Mejl | Rubrik | Ton |
|------|--------|-----|
| Signup | "Hej! Kul att du ar har 👋" | Valkomnande, personlig |
| Recovery | "Inga problem! 🔑" | Lugnande, hjalpande |
| Magic Link | "Din lank ar har ✨" | Snabb, enkel |
| Invite | "Nagon tycker du ar grym! 🎉" | Uppmanande, positiv |
| Email Change | "Ny adress pa gang 📬" | Informativ, saklig |
| Reauth | "Din kod 🔒" | Kort, saker |

## Teknisk plan

### Filer som andras (alla 6 templates)
- `supabase/functions/_shared/email-templates/signup.tsx`
- `supabase/functions/_shared/email-templates/recovery.tsx`
- `supabase/functions/_shared/email-templates/magic-link.tsx`
- `supabase/functions/_shared/email-templates/invite.tsx`
- `supabase/functions/_shared/email-templates/email-change.tsx`
- `supabase/functions/_shared/email-templates/reauthentication.tsx`

### Delade stilar
Alla templates delar en gemensam stiluppsattning med:
- `Section` component for gradient header-band
- `Hr` for separator
- Card-container med skugga och rundade horn
- Gradient-knapp
- Informativ footer-sektion med lankar

### Deployment
Edge function `auth-email-hook` deployas efter andringar.

