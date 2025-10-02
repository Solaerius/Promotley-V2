import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <div id="features">
        <Features />
      </div>
      <div id="pricing">
        <Pricing />
      </div>
      
      {/* Footer */}
      <footer className="border-t py-12 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>© 2025 Promotely. AI-driven marknadsföring för UF-företag.</p>
          <div className="mt-4">
            <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
              Integritetspolicy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
