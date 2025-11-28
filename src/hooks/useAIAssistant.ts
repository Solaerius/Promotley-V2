import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  message: string;
  timestamp: string;
}

export const useAIAssistant = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  const fetchHistory = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        setMessages([]);
        return;
      }

      const { data: result, error } = await supabase.functions.invoke('ai-assistant/history', {
        method: 'GET'
      });

      if (error) throw error;

      setMessages(result || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching chat history:', err);
      setMessages([]);
    }
  };

  const sendMessage = async (message: string) => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      // Add user message to UI immediately
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'user',
        message,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, userMessage]);

      const { data: result, error } = await supabase.functions.invoke('ai-assistant/chat', {
        method: 'POST',
        body: { message, history: messages }
      });

      if (error) throw error;

      // Add AI response to UI
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        message: result.response,
        timestamp: new Date().toISOString(),
      };
      setMessages(prev => [...prev, aiMessage]);

      return result;
    } catch (err) {
      console.error('Error sending message:', err);
      toast({
        title: "Fel",
        description: "Kunde inte skicka meddelande.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const generatePlan = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: result, error } = await supabase.functions.invoke('ai-assistant/generate-plan', {
        method: 'POST'
      });

      if (error) throw error;

      if (result.placeholder) {
        toast({
          title: "Kommer snart",
          description: result.message,
        });
      }

      return result;
    } catch (err) {
      console.error('Error generating plan:', err);
      toast({
        title: "Fel",
        description: "Kunde inte generera innehållsplan.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const analyzeStats = async () => {
    try {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const { data: result, error } = await supabase.functions.invoke('ai-assistant/analyze', {
        method: 'POST'
      });

      if (error) throw error;

      if (result.placeholder) {
        toast({
          title: "Kommer snart",
          description: result.message,
        });
      }

      return result;
    } catch (err) {
      console.error('Error analyzing stats:', err);
      toast({
        title: "Fel",
        description: "Kunde inte analysera statistik.",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const hasMessages = messages.length > 0;

  return {
    messages,
    loading,
    error,
    hasMessages,
    sendMessage,
    generatePlan,
    analyzeStats,
    fetchHistory,
  };
};