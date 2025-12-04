import { Card } from "@/components/ui/card";
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
    <section className="py-24 md:py-32 px-4 bg-gradient-diagonal font-poppins relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10 max-w-6xl">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white px-2 leading-tight text-balance">
            Vad säger andra företag?
          </h2>
          <p className="text-base md:text-lg text-white/70 px-4 max-w-xl mx-auto">
            Hundratals UF-företag och startups växer redan med oss
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 md:p-8 bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300"
            >
              <div className="space-y-5">
                {/* Quote icon */}
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                  <Quote className="w-5 h-5 text-primary-glow" />
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-base md:text-lg text-white/90 leading-relaxed">
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
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
