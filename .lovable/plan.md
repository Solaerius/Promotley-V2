

# Kontosidan: Bredare layout och centrering

## Problem

1. **AccountPage** har `max-w-4xl` som begransar hela sidans bredd
2. **AccountContent** och **OrganizationContent** har `max-w-2xl mx-auto` som ytterligare krymper innehallet
3. **AppSettingsContent** har `max-w-3xl` utan `mx-auto`, darfor hamnar den vansterstjalld istallet for centrerad

## Andringar

### 1. `src/pages/AccountPage.tsx` (rad 17)
- Byt `max-w-4xl` till `max-w-6xl` for att ge hela sidan mer utrymme (samma bredd som dashboarden)

### 2. `src/components/account/AccountContent.tsx` (rad 229)
- Byt `max-w-2xl mx-auto` till `max-w-4xl mx-auto` sa att formularen och sektionerna tar upp mer plats

### 3. `src/components/account/OrganizationContent.tsx` (rad 85)
- Byt `max-w-2xl mx-auto` till `max-w-4xl mx-auto`

### 4. `src/components/account/AppSettingsContent.tsx` (rad 99)
- Byt `max-w-3xl` till `max-w-4xl mx-auto` (lagger till `mx-auto` for centrering och okar bredden)

## Resultat

Alla tre flikar (Konto, Organisation, App) kommer anvanda `max-w-4xl` centrerat inuti en `max-w-6xl`-wrapper, vilket ger mer utrymme at innehallet och centrerar App-fliken korrekt.

