-- Remove overly permissive service role policies
-- Service role already bypasses RLS, so these policies are redundant and confusing

-- Drop service role full access policies
DROP POLICY IF EXISTS "Service role full access to conversations" ON public.conversations;
DROP POLICY IF EXISTS "Service role full access to messages" ON public.chat_messages;

-- Also ensure live_chat_messages has proper restrictions
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.live_chat_messages;

-- Create a policy that only allows INSERT with sender_type='user' for anonymous users
CREATE POLICY "Users can insert their own messages"
ON public.live_chat_messages
FOR INSERT
WITH CHECK (
  sender_type = 'user' OR has_role(auth.uid(), 'admin'::app_role)
);

-- Add explicit DENY for tampering with security_events
CREATE POLICY "Deny delete on security events"
ON public.security_events
FOR DELETE
USING (false);

CREATE POLICY "Deny update on security events"  
ON public.security_events
FOR UPDATE
USING (false);