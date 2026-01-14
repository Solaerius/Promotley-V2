import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";

const benefits = [
  "Gratis strategisession",
  "Ingen betalmetod krävs", 
  "Avsluta när du vill"
];

const FinalCTA = () => {
  return (
    <section className="relative py-24 md:py-32 bg-background overflow-hidden">
      {/* Decorative blur orb */}
      <div className="blur-orb blur-orb-primary w-[600px] h-[600px] -top-64 left-1/2 -translate-x-1/2" />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Börja din tillväxtresa idag</span>
          </div>
          
          {/* Headline */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6" style={{ textWrap: 'balance' }}>
            Nästa virala inlägg <span className="text-gradient">börjar här</span>
          </h2>
          
          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Få din personliga innehållsstrategi - anpassad efter din budget, bransch och tillgängliga tid
          </p>
          
          {/* CTA Button */}
          <Link to="/auth">
            <Button 
              variant="gradient" 
              size="lg"
              className="text-lg px-10 py-7 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] mb-8"
            >
              Starta gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          
          {/* Benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-success" />
                <span>{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FinalCTA;
