-- Stripe tables migration for Promotely
-- Replaces the manual Swish payment flow with Stripe Checkout

-- 1. Add stripe_customer_id to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS stripe_customer_id text;

-- 2. Create stripe_customers table
CREATE TABLE IF NOT EXISTS stripe_customers (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid REFERENCES users(id) UNIQUE NOT NULL,
  stripe_customer_id  text UNIQUE NOT NULL,
  created_at          timestamptz DEFAULT now()
);

ALTER TABLE stripe_customers ENABLE ROW LEVEL SECURITY;

-- Users can read their own row
CREATE POLICY "Users can read own stripe_customer"
  ON stripe_customers FOR SELECT
  USING (auth.uid() = user_id);

-- 3. Create stripe_subscriptions table
CREATE TABLE IF NOT EXISTS stripe_subscriptions (
  id                       uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                  uuid REFERENCES users(id) NOT NULL,
  stripe_subscription_id   text UNIQUE NOT NULL,
  stripe_customer_id       text NOT NULL,
  price_id                 text NOT NULL,
  plan                     text NOT NULL,  -- starter | growth | pro
  status                   text NOT NULL,  -- active | canceled | past_due | incomplete
  current_period_start     timestamptz,
  current_period_end       timestamptz,
  cancel_at_period_end     boolean DEFAULT false,
  created_at               timestamptz DEFAULT now(),
  updated_at               timestamptz DEFAULT now()
);

ALTER TABLE stripe_subscriptions ENABLE ROW LEVEL SECURITY;

-- Users can read their own rows
CREATE POLICY "Users can read own subscriptions"
  ON stripe_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Admins can read all rows
CREATE POLICY "Admins can read all subscriptions"
  ON stripe_subscriptions FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- 4. Create processed_stripe_events table for webhook idempotency
CREATE TABLE IF NOT EXISTS processed_stripe_events (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id        text UNIQUE NOT NULL,
  processed_at    timestamptz DEFAULT now()
);

-- No RLS on this table; accessible only by service role
