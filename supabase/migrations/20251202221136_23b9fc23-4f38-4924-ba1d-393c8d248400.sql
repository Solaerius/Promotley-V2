-- Create banned_users table for ban system
CREATE TABLE public.banned_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT NOT NULL,
  user_id UUID,
  ip_address TEXT,
  reason TEXT NOT NULL,
  banned_by UUID NOT NULL,
  banned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_permanent BOOLEAN NOT NULL DEFAULT true
);

-- Enable RLS
ALTER TABLE public.banned_users ENABLE ROW LEVEL SECURITY;

-- Only admins can manage bans
CREATE POLICY "Only admins can view bans" 
ON public.banned_users 
FOR SELECT 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can create bans" 
ON public.banned_users 
FOR INSERT 
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Only admins can delete bans" 
ON public.banned_users 
FOR DELETE 
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add profile fields to users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- Create storage bucket for profile images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for profile images
CREATE POLICY "Users can upload their own profile images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own profile images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Profile images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-images');