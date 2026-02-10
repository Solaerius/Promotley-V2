

# Smart modell-routing for Pro-planen

## Sammanfattning
Pro-planen andras fran 300 till 200 krediter. Istallet for att anvanda dyra gpt-4o for alla anrop, anvands gpt-4.1-mini som standard och gpt-4o reserveras for premium-funktioner (djupanalys och marknadsforingsplaner) som kostar fler krediter.

## Vad andras for anvandaren
- Pro far 200 krediter istallet for 300
- Vanliga chattar anvander en snabb, effektiv AI-modell (gpt-4.1-mini)
- Premium-funktioner som djupanalys och marknadsforingsplaner anvander den kraftfullaste modellen (gpt-4o) och kostar fler krediter
- Starter och Growth paverkas inte

## Ny kreditstruktur for Pro

| Funktion | Modell | Krediter |
|---|---|---|
| Enkel chatt | gpt-4.1-mini | 1 |
| Tips och forslag | gpt-4.1-mini | 2 |
| Strategi-chatt | gpt-4.1-mini | 3 |
| Djupanalys (premium) | gpt-4o | 5 |
| Marknadsforingsplan (premium) | gpt-4o | 8 |

## Lonsamhet

| Scenario | Max API-kostnad | Intakt | Marginal |
|---|---|---|---|
| Nuvarande (300 krediter, allt gpt-4o) | ~120 kr | 99 kr | -21% |
| Nytt (200 krediter, mestadels gpt-4.1-mini) | ~12 kr | 99 kr | ~88% |
| Nytt worst case (allt premium) | ~40 kr | 99 kr | ~60% |

## Teknisk plan

### Steg 1: Databasmigration
Uppdatera befintliga Pro-anvandare:
```text
UPDATE public.users 
SET max_credits = 200, 
    credits_left = LEAST(credits_left, 200) 
WHERE plan = 'pro';
```

### Steg 2: `src/lib/planConfig.ts`
- Andra Pro credits fran 300 till 200
- Lagga till `premiumModel: 'gpt-4o'` for Pro-planen i MODEL_BY_TIER
- Behalla `pro: 'gpt-4.1-mini-2025-04-14'` som default-modell

### Steg 3: `src/lib/creditSystem.ts`
- Lagga till `analysis_deep` (5 krediter) och `plan_premium` (8 krediter) i estimateCost for Pro

### Steg 4: `supabase/functions/ai-assistant/index.ts`
- Rad 607-619: Andra Pro default-modell fran `gpt-4o` till `gpt-4.1-mini-2025-04-14`
- Rad 425-432: Behalla `gpt-4o` for marknadsforingsplaner (redan korrekt)
- Uppdatera kreditkostnaden for marknadsforingsplaner fran 5 till 8 for Pro

### Steg 5: `supabase/functions/generate-ai-analysis/index.ts`
- Rad 138-142: Behalla `gpt-4o` for Pro-analysens djupanalys
- Uppdatera estimatedCost fran 1 till 5 for Pro-analys

### Steg 6: UI-uppdateringar
- `src/pages/Pricing.tsx` rad 49: `credits: "300"` till `credits: "200"`, modell till "GPT-4.1 Mini + GPT-4o Premium"
- `src/components/Pricing.tsx` rad 42: `credits: "300"` till `credits: "200"`, uppdatera features-listan
- Lyft fram "Premium AI for djupanalyser" i Pro-planens features

### Steg 7: `src/hooks/useUserCredits.ts` (inga andringar behovs)
- Hamtar credits_left och max_credits fran databasen, fungerar automatiskt med nya varden

