import { Shield, Lock, Eye, FileCheck } from "lucide-react";
import { Card } from "@/components/ui/card";

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
  return (
    <section className="py-24 px-4 bg-gradient-diagonal font-poppins">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 text-white text-sm font-semibold mb-4">
              <Shield className="w-4 h-4" />
              Säkerhet & Integritet
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-white">
              Din data är trygg hos oss
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Vi tar säkerhet och integritet på största allvar. Din information delas aldrig med tredje part.
            </p>
          </div>

          {/* Trust features grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-white/10 backdrop-blur-md border-2 border-white/20 hover:bg-white/15 transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-white">{feature.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Additional info */}
          <div className="mt-12 p-8 rounded-2xl bg-white/5 backdrop-blur-md border border-white/20 text-center">
            <p className="text-white/90 text-lg mb-3">
              Vi använder samma säkerhetsstandarder som banker och följer alla GDPR-krav. 
              Din data är krypterad både i transit och i vila.
            </p>
            <p className="text-white/80 text-base">
              Data lagras säkert inom EU.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
