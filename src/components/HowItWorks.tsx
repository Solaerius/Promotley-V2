import { Link2, BarChart3, Lightbulb, Zap } from "lucide-react";

const steps = [
  {
    icon: Link2,
    number: "01",
    title: "Berätta om ditt företag",
    description: "Budget, bransch, målgrupp och hur mycket tid du har. Promotley anpassar strategin efter just dig.",
  },
  {
    icon: BarChart3,
    number: "02",
    title: "Koppla dina sociala medier",
    description: "AI:n analyserar dina konton och konkurrenterna för att hitta de bästa möjligheterna.",
  },
  {
    icon: Lightbulb,
    number: "03",
    title: "Få din personliga strategi",
    description: "Komplett plan med exakt när, hur ofta och vad du ska posta - anpassat efter din budget och tid.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="relative py-24 md:py-32 overflow-hidden">
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, hsl(260 70% 14% / 0.5) 0%, transparent 70%)' }} />

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
            <Zap className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Hur det fungerar</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            Från företagsidé till <span className="text-gradient">färdig strategi</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)', textWrap: 'balance' }}>
            Få din personliga innehållsplan på under 5 minuter
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {steps.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="relative rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300 group"
                style={{
                  background: 'hsl(0 0% 100% / 0.04)',
                  border: '1px solid hsl(0 0% 100% / 0.08)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.07)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.14)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.04)';
                  (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.08)';
                }}
              >
                {/* Large oversized step number */}
                <div
                  className="absolute -top-2 left-4 text-8xl font-bold leading-none select-none pointer-events-none"
                  style={{ color: 'hsl(0 0% 100% / 0.06)' }}
                >
                  {item.number}
                </div>

                {/* Desktop connector line (right border on first two cards) */}
                {index < 2 && (
                  <div
                    className="hidden md:block absolute top-1/2 -right-3 w-6 h-px z-20"
                    style={{ background: 'linear-gradient(90deg, hsl(9 85% 55% / 0.4), hsl(9 85% 55% / 0.1))' }}
                  />
                )}

                {/* Icon */}
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 mt-6 relative z-10 transition-transform duration-300 group-hover:scale-110"
                  style={{
                    background: 'linear-gradient(135deg, hsl(9 85% 55% / 0.2), hsl(331 70% 45% / 0.15))',
                    border: '1px solid hsl(9 85% 55% / 0.2)',
                  }}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>

                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
