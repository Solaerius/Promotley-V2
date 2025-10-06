-- Phase 1: Critical RLS Policy Fixes (Corrected)

-- ============================================
-- Fix security_events table access control
-- ============================================

-- Drop ALL existing policies on security_events
DROP POLICY IF EXISTS "Service role can insert security events" ON public.security_events;
DROP POLICY IF EXISTS "Service role can view security events" ON public.security_events;
DROP POLICY IF EXISTS "Service role ONLY can insert security events" ON public.security_events;
DROP POLICY IF EXISTS "Service role ONLY can view security events" ON public.security_events;
DROP POLICY IF EXISTS "Block anonymous access to security events" ON public.security_events;

-- Create policies restricted to service role ONLY using auth.role()
CREATE POLICY "service_role_insert_security_events"
ON public.security_events
FOR INSERT
TO service_role
WITH CHECK (true);

CREATE POLICY "service_role_select_security_events"
ON public.security_events
FOR SELECT
TO service_role
USING (true);

-- Block all access for anon role
CREATE POLICY "deny_anon_security_events"
ON public.security_events
FOR ALL
TO anon
USING (false);

-- ============================================
-- Harden users table access control
-- ============================================

-- Block all access for anon role to users table
DROP POLICY IF EXISTS "Block anonymous access to users" ON public.users;
CREATE POLICY "deny_anon_users"
ON public.users
FOR ALL
TO anon
USING (false);

-- Ensure authenticated users can ONLY see their own data
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
CREATE POLICY "Users can view own profile"
ON public.users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- ============================================
-- Audit other sensitive tables
-- ============================================

-- Block anonymous access to tokens table
DROP POLICY IF EXISTS "Block anonymous access to tokens" ON public.tokens;
CREATE POLICY "deny_anon_tokens"
ON public.tokens
FOR ALL
TO anon
USING (false);

-- Block anonymous access to connections table
DROP POLICY IF EXISTS "Block anonymous access to connections" ON public.connections;
CREATE POLICY "deny_anon_connections"
ON public.connections
FOR ALL
TO anon
USING (false);

-- Block anonymous access to suggestions table
DROP POLICY IF EXISTS "Block anonymous access to suggestions" ON public.suggestions;
CREATE POLICY "deny_anon_suggestions"
ON public.suggestions
FOR ALL
TO anon
USING (false);

-- Block anonymous access to oauth_states table
DROP POLICY IF EXISTS "Block anonymous access to oauth_states" ON public.oauth_states;
CREATE POLICY "deny_anon_oauth_states"
ON public.oauth_states
FOR ALL
TO anon
USING (false);

-- Block anonymous access to metrics table
CREATE POLICY "deny_anon_metrics"
ON public.metrics
FOR ALL
TO anon
USING (false);

-- Block anonymous access to consents table
CREATE POLICY "deny_anon_consents"
ON public.consents
FOR ALL
TO anon
USING (false);

-- Block anonymous access to rate_limits table
CREATE POLICY "deny_anon_rate_limits"
ON public.rate_limits
FOR ALL
TO anon
USING (false);