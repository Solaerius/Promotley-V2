import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { motion } from "framer-motion";
import {
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
  ArrowRight,
  Zap,
  BarChart3,
  MessageSquare,
  CheckCircle2,
} from "lucide-react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTikTokData } from "@/hooks/useTikTokData";
import { useMetaData } from "@/hooks/useMetaData";
import { useConnections } from "@/hooks/useConnections";
import { useUserCredits } from "@/hooks/useUserCredits";
import { useCalendar } from "@/hooks/useCalendar";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import TikTokIcon from "@/components/icons/TikTokIcon";
import FacebookIcon from "@/components/icons/FacebookIcon";
import { Instagram } from "lucide-react";

const formatNumber = (num: number): string => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

const Dashboard = () => {
  const { isConnected, connections } = useConnections();
  const tiktokData = useTikTokData();
  const metaData = useMetaData();
  const { credits } = useUserCredits();
  const { posts } = useCalendar();

  const totalFollowers =
    (isConnected("meta_ig") && metaData.instagram?.followers_count || 0) +
    (isConnected("tiktok") && tiktokData.user?.follower_count || 0);

  const upcomingPosts = posts?.filter((p) => new Date(p.date) >= new Date()).length || 0;

  const statsCards = [
    { title: "Veckoframsteg", value: connections.length > 0 ? "85%" : "0%", icon: TrendingUp },
    { title: "Följare", value: formatNumber(totalFollowers), icon: Users },
    { title: "Planerade inlägg", value: upcomingPosts.toString(), icon: Calendar },
    { title: "AI-krediter", value: (credits?.credits_left || 0).toString(), icon: Zap },
  ];

  const quickLinks = [
    { title: "Statistik", description: "Se dina siffror", href: "/analytics", icon: BarChart3 },
    { title: "AI-Chat", description: "Prata med AI", href: "/ai", icon: MessageSquare },
    { title: "Kalender", description: "Planera innehåll", href: "/calendar", icon: Calendar },
  ];

  // Compact connection platforms
  const platforms = [
    { key: "tiktok", label: "TikTok", icon: TikTokIcon, connected: isConnected("tiktok") },
    { key: "meta_ig", label: "Instagram", icon: Instagram, connected: isConnected("meta_ig") },
    { key: "meta_fb", label: "Facebook", icon: FacebookIcon, connected: false },
  ];

  return (
    <DashboardLayout>
      <motion.div
        className="space-y-5 max-w-5xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Compact greeting */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h1 className="text-lg font-semibold text-foreground">Välkommen tillbaka 👋</h1>
            <p className="text-sm text-muted-foreground">Här är en snabb överblick.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/analytics">
                <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                AI-analys
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild>
              <Link to="/calendar">
                <Calendar className="h-3.5 w-3.5 mr-1.5" />
                Planera
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statsCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4 transition-colors hover:bg-card"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-bold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Connections strip */}
        <div className="rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Anslutna konton</p>
          <div className="flex gap-4">
            {platforms.map((p) => {
              const Icon = p.icon;
              return (
                <Link
                  key={p.key}
                  to="/account"
                  className="relative flex flex-col items-center gap-1 group"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-colors ${
                    p.connected
                      ? "border-green-500/30 bg-green-500/10"
                      : "border-border bg-muted/50"
                  }`}>
                    <Icon className={`w-5 h-5 ${p.connected ? "text-foreground" : "text-muted-foreground"}`} />
                  </div>
                  {p.connected && (
                    <CheckCircle2 className="absolute -top-1 -right-1 w-4 h-4 text-green-500 bg-background rounded-full" />
                  )}
                  <span className="text-[10px] text-muted-foreground">{p.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link key={link.title} to={link.href}>
                <div className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-card/80 backdrop-blur-sm hover:bg-card transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{link.title}</p>
                    <p className="text-xs text-muted-foreground">{link.description}</p>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Subtle upgrade banner */}
        {credits && (credits.plan === "free_trial" || credits.plan === "starter") && (
          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-foreground">Uppgradera din plan</p>
              <p className="text-xs text-muted-foreground">Fler krediter och avancerad analys</p>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to="/pricing">
                Se planer
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
};

export default Dashboard;
