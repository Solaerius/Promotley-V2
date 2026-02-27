

# Individuella verktygs-sidor for AI-assistenten

## Sammanfattning
Istallet for att verktygen skickar anvandaren till chatten med ett forifyllt meddelande, skapas 6 dedikerade sidor -- en for varje verktyg. Varje sida har ett anpassat UI som guidar anvandaren genom verktygets syfte, samlar in relevant input, och visar AI-svaret pa ett strukturerat och anvandarvlanligt satt.

---

## Oversikt av de 6 verktygssidorna

| Verktyg | Route | Unik funktionalitet |
|---------|-------|---------------------|
| Caption-generator | `/ai/caption` | Valja plattform (Instagram/TikTok/Facebook), ton (rolig/proffsig/inspirerande), amne/beskrivning. Visar 3 caption-forslag med kopieringsknapp. |
| Hashtag-forslag | `/ai/hashtags` | Ange amne eller inlagg-beskrivning, valja plattform. Visar hashtags i kopieringsbara taggar grupperade efter rackvidd (hog/medel/nisch). |
| Content-ideer | `/ai/content-ideas` | Valja vecka/period, antal ideer, plattform. Visar ideer som kort med typ-ikon (Reel, Story, Carousel, etc). |
| Veckoplanering | `/ai/weekly-plan` | Valja vecka, plattformar. Visar en visuell veckokalender med ett inlagg per dag inkl. typ och tid. |
| Kampanjstrategi | `/ai/campaign` | Ange mal, budget (valfritt), tidsperiod. Visar en steg-for-steg-plan i en tidslinje-vy. |
| UF-tips | `/ai/uf-tips` | Valja kategori (tavling, monter, pitch, sociala medier). Visar tips som expanderbara kort med konkreta atgarder. |

---

## Sidornas gemensamma layout

Varje sida foljer samma struktur:

1. **Header** -- Verktygsnamn, ikon med gradient, kort beskrivning, tillbaka-knapp till `/ai?tab=verktyg`
2. **Inputformular** -- Anpassade falt per verktyg (dropdowns, textfalt, knappar) i ett snyggt glassmorphism-kort
3. **Generera-knapp** -- Skickar anropet till AI-assistenten via `ai-assistant` edge function med en verktygsspecifik systemprompt
4. **Resultatvy** -- Strukturerad visning av AI-svaret (inte ratext), anpassad per verktyg (kopieringsbara captions, tagg-chips, kalender-grid, tidslinje, etc.)
5. **Krediter-indikator** -- Visar antal kvarvarande krediter

## Teknisk plan

### Nya filer

| Fil | Beskrivning |
|-----|-------------|
| `src/pages/ai/CaptionGenerator.tsx` | Caption-verktygets sida |
| `src/pages/ai/HashtagSuggestions.tsx` | Hashtag-verktygets sida |
| `src/pages/ai/ContentIdeas.tsx` | Content-ideer-sida |
| `src/pages/ai/WeeklyPlanner.tsx` | Veckoplanering-sida |
| `src/pages/ai/CampaignStrategy.tsx` | Kampanjstrategi-sida |
| `src/pages/ai/UFTips.tsx` | UF-tips-sida |
| `src/components/ai/AIToolPageLayout.tsx` | Delad layout-komponent for alla verktygs-sidor (header, tillbaka-knapp, kreditvisning) |
| `src/hooks/useAIToolRequest.ts` | Delad hook som skickar ett strukturerat meddelande till `ai-assistant` edge function och parser JSON-svar |

### Andringar i befintliga filer

| Fil | Andring |
|-----|---------|
| `src/App.tsx` | Lagg till 6 nya routes under `/ai/caption`, `/ai/hashtags`, etc. med `RequireVerifiedEmail`-wrapping |
| `src/components/ai/AIToolsContent.tsx` | Andra `handleToolClick` sa att den navigerar till respektive verktygs-route istallet for chatten |

### AI-anrop

Varje verktyg anropar `ai-assistant` edge function med:
- En verktygsspecifik systemprompt som instruerar AI:n att svara i JSON-format
- Anvandarens input-data som meddelandeinnehall
- Samma kreditavdrag och autentisering som chatten anvander idag

Hook `useAIToolRequest` hanterar:
- Skicka request till edge function
- Parsa JSON-svar fran AI:n
- Hantera laddningstillstand och fel
- Uppdatera kreditvisning via `creditUpdateEvent`

### Resultat-rendering per verktyg

- **Caption-generator**: Kort med caption-text, kopiera-knapp, ton-badge
- **Hashtag-forslag**: Klickbara chips/badges, "kopiera alla"-knapp, grupperade i sektioner
- **Content-ideer**: Grid av kort med ikon per format (Reel/Story/Post), beskrivning, foreslagen dag
- **Veckoplanering**: 7-dagars grid/kalender-vy med typ, tid, och beskrivning per dag
- **Kampanjstrategi**: Vertikal tidslinje med steg, deadlines, och atergarder
- **UF-tips**: Accordion/expanderbara kort per tips med konkret atgardsforslag

