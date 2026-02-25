import { motion } from "framer-motion";
import { Shield, Award, Clock, Users, Building, Briefcase, Globe, Headphones } from "lucide-react";

const badges = [
  { icon: Shield, label: "SEBI Registered", desc: "INZ000175134", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Building, label: "NSE Member", desc: "Code: 12583", color: "text-primary", bg: "bg-primary/10" },
  { icon: Building, label: "BSE Member", desc: "Code: 1153", color: "text-brand-gold", bg: "bg-brand-gold/10" },
  { icon: Globe, label: "MCX Member", desc: "Code: 46510", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Award, label: "50+ Years", desc: "Since 1974", color: "text-brand-gold", bg: "bg-brand-gold/10" },
  { icon: Users, label: "10 Lakh+", desc: "Happy Clients", color: "text-primary", bg: "bg-primary/10" },
  { icon: Briefcase, label: "Full Service", desc: "Broker", color: "text-secondary", bg: "bg-secondary/10" },
  { icon: Headphones, label: "24/7", desc: "Support", color: "text-brand-gold", bg: "bg-brand-gold/10" },
];

const TrustBadges = () => {
  return (
    <section className="py-12 bg-muted/30 border-y border-border/30 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="font-heading text-lg font-bold text-muted-foreground uppercase tracking-wider">
            Trusted by Lakhs of Investors
          </h3>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4 md:gap-6">
          {badges.map((badge, i) => (
            <motion.div
              key={badge.label}
              className="flex items-center gap-3 bg-card border border-border/50 rounded-xl px-5 py-3 shadow-sm group cursor-default"
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              whileHover={{ y: -4, scale: 1.05, boxShadow: "0 10px 30px -10px hsl(145 70% 40% / 0.2)" }}
            >
              <motion.div
                className={`w-10 h-10 rounded-lg flex items-center justify-center ${badge.bg} group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <badge.icon className={`w-5 h-5 ${badge.color}`} />
              </motion.div>
              <div>
                <div className="font-bold text-sm text-foreground">{badge.label}</div>
                <div className="text-[10px] text-muted-foreground">{badge.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustBadges;
