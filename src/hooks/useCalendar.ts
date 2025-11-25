import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface CalendarPost {
  id: string;
  title: string;
  description: string | null;
  platform: string;
  date: string;
  created_at: string;
}

export const useCalendar = () => {
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setPosts([]);
        setLoading(false);
        return;
      }

      const { data: result, error } = await supabase.functions.invoke('calendar', {
        method: 'GET'
      });

      if (error) throw error;

      // Always set data, even if empty array
      setPosts(result || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching calendar posts:', err);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async (postData: {
    title: string;
    description?: string;
    platform: string;
    date: string;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: result, error } = await supabase.functions.invoke('calendar', {
        method: 'POST',
        body: postData
      });

      if (error) throw error;

      toast({
        title: "Inlägg skapat",
        description: "Ditt inlägg har lagts till i kalendern.",
      });

      await fetchPosts();
      return result;
    } catch (err) {
      console.error('Error creating post:', err);
      toast({
        title: "Fel",
        description: "Kunde inte skapa inlägg.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updatePost = async (id: string, postData: {
    title?: string;
    description?: string;
    platform?: string;
    date?: string;
  }) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: result, error } = await supabase.functions.invoke(`calendar/update/${id}`, {
        method: 'PUT',
        body: postData
      });

      if (error) throw error;

      toast({
        title: "Inlägg uppdaterat",
        description: "Ditt inlägg har uppdaterats.",
      });

      await fetchPosts();
      return result;
    } catch (err) {
      console.error('Error updating post:', err);
      toast({
        title: "Fel",
        description: "Kunde inte uppdatera inlägg.",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke(`calendar/${id}`, {
        method: 'DELETE'
      });

      if (error) throw error;

      toast({
        title: "Inlägg raderat",
        description: "Ditt inlägg har tagits bort.",
      });

      await fetchPosts();
    } catch (err) {
      console.error('Error deleting post:', err);
      toast({
        title: "Fel",
        description: "Kunde inte radera inlägg.",
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const hasPosts = posts.length > 0;

  return {
    posts,
    loading,
    error,
    hasPosts,
    fetchPosts,
    createPost,
    updatePost,
    deletePost,
  };
};