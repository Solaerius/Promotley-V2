

# Dynamisk layout-anpassning for navbar-position och chattbubbla

## Problem

1. Navbaren doljer innehall bakom sig oavsett position (topp, botten, vanster, hoger)
2. DashboardLayout har padding-logik men den ar otillracklig -- innehall hamnar bakom baren
3. Nar navbaren ar langst ner blockerar den chattbubblans knapp (fixed bottom-6 right-6)

## Losning

### 1. Forbattra DashboardLayout padding (`src/components/layouts/DashboardLayout.tsx`)

Den befintliga padding-logiken (rad 128-134) behover justeras for att ge tillrackligt utrymme. Navbaren ar ca 60px hog horisontellt och ca 60px bred vertikalt. Nuvarande padding ar for litet.

Andringar:
- `position === 'top'`: Oka `pt-20` till `pt-24 md:pt-20` (navbaren + marginal)
- `position === 'bottom'`: Oka `pb-28 md:pb-24` till `pb-28 md:pb-28` for att sakerstalla utrymme
- `position === 'left'`: Behal `pl-20 md:pl-24 lg:pl-28` (redan tillrackligt)
- `position === 'right'`: Behal `pr-20 md:pr-24 lg:pr-28` (redan tillrackligt)

### 2. Flytta chattbubblan dynamiskt (`src/components/ChatWidget.tsx`)

ChatWidget behover veta navbar-positionen for att anpassa sin knappplacering.

Andringar:
- Importera `useNavbarPosition` i ChatWidget
- Nar `position === 'bottom'`: flytta bubblan uppat fran `bottom-6` till `bottom-20` sa den hamnar ovanfor navbaren
- Nar `position === 'right'`: flytta bubblan at vanster fran `right-6` till `right-20` sa den inte doljs
- Nar `position === 'left'`: behal `right-6` (ingen konflikt)
- Nar `position === 'top'`: behal `bottom-6` (ingen konflikt)

Konkret: byt den hardkodade klassen `fixed bottom-6 right-6` till dynamiska klasser baserat pa navbar-position.

### 3. Anpassa DashboardFooter-marginal

Nar navbaren ar langst ner doljer den aven footern delvis. DashboardLayout visar redan footer med `!hideFooter`. Vi loser detta genom att lagga till extra `pb`-padding i main-omradet nar position ar `bottom`, sa att footern scrollas upp ovanfor navbaren.

## Tekniska detaljer

### ChatWidget.tsx - Bubbla-klasser

```text
position === 'bottom' && position === 'right'
  -> bottom-20 right-6 (bubbla ovanfor navbar)

position === 'bottom' && position !== 'right'
  -> bottom-20 right-6

position === 'right'
  -> bottom-6 right-20 (bubbla till vanster om navbar)

default (top, left)
  -> bottom-6 right-6 (ingen konflikt)
```

### DashboardLayout.tsx - Padding-karta

```text
position     padding
-----------  --------------------------------
top          pt-[72px] (navbar ~56px + 16px gap)
bottom       pb-[72px]
left         pl-[72px]
right        pr-[72px]
```

## Filer som andras

1. **`src/components/layouts/DashboardLayout.tsx`** -- Justera padding-varden for att ge tillrackligt utrymme
2. **`src/components/ChatWidget.tsx`** -- Importera `useNavbarPosition` och anpassa bubblans position dynamiskt

## Ingen logik andras

Navigering, routing och all annan funktionalitet forblir identisk. Andringarna ar enbart CSS/positioning.

