import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const AIDemoSection = () => {
  return (
    <section id="demo" className="py-24 px-4 bg-background font-poppins">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-primary rounded-full text-white text-sm font-semibold mb-4">
              <Brain className="w-4 h-4" />
              AI i Aktion
            </div>
            <h2 className="text-4xl md:text-5xl font-bold">
              Se hur vår{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                AI arbetar
              </span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left - Dashboard mockup */}
            <Card className="p-6 bg-gradient-hero border-2 border-primary/20 shadow-elegant">
              <div className="space-y-4">
                <div className="flex items-center gap-3 pb-4 border-b border-border">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary" />
                  <div>
                    <div className="font-bold">Ditt Dashboard</div>
                    <div className="text-sm text-muted-foreground">Instagram Analys</div>
                  </div>
                </div>

                {/* Stats preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-2xl font-bold text-primary">12.5K</div>
                    <div className="text-sm text-muted-foreground">Visningar</div>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <div className="text-2xl font-bold text-accent">8.2%</div>
                    <div className="text-sm text-muted-foreground">Engagemang</div>
                  </div>
                </div>

                {/* Graph placeholder */}
                <div className="h-32 rounded-lg bg-gradient-primary/10 border border-primary/20 flex items-end justify-around p-4">
                  {[40, 65, 45, 80, 70, 90, 85].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 bg-gradient-primary rounded-t"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Right - AI suggestions */}
            <div className="space-y-6">
              <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-hero border-2 border-primary/20 animate-fade-in">
                <Sparkles className="w-6 h-6 text-primary shrink-0 animate-pulse" />
                <div className="space-y-2">
                  <div className="font-bold text-lg">Promotley föreslår:</div>
                  <p className="text-foreground leading-relaxed">
                    "Dina Reels får <span className="font-bold text-primary">3× mer engagemang</span> än vanliga inlägg. Lägg upp fler Reels mellan 18-20 när din publik är mest aktiv."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-hero border-2 border-primary/20 animate-fade-in" style={{ animationDelay: "0.2s" }}>
                <Sparkles className="w-6 h-6 text-accent shrink-0 animate-pulse" />
                <div className="space-y-2">
                  <div className="font-bold text-lg">Innehållsidé:</div>
                  <p className="text-foreground leading-relaxed">
                    "Skapa en 'bakom kulisserna'-serie. Inlägg med #ufföretag och #entrepren&ouml;r får <span className="font-bold text-accent">+240% mer räckvidd</span> i din nisch."
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-xl bg-gradient-hero border-2 border-primary/20 animate-fade-in" style={{ animationDelay: "0.4s" }}>
                <Sparkles className="w-6 h-6 text-primary-glow shrink-0 animate-pulse" />
                <div className="space-y-2">
                  <div className="font-bold text-lg">Optimering:</div>
                  <p className="text-foreground leading-relaxed">
                    "Lägg till en tydligare call-to-action i din bio. Profiler med CTA får <span className="font-bold text-primary-glow">+180% fler klick</span>."
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4">
                <Link to="/auth">
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full text-lg py-6 shadow-glow hover:scale-105 transition-transform"
                  >
                    Få ditt första AI-förslag gratis
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIDemoSection;
