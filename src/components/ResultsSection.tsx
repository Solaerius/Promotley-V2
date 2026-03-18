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
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 70% 50%, hsl(260 60% 14% / 0.55) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'hsl(260 70% 30% / 0.25)',
              border: '1px solid hsl(260 60% 50% / 0.25)',
            }}
          >
            <BarChart3 className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Resultat</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            När strategi möter <span className="text-gradient">verkliga resultat</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)', textWrap: 'balance' }}>
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
              isVisible,
            });

            return (
              <div
                key={index}
                className="group rounded-2xl p-6 md:p-8 transition-all duration-300"
                style={{
                  background: 'hsl(0 0% 100% / 0.04)',
                  border: '1px solid hsl(0 0% 100% / 0.08)',
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                  transitionDelay: `${index * 100}ms`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.07)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.14)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 0 30px hsl(9 85% 45% / 0.15)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.08)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = 'none';
                }}
              >
                {/* Icon box with red gradient */}
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))',
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </div>

                <div className="text-sm mb-1" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                  {stat.label}
                </div>
                <div className="text-4xl md:text-5xl font-bold text-gradient tabular-nums mb-1">
                  {count}{stat.suffix}
                </div>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.45)' }}>
                  {stat.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
