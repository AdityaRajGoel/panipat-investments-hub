import { TrendingUp, BarChart3, Wallet, Globe, FileText, Smartphone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { motion, Variants } from "framer-motion";

const services = [
  {
    icon: TrendingUp,
    title: "Equity Trading",
    description: "Trade in NSE & BSE with our advanced trading platforms and expert guidance.",
  },
  {
    icon: BarChart3,
    title: "Derivatives",
    description: "Futures & Options trading with comprehensive research and market analysis.",
  },
  {
    icon: Globe,
    title: "Currency Trading",
    description: "Trade in currency derivatives with competitive pricing and real-time quotes.",
  },
  {
    icon: Wallet,
    title: "Mutual Funds",
    description: "Invest in top-performing mutual funds with expert portfolio management.",
  },
  {
    icon: FileText,
    title: "IPO Services",
    description: "Get early access to IPOs and expert recommendations for your investments.",
  },
  {
    icon: Smartphone,
    title: "Mobile Trading",
    description: "Trade on-the-go with our powerful Parasram Trade mobile app.",
  },
];

const Services = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section id="services" className="py-24 bg-muted/50 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            What We Offer
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Our Services
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Comprehensive financial services tailored to meet your investment goals
          </p>
        </motion.div>
        
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ y: -10, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Card 
                className="group bg-card hover:shadow-2xl transition-all duration-300 border-border/50 hover:border-secondary/50 overflow-hidden h-full relative"
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-brand-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                />
                
                <CardContent className="p-6 relative z-10">
                  <motion.div 
                    className="w-14 h-14 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <service.icon className="w-7 h-7 text-primary group-hover:text-secondary transition-colors duration-300" />
                  </motion.div>
                  <h3 className="font-heading text-xl font-semibold text-foreground mb-2 group-hover:text-secondary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-secondary to-brand-gold"
                  initial={{ width: 0 }}
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <motion.a 
            href="https://parasramindia.com/services" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-secondary font-semibold hover:gap-4 transition-all duration-300"
            whileHover={{ x: 5 }}
          >
            View All Services on Main Website
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
