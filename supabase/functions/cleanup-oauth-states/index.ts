import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting OAuth state cleanup...');

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Call the cleanup function
    const { data, error } = await supabaseAdmin.rpc('cleanup_expired_oauth_states');

    if (error) {
      console.error('Error cleaning up OAuth states:', error);
      throw error;
    }

    console.log('OAuth state cleanup completed successfully');

    // Log the security event
    await supabaseAdmin.rpc('log_security_event', {
      _user_id: null,
      _event_type: 'oauth_cleanup',
      _event_details: {
        timestamp: new Date().toISOString(),
        status: 'success'
      }
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: 'OAuth states cleaned up successfully',
        timestamp: new Date().toISOString()
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  } catch (error) {
    console.error('OAuth cleanup error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
