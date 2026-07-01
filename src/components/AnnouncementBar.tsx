import { Flame, TrendingUp, Shield, Zap, ArrowRight, Gift, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

const announcements = [
  { icon: Flame, text: "Open a FREE Demat Account", cta: "Start", href: "/open-account", color: "text-brand-gold" },
  { icon: TrendingUp, text: "IPOs Open - Apply Online", cta: "Apply", href: "/services", color: "text-secondary" },
  { icon: Shield, text: "SEBI Registered · NSE · BSE · MCX", cta: null, href: null, color: "text-sky-400" },
  { icon: Gift, text: "Refer & Earn Rewards", cta: "Refer", href: "/open-account", color: "text-purple-400" },
  { icon: Zap, text: "Pre-IPO & Unlisted Shares", cta: "Explore", href: "/unlisted-space", color: "text-amber-400" },
];

const DISMISS_KEY = "pnp_announcement_dismissed";

const AnnouncementBar = () => {
  const [hidden, setHidden] = useState(false);      // mobile scroll-hide
  const [dismissed, setDismissed] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Restore dismissal for this browsing session
  useEffect(() => {
    try {
      if (sessionStorage.getItem(DISMISS_KEY) === "1") setDismissed(true);
    } catch { /* ignore */ }
  }, []);

  // Auto-rotate announcements (pauses on hover); static links, not a moving target
  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % announcements.length), 5000);
    return () => clearInterval(t);
  }, [paused]);

  // Auto-hide on mobile when scrolling down past 50px
  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      if (window.innerWidth < 768) {
        if (window.scrollY > 50 && window.scrollY > lastScrollY) setHidden(true);
        else if (window.scrollY < 50) setHidden(false);
      }
      lastScrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dismiss = () => {
    setDismissed(true);
    try { sessionStorage.setItem(DISMISS_KEY, "1"); } catch { /* ignore */ }
  };

  if (dismissed) return null;

  const item = announcements[index];
  const Icon = item.icon;

  return (
    <div
      role="region"
      aria-label="Site announcements"
      className={`relative overflow-hidden border-b border-white/5 transition-all duration-300 ${
        hidden ? "h-0 border-transparent opacity-0" : "h-8 md:h-10 opacity-100"
      }`}
      style={{ background: "linear-gradient(90deg, hsl(213 80% 10%) 0%, hsl(213 80% 15%) 50%, hsl(145 70% 12%) 100%)" }}
    >
      {/* Shimmer line (top) */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent animate-[ticker-right_4s_linear_infinite]" />

      <div className="flex items-center h-8 md:h-10">
        {/* Left badge */}
        <div className="hidden md:flex items-center gap-2 px-4 h-full shrink-0 bg-brand-gold/15 border-r border-brand-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-brand-gold text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">Live Updates</span>
        </div>

        {/* Rotating announcement (static, clickable CTA) */}
        <div
          className="flex-1 relative h-full flex items-center justify-center overflow-hidden px-2"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.35 }}
              className="inline-flex items-center gap-2 md:gap-3 absolute"
            >
              <Icon className={`w-3.5 h-3.5 shrink-0 ${item.color}`} />
              <span className="text-white/80 text-[11px] md:text-xs font-medium whitespace-nowrap">{item.text}</span>
              {item.cta && item.href && (
                <Link
                  to={item.href}
                  className={`inline-flex items-center gap-1 text-[11px] md:text-xs font-bold ${item.color} hover:underline transition-all`}
                >
                  {item.cta} <ArrowRight className="w-2.5 h-2.5" />
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Progress dots + dismiss */}
        <div className="flex items-center gap-2 shrink-0 pr-2 md:pr-3">
          <div className="hidden sm:flex items-center gap-1">
            {announcements.map((_, i) => (
              <span
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${i === index ? "w-3 bg-brand-gold/80" : "w-1 bg-white/25"}`}
              />
            ))}
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss announcements"
            className="min-h-[32px] min-w-[32px] flex items-center justify-center rounded-full text-white/50 hover:text-white/90 hover:bg-white/10 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Shimmer line (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-[ticker-left_5s_linear_infinite]" />
    </div>
  );
};

export default AnnouncementBar;
