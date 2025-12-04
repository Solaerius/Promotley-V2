import { Card } from "@/components/ui/card";
import { Link2, BarChart3, Lightbulb, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Link2,
    title: "Berätta om ditt företag",
    description: "Budget, bransch, målgrupp och hur mycket tid du har. Promotley anpassar strategin efter just dig.",
    gradient: "from-primary to-primary-glow",
  },
  {
    icon: BarChart3,
    title: "Koppla dina sociala medier",
    description: "AI:n analyserar dina konton och konkurrenterna för att hitta de bästa möjligheterna.",
    gradient: "from-accent to-primary",
  },
  {
    icon: Lightbulb,
    title: "Få din personliga strategi",
    description: "Komplett plan med exakt när, hur ofta och vad du ska posta - anpassat efter din budget och tid.",
    gradient: "from-primary-glow to-accent",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 md:py-32 px-4 bg-muted/30 font-poppins">
      <div className="container mx-auto max-w-6xl">
        {/* Section header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Hur det fungerar</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight text-balance">
            Från företagsidé till{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              färdig strategi
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4 max-w-xl mx-auto">
            Få din personliga innehållsplan på under 5 minuter
          </p>
        </div>

        {/* Steps - Desktop horizontal layout with connectors */}
        <div className="hidden lg:block">
          <div className="grid lg:grid-cols-3 gap-0">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  {/* Connector line */}
                  {index < steps.length - 1 && (
                    <div className="absolute top-16 left-[calc(50%+80px)] w-[calc(100%-160px)] h-px bg-gradient-to-r from-border via-primary/30 to-border z-0">
                      <ArrowRight className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/50" />
                    </div>
                  )}
                  
                  <Card className="relative p-8 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group mx-4 h-full">
                    {/* Step number badge */}
                    <div className="absolute -top-4 left-8 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {index + 1}
                    </div>

                    <div className="space-y-5 pt-2">
                      {/* Icon */}
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                        <Icon className="w-7 h-7 text-white" />
                      </div>

                      <h3 className="text-xl font-semibold">{step.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>

        {/* Steps - Mobile/Tablet vertical layout */}
        <div className="lg:hidden grid sm:grid-cols-2 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card
                key={index}
                className="relative p-6 md:p-8 bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group"
              >
                {/* Step number */}
                <div className="absolute -top-3 left-6 w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold text-sm shadow-md">
                  {index + 1}
                </div>

                <div className="space-y-4 pt-2">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${step.gradient} flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  <h3 className="text-lg md:text-xl font-semibold">{step.title}</h3>
                  <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
