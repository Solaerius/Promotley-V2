import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import {
  TrendingUp, Users, Calendar, Zap, BarChart3,
  MessageSquare, CheckCircle2, Sparkles, ChevronRight,
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
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  AreaChart, Area,
} from "recharts";

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
const formatNumber = (num: number): string => {
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + "M";
  if (num >= 1_000) return (num / 1_000).toFixed(1) + "k";
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

// ─────────────────────────────────────────────
// PlatformCard sub-component
// ─────────────────────────────────────────────
const PlatformCard = ({
  title,
  icon,
  iconBg,
  isConnected: connected,
  isLoading,
  accentColor,
  metrics,
}: {
  title: string;
  icon: React.ReactNode;
  iconBg: string;
  isConnected: boolean;
  isLoading: boolean;
  accentColor: string;
  metrics: { label: string; value: string | number }[];
}) => {
  const { t } = useTranslation();
  return (
  <div
    className="rounded-2xl overflow-hidden bg-card"
    style={{
      border: "1px solid hsl(0 0% 100% / 0.06)",
    }}
  >
    {/* Header */}
    <div
      className="flex items-center gap-3 px-5 py-3.5 border-b"
      style={{ borderColor: "hsl(0 0% 100% / 0.05)" }}
    >
      <div
        className="w-7 h-7 rounded-lg flex items-center justify-center"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <span className="text-sm font-semibold" style={{ color: "hsl(0 0% 88%)" }}>
        {title}
      </span>
      <div className="ml-auto">
        {connected ? (
          <span className="flex items-center gap-1.5 text-xs" style={{ color: "hsl(142 55% 55%)" }}>
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "hsl(142 55% 55%)" }}
            />
            {t('dashboard.connected')}
          </span>
        ) : (
          <span className="text-xs" style={{ color: "hsl(0 0% 32%)" }}>
            {t('dashboard.not_connected')}
          </span>
        )}
      </div>
    </div>

    {/* Body */}
    <div className="p-5">
      {!connected ? (
        <div className="flex flex-col items-center justify-center py-5 text-center">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center mb-3"
            style={{
              background: "hsl(0 0% 100% / 0.04)",
              border: "1px solid hsl(0 0% 100% / 0.07)",
            }}
          >
            <div style={{ color: "hsl(0 0% 28%)" }}>{icon}</div>
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: "hsl(0 0% 52%)" }}>
            Inget {title}-konto anslutet
          </p>
          <p className="text-xs mb-4" style={{ color: "hsl(0 0% 33%)" }}>
            Anslut för att se din statistik här
          </p>
          <Link to="/account">
            <Button size="sm" variant="outline" className="h-7 text-xs">
              {t('dashboard.connect_account')}
            </Button>
          </Link>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-2 gap-2.5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-xl p-3 animate-pulse"
              style={{ background: "hsl(var(--card))" }}
            >
              <div className="h-2.5 rounded w-14 mb-2.5" style={{ background: "hsl(0 0% 100% / 0.07)" }} />
              <div className="h-5 rounded w-10" style={{ background: "hsl(0 0% 100% / 0.07)" }} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2.5">
          {metrics.map(({ label, value }) => (
            <div
              key={label}
              className="rounded-xl p-3 bg-surface-raised"
              style={{
                border: "1px solid hsl(0 0% 100% / 0.04)",
              }}
            >
              <p className="text-xs mb-1.5" style={{ color: "hsl(0 0% 42%)" }}>
                {label}
              </p>
              <p
                className="text-base font-bold truncate"
                style={{ color: accentColor }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
  );
};

// ─────────────────────────────────────────────
// Dashboard
// ─────────────────────────────────────────────
const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { isConnected, connections, loading: connectionsLoading } = useConnections();
  const tiktokData = useTikTokData({ enabled: !connectionsLoading && isConnected("tiktok") });
  const metaData = useMetaData({ enabled: !connectionsLoading && (isConnected("meta_ig") || isConnected("meta_fb")) });
  const { credits } = useUserCredits();
  const { posts } = useCalendar();
  const [recentActivity, setRecentActivity] = useState<
    { type: string; icon: React.ElementType; label: string; detail: string; time: string }[]
  >([]);
  const [followerHistory, setFollowerHistory] = useState<{ date: string; followers: number }[]>([]);

  const upcomingPosts = posts?.filter((p) => new Date(p.date) >= new Date()).slice(0, 4) || [];

  const totalFollowers =
    (isConnected("meta_ig") && metaData.instagram?.followers_count || 0) +
    (isConnected("tiktok") && tiktokData.user?.follower_count || 0);

  const firstName =
    user?.user_metadata?.full_name?.split(" ")[0] ||
    user?.email?.split("@")[0] ||
    "där";

  useEffect(() => {
    if (!user?.id) return;
    const fetchActivity = async () => {
      const activities: { type: string; icon: React.ElementType; label: string; detail: string; time: string }[] = [];
      const { data: aiMessages } = await supabase
        .from("ai_chat_messages")
        .select("created_at, message")
        .eq("role", "user")
        .order("created_at", { ascending: false })
        .limit(3);
      if (aiMessages) {
        aiMessages.forEach((msg) => {
          activities.push({
            type: "ai",
            icon: Sparkles,
            label: "AI-förfrågan",
            detail: msg.message.substring(0, 50) + (msg.message.length > 50 ? "…" : ""),
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

  // ── Stat card definitions ──────────────────
  const statCards = [
    {
      label: "Totala följare",
      value: formatNumber(totalFollowers),
      sub: "Alla plattformar",
      icon: Users,
      accent: "hsl(var(--primary))",
      bg: "hsl(var(--primary) / 0.5)",
      border: "hsl(var(--primary) / 0.2)",
    },
    {
      label: "AI-krediter",
      value: String(credits?.credits_left ?? 0),
      sub: "Tillgängliga",
      icon: Zap,
      accent: "hsl(var(--accent-brand))",
      bg: "hsl(38 60% 13% / 0.5)",
      border: "hsl(38 60% 38% / 0.2)",
    },
    {
      label: "Kommande inlägg",
      value: String(upcomingPosts.length),
      sub: "Schemalagda",
      icon: Calendar,
      accent: "hsl(174 60% 50%)",
      bg: "hsl(174 40% 11% / 0.5)",
      border: "hsl(174 40% 32% / 0.2)",
    },
    {
      label: "Anslutna konton",
      value: String(connections.length),
      sub: "Plattformar",
      icon: TrendingUp,
      accent: "hsl(320 65% 62%)",
      bg: "hsl(320 40% 12% / 0.5)",
      border: "hsl(320 40% 34% / 0.2)",
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-5">

          {/* ── Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="flex items-start justify-between gap-4 pb-1"
          >
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(0 0% 96%)" }}>
                  {t('dashboard.greeting', { name: firstName })}
                </h1>
                <span className="text-2xl select-none" role="img" aria-label="vink">👋</span>
              </div>
              <p className="text-sm" style={{ color: "hsl(0 0% 45%)" }}>
                Din marknadsföringsöversikt —{" "}
                {format(new Date(), "EEEE d MMMM", { locale: sv })}
              </p>
            </div>
            <Link to="/ai">
              <Button
                size="sm"
                className="gap-2 h-9 shrink-0 font-medium"
                style={{
                  background: "hsl(var(--primary))",
                  color: "white",
                  border: "none",
                  boxShadow: "0 0 20px hsl(var(--primary) / 0.4)",
                }}
              >
                <Zap className="h-3.5 w-3.5" />
                AI-verktyg
              </Button>
            </Link>
          </motion.div>

          {/* ── Stat cards ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {statCards.map(({ label, value, sub, icon: Icon, accent, bg, border }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06 * i + 0.08, duration: 0.32, ease: "easeOut" }}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{ background: bg, border: `1px solid ${border}` }}
              >
                {/* Left accent bar */}
                <div
                  className="absolute left-0 top-3.5 bottom-3.5 w-0.5 rounded-r-full"
                  style={{ background: accent }}
                />
                <div className="flex items-start justify-between mb-3 pl-2.5">
                  <span
                    className="text-xs font-medium uppercase tracking-wider leading-tight"
                    style={{ color: "hsl(0 0% 45%)" }}
                  >
                    {label}
                  </span>
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: `color-mix(in srgb, ${accent} 15%, transparent)` }}
                  >
                    <Icon className="h-3.5 w-3.5" style={{ color: accent }} />
                  </div>
                </div>
                <p className="text-3xl font-bold pl-2.5 leading-none mb-1" style={{ color: accent }}>
                  {value}
                </p>
                <p className="text-xs pl-2.5" style={{ color: "hsl(0 0% 38%)" }}>
                  {sub}
                </p>
              </motion.div>
            ))}
          </div>

          {/* ── Platform row ── */}
          <div className="grid lg:grid-cols-2 gap-3">
            <PlatformCard
              title="TikTok"
              icon={<TikTokIcon className="h-4 w-4" style={{ color: "white" }} />}
              iconBg="hsl(0 0% 8%)"
              isConnected={isConnected("tiktok")}
              isLoading={tiktokData.loading}
              accentColor="hsl(0 0% 92%)"
              metrics={[
                { label: "Följare", value: formatNumber(tiktokData.user?.follower_count ?? 0) },
                { label: "Videor", value: tiktokData.user?.video_count ?? 0 },
                { label: "Gillade", value: formatNumber(tiktokData.user?.likes_count ?? 0) },
                { label: "Följer", value: tiktokData.user?.following_count ?? 0 },
              ]}
            />
            <PlatformCard
              title="Instagram"
              icon={<Instagram className="h-4 w-4" style={{ color: "hsl(330 80% 72%)" }} />}
              iconBg="hsl(330 50% 14%)"
              isConnected={isConnected("meta_ig")}
              isLoading={metaData.loading}
              accentColor="hsl(330 75% 68%)"
              metrics={[
                { label: "Följare", value: formatNumber(metaData.instagram?.followers_count ?? 0) },
                { label: "Följer", value: metaData.instagram?.follows_count ?? 0 },
                { label: "Inlägg", value: metaData.instagram?.media_count ?? 0 },
                { label: "@handle", value: `@${metaData.instagram?.username ?? "–"}` },
              ]}
            />
          </div>

          {/* ── Follower chart ── */}
          {followerHistory.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.28, duration: 0.4 }}
              className="rounded-2xl p-5 bg-card"
              style={{
                border: "1px solid hsl(0 0% 100% / 0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "hsl(var(--primary) / 0.3)" }}
                  >
                    <BarChart3 className="h-3.5 w-3.5" style={{ color: "hsl(var(--primary))" }} />
                  </div>
                  <h2 className="text-sm font-semibold" style={{ color: "hsl(0 0% 88%)" }}>
                    {t('dashboard.follower_history')}
                  </h2>
                </div>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full"
                  style={{ background: "hsl(var(--primary) / 0.2)", color: "hsl(var(--primary))" }}
                >
                  {followerHistory.length} datapunkter
                </span>
              </div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart
                  data={followerHistory}
                  margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="followerGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="2 4"
                    stroke="hsl(0 0% 100% / 0.05)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "hsl(0 0% 35%)" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(0 0% 100% / 0.1)",
                      borderRadius: 8,
                      fontSize: 12,
                      color: "hsl(0 0% 88%)",
                    }}
                    cursor={{ stroke: "hsl(var(--primary) / 0.3)", strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="followers"
                    stroke="hsl(var(--primary))"
                    fill="url(#followerGrad)"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: "hsl(var(--primary))", strokeWidth: 0 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </motion.div>
          )}

          {/* ── Posts + Activity row ── */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-3">
            {/* Upcoming posts */}
            <div
              className="rounded-2xl p-5 bg-card"
              style={{
                border: "1px solid hsl(0 0% 100% / 0.06)",
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "hsl(174 40% 13%)" }}
                  >
                    <Calendar className="h-3.5 w-3.5" style={{ color: "hsl(174 60% 52%)" }} />
                  </div>
                  <h2 className="text-sm font-semibold" style={{ color: "hsl(0 0% 88%)" }}>
                    {t('dashboard.upcoming_posts')}
                  </h2>
                </div>
                <Link
                  to="/calendar"
                  className="text-xs transition-opacity hover:opacity-70"
                  style={{ color: "hsl(var(--primary))" }}
                >
                  {t('dashboard.view_analytics')} →
                </Link>
              </div>

              {upcomingPosts.length > 0 ? (
                <div className="grid sm:grid-cols-2 gap-2.5">
                  {upcomingPosts.map((post) => (
                    <div
                      key={post.id}
                      className="rounded-xl p-3.5 bg-surface-raised"
                      style={{
                        border: "1px solid hsl(0 0% 100% / 0.05)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span
                          className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{
                            background: "hsl(174 40% 12%)",
                            color: "hsl(174 60% 55%)",
                          }}
                        >
                          {format(new Date(post.date), "d MMM", { locale: sv })}
                        </span>
                        {post.platform && (
                          <span
                            className="text-xs px-2 py-0.5 rounded-full"
                            style={{
                              background: "hsl(var(--primary) / 0.2)",
                              color: "hsl(var(--primary))",
                            }}
                          >
                            {post.platform}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm font-medium line-clamp-2 leading-snug"
                        style={{ color: "hsl(0 0% 82%)" }}
                      >
                        {post.title}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center py-8 text-center rounded-xl bg-surface-raised"
                  style={{ border: "1px solid hsl(0 0% 100% / 0.04)" }}
                >
                  <Calendar className="h-7 w-7 mb-2.5" style={{ color: "hsl(0 0% 22%)" }} />
                  <p className="text-sm font-medium mb-1" style={{ color: "hsl(0 0% 52%)" }}>
                    {t('dashboard.no_posts')}
                  </p>
                  <p className="text-xs mb-4" style={{ color: "hsl(0 0% 33%)" }}>
                    Planera ditt innehåll i kalendern
                  </p>
                  <Link to="/calendar">
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Schemalägg inlägg
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* Recent activity — timeline */}
            {recentActivity.length > 0 && (
              <div
                className="rounded-2xl p-5 bg-card"
                style={{
                  border: "1px solid hsl(0 0% 100% / 0.06)",
                }}
              >
                <div className="flex items-center gap-2.5 mb-5">
                  <div
                    className="w-6 h-6 rounded-md flex items-center justify-center"
                    style={{ background: "hsl(38 50% 13%)" }}
                  >
                    <Sparkles className="h-3.5 w-3.5" style={{ color: "hsl(var(--accent-brand))" }} />
                  </div>
                  <h2 className="text-sm font-semibold" style={{ color: "hsl(0 0% 88%)" }}>
                    {t('dashboard.recent_activity')}
                  </h2>
                </div>

                {/* Timeline */}
                <div className="relative pl-5">
                  <div
                    className="absolute left-2 top-1.5 bottom-1.5 w-px"
                    style={{ background: "hsl(0 0% 100% / 0.07)" }}
                  />
                  <div className="space-y-4">
                    {recentActivity.map((activity, i) => {
                      const Icon = activity.icon;
                      return (
                        <div key={i} className="relative flex items-start gap-3">
                          {/* Timeline dot */}
                          <div
                            className="absolute -left-5 top-1.5 w-2 h-2 rounded-full border"
                            style={{
                              background: "hsl(var(--card))",
                              borderColor: "hsl(var(--primary))",
                            }}
                          />
                          <div
                            className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                            style={{ background: "hsl(var(--primary) / 0.15)" }}
                          >
                            <Icon className="h-3 w-3" style={{ color: "hsl(var(--primary))" }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-xs font-semibold leading-tight mb-0.5"
                              style={{ color: "hsl(0 0% 82%)" }}
                            >
                              {activity.label}
                            </p>
                            <p
                              className="text-xs leading-tight truncate"
                              style={{ color: "hsl(0 0% 42%)" }}
                            >
                              {activity.detail}
                            </p>
                            <p
                              className="text-xs mt-0.5"
                              style={{ color: "hsl(0 0% 30%)" }}
                            >
                              {formatDistanceToNow(new Date(activity.time), {
                                addSuffix: true,
                                locale: sv,
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ── Quick actions ── */}
          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                label: "Skapa caption",
                desc: "AI-genererad text för ditt inlägg",
                icon: MessageSquare,
                href: "/ai/caption",
                accent: "hsl(28 88% 60%)",
                iconBg: "hsl(28 60% 13%)",
              },
              {
                label: "Hashtag-förslag",
                desc: "Hitta rätt taggar för din nisch",
                icon: CheckCircle2,
                href: "/ai/hashtags",
                accent: "hsl(210 78% 62%)",
                iconBg: "hsl(210 50% 13%)",
              },
              {
                label: "Kampanjstrategi",
                desc: "Planera din nästa kampanj med AI",
                icon: Zap,
                href: "/ai/campaign",
                accent: "hsl(var(--primary))",
                iconBg: "hsl(var(--primary) / 0.15)",
              },
            ].map(({ label, desc, icon: Icon, href, accent, iconBg }) => (
              <Link key={label} to={href}>
                <motion.div
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.15, ease: "easeOut" }}
                  className="rounded-2xl p-4 group cursor-pointer transition-all duration-200 bg-card"
                  style={{
                    border: "1px solid hsl(0 0% 100% / 0.06)",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "hsl(0 0% 100% / 0.12)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor =
                      "hsl(0 0% 100% / 0.06)";
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: iconBg }}
                    >
                      <Icon className="h-4 w-4" style={{ color: accent }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="text-sm font-semibold mb-0.5 leading-tight"
                        style={{ color: "hsl(0 0% 88%)" }}
                      >
                        {label}
                      </p>
                      <p className="text-xs leading-snug" style={{ color: "hsl(0 0% 42%)" }}>
                        {desc}
                      </p>
                    </div>
                    <ChevronRight
                      className="h-4 w-4 flex-shrink-0 transition-transform group-hover:translate-x-0.5"
                      style={{ color: "hsl(0 0% 28%)" }}
                    />
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>

    </DashboardLayout>
  );
};

export default Dashboard;
