

# Omdesign av e-postmallar + Admin-mejlutskick

## Sammanfattning

Tre delar: (1) Uppdatera alla 6 e-postmallars design och copy, (2) Verifiera att knappar/länkar fungerar korrekt, (3) Skapa en admin-sida for att skicka reklamutskick till registrerade anvandare.

---

## Del 1: Uppdatera alla 6 e-postmallar

### Designandringar (alla mallar)

**Header**: Byt fran gradient-band till vit bakgrund. Logga vänsterstälald bredvid texten "Promotely UF" i samma rad (flexbox/table-layout).

```text
+------------------------------------+
|  [logo]  Promotely UF              |  ← vit bakgrund, vänsterställt
+------------------------------------+
|                                    |
|  Hej [namn]!                       |  ← inget emoji
|  ...                               |
```

**Copy-andringar**:
- Ta bort ALLA emojis (👋, 🚀, 🔑, ✨, 🎉, 📬, 🔒)
- Rubrik: "Hej [namn]!" istallet for nuvarande rubriker
- Fallback-text: "Knappen fungerar inte? Tryck pa lanken nedan:" folj av en klickbar `<Link>` till `confirmationUrl` istallet for ra URL-text

**Per mall**:
| Mall | Ny rubrik | Knapptext |
|------|-----------|-----------|
| Signup | Hej {recipient}! | Bekräfta och kom igång |
| Recovery | Hej! | Välj nytt lösenord |
| Magic Link | Hej! | Logga in direkt |
| Invite | Hej! | Acceptera och gå med |
| Email Change | Hej {email}! | Bekräfta ny e-post |
| Reauthentication | Hej! | (ingen knapp, bara kod) |

**Tekniska detaljer**:
- `headerBand` andras till `backgroundColor: '#ffffff'`, ta bort gradient
- Lagg till en table-row med logo (40px) + "Promotely UF" text (bold, brand color)
- Fallback-sektionen: byt `<Text style={urlText}>{confirmationUrl}</Text>` till `<Link href={confirmationUrl} style={...}>Tryck här</Link>`

### Filer som andras
- `supabase/functions/_shared/email-templates/signup.tsx`
- `supabase/functions/_shared/email-templates/recovery.tsx`
- `supabase/functions/_shared/email-templates/magic-link.tsx`
- `supabase/functions/_shared/email-templates/invite.tsx`
- `supabase/functions/_shared/email-templates/email-change.tsx`
- `supabase/functions/_shared/email-templates/reauthentication.tsx`

---

## Del 2: Verifiera knapp-funktionalitet

Knapparna anvander redan `confirmationUrl` fran auth-hookens payload (`payload.data.url`). Denna URL genereras av autentiseringssystemet och leder till ratt sida (e-postverifiering, losenordsaterstallning, etc.). Inga andringar behovs i edge function-logiken -- det fungerar redan korrekt. Fallback-lanken ska ocksa peka pa samma `confirmationUrl`.

Deploy `auth-email-hook` efter mallandringarna.

---

## Del 3: Admin-sida for reklamutskick

**Viktig begransning**: Lovable's inbyggda e-postsystem stodjer bara autentiseringsmejl. For reklamutskick anvands Resend API:t som redan ar konfigurerat (`RESEND_API_KEY` finns som secret).

### Nya filer

| Fil | Beskrivning |
|-----|-------------|
| `src/pages/AdminEmailBroadcast.tsx` | Admin-sida med redigerare for att skriva och skicka mejl |
| `supabase/functions/send-broadcast-email/index.ts` | Edge function som hamtar alla registrerade e-postadresser fran `users`-tabellen och skickar mejlet via Resend |

### Admin-sidans UI
- Textfalt for amne (subject)
- Textarea/rik-textredigerare for mejlinnehall
- Valfritt: falt for att lagga till specifika e-postadresser manuellt
- Forhandsvisning av mejlet
- "Skicka till alla"-knapp med bekraftelsedialog
- Visar antal mottagare fran databasen
- Respekterar `email_newsletter`-flaggan i `users`-tabellen (bara skicka till de som accepterat)

### Edge function-logik
- Autentisera anroparen och verifiera admin-roll
- Hamta alla anvandare dar `email_newsletter = true` och `deleted_at IS NULL`
- Skicka mejl via Resend i batchar
- Returnera antal skickade/misslyckade

### Routing & Navigation
- Ny route: `/admin/email` i `App.tsx` (wrappat med `AdminRoute`)
- Lagg till i AdminDashboard snabbatkomst-grid med en Mail-ikon

### Supabase config
- Lagg till `[functions.send-broadcast-email]` med `verify_jwt = false` i `config.toml`

