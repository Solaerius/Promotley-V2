import { Card } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Emma Andersson",
    company: "GreenTech UF",
    text: "Vi gick från 300 till 12 000 visningar på två veckor! AI:n gav oss exakt vad vi behövde.",
    rating: 5,
  },
  {
    name: "Oscar Nilsson",
    company: "StreetStyle AB",
    text: "Promotley är som att ha en marknadsförare som jobbar 24/7. Spartid och får bättre resultat!",
    rating: 5,
  },
  {
    name: "Lisa Bergström",
    company: "FoodieBox UF",
    text: "Hashtag-förslagen var spot on! Vårt engagemang har mer än fördubblats sedan vi började.",
    rating: 5,
  },
  {
    name: "Viktor Larsson",
    company: "TechHub Startup",
    text: "AI-analyserna hjälpte oss hitta rätt målgrupp. Nu växer vi exponentiellt varje vecka.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 px-4 bg-gradient-warm font-poppins relative overflow-hidden">
      {/* Decorative glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      
      <div className="container mx-auto relative z-10">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white">
            Vad säger andra företag?
          </h2>
          <p className="text-xl text-white/80">
            Hundratals UF-företag och startups växer redan med oss
          </p>
        </div>

        {/* Testimonials grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card
              key={index}
              className="p-6 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/15 transition-all duration-300 hover:-translate-y-2"
            >
              <div className="space-y-4">
                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                  ))}
                </div>

                {/* Text */}
                <p className="text-white leading-relaxed mt-4">
                  "{testimonial.text}"
                </p>

                {/* Author */}
                <div className="pt-4 border-t border-white/20">
                  <div className="font-bold text-white">{testimonial.name}</div>
                  <div className="text-sm text-white/70">{testimonial.company}</div>
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
