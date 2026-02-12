
# Ta bort separat Facebook-knapp -- behall bara Instagram

Eftersom Instagram-anslutningen redan gar via Facebook OAuth (kräver Facebook-sida), är den separata Facebook-knappen onödig. Den tas bort fran UI och analytics.

## Andringar

### 1. AppSettingsContent.tsx (Inställningar -- ny layout)
- Ta bort `connectFacebook`-funktionen
- Ta bort Facebook-objektet fran `platformConnections`-arrayen
- Behall bara Instagram och TikTok

### 2. Settings.tsx (Inställningar-sidan)
- Ta bort Facebook-raden fran plattformslistan (rad 667)
- Ta bort `connectFacebook`-funktionen
- Uppdatera `disconnectProvider`-typen till `'tiktok' | 'meta_ig'`

### 3. ConnectionManager.tsx
- Ta bort Facebook-kopplingsknappen och `connectFacebook`-funktionen
- Ta bort Facebook-raden fran UI:t

### 4. Analytics.tsx
- Ta bort `meta_fb` followers-summering (rad 87-88)
- Ta bort Facebook-tabben fran TabsList (rad 302-304)
- Ta bort Facebook TabsContent-sektionen
- Ändra grid fran `grid-cols-3` till `grid-cols-2`

### 5. AnalyticsContent.tsx
- Samma som Analytics.tsx -- ta bort Facebook-tab, followers-summering, och TabsContent
- Ändra grid fran `grid-cols-3` till `grid-cols-2`

### 6. Dashboard.tsx
- Ta bort `meta_fb` followers-summering (rad 63)

## Vad som INTE ändras
- **Backend (edge functions)**: `init-meta-oauth`, `oauth-callback`, `fetch-meta-data` behåller stöd för `meta_fb` -- det skadar inte och kan vara användbart i framtiden
- **Databas-enum** (`social_provider`): Behåller `meta_fb` i enum -- att ta bort det kräver databasmigrering och kan orsaka problem med befintlig data
- **useMetaData hook**: Behåller Facebook-data-hämtning i bakgrunden -- det kostar ingenting och gör det enkelt att återaktivera Facebook i framtiden

## Teknisk sammanfattning

Alla ändringar är UI-only. Inga databas- eller backend-ändringar behövs. Facebook-stödet finns kvar i backend ifall ni vill återaktivera det senare.
