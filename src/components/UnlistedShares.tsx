import { Phone, TrendingUp, ShieldCheck, Handshake, ArrowRight, Sparkles, Star, ChevronRight, BadgeCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const unlistedStocks = [
  { name: "National Stock Exchange Ltd (NSE)", short: "NSE", tag: "Most Bought", tagColor: "bg-secondary/10 text-secondary", price: "₹2,060", minQty: "1 Share", color: "from-indigo-600 to-indigo-800" },
  { name: "Metropolitan Stock Exchange of India Ltd", short: "MSE", tag: "Top Gainer", tagColor: "bg-brand-gold/10 text-brand-gold", price: "₹5.40", minQty: "1 Share", color: "from-blue-600 to-blue-800" },
  { name: "SBI Funds Management Ltd (SBI AMC)", short: "SBI", tag: "Hot Right Now", tagColor: "bg-destructive/10 text-destructive", price: "₹780", minQty: "1 Share", color: "from-blue-500 to-cyan-600" },
  { name: "Chennai Super Kings Cricket Ltd (CSK)", short: "CSK", tag: "Hot Right Now", tagColor: "bg-destructive/10 text-destructive", price: "₹265", minQty: "1 Share", color: "from-yellow-500 to-amber-600" },
  { name: "NCDEX Ltd", short: "NCX", tag: "Exchange", tagColor: "bg-primary/10 text-primary", price: "₹431", minQty: "1 Share", color: "from-emerald-600 to-green-700" },
  { name: "Apollo Green Energy Ltd", short: "AGE", tag: "Hot Right Now", tagColor: "bg-destructive/10 text-destructive", price: "₹80", minQty: "30 Shares min", color: "from-green-500 to-emerald-600" },
  { name: "OYO Rooms (Oravel Stays)", short: "OYO", tag: "Popular", tagColor: "bg-secondary/10 text-secondary", price: "₹48", minQty: "1 Share", color: "from-red-500 to-rose-600" },
  { name: "Orbis Financial Corporation Ltd", short: "OFC", tag: "Financial", tagColor: "bg-primary/10 text-primary", price: "₹415", minQty: "1 Share", color: "from-purple-600 to-violet-700" },
  { name: "PharmEasy (API Holdings Ltd.)", short: "PE", tag: "HealthTech", tagColor: "bg-secondary/10 text-secondary", price: "₹22", minQty: "1 Share", color: "from-teal-500 to-cyan-600" },
];

const benefits = [
  { icon: TrendingUp, title: "High Growth Potential", desc: "Invest early in companies before they go public for maximum returns.", stat: "300%+", statLabel: "Avg. Pre-IPO Returns" },
  { icon: ShieldCheck, title: "100% Verified", desc: "We deal only in thoroughly vetted and verified unlisted companies.", stat: "50+", statLabel: "Companies Listed" },
  { icon: Handshake, title: "Expert Guidance", desc: "Our team helps you choose the right unlisted shares based on your goals.", stat: "35+", statLabel: "Years Experience" },
];

const howItWorks = [
  { step: "01", title: "Choose a Share", desc: "Browse our curated list of pre-IPO and unlisted shares." },
  { step: "02", title: "Contact Us", desc: "Call or WhatsApp for live pricing and availability." },
  { step: "03", title: "Complete KYC", desc: "Quick KYC verification for a seamless process." },
  { step: "04", title: "Start Investing", desc: "Get shares transferred to your Demat account." },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

const UnlistedShares = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [stocks, setStocks] = useState(unlistedStocks);

  useEffect(() => {
    const fetchShares = async () => {
      try {
        const { data, error } = await supabase
          .from('unlisted_shares' as any)
          .select('*')
          .eq('is_active', true)
          .order('display_order', { ascending: true });
        
        if (!error && data && data.length > 0) {
          setStocks(data.map((s: any) => ({
            name: s.name,
            short: s.short_code,
            tag: s.tag,
            tagColor: s.tag_color,
            price: s.price,
            minQty: s.min_qty,
            color: s.gradient_color,
            imageUrl: s.image_url,
          })));
        }
      } catch {}
    };
    fetchShares();
  }, []);

  return (
    <div>
      {/* Hero section - Incred Money inspired */}
      <section className="relative py-20 md:py-28 overflow-hidden" style={{
        background: "linear-gradient(135deg, hsl(213 80% 12%) 0%, hsl(213 80% 18%) 50%, hsl(145 40% 20%) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-5" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '30px 30px',
          }} />
          <motion.div
            className="absolute top-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <motion.div
            className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Sparkles className="w-4 h-4 text-brand-gold" />
            <span className="text-primary-foreground/90 text-sm font-medium">Pre-IPO & Unlisted Shares</span>
          </motion.div>
          <motion.h1
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Buy and Sell<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-brand-gold to-secondary">
              Pre-IPO | Unlisted Shares
            </span>
          </motion.h1>
          <motion.p
            className="text-primary-foreground/70 text-lg md:text-xl max-w-2xl mx-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Grab your chance to invest in India's top companies.
          </motion.p>
          <motion.p
            className="text-secondary font-semibold text-lg mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Get started with just 1 share.
          </motion.p>
          <motion.div
            className="flex justify-center gap-6 text-primary-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2"><BadgeCheck className="w-4 h-4 text-secondary" /> SEBI Registered</div>
            <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-brand-gold" /> Instant Transfer</div>
            <div className="flex items-center gap-2"><Star className="w-4 h-4 text-brand-gold" /> 5-Star Rated</div>
          </motion.div>
        </div>
      </section>

      {/* Stock Cards Grid - Incred Money style */}
      <section className="py-16 bg-background relative">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
              Available <span className="text-secondary">Unlisted Shares</span>
            </h2>
            <p className="text-muted-foreground">Contact us for live pricing & availability</p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {stocks.map((stock, index) => (
              <motion.div
                key={stock.name}
                variants={itemVariants}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card className={`group cursor-pointer transition-all duration-300 border-border/50 hover:border-secondary/50 hover:shadow-xl hover:shadow-secondary/5 ${hoveredCard === index ? "scale-[1.02]" : ""}`}>
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      {(stock as any).imageUrl ? (
                        <motion.img
                          src={(stock as any).imageUrl}
                          alt={stock.short}
                          className="w-14 h-14 rounded-xl object-contain border border-border bg-white shrink-0 shadow-lg"
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        />
                      ) : (
                        <motion.div
                          className={`w-14 h-14 bg-gradient-to-br ${stock.color} rounded-xl flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg`}
                          whileHover={{ rotate: [0, -5, 5, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {stock.short}
                        </motion.div>
                      )}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-heading font-semibold text-foreground text-sm leading-tight group-hover:text-secondary transition-colors line-clamp-2">
                          {stock.name}
                        </h4>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-lg font-bold text-foreground">{stock.price}</span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${stock.tagColor}`}>
                            {stock.tag}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-1">Min: {stock.minQty}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-secondary transition-colors shrink-0 mt-4" />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.p
            className="text-center text-muted-foreground mt-8 text-base"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ...and many more! <span className="text-secondary font-semibold">Contact us for pricing & availability.</span>
          </motion.p>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {benefits.map((b, i) => (
              <motion.div key={b.title} variants={itemVariants}>
                <Card className="h-full border-border/50 hover:border-secondary/50 transition-all hover:shadow-xl group">
                  <CardContent className="p-8">
                    <div className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                      <b.icon className="w-7 h-7 text-secondary" />
                    </div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{b.title}</h3>
                    <p className="text-muted-foreground mb-4">{b.desc}</p>
                    <div className="pt-4 border-t border-border/50">
                      <span className="text-2xl font-bold text-secondary">{b.stat}</span>
                      <span className="text-xs text-muted-foreground ml-2">{b.statLabel}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-foreground mb-2">
              How It <span className="text-secondary">Works</span>
            </h2>
            <p className="text-muted-foreground">Simple 4-step process to start investing in unlisted shares</p>
          </motion.div>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {howItWorks.map((step, i) => (
              <motion.div key={step.step} variants={itemVariants} className="relative">
                <Card className="h-full border-border/50 hover:border-secondary/50 transition-all text-center">
                  <CardContent className="p-6">
                    <div className="text-4xl font-bold text-secondary/20 mb-3">{step.step}</div>
                    <h3 className="font-heading text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm">{step.desc}</p>
                  </CardContent>
                </Card>
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 z-10">
                    <ChevronRight className="w-6 h-6 text-secondary/40" />
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            className="bg-hero rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="absolute inset-0 opacity-10"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage: "radial-gradient(circle, hsl(145 70% 40%) 1px, transparent 1px)",
                backgroundSize: "30px 30px",
              }}
            />
            <div className="relative z-10">
              <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">Interested in Unlisted Shares?</h3>
              <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
                Contact us now to explore premium unlisted share opportunities. Our experts will guide you through the process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-10 py-6 shadow-xl">
                    <a href="#contact">
                      Contact Now
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </a>
                  </Button>
                </motion.div>
              </div>
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-primary-foreground/90">
                <a href="tel:+919416400314" className="flex items-center gap-2 hover:text-secondary transition-colors text-lg">
                  <Phone className="w-5 h-5" /> +91 9416400314
                </a>
                <a href="tel:+919999790011" className="flex items-center gap-2 hover:text-secondary transition-colors text-lg">
                  <Phone className="w-5 h-5" /> +91 9999790011
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default UnlistedShares;
