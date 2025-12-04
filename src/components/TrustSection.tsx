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
    <section className="py-24 md:py-32 px-4 bg-muted/30 font-poppins">
      <div className="container mx-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16 md:mb-20 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
              <Shield className="w-4 h-4" />
              Säkerhet & Integritet
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold px-2 leading-tight">
              Din data är trygg hos oss
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">
              Vi tar säkerhet och integritet på största allvar. Din information delas aldrig med tredje part.
            </p>
          </div>

          {/* Trust features grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="p-6 bg-card border border-border/50 hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-bold">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Additional info */}
          <Card className="mt-10 p-6 md:p-8 bg-gradient-hero border border-primary/20 text-center">
            <p className="text-foreground md:text-lg mb-2 leading-relaxed">
              Vi använder samma säkerhetsstandarder som banker och följer alla GDPR-krav. 
              Din data är krypterad både i transit och i vila.
            </p>
            <p className="text-muted-foreground text-sm md:text-base">
              Data lagras säkert inom EU.
            </p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
