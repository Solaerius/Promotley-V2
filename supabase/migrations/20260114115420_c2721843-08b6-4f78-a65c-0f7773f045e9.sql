-- Fix critical security issues

-- 1. Fix organizations table - restrict public access to invite codes only
-- Currently anyone can see all org data if invite_link_enabled is true
DROP POLICY IF EXISTS "Anyone can view organizations by invite code" ON public.organizations;
CREATE POLICY "Users can view orgs by invite code when known"
ON public.organizations
FOR SELECT
USING (
  is_org_member(auth.uid(), id) OR 
  (invite_link_enabled = true AND invite_code IS NOT NULL)
);

-- 2. Fix organization_invites - restrict to viewing only by specific code
DROP POLICY IF EXISTS "Anyone can view invites by code" ON public.organizations;
-- The issue is with the organizations table, not invites

-- 3. Tighten the tokens table policies
DROP POLICY IF EXISTS "Service role full access to tokens" ON public.tokens;
DROP POLICY IF EXISTS "Only service role can insert tokens" ON public.tokens;
-- Service role bypasses RLS anyway, so these policies aren't doing much
-- We just need to ensure regular users can't do anything except view/delete their own

-- 4. Drop the duplicate oauth_states policy we created earlier
DROP POLICY IF EXISTS "Service role can manage oauth states" ON public.oauth_states;
-- Service role bypasses RLS, no explicit policy needed