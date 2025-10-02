import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');
    const provider = url.searchParams.get('provider') || 'meta_fb';

    console.log('OAuth callback received:', { provider, hasCode: !!code, hasState: !!state });

    if (!code) {
      throw new Error('Authorization code missing');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID from state parameter
    const userId = state;
    if (!userId) {
      throw new Error('Missing user ID in state');
    }

    console.log('User ID from state:', userId);

    // Exchange code for access token based on provider
    let accessToken: string;
    let refreshToken: string | null = null;
    let expiresIn: number | null = null;
    let accountId: string;
    let username: string | null = null;

    if (provider === 'meta_fb') {
      const metaAppId = Deno.env.get('META_APP_ID');
      const metaAppSecret = Deno.env.get('META_APP_SECRET');
      const redirectUri = `${supabaseUrl}/functions/v1/oauth-callback?provider=meta_fb`;

      if (!metaAppId || !metaAppSecret) {
        throw new Error('Meta app credentials not configured');
      }

      // Exchange code for token
      const tokenResponse = await fetch(
        `https://graph.facebook.com/v18.0/oauth/access_token?` +
        `client_id=${metaAppId}&` +
        `client_secret=${metaAppSecret}&` +
        `redirect_uri=${encodeURIComponent(redirectUri)}&` +
        `code=${code}`
      );

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        console.error('Facebook token exchange failed:', error);
        throw new Error('Failed to exchange code for token');
      }

      const tokenData = await tokenResponse.json();
      accessToken = tokenData.access_token;
      expiresIn = tokenData.expires_in;

      console.log('Access token obtained, expires in:', expiresIn);

      // Get user info
      const userResponse = await fetch(
        `https://graph.facebook.com/v18.0/me?fields=id,name&access_token=${accessToken}`
      );

      if (!userResponse.ok) {
        throw new Error('Failed to get user info');
      }

      const userData = await userResponse.json();
      accountId = userData.id;
      username = userData.name;

      console.log('Facebook user info retrieved:', { accountId, username });
    } else {
      throw new Error(`Provider ${provider} not supported yet`);
    }

    // Store tokens (encrypted in production)
    const expiresAt = expiresIn 
      ? new Date(Date.now() + expiresIn * 1000).toISOString()
      : null;

    const { error: tokenError } = await supabase
      .from('tokens')
      .upsert({
        user_id: userId,
        provider: provider,
        access_token_enc: accessToken,
        refresh_token_enc: refreshToken,
        expires_at: expiresAt,
      }, {
        onConflict: 'user_id,provider'
      });

    if (tokenError) {
      console.error('Error storing token:', tokenError);
      throw tokenError;
    }

    console.log('Token stored successfully');

    // Create connection record
    const { error: connectionError } = await supabase
      .from('connections')
      .upsert({
        user_id: userId,
        provider: provider,
        account_id: accountId,
        username: username,
      }, {
        onConflict: 'user_id,provider'
      });

    if (connectionError) {
      console.error('Error creating connection:', connectionError);
      throw connectionError;
    }

    console.log('Connection created successfully');

    // Redirect back to app
    const appUrl = supabaseUrl.replace('.supabase.co', '.lovable.app');
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        'Location': `${appUrl}/dashboard?connected=${provider}`,
      },
    });

  } catch (error) {
    console.error('OAuth callback error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
