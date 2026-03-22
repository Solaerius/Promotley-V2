import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PricingFAQ from "./PricingFAQ";

const Pricing = () => {
  const { t } = useTranslation();

  const plans = [
    {
      name: "UF Starter",
      price: "29",
      credits: "50",
      description: t('pricing.starter_desc'),
      features: [
        t('pricing.starter_f1'),
        t('pricing.starter_f2'),
        t('pricing.starter_f3'),
        t('pricing.starter_f4'),
        t('pricing.starter_f5'),
      ],
      popular: false,
    },
    {
      name: "UF Growth",
      price: "49",
      credits: "100",
      description: t('pricing.growth_desc'),
      features: [
        t('pricing.growth_f1'),
        t('pricing.growth_f2'),
        t('pricing.growth_f3'),
        t('pricing.growth_f4'),
        t('pricing.growth_f5'),
      ],
      popular: true,
    },
    {
      name: "UF Pro",
      price: "99",
      credits: "200",
      description: t('pricing.pro_desc'),
      features: [
        t('pricing.pro_f1'),
        t('pricing.pro_f2'),
        t('pricing.pro_f3'),
        t('pricing.pro_f4'),
        t('pricing.pro_f5'),
        t('pricing.pro_f6'),
      ],
      popular: false,
    },
  ];

  return (
    <section id="pricing" className="relative py-14 md:py-20 px-4 overflow-hidden font-poppins">
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 55% at 50% 40%, hsl(var(--primary) / 0.12) 0%, transparent 70%)' }} />

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <div className="max-w-3xl mx-auto text-center mb-16 md:mb-20 space-y-4">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{
              background: 'hsl(var(--primary) / 0.15)',
              border: '1px solid hsl(var(--primary) / 0.3)',
            }}
          >
            <Sparkles className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">{t('pricing.section_label')}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold px-2 leading-tight text-white">
            {t('pricing.title')}, <span className="text-gradient">{t('pricing.strong_results')}</span>
          </h2>
          <p className="text-base md:text-lg px-4" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
            {t('pricing.section_subtitle')}
          </p>
        </div>

        {/* Pricing cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const planSlug = index === 0 ? "starter" : index === 1 ? "growth" : "pro";

            if (plan.popular) {
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative lg:scale-105 rounded-2xl p-px ring-2 ring-primary"
                  style={{
                    background: 'linear-gradient(135deg, hsl(var(--accent-brand)), hsl(var(--primary)))',
                  }}
                >
                  {/* Most popular badge */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg whitespace-nowrap">
                      {t('pricing.badge_popular')}
                    </span>
                  </div>

                  {/* Inner dark card */}
                  <div
                    className="rounded-2xl p-6 md:p-8 h-full bg-primary/5"
                    style={{ background: 'hsl(347 40% 8%)' }}
                  >
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{plan.name}</h3>
                        <p className="text-sm mt-2" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{plan.description}</p>
                      </div>

                      <div className="pb-4" style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.08)' }}>
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                          <span style={{ color: 'hsl(0 0% 100% / 0.55)' }}>kr{t('pricing.per_month')}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-2xl font-bold text-gradient">{plan.credits}</span>
                          <span className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{t('pricing.credits_month')}</span>
                        </div>
                      </div>

                      <ul className="space-y-3">
                        {plan.features.map((feature, fIndex) => (
                          <li key={fIndex} className="flex items-start gap-3">
                            <div
                              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                              style={{ background: 'hsl(0 0% 100% / 0.1)' }}
                            >
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                            </div>
                            <span className="text-sm text-white/80">{feature}</span>
                          </li>
                        ))}
                      </ul>

                      <Link to={`/checkout?plan=${planSlug}&type=plan`} className="block pt-2">
                        <Button
                          className="w-full text-white font-semibold"
                          size="lg"
                          style={{
                            background: 'linear-gradient(135deg, hsl(var(--accent-brand)), hsl(var(--primary)))',
                            boxShadow: '0 8px 30px hsl(var(--accent-brand) / 0.4)',
                          }}
                        >
                          {t('pricing.cta')}
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            }

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="relative rounded-2xl p-6 md:p-8 transition-all duration-300 hover:-translate-y-1 bg-card border-border/40"
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
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-white">{plan.name}</h3>
                    <p className="text-sm mt-2" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{plan.description}</p>
                  </div>

                  <div className="pb-4" style={{ borderBottom: '1px solid hsl(0 0% 100% / 0.08)' }}>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl md:text-5xl font-bold text-white">{plan.price}</span>
                      <span style={{ color: 'hsl(0 0% 100% / 0.55)' }}>kr{t('pricing.per_month')}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-2xl font-bold text-gradient">{plan.credits}</span>
                      <span className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>{t('pricing.credits_month')}</span>
                    </div>
                  </div>

                  <ul className="space-y-3">
                    {plan.features.map((feature, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-3">
                        <div
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ background: 'hsl(0 0% 100% / 0.1)' }}
                        >
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        </div>
                        <span className="text-sm text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to={`/checkout?plan=${planSlug}&type=plan`} className="block pt-2">
                    <Button
                      className="w-full text-white border"
                      size="lg"
                      style={{
                        background: 'hsl(0 0% 100% / 0.08)',
                        borderColor: 'hsl(0 0% 100% / 0.12)',
                      }}
                    >
                      {t('pricing.cta')}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <p className="text-center mt-12 text-sm md:text-base px-4" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
          {t('pricing.bottom_note')}
        </p>

        {/* FAQ Section */}
        <PricingFAQ />
      </div>
    </section>
  );
};

export default Pricing;
