
-- 1. Add action_url and action_type to notifications table
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_url text;
ALTER TABLE public.notifications ADD COLUMN IF NOT EXISTS action_type text;

-- 2. Create free_tier_usage table
CREATE TABLE IF NOT EXISTS public.free_tier_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  usage_type text NOT NULL CHECK (usage_type IN ('ai_analysis', 'calendar')),
  used_at timestamp with time zone NOT NULL DEFAULT now(),
  period_start date NOT NULL DEFAULT date_trunc('month', CURRENT_DATE)::date,
  UNIQUE (user_id, usage_type, period_start)
);

ALTER TABLE public.free_tier_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own free_tier_usage" ON public.free_tier_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own free_tier_usage" ON public.free_tier_usage
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- 3. Create email_automation_settings table
CREATE TABLE IF NOT EXISTS public.email_automation_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email_type text NOT NULL UNIQUE,
  enabled boolean NOT NULL DEFAULT false,
  delay_days integer NOT NULL DEFAULT 7,
  updated_at timestamp with time zone DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

ALTER TABLE public.email_automation_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can manage email_automation_settings" ON public.email_automation_settings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Seed default settings
INSERT INTO public.email_automation_settings (email_type, enabled, delay_days) VALUES
  ('inactive_reminder', false, 7),
  ('reengagement', false, 14)
ON CONFLICT (email_type) DO NOTHING;

-- 4. Create email_automation_logs table
CREATE TABLE IF NOT EXISTS public.email_automation_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type text NOT NULL,
  sent_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.email_automation_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view email_automation_logs" ON public.email_automation_logs
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Service role can insert email_automation_logs" ON public.email_automation_logs
  FOR INSERT TO service_role
  WITH CHECK (true);

-- 5. Update handle_new_user() to set free tier (0/0 credits, free_trial plan)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, plan, credits_left, max_credits, trial_used)
  VALUES (
    new.id,
    new.email,
    'free_trial',
    0,
    0,
    false
  );
  RETURN new;
END;
$$;
