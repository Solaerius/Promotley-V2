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

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setNotifications([]);
        setLoading(false);
        return;
      }

      const { data: result, error } = await supabase.functions.invoke('notifications', {
        method: 'GET'
      });

      if (error) throw error;

      setNotifications(result || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching notifications:', err);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { error } = await supabase.functions.invoke(`notifications/read/${id}`, {
        method: 'POST'
      });

      if (error) throw error;

      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast({
        title: "Fel",
        description: "Kunde inte markera notis som läst.",
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