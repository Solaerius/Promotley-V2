import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, TrendingUp, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(344_45%_8%)] via-[hsl(331_56%_15%)] to-[hsl(9_84%_20%)]" />
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-20 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/80 backdrop-blur-sm rounded-full border shadow-elegant">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">För UF-företag som vill växa snabbare</span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            Få fler kunder med{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              smart AI
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Dubbla ditt engagemang och nå rätt målgrupp. Få personliga förslag som faktiskt 
            ökar din försäljning och hjälper ditt UF-företag växa.
          </p>

          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="w-5 h-5 text-accent" />
              <span>Dubbla ditt engagemang</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sparkles className="w-5 h-5 text-accent" />
              <span>Nå fler kunder</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-5 h-5 text-accent" />
              <span>Spara 5+ timmar/vecka</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="text-lg">
                Kom igång gratis
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg" className="text-lg">
                Se demo
              </Button>
            </Link>
          </div>

          {/* Social proof */}
          <p className="text-sm text-muted-foreground pt-4">
            ✨ 1 gratis AI-förslag · Ingen betalmetod krävs
          </p>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
    </section>
  );
};

export default Hero;
