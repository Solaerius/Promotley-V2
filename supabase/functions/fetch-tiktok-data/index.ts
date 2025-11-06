import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.58.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Decrypt token using Web Crypto API
async function decryptToken(encryptedToken: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedToken), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const encryptedData = combined.slice(12);
  
  const decryptedData = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv },
    key,
    encryptedData
  );
  
  const decoder = new TextDecoder();
  return decoder.decode(decryptedData);
}

async function getEncryptionKey(): Promise<CryptoKey> {
  const secret = Deno.env.get('META_APP_SECRET') || 'fallback-key-for-dev';
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secret.padEnd(32, '0').slice(0, 32));
  
  return await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user ID from JWT
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing authorization header');
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    console.log('Fetching TikTok data for user:', user.id);

    // Get token from database
    const { data: tokenData, error: tokenError } = await supabase
      .from('tokens')
      .select('*')
      .eq('user_id', user.id)
      .eq('provider', 'tiktok')
      .single();

    if (tokenError || !tokenData) {
      throw new Error('TikTok connection not found');
    }

    // Check if token is expired or expires soon
    const expiresAt = new Date(tokenData.expires_at);
    const now = new Date();
    if (expiresAt <= now) {
      throw new Error('Token expired, please refresh');
    }

    // Decrypt access token
    const encryptionKey = await getEncryptionKey();
    const accessToken = await decryptToken(tokenData.access_token_enc, encryptionKey);

    // Fetch user info
    const userInfoResponse = await fetch(
      'https://open.tiktokapis.com/v2/user/info/?fields=open_id,union_id,avatar_url,display_name,bio_description,profile_deep_link,follower_count,following_count,likes_count,video_count',
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      }
    );

    const userInfoText = await userInfoResponse.text();
    console.log('TikTok user info response:', userInfoText);

    if (!userInfoResponse.ok) {
      throw new Error(`Failed to fetch user info: ${userInfoText}`);
    }

    const userInfo = JSON.parse(userInfoText);

    if (userInfo.error && userInfo.error.code !== 'ok') {
      throw new Error(`TikTok API error: ${userInfo.error.message}`);
    }

    // Fetch video list (last 20 videos)
    const videoListResponse = await fetch(
      'https://open.tiktokapis.com/v2/video/list/?fields=id,create_time,cover_image_url,share_url,video_description,duration,height,width,title,embed_html,embed_link,like_count,comment_count,share_count,view_count',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          max_count: 20,
        }),
      }
    );

    const videoListText = await videoListResponse.text();
    console.log('TikTok video list response status:', videoListResponse.status);

    let videos = [];
    if (videoListResponse.ok) {
      const videoListData = JSON.parse(videoListText);
      if (videoListData.data && videoListData.data.videos) {
        videos = videoListData.data.videos;
      }
    } else {
      console.warn('Could not fetch videos:', videoListText);
    }

    // Calculate aggregate stats from videos
    let totalViews = 0;
    let totalLikes = 0;
    let totalShares = 0;
    let totalComments = 0;

    videos.forEach((video: any) => {
      totalViews += video.view_count || 0;
      totalLikes += video.like_count || 0;
      totalShares += video.share_count || 0;
      totalComments += video.comment_count || 0;
    });

    const avgEngagementRate = videos.length > 0 
      ? ((totalLikes + totalComments + totalShares) / totalViews * 100).toFixed(2)
      : '0';

    const response = {
      user: userInfo.data?.user || userInfo.user,
      videos: videos,
      stats: {
        totalViews,
        totalLikes,
        totalShares,
        totalComments,
        avgEngagementRate,
        videoCount: videos.length,
      },
    };

    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error fetching TikTok data:', error);
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
