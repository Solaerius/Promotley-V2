-- Add sponsored_until field to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS sponsored_until timestamp with time zone;

COMMENT ON COLUMN public.users.sponsored_until IS 'Admin-sponsored access until this date';

-- Add index for querying sponsored users
CREATE INDEX IF NOT EXISTS idx_users_sponsored_until 
ON public.users(sponsored_until) 
WHERE sponsored_until IS NOT NULL;