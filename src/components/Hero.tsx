import { ArrowRight, TrendingUp, Shield, Users, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants, Easing } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const easeOut: Easing = [0.16, 1, 0.3, 1];

const Hero = () => {
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  return (
    <section 
      className="relative min-h-[90vh] flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(213 80% 18% / 0.95) 0%, hsl(213 80% 28% / 0.90) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div 
          className="absolute top-20 left-10 w-72 h-72 bg-secondary/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <motion.div 
          className="max-w-3xl"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div 
            className="inline-flex items-center gap-2 bg-secondary/20 border border-secondary/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm"
            variants={itemVariants}
          >
            <motion.span 
              className="w-2 h-2 bg-secondary rounded-full"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-primary-foreground text-sm font-medium">Panipat Branch</span>
          </motion.div>
          
          <motion.h1 
            className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-6 leading-tight"
            variants={itemVariants}
          >
            Your Trusted Partner for
            <motion.span 
              className="block text-secondary"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              Smart Investments
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 max-w-2xl"
            variants={itemVariants}
          >
            Paras Ram India brings decades of stock broking expertise to Panipat. 
            Join thousands of investors who trust us with their financial future.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 mb-12"
            variants={itemVariants}
          >
            <Button 
              asChild
              size="lg"
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-lg px-8 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-secondary/30"
            >
              <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                Start Investing Today
                <ArrowRight className="ml-2 w-5 h-5" />
              </a>
            </Button>
            <Button 
              asChild
              variant="outline"
              size="lg"
              className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-semibold text-lg px-8 transition-all duration-300 hover:scale-105"
            >
              <a href="#contact">
                Visit Our Branch
              </a>
            </Button>
          </motion.div>
          
          {/* Stats */}
          <motion.div 
            className="grid grid-cols-3 gap-8 pt-8 border-t border-primary-foreground/20"
            variants={containerVariants}
          >
            {[
              { icon: TrendingUp, value: "50+", label: "Years Legacy" },
              { icon: Users, value: "10L+", label: "Happy Clients" },
              { icon: Shield, value: "SEBI", label: "Registered" },
            ].map((stat) => (
              <motion.div 
                key={stat.label}
                className="flex items-center gap-3"
                variants={statsVariants}
                whileHover={{ scale: 1.05 }}
              >
                <div className="p-2 bg-secondary/20 rounded-lg">
                  <stat.icon className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-primary-foreground">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.a 
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-sm">Scroll Down</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown className="w-6 h-6" />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;