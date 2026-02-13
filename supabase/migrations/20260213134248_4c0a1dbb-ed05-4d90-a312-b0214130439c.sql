
-- Add new columns to ai_profiles for consolidated onboarding
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS foretagsnamn text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS stad text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS postnummer text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS lan text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS land text DEFAULT 'Sverige';
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS budgetniva text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS kanaler text[];
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS allman_info text;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;
ALTER TABLE public.ai_profiles ADD COLUMN IF NOT EXISTS nyckelord text[];
