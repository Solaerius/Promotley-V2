import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { AlignRight, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { DarkModeToggle } from './DarkModeToggle';
import { LanguageSwitcher } from './LanguageSwitcher';

interface NavbarProps {
  logoStripRef?: React.RefObject<HTMLDivElement>;
}

const Navbar = ({ logoStripRef }: NavbarProps) => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!logoStripRef?.current) {
      const onScroll = () => setScrolled(window.scrollY > 80);
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 }
    );
    observer.observe(logoStripRef.current);
    return () => observer.disconnect();
  }, [logoStripRef]);

  // Close mobile menu on scroll
  useEffect(() => {
    if (scrolled) setMobileOpen(false);
  }, [scrolled]);

  const pillVariants = {
    full: {
      maxWidth: "100%",
      borderRadius: 0,
      marginTop: 0,
      backgroundColor: "rgba(0,0,0,0)",
      borderColor: "rgba(255,255,255,0)",
      boxShadow: "none",
    },
    pill: {
      maxWidth: 720,
      borderRadius: 9999,
      marginTop: 12,
      backgroundColor: "hsl(347 40% 5% / 0.88)",
      borderColor: "rgba(255,255,255,0.10)",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
    },
  };

  const isPill = scrolled && !mobileOpen;

  return (
    /* Outer fixed container — always full-width, just centers the pill */
    <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <motion.nav
        animate={isPill ? "pill" : "full"}
        variants={pillVariants}
        transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
        className="w-full pointer-events-auto border"
        style={{ willChange: "max-width, border-radius, margin-top, background-color" }}
      >
        <div className={isPill ? "px-5 py-2.5" : "container mx-auto px-6 py-4"}>
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 shrink-0">
              <img
                src={logo}
                alt="Promotley"
                className="h-7 w-7 object-contain dark:invert transition-all duration-300"
              />
              {/* "PROMOTLEY" text fades out when scrolled into pill */}
              <motion.span
                animate={{ opacity: isPill ? 0 : 1, width: isPill ? 0 : "auto" }}
                transition={{ duration: 0.25 }}
                className="font-bold text-lg overflow-hidden whitespace-nowrap dark:text-white text-gray-900"
              >
                Promotley
              </motion.span>
            </Link>

            {/* Desktop nav links */}
            <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
              <Link
                to="/pricing"
                className="text-sm dark:text-white/70 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
              >
                {t('nav.pricing')}
              </Link>
              <Link
                to="/demo"
                className="text-sm dark:text-white/70 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
              >
                {t('nav.demo')}
              </Link>
              <a
                href="#om-oss"
                className="text-sm dark:text-white/70 text-gray-600 hover:dark:text-white hover:text-gray-900 transition-colors"
              >
                {t('nav.about')}
              </a>
            </div>

            {/* Desktop auth */}
            <div className="hidden md:flex items-center gap-2 shrink-0">
              <LanguageSwitcher />
              <DarkModeToggle />
              {user ? (
                <Link to="/dashboard">
                  <Button
                    size="sm"
                    className="bg-white text-black hover:bg-white/90 font-medium text-xs"
                  >
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/auth?mode=login">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="dark:text-white/80 text-gray-700 dark:hover:bg-white/10 hover:bg-black/10 text-xs"
                    >
                      {t('nav.login')}
                    </Button>
                  </Link>
                  <Link to="/auth?mode=register">
                    <Button
                      size="sm"
                      className="bg-white text-black hover:bg-white/90 font-medium text-xs"
                    >
                      {t('nav.register')}
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="md:hidden p-2 dark:hover:bg-white/10 hover:bg-black/10 rounded-lg transition-colors dark:text-white text-gray-900"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <AlignRight className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                className="md:hidden pt-4 pb-2 border-t dark:border-white/10 border-black/10 mt-4 flex flex-col gap-1"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.15 }}
              >
                <Link
                  to="/pricing"
                  className="py-2.5 px-3 text-sm dark:text-white/80 text-gray-700 hover:dark:bg-white/5 hover:bg-black/5 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.pricing')}
                </Link>
                <Link
                  to="/demo"
                  className="py-2.5 px-3 text-sm dark:text-white/80 text-gray-700 hover:dark:bg-white/5 hover:bg-black/5 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.demo')}
                </Link>
                <a
                  href="#om-oss"
                  className="py-2.5 px-3 text-sm dark:text-white/80 text-gray-700 hover:dark:bg-white/5 hover:bg-black/5 rounded-lg transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  {t('nav.about')}
                </a>
                <div className="flex flex-col gap-2 pt-3 border-t dark:border-white/10 border-black/10 mt-2">
                  {user ? (
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full bg-white text-black">{t('nav.dashboard')}</Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/auth?mode=login" onClick={() => setMobileOpen(false)}>
                        <Button variant="ghost" className="w-full dark:hover:bg-white/10 hover:bg-black/10">{t('nav.login')}</Button>
                      </Link>
                      <Link to="/auth?mode=register" onClick={() => setMobileOpen(false)}>
                        <Button className="w-full bg-white text-black">{t('nav.register')}</Button>
                      </Link>
                    </>
                  )}
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <LanguageSwitcher />
                  <DarkModeToggle />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.nav>
    </div>
  );
};

export default Navbar;
