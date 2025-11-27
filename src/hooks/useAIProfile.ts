import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIProfile {
  id?: string;
  user_id?: string;
  branch?: string;
  malgrupp?: string;
  produkt_beskrivning?: string;
  prisniva?: string;
  marknadsplan?: string;
  malsattning?: string;
  tonalitet?: string;
  sprakpreferens?: string;
  created_at?: string;
  updated_at?: string;
}

export const useAIProfile = () => {
  const [profile, setProfile] = useState<AIProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        setProfile(null);
        return;
      }

      const { data, error } = await supabase
        .from('ai_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      setProfile(data || null);
    } catch (error) {
      console.error('Error fetching AI profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<AIProfile>) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('ai_profiles')
        .upsert({
          user_id: user.id,
          ...updates,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        })
        .select()
        .single();

      if (error) throw error;

      setProfile(data);
      toast({
        title: 'Profil uppdaterad',
        description: 'Din AI-profil har sparats.',
      });

      return data;
    } catch (error) {
      console.error('Error updating AI profile:', error);
      toast({
        title: 'Fel',
        description: 'Kunde inte uppdatera profilen.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  return {
    profile,
    loading,
    updateProfile,
    refetch: fetchProfile,
  };
};