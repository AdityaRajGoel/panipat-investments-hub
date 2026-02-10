import { Phone, TrendingUp, ShieldCheck, Handshake, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants } from "framer-motion";

const unlistedStocks = [
  { name: "Metropolitan Stock Exchange of India Ltd", short: "MSE", tag: "Exchange" },
  { name: "National Stock Exchange Ltd (NSE)", short: "NSE", tag: "Exchange" },
  { name: "SBI Funds Management Ltd (SBI AMC)", short: "SBI", tag: "AMC" },
  { name: "Chennai Super Kings Cricket Ltd (CSK)", short: "CSK", tag: "Sports" },
  { name: "NCDEX Ltd", short: "NCX", tag: "Commodity Exchange" },
  { name: "HDB Financial Services Ltd", short: "HDB", tag: "NBFC" },
  { name: "Tata Capital Ltd", short: "TCL", tag: "Finance" },
  { name: "OYO Rooms (Oravel Stays)", short: "OYO", tag: "Hospitality" },
  { name: "Swiggy Ltd", short: "SWG", tag: "Food Tech" },
];

const benefits = [
  { icon: TrendingUp, title: "High Growth Potential", desc: "Invest early in companies before they go public for maximum returns." },
  { icon: ShieldCheck, title: "Verified Companies", desc: "We deal only in thoroughly vetted and verified unlisted companies." },
  { icon: Handshake, title: "Expert Guidance", desc: "Our team helps you choose the right unlisted shares based on your goals." },
];

const UnlistedShares = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="unlisted-shares" className="py-24 bg-gradient-to-b from-background to-muted/50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          className="absolute top-10 right-20 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 left-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 bg-secondary/10 border border-secondary/30 rounded-full px-5 py-2 mb-6"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <Sparkles className="w-4 h-4 text-secondary" />
            <span className="text-secondary font-semibold text-sm">New Offering</span>
          </motion.div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            We Also Deal in{" "}
            <span className="text-secondary">Unlisted Shares</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get access to pre-IPO and unlisted shares of top Indian companies. 
            Invest early and ride the growth wave with Parasram India.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {benefits.map((benefit) => (
            <motion.div
              key={benefit.title}
              className="group bg-card rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 hover:border-secondary/50 relative overflow-hidden"
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
              <div className="relative z-10">
                <motion.div
                  className="w-14 h-14 bg-secondary/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-all"
                  whileHover={{ rotate: [0, -10, 10, 0] }}
                  transition={{ duration: 0.5 }}
                >
                  <benefit.icon className="w-7 h-7 text-secondary" />
                </motion.div>
                <h3 className="font-heading text-xl font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.desc}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Available Unlisted Shares */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h3 className="font-heading text-2xl md:text-3xl font-bold text-foreground text-center mb-10">
            Available <span className="text-secondary">Unlisted Shares</span>
          </h3>
          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            {unlistedStocks.map((stock) => (
              <motion.div
                key={stock.name}
                className="group bg-card rounded-xl p-5 border border-border/50 hover:border-secondary/50 shadow-md hover:shadow-xl transition-all duration-300 flex items-center gap-4"
                variants={itemVariants}
                whileHover={{ y: -4, scale: 1.02 }}
              >
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center text-xl font-bold text-secondary shrink-0 group-hover:bg-secondary/20 transition-colors">
                  {stock.short}
                </div>
                <div className="min-w-0">
                  <h4 className="font-heading font-semibold text-foreground text-sm leading-tight">{stock.name}</h4>
                  <p className="text-secondary text-xs font-medium mt-1">{stock.tag}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
          <motion.p
            className="text-center text-muted-foreground mt-8 text-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            ...and many more! <span className="text-secondary font-semibold">Contact us for pricing & availability.</span>
          </motion.p>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          className="bg-hero rounded-3xl p-10 md:p-16 text-center text-primary-foreground relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
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
            <h3 className="font-heading text-2xl md:text-3xl font-bold mb-4">
              Interested in Unlisted Shares?
            </h3>
            <p className="text-primary-foreground/80 text-lg mb-8 max-w-xl mx-auto">
              Contact us now to explore premium unlisted share opportunities. Our experts will guide you through the process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-bold text-lg px-10 py-6 shadow-xl"
                >
                  <a href="#contact">
                    Contact Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
            </div>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-primary-foreground/90">
              <a href="tel:+919416400314" className="flex items-center gap-2 hover:text-secondary transition-colors text-lg">
                <Phone className="w-5 h-5" />
                +91 9416400314
              </a>
              <a href="tel:+919999790011" className="flex items-center gap-2 hover:text-secondary transition-colors text-lg">
                <Phone className="w-5 h-5" />
                +91 9999790011
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UnlistedShares;