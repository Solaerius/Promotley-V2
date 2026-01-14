import { TrendingUp, Users, Clock, BarChart3 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { useCountUp } from "@/hooks/useCountUp";

const stats = [
  {
    icon: TrendingUp,
    value: 87,
    suffix: "%",
    label: "Förbättrat engagemang",
    description: "Genomsnittlig ökning för företag som följer strategin",
  },
  {
    icon: Users,
    value: 2400,
    suffix: "+",
    label: "Nya följare i snitt",
    description: "Per företag under de första 3 månaderna",
  },
  {
    icon: Clock,
    value: 5,
    suffix: "h",
    label: "Sparad tid per vecka",
    description: "Genom automatiserad innehållsplanering",
  },
];

const ResultsSection = () => {
  const { ref, isVisible } = useIntersectionObserver({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section 
      ref={ref as React.RefObject<HTMLElement>}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      {/* Background with diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-diagonal" />
      
      {/* Fluid blur orbs */}
      <div className="blur-orb blur-orb-primary w-[500px] h-[500px] top-0 right-0 animate-glow-pulse" />
      <div className="blur-orb blur-orb-secondary w-[400px] h-[400px] bottom-0 left-1/4 animate-glow-pulse" style={{ animationDelay: '0.8s' }} />
      
      {/* Top blend */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, hsl(344 55% 12%) 0%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <BarChart3 className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Resultat</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            När strategi möter <span className="text-gradient">verkliga resultat</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Resultat från företag som följde sin personliga Promotley-strategi
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid sm:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCountUp({ 
              end: stat.value, 
              duration: 2000 + (index * 200), 
              isVisible 
            });
            
            return (
              <div
                key={index}
                className="group bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${index * 100}ms`,
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">{stat.label}</div>
                    <div className="text-3xl md:text-4xl font-bold text-gradient tabular-nums">
                      {count}{stat.suffix}
                    </div>
                  </div>
                </div>
                <p className="text-white/50 text-sm mt-4 leading-relaxed">
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Bottom blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(344 55% 12%) 0%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />
    </section>
  );
};

export default ResultsSection;
