-- Fix remaining RLS policy issues for chat_messages and conversations
-- These need stricter authentication requirements

-- 1. Fix chat_messages - ensure authentication is REQUIRED
DROP POLICY IF EXISTS "Authenticated users can view their conversation messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Authenticated users can create messages" ON public.chat_messages;

-- Strict policy: Must be authenticated AND (own conversation OR admin)
CREATE POLICY "Strict auth required to view chat messages"
ON public.chat_messages
FOR SELECT
USING (
  auth.uid() IS NOT NULL 
  AND (
    EXISTS (
      SELECT 1 FROM public.conversations c
      WHERE c.id = chat_messages.conversation_id
      AND c.user_id = auth.uid()
    )
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Strict policy: Must be authenticated to create messages
CREATE POLICY "Strict auth required to create chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- 2. Fix conversations - ensure authentication is REQUIRED  
DROP POLICY IF EXISTS "Authenticated users can view own conversations" ON public.conversations;
DROP POLICY IF EXISTS "Authenticated users can create conversations" ON public.conversations;

-- Strict policy: Must be authenticated AND (own conversation OR admin)
CREATE POLICY "Strict auth required to view conversations"
ON public.conversations
FOR SELECT
USING (
  auth.uid() IS NOT NULL
  AND (
    user_id = auth.uid()
    OR has_role(auth.uid(), 'admin'::app_role)
  )
);

-- Strict policy: Must be authenticated to create conversations
CREATE POLICY "Strict auth required to create conversations"
ON public.conversations
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
);

-- 3. Add INSERT policy for notifications (system notifications)
CREATE POLICY "Service role can insert notifications"
ON public.notifications
FOR INSERT
WITH CHECK (true);