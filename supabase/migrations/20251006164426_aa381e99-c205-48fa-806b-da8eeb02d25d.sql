-- Security Fix: Prevent connection ownership transfer and rate limit manipulation

-- 1. FIX CONNECTIONS TABLE - Prevent user_id modification during updates
-- Create trigger function to block user_id changes
CREATE OR REPLACE FUNCTION public.prevent_user_id_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Prevent changing user_id (connection ownership transfer)
  IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
    RAISE EXCEPTION 'Connection ownership cannot be transferred';
  END IF;
  RETURN NEW;
END;
$$;

-- Apply trigger to connections table
DROP TRIGGER IF EXISTS prevent_connection_ownership_transfer ON public.connections;
CREATE TRIGGER prevent_connection_ownership_transfer
  BEFORE UPDATE ON public.connections
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_user_id_change();

-- Strengthen UPDATE policy to explicitly check user_id hasn't changed
DROP POLICY IF EXISTS "Users can update own connections" ON public.connections;
CREATE POLICY "Users can update own connections" 
ON public.connections 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id AND auth.uid() = user_id);

-- 2. FIX RATE_LIMITS TABLE - Prevent user manipulation of rate limit data
-- Users should ONLY be able to SELECT their rate limits, never modify them

-- Drop the overly permissive service role policy and recreate with specific operations
DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.rate_limits;

-- Service role can INSERT rate limits (for rate limit checking)
CREATE POLICY "Service role can insert rate limits"
ON public.rate_limits
FOR INSERT
TO service_role
WITH CHECK (true);

-- Service role can UPDATE rate limits (for incrementing counters)
CREATE POLICY "Service role can update rate limits"
ON public.rate_limits
FOR UPDATE
TO service_role
USING (true)
WITH CHECK (true);

-- Service role can DELETE rate limits (for cleanup)
CREATE POLICY "Service role can delete rate limits"
ON public.rate_limits
FOR DELETE
TO service_role
USING (true);

-- Service role can SELECT all rate limits (for monitoring)
CREATE POLICY "Service role can select rate limits"
ON public.rate_limits
FOR SELECT
TO service_role
USING (true);

-- Users can ONLY view their own rate limits (read-only)
-- The existing "Users can view own rate limits" policy is fine, no changes needed

-- Add default deny for authenticated users trying to modify rate limits
CREATE POLICY "Authenticated users cannot modify rate limits"
ON public.rate_limits
FOR ALL
TO authenticated
USING (false)
WITH CHECK (false);