import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Gratis strategisession",
  "Ingen betalmetod krävs",
  "Avsluta när du vill",
];

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Concentrated radial glow background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 70% 80% at 50% 50%, hsl(260 70% 18%) 0%, hsl(240 50% 4%) 70%)',
        }}
      />


      <div className="container mx-auto px-4 md:px-6 relative z-10">
        {/* Gradient border ring around content */}
        <div
          className="max-w-3xl mx-auto rounded-3xl p-px"
          style={{
            background: 'linear-gradient(135deg, hsl(9 85% 55% / 0.4), hsl(331 70% 45% / 0.15), hsl(9 85% 55% / 0.4))',
          }}
        >
          <div
            className="rounded-3xl px-8 py-14 md:py-20 text-center"
            style={{ background: 'hsl(240 50% 7% / 0.85)' }}
          >
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
              style={{
                background: 'hsl(260 70% 30% / 0.25)',
                border: '1px solid hsl(260 60% 50% / 0.25)',
              }}
            >
              <Sparkles className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Börja din tillväxtresa idag</span>
            </div>

            {/* Headline */}
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6" style={{ textWrap: 'balance' }}>
              Nästa virala inlägg <span className="text-gradient">börjar här</span>
            </h2>

            {/* Subheadline */}
            <p
              className="text-lg md:text-xl mb-10 max-w-2xl mx-auto"
              style={{ color: 'hsl(0 0% 100% / 0.7)', textWrap: 'balance' }}
            >
              Få din personliga innehållsstrategi - anpassad efter din budget, bransch och tillgängliga tid
            </p>

            {/* CTA Button */}
            <Link to="/auth">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-white text-accent hover:bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-[1.03] mb-8 font-semibold"
              >
                Starta gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            {/* Benefits */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm" style={{ color: 'hsl(0 0% 100% / 0.6)' }}>
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
