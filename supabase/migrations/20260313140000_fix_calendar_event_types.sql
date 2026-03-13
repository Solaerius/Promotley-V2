-- Drop old restrictive platform check
ALTER TABLE public.calendar_posts
  DROP CONSTRAINT IF EXISTS calendar_posts_platform_check;

-- Add event_type column for calendar categorisation
ALTER TABLE public.calendar_posts
  ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'inlagg';

-- Migrate existing platform values that are event types
UPDATE public.calendar_posts
  SET event_type = platform
  WHERE platform IN ('inlagg', 'uf_marknad', 'event', 'deadline', 'ovrigt');

-- Make platform optional (social media channel — separate concept)
ALTER TABLE public.calendar_posts
  ALTER COLUMN platform DROP NOT NULL;
ALTER TABLE public.calendar_posts
  ALTER COLUMN platform SET DEFAULT NULL;

-- Clear event-type values from the platform column
UPDATE public.calendar_posts
  SET platform = NULL
  WHERE platform IN ('inlagg', 'uf_marknad', 'event', 'deadline', 'ovrigt');

-- Add check constraints
ALTER TABLE public.calendar_posts
  ADD CONSTRAINT calendar_posts_event_type_check
  CHECK (event_type IN ('inlagg', 'uf_marknad', 'event', 'deadline', 'ovrigt'));

ALTER TABLE public.calendar_posts
  ADD CONSTRAINT calendar_posts_platform_check
  CHECK (platform IS NULL OR platform IN ('instagram', 'tiktok', 'facebook'));
