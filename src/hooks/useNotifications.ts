import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Notification {
  id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  // Helper to invoke Edge Functions with retry on 401
  const invokeWithRetry = async (
    functionName: string,
    options: { method?: 'GET' | 'POST'; body?: any } = {}
  ) => {
    const attempt = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('not_authenticated');
      }

      const { data, error } = await supabase.functions.invoke(functionName, {
        ...options,
        headers: { 'Content-Type': 'application/json' },
      });

      if (error) {
        if (error.message?.includes('Unauthorized') || (error as any).status === 401) {
          throw { ...error, status: 401 };
        }
        throw error;
      }

      return data;
    };

    try {
      return await attempt();
    } catch (err: any) {
      if (err.status === 401 || err.message === 'not_authenticated') {
        await supabase.auth.getSession();
        return await attempt();
      }
      throw err;
    }
  };

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const result = await invokeWithRetry('notifications', { method: 'GET' });
      setNotifications(result || []);
    } catch (err: any) {
      setError(err as Error);
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await invokeWithRetry(`notifications/read/${id}`, {
        method: 'POST',
      });

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err: any) {
      console.error('Error marking notification as read:', err);
      const errorMsg = err.message || 'Kunde inte markera notis som läst.';
      toast({
        title: "Fel",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const hasNotifications = notifications.length > 0;
  const unreadCount = notifications.filter(n => !n.read).length;

  return {
    notifications,
    loading,
    error,
    hasNotifications,
    unreadCount,
    fetchNotifications,
    markAsRead,
  };
};