import { motion, Variants } from "framer-motion";
import { Link } from "react-router-dom";
import {
  LineChart, Activity, Sparkles, PiggyBank, Rocket,
  Gem, Landmark, Vault, ArrowRight, BadgeCheck,
} from "lucide-react";

// Segmented product menu - the pattern both Motilal Oswal & Angel One lead
// with. Each card links to an existing route and maps to the parent
// company's product line (equity, F&O, MF, IPO, commodities, unlisted,
// bonds/FD, depository).
const products = [
  { icon: LineChart, title: "Stocks & Equity", desc: "Invest in NSE & BSE listed companies with a free Demat account.", to: "/screener", tag: "Live Screener" },
  { icon: Activity, title: "Futures & Options", desc: "Trade NIFTY, BANKNIFTY & stock F&O with live option-chain tools.", to: "/fno", tag: "PCR & Max Pain" },
  { icon: Sparkles, title: "Unlisted & Pre-IPO", desc: "Buy verified pre-IPO and unlisted shares before they list.", to: "/unlisted-space", tag: "Exclusive" },
  { icon: PiggyBank, title: "Mutual Funds & SIP", desc: "Start a SIP from ₹500/month across direct & regular funds.", to: "/services", tag: "From ₹500" },
  { icon: Rocket, title: "IPO Investments", desc: "Apply for upcoming IPOs online via UPI/ASBA in a few taps.", to: "/services", tag: "UPI / ASBA" },
  { icon: Gem, title: "Commodities (MCX)", desc: "Trade gold, silver, crude oil & agri commodities on MCX & NCDEX.", to: "/services", tag: "MCX · NCDEX" },
  { icon: Landmark, title: "Bonds, FD & Insurance", desc: "Diversify beyond equity with FDs, corporate bonds & insurance.", to: "/products", tag: "Safer Yields" },
  { icon: Vault, title: "Demat & Depository", desc: "Secure CDSL/NSDL depository services, pledging & transfers.", to: "/depository-services", tag: "CDSL · NSDL" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const InvestmentProducts = () => {
  return (
    <section className="py-12 md:py-20 bg-background overflow-hidden relative">
      {/* Background ornaments - consistent with WhyChooseUs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-16 right-0 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.15, 1], y: [0, 20, 0] }}
          transition={{ duration: 11, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-0 left-0 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1.1, 1, 1.1], x: [0, 15, 0] }}
          transition={{ duration: 13, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-[0.15em] mb-3">
            One Platform · Every Investment
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-3">
            Explore What You Can Invest In
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full mb-4" />
          <p className="text-muted-foreground max-w-xl mx-auto">
            From equities to unlisted shares - a full-service brokerage experience, all under one roof.
          </p>
        </motion.div>

        {/* Product grid */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {products.map((p) => {
            const Icon = p.icon;
            return (
              <motion.div key={p.title} variants={itemVariants} whileHover={{ y: -6 }}>
                <Link
                  to={p.to}
                  aria-label={`${p.title} - learn more`}
                  className="group relative flex flex-col h-full bg-card border border-border/50 rounded-2xl p-4 md:p-5 hover:border-secondary/40 hover:shadow-xl transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="w-11 h-11 bg-secondary/10 rounded-xl flex items-center justify-center group-hover:bg-secondary/20 group-hover:scale-110 transition-all duration-300">
                        <Icon className="w-5 h-5 text-secondary" />
                      </div>
                      <span className="text-[9px] font-bold uppercase tracking-wide text-brand-orange bg-brand-orange/10 border border-brand-orange/20 rounded-full px-2 py-0.5">
                        {p.tag}
                      </span>
                    </div>

                    <h3 className="font-heading text-sm md:text-base font-bold text-foreground mb-1.5 group-hover:text-secondary transition-colors duration-300">
                      {p.title}
                    </h3>
                    <p className="text-muted-foreground text-xs md:text-sm leading-relaxed flex-1">
                      {p.desc}
                    </p>

                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-secondary opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-300">
                      Explore <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-secondary to-brand-gold"
                    initial={{ width: 0 }}
                    whileHover={{ width: "100%" }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Trust strip + primary CTA - competitor pattern: funnel to account opening */}
        <motion.div
          className="mt-10 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <BadgeCheck className="w-4 h-4 text-secondary" /> ₹0 Account Opening
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <BadgeCheck className="w-4 h-4 text-secondary" /> SEBI Registered
            </span>
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <BadgeCheck className="w-4 h-4 text-secondary" /> NSE · BSE · MCX
            </span>
          </div>
          <Link
            to="/open-account"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary to-brand-green text-secondary-foreground font-bold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300"
          >
            Open Free Demat Account <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default InvestmentProducts;
