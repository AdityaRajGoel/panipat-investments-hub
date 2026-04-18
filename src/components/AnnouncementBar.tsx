import { Flame, TrendingUp, Shield, Zap, ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

const announcements = [
  { icon: Flame, text: "Open a FREE Demat Account Today !", cta: "Start Now", href: "/open-account", color: "text-brand-gold" },
  { icon: TrendingUp, text: "IPO Applications Now Open : Apply for upcoming IPOs online", cta: "Apply Now", href: "/services", color: "text-secondary" },
  { icon: Shield, text: "SEBI Registered Broker • NSE • BSE • MCX • NSDL • CDSL", cta: null, href: null, color: "text-sky-400" },
  { icon: Gift, text: "Refer & Earn — Get rewards for every successful referral", cta: "Start Referring", href: "/open-account", color: "text-purple-400" },
  { icon: Zap, text: "Explore Pre-IPO & Unlisted Shares — High-growth opportunities", cta: "Explore", href: "/unlisted-space", color: "text-amber-400" },
];

const AnnouncementBar = () => {
  const [hidden, setHidden] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    let lastScrollY = window.scrollY;
    
    const handleScroll = () => {
      // Auto-hide on mobile when scrolling down Past 50px
      if (window.innerWidth < 768) {
        if (window.scrollY > 50 && window.scrollY > lastScrollY) {
          setHidden(true);
        } else if (window.scrollY < 50) {
          setHidden(false);
        }
      }
      lastScrollY = window.scrollY;
    };
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className={`relative overflow-hidden border-b border-white/5 transition-all duration-300 ${
      hidden ? "h-0 border-transparent opacity-0" : "h-8 md:h-10 opacity-100"
    }`} style={{ background: 'linear-gradient(90deg, hsl(213 80% 10%) 0%, hsl(213 80% 15%) 50%, hsl(145 70% 12%) 100%)' }}>
      {/* Animated shimmer line at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent animate-[ticker-right_4s_linear_infinite]" />

      <div className="flex items-center h-8 md:h-10">
        {/* Left badge */}
        <div className="hidden md:flex items-center gap-2 px-4 h-full shrink-0 bg-brand-gold/15 border-r border-brand-gold/20">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-gold animate-pulse" />
          <span className="text-brand-gold text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">Live Updates</span>
        </div>

        {/* Scrolling announcements */}
        <div className="overflow-hidden flex-1 relative">
          {/* Fade masks */}
          <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-[hsl(213_80%_10%)] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-[hsl(145_70%_12%)] to-transparent z-10 pointer-events-none" />

          <div
            className="inline-flex w-max items-center whitespace-nowrap hover:[animation-play-state:paused]"
            style={{ 
              animation: 'ticker-left 60s linear infinite',
              willChange: 'transform',
              transform: 'translate3d(0, 0, 0)',
              backfaceVisibility: 'hidden',
            }}
          >
            {[...announcements, ...announcements, ...announcements, ...announcements, ...announcements, ...announcements].map((item, i) => (
              <div key={i} className="inline-flex items-center">
                <div className="inline-flex items-center gap-2 md:gap-3 px-2 md:px-4">
                  <item.icon className={`w-3 h-3 md:w-3.5 md:h-3.5 shrink-0 ${item.color}`} />
                  <span className="text-white/75 text-[11px] md:text-xs font-medium">{item.text}</span>
                  {item.cta && item.href && (
                    <Link
                      to={item.href}
                      className={`inline-flex items-center gap-1 text-[11px] md:text-xs font-bold ${item.color} hover:underline transition-all`}
                    >
                      {item.cta} <ArrowRight className="w-2.5 h-2.5" />
                    </Link>
                  )}
                </div>
                <span className="text-white/15 text-sm md:text-base">|</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Animated shimmer line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent animate-[ticker-left_5s_linear_infinite]" />
    </div>
  );
};

export default AnnouncementBar;
