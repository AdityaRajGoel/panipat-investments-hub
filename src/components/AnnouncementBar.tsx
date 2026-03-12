import { motion } from "framer-motion";
import { Flame, TrendingUp, Shield, Zap } from "lucide-react";

const announcements = [
  { icon: Flame, text: "Open a FREE Demat Account Today" },
  { icon: TrendingUp, text: "IPO Applications Now Open" },
  { icon: Shield, text: "SEBI Registered • NSE • BSE • MCX" },
  { icon: Zap, text: "Explore Pre-IPO & Unlisted Shares" },
];

const AnnouncementBar = () => {
  return (
    <div className="bg-gradient-to-r from-brand-gold/10 via-secondary/10 to-brand-gold/10 border-b border-border/30 overflow-hidden">
      <div className="flex items-center h-7 md:h-9">
        <motion.div
          className="flex items-center gap-12 whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        >
          {[...announcements, ...announcements].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <item.icon className="w-3.5 h-3.5 text-brand-gold" />
              <span className="text-foreground font-medium">{item.text}</span>
              <span className="text-muted-foreground/30 mx-4">•</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
