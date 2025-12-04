import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ArrowRight } from "lucide-react";
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
      "AI-modell: GPT-4o Mini",
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
      "AI-modell: GPT-4.1 Mini",
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
    credits: "300",
    model: "gpt-5.1",
    description: "För etablerade företag med stora ambitioner",
    features: [
      "AI-modell: GPT-5.1 (senaste)",
      "300 AI-krediter per månad",
      "Komplett strategi + kalender",
      "Creative Mode (fri AI-generering)",
      "Konkurrentanalys inkluderad",
      "Premium rapporter & insikter",
    ],
    popular: false,
  },
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-24 md:py-32 px-4 bg-background font-poppins">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider">Priser</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight">
            Enkla priser,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              kraftfulla resultat
            </span>
          </h2>
          <p className="text-base md:text-lg text-muted-foreground px-4">
            Välj den plan som passar ditt företags tillväxtfas
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <Card
              key={index}
              className={`relative p-6 md:p-8 bg-card transition-all duration-300 hover:-translate-y-1 ${
                plan.popular
                  ? "border-2 border-primary shadow-elegant lg:scale-105"
                  : "border border-border/50 hover:border-primary/30 hover:shadow-lg"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-primary text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-md whitespace-nowrap">
                    Mest populär ⭐
                  </span>
                </div>
              )}

              <div className="space-y-6">
                {/* Plan header */}
                <div>
                  <h3 className="text-xl md:text-2xl font-bold">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mt-2">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="pb-4 border-b border-border/50">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl md:text-5xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">kr/mån</span>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-2xl font-bold text-primary">{plan.credits}</span>
                    <span className="text-sm text-muted-foreground">krediter/mån</span>
                  </div>
                </div>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, fIndex) => (
                    <li key={fIndex} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3 h-3 text-primary" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link to="/auth" className="block pt-2">
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    className="w-full"
                    size="lg"
                  >
                    Starta gratis
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-muted-foreground mt-12 text-sm md:text-base px-4">
          Skapa din första strategi gratis · Ingen betalmetod krävs · Avsluta när du vill
        </p>

        {/* FAQ Section */}
        <PricingFAQ />
      </div>
    </section>
  );
};

export default Pricing;
