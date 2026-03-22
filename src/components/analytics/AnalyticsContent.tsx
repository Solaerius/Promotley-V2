import { useState } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  Cell,
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
  ExternalLink,
  TrendingUp,
  Clock,
  Calendar,
  Hash,
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

const fmt = (n: number) => n >= 1_000_000 ? (n/1_000_000).toFixed(1)+'M' : n >= 1_000 ? (n/1_000).toFixed(1)+'k' : String(n);

const AnalyticsContent = () => {
  const { t } = useTranslation();
  const { isConnected, connections } = useConnections();
  const metaData = useMetaData();
  const tiktokData = useTikTokData();
  const { data: analyticsData, loading: analyticsLoading } = useAnalytics();
  const { data: growthData, hasData: hasGrowthData } = useTikTokGrowth();

  const [sortKey, setSortKey] = useState<'likes' | 'comments' | 'shares' | 'views' | 'rate'>('likes');
  const [sortAsc, setSortAsc] = useState(false);

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

      {/* Most Liked Analysis */}
      {isConnected('tiktok') && tiktokData.videos.length >= 3 && (() => {
        const sorted = [...tiktokData.videos].sort((a, b) => b.likes - a.likes);
        const top5 = sorted.slice(0, 5);
        const overall = tiktokData.videos;

        // Average duration
        const avgDurTop = top5.filter(v => v.duration).reduce((s, v) => s + (v.duration || 0), 0) / (top5.filter(v => v.duration).length || 1);
        const avgDurAll = overall.filter(v => v.duration).reduce((s, v) => s + (v.duration || 0), 0) / (overall.filter(v => v.duration).length || 1);

        // Best posting day
        const dayCounts: Record<number, number> = {};
        top5.forEach(v => {
          if (!v.created_at) return;
          const day = new Date(v.created_at).getDay();
          dayCounts[day] = (dayCounts[day] || 0) + 1;
        });
        const dayNames = ['Sön', 'Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör'];
        const bestDay = Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0];
        const bestDayName = bestDay ? dayNames[parseInt(bestDay[0])] : '–';

        // Views per like ratio
        const avgVPL = top5.filter(v => v.likes > 0)
          .reduce((s, v) => s + (v.views / v.likes), 0) / (top5.filter(v => v.likes > 0).length || 1);

        // Common keywords from titles
        const stopWords = new Set(['och', 'en', 'ett', 'den', 'det', 'de', 'som', 'är', 'på', 'i', 'att', 'the', 'a', 'an', 'and', 'of', 'to', 'in', 'is', 'it']);
        const wordFreq: Record<string, number> = {};
        top5.forEach(v => {
          (v.title || '').toLowerCase().replace(/[^a-zåäö0-9\s]/g, '').split(/\s+/).forEach(w => {
            if (w.length >= 4 && !stopWords.has(w)) wordFreq[w] = (wordFreq[w] || 0) + 1;
          });
        });
        const topKeywords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([w]) => w);

        const insights = [
          {
            icon: Clock,
            label: t('analytics.avg_duration_top'),
            value: avgDurTop > 0 ? `${Math.round(avgDurTop)}s` : '–',
            sub: avgDurAll > 0 && avgDurTop > 0 ? `${avgDurTop > avgDurAll ? '+' : ''}${Math.round(avgDurTop - avgDurAll)}s vs snitt` : undefined,
            color: "hsl(var(--primary))",
          },
          {
            icon: Calendar,
            label: t('analytics.best_posting_day'),
            value: bestDayName,
            color: "hsl(174 60% 50%)",
          },
          {
            icon: TrendingUp,
            label: t('analytics.views_likes_ratio'),
            value: avgVPL > 0 ? `${Math.round(avgVPL)}x` : '–',
            color: "hsl(var(--accent-brand))",
          },
          {
            icon: Hash,
            label: t('analytics.common_keywords'),
            value: topKeywords.length > 0 ? topKeywords.join(', ') : '–',
            color: "hsl(320 65% 62%)",
          },
        ];

        return (
          <div className="rounded-xl bg-card shadow-sm p-5">
            <h3 className="text-sm font-medium text-foreground mb-4">{t('analytics.most_liked_analysis')}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {insights.map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="rounded-xl p-3 bg-surface-raised border border-border/50">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: `color-mix(in srgb, ${color} 15%, transparent)` }}>
                      <Icon className="h-3.5 w-3.5" style={{ color }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground leading-tight">{label}</p>
                  </div>
                  <p className="text-base font-bold text-foreground">{value}</p>
                  {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
                </div>
              ))}
            </div>
          </div>
        );
      })()}

      {/* Engagement Breakdown Chart */}
      {isConnected('tiktok') && tiktokData.videos.length > 0 && (() => {
        const breakdownData = [...tiktokData.videos]
          .slice(0, 10)
          .reverse()
          .map((v, i) => ({
            name: v.title ? v.title.substring(0, 12) + (v.title.length > 12 ? '…' : '') : `#${i + 1}`,
            likes: v.likes,
            comments: v.comments,
            shares: v.shares,
          }));

        return (
          <div className="rounded-xl bg-card shadow-sm p-5">
            <h3 className="text-sm font-medium text-foreground mb-4">{t('analytics.engagement_breakdown')}</h3>
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={breakdownData} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: 11 }}
                    formatter={(val: number, key: string) => [val, key === 'likes' ? t('analytics.col_likes') : key === 'comments' ? t('analytics.col_comments') : t('analytics.col_shares')]}
                  />
                  <Legend formatter={(key) => key === 'likes' ? t('analytics.col_likes') : key === 'comments' ? t('analytics.col_comments') : t('analytics.col_shares')} wrapperStyle={{ fontSize: 11 }} />
                  <Bar dataKey="likes" stackId="a" fill="hsl(var(--primary))" />
                  <Bar dataKey="comments" stackId="a" fill="hsl(210 78% 62%)" />
                  <Bar dataKey="shares" stackId="a" fill="hsl(174 60% 50%)" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        );
      })()}

      {/* Content Performance Table */}
      {isConnected('tiktok') && tiktokData.videos.length > 0 && (() => {
        const tableData = [...tiktokData.videos].map(v => ({
          ...v,
          rate: v.views > 0 ? parseFloat((((v.likes + v.comments) / v.views) * 100).toFixed(1)) : 0,
        })).sort((a, b) => {
          const va = a[sortKey === 'rate' ? 'rate' : sortKey] as number;
          const vb = b[sortKey === 'rate' ? 'rate' : sortKey] as number;
          return sortAsc ? va - vb : vb - va;
        });

        const handleSort = (key: typeof sortKey) => {
          if (sortKey === key) setSortAsc(p => !p);
          else { setSortKey(key); setSortAsc(false); }
        };

        const SortHeader = ({ col, label }: { col: typeof sortKey; label: string }) => (
          <th
            onClick={() => handleSort(col)}
            className="text-right text-[11px] font-medium text-muted-foreground px-3 py-2 cursor-pointer select-none hover:text-foreground transition-colors"
          >
            {label} {sortKey === col ? (sortAsc ? '↑' : '↓') : ''}
          </th>
        );

        return (
          <div className="rounded-xl bg-card shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-border">
              <h3 className="text-sm font-medium text-foreground">{t('analytics.content_performance')}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/40">
                  <tr>
                    <th className="text-left text-[11px] font-medium text-muted-foreground px-3 py-2">{t('analytics.col_title')}</th>
                    <SortHeader col="likes" label={t('analytics.col_likes')} />
                    <SortHeader col="comments" label={t('analytics.col_comments')} />
                    <SortHeader col="shares" label={t('analytics.col_shares')} />
                    <SortHeader col="views" label={t('analytics.col_views')} />
                    <SortHeader col="rate" label={t('analytics.col_engagement')} />
                  </tr>
                </thead>
                <tbody>
                  {tableData.map((v, i) => (
                    <tr key={v.id} className={`border-t border-border/40 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                      <td className="px-3 py-2.5 max-w-[180px]">
                        <div className="flex items-center gap-2">
                          {v.cover_image_url ? (
                            <img src={v.cover_image_url} alt="" className="w-7 h-7 rounded object-cover flex-shrink-0" />
                          ) : (
                            <div className="w-7 h-7 rounded bg-muted flex-shrink-0" />
                          )}
                          <span className="text-xs text-foreground line-clamp-1">{v.title || '–'}</span>
                        </div>
                      </td>
                      <td className="text-right px-3 py-2.5 text-xs font-medium text-foreground">{fmt(v.likes)}</td>
                      <td className="text-right px-3 py-2.5 text-xs text-foreground">{fmt(v.comments)}</td>
                      <td className="text-right px-3 py-2.5 text-xs text-foreground">{fmt(v.shares)}</td>
                      <td className="text-right px-3 py-2.5 text-xs text-foreground">{fmt(v.views)}</td>
                      <td className="text-right px-3 py-2.5 text-xs font-semibold" style={{ color: "hsl(var(--primary))" }}>{v.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })()}
    </div>
  );
};

export default AnalyticsContent;
