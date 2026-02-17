
# Omfattande uppdateringsplan - Status

## ✅ Genomförda ändringar

1. **Layoutkomprimering Konto (40%)** - Alla spacing, paddings, ikonstorlekar minskade
2. **Statistik-rutor komprimering (30%)** - Stats-kort, charts (200→160px), ikoner minskade
3. **AI-analys komprimering (30%)** - Samma mönster som statistik
4. **Kalender komprimering (5%)** - min-h 80→76px
5. **Instagram till "Kommer snart"** - Flyttad till comingSoonPlatforms
6. **Input-outlines i AI-profilen** - Standard border border-border
7. **Ta bort Län-fältet** - Borttaget från AccountContent och Onboarding
8. **Namnbyten** - "Tonalitet" → "Vilken ton ska Promotely AI ha?", "Nyckelord" → "Era grundprinciper"
9. **Ta bort dubblerat Företagsnamn** - Borttaget från AI-profil, synkas automatiskt
10. **AI-blockering i AIToolsContent** - Varningsbanner + disabled state
11. **Auth: Registrering** - "Skapa företag" → "Registrera nytt företag", inbjudningskod-fält
12. **useAuth: invite_code** - Parameter tillagd, retry-logik för company_name
13. **CreditsDisplay** - Gratis plan visar "uppgradera för mer" istället för förnyelsedatum
14. **Kalender: Händelsetyper** - Nya typer (Inlägg, UF-marknad, Event, Deadline, Övrigt) med färgkodning
15. **Kalender: Knappbyte** - "Lägg till" → "Lägg till händelse", variant="secondary"
16. **DB-migration** - event_type kolumn tillagd i calendar_posts

## ⏳ Kvarvarande (nästa iteration)

- **Kalender: AI-plan med loading bar** - Progress-bar, localStorage, bakgrundsprocessing, notiser
- **AuthCallback: invite_code auto-join** - Kontrollera metadata och anslut automatiskt
