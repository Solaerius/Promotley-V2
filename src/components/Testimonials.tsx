import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Emma Andersson",
    company: "GreenTech UF",
    text: "Promotley skapade en postningsplan som passade vår budget perfekt. Vi gick från 300 till 12 000 visningar på två veckor!",
    rating: 5,
  },
  {
    name: "Oscar Nilsson",
    company: "StreetStyle AB",
    text: "Äntligen vet jag exakt när och hur ofta jag ska posta. Ingen gissning längre - bara en strategi som funkar!",
    rating: 5,
  },
  {
    name: "Lisa Bergström",
    company: "FoodieBox UF",
    text: "De anpassade strategin efter vår bransch och budget på 400 kr/mån. Vårt engagemang har mer än fördubblats!",
    rating: 5,
  },
  {
    name: "Viktor Larsson",
    company: "TechHub Startup",
    text: "Komplett innehållskalender varje vecka, anpassad efter hur mycket tid vi har. Sparat oss timmar av planering!",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Background with diagonal gradient */}
      <div className="absolute inset-0 bg-gradient-diagonal" />
      
      {/* Fluid blur orbs */}
      <div className="blur-orb blur-orb-secondary w-[500px] h-[500px] top-0 left-0 animate-glow-pulse" />
      <div className="blur-orb blur-orb-primary w-[400px] h-[400px] bottom-0 right-1/4 animate-glow-pulse" style={{ animationDelay: '1.2s' }} />
      
      {/* Top blend */}
      <div 
        className="absolute top-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to bottom, hsl(344 55% 12%) 0%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />
      
      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6 backdrop-blur-sm">
            <Star className="w-4 h-4 text-white fill-white" />
            <span className="text-sm font-medium text-white">Recensioner</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            Vad säger <span className="text-gradient">andra företag?</span>
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto" style={{ textWrap: 'balance' }}>
            Hundratals UF-företag och startups växer redan med oss
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={index}
              className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/[0.15] hover:border-white/30 transition-all duration-300 group"
            >
              <CardContent className="p-6 md:p-8">
                {/* Quote Icon */}
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-white/60" />
                </div>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-white/90 mb-6 leading-relaxed">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-white/10 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-white/60">{testimonial.company}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      {/* Bottom blend */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-48 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, hsl(344 55% 12%) 0%, transparent 100%)',
          filter: 'blur(30px)',
        }}
      />
    </section>
  );
};

export default Testimonials;
