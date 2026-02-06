import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Users, Heart, Eye, Video, ExternalLink, Music2,
  CheckCircle2, Link as LinkIcon, AlertTriangle, Loader2,
  ChevronDown, MessageCircle, Share2, Clock
} from "lucide-react";
import { useTikTokData, type TikTokVideo, type TikTokScopeInfo } from "@/hooks/useTikTokData";
import { formatDistanceToNow } from "date-fns";
import { sv } from "date-fns/locale";

const ScopeMissing = ({ scope }: { scope: string }) => (
  <div className="flex items-center gap-2 text-xs text-amber-400/80 bg-amber-500/10 rounded-lg px-3 py-1.5">
    <AlertTriangle className="w-3 h-3 shrink-0" />
    <span>Behöver tillstånd: <code className="font-mono text-amber-300">{scope}</code></span>
  </div>
);

const StatCard = ({ label, value, icon: Icon }: { label: string; value: string | number; icon: any }) => (
  <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10 text-center">
    <Icon className="w-5 h-5 mx-auto mb-2 text-white/60" />
    <p className="text-2xl font-bold dashboard-heading-dark">{typeof value === 'number' ? value.toLocaleString('sv-SE') : value}</p>
    <p className="text-xs dashboard-subheading-dark mt-1">{label}</p>
  </div>
);

const VideoCard = ({ video }: { video: TikTokVideo }) => {
  const timeAgo = video.created_at
    ? formatDistanceToNow(new Date(video.created_at), { addSuffix: true, locale: sv })
    : null;

  return (
    <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
      {video.cover_image_url ? (
        <img
          src={video.cover_image_url}
          alt={video.title}
          className="w-20 h-28 rounded-lg object-cover shrink-0 bg-white/10"
          loading="lazy"
        />
      ) : (
        <div className="w-20 h-28 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
          <Video className="w-6 h-6 text-white/30" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm dashboard-heading-dark line-clamp-2 mb-1">{video.title}</p>
        {timeAgo && <p className="text-xs dashboard-subheading-dark mb-2 flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo}</p>}
        <div className="flex flex-wrap gap-3 text-xs dashboard-subheading-dark">
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{video.views.toLocaleString('sv-SE')}</span>
          <span className="flex items-center gap-1"><Heart className="w-3 h-3" />{video.likes.toLocaleString('sv-SE')}</span>
          <span className="flex items-center gap-1"><MessageCircle className="w-3 h-3" />{video.comments.toLocaleString('sv-SE')}</span>
          <span className="flex items-center gap-1"><Share2 className="w-3 h-3" />{video.shares.toLocaleString('sv-SE')}</span>
        </div>
        {video.share_url && (
          <a href={video.share_url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-2">
            <ExternalLink className="w-3 h-3" /> Öppna på TikTok
          </a>
        )}
      </div>
    </div>
  );
};

const DebugPanel = ({ scopeInfo, user, stats }: { scopeInfo: TikTokScopeInfo | null; user: any; stats: any }) => {
  if (import.meta.env.PROD) return null;

  return (
    <Card className="liquid-glass-light border-amber-500/30">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-mono dashboard-heading-dark flex items-center gap-2">
          🔧 Diagnostik (dev)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs font-mono">
        <div>
          <p className="text-amber-400 mb-1">Begärda scopes:</p>
          <p className="text-white/70">{scopeInfo?.requested_scopes?.join(', ') || 'Okänt'}</p>
        </div>
        <div>
          <p className="text-green-400 mb-1">Beviljade scopes:</p>
          <p className="text-white/70">{scopeInfo?.granted_scopes?.join(', ') || 'Okänt'}</p>
        </div>
        {scopeInfo?.missing_scopes && scopeInfo.missing_scopes.length > 0 && (
          <div>
            <p className="text-red-400 mb-1">Saknade scopes:</p>
            <p className="text-white/70">{scopeInfo.missing_scopes.join(', ')}</p>
          </div>
        )}
        <div>
          <p className="text-blue-400 mb-1">User Info (sanerad):</p>
          <pre className="text-white/50 whitespace-pre-wrap break-all max-h-32 overflow-auto">
            {JSON.stringify({ display_name: user?.display_name, open_id: user?.open_id, is_verified: user?.is_verified, follower_count: user?.follower_count }, null, 2)}
          </pre>
        </div>
        <div>
          <p className="text-blue-400 mb-1">Stats:</p>
          <pre className="text-white/50 whitespace-pre-wrap break-all max-h-32 overflow-auto">
            {JSON.stringify(stats, null, 2)}
          </pre>
        </div>
      </CardContent>
    </Card>
  );
};

const TikTokProfileSection = () => {
  const {
    user, stats, videos, pagination, scopeInfo,
    loading, loadingMore, error, limited_access, scope_message,
    refetch, loadMoreVideos
  } = useTikTokData();

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="liquid-glass-light border-destructive/30">
        <CardContent className="p-6 text-center">
          <AlertTriangle className="w-10 h-10 mx-auto mb-3 text-destructive" />
          <p className="dashboard-heading-dark mb-2">Kunde inte ladda TikTok-data</p>
          <p className="text-sm dashboard-subheading-dark mb-4">{error.message}</p>
          <Button variant="outline" size="sm" onClick={refetch}>Försök igen</Button>
        </CardContent>
      </Card>
    );
  }

  if (!user) return null;

  const missingScopes = scopeInfo?.missing_scopes || [];
  const hasProfileScope = !missingScopes.includes('user.info.profile');
  const hasStatsScope = !missingScopes.includes('user.info.stats');
  const hasVideoScope = !missingScopes.includes('video.list');

  return (
    <div className="space-y-6">
      {/* Profile Card */}
      <Card className="liquid-glass-light">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Avatar className="w-16 h-16 border-2 border-white/20">
              <AvatarImage src={user.avatar_url} alt={user.display_name} />
              <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-white text-xl">
                {user.display_name?.charAt(0) || '?'}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-bold dashboard-heading-dark">{user.display_name}</h2>
                {user.is_verified && (
                  <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Verifierad
                  </Badge>
                )}
              </div>
              {user.open_id && (
                <p className="text-xs dashboard-subheading-dark font-mono mt-0.5">ID: {user.open_id}</p>
              )}
              
              {/* Bio */}
              {hasProfileScope ? (
                user.bio_description ? (
                  <p className="text-sm dashboard-subheading-dark mt-2 line-clamp-3">{user.bio_description}</p>
                ) : (
                  <p className="text-sm dashboard-subheading-dark mt-2 italic">Ingen bio</p>
                )
              ) : (
                <div className="mt-2"><ScopeMissing scope="user.info.profile" /></div>
              )}

              {/* Links */}
              <div className="flex flex-wrap gap-2 mt-3">
                {hasProfileScope ? (
                  <>
                    {user.profile_web_link && (
                      <a href={user.profile_web_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline bg-white/5 rounded-full px-3 py-1">
                        <LinkIcon className="w-3 h-3" /> Profil (webb)
                      </a>
                    )}
                    {user.profile_deep_link && (
                      <a href={user.profile_deep_link}
                        className="inline-flex items-center gap-1 text-xs text-primary hover:underline bg-white/5 rounded-full px-3 py-1">
                        <Music2 className="w-3 h-3" /> Öppna i TikTok
                      </a>
                    )}
                    {!user.profile_web_link && !user.profile_deep_link && (
                      <p className="text-xs dashboard-subheading-dark italic">Inga profillänkar tillgängliga</p>
                    )}
                  </>
                ) : (
                  <ScopeMissing scope="user.info.profile" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      {hasStatsScope ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Följare" value={user.follower_count || 0} icon={Users} />
          <StatCard label="Följer" value={user.following_count || 0} icon={Users} />
          <StatCard label="Totala likes" value={user.likes_count || 0} icon={Heart} />
          <StatCard label="Antal videor" value={user.video_count || 0} icon={Video} />
        </div>
      ) : (
        <ScopeMissing scope="user.info.stats" />
      )}

      {/* Video engagement stats from video.list */}
      {hasVideoScope && stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard label="Video-visningar" value={stats.totalViews} icon={Eye} />
          <StatCard label="Video-likes" value={stats.totalLikes} icon={Heart} />
          <StatCard label="Kommentarer" value={stats.totalComments} icon={MessageCircle} />
          <StatCard label="Engagemang" value={stats.avgEngagementRate} icon={Share2} />
        </div>
      )}

      {/* Limited access warning */}
      {limited_access && scope_message && (
        <Card className="liquid-glass-light border-amber-500/30">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium dashboard-heading-dark">Begränsad åtkomst</p>
              <p className="text-xs dashboard-subheading-dark mt-1">{scope_message}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Video List */}
      <Card className="liquid-glass-light">
        <CardHeader>
          <CardTitle className="dashboard-heading-dark flex items-center gap-2">
            <Video className="w-5 h-5" /> Videor
            {videos.length > 0 && (
              <Badge variant="secondary" className="ml-2 text-xs">{videos.length}</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {hasVideoScope ? (
            videos.length > 0 ? (
              <div className="space-y-3">
                {videos.map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
                {pagination?.has_more && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadMoreVideos}
                      disabled={loadingMore}
                    >
                      {loadingMore ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <ChevronDown className="w-4 h-4 mr-2" />
                      )}
                      Ladda fler videor
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Video className="w-10 h-10 mx-auto mb-2 text-white/30" />
                <p className="text-sm dashboard-subheading-dark">Inga publika videor hittades</p>
              </div>
            )
          ) : (
            <div className="text-center py-6">
              <ScopeMissing scope="video.list" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Debug Panel (dev only) */}
      <DebugPanel scopeInfo={scopeInfo} user={user} stats={stats} />
    </div>
  );
};

export default TikTokProfileSection;
