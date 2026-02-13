
-- Create sales_radar_results table
CREATE TABLE public.sales_radar_results (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  organization_id UUID REFERENCES public.organizations(id),
  radar_type TEXT NOT NULL DEFAULT 'full', -- 'full', 'leads', 'trends'
  leads JSONB DEFAULT '[]'::jsonb,
  trends JSONB DEFAULT '[]'::jsonb,
  input_context JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sales_radar_results ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view own radar results"
ON public.sales_radar_results
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own radar results"
ON public.sales_radar_results
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Index for fast lookups
CREATE INDEX idx_sales_radar_user_created ON public.sales_radar_results (user_id, created_at DESC);
