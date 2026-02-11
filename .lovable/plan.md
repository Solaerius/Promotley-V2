

# Fix: Support-chatten visar inte meddelanden i realtid och visar "Ansluter..." konstant

## Problemet (2 buggar)

### 1. "Ansluter..." visas konstant
I `ChatWidget.tsx` rad 264-265 satts `connectionStatus` till `'connecting'` nar kanalen ar `SUBSCRIBED`. Den byter bara till `'connected'` nar ett databasevent faktiskt kommer in -- men det hander aldrig pa grund av bugg 2.

### 2. Admin-meddelanden visas inte i realtid
ChatWidget anvander `postgres_changes` for att lyssna pa nya meddelanden i `live_chat_messages`. MEN: Supabase Realtime `postgres_changes` **kraver att anvandaren har SELECT-rattigheter** pa tabellen. RLS-policyn pa `live_chat_messages` tillater **bara admins** att lasa meddelanden. Darfor far vanliga anvandare aldrig nagon realtime-event -- de maste ladda om sidan.

## Losning: Anvand Supabase Broadcast

Istallet for att forlita sig pa `postgres_changes` (som kraver databasrattigheter) anvander vi **Supabase Broadcast** -- en kanal dar admins skickar meddelanden direkt till anvandarens widget utan att ga via databasen.

### Steg 1: AdminChat.tsx -- Skicka broadcast nar admin svarar
Nar admin skickar ett meddelande, lagg till en broadcast pa kanalen `live_chat_{sessionId}` med meddelandedata. Samma sak nar admin stangar en chatt -- broadcast closure-event.

```text
Fil: src/pages/AdminChat.tsx
- I handleSend(): Efter lyckad insert, broadcast meddelandet pa kanalen
- I handleCloseChat(): Efter lyckad stangning, broadcast closure-event
- Skapa en persistent broadcast-kanal per vald session
```

### Steg 2: ChatWidget.tsx -- Lyssna pa broadcast istallet for postgres_changes
Byt ut `postgres_changes`-prenumerationen mot en **broadcast-lyssnare** pa samma kanal `live_chat_{sessionId}`.

```text
Fil: src/components/ChatWidget.tsx
- Byt fran postgres_changes till broadcast-lyssnare
- Lyssna pa tva event-typer: "new_message" och "chat_closed"
- Satt connectionStatus till 'connected' direkt vid SUBSCRIBED (rad 264)
- Ta bort polling-fallback (behovs inte med broadcast)
```

### Steg 3: Fixa connectionStatus
Andra rad 264 fran `setConnectionStatus('connecting')` till `setConnectionStatus('connected')` sa att "Live" visas direkt nar kanalen ar ansluten.

## Teknisk sammanfattning

```text
FORE:
  Admin -> insert i DB -> postgres_changes -> (blockeras av RLS) -> anvandaren ser inget

EFTER:
  Admin -> insert i DB + broadcast pa kanal -> ChatWidget tar emot broadcast -> visar meddelande direkt
```

### Filer som andras:
1. `src/pages/AdminChat.tsx` -- Lagg till broadcast vid skicka/stang
2. `src/components/ChatWidget.tsx` -- Byt till broadcast-lyssnare, fixa connectionStatus

Inga databasandringar behovs.

