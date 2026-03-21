import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
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

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || mobileOpen
          ? "bg-black/80 dark:bg-black/70 backdrop-blur-xl shadow-lg border-b border-white/10 text-white"
          : "bg-transparent dark:text-white text-gray-900"
      )}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Promotley" className="h-8 w-8" />
            <span className="font-bold text-lg">Promotley</span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/pricing" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {t('nav.pricing')}
            </Link>
            <Link to="/demo" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {t('nav.demo')}
            </Link>
            <a href="#om-oss" className="text-sm opacity-70 hover:opacity-100 transition-opacity">
              {t('nav.about')}
            </a>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-2">
            <LanguageSwitcher />
            <DarkModeToggle />
            {user ? (
              <Link to="/dashboard">
                <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">
                  {t('nav.dashboard')}
                </Button>
              </Link>
            ) : (
              <>
                <Link to="/auth?mode=login">
                  <Button size="sm" variant="ghost" className="opacity-80 hover:opacity-100 hover:bg-black/10 dark:hover:bg-white/10">
                    {t('nav.login')}
                  </Button>
                </Link>
                <Link to="/auth?mode=register">
                  <Button size="sm" className="bg-white text-black hover:bg-white/90 font-medium">
                    {t('nav.register')}
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-lg transition-colors"
            onClick={() => setMobileOpen(v => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="md:hidden pt-4 pb-2 border-t border-black/10 dark:border-white/10 mt-4 flex flex-col gap-2"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
            >
              <Link to="/pricing" className="py-2 text-sm opacity-80 hover:opacity-100" onClick={() => setMobileOpen(false)}>{t('nav.pricing')}</Link>
              <Link to="/demo" className="py-2 text-sm opacity-80 hover:opacity-100" onClick={() => setMobileOpen(false)}>{t('nav.demo')}</Link>
              <a href="#om-oss" className="py-2 text-sm opacity-80 hover:opacity-100" onClick={() => setMobileOpen(false)}>{t('nav.about')}</a>
              <div className="flex flex-col gap-2 pt-3 border-t border-black/10 dark:border-white/10 mt-2">
                {user ? (
                  <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full bg-white text-black">{t('nav.dashboard')}</Button>
                  </Link>
                ) : (
                  <>
                    <Link to="/auth?mode=login" onClick={() => setMobileOpen(false)}>
                      <Button variant="ghost" className="w-full hover:bg-black/10 dark:hover:bg-white/10">{t('nav.login')}</Button>
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
    </nav>
  );
};

export default Navbar;
