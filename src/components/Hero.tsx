import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Users, TrendingUp, BarChart3, Zap, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Hero = () => {
  const { user } = useAuth();
  const [showElements, setShowElements] = useState({
    badge: false,
    headline: false,
    subheadline: false,
    buttons: false,
    social: false,
    dashboard: false,
    logos: false,
  });

  useEffect(() => {
    const timers = [
      setTimeout(() => setShowElements(prev => ({ ...prev, badge: true })), 150),
      setTimeout(() => setShowElements(prev => ({ ...prev, headline: true })), 350),
      setTimeout(() => setShowElements(prev => ({ ...prev, subheadline: true })), 600),
      setTimeout(() => setShowElements(prev => ({ ...prev, buttons: true })), 850),
      setTimeout(() => setShowElements(prev => ({ ...prev, social: true })), 1050),
      setTimeout(() => setShowElements(prev => ({ ...prev, dashboard: true })), 1200),
      setTimeout(() => setShowElements(prev => ({ ...prev, logos: true })), 1800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-start overflow-hidden pt-28 pb-0">
      {/* Deep dark red background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(344 70% 22%) 0%, hsl(344 60% 8%) 55%, hsl(222 47% 4%) 100%)',
        }}
      />


      {/* Glow orbs */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '-20%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '900px',
          height: '500px',
          background: 'radial-gradient(ellipse, hsl(9 85% 45% / 0.25) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />
      <div
        className="absolute pointer-events-none animate-glow-pulse"
        style={{
          top: '30%',
          left: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, hsl(331 65% 35% / 0.15) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '1s',
        }}
      />
      <div
        className="absolute pointer-events-none animate-glow-pulse"
        style={{
          top: '25%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(ellipse, hsl(9 85% 45% / 0.12) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animationDelay: '2s',
        }}
      />

      {/* Hero content */}
      <div className="container mx-auto px-4 md:px-6 relative z-10 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 transition-all duration-700 ${
            showElements.badge ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{
            background: 'hsl(344 70% 30% / 0.3)',
            border: '1px solid hsl(344 60% 50% / 0.3)',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" style={{ color: 'hsl(9 90% 65%)' }} />
          <span className="text-sm font-medium text-white/80">AI-driven marknadsföring för UF-företag</span>
        </div>

        {/* Main headline */}
        <h1
          className={`font-bold mb-6 leading-none tracking-tight transition-all duration-700 ${
            showElements.headline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)',
            lineHeight: '1.05',
          }}
        >
          <span className="text-white">Bli företaget </span>
          <span
            style={{
              background: 'linear-gradient(135deg, hsl(9 90% 65%) 0%, hsl(331 75% 60%) 50%, hsl(344 65% 50%) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            alla pratar om
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className={`text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-100 ${
            showElements.subheadline ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ color: 'hsl(0 0% 100% / 0.6)', textWrap: 'balance' }}
        >
          Promotley analyserar din målgrupp och skapar personliga innehållsstrategier
          som hjälper ditt UF-företag att växa på sociala medier.
        </p>

        {/* CTA Buttons */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 transition-all duration-700 delay-200 ${
            showElements.buttons ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link to="/auth?mode=register">
            <Button
              size="lg"
              className="text-base px-8 py-6 font-semibold transition-all duration-300 hover:scale-[1.03] rounded-xl"
              style={{
                background: 'linear-gradient(135deg, hsl(9 85% 55%) 0%, hsl(331 70% 45%) 100%)',
                boxShadow: '0 8px 30px hsl(9 85% 45% / 0.4), 0 2px 8px hsl(344 60% 20% / 0.3)',
                border: 'none',
                color: 'white',
              }}
            >
              Starta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>

          {!user && (
            <Link to="/join">
              <Button
                variant="outline"
                size="lg"
                className="text-base px-8 py-6 rounded-xl transition-all duration-300 hover:scale-[1.02]"
                style={{
                  border: '1px solid hsl(0 0% 100% / 0.15)',
                  background: 'hsl(0 0% 100% / 0.05)',
                  color: 'hsl(0 0% 100% / 0.8)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Users className="mr-2 h-5 w-5" />
                Anslut till företag
              </Button>
            </Link>
          )}
        </div>

        {/* Trust badges */}
        <div
          className={`flex flex-wrap items-center justify-center gap-5 mb-16 text-sm transition-all duration-700 delay-300 ${
            showElements.social ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
          style={{ color: 'hsl(0 0% 100% / 0.45)' }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(142 70% 50%)', boxShadow: '0 0 6px hsl(142 70% 50% / 0.8)' }} />
            <span>Gratis att börja</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(142 70% 50%)', boxShadow: '0 0 6px hsl(142 70% 50% / 0.8)' }} />
            <span>Inget kort krävs</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'hsl(142 70% 50%)', boxShadow: '0 0 6px hsl(142 70% 50% / 0.8)' }} />
            <span>GDPR-säkert</span>
          </div>
        </div>

        {/* Dashboard mockup */}
        <div
          className={`relative max-w-5xl mx-auto transition-all duration-1000 ${
            showElements.dashboard ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          {/* Glow behind mockup */}
          <div
            className="absolute inset-x-8 -top-8 bottom-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse 80% 50% at 50% 20%, hsl(9 85% 45% / 0.35) 0%, transparent 70%)',
              filter: 'blur(40px)',
            }}
          />

          {/* Floating stat cards - left */}
          <motion.div
            className="absolute -left-4 md:-left-16 top-16 hidden md:block z-20"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="rounded-2xl p-3.5 text-left"
              style={{
                background: 'hsl(344 50% 10% / 0.9)',
                border: '1px solid hsl(344 60% 30% / 0.4)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px hsl(0 0% 0% / 0.4)',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <TrendingUp className="w-4 h-4" style={{ color: 'hsl(9 85% 60%)' }} />
                <span className="text-xs" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>Räckvidd</span>
              </div>
              <p className="text-white font-bold text-xl">+142%</p>
              <p className="text-xs mt-0.5" style={{ color: 'hsl(142 70% 50%)' }}>↑ senaste månaden</p>
            </div>
          </motion.div>

          {/* Floating AI card - right */}
          <motion.div
            className="absolute -right-4 md:-right-16 top-24 hidden md:block z-20"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          >
            <div
              className="rounded-2xl p-3.5 text-left"
              style={{
                background: 'hsl(344 50% 10% / 0.9)',
                border: '1px solid hsl(344 60% 30% / 0.4)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 8px 32px hsl(0 0% 0% / 0.4)',
              }}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <Sparkles className="w-4 h-4" style={{ color: 'hsl(9 85% 60%)' }} />
                <span className="text-xs" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>AI-förslag</span>
              </div>
              <p className="text-white text-xs max-w-[140px] leading-relaxed">Posta Reels kl 18:00 på vardagar för bäst räckvidd</p>
            </div>
          </motion.div>

          {/* Main browser mockup */}
          <Link to="/demo" className="block group cursor-pointer">
            <div
              className="relative rounded-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(180deg, hsl(222 47% 10%) 0%, hsl(222 47% 7%) 100%)',
                border: '1px solid hsl(0 0% 100% / 0.08)',
                boxShadow: '0 30px 80px hsl(0 0% 0% / 0.6), 0 0 0 1px hsl(0 0% 100% / 0.04), inset 0 1px 0 hsl(0 0% 100% / 0.08)',
              }}
            >
              {/* Browser chrome */}
              <div
                className="flex items-center gap-2 px-4 py-3"
                style={{
                  background: 'hsl(222 47% 8%)',
                  borderBottom: '1px solid hsl(0 0% 100% / 0.06)',
                }}
              >
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(0 72% 55%)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(38 90% 55%)' }} />
                  <div className="w-3 h-3 rounded-full" style={{ background: 'hsl(142 70% 45%)' }} />
                </div>
                <div className="flex-1 flex justify-center">
                  <div
                    className="px-4 py-1 rounded-md text-xs"
                    style={{
                      background: 'hsl(0 0% 100% / 0.06)',
                      color: 'hsl(0 0% 100% / 0.35)',
                    }}
                  >
                    promotley.se/dashboard
                  </div>
                </div>
              </div>

              {/* Dashboard layout */}
              <div className="flex">
                {/* Sidebar */}
                <div
                  className="hidden sm:flex flex-col gap-1 w-48 p-4 shrink-0"
                  style={{ borderRight: '1px solid hsl(0 0% 100% / 0.05)' }}
                >
                  <div className="flex items-center gap-2.5 mb-4">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))' }}
                    >
                      NH
                    </div>
                    <div>
                      <p className="text-white text-xs font-medium">Nordic Hoodies</p>
                      <p className="text-xs" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>UF</p>
                    </div>
                  </div>
                  {['Översikt', 'Kalender', 'AI-verktyg', 'Analys'].map((item, i) => (
                    <div
                      key={item}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs"
                      style={{
                        background: i === 0 ? 'hsl(344 60% 30% / 0.3)' : 'transparent',
                        color: i === 0 ? 'hsl(9 85% 70%)' : 'hsl(0 0% 100% / 0.4)',
                      }}
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ background: i === 0 ? 'hsl(9 85% 60%)' : 'hsl(0 0% 100% / 0.2)' }}
                      />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="flex-1 p-5 md:p-6 space-y-4">
                  {/* Welcome */}
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white text-sm font-semibold">Välkommen tillbaka, Erik!</h3>
                      <p className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>Måndag, 10 mars 2026</p>
                    </div>
                    <div
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs"
                      style={{
                        background: 'hsl(142 70% 40% / 0.15)',
                        border: '1px solid hsl(142 70% 40% / 0.3)',
                        color: 'hsl(142 70% 60%)',
                      }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400" style={{ boxShadow: '0 0 4px hsl(142 70% 50%)' }} />
                      Aktiv
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { icon: Users, label: "Följare", value: "2.4k", trend: "+12%", color: 'hsl(9 85% 60%)' },
                      { icon: TrendingUp, label: "Engagemang", value: "5.8%", trend: "+2.1%", color: 'hsl(331 70% 55%)' },
                      { icon: BarChart3, label: "Räckvidd", value: "12.3k", trend: "+34%", color: 'hsl(9 85% 60%)' },
                      { icon: Zap, label: "AI-krediter", value: "47", trend: "kvar", color: 'hsl(38 90% 55%)' },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div
                          key={stat.label}
                          className="rounded-xl p-3.5"
                          style={{
                            background: 'hsl(0 0% 100% / 0.03)',
                            border: '1px solid hsl(0 0% 100% / 0.06)',
                          }}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <Icon className="w-3.5 h-3.5" style={{ color: stat.color }} />
                            <span className="text-xs" style={{ color: 'hsl(142 70% 55%)' }}>{stat.trend}</span>
                          </div>
                          <p className="text-white font-bold text-base">{stat.value}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>{stat.label}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Chart */}
                  <div
                    className="rounded-xl p-4"
                    style={{
                      background: 'hsl(0 0% 100% / 0.03)',
                      border: '1px solid hsl(0 0% 100% / 0.06)',
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-medium text-white/70">Tillväxt senaste 30 dagarna</h4>
                      <div className="flex gap-3 text-xs" style={{ color: 'hsl(0 0% 100% / 0.4)' }}>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'hsl(174 70% 45%)' }} /> TikTok</span>
                        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full inline-block" style={{ background: 'hsl(328 70% 55%)' }} /> Instagram</span>
                      </div>
                    </div>
                    <svg viewBox="0 0 400 80" className="w-full h-16 md:h-20">
                      <defs>
                        <linearGradient id="tikGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(174 70% 45%)" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="hsl(174 70% 45%)" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="instaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="hsl(328 70% 55%)" stopOpacity="0.2" />
                          <stop offset="100%" stopColor="hsl(328 70% 55%)" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {[20, 40, 60].map(y => (
                        <line key={y} x1="0" y1={y} x2="400" y2={y} stroke="hsl(0 0% 100% / 0.04)" strokeWidth="1" />
                      ))}
                      <path d="M0,70 C50,65 80,50 120,42 C160,35 200,25 240,18 C280,12 320,8 360,5 L400,3 L400,80 L0,80 Z" fill="url(#tikGrad)" />
                      <path d="M0,70 C50,65 80,50 120,42 C160,35 200,25 240,18 C280,12 320,8 360,5 L400,3" fill="none" stroke="hsl(174 70% 45%)" strokeWidth="2" />
                      <path d="M0,75 C50,72 80,62 120,56 C160,50 200,42 240,36 C280,30 320,24 360,18 L400,14 L400,80 L0,80 Z" fill="url(#instaGrad)" />
                      <path d="M0,75 C50,72 80,62 120,56 C160,50 200,42 240,36 C280,30 320,24 360,18 L400,14" fill="none" stroke="hsl(328 70% 55%)" strokeWidth="2" />
                    </svg>
                  </div>

                  {/* AI suggestion row */}
                  <div
                    className="rounded-xl p-3.5 flex items-start gap-3"
                    style={{
                      background: 'hsl(344 60% 25% / 0.2)',
                      border: '1px solid hsl(344 60% 40% / 0.2)',
                    }}
                  >
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))' }}
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-white/80 mb-1">AI-Assistent föreslår</p>
                      <p className="text-xs leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.5)' }}>
                        Publicera ditt nästa inlägg på TikTok ikväll kl 18:30 — din målgrupp är mest aktiv då. Engagemangsgraden förväntas bli 40% högre.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom gradient fade on mockup */}
              <div
                className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                style={{
                  background: 'linear-gradient(to top, hsl(222 47% 7%) 0%, transparent 100%)',
                }}
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ background: 'hsl(344 60% 20% / 0.15)' }}>
                <div
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-white font-medium text-sm"
                  style={{
                    background: 'hsl(0 0% 100% / 0.1)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid hsl(0 0% 100% / 0.2)',
                  }}
                >
                  <Sparkles className="w-4 h-4" style={{ color: 'hsl(9 85% 65%)' }} />
                  Testa demo nu
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Social proof logos band */}
        <div
          className={`mt-16 mb-0 transition-all duration-1000 delay-500 ${
            showElements.logos ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <p className="text-sm mb-8" style={{ color: 'hsl(0 0% 100% / 0.35)' }}>
            Skapad för UF-företag i samarbete med <span style={{ color: 'hsl(9 85% 60%)' }}>Ung Företagsamhet</span>
          </p>

          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 pb-16">
            {/* TikTok */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <span className="text-sm font-medium">TikTok</span>
            </div>
            {/* Instagram */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span className="text-sm font-medium">Instagram</span>
            </div>
            {/* Ung Företagsamhet */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
              </svg>
              <span className="text-sm font-medium">Ung Företagsamhet</span>
            </div>
            {/* AI */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
              </svg>
              <span className="text-sm font-medium">Gemini AI</span>
            </div>
            {/* GDPR */}
            <div className="flex items-center gap-2" style={{ color: 'hsl(0 0% 100% / 0.3)' }}>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
              <span className="text-sm font-medium">GDPR-säkert</span>
            </div>
          </div>
        </div>
      </div>

      {/* Page transition fade at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{
          background: 'linear-gradient(to top, hsl(222 47% 4%) 0%, transparent 100%)',
        }}
      />
    </section>
  );
};

export default Hero;
