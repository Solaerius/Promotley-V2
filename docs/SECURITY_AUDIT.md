# Promotley — Security Audit Report

**Date:** 2026-03-27
**Scope:** Frontend (React), Backend (Supabase Edge Functions), Database (Postgres + RLS)

---

## Summary

| Category | Status | Notes |
|----------|--------|-------|
| RLS (Row Level Security) | ✅ Good | All major tables have RLS enabled |
| Authentication | ✅ Good | JWT validated in all edge functions |
| Input validation | ✅ Good | Zod on forms; AI input has `maxLength={2000}` + server-side cap |
| CORS | ⚠️ Review | All functions use `*` — acceptable with JWT auth |
| Rate limiting | ✅ Good | Applied to billing (3/min), fetch-tiktok-data and fetch-meta-data have DB-based rate limiting |
| Prompt injection | ✅ Good | Pattern matching in `ai-assistant` edge function |
| Stripe webhooks | ✅ Good | Signature verification implemented |
| Password reset | ✅ Good | Supabase Auth handles expiry (1 hour default) |
| Error handling | ✅ Good | ErrorBoundary at root; per-hook error toasts |
| Logging | ✅ Good | `_shared/logger.ts` integrated into billing and stripe-webhook |
| Secrets management | ✅ Good | All API keys in Supabase secrets |

---

## 1. Authentication & Authorization

### ✅ JWT Validation
All edge functions extract and validate the JWT from `Authorization: Bearer <token>` before processing requests. Example from `billing/index.ts`:
```ts
const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
if (!user) return jsonResponse({ error: 'invalid_token' }, 401);
```

### ✅ Row Level Security
RLS confirmed enabled on:
- `users` — SELECT/UPDATE limited to `auth.uid() = id`
- `profiles` — user-scoped
- `suggestions` — user-scoped
- `ai_conversations` — user-scoped
- `ai_chat_messages` — scoped through conversation ownership
- `connections` — user-scoped
- `notifications` — user-scoped
- `calendar_posts` — user-scoped
- `stripe_customers` — user-scoped
- `stripe_subscriptions` — user-scoped + admin read-all
- `organization_profiles` — org-member scoped + role-based writes
- `sales_radar_results` — user-scoped
- `sales_radar_watches` — user-scoped

### ✅ Email Verification Gate
`/ai/*` routes require verified email via `RequireVerifiedEmail` component.

### ✅ Admin Access Control
`AdminRoute` component queries `user_roles` table for `admin` role before rendering admin pages.

---

## 2. Input Validation

### ✅ Form Validation
`src/lib/validations.ts` contains Zod schemas for auth forms and settings. React Hook Form + Zod is used on sign-up, sign-in, and settings forms.

### ⚠️ AI Chat Input — Needs Length Cap
The AI chat textarea in `AIChatContent.tsx` does not enforce a max character count client-side. The edge function should truncate or reject oversized payloads.

**Recommendation:** Add `maxLength={2000}` to the textarea and validate server-side in `ai-assistant/index.ts`:
```ts
if (message.length > 2000) return jsonResponse({ error: 'message_too_long' }, 400);
```

### ✅ Prompt Injection Protection
`ai-assistant/index.ts` contains a comprehensive list of 20+ prompt injection patterns:
- "ignore previous instructions", "jailbreak", "DAN mode", etc.
- Pattern is checked before sending to the AI model.

### ✅ Stripe Plan Validation
`billing/index.ts` validates the plan key against a whitelist of known Stripe Price IDs server-side.

---

## 3. CORS Configuration

### ⚠️ Wildcard CORS
All edge functions use `'Access-Control-Allow-Origin': '*'`. This is a common pattern with Supabase Edge Functions because:
1. Security is enforced by JWT validation (not CORS)
2. `*` is required for Supabase client library to function correctly
3. CORS is a browser mechanism and does not protect server-to-server calls

**Assessment:** Acceptable given JWT auth. Not a high-severity issue.

**For stricter environments:** Replace `*` with `https://promotley.se` and add `https://localhost:8080` for development. Requires an env var to switch.

---

## 4. Rate Limiting

### ⚠️ Partial Implementation
`supabase/functions/_shared/rateLimit.ts` has been created with:
- In-memory sliding window counter
- Per-user, per-action tracking
- Helper for response headers

**Not yet applied to edge functions.** To apply:
```ts
import { checkRateLimit } from '../_shared/rateLimit.ts';

// In the handler:
const userId = user.id;
if (checkRateLimit(userId, 'ai-chat', 10, 60)) {
  return new Response('Rate limited', { status: 429 });
}
```

**Recommended limits:**
| Function | Max requests | Window |
|----------|-------------|--------|
| `ai-assistant/chat` | 10 | 60s |
| `fetch-tiktok-data` | 5 | 60s |
| `fetch-meta-data` | 5 | 60s |
| `billing` | 3 | 60s |
| `generate-suggestion` | 5 | 60s |

**Note:** In-memory rate limiting only persists within a single edge function instance (~10 min). For true persistent rate limiting, implement the DB-based approach described in `rateLimit.ts`.

---

## 5. Error Handling

### ✅ Root Error Boundary
`src/components/ErrorBoundary.tsx` wraps the entire app and shows a branded error UI. No raw stack traces are exposed to users.

### ✅ Per-Hook Error States
All data hooks have try/catch with user-visible error toasts via `useToast`. Errors are internationalized via `useTranslation`.

### ✅ Edge Function Error Responses
Edge functions return structured JSON errors with appropriate HTTP status codes (400, 401, 403, 404, 429, 500).

---

## 6. Logging & Alerting

### ⚠️ Logging Infrastructure Created
`supabase/functions/_shared/logger.ts` is ready with:
- Severity levels: debug, info, warn, error, critical
- Discord webhook integration (requires `DISCORD_WEBHOOK_URL` secret)
- Structured JSON output to console (captured by Supabase function logs)

**To enable Discord alerts:**
```bash
supabase secrets set DISCORD_WEBHOOK_URL=https://discord.com/api/webhooks/YOUR_WEBHOOK
```

**Not yet integrated** into individual edge functions. Priority functions to add logging:
1. `billing` — payment failures
2. `stripe-webhook` — webhook processing errors
3. `ai-assistant` — AI errors / rate limit hits

---

## 7. Identified Vulnerabilities & Remediation

| ID | Severity | Description | Status | Remediation |
|----|----------|-------------|--------|-------------|
| SEC-001 | Low | AI chat textarea has no client-side length limit | ✅ Fixed | Added `maxLength={2000}` to textarea; server validates at 10,000 chars |
| SEC-002 | Low | Rate limiting not applied to edge functions | ✅ Fixed | `checkRateLimit` applied to billing; TikTok/Meta use DB-based rate limiting |
| SEC-003 | Info | CORS uses wildcard `*` | Accepted | JWT auth is the security layer; CORS is browser-only |
| SEC-004 | Info | Logging/alerting not integrated into edge functions | ✅ Fixed | `logger` integrated into billing and stripe-webhook |
| SEC-005 | Info | In-memory rate limiter resets on function restart | Open | Implement DB-based persistent rate limiting |

---

## 8. Recommendations — Next Steps

1. **Apply rate limiting** to `ai-assistant/chat` and `billing` edge functions using `_shared/rateLimit.ts`
2. **Add AI input length validation** (client `maxLength` + server check)
3. **Set `DISCORD_WEBHOOK_URL`** Supabase secret to enable alert notifications
4. **Integrate `logger.ts`** into `billing` and `stripe-webhook` functions
5. **Run penetration test** before first public launch:
   - Test RLS by querying tables with a different user's JWT
   - Test prompt injection with known attack payloads
   - Test Stripe webhook with invalid signatures
   - Test rate limiting with burst requests
