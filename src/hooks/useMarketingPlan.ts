import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface MarketingPost {
  date: string;
  channel: 'instagram' | 'tiktok' | 'facebook';
  title: string;
  content: string;
  tags: string[];
  assets: string[];
  status: 'scheduled' | 'draft' | 'published';
}

export interface MarketingPlan {
  timeframe: {
    start: string;
    end: string;
  };
  goals: string[];
  budgetHints: string[];
  posts: MarketingPost[];
}

// Helper function for invoking Edge Functions with automatic retry on 401
async function invokeWithRetry(
  functionName: string,
  options: { method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'; body?: any } = {}
): Promise<any> {
  const attempt = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.access_token) {
      throw new Error('not_authenticated');
    }

    const { data, error } = await supabase.functions.invoke(functionName, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (error) {
      // Check if it's a 401 error
      if (error.message?.includes('Unauthorized') || error.message?.includes('JW')) {
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

export const useMarketingPlan = () => {
  const [activePlan, setActivePlan] = useState<MarketingPlan | null>(null);
  const [isImplementing, setIsImplementing] = useState(false);
  const { toast } = useToast();

  const createPlan = async (targets: string[], timeframe: string) => {
    try {
      // Fetch calendar context
      const contextData = await invokeWithRetry('calendar/context', { method: 'GET' });

      const result = await invokeWithRetry('ai-assistant/create-marketing-plan', {
        method: 'POST',
        body: {
          targets,
          timeframe,
          calendarContextDigest: contextData?.digest || []
        }
      });

      if (result.plan) {
        setActivePlan(result.plan);
        return result.plan;
      }

      return null;
    } catch (err: any) {
      console.error('Error creating marketing plan:', err);
      const errorMsg = err.message || "Kunde inte skapa marknadsföringsplan.";
      toast({
        title: "Fel",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    }
  };

  const implementPlan = async (plan: MarketingPlan, requestId: string) => {
    try {
      setIsImplementing(true);

      const result = await invokeWithRetry('calendar/bulk_create', {
        method: 'POST',
        body: {
          posts: plan.posts,
          requestId
        }
      });

      toast({
        title: "Plan implementerad!",
        description: `${result.created?.length || 0} inlägg skapade, ${result.skipped?.length || 0} hoppades över.`,
      });

      return result;
    } catch (err: any) {
      console.error('Error implementing plan:', err);
      const errorMsg = err.message || "Kunde inte implementera plan.";
      toast({
        title: "Fel",
        description: errorMsg,
        variant: "destructive",
      });
      throw err;
    } finally {
      setIsImplementing(false);
    }
  };

  return {
    activePlan,
    isImplementing,
    createPlan,
    implementPlan,
    setActivePlan,
  };
};
