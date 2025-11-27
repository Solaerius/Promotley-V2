-- Skapa ai_profiles tabell för användarens företagsprofil
CREATE TABLE IF NOT EXISTS public.ai_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  branch text,
  malgrupp text,
  produkt_beskrivning text,
  prisniva text,
  marknadsplan text,
  malsattning text,
  tonalitet text,
  sprakpreferens text DEFAULT 'svenska',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id)
);

-- Skapa social_stats tabell för sociala medier statistik
CREATE TABLE IF NOT EXISTS public.social_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  platform text NOT NULL CHECK (platform IN ('instagram', 'facebook', 'tiktok', 'pinterest')),
  impressions integer,
  reach integer,
  followers integer,
  likes integer,
  comments integer,
  shares integer,
  profile_views integer,
  top_posts jsonb,
  updated_at timestamp with time zone DEFAULT now(),
  UNIQUE(user_id, platform)
);

-- Skapa ai_analysis_history tabell för att spara tidigare analyser
CREATE TABLE IF NOT EXISTS public.ai_analysis_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  input_data jsonb,
  ai_output jsonb,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_analysis_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies för ai_profiles
CREATE POLICY "Users can view own ai_profile"
  ON public.ai_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai_profile"
  ON public.ai_profiles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ai_profile"
  ON public.ai_profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies för social_stats
CREATE POLICY "Users can view own social_stats"
  ON public.social_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social_stats"
  ON public.social_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social_stats"
  ON public.social_stats FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies för ai_analysis_history
CREATE POLICY "Users can view own ai_analysis_history"
  ON public.ai_analysis_history FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ai_analysis_history"
  ON public.ai_analysis_history FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Trigger för att uppdatera updated_at
CREATE TRIGGER update_ai_profiles_updated_at
  BEFORE UPDATE ON public.ai_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_stats_updated_at
  BEFORE UPDATE ON public.social_stats
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();