import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import PricingFAQ from "./PricingFAQ";

const plans = [
  {
    name: "UF Starter",
    price: "29",
    credits: "50",
    model: "gpt-4o-mini",
    description: "Perfekt för nya UF-företag som precis börjat",
    features: [
      "AI-modell: 4o Mini",
      "50 AI-krediter per månad",
      "Enkel strategi (2 poster/vecka)",
      "3 branschtips per månad",
      "Grundläggande UF-vägledning",
    ],
    popular: false,
  },
  {
    name: "UF Growth",
    price: "49",
    credits: "100",
    model: "gpt-4.1-mini",
    description: "Idealisk för snabbväxande UF-team",
    features: [
      "AI-modell: 4.1 Mini",
      "100 AI-krediter per månad",
      "Personlig innehållskalender",
      "5 content-idéer per vecka",
      "Enkel prestandaanalys",
    ],
    popular: true,
  },
  {
    name: "UF Pro",
    price: "99",
    credits: "200",
    model: "gpt-4.1-mini + gpt-4o",
    description: "För etablerade företag med stora ambitioner",
    features: [
      "AI-modell: 4.1 Mini + 4o Premium",
      "200 AI-krediter per månad",
      "Premium AI för djupanalyser (4o)",
      "Komplett strategi + kalender",
      "Konkurrentanalys inkluderad",
      "Premium rapporter & insikter",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="relative py-24 md:py-32 px-4 overflow-hidden font-poppins">
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, hsl(260 60% 14% / 0.5) 0%, transparent 70%)' }} />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'hsl(260 70% 30% / 0.25)',
              border: '1px solid hsl(260 60% 50% / 0.25)',
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Priser</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight text-white">
            Enkla priser, <span className="text-gradient">kraftfulla resultat</span>
          </h2>
          <p className="text-base md:text-lg px-4" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
            Välj den plan som passar ditt företags tillväxtfas
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const planSlug = index === 0 ? "starter" : index === 1 ? "growth" : "pro";

            if (plan.popular) {
              return (
                /* Popular card: gradient border wrapper */
                <div
                  key={index}
                  className="relative lg:scale-105 rounded-2xl p-px"
                  style={{
                    background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))',
                  }}
                >
                  {/* Most popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-semibold shadow-md text-white whitespace-nowrap"
                      style={{
                        background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))',
                      }}
                    >
                      Mest populär
                    </span>
                  </div>

                  {/* Inner dark card */}
                  <div
                    className="rounded-2xl p-6 md:p-8 h-full"
                    style={{ background: 'hsl(240 50% 6%)' }}
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm mt-2" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{plan.description}</p>
                      </div>

                      <div className="pb-4" style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.08)' }}>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                          <span style={{ color: 'hsl(0 0% 100% / 0.55)' }}>kr/mån</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold text-gradient">{plan.credits}</span>
                          <span className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>krediter/mån</span>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: 'hsl(0 0% 100% / 0.1)' }}
                            >
                              <Check className="w-3 h-3 text-green-400" />
                            </div>
                            <span className="text-sm text-white/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to={`/checkout?plan=${planSlug}&type=plan`} className="block pt-2">
                        <Button
                          className="w-full text-white font-semibold"
                          size="lg"
                          style={{
                            background: 'linear-gradient(135deg, hsl(9 85% 55%), hsl(331 70% 45%))',
                            boxShadow: '0 8px 30px hsl(9 85% 45% / 0.4)',
                          }}
                        >
                          Köp plan
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={index}
                className="relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1"
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
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm mt-2" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{plan.description}</p>
                  </div>

                  <div className="pb-4" style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.08)' }}>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                      <span style={{ color: 'hsl(0 0% 100% / 0.55)' }}>kr/mån</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-gradient">{plan.credits}</span>
                      <span className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>krediter/mån</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: 'hsl(0 0% 100% / 0.1)' }}
                        >
                          <Check className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/checkout?plan=${planSlug}&type=plan`} className="block pt-2">
                    <Button
                      className="w-full text-white border"
                      size="lg"
                      style={{
                        background: 'hsl(0 0% 100% / 0.08)',
                        borderColor: 'hsl(0 0% 100% / 0.12)',
                      }}
                    >
                      Köp plan
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center mt-12 text-sm md:text-base px-4" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          Skapa din första strategi gratis · Ingen betalmetod krävs · Avsluta när du vill
        </p>

        {/* FAQ Section */}
        <PricingFAQ />
      </div>
    </section>
  );
};

export default Pricing;
