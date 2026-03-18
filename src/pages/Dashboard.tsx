import React, { useState, useEffect } from "react";
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
  primary: { bg: "bg-primary/15", text: "text-primary", border: "border-primary/50" },
  amber: { bg: "bg-amber-500/15", text: "text-amber-400", border: "border-amber-500/50" },
  teal: { bg: "bg-emerald-500/15", text: "text-emerald-400", border: "border-emerald-500/50" },
  violet: { bg: "bg-violet-500/15", text: "text-violet-400", border: "border-violet-500/50" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const { isConnected, connections } = useConnections();
  const tiktokData = useTikTokData();
  const metaData = useMetaData();
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
      <div className="space-y-6 max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border/40">
          <div>
            <h1 className="text-xl font-semibold text-foreground">Välkommen tillbaka, {firstName}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Här är en snabb överblick av dina konton.</p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link to="/analytics">Se statistik <ArrowRight className="w-3.5 h-3.5 ml-1.5" /></Link>
          </Button>
        </div>

        {/* Platform Tabs — pill style */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {platformTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activePlatform === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActivePlatform(tab.key)}
                className={`flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium rounded-full transition-all ${
                  isActive
                    ? "bg-primary/15 text-primary border border-primary/30"
                    : "text-muted-foreground hover:bg-muted border border-transparent"
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Stat Cards — bolder */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {activeStatCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className={`rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 border-l-2 ${stat.color.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[10px] font-semibold tracking-widest text-muted-foreground">{stat.label}</p>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.color.bg}`}>
                    <Icon className={`w-3.5 h-3.5 ${stat.color.text}`} />
                  </div>
                </div>
                <p className="text-3xl font-bold text-foreground tracking-tight leading-none">{stat.value}</p>
                <p className="text-[11px] text-muted-foreground mt-1.5">{stat.sub}</p>
              </div>
            );
          })}
        </div>

        {/* Main content: left + right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Left column (2/3) */}
          <div className="lg:col-span-2 space-y-5">

            {/* Follower Growth Area Chart */}
            {anyConnected && followerHistory.length >= 2 && (
              <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Följartillväxt</h2>
                  <Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Se alla <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={followerHistory}>
                      <defs>
                        <linearGradient id="followerGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
                      <XAxis
                        dataKey="date"
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
                        cursor={{ stroke: "hsl(var(--primary))", strokeWidth: 1, strokeDasharray: "3 3" }}
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="rounded-lg bg-popover border border-border p-2.5 shadow-md text-xs">
                              <p className="text-muted-foreground mb-0.5">{payload[0]?.payload?.date}</p>
                              <p className="font-semibold text-foreground">{formatNumber(payload[0]?.value as number)} följare</p>
                            </div>
                          );
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="followers"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        fill="url(#followerGradient)"
                        dot={false}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* Video performance chart */}
            {showTikTokContent && videoChartData.length > 0 && (
              <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Videoprestation</h2>
                  <Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Se alla <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="h-52">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={videoChartData} barGap={3} barSize={16}>
                      <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={1} />
                          <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        </linearGradient>
                        <linearGradient id="barGradientAmber" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(38 80% 50%)" stopOpacity={1} />
                          <stop offset="100%" stopColor="hsl(38 80% 50%)" stopOpacity={0.3} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid vertical={false} stroke="hsl(var(--border))" strokeOpacity={0.4} />
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
                                  {p.name}: <span className="text-foreground font-semibold">{formatNumber(p.value as number)}</span>
                                </p>
                              ))}
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="Visningar" fill="url(#barGradient)" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="Likes" fill="url(#barGradientAmber)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5 bg-primary/10 rounded-full px-2.5 py-1">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[11px] font-medium text-primary">Visningar</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 rounded-full px-2.5 py-1">
                    <div className="w-2 h-2 rounded-full bg-amber-400" />
                    <span className="text-[11px] font-medium text-amber-400">Likes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Top videos table */}
            {showTikTokContent && tiktokData.videos?.length > 0 && (
              <div className="rounded-2xl bg-card border border-border/40 shadow-sm overflow-hidden">
                <div className="px-5 py-4 flex items-center justify-between border-b border-border/40">
                  <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Senaste videor</h2>
                  <Link to="/analytics" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                    Se alla <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="divide-y divide-border/40">
                  {tiktokData.videos.slice(0, 5).map((video, i) => (
                    <div key={video.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-muted/20 transition-colors group">
                      {/* Rank badge */}
                      <div className="w-5 shrink-0 text-center">
                        <span className={`text-xs font-bold ${i === 0 ? "text-amber-400" : i === 1 ? "text-slate-400" : i === 2 ? "text-orange-600" : "text-muted-foreground/40"}`}>
                          {i + 1}
                        </span>
                      </div>
                      {/* Thumbnail placeholder */}
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-border/40 flex items-center justify-center shrink-0">
                        <Play className="w-3.5 h-3.5 text-primary/60" />
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
                  { title: "Statistik", desc: "Se dina siffror", href: "/analytics", icon: BarChart3, color: STAT_COLORS.primary },
                  { title: "AI-Chat", desc: "Prata med AI", href: "/ai/chat", icon: MessageSquare, color: STAT_COLORS.teal },
                  { title: "Kalender", desc: "Planera innehåll", href: "/calendar", icon: Calendar, color: STAT_COLORS.amber },
                ].map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link key={link.title} to={link.href}>
                      <div className={`flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border/40 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 h-full border-l-2 ${link.color.border}`}>
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${link.color.bg}`}>
                          <Icon className={`w-4 h-4 ${link.color.text}`} />
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

            {/* Not connected states */}
            {activePlatform === "tiktok" && !isConnected("tiktok") && (
              <div className="rounded-2xl bg-card border border-border/40 p-8 text-center">
                <p className="text-sm text-muted-foreground">Anslut ditt TikTok-konto för att se data här.</p>
                <Button variant="outline" size="sm" className="mt-3" asChild>
                  <Link to="/account?tab=app">Anslut konto</Link>
                </Button>
              </div>
            )}
            {activePlatform === "meta_ig" && !isConnected("meta_ig") && (
              <div className="rounded-2xl bg-card border border-border/40 p-8 text-center">
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
            <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Senaste aktivitet</h2>
              </div>
              {recentActivity.length === 0 ? (
                <p className="text-xs text-muted-foreground py-3 text-center">Ingen aktivitet ännu.</p>
              ) : (
                <div className="space-y-2">
                  {recentActivity.map((activity, i) => {
                    const Icon = activity.icon;
                    const initials = activity.label.slice(0, 2).toUpperCase();
                    return (
                      <div
                        key={i}
                        className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors"
                      >
                        <div className="w-7 h-7 rounded-full flex items-center justify-center bg-primary/15 shrink-0 mt-0.5">
                          <Icon className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-foreground leading-none mb-0.5">{activity.label}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{activity.detail}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground/50 shrink-0 mt-0.5">
                          {formatDistanceToNow(new Date(activity.time), { addSuffix: false, locale: sv })}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Upcoming Posts */}
            <div className="rounded-2xl bg-card border border-border/40 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Kommande inlägg</h2>
                <Link to="/calendar" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors">
                  Se alla <ChevronRight className="w-3 h-3" />
                </Link>
              </div>
              {upcomingPosts.length === 0 ? (
                <div className="py-4 text-center">
                  <p className="text-xs text-muted-foreground">Inga inlägg planerade.</p>
                  <Button variant="ghost" size="sm" className="mt-2 text-xs" asChild>
                    <Link to="/calendar">Planera ett inlägg</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  {upcomingPosts.map((post, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl border border-border/30 hover:bg-muted/20 transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex flex-col items-center justify-center shrink-0">
                        <span className="text-xs font-bold text-primary leading-none">
                          {format(new Date(post.date), "d", { locale: sv })}
                        </span>
                        <span className="text-[9px] text-primary/70 leading-none uppercase mt-0.5">
                          {format(new Date(post.date), "MMM", { locale: sv })}
                        </span>
                      </div>
                      <p className="text-xs text-foreground truncate flex-1 font-medium">{post.title}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Upgrade Banner */}
            {credits && (credits.plan === "free_trial" || credits.plan === "starter") && (
              <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 p-4">
                <p className="text-sm font-semibold text-foreground">Uppgradera din plan</p>
                <p className="text-xs text-muted-foreground mt-0.5 mb-3">Fler krediter och avancerad analys</p>
                <Button size="sm" className="w-full" asChild>
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
