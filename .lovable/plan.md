

# 3.4 Säljradar -- KLAR

## Sammanfattning
Ny funktion "Säljradar" som kombinerar AI-genererade leads med trendbevakning. Tillgänglig som 4:e flik på AI-sidan.

## Implementerat
1. DB: `sales_radar_results` tabell med RLS
2. Edge function: `sales-radar` med OpenAI + förberedd Perplexity-hook
3. Hook: `useSalesRadar` för data-hantering
4. Komponent: `SalesRadarContent` med leads, trender, historik
5. AIPage: 4 tabs (Chat, Verktyg, Analys, Säljradar)

## Perplexity-integration
Backenden har kommenterad kod redo för Perplexity API. När API-nyckeln konfigureras kan realtidstrender aktiveras.
