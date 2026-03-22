import { Star } from "lucide-react";
import { useTranslation } from 'react-i18next';

const Testimonials = () => {
  const { t } = useTranslation();

  const testimonials = [
    {
      name: "Emma Andersson",
      company: "GreenTech UF",
      text: t('testimonials.t1_quote'),
      rating: 5,
    },
    {
      name: "Oscar Nilsson",
      company: "StreetStyle AB",
      text: t('testimonials.t2_quote'),
      rating: 5,
    },
    {
      name: "Lisa Bergström",
      company: "FoodieBox UF",
      text: t('testimonials.t3_quote'),
      rating: 5,
    },
    {
      name: "Viktor Larsson",
      company: "TechHub Startup",
      text: t('testimonials.t4_quote'),
      rating: 5,
    },
  ];

  return (
    <section className="relative py-14 md:py-20 overflow-hidden">
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 30% 60%, hsl(var(--primary) / 0.1) 0%, transparent 70%)' }} />

      <div className="container mx-auto px-4 md:px-6 relative z-10 max-w-6xl">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{
              background: 'hsl(var(--primary) / 0.15)',
              border: '1px solid hsl(var(--primary) / 0.3)',
            }}
          >
            <Star className="w-4 h-4 text-foreground fill-foreground" />
            <span className="text-sm font-medium text-foreground">{t('testimonials.badge')}</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4" style={{ textWrap: 'balance' }}>
            {t('testimonials.title')} <span className="text-gradient">{t('testimonials.title_strong')}</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(var(--muted-foreground))', textWrap: 'balance' }}>
            {t('testimonials.subtitle')}
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid sm:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300"
              style={{
                background: 'hsl(0 0% 100% / 0.04)',
                border: '1px solid hsl(0 0% 100% / 0.08)',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.07)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.14)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.background = 'hsl(0 0% 100% / 0.04)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'hsl(0 0% 100% / 0.08)';
              }}
            >
              {/* Decorative oversized quote mark */}
              <div
                className="absolute top-4 right-6 text-8xl font-serif leading-none select-none pointer-events-none"
                style={{ color: 'hsl(var(--accent-brand) / 0.15)' }}
              >
                "
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4 relative z-10">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-foreground/90 mb-6 leading-relaxed relative z-10">
                "{testimonial.text}"
              </p>

              {/* Author */}
              <div
                className="pt-4 flex items-center gap-3 relative z-10"
                style={{ borderTop: '1px solid hsl(0 0% 100% / 0.08)' }}
              >
                {/* Gradient avatar with initial */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--accent-brand)), hsl(var(--primary)))',
                  }}
                >
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm" style={{ color: 'hsl(var(--muted-foreground))' }}>{testimonial.company}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
