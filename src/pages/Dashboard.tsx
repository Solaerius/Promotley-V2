import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  TrendingUp, Users, Calendar, Zap, ArrowRight, BarChart3,
  MessageSquare, CheckCircle2, Sparkles, Eye, Heart, ChevronRight, Play,
  Instagram,
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useTikTokData } from "@/hooks/useTikTokData";
import { useMetaData } from "@/hooks/useMetaData";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useCalendar } from "@/hooks/useCalendar";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from "recharts";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const getISOWeek = (dateStr: string | null, fallback: number): string => {
  if (!dateStr) return `V${fallback + 1}`;
  const date = new Date(dateStr);
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return `V${Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7)}`;
};

const STAT_COLORS = {
  primary: { bg: "bg-primary/10", border: "border-primary/20", text: "text-primary" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400" },
  teal: { bg: "bg-teal-500/10", border: "border-teal-500/20", text: "text-teal-400" },
  violet: { bg: "bg-violet-500/10", border: "border-violet-500/20", text: "text-violet-400" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, connections, loading: connectionsLoading } = useConnections();
  const tiktokData = useTikTokData({ enabled: !connectionsLoading && isConnected("tiktok") });
  const metaData = useMetaData({ enabled: !connectionsLoading && (isConnected("meta_ig") || isConnected("meta_fb")) });
  const { credits } = useUserCredits();
  const { posts } = useCalendar();
  const [recentActivity, setRecentActivity] = useState<{ type: string; icon: React.ElementType; label: string; detail: string; time: string }[]>([]);
  const [activePlatform, setActivePlatform] = useState<string>("overview");
  const [followerHistory, setFollowerHistory] = useState<{ date: string; followers: number }[]>([]);

  const upcomingPosts = posts?.filter((p) => new Date(p.date) >= new Date()).slice(0, 4) || [];

  const totalFollowers =
    (isConnected("meta_ig") && metaData.instagram?.followers_count || 0) +
    (isConnected("tiktok") && tiktokData.user?.follower_count || 0);

  useEffect(() => {
    if (!user?.id) return;
    const fetchActivity = async () => {
      const activities: { type: string; icon: React.ElementType; label: string; detail: string; time: string }[] = [];
      const { data: aiMessages } = await supabase
        .from("ai_chat_messages").select("created_at, message").eq("role", "user")
        .order("created_at", { ascending: false }).limit(3);
      if (aiMessages) {
        aiMessages.forEach((msg) => {
          activities.push({
            type: "ai", icon: Sparkles, label: "AI-förfrågan",
            detail: msg.message.substring(0, 50) + (msg.message.length > 50 ? "..." : ""),
            time: msg.created_at,
          });
        });
      }
      upcomingPosts.forEach((post) => {
        activities.push({ type: "post", icon: Calendar, label: "Planerat inlägg", detail: post.title, time: post.date });
      });
      activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
      setRecentActivity(activities.slice(0, 5));
    };
    fetchActivity();
  }, [user?.id, posts]);

  useEffect(() => {
    if (!user?.id) return;
    const fetchFollowerHistory = async () => {
      const { data } = await supabase
        .from("social_stats")
        .select("followers, updated_at, platform")
        .eq("user_id", user.id)
        .order("updated_at");
      if (data && data.length >= 2) {
        const mapped = data.map((row) => ({
          date: format(new Date(row.updated_at), "d MMM", { locale: sv }),
          followers: row.followers || 0,
        }));
        setFollowerHistory(mapped);
      }
    };
    fetchFollowerHistory();
  }, [user?.id]);

  useEffect(() => {
    if (isConnected("tiktok")) setActivePlatform("tiktok");
    else if (isConnected("meta_ig")) setActivePlatform("meta_ig");
  }, [connections]);

  const overviewStatCards = [
    { label: "FÖLJARE", value: formatNumber(totalFollowers), icon: Users, sub: "Alla plattformar", color: STAT_COLORS.primary },
    { label: "PLANERADE INLÄGG", value: upcomingPosts.length.toString(), icon: Calendar, sub: "Kommande", color: STAT_COLORS.amber },
    { label: "AI-KREDITER", value: (credits?.credits_left || 0).toString(), icon: Zap, sub: "Kvar", color: STAT_COLORS.teal },
    { label: "ANSLUTNA KONTON", value: connections.length.toString(), icon: CheckCircle2, sub: "Plattformar", color: STAT_COLORS.violet },
  ];

  const tiktokStatCards = [
    { label: "FÖLJARE", value: formatNumber(tiktokData.user?.follower_count || 0), icon: Users, sub: `${formatNumber(tiktokData.user?.following_count || 0)} följer`, color: STAT_COLORS.primary },
    { label: "TOTALA VISNINGAR", value: formatNumber(tiktokData.stats?.totalViews || 0), icon: Eye, sub: `${tiktokData.stats?.videoCount || 0} videor`, color: STAT_COLORS.amber },
    { label: "GILLA-MARKERINGAR", value: formatNumber(tiktokData.stats?.totalLikes || 0), icon: Heart, sub: `${formatNumber(tiktokData.stats?.totalComments || 0)} komm.`, color: STAT_COLORS.teal },
    { label: "ENGAGEMANGSGRAD", value: `${tiktokData.stats?.avgEngagementRate || "0%"}`, icon: TrendingUp, sub: "Genomsnitt", color: STAT_COLORS.violet },
  ];

  const instagramStatCards = [
    { label: "FÖLJARE", value: formatNumber(metaData.instagram?.followers_count || 0), icon: Users, sub: "Instagram", color: STAT_COLORS.primary },
    { label: "FÖLJER", value: formatNumber(metaData.instagram?.follows_count || 0), icon: TrendingUp, sub: "Konton", color: STAT_COLORS.amber },
    { label: "INLÄGG", value: (metaData.instagram?.media_count || 0).toString(), icon: BarChart3, sub: "Totalt", color: STAT_COLORS.teal },
    { label: "AI-KREDITER", value: (credits?.credits_left || 0).toString(), icon: Zap, sub: "Kvar", color: STAT_COLORS.violet },
  ];

  const activeStatCards =
    activePlatform === "tiktok" ? tiktokStatCards
    : activePlatform === "meta_ig" ? instagramStatCards
    : overviewStatCards;

  const videoChartData = (tiktokData.videos || []).slice(0, 7).map((v, i) => ({
    name: getISOWeek(v.created_at, i),
    Visningar: v.views,
    Likes: v.likes,
    fullTitle: v.title,
  }));

  const platformTabs = [
    { key: "overview", label: "Översikt", icon: null },
    ...(isConnected("tiktok") ? [{ key: "tiktok", label: "TikTok", icon: TikTokIcon }] : []),
    ...(isConnected("meta_ig") ? [{ key: "meta_ig", label: "Instagram", icon: Instagram }] : []),
  ];

  const firstName = user?.email?.split("@")[0] || "du";
  const showTikTokContent = (activePlatform === "tiktok" || activePlatform === "overview") && isConnected("tiktok");
  const anyConnected = isConnected("tiktok") || isConnected("meta_ig");

  return (
    <DashboardLayout>
      <div className="min-h-screen p-6 space-y-6 font-poppins" style={{ background: 'hsl(240 20% 4%)' }}>

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">
              Hej, {user?.user_metadata?.full_name?.split(" ")[0] || "där"} 👋
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Här är din marknadsföringsöversikt
            </p>
          </div>
          <Link to="/ai">
            <Button size="sm" className="gap-2">
              <Zap className="h-4 w-4" />
              AI-verktyg
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Totala följare",
              value: formatNumber(totalFollowers),
              icon: Users,
              color: STAT_COLORS.primary,
            },
            {
              label: "Tillgängliga krediter",
              value: credits?.credits_left ?? "–",
              icon: Zap,
              color: STAT_COLORS.amber,
            },
            {
              label: "Kommande inlägg",
              value: upcomingPosts.length,
              icon: Calendar,
              color: STAT_COLORS.teal,
            },
            {
              label: "Anslutna konton",
              value: connections.length,
              icon: TrendingUp,
              color: STAT_COLORS.violet,
            },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className={`rounded-xl border p-4 ${color.bg} ${color.border}`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">{label}</span>
                <Icon className={`h-4 w-4 ${color.text}`} />
              </div>
              <p className={`text-2xl font-bold ${color.text}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Platform data row */}
        <div className="grid lg:grid-cols-2 gap-4">
          {/* TikTok */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <TikTokIcon className="h-5 w-5" />
              <h2 className="font-semibold text-sm">TikTok</h2>
            </div>
            {!isConnected("tiktok") ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">Inget TikTok-konto anslutet</p>
                <Link to="/account">
                  <Button size="sm" variant="outline">Anslut konto</Button>
                </Link>
              </div>
            ) : tiktokData.loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-primary border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Följare", value: formatNumber(tiktokData.user?.follower_count ?? 0) },
                  { label: "Videor", value: tiktokData.user?.video_count ?? 0 },
                  { label: "Gillade", value: formatNumber(tiktokData.user?.likes_count ?? 0) },
                  { label: "Följer", value: tiktokData.user?.following_count ?? 0 },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-lg font-semibold mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instagram/Meta */}
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="h-5 w-5 text-pink-400" />
              <h2 className="font-semibold text-sm">Instagram</h2>
            </div>
            {!isConnected("meta_ig") ? (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground mb-3">Inget Instagram-konto anslutet</p>
                <Link to="/account">
                  <Button size="sm" variant="outline">Anslut konto</Button>
                </Link>
              </div>
            ) : metaData.loading ? (
              <div className="flex justify-center py-6">
                <div className="animate-spin h-6 w-6 rounded-full border-2 border-pink-400 border-t-transparent" />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Följare", value: formatNumber(metaData.instagram?.followers_count ?? 0) },
                  { label: "Följer", value: metaData.instagram?.follows_count ?? 0 },
                  { label: "Inlägg", value: metaData.instagram?.media_count ?? 0 },
                  { label: "@handle", value: `@${metaData.instagram?.username ?? "–"}` },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted/30 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="text-lg font-semibold mt-0.5 truncate">{value}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Follower history chart */}
        {followerHistory.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-primary" />
              Följarutveckling
            </h2>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={followerHistory}>
                <defs>
                  <linearGradient id="fg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
                <Area type="monotone" dataKey="followers" stroke="hsl(var(--primary))" fill="url(#fg)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Upcoming posts */}
        {upcomingPosts.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-teal-400" />
              Kommande inlägg
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {upcomingPosts.map(post => (
                <div key={post.id} className="bg-muted/30 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground mb-1">
                    {format(new Date(post.date), "d MMM", { locale: sv })}
                  </p>
                  <p className="text-sm font-medium line-clamp-2">{post.title}</p>
                  {post.platform && (
                    <span className="inline-block mt-2 text-xs px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                      {post.platform}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recent activity */}
        {recentActivity.length > 0 && (
          <div className="rounded-xl border border-border/50 bg-card p-5">
            <h2 className="font-semibold text-sm mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400" />
              Senaste aktivitet
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity, i) => {
                const Icon = activity.icon;
                return (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="h-3.5 w-3.5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{activity.label}</p>
                      <p className="text-xs text-muted-foreground truncate">{activity.detail}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: sv })}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { label: "Skapa caption", icon: MessageSquare, href: "/ai/caption", color: "text-orange-400" },
            { label: "Hashtag-förslag", icon: CheckCircle2, href: "/ai/hashtags", color: "text-blue-400" },
            { label: "Kampanjstrategi", icon: ArrowRight, href: "/ai/campaign", color: "text-violet-400" },
          ].map(({ label, icon: Icon, href, color }) => (
            <Link key={label} to={href}>
              <div className="rounded-xl border border-border/50 bg-card hover:bg-card/80 transition-colors p-4 flex items-center gap-3 group">
                <Icon className={`h-5 w-5 ${color}`} />
                <span className="text-sm font-medium">{label}</span>
                <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
