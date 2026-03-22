import { useRef } from "react";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogoStrip from "@/components/LogoStrip";
import ProblemSection from "@/components/ProblemSection";
import HowItWorks from "@/components/HowItWorks";
import ResultsSection from "@/components/ResultsSection";
import DemoPreviewSection from "@/components/DemoPreviewSection";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import TrustSection from "@/components/TrustSection";
import FinalCTA from "@/components/FinalCTA";
import CookieConsent from "@/components/CookieConsent";
import ChatWidget from "@/components/ChatWidget";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import Footer from "@/components/Footer";
const Index = () => {
  const logoStripRef = useRef<HTMLDivElement>(null);
  return <div className="min-h-screen relative bg-[hsl(var(--gradient-hero-bg))]">
      {/* Single continuous grid texture for the whole page */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(hsl(0 0% 100%) 1px, transparent 1px), linear-gradient(90deg, hsl(0 0% 100%) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          opacity: 0.025,
          zIndex: 0,
        }}
      />
      <Navbar logoStripRef={logoStripRef} />
      <Hero />
      <LogoStrip ref={logoStripRef} />
      
      <AnimatedSection animation="slide-up">
        <ProblemSection />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-in-scale" delay={100}>
        <HowItWorks />
      </AnimatedSection>
      
      <ResultsSection />
      
      <AnimatedSection animation="slide-up" delay={100}>
        <DemoPreviewSection />
      </AnimatedSection>
      
      <div id="pricing">
        <AnimatedSection animation="fade-in" delay={100}>
          <Pricing />
        </AnimatedSection>
      </div>
      
      <AnimatedSection animation="slide-up">
        <Testimonials />
      </AnimatedSection>
      
      <AnimatedSection animation="fade-in-scale" delay={100}>
        <TrustSection />
      </AnimatedSection>
      
      <FinalCTA />

      <Footer />

      <CookieConsent />

      {/* Chat Widget */}
      <ChatWidget />
      
      {/* Back to Top Button */}
      <BackToTop />
    </div>;
};
export default Index;