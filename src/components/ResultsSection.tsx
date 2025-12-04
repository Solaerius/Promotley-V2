import { TrendingUp, Users, Clock } from "lucide-react";
import { Card } from "@/components/ui/card";
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
      ref={ref as any}
      className="py-24 md:py-32 px-4 bg-gradient-diagonal overflow-hidden font-poppins relative"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider">Resultat</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-2 leading-tight text-balance">
            När strategi möter{" "}
            <span className="text-primary-glow">
              verkliga resultat
            </span>
          </h2>
          <p className="text-base md:text-lg text-white/70 px-4 max-w-xl mx-auto">
            Resultat från företag som följde sin personliga Promotley-strategi
          </p>
        </div>

        {/* Stats cards - Horizontal layout like Augmend */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const count = useCountUp({ 
              end: stat.value, 
              duration: 2000 + (index * 200), 
              isVisible 
            });
            
            return (
              <Card
                key={index}
                className="p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-primary-glow" />
                  </div>
                  <div>
                    <div className="text-sm text-white/60 mb-1">
                      {stat.label}
                    </div>
                    <div className="text-3xl md:text-4xl font-bold text-white tabular-nums">
                      {count}{stat.suffix}
                    </div>
                  </div>
                </div>
                <p className="text-white/50 text-sm mt-4 leading-relaxed">
                  {stat.description}
                </p>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ResultsSection;
