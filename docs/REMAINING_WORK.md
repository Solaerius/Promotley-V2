# Remaining Work — Continue When Usage Resets

**Session date:** 2026-03-27
**Status:** All P0/P1/P2/P3 tasks completed. Below are P3/P4 items not wired up yet.

---

## 1. Wire Rate Limiting to Edge Functions (Medium priority)

`supabase/functions/_shared/rateLimit.ts` is created. Apply it to:

**`supabase/functions/ai-assistant/index.ts`:**
```ts
import { checkRateLimit } from '../_shared/rateLimit.ts';
// After JWT validation, before AI call:
if (checkRateLimit(user.id, 'ai-chat', 10, 60)) {
  return new Response(JSON.stringify({ error: 'rate_limited' }), { status: 429, headers: corsHeaders });
}
```

**`supabase/functions/billing/index.ts`:**
```ts
if (checkRateLimit(user.id, 'billing', 3, 60)) {
  return jsonResponse({ error: 'rate_limited' }, 429);
}
```

**`supabase/functions/fetch-tiktok-data/index.ts`** and **`fetch-meta-data/index.ts`:**
```ts
if (checkRateLimit(user.id, 'social-fetch', 5, 60)) {
  return new Response('Rate limited', { status: 429, headers: corsHeaders });
}
```

---

## 2. Wire Logger to Critical Edge Functions (Medium priority)

`supabase/functions/_shared/logger.ts` is created. Apply it to:

**`supabase/functions/billing/index.ts`:**
```ts
import { logger } from '../_shared/logger.ts';
// In catch block:
await logger.error('billing', 'Payment processing failed', { userId: user.id, error: err.message });
```

**`supabase/functions/stripe-webhook/index.ts`:**
```ts
import { logger } from '../_shared/logger.ts';
// On signature verification failure:
await logger.critical('stripe-webhook', 'Signature verification failed', { error: err.message });
```

**Enable Discord alerts:**
```bash
supabase secrets set DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK_ID/TOKEN
```

---

## 3. AI Chat Input Length Validation (Low priority)

**Frontend:** `src/components/ai/AIChatContent.tsx` — add `maxLength={2000}` to the input textarea.

**Backend:** `supabase/functions/ai-assistant/index.ts` — add:
```ts
if (!message || message.length > 2000) {
  return new Response(JSON.stringify({ error: 'invalid_message' }), { status: 400, headers: corsHeaders });
}
```

---

## 4. Settings Company Name — Verify Visibility

The `CompanySettings.tsx` tab exists and has `company_name` state. Verify that:
1. The input field renders visibly in the "Company" settings tab
2. Translation keys `settings.company_name_label` and `settings.company_name_placeholder` exist in both sv.json and en.json
3. If the field is missing from the rendered output, read `CompanySettings.tsx` fully and add a dedicated `<Input>` for `company_name` that saves to `users.company_name`.

---

## 5. Delete Dead Code File

`src/pages/Analytics.tsx` is confirmed dead code (not imported in App.tsx). Safe to delete:
```bash
rm src/pages/Analytics.tsx
```
Verify first: `grep -r "from.*pages/Analytics" src/` should return nothing.

---

## 6. Apply DB Migration

Run the new migration in Supabase SQL Editor (or via `supabase db push`):
```
supabase/migrations/20260327000001_add_missing_indexes.sql
```

---

## 7. Hero Mobile Bubble Z-Index

When mobile nav dropdown is open, the chat bubble may overlap it. Check z-index values:
- `Navbar.tsx` mobile dropdown z-index
- `ChatWidget.tsx` bubble z-index (`z-[60]`)
- Ensure dropdown renders ABOVE the bubble (should be z-[70] or higher)

---

## What Was Completed This Session

| Task | Status |
|------|--------|
| P0: Fix useTranslation crash | ✅ Done |
| Analytics connection guards | ✅ Done |
| Remove dashboard emoji | ✅ Done |
| Fix tutorial restart | ✅ Done |
| EUR pricing (English) | ✅ Done |
| Hero logo removal | ✅ Done |
| Hero light mode orb opacity | ✅ Done |
| Hero scroll → bubble animation | ✅ Done |
| Tutorial button color | ✅ Done |
| AI chat compact | ✅ Done |
| Hook Database feature | ✅ Done |
| DB indexes migration | ✅ Done |
| Rate limit utility created | ✅ Done |
| Logger utility created | ✅ Done |
| PRD document | ✅ Done |
| Rollback strategy | ✅ Done |
| Security audit | ✅ Done |
| CLAUDE.md pattern recognition | ✅ Done |
| Memory saved | ✅ Done |
| Rate limiting wired to functions | ✅ Done |
| Logger wired to functions | ✅ Done |
| AI input length validation | ✅ Done |
| Discord webhook secret | ⏳ Manual — run: `supabase secrets set DISCORD_WEBHOOK_URL=...` |
| Delete Analytics.tsx | ✅ Done |
| Hero mobile z-index fix | ✅ Done |
| Settings company name visible | ✅ Done |
