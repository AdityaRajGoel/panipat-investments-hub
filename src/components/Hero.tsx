import { ArrowRight, TrendingUp, Shield, Users, ChevronDown, Sparkles } from "lucide-react";
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
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: easeOut },
    },
  };

  const statsVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { duration: 0.5, ease: easeOut },
    },
  };

  const floatingVariants: Variants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section 
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(213 80% 12% / 0.92) 0%, hsl(213 80% 22% / 0.88) 50%, hsl(145 70% 25% / 0.85) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Large gradient orbs */}
        <motion.div 
          className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-secondary/30 to-brand-gold/20 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3],
            x: [0, 50, 0],
            y: [0, 30, 0],
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-brand-gold/20 to-secondary/30 rounded-full blur-3xl"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.5, 0.2],
            x: [0, -40, 0],
            y: [0, -20, 0],
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-secondary/40 rounded-full"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              opacity: [0.3, 0.8, 0.3],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5,
            }}
          />
        ))}

        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-secondary/30 to-brand-gold/20 border border-secondary/40 rounded-full px-5 py-2.5 mb-8 backdrop-blur-md shadow-lg"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-4 h-4 text-brand-gold" />
              </motion.div>
              <span className="text-primary-foreground text-sm font-semibold tracking-wide">Panipat Branch • Now Open</span>
            </motion.div>
            
            <motion.h1 
              className="font-heading text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-8 leading-[1.1]"
              variants={itemVariants}
            >
              <motion.span
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
              >
                Your Trusted Partner
              </motion.span>
              <br />
              <motion.span 
                className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-brand-gold to-secondary"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.7 }}
              >
                for Smart Investments
              </motion.span>
            </motion.h1>
            
            <motion.p 
              className="text-lg md:text-xl text-primary-foreground/85 mb-10 max-w-xl leading-relaxed"
              variants={itemVariants}
            >
              Parasram India brings decades of stock broking expertise to Panipat. 
              Join thousands of investors who trust us with their financial future.
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mb-14"
              variants={itemVariants}
            >
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-secondary to-brand-green hover:from-secondary/90 hover:to-brand-green/90 text-secondary-foreground font-bold text-lg px-10 py-6 shadow-xl shadow-secondary/30 transition-all duration-300"
                >
                  <a href="https://parasramindia.com" target="_blank" rel="noopener noreferrer">
                    Start Investing Today
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </a>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-secondary/60 text-primary-foreground bg-secondary/20 hover:bg-secondary/40 font-bold text-lg px-10 py-6 backdrop-blur-sm transition-all duration-300"
                >
                  <a href="#contact">
                    Visit Our Branch
                  </a>
                </Button>
              </motion.div>
            </motion.div>
            
            {/* Stats */}
            <motion.div 
              className="grid grid-cols-3 gap-6 pt-8 border-t border-primary-foreground/20"
              variants={containerVariants}
            >
              {[
                { icon: TrendingUp, value: "50+", label: "Years Legacy" },
                { icon: Users, value: "10L+", label: "Happy Clients" },
                { icon: Shield, value: "SEBI", label: "Registered" },
              ].map((stat, index) => (
                <motion.div 
                  key={stat.label}
                  className="flex items-center gap-3 group"
                  variants={statsVariants}
                  whileHover={{ scale: 1.08, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <motion.div 
                    className="p-3 bg-gradient-to-br from-secondary/30 to-brand-gold/20 rounded-xl backdrop-blur-sm border border-secondary/30 group-hover:shadow-lg group-hover:shadow-secondary/20 transition-all duration-300"
                    whileHover={{ rotate: [0, -10, 10, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <stat.icon className="w-6 h-6 text-secondary" />
                  </motion.div>
                  <div>
                    <motion.div 
                      className="text-2xl md:text-3xl font-bold text-primary-foreground"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 + index * 0.2 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-sm text-primary-foreground/70">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right side - Animated graphic */}
          <motion.div 
            className="hidden lg:flex items-center justify-center relative"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <motion.div
              className="relative w-80 h-80"
              variants={floatingVariants}
              animate="animate"
            >
              {/* Outer ring */}
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-dashed border-secondary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Middle ring */}
              <motion.div
                className="absolute inset-8 rounded-full border-2 border-brand-gold/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Inner content */}
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-secondary/20 to-brand-gold/10 backdrop-blur-xl flex items-center justify-center border border-secondary/30">
                <motion.div
                  className="text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-4xl font-bold text-primary-foreground mb-1">₹</div>
                  <div className="text-sm text-primary-foreground/80">Invest Smart</div>
                </motion.div>
              </div>

              {/* Orbiting elements */}
              {[TrendingUp, Shield, Users].map((Icon, i) => (
                <motion.div
                  key={i}
                  className="absolute w-12 h-12 bg-gradient-to-br from-secondary to-brand-green rounded-full flex items-center justify-center shadow-lg"
                  style={{
                    top: '50%',
                    left: '50%',
                  }}
                  animate={{
                    x: [
                      Math.cos((i * 2 * Math.PI) / 3) * 130,
                      Math.cos((i * 2 * Math.PI) / 3 + Math.PI) * 130,
                      Math.cos((i * 2 * Math.PI) / 3) * 130,
                    ],
                    y: [
                      Math.sin((i * 2 * Math.PI) / 3) * 130,
                      Math.sin((i * 2 * Math.PI) / 3 + Math.PI) * 130,
                      Math.sin((i * 2 * Math.PI) / 3) * 130,
                    ],
                  }}
                  transition={{
                    duration: 15,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <Icon className="w-5 h-5 text-white" />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.a 
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.5 }}
      >
        <span className="text-sm font-medium tracking-wider uppercase">Explore</span>
        <motion.div
          className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2"
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-secondary rounded-full"
            animate={{ y: [0, 12, 0], opacity: [1, 0, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
      </motion.a>
    </section>
  );
};

export default Hero;
