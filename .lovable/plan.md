
# Fyra steg: Live-anpassning, glasnavbar, chattbubbla pa konto, och z-index-fix

## Steg 1: Live-anpassning utan refresh

**Problem:** `useNavbarPosition` anvands i bade `DashboardLayout` och `ChatWidget`, men varje komponent skapar sin egen instans av hooken med sin egen `useState`. Nar positionen andras i navbaren uppdateras bara navbarens lokala state -- layouten och chattbubblan laser fortfarande det gamla vardet fran `localStorage` tills sidan laddas om.

**Losning:** Byt fran `localStorage` + lokal `useState` till en delad React-kontext (`NavbarPositionContext`) sa att alla komponenter som anvander positionen reagerar direkt nar den andras.

**Filer:**
- **`src/hooks/useNavbarPosition.ts`**: Skapa en `NavbarPositionProvider` som wrappar hela appen. Flytta state och localStorage-logik hit. Exportera `useNavbarPosition` som laser fran kontexten.
- **`src/App.tsx`** (eller `main.tsx`): Wrappa app-tradet med `NavbarPositionProvider`.
- Inga andringar behovs i `DashboardLayout.tsx`, `DashboardNavbar.tsx` eller `ChatWidget.tsx` -- de anvander redan `useNavbarPosition()` och kommer automatiskt fa det delade vardet.

---

## Steg 2: Glasmorfism pa DashboardNavbar

**Problem:** DashboardNavbar anvander en nastan helt opak gradient (`0.95`, `0.85`, `0.8` opacity) -- den ser solid ut, inte som glas.

**Losning:** Andra bakgrunden till en subtil, genomskinlig gradient som matchar startsidans Navbar-stil.

**Filer:**
- **`src/components/DashboardNavbar.tsx`**: Pa bada stallen dar `style={{ background: 'linear-gradient(...)' }}` anvands (vertikalt och horisontellt lage), andra fran:
  ```
  hsl(var(--accent) / 0.95) ... hsl(var(--primary) / 0.8)
  ```
  till nagot i stil med:
  ```
  hsl(var(--primary) / 0.1) ... hsl(var(--secondary) / 0.08) ... hsl(var(--accent) / 0.1)
  ```
  Behall `backdrop-blur-xl` och `border border-white/20`. Justera textfarger fran `text-white` till temamedvetna farger (`text-foreground`) for lasbarhet i ljust lage.

---

## Steg 3: Chattbubbla pa kontosidan

**Problem:** `ChatWidget` renderas bara i `Dashboard.tsx` och `Index.tsx`. Kontosidan (`AccountPage.tsx`) inkluderar den inte.

**Losning:** Lagga till `<ChatWidget />` i `AccountPage.tsx`.

**Filer:**
- **`src/pages/AccountPage.tsx`**: Importera och rendera `ChatWidget` inuti `DashboardLayout`, precis som i `Dashboard.tsx`.

---

## Steg 4: Chattbubblans z-index under footer

**Problem:** Chattbubblan har `z-50` men footern eller andra element renderas ovanpa den.

**Losning:** Hoj chattbubblans z-index till `z-[60]` (eller hogre) sa den alltid visas ovanfor footer-innehall. Footern har `relative z-10` i DashboardLayout.

**Filer:**
- **`src/components/ChatWidget.tsx`**: Andra bubbla-knappens klass fran `z-50` till `z-[60]`. Aven chattfonstrets `z-50` bor hojas till `z-[60]` for konsekvens.
