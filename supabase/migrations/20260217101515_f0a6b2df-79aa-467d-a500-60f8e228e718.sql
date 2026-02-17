-- Add event_type column to calendar_posts to support different event types
ALTER TABLE public.calendar_posts 
ADD COLUMN IF NOT EXISTS event_type TEXT NOT NULL DEFAULT 'inlagg';

-- Add a comment for documentation
COMMENT ON COLUMN public.calendar_posts.event_type IS 'Event type: inlagg, uf_marknad, event, deadline, ovrigt';