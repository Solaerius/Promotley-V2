import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 px-4 bg-gradient-diagonal overflow-hidden font-poppins">
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-10 w-64 h-64 bg-primary/15 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-10 w-80 h-80 bg-accent/15 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />

      <div className="container mx-auto relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Börja din tillväxtresa idag
          </div>

          {/* Headline */}
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight px-2">
            Nästa virala inlägg{" "}
            <span className="text-primary-glow">
              börjar här
            </span>
          </h2>

          {/* Subtext */}
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto px-4 leading-relaxed">
            Få din personliga innehållsstrategi - anpassad efter din budget, bransch och tillgängliga tid
          </p>

          {/* CTA Button */}
          <div className="pt-4">
            <Link to="/auth">
              <Button
                size="lg"
                className="text-lg px-10 py-7 bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-xl font-bold"
              >
                Starta gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex flex-wrap items-center justify-center gap-6 pt-6 text-white/70">
            <span className="text-sm font-medium">✓ Gratis strategisession</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-sm font-medium">✓ Ingen betalmetod krävs</span>
            <span className="hidden sm:inline text-white/30">•</span>
            <span className="text-sm font-medium">✓ Avsluta när du vill</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
