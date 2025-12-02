-- =====================================================
-- COMPREHENSIVE SECURITY FIX MIGRATION
-- Fixes all critical RLS policy vulnerabilities
-- =====================================================

-- 1. FIX: live_chat_messages - Remove overly permissive SELECT policy
DROP POLICY IF EXISTS "Users can view their own session messages" ON public.live_chat_messages;

-- Create a secure session-based SELECT policy (only admins can view all, others get nothing from DB - session tracking is client-side)
CREATE POLICY "Only admins can view all chat messages"
ON public.live_chat_messages
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

-- 2. FIX: auth_resend_logs - Remove public access, restrict to service role only
DROP POLICY IF EXISTS "Service role can read logs" ON public.auth_resend_logs;
DROP POLICY IF EXISTS "Service role can insert logs" ON public.auth_resend_logs;

-- Recreate with proper restrictions (service role bypasses RLS anyway, these are just documentation)
CREATE POLICY "Deny all public access to auth_resend_logs"
ON public.auth_resend_logs
FOR ALL
USING (false)
WITH CHECK (false);

-- 3. FIX: chat_messages - Remove anonymous access vulnerability
DROP POLICY IF EXISTS "Users can view messages in their conversations" ON public.chat_messages;
DROP POLICY IF EXISTS "Anyone can create messages" ON public.chat_messages;

-- Require authentication for viewing messages
CREATE POLICY "Authenticated users can view their conversation messages"
ON public.chat_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  EXISTS (
    SELECT 1 FROM public.conversations c
    WHERE c.id = chat_messages.conversation_id
    AND (c.user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
  )
);

-- Only authenticated users or admins can create messages
CREATE POLICY "Authenticated users can create messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL OR
  has_role(auth.uid(), 'admin'::app_role)
);

-- 4. FIX: conversations - Remove anonymous access vulnerability
DROP POLICY IF EXISTS "Users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.conversations;
DROP POLICY IF EXISTS "Users can update own conversations" ON public.conversations;

-- Require authentication for viewing conversations
CREATE POLICY "Authenticated users can view own conversations"
ON public.conversations
FOR SELECT
USING (
  auth.uid() IS NOT NULL AND
  (user_id = auth.uid() OR has_role(auth.uid(), 'admin'::app_role))
);

-- Authenticated users can create conversations
CREATE POLICY "Authenticated users can create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (auth.uid() IS NOT NULL);

-- Users can update their own conversations
CREATE POLICY "Users can update own conversations"
ON public.conversations
FOR UPDATE
USING (auth.uid() IS NOT NULL AND user_id = auth.uid());

-- 5. FIX: tokens - Consolidate overlapping policies
DROP POLICY IF EXISTS "Deny access to other users tokens" ON public.tokens;
DROP POLICY IF EXISTS "Users can only view their own tokens - strict" ON public.tokens;

-- Single clear policy for token access
CREATE POLICY "Users can only view own tokens"
ON public.tokens
FOR SELECT
USING (auth.uid() IS NOT NULL AND auth.uid() = user_id);

-- 6. FIX: live_chat_sessions - Add policy for anonymous session creation (needed for chat widget)
DROP POLICY IF EXISTS "Admins can create sessions" ON public.live_chat_sessions;

-- Allow anyone to create sessions (needed for chat widget)
CREATE POLICY "Anyone can create chat sessions"
ON public.live_chat_sessions
FOR INSERT
WITH CHECK (true);

-- 7. FIX: Function search_path - Update notification_settings_timestamp function
CREATE OR REPLACE FUNCTION public.update_notification_settings_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;