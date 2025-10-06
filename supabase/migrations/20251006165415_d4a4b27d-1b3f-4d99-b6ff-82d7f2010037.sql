-- CRITICAL SECURITY FIX: Prevent email exposure in users table
-- Issue: Need explicit SELECT policy to ensure users can ONLY view their own profile

-- The existing "Users can view own profile" SELECT policy is good, but we'll make it
-- even more explicit and add a restrictive policy to ensure no data leakage

-- First, ensure the existing SELECT policy is correctly configured
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Add an additional RESTRICTIVE policy to absolutely prevent cross-user data access
-- This creates a second layer of defense
CREATE POLICY "Restrict users table access to own profile only"
ON public.users
AS RESTRICTIVE
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Verify: Users should now ONLY be able to SELECT their own row
-- Any attempt to query other users' data will be blocked by the restrictive policy