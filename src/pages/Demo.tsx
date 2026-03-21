import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  TrendingUp, Users, Calendar, Zap, BarChart3, MessageSquare,
  ArrowRight, Sparkles, Radar, Hash, Film, MessageCircle, Star,
  Leaf, Handshake, CalendarDays, Share2, Send, Lock, LogIn,
  LayoutDashboard, User, Wand2, FileText, Image, Target, Lightbulb,
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer,
} from 'recharts';
import {
  demoCompany, demoStats, demoSocialStats, demoChartData,
  demoCalendarPosts, demoSalesRadar, demoAIAnalysis, demoChatMessages,
  DEMO_LIMIT_MESSAGE, demoAIResponses,
} from '@/data/demoData';
import logo from '@/assets/logo.png';
import { cn } from '@/lib/utils';

const demoNavTabs = [
  { name: "Dashboard", value: "dashboard", icon: LayoutDashboard },
  { name: "Statistik", value: "analytics", icon: BarChart3 },
  { name: "AI & Verktyg", value: "ai", icon: Sparkles },
  { name: "Säljradar", value: "radar", icon: Radar },
  { name: "Kalender", value: "calendar", icon: Calendar },
];

const demoAITools = [
  { icon: FileText, title: "Caption-generator", description: "Skapa engagerande captions för dina inlägg", color: "from-orange-500 to-red-500", responseKey: "caption" },
  { icon: Hash, title: "Hashtag-förslag", description: "Få relevanta hashtags för ökad räckvidd", color: "from-blue-500 to-cyan-500", responseKey: "hashtags" },
  { icon: Image, title: "Content-idéer", description: "Brainstorma nya innehållsidéer", color: "from-purple-500 to-pink-500", responseKey: "contentIdeas" },
  { icon: Calendar, title: "Veckoplanering", description: "Planera din innehållskalender", color: "from-green-500 to-emerald-500", responseKey: "weeklyPlan" },
  { icon: Target, title: "Kampanjstrategi", description: "Bygg en strategi för din nästa kampanj", color: "from-amber-500 to-orange-500", responseKey: "campaign" },
  { icon: Lightbulb, title: "UF-tips", description: "Få råd specifikt för UF-företag", color: "from-indigo-500 to-purple-500", responseKey: "ufTips" },
];

const Demo = () => {
  const [clickCounts, setClickCounts] = useState<Record<string, number>>({});
  const [showLimitAlert, setShowLimitAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [aiSubTab, setAiSubTab] = useState('chat');
  const [aiResponses, setAiResponses] = useState<Record<string, string>>({});
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const handleDemoClick = useCallback((key: string) => {
    setClickCounts(prev => {
      const count = (prev[key] || 0) + 1;
      if (count > 1) {
        setShowLimitAlert(true);
        setTimeout(() => setShowLimitAlert(false), 4000);
      }
      return { ...prev, [key]: count };
    });
  }, []);

  const handleAIToolClick = useCallback((key: string) => {
    const count = (clickCounts[key] || 0) + 1;
    setClickCounts(prev => ({ ...prev, [key]: count }));

    if (count === 1) {
      const response = demoAIResponses[key];
      if (response) {
        setAiResponses(prev => ({ ...prev, [key]: response }));
      }
    } else {
      setShowRegisterModal(true);
    }
  }, [clickCounts]);

  const isLimited = (key: string) => (clickCounts[key] || 0) > 1;

  const formatNumber = (num: number): string => {
    if (num >= 1000) return (num / 1000).toFixed(1) + 'k';
    return num.toString();
  };

  const statsCards = [
    { title: 'Följare', value: formatNumber(demoStats.followers), icon: Users },
    { title: 'Engagemang', value: demoStats.engagement + '%', icon: TrendingUp },
    { title: 'Räckvidd', value: formatNumber(demoStats.reach), icon: BarChart3 },
    { title: 'AI-krediter', value: demoStats.credits_left.toString(), icon: Zap },
  ];

  const getLeadIcon = (typ: string) => {
    switch (typ) {
      case 'kund': return Users;
      case 'samarbete': return Handshake;
      case 'event': return CalendarDays;
      case 'kanal': return Share2;
      default: return Zap;
    }
  };

  const getTrendIcon = (typ: string) => {
    switch (typ) {
      case 'hashtag': return Hash;
      case 'format': return Film;
      case 'ämne': return MessageCircle;
      case 'event': return Star;
      case 'säsong': return Leaf;
      default: return TrendingUp;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Background like DashboardLayout */}
      <div className="fixed inset-0 z-0 bg-background" />
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute w-[600px] h-[600px] rounded-full opacity-20 dark:opacity-15"
          style={{ background: 'radial-gradient(circle, hsl(9 70% 45% / 0.3) 0%, transparent 70%)', filter: 'blur(100px)', top: '10%', right: '-10%' }} />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-15 dark:opacity-10"
          style={{ background: 'radial-gradient(circle, hsl(331 50% 35% / 0.3) 0%, transparent 70%)', filter: 'blur(100px)', bottom: '10%', left: '-10%' }} />
      </div>

      {/* Demo Banner - fixed at top */}
      <div className="sticky top-0 z-[60] bg-gradient-to-r from-primary/90 to-secondary/90 backdrop-blur-lg text-white py-2.5 px-4 text-center">
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <span className="text-sm font-medium">
            Du tittar på en demo av {demoCompany.foretagsnamn}
          </span>
          <Link to="/auth?mode=register">
            <Button size="sm" variant="secondary" className="gap-1.5 text-xs">
              <LogIn className="w-3.5 h-3.5" />
              Skapa konto gratis
            </Button>
          </Link>
        </div>
      </div>

      {/* Dashboard-style Navbar - below banner */}
      <nav className="sticky top-[42px] z-50 mx-4 md:mx-6 lg:mx-12 mt-2 relative">
        <div
          className="rounded-2xl border border-white/20 dark:border-white/15 backdrop-blur-xl"
          style={{
            background: 'linear-gradient(135deg, hsl(var(--primary) / 0.12) 0%, hsl(var(--secondary) / 0.1) 50%, hsl(var(--accent) / 0.12) 100%)',
          }}
        >
          <div className="px-3 py-2">
            <div className="flex items-center justify-between gap-2">
              {/* Logo */}
              <Link to="/" className="flex items-center gap-2 group">
                <img src={logo} alt="Promotley" className="w-7 h-7" />
                <span className="font-semibold text-sm text-foreground hidden sm:inline">Promotley</span>
              </Link>

              {/* Nav tabs */}
              <div className="flex items-center gap-0.5 overflow-x-auto">
                {demoNavTabs.map((tab) => {
                  const Icon = tab.icon;
                  const active = activeTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setActiveTab(tab.value)}
                      className={cn(
                        "relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap",
                        active
                          ? "text-foreground bg-foreground/15"
                          : "text-foreground/60 hover:text-foreground hover:bg-foreground/10"
                      )}
                    >
                      {active && (
                        <motion.div
                          layoutId="demoActiveTab"
                          className="absolute inset-0 rounded-lg bg-foreground/10 border border-foreground/15"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      <Icon className="w-3.5 h-3.5 relative z-10" />
                      <span className="text-xs font-medium relative z-10 hidden md:inline">{tab.name}</span>
                    </button>
                  );
                })}
              </div>

              {/* Right side - demo user */}
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-foreground/10 border border-foreground/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-foreground/60" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Limit Alert */}
      {showLimitAlert && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed top-28 left-1/2 -translate-x-1/2 z-[70] w-[90%] max-w-md"
        >
          <Alert className="border-primary/40 bg-background shadow-lg">
            <Lock className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between gap-2">
              <span className="text-sm">{DEMO_LIMIT_MESSAGE}</span>
              <Link to="/auth?mode=register">
                <Button size="sm" variant="gradient" className="text-xs whitespace-nowrap">
                  Skapa konto
                </Button>
              </Link>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6 relative z-10">
        {/* DASHBOARD TAB */}
        {activeTab === 'dashboard' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* Company header */}
            <div className="rounded-2xl p-6 backdrop-blur-xl border border-white/20"
              style={{ background: 'linear-gradient(135deg, hsl(9 90% 55% / 0.2) 0%, hsl(331 70% 45% / 0.15) 100%)' }}>
              <h2 className="text-2xl font-bold text-foreground">{demoCompany.foretagsnamn}</h2>
              <p className="text-muted-foreground text-sm mt-1">{demoCompany.branch} · {demoCompany.stad}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                {demoCompany.nyckelord.map(k => (
                  <Badge key={k} variant="secondary" className="text-xs">{k}</Badge>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {statsCards.map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-card rounded-2xl p-5 border border-border/40">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center border border-white/20"
                        style={{ background: 'linear-gradient(135deg, hsl(9 90% 55% / 0.3) 0%, hsl(331 70% 45% / 0.2) 100%)' }}>
                        <Icon className="w-5 h-5 text-foreground" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">{stat.title}</p>
                        <p className="text-xl font-bold text-foreground">{stat.value}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="rounded-2xl p-6 bg-card border border-border/40">
              <h3 className="text-lg font-semibold mb-4 text-foreground">Tillväxt senaste 6 veckorna</h3>
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={demoChartData}>
                  <defs>
                    <linearGradient id="demoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(9, 90%, 55%)" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="hsl(331, 70%, 45%)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="week" stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <YAxis stroke="rgba(255,255,255,0.5)" fontSize={12} />
                  <RechartsTooltip contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="followers" stroke="hsl(9, 90%, 55%)" strokeWidth={2} fill="url(#demoGrad)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Social platform stats */}
            <div className="grid md:grid-cols-2 gap-4">
              {demoSocialStats.map(platform => (
                <div key={platform.platform} className="rounded-2xl p-5 bg-card border border-border/40">
                  <h4 className="font-semibold text-foreground capitalize mb-3">
                    {platform.platform === 'instagram' ? '📸 Instagram' : '🎵 TikTok'}
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div><span className="text-muted-foreground">Följare:</span> <span className="text-foreground font-medium">{formatNumber(platform.followers)}</span></div>
                    <div><span className="text-muted-foreground">Likes:</span> <span className="text-foreground font-medium">{formatNumber(platform.likes)}</span></div>
                    <div><span className="text-muted-foreground">Kommentarer:</span> <span className="text-foreground font-medium">{formatNumber(platform.comments)}</span></div>
                    <div><span className="text-muted-foreground">Räckvidd:</span> <span className="text-foreground font-medium">{formatNumber(platform.reach)}</span></div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-2xl p-6 bg-card border border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-2">AI-analys av {demoCompany.foretagsnamn}</h3>
              <p className="text-muted-foreground text-sm mb-4">{demoAIAnalysis.summary}</p>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-green-400" /> Styrkor
                  </h4>
                  <ul className="space-y-1">
                    {demoAIAnalysis.strengths.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-yellow-400" /> Förbättringar
                  </h4>
                  <ul className="space-y-1">
                    {demoAIAnalysis.improvements.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-primary" /> Nästa steg
                  </h4>
                  <ul className="space-y-1">
                    {demoAIAnalysis.nextSteps.map((s, i) => (
                      <li key={i} className="text-sm text-muted-foreground">{s}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <Button variant="gradient" className="mt-4 gap-2" onClick={() => handleDemoClick('analysis')}>
                <Sparkles className="w-4 h-4" />
                {isLimited('analysis') ? 'Skapa konto för ny analys' : 'Generera ny analys'}
              </Button>
            </div>
          </motion.div>
        )}

        {/* AI & VERKTYG TAB */}
        {activeTab === 'ai' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* AI sub-tabs like real AIPage */}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">AI-Assistent</h1>
              <p className="text-sm text-muted-foreground mb-4">Din personliga AI för marknadsföring och innehåll</p>

              <div className="inline-flex h-10 items-center justify-center rounded-full bg-muted/50 backdrop-blur-sm border border-border/40 p-1 mb-6">
                {[
                  { value: 'chat', label: 'Chat', icon: MessageSquare },
                  { value: 'verktyg', label: 'Verktyg', icon: Wand2 },
                  { value: 'analys', label: 'Analys', icon: BarChart3 },
                ].map(tab => {
                  const Icon = tab.icon;
                  const active = aiSubTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      onClick={() => setAiSubTab(tab.value)}
                      className={cn(
                        "flex items-center gap-2 rounded-full px-3 sm:px-4 py-1.5 text-xs sm:text-sm transition-all",
                        active
                          ? "bg-primary/15 text-primary shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AI Chat sub-tab */}
            {aiSubTab === 'chat' && (
              <div className="rounded-2xl p-6 bg-card border border-border/40">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-primary" /> AI-Chatt
                </h3>

                {/* Chat messages */}
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {demoChatMessages.map((msg, i) => (
                    <div key={i} className={`flex ${(msg.role as string) === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                        (msg.role as string) === 'user'
                          ? 'bg-primary/20 text-foreground'
                          : 'backdrop-blur-sm border border-white/10 text-muted-foreground'
                      }`}>
                        {msg.message}
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA above input */}
                <div className="text-center mb-3 py-3 rounded-xl border border-primary/20 bg-primary/5">
                  <p className="text-sm text-foreground flex items-center justify-center gap-2 flex-wrap">
                    <Lock className="w-4 h-4 text-primary" />
                    AI-Chatten är tillgänglig med ett eget konto.
                    <Link to="/auth?mode=register" className="text-primary hover:underline font-medium">
                      Skapa konto →
                    </Link>
                  </p>
                </div>

                {/* Chat input - disabled/locked */}
                <div className="flex gap-2 opacity-50 pointer-events-none">
                  <input
                    type="text"
                    disabled
                    placeholder="Skriv ett meddelande..."
                    className="flex-1 rounded-xl px-4 py-3 text-sm bg-background border border-border/40 text-foreground placeholder:text-muted-foreground/50 cursor-not-allowed"
                  />
                  <Button variant="gradient" size="icon" disabled>
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* AI Verktyg sub-tab */}
            {aiSubTab === 'verktyg' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {demoAITools.map((tool) => (
                    <Card
                      key={tool.title}
                      className="group cursor-pointer liquid-glass-light hover:shadow-elegant transition-all duration-300 hover:scale-[1.02]"
                      onClick={() => handleAIToolClick(tool.responseKey)}
                    >
                      <CardHeader className="pb-2">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-r ${tool.color} flex items-center justify-center mb-2`}>
                          <tool.icon className="w-6 h-6 text-white" />
                        </div>
                        <CardTitle className="text-lg flex items-center justify-between text-foreground">
                          {tool.title}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-foreground/60" />
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">{tool.description}</CardDescription>
                      </CardHeader>
                    </Card>
                  ))}
                </div>

                {Object.entries(aiResponses).length > 0 && (
                  <div className="mt-6 space-y-4">
                    {Object.entries(aiResponses).map(([key, response]) => (
                      <div key={key} className="rounded-xl border border-border/50 bg-card/50 p-4">
                        <pre className="text-sm text-foreground whitespace-pre-wrap font-sans">{response}</pre>
                      </div>
                    ))}
                  </div>
                )}

                <Card className="bg-card border border-border/40">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1 text-foreground">Lås upp alla AI-verktyg</h3>
                        <p className="text-sm text-muted-foreground mb-3">
                          Skapa ett konto för att generera innehåll, marknadsplaner och strategier med AI.
                        </p>
                        <Link to="/auth?mode=register">
                          <Button variant="gradient" size="sm">
                            Skapa konto gratis
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* AI Analys sub-tab */}
            {aiSubTab === 'analys' && (
              <div className="rounded-2xl p-6 bg-card border border-border/40">
                <h3 className="text-lg font-semibold text-foreground mb-2">AI-analys av {demoCompany.foretagsnamn}</h3>
                <p className="text-muted-foreground text-sm mb-4">{demoAIAnalysis.summary}</p>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-green-400" /> Styrkor
                    </h4>
                    <ul className="space-y-1">
                      {demoAIAnalysis.strengths.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-yellow-400" /> Förbättringar
                    </h4>
                    <ul className="space-y-1">
                      {demoAIAnalysis.improvements.map((s, i) => (
                        <li key={i} className="text-sm text-muted-foreground">{s}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-center mt-6 py-3 rounded-xl border border-primary/20 bg-primary/5">
                  <p className="text-sm text-foreground flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4 text-primary" />
                    Skapa konto för att köra egna AI-analyser.
                    <Link to="/auth?mode=register" className="text-primary hover:underline font-medium">Kom igång →</Link>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* SÄLJRADAR TAB */}
        {activeTab === 'radar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <Card className="liquid-glass-light border-primary/20">
              <CardContent className="p-5">
                <p className="text-foreground text-sm leading-relaxed">{demoSalesRadar.sammanfattning}</p>
              </CardContent>
            </Card>

            {/* Leads */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" /> Leads & Möjligheter
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {demoSalesRadar.leads.map((lead, i) => {
                  const Icon = getLeadIcon(lead.typ);
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="liquid-glass-light hover:shadow-elegant transition-all h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-foreground">{lead.titel}</h4>
                                <Badge variant={lead.prioritet === 'hög' ? 'destructive' : 'default'} className="text-[10px]">{lead.prioritet}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{lead.beskrivning}</p>
                              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                                <ArrowRight className="w-3 h-3" /> {lead.action}
                              </div>
                              <p className="text-xs text-muted-foreground mt-1 italic">Potential: {lead.potential}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Trends */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-foreground flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" /> Trender & Aktuellt
              </h3>
              <div className="grid gap-3 md:grid-cols-2">
                {demoSalesRadar.trends.map((trend, i) => {
                  const Icon = getTrendIcon(trend.typ);
                  return (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                      <Card className="liquid-glass-light hover:shadow-elegant transition-all h-full">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-purple-500/30 to-pink-500/30 border border-white/20 flex items-center justify-center shrink-0">
                              <Icon className="w-5 h-5 text-foreground" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <h4 className="font-semibold text-foreground">{trend.titel}</h4>
                                <Badge variant="outline" className="text-[10px] border-border/40">{trend.plattform}</Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{trend.beskrivning}</p>
                              <div className="flex items-center gap-1 text-xs text-primary font-medium">
                                <ArrowRight className="w-3 h-3" /> {trend.tips}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            <Button variant="gradient" className="gap-2" onClick={() => handleDemoClick('radar')}>
              <Radar className="w-4 h-4" />
              {isLimited('radar') ? 'Skapa konto för fler skanningar' : 'Skanna fler möjligheter'}
            </Button>
          </motion.div>
        )}

        {/* CALENDAR TAB */}
        {activeTab === 'calendar' && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="rounded-2xl p-6 bg-card border border-border/40">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" /> Planerade inlägg
              </h3>
              <div className="space-y-3">
                {demoCalendarPosts.map(post => (
                  <div key={post.id} className="flex items-center gap-4 p-3 rounded-xl border border-border/40 bg-background/50">
                    <div className="text-center min-w-[50px]">
                      <p className="text-xs text-muted-foreground">{new Date(post.date).toLocaleDateString('sv-SE', { weekday: 'short' })}</p>
                      <p className="text-lg font-bold text-foreground">{new Date(post.date).getDate()}</p>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-foreground text-sm">{post.title}</p>
                      <p className="text-xs text-muted-foreground">{post.description}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] capitalize">{post.platform}</Badge>
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground mt-4 flex items-center gap-1">
                <Lock className="w-3 h-3" />
                Skapa och redigera inlägg med ett eget konto. <Link to="/auth?mode=register" className="text-primary hover:underline">Kom igång →</Link>
              </p>
            </div>
          </motion.div>
        )}

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl p-8 text-center border border-white/30"
          style={{ background: 'linear-gradient(135deg, hsl(9 90% 55% / 0.25) 0%, hsl(331 70% 45% / 0.25) 100%)' }}
        >
          <h3 className="text-2xl font-bold text-foreground mb-2">
            Redo att växa som {demoCompany.foretagsnamn}?
          </h3>
          <p className="text-muted-foreground mb-5 max-w-md mx-auto">
            Skapa ditt konto gratis och få tillgång till AI-driven marknadsföring anpassad för ditt företag.
          </p>
          <Link to="/auth?mode=register">
            <Button variant="gradient" size="lg" className="gap-2">
              Skapa konto gratis
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Register Modal */}
      {showRegisterModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
          onClick={() => setShowRegisterModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-border/50 rounded-2xl p-8 max-w-sm w-full text-center"
            onClick={e => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-2">Vill du se mer?</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Skapa ett gratis konto för att använda alla funktioner utan begränsningar.
            </p>

            <div className="flex flex-col gap-3">
              {/* Google */}
              <button
                onClick={async () => {
                  const { supabase } = await import('@/integrations/supabase/client');
                  supabase.auth.signInWithOAuth({
                    provider: 'google',
                    options: { redirectTo: `${window.location.origin}/auth/callback` },
                  });
                }}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Skapa ett konto med Google
              </button>

              {/* Apple */}
              <button
                onClick={async () => {
                  const { supabase } = await import('@/integrations/supabase/client');
                  supabase.auth.signInWithOAuth({
                    provider: 'apple',
                    options: { redirectTo: `${window.location.origin}/auth/callback` },
                  });
                }}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-xl bg-foreground text-background hover:opacity-90 transition-opacity text-sm font-medium"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5"><path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/></svg>
                Skapa ett konto med Apple
              </button>

              {/* Email */}
              <Link
                to="/auth?mode=register"
                className="block w-full py-3 rounded-xl border border-border/50 hover:bg-muted/50 transition-colors text-sm font-medium text-center"
                onClick={() => setShowRegisterModal(false)}
              >
                Registrera med e-post
              </Link>
            </div>

            <button
              onClick={() => setShowRegisterModal(false)}
              className="mt-4 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Stäng
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Demo;
