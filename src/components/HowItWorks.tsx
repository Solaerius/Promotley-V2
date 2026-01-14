import { Card, CardContent } from "@/components/ui/card";
import { Link2, BarChart3, Lightbulb, Zap } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Berätta om ditt företag",
    description: "Budget, bransch, målgrupp och hur mycket tid du har. Promotley anpassar strategin efter just dig.",
  },
  {
    icon: BarChart3,
    title: "Koppla dina sociala medier",
    description: "AI:n analyserar dina konton och konkurrenterna för att hitta de bästa möjligheterna.",
  },
  {
    icon: Lightbulb,
    title: "Få din personliga strategi",
    description: "Komplett plan med exakt när, hur ofta och vad du ska posta - anpassat efter din budget och tid.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-diagonal" />
      
      {/* Blur orbs */}
      <div className="blur-orb blur-orb-secondary w-[500px] h-[500px] top-0 -left-32 animate-glow-pulse" />
      <div className="blur-orb blur-orb-primary w-96 h-96 bottom-0 right-0 animate-glow-pulse" style={{ animationDelay: '1.2s' }} />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Hur det fungerar</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            Från företagsidé till <span className="text-gradient">färdig strategi</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Få din personliga innehållsplan på under 5 minuter
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index} 
                className="bg-white/5 backdrop-blur-sm border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group relative"
              >
                <CardContent className="p-6 md:p-8">
                  {/* Step Number */}
                  <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white/10 flex items-center justify-center mb-6 mt-2 group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-white/60 leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Connector dots for desktop */}
        <div className="hidden md:flex justify-center items-center gap-4 mt-8">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-white/40" />
              {i < 2 && <div className="w-16 h-px bg-gradient-to-r from-white/40 to-white/20" />}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
