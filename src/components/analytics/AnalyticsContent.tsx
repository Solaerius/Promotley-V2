import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Eye,
  Users,
  Heart,
  MessageCircle,
  Instagram,
  Music2,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useMetaData } from "@/hooks/useMetaData";
import { useTikTokData } from "@/hooks/useTikTokData";
import { useConnections } from "@/hooks/useConnections";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useTikTokGrowth } from "@/hooks/useTikTokGrowth";
import { Link } from "react-router-dom";
import TikTokProfileSection from "@/components/TikTokProfileSection";
import { useTranslation } from 'react-i18next';

const AnalyticsContent = () => {
  const { t } = useTranslation();
  const { isConnected, connections } = useConnections();
  const metaData = useMetaData();
  const tiktokData = useTikTokData();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics();
  const { data: growthData, hasData: hasGrowthData } = useTikTokGrowth();

  const hasConnections = connections.length > 0;

  const connectedStats = {
    totalFollowers: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  };

  if (isConnected('meta_ig') && metaData.instagram) {
    connectedStats.totalFollowers += metaData.instagram.followers_count || 0;
  }
  if (isConnected('tiktok') && tiktokData.user && tiktokData.stats) {
    connectedStats.totalFollowers += tiktokData.user.follower_count || 0;
    connectedStats.totalViews += tiktokData.stats.totalViews || 0;
    connectedStats.totalLikes += tiktokData.stats.totalLikes || 0;
    connectedStats.totalComments += tiktokData.stats.totalComments || 0;
  }

  const stats = [];
  if (connectedStats.totalFollowers > 0) stats.push({ title: t('analytics.total_followers'), value: connectedStats.totalFollowers.toLocaleString(), icon: Users });
  if (connectedStats.totalViews > 0) stats.push({ title: t('analytics.views'), value: connectedStats.totalViews.toLocaleString(), icon: Eye });
  if (connectedStats.totalLikes > 0) stats.push({ title: t('analytics.likes'), value: connectedStats.totalLikes.toLocaleString(), icon: Heart });
  if (connectedStats.totalComments > 0) stats.push({ title: t('analytics.comments'), value: connectedStats.totalComments.toLocaleString(), icon: MessageCircle });

  if (!hasConnections) {
    return (
      <div className="rounded-xl bg-card shadow-sm p-12 text-center">
        <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
        <h3 className="text-base font-medium text-foreground mb-1">{t('analytics.no_accounts_title')}</h3>
        <p className="text-sm text-muted-foreground mb-4">{t('analytics.no_accounts_desc')}</p>
        <Link to="/account">
          <Button size="sm">{t('analytics.go_to_account')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      {stats.length > 0 && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="rounded-xl bg-card shadow-sm p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-[11px] text-muted-foreground">{stat.title}</p>
                    <p className="text-lg font-semibold text-foreground">{stat.value}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl bg-card shadow-sm p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">{t('analytics.follower_growth')}</h3>
          {hasGrowthData ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Legend />
                <Line type="monotone" dataKey="followers" stroke="hsl(var(--primary))" strokeWidth={2} name={t('analytics.instagram_followers')} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[160px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{t('analytics.growth_no_data')}</p>
            </div>
          )}
        </div>

        <div className="rounded-xl bg-card shadow-sm p-5">
          <h3 className="text-sm font-medium text-foreground mb-3">{t('analytics.engagement_chart')}</h3>
          {hasGrowthData ? (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <YAxis stroke="hsl(var(--muted-foreground))" tick={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} />
                <Legend />
                <Line type="monotone" dataKey="likes" stroke="hsl(var(--primary))" strokeWidth={2} name={t('analytics.likes')} dot={false} />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--muted-foreground))" strokeWidth={2} name={t('analytics.views')} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[160px] flex items-center justify-center">
              <p className="text-sm text-muted-foreground">{t('analytics.engagement_no_data')}</p>
            </div>
          )}
        </div>
      </div>

      {/* Platform Breakdown */}
      <div className="rounded-xl bg-card shadow-sm p-5">
        <h3 className="text-sm font-medium text-foreground mb-4">{t('analytics.platform_overview')}</h3>
        <Tabs defaultValue={isConnected('meta_ig') ? 'instagram' : 'tiktok'} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-muted rounded-lg p-1">
            <TabsTrigger value="instagram" className={`rounded-md text-sm ${!isConnected('meta_ig') ? 'opacity-50' : ''}`}>
              <Instagram className="w-4 h-4 mr-2" />
              Instagram
            </TabsTrigger>
            <TabsTrigger value="tiktok" className={`rounded-md text-sm ${!isConnected('tiktok') ? 'opacity-50' : ''}`}>
              <Music2 className="w-4 h-4 mr-2" />
              TikTok
            </TabsTrigger>
          </TabsList>

          <TabsContent value="instagram" className="pt-4">
            {isConnected('meta_ig') && metaData.instagram ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: t('analytics.instagram_followers'), value: metaData.instagram.followers_count },
                  { label: t('analytics.instagram_following'), value: metaData.instagram.follows_count },
                  { label: t('analytics.instagram_posts'), value: metaData.instagram.media_count },
                  { label: t('analytics.instagram_name'), value: metaData.instagram.name },
                ].map((item, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted">
                    <p className="text-[11px] text-muted-foreground mb-0.5">{item.label}</p>
                    <p className="text-base font-semibold text-foreground">
                      {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">{t('analytics.connect_instagram')}</p>
            )}
          </TabsContent>

          <TabsContent value="tiktok" className="pt-4">
            {isConnected('tiktok') ? (
              <TikTokProfileSection />
            ) : (
              <p className="text-sm text-muted-foreground">{t('analytics.connect_tiktok')}</p>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AnalyticsContent;
