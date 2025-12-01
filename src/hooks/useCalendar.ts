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

// Helper function for invoking Edge Functions with automatic retry on 401
async function invokeWithRetry(
  functionName: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; body?: any } = {}
): Promise<any> {
  const getFreshToken = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  };

  const attempt = async () => {
    const token = await getFreshToken();
    if (!token) {
      throw new Error('not_authenticated');
    }

    // Build invoke options - only include body for non-GET requests
    const invokeOptions: any = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };
    
    // supabase.functions.invoke uses POST by default, for GET we need to handle differently
    if (options.method === 'GET') {
      invokeOptions.method = 'GET';
    } else if (options.method === 'DELETE') {
      invokeOptions.method = 'DELETE';
    } else if (options.method === 'PUT') {
      invokeOptions.method = 'PUT';
      if (options.body) {
        invokeOptions.body = options.body;
      }
    } else {
      // POST is default
      if (options.body) {
        invokeOptions.body = options.body;
      }
    }

    const { data, error } = await supabase.functions.invoke(functionName, invokeOptions);

    if (error) {
      // Check if it's a 401 error
      if (error.message?.includes('Unauthorized') || error.message?.includes('JW') || error.message?.includes('invalid_jwt')) {
        throw { ...error, status: 401 };
      }
      throw error;
    }

    return data;
  };

  try {
    return await attempt();
  } catch (err: any) {
    // Retry once on 401 after refreshing session
    if (err.status === 401 || err.message === 'not_authenticated') {
      await supabase.auth.getSession(); // Silent refresh
      return await attempt();
    }
    throw err;
  }
}

export const useCalendar = () => {
  const [posts, setPosts] = useState<CalendarPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await invokeWithRetry('calendar', { method: 'GET' });
      setPosts(result || []);
    } catch (err: any) {
      if (err.message === 'not_authenticated') {
        setPosts([]);
      } else {
        setError(err as Error);
        console.error('Error fetching calendar posts:', err);
        setPosts([]);
      }
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
      const result = await invokeWithRetry('calendar', {
        method: 'POST',
        body: postData
      });

      toast({
        title: "Inlägg skapat",
        description: "Ditt inlägg har lagts till i kalendern.",
      });

      await fetchPosts();
      return result;
    } catch (err: any) {
      console.error('Error creating post:', err);
      const errorMsg = err.message || "Kunde inte skapa inlägg.";
      toast({
        title: "Fel",
        description: errorMsg,
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
      const result = await invokeWithRetry(`calendar/update/${id}`, {
        method: 'PUT',
        body: postData
      });

      toast({
        title: "Inlägg uppdaterat",
        description: "Ditt inlägg har uppdaterats.",
      });

      await fetchPosts();
      return result;
    } catch (err: any) {
      console.error('Error updating post:', err);
      const errorMsg = err.message || "Kunde inte uppdatera inlägg.";
      toast({
        title: "Fel",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deletePost = async (id: string) => {
    try {
      await invokeWithRetry(`calendar/${id}`, {
        method: 'DELETE'
      });

      toast({
        title: "Inlägg raderat",
        description: "Ditt inlägg har tagits bort.",
      });

      await fetchPosts();
    } catch (err: any) {
      console.error('Error deleting post:', err);
      const errorMsg = err.message || "Kunde inte radera inlägg.";
      toast({
        title: "Fel",
        description: errorMsg,
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