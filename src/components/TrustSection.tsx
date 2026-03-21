import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { useTranslation } from 'react-i18next';

const trustFeatures = [
  {
    icon: Lock,
    title: "AES-256 Kryptering",
    description: "All din data krypteras med samma standard som banker använder.",
  },
  {
    icon: Eye,
    title: "Du äger din data",
    description: "Vi delar aldrig din information. Du kan radera allt när som helst.",
  },
  {
    icon: Shield,
    title: "GDPR-kompatibelt",
    description: "Full transparens och kontroll enligt EU:s integritetslagar.",
  },
  {
    icon: FileCheck,
    title: "Säkra anslutningar",
    description: "OAuth-integration med Meta & TikTok - inga lösenord sparas.",
  },
];

const TrustSection = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Section accent glow */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 60% 50% at 70% 50%, hsl(var(--primary) / 0.1) 0%, transparent 70%)' }} />

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
            <Shield className="w-4 h-4 text-white" />
            <span className="text-sm font-medium text-white">Säkerhet & Integritet</span>
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4" style={{ textWrap: 'balance' }}>
            Din data är <span className="text-gradient">trygg hos oss</span>
          </h2>
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'hsl(0 0% 100% / 0.55)', textWrap: 'balance' }}>
            Vi tar säkerhet och integritet på största allvar
          </p>
        </div>

        {/* Trust Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                className="rounded-2xl p-6 transition-all duration-300 group"
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
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: 'hsl(0 0% 100% / 0.06)' }}
                >
                  <Icon className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Bottom Trust Badge */}
        <div className="mt-12 text-center">
          <div
            className="inline-flex items-center gap-3 px-5 py-3 rounded-full"
            style={{
              background: 'hsl(0 0% 100% / 0.04)',
              border: '1px solid hsl(0 0% 100% / 0.08)',
            }}
          >
            <Lock className="w-5 h-5 shrink-0" style={{ color: 'hsl(0 0% 100% / 0.55)' }} />
            <p className="text-sm" style={{ color: 'hsl(0 0% 100% / 0.55)' }}>
              256-bit SSL · Data lagras säkert inom EU · GDPR-kompatibel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
