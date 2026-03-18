-- Add missing logo_url column to organizations table
ALTER TABLE public.organizations
ADD COLUMN IF NOT EXISTS logo_url TEXT;
