import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Sparkles, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const AIDemoSection = () => {
  return (
    <section id="demo" className="py-24 md:py-32 px-4 bg-muted/30 font-poppins">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Brain className="w-4 h-4" />
              Personlig Strategi
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight">
              Din kompletta{" "}
              <span className="text-transparent bg-clip-text bg-gradient-primary">
                innehållsstrategi
              </span>
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Ingen gissningar - bara en skräddarsydd plan baserad på din budget, bransch och tillgängliga tid
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left - Dashboard mockup */}
            <Card className="p-6 md:p-8 bg-card border-2 border-border/50 shadow-lg overflow-hidden">
              <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4 pb-4 border-b border-border">
                  <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                    <Brain className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-lg">Ditt Dashboard</div>
                    <div className="text-sm text-muted-foreground">Instagram Analys</div>
                  </div>
                </div>

                {/* Stats preview */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                    <div className="text-3xl font-bold text-primary">12.5K</div>
                    <div className="text-sm text-muted-foreground mt-1">Visningar</div>
                  </div>
                  <div className="p-5 rounded-xl bg-muted/50 border border-border/50">
                    <div className="text-3xl font-bold text-accent">8.2%</div>
                    <div className="text-sm text-muted-foreground mt-1">Engagemang</div>
                  </div>
                </div>

                {/* Graph placeholder */}
                <div className="h-40 rounded-xl bg-gradient-hero border border-border/50 flex items-end justify-around p-6">
                  {[40, 65, 45, 80, 70, 90, 85].map((height, i) => (
                    <div
                      key={i}
                      className="w-8 md:w-10 bg-gradient-primary rounded-t-lg transition-all duration-300 hover:opacity-80"
                      style={{ height: `${height}%` }}
                    />
                  ))}
                </div>
              </div>
            </Card>

            {/* Right - AI strategy output */}
            <div className="space-y-5">
              {[
                {
                  title: "Din postningsstrategi:",
                  content: "Baserat på din budget (500 kr/mån) och tillgänglig tid:",
                  highlight: "Posta 3 gånger/vecka på Instagram Reels",
                  detail: "måndagar 18:00, onsdagar 19:30, fredagar 17:00.",
                  color: "primary",
                },
                {
                  title: "Innehållsplan denna vecka:",
                  content: "Måndag: Produktlansering (15s Reel). Onsdag: Kundcase/testimonial (Story + Reel). Fredag: Bakom kulisserna (30s Reel).",
                  highlight: "Allt innehåll förberett av AI",
                  detail: "",
                  color: "accent",
                },
                {
                  title: "Branschanpassning:",
                  content: "Som UF-företag inom",
                  highlight: "hållbara produkter",
                  detail: ": Fokusera på #hållbarhet #ufföretag2025 och samarbeta med eco-influencers inom din budget.",
                  color: "primary-glow",
                },
              ].map((item, index) => (
                <Card 
                  key={index}
                  className="p-6 bg-card border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-300"
                  style={{ animationDelay: `${index * 0.15}s` }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className={`w-5 h-5 text-${item.color}`} />
                    </div>
                    <div className="space-y-2">
                      <div className="font-bold text-lg">{item.title}</div>
                      <p className="text-foreground leading-relaxed">
                        {item.content}{" "}
                        <span className={`font-semibold text-${item.color}`}>{item.highlight}</span>
                        {item.detail && ` ${item.detail}`}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              {/* CTA */}
              <div className="pt-4">
                <Link to="/auth?from=demo">
                  <Button 
                    variant="gradient" 
                    size="lg" 
                    className="w-full text-lg py-6 shadow-elegant hover:scale-[1.02] transition-transform"
                  >
                    Skapa min personliga strategi
                    <ArrowRight className="w-5 h-5 ml-2" />
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
