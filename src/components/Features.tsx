import { Card } from "@/components/ui/card";
import { BarChart3, Brain, Hash, Clock, Sparkles, Target } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-driven analys",
    description: "OpenAI analyserar din statistik från Instagram, TikTok och Facebook för att hitta förbättringsområden.",
  },
  {
    icon: Sparkles,
    title: "Innehållsförslag",
    description: "Få färdiga inläggsidéer med captions, hashtags och optimal postningstid - allt skräddarsytt för din målgrupp.",
  },
  {
    icon: BarChart3,
    title: "Smart dashboard",
    description: "Se all din statistik på ett ställe med AI-highlightade insikter som visar vad du bör fokusera på.",
  },
  {
    icon: Target,
    title: "Kontextuella råd",
    description: "AI:n ger konkreta förslag direkt vid relevant data - t.ex. \"Öka CTR genom att ändra CTA i dina Reels\".",
  },
  {
    icon: Hash,
    title: "Optimerade hashtags",
    description: "Få förslag på populära och relevanta hashtags baserat på ditt innehåll och bransch.",
  },
  {
    icon: Clock,
    title: "Bästa postningstid",
    description: "AI analyserar när din publik är som mest aktiv och rekommenderar optimal tid att publicera.",
  },
];

const Features = () => {
  return (
    <section className="py-24 px-4">
      <div className="container mx-auto">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold">
            Allt du behöver för att{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              växa snabbt
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Promotley kombinerar avancerad AI-teknologi med djup förståelse för sociala medier
          </p>
        </div>

        {/* Bento Grid Layout */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[180px]">
          {/* AI-driven analys - Large featured card */}
          <Card className="md:col-span-3 md:row-span-2 p-8 relative overflow-hidden group hover:shadow-elegant transition-all duration-500 border-border/50 bg-gradient-to-br from-background to-accent/5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-full blur-3xl group-hover:opacity-20 transition-opacity" />
            <div className="relative z-10 h-full flex flex-col justify-between">
              <div>
                <div className="w-16 h-16 rounded-xl bg-gradient-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-4">AI-driven analys</h3>
                <p className="text-muted-foreground leading-relaxed">
                  OpenAI analyserar din statistik från Instagram, TikTok och Facebook för att hitta förbättringsområden.
                </p>
              </div>
            </div>
          </Card>

          {/* Innehållsförslag - Medium card */}
          <Card className="md:col-span-3 p-6 relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Innehållsförslag</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Få färdiga inläggsidéer med captions, hashtags och optimal postningstid.
                </p>
              </div>
            </div>
          </Card>

          {/* Smart dashboard - Tall card */}
          <Card className="md:col-span-2 md:row-span-2 p-6 relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50 bg-gradient-to-b from-background to-primary/5">
            <div className="h-full flex flex-col justify-between">
              <div>
                <div className="w-14 h-14 rounded-xl bg-gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <BarChart3 className="w-7 h-7 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Smart dashboard</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Se all din statistik på ett ställe med AI-highlightade insikter.
                </p>
              </div>
            </div>
          </Card>

          {/* Kontextuella råd - Wide card */}
          <Card className="md:col-span-4 p-6 relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Kontextuella råd</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  AI:n ger konkreta förslag direkt vid relevant data - t.ex. "Öka CTR genom att ändra CTA i dina Reels".
                </p>
              </div>
            </div>
          </Card>

          {/* Optimerade hashtags */}
          <Card className="md:col-span-3 p-6 relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Hash className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Optimerade hashtags</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Få förslag på populära och relevanta hashtags baserat på ditt innehåll.
                </p>
              </div>
            </div>
          </Card>

          {/* Bästa postningstid */}
          <Card className="md:col-span-3 p-6 relative overflow-hidden group hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 border-border/50">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <Clock className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Bästa postningstid</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  AI analyserar när din publik är som mest aktiv och rekommenderar optimal tid.
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Features;
