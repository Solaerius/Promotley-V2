

# 3.1 Foretagsinformation 2.0 -- Implementationsplan

## Sammanfattning
Omdesigna onboarding till en flerstegs-wizard som samlar all foretagsinformation i ai_profiles-tabellen. Obligatoriska falt markeras med stjarna, valfria falt rekommenderas. Sista steget inkluderar OAuth-knappar for sociala konton.

---

## Databasandringar

### Nya kolumner i ai_profiles
Lagg till foljande kolumner i `ai_profiles`-tabellen:
- `foretagsnamn` (text) -- Foretagets namn
- `stad` (text) -- Stad/kommun
- `postnummer` (text) -- Postnummer
- `lan` (text) -- Lan
- `land` (text, default 'Sverige') -- Land
- `budgetniva` (text) -- Budget for marknadsforing
- `kanaler` (text[]) -- Vilka kanaler de anvander
- `allman_info` (text) -- Fritext for ovrigt
- `onboarding_completed` (boolean, default false) -- Flagga for komplett onboarding
- `nyckelord` (text[]) -- Flytta fran users.keywords

### Konsolidering
- Onboarding skriver enbart till `ai_profiles` (inte langre till `users.industry`/`users.keywords`)
- `users.industry` och `users.keywords` behalls i tabellen for bakatkompabilitet men anvands inte langre av ny kod
- `users.company_name` finns redan -- vi kan synka till ai_profiles.foretagsnamn eller lasa fran ai_profiles direkt

---

## Wizard-struktur (3 steg)

### Steg 1: Grundlaggande information
Obligatoriska falt (markerade med *):
- Foretagsnamn *
- Bransch * (befintligt falt `branch`)
- Stad/kommun *
- Postnummer *
- Lan (valfritt, rekommenderat)
- Land (forifylt "Sverige", valfritt)

### Steg 2: Verksamhet och mal
Obligatoriska falt:
- Malgrupp * (befintligt falt `malgrupp`)
- Beskriv ditt foretag * (befintligt falt `produkt_beskrivning`)
  - Placeholder: "T.ex. Vi saljer handgjorda smycken inspirerade av nordisk natur. Vi riktar oss till unga vuxna som gillar hallbart mode."
- Malsattning (valfritt, rekommenderat, befintligt falt `malsattning`)
- Prisniva/budget (valfritt, rekommenderat, befintligt falt `prisniva`)
- Nyckelord (valfritt, rekommenderat)

### Steg 3: Kanaler och extra
Valfria falt (rekommenderade):
- Sociala kanaler -- OAuth-knappar for Instagram och TikTok (inte fritext)
- Tonalitet (befintligt falt `tonalitet`)
- Allman info -- stor textarea
  - Placeholder: "Beskriv nagot mer om ert foretag -- allt ar valkommen! T.ex. era varderingar, framtidsplaner, unika styrkor, utmaningar ni har. Desto mer vi vet, desto battre kan vi hjalpa er."

### Progress bar
- Overst i wizarden: visuell progress (steg 1/3, 2/3, 3/3)
- "Tillbaka" och "Nasta"-knappar langst ner
- Steg 3 har "Slutfor"-knapp

---

## Validering

### Obligatoriska falt for "komplett" onboarding
Foljande maste vara ifyllda for att `onboarding_completed = true`:
1. Foretagsnamn
2. Bransch
3. Stad
4. Postnummer
5. Malgrupp
6. Produktbeskrivning/foretabeskrivning

### Steg-validering
- Anvandaren kan inte ga till nasta steg utan att fylla i obligatoriska falt i aktuellt steg
- Valfria falt kan hoppas over

---

## Komponentandringar

### Ny/omskriven: Onboarding.tsx
- Ersatt enkel form med flerstegs-wizard
- Framer Motion-animationer for stegbyten
- Progress bar overst
- Sparar till `ai_profiles` (upsert) via `useAIProfile`-hooken
- Satter `onboarding_completed = true` vid slutfor

### Uppdaterad: useAIProfile.ts
- Lagg till de nya falten i AIProfile-interfacet
- Lagg till `isOnboardingComplete`-computed property (baserat pa `onboarding_completed`-flaggan)

### Uppdaterad: AIProfileProgress.tsx
- Uppdatera faltlistan med de nya obligatoriska falten
- Anpassa progress-berakning till 6 falt istallet for 4

### Uppdaterad: Settings / AccountContent
- AI-profilformuaret i installningar ska ocksa visa de nya falten for redigering

---

## UX-detaljer

- Obligatoriska falt: roda * bredvid label
- Valfria falt: liten text under label: "Valfritt, men rekommenderas"
- Steg 3 ("Kanaler och extra") visar text overst: "Desto mer information du fyller i, desto battre kan AI:n hjalpa dig"
- OAuth-knappar: Instagram- och TikTok-loggor med "Koppla"-text. Statusindikator (gron bock om kopplad)
- Vid "Slutfor": toast "Valkommen! Din profil ar nu komplett", redirect till /dashboard

---

## Risker och mitigering

| Risk | Mitigering |
|------|-----------|
| Befintliga anvandare har data i users.industry/keywords | Visa inte onboarding igen om ai_profiles redan finns med tillracklig data |
| OAuth-knappar i onboarding kan krasha om Meta/TikTok ej konfigurerat | Gora OAuth valfritt, tydlig "Hoppa over"-mojlighet |
| For manga falt kan skramma bort anvandaren | Dela i 3 steg, tydligt vilka som ar obligatoriska vs valfria |

---

## Teknisk sammanfattning

1. Databasmigrering: 8 nya kolumner i `ai_profiles`
2. Frontend: Omskriven Onboarding.tsx (wizard), uppdaterad useAIProfile hook, uppdaterad AIProfileProgress
3. Ingen backend/edge function-andring kravs
4. RLS-policies for ai_profiles behovs inte andras (befintliga ar korrekta)

