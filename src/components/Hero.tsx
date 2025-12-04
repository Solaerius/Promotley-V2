import { Button } from "@/components/ui/button";
import { ArrowRight, TrendingUp, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import gamlastan from "@/assets/gamlastan.png";
import { useAuth } from "@/hooks/useAuth";

const Hero = () => {
  const { user } = useAuth();
  
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden font-poppins">
      {/* Background image */}
      <div className="absolute inset-0">
        <img 
          src={gamlastan} 
          alt="Stockholm Gamla Stan background" 
          className="w-full h-full object-cover object-[center_67%] blur-[3px] opacity-40"
        />
      </div>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      
      {/* Floating glow elements */}
      <div className="absolute top-32 left-10 w-64 h-64 md:w-96 md:h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-32 right-10 w-72 h-72 md:w-[28rem] md:h-[28rem] bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
      
      {/* Content */}
      <div className="container relative z-10 px-4 py-32 md:py-40 mx-auto">
        <div className="max-w-4xl mx-auto text-center space-y-8 md:space-y-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 backdrop-blur-sm rounded-full border border-primary/20 text-foreground text-sm font-medium animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-driven marknadsföring för UF-företag
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight animate-fade-in text-foreground leading-[1.1] px-2 text-balance">
            Bli företaget alla{" "}
            <span className="text-transparent bg-clip-text bg-gradient-primary">
              pratar om
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-slide-up font-medium px-4">
            AI som hjälper UF-företag och startups att växa snabbare på sociala medier
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-slide-up px-4" style={{ animationDelay: "0.2s" }}>
            <Link to="/auth">
              <Button variant="gradient" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 shadow-elegant font-semibold">
                Starta gratis
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={user ? "/join-organization" : "/auth?mode=join"}>
              <Button variant="outline" size="lg" className="text-base sm:text-lg px-8 sm:px-10 py-6 border-border/50 hover:bg-accent/5 font-medium">
                Anslut till företag
              </Button>
            </Link>
          </div>

          {/* Secondary link */}
          <div className="animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <a href="#how-it-works">
              <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
                Se hur det funkar
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>
          </div>

          {/* Social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 text-muted-foreground animate-fade-in" style={{ animationDelay: "0.4s" }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-bold text-foreground">100+</p>
                <p className="text-sm">UF-företag växer med oss</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-10 bg-border" />
            <div className="text-sm">
              <span className="text-foreground font-medium">Ingen kortinformation krävs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default Hero;
