-- =============================================================
-- Security & Performance: Missing Indexes
-- Adds indexes on frequently-queried user_id / created_at columns
-- that were not covered by earlier migrations.
-- RLS audit: all listed tables already have RLS enabled;
-- this migration only adds indexes and a missing user_id index
-- on ai_chat_messages for direct user queries.
-- =============================================================

-- ai_chat_messages: direct user_id lookup (most queries go through
-- conversation_id, but some admin/cleanup queries use user_id directly)
CREATE INDEX IF NOT EXISTS idx_ai_chat_messages_user_id
  ON public.ai_chat_messages(user_id);

-- calendar_posts: user_id lookup
CREATE INDEX IF NOT EXISTS idx_calendar_posts_user_id
  ON public.calendar_posts(user_id);

-- calendar_posts: date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_posts_date
  ON public.calendar_posts(date);

-- connections: user_id lookup
CREATE INDEX IF NOT EXISTS idx_connections_user_id
  ON public.connections(user_id);

-- notifications: user_id lookup + time-ordered queries
CREATE INDEX IF NOT EXISTS idx_notifications_user_id
  ON public.notifications(user_id);

CREATE INDEX IF NOT EXISTS idx_notifications_created_at
  ON public.notifications(created_at DESC);

-- profiles: user_id (auth.uid) lookup — primary key already covers this
-- but an explicit index aids RLS policy evaluation
CREATE INDEX IF NOT EXISTS idx_profiles_user_id
  ON public.profiles(user_id);

-- social_stats: user_id + time ordering (used on dashboard follower history)
CREATE INDEX IF NOT EXISTS idx_social_stats_user_id_updated
  ON public.social_stats(user_id, updated_at DESC);
