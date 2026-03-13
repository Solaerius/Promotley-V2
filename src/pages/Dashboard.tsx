import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  TrendingUp, Users, Calendar, Zap, ArrowRight, BarChart3,
  MessageSquare, CheckCircle2, Sparkles, Eye, Heart, ChevronRight, Play,
} from "lucide-react";
import { useConnections } from "@/hooks/useConnections";
import { useTikTokData } from "@/hooks/useTikTokData";
import { useMetaData } from "@/hooks/useMetaData";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useCalendar } from "@/hooks/useCalendar";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import TikTokIcon from "@/components/icons/TikTokIcon";
import { Instagram } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format } from "date-fns";
import { sv } from "date-fns/locale";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, connections } = useConnections();
  const tiktokData = useTikTokData();
  const metaData = useMetaData();
  const { credits } = useUserCredits();
  const { posts } = useCalendar();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [activePlatform, setActivePlatform] = useState<string>("overview");

  const upcomingPosts = posts?.filter((p) => new Date(p.date) >= new Date()).slice(0, 4) || [];

  const totalFollowers =
    (isConnected("meta_ig") && metaData.instagram?.followers_count || 0) +
    (isConnected("tiktok") && tiktokData.user?.follower_count || 0);

  useEffect(() => {
    if (!user?.id) return;
    const fetchActivity = async () => {
      const activities: any[] = [];
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
    if (isConnected("tiktok")) setActivePlatform("tiktok");
    else if (isConnected("meta_ig")) setActivePlatform("meta_ig");
  }, [connections]);

  const overviewStatCards = [
    { label: "Följare", value: formatNumber(totalFollowers), icon: Users, sub: "Alla plattformar" },
    { label: "Planerade inlägg", value: upcomingPosts.length.toString(), icon: Calendar, sub: "Kommande" },
    { label: "AI-krediter", value: (credits?.credits_left || 0).toString(), icon: Zap, sub: "Kvar" },
    { label: "Anslutna konton", value: connections.length.toString(), icon: CheckCircle2, sub: "Plattformar" },
  ];

  const tiktokStatCards = [
    { label: "Följare", value: formatNumber(tiktokData.user?.follower_count || 0), icon: Users, sub: `${formatNumber(tiktokData.user?.following_count || 0)} följer` },
    { label: "Totala visningar", value: formatNumber(tiktokData.stats?.totalViews || 0), icon: Eye, sub: `${tiktokData.stats?.videoCount || 0} videor` },
    { label: "Gilla-markeringar", value: formatNumber(tiktokData.stats?.totalLikes || 0), icon: Heart, sub: `${formatNumber(tiktokData.stats?.totalComments || 0)} komm.` },
    { label: "Engagemangsgrad", value: `${tiktokData.stats?.avgEngagementRate || "0"}%`, icon: TrendingUp, sub: "Genomsnitt" },
  ];

  const instagramStatCards = [
    { label: "Följare", value: formatNumber(metaData.instagram?.followers_count || 0), icon: Users, sub: "Instagram" },
    { label: "Följer", value: formatNumber(metaData.instagram?.follows_count || 0), icon: TrendingUp, sub: "Konton" },
    { label: "Inlägg", value: (metaData.instagram?.media_count || 0).toString(), icon: BarChart3, sub: "Totalt" },
    { label: "AI-krediter", value: (credits?.credits_left || 0).toString(), icon: Zap, sub: "Kvar" },
  ];

  const activeStatCards =
    activePlatform === "tiktok" ? tiktokStatCards
    : activePlatform === "meta_ig" ? instagramStatCards
    : overviewStatCards;

  const videoChartData = (tiktokData.videos || []).slice(0, 7).map((v, i) => ({
    name: `V${i + 1}`,
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

  return (
    <DashboardLayout>
      <div className="space-y-5 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Välkommen tillbaka, {firstName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Här är en snabb överblick av dina konton.</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/analytics">Se statistik <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
          </Button>
        </div>

        {/* Platform Tabs */}
        <div className="flex items-center gap-0.5 border-b border-border">
          {platformTabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePlatform(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                  activePlatform === tab.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {activeStatCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-xl bg-card p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-muted">
                    <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                  </div>
                </div>
                <p className="text-2xl font-bold text-foreground tracking-tight">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Main content: left + right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Video performance chart */}
            {showTikTokContent && videoChartData.length > 0 && (
              <div className="rounded-xl bg-card p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-medium text-foreground">Videoprestation</h2>
                  <Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Se alla <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={videoChartData} barGap={3} barSize={16}>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.6} />
                      <XAxis
                        dataKey="name"
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        tickFormatter={(v) => formatNumber(v)}
                        tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                        axisLine={false}
                        tickLine={false}
                        width={38}
                      />
                      <Tooltip
                        cursor={{ fill: "hsl(var(--muted))", radius: 4 }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="rounded-lg bg-popover border border-border p-2.5 shadow-md text-xs">
                              <p className="font-medium text-foreground mb-1.5 max-w-[180px] truncate">
                                {payload[0]?.payload?.fullTitle || "Video"}
                              </p>
                              {payload.map((p) => (
                                <p key={p.name} className="text-muted-foreground">
                                  {p.name}: <span className="text-foreground font-medium">{formatNumber(p.value as number)}</span>
                                </p>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="Visningar" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Likes" fill="hsl(var(--muted-foreground))" opacity={0.45} radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-primary" />
                    <span className="text-[11px] text-muted-foreground">Visningar</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-muted-foreground/45" />
                    <span className="text-[11px] text-muted-foreground">Likes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top videos table */}
            {showTikTokContent && tiktokData.videos?.length > 0 && (
              <div className="rounded-xl bg-card shadow-sm overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between border-b border-border">
                  <h2 className="text-sm font-medium text-foreground">Senaste videor</h2>
                  <Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Se alla <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-border">
                  {tiktokData.videos.slice(0, 5).map((video, i) => (
                    <div key={video.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/30 transition-colors">
                      <div className="w-6 h-6 rounded-md bg-muted flex items-center justify-center shrink-0">
                        <Play className="w-3 h-3 text-muted-foreground" />
                      </div>
                      <p className="text-sm text-foreground flex-1 truncate min-w-0">
                        {video.title || `Video ${i + 1}`}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />{formatNumber(video.views)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />{formatNumber(video.likes)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />{formatNumber(video.comments)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Overview quick links */}
            {activePlatform === "overview" && (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { title: "Statistik", desc: "Se dina siffror", href: "/analytics", icon: BarChart3 },
                  { title: "AI-Chat", desc: "Prata med AI", href: "/ai/chat", icon: MessageSquare },
                  { title: "Kalender", desc: "Planera innehåll", href: "/calendar", icon: Calendar },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.title} to={link.href}>
                      <div className="flex flex-col gap-3 p-4 rounded-xl bg-card shadow-sm hover:shadow-md transition-shadow h-full">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-muted">
                          <Icon className="w-4 h-4 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{link.title}</p>
                          <p className="text-xs text-muted-foreground">{link.desc}</p>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Not connected state */}
            {activePlatform === "tiktok" && !isConnected("tiktok") && (
              <div className="rounded-xl bg-card p-8 shadow-sm text-center">
                <p className="text-sm text-muted-foreground">Anslut ditt TikTok-konto för att se data här.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/account?tab=app">Anslut konto</Link>
                </Button>
              </div>
            )}
            {activePlatform === "meta_ig" && !isConnected("meta_ig") && (
              <div className="rounded-xl bg-card p-8 shadow-sm text-center">
                <p className="text-sm text-muted-foreground">Anslut ditt Instagram-konto för att se data här.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/account?tab=app">Anslut konto</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Right column (1/3) */}
          <div className="space-y-5">

            {/* Activity Feed */}
            <div className="rounded-xl bg-card p-5 shadow-sm">
              <h2 className="text-sm font-medium text-foreground mb-3">Senaste aktivitet</h2>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">Ingen aktivitet ännu.</p>
              ) : (
                <div className="space-y-3">
                  {recentActivity.map((activity, i) => {
                    const Icon = activity.icon;
                    return (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className="w-6 h-6 rounded-md flex items-center justify-center bg-muted shrink-0 mt-0.5">
                          <Icon className="w-3 h-3 text-muted-foreground" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{activity.label}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{activity.detail}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/60 shrink-0 mt-0.5">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: true, locale: sv })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Posts */}
            <div className="rounded-xl bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-medium text-foreground">Kommande inlägg</h2>
                <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  Se alla <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {upcomingPosts.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">Inga inlägg planerade.</p>
              ) : (
                <div className="space-y-2">
                  {upcomingPosts.map((post, i) => (
                    <div key={i} className="flex items-center gap-2.5 py-1">
                      <div className="w-9 h-9 rounded-lg bg-muted flex flex-col items-center justify-center shrink-0">
                        <span className="text-[10px] font-semibold text-muted-foreground leading-none">
                          {format(new Date(post.date), "d", { locale: sv })}
                        </span>
                        <span className="text-[9px] text-muted-foreground/70 leading-none uppercase mt-0.5">
                          {format(new Date(post.date), "MMM", { locale: sv })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground truncate flex-1">{post.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade Banner */}
            {credits && (credits.plan === "free_trial" || credits.plan === "starter") && (
              <div className="rounded-xl bg-primary/5 border border-primary/10 p-4">
                <p className="text-sm font-medium text-foreground">Uppgradera din plan</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">Fler krediter och avancerad analys</p>
                <Button variant="outline" size="sm" className="w-full" asChild>
                  <Link to="/pricing">Se planer <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
