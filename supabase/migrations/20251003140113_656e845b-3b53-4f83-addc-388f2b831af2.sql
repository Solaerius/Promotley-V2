-- Fix missing INSERT policy on tokens table
-- Only service role should be able to insert tokens (done via edge functions)
CREATE POLICY "Service role can insert tokens"
ON public.tokens
FOR INSERT
TO service_role
WITH CHECK (true);