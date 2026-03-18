# Stripe Payment Migration Design

**Date:** 2026-03-14
**Status:** Approved
**Replaces:** Swish manual payment system

---

## Overview

Replace the manual Swish QR code payment flow with Stripe Checkout (hosted). Stripe handles card processing, recurring billing, and 3D Secure compliance automatically. Admin no longer manually approves payments — Stripe webhooks trigger automatic plan/credit activation.

---

## Architecture

```
User clicks "Köp plan" in Pricing
        ↓
Frontend calls Edge Function: stripe-checkout
        ↓
Edge Function creates Stripe Checkout Session
        ↓
User redirected to Stripe hosted page (card entry)
        ↓
Stripe processes payment
        ↓
Stripe sends webhook → Edge Function: stripe-webhook
        ↓
Webhook updates: stripe_customers + stripe_subscriptions tables
              + users.plan / users.credits_left / users.max_credits / users.renewal_date
        ↓
User redirected back to /checkout/success
```

---

## Existing Code to Replace

The existing `supabase/functions/billing/index.ts` implements an older Stripe integration using `ui_mode: "embedded"` (returns `clientSecret`). This function must be **replaced in full** by the new `stripe-checkout` Edge Function described in this spec. Rename/rewrite `billing` rather than creating a parallel `stripe-checkout` function.

Routes to remove from `src/App.tsx` before adding new ones:
- `<Route path="/checkout" element={<Navigate to="/pricing" replace />} />` — will be replaced by CheckoutRedirect
- `<Route path="/billing/success" element={<Navigate to="/dashboard" replace />} />` — replace with `<Navigate to="/checkout/success" replace />` to handle any in-flight old sessions gracefully

---

## Database Schema

### New table: `stripe_customers`
```sql
id                  uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id             uuid REFERENCES users(id) UNIQUE NOT NULL
stripe_customer_id  text UNIQUE NOT NULL
created_at          timestamptz DEFAULT now()
```

RLS: Enable RLS. Users can read their own row (`auth.uid() = user_id`). Edge Functions use the **service role key** to bypass RLS for writes.

### New table: `stripe_subscriptions`
```sql
id                       uuid PRIMARY KEY DEFAULT gen_random_uuid()
user_id                  uuid REFERENCES users(id) NOT NULL
stripe_subscription_id   text UNIQUE NOT NULL
stripe_customer_id       text NOT NULL  -- no FK to stripe_customers (intentional: avoids race conditions on first-time subscriber webhooks)
price_id                 text NOT NULL
plan                     text NOT NULL  -- starter | growth | pro
status                   text NOT NULL  -- active | canceled | past_due | incomplete
current_period_start     timestamptz
current_period_end       timestamptz
cancel_at_period_end     boolean DEFAULT false
created_at               timestamptz DEFAULT now()
updated_at               timestamptz DEFAULT now()
```

RLS: Enable RLS. Users can read their own rows (`auth.uid() = user_id`). All writes from Edge Functions use the service role key. `AdminStripeOrders` page queries via an admin-only RLS policy (using `is_admin()` function already present in the codebase) or via a server-side client with the service role key.

### New table: `processed_stripe_events`
Used for webhook idempotency — prevents double-processing of duplicate events.
```sql
id              uuid PRIMARY KEY DEFAULT gen_random_uuid()
event_id        text UNIQUE NOT NULL  -- Stripe event ID (evt_...)
processed_at    timestamptz DEFAULT now()
```

RLS: Disable RLS. Accessible only by the service role (webhook Edge Function).

### Additions to `users` table
```sql
stripe_customer_id  text  -- denormalized for quick lookup
```

`users.renewal_date` remains in use. Updated by the webhook when a subscription is created or renewed (set to `current_period_end`). Not deprecated.

`users.max_credits` is the authoritative value used for monthly renewal credit resets. `invoice.paid` resets `credits_left = max_credits` using whatever is currently in `max_credits`.

### Preserved
- `swish_orders` table is kept untouched (historical data)

---

## Stripe Products to Create

### Subscription plans (recurring monthly, currency: SEK)
| Plan    | Price   | Credits | Stripe Product Name       |
|---------|---------|---------|---------------------------|
| Starter | 29 kr   | 50      | Promotely UF Starter      |
| Growth  | 49 kr   | 100     | Promotely UF Growth       |
| Pro     | 99 kr   | 200     | Promotely UF Pro          |

Credit counts are taken from `src/lib/planConfig.ts` (authoritative). Note: the old `billing` function used 300 for Pro — this is incorrect. Use 200.

### One-time credit packages (currency: SEK)
Canonical key names (used in URL params, metadata, and DB) are English. Do not rename.

| Key (canonical) | Credits | Price | Stripe Product Name          |
|-----------------|---------|-------|------------------------------|
| `mini`          | 10      | 9 kr  | Promotely Credits Mini       |
| `small`         | 25      | 19 kr | Promotely Credits Small      |
| `medium`        | 50      | 35 kr | Promotely Credits Medium     |
| `large`         | 100     | 59 kr | Promotely Credits Large      |

---

## Environment Variables

### Edge Functions (server-side, set in Supabase dashboard under project Settings → Edge Functions)
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `SITE_URL` — base URL of the app (e.g. `https://promotely.se`). No trailing slash. Used for Checkout success/cancel redirect URLs and Customer Portal return URL. Access in Deno: `Deno.env.get('SITE_URL')`. **Validate inside the request handler** (not at module top-level — Deno Edge Functions have no persistent startup). If missing, return `{ status: 500, body: { error: "SITE_URL not configured" } }` immediately.

### Frontend
- No additional env vars needed

---

## Webhook-Side Credit Maps (Deno Edge Function)

`src/lib/planConfig.ts` is a Vite/Node TypeScript file and cannot be imported into Deno Edge Functions. Define these credit maps directly in `stripe-webhook`:

```typescript
// Keep in sync with src/lib/planConfig.ts
const PLAN_CREDITS: Record<string, number> = {
  starter: 50,
  growth: 100,
  pro: 200,
};

// Keep in sync with src/lib/stripeConfig.ts credit package definitions
const PACKAGE_CREDITS: Record<string, number> = {
  mini: 10,
  small: 25,
  medium: 50,
  large: 100,
};
```

A comment in `src/lib/planConfig.ts` must note: "Credit values are duplicated in supabase/functions/stripe-webhook — update both when changing."

---

## Server-Side Price ID Map

The `stripe-checkout` Edge Function must **not** use the client-supplied `priceId` to create the Checkout Session. Instead, maintain a trusted server-side map keyed by `planKey` and `type`, and derive the `priceId` from that:

```typescript
const PRICE_IDS: Record<string, string> = {
  starter: Deno.env.get('STRIPE_PRICE_STARTER') ?? '',
  growth:  Deno.env.get('STRIPE_PRICE_GROWTH') ?? '',
  pro:     Deno.env.get('STRIPE_PRICE_PRO') ?? '',
  mini:    Deno.env.get('STRIPE_PRICE_MINI') ?? '',
  small:   Deno.env.get('STRIPE_PRICE_SMALL') ?? '',
  medium:  Deno.env.get('STRIPE_PRICE_MEDIUM') ?? '',
  large:   Deno.env.get('STRIPE_PRICE_LARGE') ?? '',
};
```

Add these env vars to the Edge Function settings after creating products in Stripe:
- `STRIPE_PRICE_STARTER`, `STRIPE_PRICE_GROWTH`, `STRIPE_PRICE_PRO`
- `STRIPE_PRICE_MINI`, `STRIPE_PRICE_SMALL`, `STRIPE_PRICE_MEDIUM`, `STRIPE_PRICE_LARGE`

The `priceId` field in the frontend request body is ignored by the server — included only for documentation/debug purposes, not used in the Checkout Session.

---

## Stripe API Version

Pin the Stripe client to API version `2023-10-16` in all Edge Functions (carried forward from the existing `billing` function):
```typescript
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16',
});
```

---

## Frontend Changes

### Files removed / replaced
| Old | New |
|-----|-----|
| `src/lib/swishConfig.ts` | `src/lib/stripeConfig.ts` |
| `src/pages/SwishCheckout.tsx` | `src/pages/CheckoutRedirect.tsx` |
| `src/pages/AdminSwishOrders.tsx` | `src/pages/AdminStripeOrders.tsx` |

### New files
- `src/pages/CheckoutSuccess.tsx` — success page at `/checkout/success`
- `src/pages/CheckoutCancel.tsx` — cancel page at `/checkout/cancel`

### Modified files
- `src/App.tsx` — update routes, remove old redirects (see Routes section)
- `src/components/Pricing.tsx` — update links from `/swish-checkout?plan=X` to `/checkout?plan=X&type=plan`
- `src/components/account/AccountContent.tsx` — add "Hantera prenumeration" button

### `src/lib/stripeConfig.ts`
Replaces `swishConfig.ts`. Contains:
- Plan definitions (name, price, credits, features) — parallel to `planConfig.ts`
- Credit package definitions (name, credits, price)
- `planKey` and `packageKey` type exports
- Helper to determine purchase type (`subscription` vs `one_time`) by key

### `src/pages/CheckoutRedirect.tsx`
- Route: `/checkout?plan=growth&type=plan` or `/checkout?package=medium&type=credits`
- On mount: calls `stripe-checkout` Edge Function with `{ planKey, type }` (no priceId needed from frontend)
- Shows loading spinner while waiting
- On success: `window.location.href = url`
- On error: shows toast error + back-to-pricing button
- The `ProtectedRoute` wrapping this page must preserve query params through auth redirect. The existing `ProtectedRoute` does `<Navigate to="/auth" replace />` without preserving the return URL — this must be fixed. Update `ProtectedRoute` to pass the full current URL as `state.from` or a `redirect` query param, and update the auth page to redirect back after login. Without this fix, a non-logged-in user clicking "Köp plan" will lose their checkout context after logging in.

### `src/pages/CheckoutSuccess.tsx`
- Route: `/checkout/success` — **public route**
- If authenticated: "Tack för ditt köp! Din plan aktiveras inom kort." + navigate to `/dashboard`
- If unauthenticated: "Betalning mottagen! Logga in för att se din plan." + navigate to `/auth`

### `src/pages/CheckoutCancel.tsx`
- Route: `/checkout/cancel` — public
- "Betalning avbruten" + navigate to `/pricing`

### `src/pages/AdminStripeOrders.tsx`
- Route: `/admin/stripe`
- Query using `!user_id` FK hint:
  ```ts
  supabase.from("stripe_subscriptions").select("*, users!user_id(email)")
  ```
- Displays: customer email, plan, status, current_period_start, current_period_end, cancel_at_period_end
- Filter by status (active / canceled / past_due)
- Read-only

### "Hantera prenumeration" button condition
Show only when user has a row in `stripe_subscriptions` with `status = 'active'`. This is the exact gate condition — not `stripe_customers` existence, not `users.plan`. Query: `stripe_subscriptions WHERE user_id = currentUser.id AND status = 'active'`.

### Routes (`src/App.tsx`)
```
/checkout              → CheckoutRedirect (ProtectedRoute)
/checkout/success      → CheckoutSuccess (public)
/checkout/cancel       → CheckoutCancel (public)
/admin/stripe          → AdminStripeOrders (AdminRoute)
/swish-checkout        → <Navigate to="/pricing" replace />
/billing/success       → <Navigate to="/checkout/success" replace />  (keep for in-flight old sessions)
```
Remove: `<Route path="/checkout" element={<Navigate to="/pricing" replace />} />`

---

## Edge Functions

### CORS

`stripe-checkout` and `stripe-portal` are called from the browser and must handle CORS. Include the following on all responses (including OPTIONS preflight):
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
```

`stripe-webhook` is called by Stripe server-to-server — CORS headers are not needed.

### `stripe-checkout` (replaces existing `billing` function)
**Input (authenticated request body):** `{ planKey: string, type: "subscription" | "one_time" }`

The `priceId` from the client is ignored. The server derives it from `PRICE_IDS[planKey]`.

**Logic:**
1. Handle CORS OPTIONS
2. Validate `SITE_URL` env var — throw if missing
3. Verify JWT → extract `userId` and `userEmail`
4. Validate `planKey` exists in `PRICE_IDS` — return 400 if not
5. Validate that `type` matches `planKey`: plan keys (`starter`, `growth`, `pro`) must use `type: "subscription"`; package keys (`mini`, `small`, `medium`, `large`) must use `type: "one_time"`. Return 400 if mismatched — this prevents a confusing Stripe API rejection downstream.
6. Derive `priceId = PRICE_IDS[planKey]`
6. Look up `stripe_customers` for existing Stripe Customer ID
7. If not found: create Stripe Customer, insert into `stripe_customers`, update `users.stripe_customer_id`
8. Create Checkout Session:
   - `mode: "subscription"` if `type === "subscription"`, `mode: "payment"` otherwise
   - `line_items: [{ price: priceId, quantity: 1 }]`
   - `success_url: ${SITE_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`
   - `cancel_url: ${SITE_URL}/checkout/cancel`
   - `customer`: Stripe Customer ID
   - `metadata: { userId, planKey, type }` — `planKey` is the canonical metadata field for both plans and packages. Do **not** use `packageId`, `plan`, or any other field name from the old `billing` function.
9. Return `{ url: session.url }`

### `stripe-webhook`
**Security:** Verify Stripe signature with `STRIPE_WEBHOOK_SECRET` — return 400 on invalid.

**Idempotency:** Check `event.id` in `processed_stripe_events`. If found, return 200 immediately. Insert after processing.

**Events:**

| Event | Condition | Action |
|-------|-----------|--------|
| `checkout.session.completed` | `session.mode === 'payment'` only — **skip if `mode === 'subscription'`** | Find user via `session.metadata.userId`. Add `PACKAGE_CREDITS[metadata.planKey]` to `users.credits_left` (e.g. `planKey: "medium"` → add 50). |
| `customer.subscription.created` | Always | Upsert `stripe_subscriptions` on conflict `stripe_subscription_id`. Set `users.plan`, `users.credits_left = PLAN_CREDITS[plan]`, `users.max_credits = PLAN_CREDITS[plan]`, `users.renewal_date = current_period_end`. |
| `customer.subscription.updated` | Always — but credits only reset on plan change | (1) Extract new `price_id` from `subscription.items.data[0].price.id`. (2) Query existing `price_id`: `SELECT price_id FROM stripe_subscriptions WHERE stripe_subscription_id = subscription.id`. (3) Upsert `stripe_subscriptions` on conflict `stripe_subscription_id` (always update status, cancel_at_period_end, current_period_end, price_id). (4) **If new `price_id` differs from the previously stored `price_id`** (plan change): also reset `users.plan`, `users.credits_left = PLAN_CREDITS[new_plan]`, `users.max_credits = PLAN_CREDITS[new_plan]`, `users.renewal_date = current_period_end`. If `price_id` is unchanged (renewal, payment update, cancel toggle), do not touch credits. |
| `customer.subscription.deleted` | Always | Set `stripe_subscriptions.status = 'canceled'`. Reset `users.plan = 'free'`, `users.credits_left = 0`, `users.max_credits = 0`. |
| `invoice.payment_failed` | Always | Update `stripe_subscriptions.status = 'past_due'`. |
| `invoice.paid` | **Only if `invoice.billing_reason !== 'subscription_create'`** (skip initial invoice). Look up user via: `SELECT user_id FROM stripe_subscriptions WHERE stripe_subscription_id = invoice.subscription`. If row not found, or row has `status = 'canceled'`: log warning, return 200 (skip silently). | Reset `users.credits_left = users.max_credits`. Update `users.renewal_date = invoice.lines.data[0].period.end` (Unix timestamp, convert to ISO string). |

### `stripe-portal`
**Input:** `{}` (user identified via JWT only)

**Logic:**
1. Handle CORS OPTIONS
2. Validate `SITE_URL`
3. Verify JWT → extract `userId`
4. Look up `stripe_customer_id` from `stripe_customers` WHERE `user_id = userId`
5. If not found: return 404 `{ error: "Ingen Stripe-kund hittades" }`
6. Create Billing Portal Session: `return_url: ${SITE_URL}/account`
7. Return `{ url: session.url }`

---

## Webhook Endpoint Registration

After deploying `stripe-webhook`, register in **Stripe Dashboard → Developers → Webhooks → Add endpoint**:

- **Endpoint URL:** `https://<supabase-project-ref>.supabase.co/functions/v1/stripe-webhook`
- **Events to listen for:**
  - `checkout.session.completed`
  - `customer.subscription.created`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.paid`
  - `invoice.payment_failed`

Copy the webhook **Signing secret** into `STRIPE_WEBHOOK_SECRET` in Supabase Edge Function env vars.

---

## Data Flows

### Subscription Purchase
1. User clicks "Köp Growth" on `/pricing`
2. Navigate to `/checkout?plan=growth&type=plan`
3. `CheckoutRedirect` calls `stripe-checkout` with `{ planKey: "growth", type: "subscription" }`
4. Edge Function derives `priceId` from server-side map → creates Checkout Session → returns URL
5. Frontend redirects to Stripe
6. User pays → Stripe redirects to `/checkout/success`
7. `customer.subscription.created` webhook → sets `users.plan=growth`, `credits_left=100`, `max_credits=100`, `renewal_date=period_end`

### Credit Top-up
1. User clicks "Köp 50 krediter"
2. Navigate to `/checkout?package=medium&type=credits`
3. `CheckoutRedirect` calls `stripe-checkout` with `{ planKey: "medium", type: "one_time" }`
4. Session created with `mode: "payment"`
5. User pays → `/checkout/success`
6. `checkout.session.completed` fires (mode=payment) → adds 50 to `users.credits_left`

### Monthly Credit Renewal
1. Stripe charges subscription on renewal date → `invoice.paid` fires (`billing_reason: 'subscription_cycle'`)
2. Webhook finds user via `invoice.subscription → stripe_subscriptions.user_id`
3. Resets `users.credits_left = users.max_credits`, updates `users.renewal_date`

### Manage Subscription
1. User sees "Hantera prenumeration" button (active subscription exists)
2. Calls `stripe-portal` → redirected to Stripe Customer Portal
3. User cancels/updates → returned to `/account`

---

## Plan Upgrade / Downgrade
On plan change (`customer.subscription.updated` with price_id change):
- Update `users.plan` immediately
- Reset `users.credits_left = new_plan.credits` and `users.max_credits = new_plan.credits`
- Credits do not carry over between plans

---

## Error Handling

| Scenario | Response |
|----------|----------|
| Checkout session creation fails | Toast error, stay on `/checkout` with retry button |
| `SITE_URL` not set | Edge Function throws on startup |
| Webhook signature invalid | Return 400 |
| Webhook event already processed | Return 200 immediately |
| Webhook processing error | Return 500 (Stripe retries for up to 3 days) |
| `invoice.paid` but no subscription row found | Log warning, return 200 (skip silently) |
| Portal: no Stripe customer found | Return 404, frontend toast "Ingen aktiv prenumeration hittades" |
| Checkout success, unauthenticated | Show "Betalning mottagen! Logga in för att se din plan." |

---

## Migration Notes

- `swish_orders` table and `AdminSwishOrders` page kept at `/admin/swish` for historical lookup
- `/swish-checkout` redirects to `/pricing`
- `/billing/success` redirects to `/checkout/success` (handles in-flight old sessions)
- Existing users unaffected until they purchase through the new flow
- Credit package key names stay as English (`mini`, `small`, `medium`, `large`)
- Pro plan credits are 200 (per `planConfig.ts`) — old `billing` function's value of 300 is incorrect
