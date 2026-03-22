import { motion } from "framer-motion";
import { Flame, TrendingUp, Shield, Zap, ArrowRight, Gift } from "lucide-react";
import { Link } from "react-router-dom";

const announcements = [
  { icon: Flame, text: "Open a FREE Demat Account Today — Zero Brokerage on first 30 days!", cta: "Start Now", href: "/open-account", color: "text-brand-gold" },
  { icon: TrendingUp, text: "IPO Applications Now Open — Apply for upcoming IPOs online", cta: "Apply Now", href: "/services", color: "text-secondary" },
  { icon: Shield, text: "SEBI Registered Broker • NSE • BSE • MCX • NSDL • CDSL", cta: null, href: null, color: "text-sky-400" },
  { icon: Gift, text: "Refer & Earn — Get rewards for every successful referral", cta: "Learn More", href: "/open-account", color: "text-purple-400" },
  { icon: Zap, text: "Explore Pre-IPO & Unlisted Shares — High-growth opportunities", cta: "Explore", href: "/unlisted-zone", color: "text-amber-400" },
];

const AnnouncementBar = () => {
  return (
    <div className="relative overflow-hidden border-b border-white/5" style={{ background: 'linear-gradient(90deg, hsl(213 80% 10%) 0%, hsl(213 80% 15%) 50%, hsl(145 70% 12%) 100%)' }}>
      {/* Animated shimmer line at top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-gold/60 to-transparent"
        animate={{ x: ["-100%", "100%"] }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />

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

          <motion.div
            className="flex items-center gap-0 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          >
            {[...announcements, ...announcements].map((item, i) => (
              <div key={i} className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6">
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
                <span className="text-white/15 mx-2 text-lg">|</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Animated shimmer line at bottom */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent"
        animate={{ x: ["100%", "-100%"] }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default AnnouncementBar;
