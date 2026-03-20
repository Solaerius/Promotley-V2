import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Platform SVG logos
const TikTokLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" className="h-5 w-5">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const AppleLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
    <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
  </svg>
);

const OAuthButton = ({
  onClick, logo, label, delay
}: { onClick: () => void; logo: React.ReactNode; label: string; delay: number }) => (
  <motion.button
    initial={{ opacity: 0, x: 20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.4, ease: "easeOut" }}
    onClick={onClick}
    className="flex items-center gap-3 w-full px-5 py-3.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 transition-colors text-white text-sm font-medium backdrop-blur-sm"
  >
    {logo}
    <span>{label}</span>
  </motion.button>
);

const Hero = () => {
  const { toast } = useToast();

  const handleGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast({ title: "Fel", description: error.message, variant: "destructive" });
  };

  const handleApple = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "apple",
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) toast({ title: "Fel", description: error.message, variant: "destructive" });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% -10%, hsl(260 70% 18%) 0%, hsl(240 50% 6%) 55%, hsl(240 50% 3%) 100%)',
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Heading */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1
                className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-none"
                style={{ color: 'hsl(0 0% 98%)' }}
              >
                Marknadsför
                <br />
                <span style={{ color: 'hsl(260 70% 65%)' }}>nu</span>
              </h1>
              <p className="text-lg md:text-xl font-light max-w-lg" style={{ color: 'hsl(0 0% 70%)' }}>
                Gör marknadsföringen rätt med våra verktyg — AI-driven strategi, captions och analys för svenska företag.
              </p>
            </motion.div>
          </div>

          {/* Right: OAuth buttons */}
          <div className="flex flex-col gap-3 max-w-sm lg:ml-auto w-full">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-sm mb-2 font-medium"
              style={{ color: 'hsl(0 0% 55%)' }}
            >
              Kom igång på sekunder
            </motion.p>

            <OAuthButton
              onClick={() => window.location.href = '/auth'}
              logo={<TikTokLogo />}
              label="Fortsätt med TikTok"
              delay={0.35}
            />
            <OAuthButton
              onClick={handleGoogle}
              logo={<GoogleLogo />}
              label="Fortsätt med Google"
              delay={0.45}
            />
            <OAuthButton
              onClick={handleApple}
              logo={<AppleLogo />}
              label="Fortsätt med Apple"
              delay={0.55}
            />

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-center"
            >
              <a
                href="/auth?mode=register"
                className="text-xs underline-offset-4 hover:underline"
                style={{ color: 'hsl(0 0% 45%)' }}
              >
                Registrera med e-post
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
