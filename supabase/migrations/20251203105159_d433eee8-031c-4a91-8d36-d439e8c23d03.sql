-- Fix RLS on users table: drop existing policies and recreate as PERMISSIVE

-- Drop ALL existing SELECT policies on users
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Restrict users table access to own profile only" ON public.users;
DROP POLICY IF EXISTS "Org members can view other org members basic info" ON public.users;

-- Recreate as PERMISSIVE policies
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Org members can view other org members basic info"
ON public.users
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1
    FROM public.organization_members om1
    JOIN public.organization_members om2 ON om1.organization_id = om2.organization_id
    WHERE om1.user_id = auth.uid()
      AND om2.user_id = users.id
  )
);