import { ArrowRight, TrendingUp, TrendingDown, Shield, Users, Sparkles, Award, BarChart2, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, Variants, Easing } from "framer-motion";
import { useEffect, useState, useMemo } from "react";
import { useLiveMarket } from "@/hooks/useLiveMarket";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import heroBg from "@/assets/hero-bg.jpg";

type IndexData = { name: string; price: string; change: string; up: boolean };

const easeOut: Easing = [0.16, 1, 0.3, 1];

// Animated count-up hook
function useCountUp(target: number, duration = 2) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    let start = 0;
    const step = target / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return { count, start: () => setStarted(true) };
}

const FloatingCard = ({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={`absolute bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 ${className}`}
    initial={{ opacity: 0, scale: 0.8, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: easeOut }}
  >
    <motion.div
      animate={{ y: [-4, 4, -4] }}
      transition={{ duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  </motion.div>
);

const StatCounter = ({ target, label, suffix = "", delay = 0 }: { target: number; label: string; suffix?: string; delay?: number }) => {
  const { count, start } = useCountUp(target, 2);
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onAnimationComplete={start}
    >
      <div className="text-3xl md:text-4xl font-bold text-primary-foreground">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">{label}</div>
    </motion.div>
  );
};

const Hero = () => {
  const isMobile = useIsMobile();
  const { indices: liveIndices, commodities, marketOverview, loading } = useLiveMarket();

  // Use live data for hero index cards
  const heroIndices = liveIndices.filter(idx => ["NIFTY", "SENSEX", "BANKNIFTY"].includes(idx.key)).map(idx => ({
    name: idx.name,
    price: idx.price,
    change: idx.change,
    up: idx.up,
  }));

  // Dynamic NIFTY data for floating card
  const niftyData = liveIndices.find(idx => idx.key === "NIFTY");
  const sensexData = liveIndices.find(idx => idx.key === "SENSEX");
  const goldData = commodities.find(c => c.name === "GOLD");

  // Dynamic tips based on live market conditions
  const dynamicTips = useMemo(() => {
    const baseTips = [
      "💡 Diversify your portfolio across sectors",
      "🛡️ Never invest money you can't afford to lose",
      "🔍 Research before you invest",
    ];
    if (niftyData?.up) baseTips.unshift(`📈 NIFTY 50 is up ${niftyData.change} — markets looking bullish today`);
    else if (niftyData) baseTips.unshift(`📉 NIFTY 50 is down ${niftyData.change} — consider buying the dip wisely`);
    if (goldData?.up) baseTips.push(`✨ Gold is up ${goldData.change} — a safe haven in volatile markets`);
    if (marketOverview) {
      const { advances = 0, declines = 0 } = marketOverview;
      if (advances > declines) baseTips.push(`🟢 ${advances} advances vs ${declines} declines — broad market strength`);
      else if (declines > advances) baseTips.push(`🔴 ${declines} declines vs ${advances} advances — stay cautious`);
    }
    return baseTips;
  }, [niftyData, goldData, marketOverview]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: easeOut } },
  };

  const trustBadges = [
    { icon: Award, label: "SEBI Registered" },
    { icon: Lock, label: "Secure Trading" },
    { icon: Star, label: "5-Star Rated" },
  ];

  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % dynamicTips.length), 3500);
    return () => clearInterval(t);
  }, [dynamicTips.length]);

  return (
    <section
      className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden"
      style={{
        backgroundImage: `linear-gradient(135deg, hsl(213 80% 12% / 0.92) 0%, hsl(213 80% 22% / 0.88) 50%, hsl(145 70% 25% / 0.85) 100%), url(${heroBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: isMobile ? 'scroll' : 'fixed',
      }}
    >
      {/* Animated background elements — reduced on mobile */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-secondary/30 to-brand-gold/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        {!isMobile && (
          <>
            <motion.div
              className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-tl from-brand-gold/20 to-secondary/30 rounded-full blur-3xl"
              animate={{ scale: [1.2, 1, 1.2], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute top-1/2 left-1/3 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-2xl"
              animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.4, 0.2] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
            />
            {/* Floating particles — desktop only */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${4 + (i % 3) * 4}px`,
                  height: `${4 + (i % 3) * 4}px`,
                  left: `${8 + i * 15}%`,
                  top: `${15 + (i % 4) * 20}%`,
                  background: i % 2 === 0 ? 'hsl(145 70% 40% / 0.4)' : 'hsl(45 90% 55% / 0.3)',
                }}
                animate={{ y: [-20, 20, -20], opacity: [0.3, 0.9, 0.3] }}
                transition={{ duration: 4 + i * 0.7, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
              />
            ))}
          </>
        )}
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div variants={containerVariants} initial="hidden" animate="visible">

            {/* Trust badges row */}
            <motion.div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6" variants={itemVariants}>
              {trustBadges.map(({ icon: Icon, label }, i) => (
                <motion.div
                  key={label}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 backdrop-blur-md"
                  whileHover={{ scale: 1.08, backgroundColor: "rgba(255,255,255,0.15)" }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary" />
                  <span className="text-primary-foreground text-[11px] md:text-xs font-semibold">{label}</span>
                </motion.div>
              ))}
            </motion.div>

            {/* Live Index Cards */}
            <motion.div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-3 mb-6 md:mb-8" variants={itemVariants}>
              {heroIndices.map((idx, i) => (
                <motion.div
                  key={idx.name}
                  className="flex items-center gap-2 md:gap-3 bg-white/10 border border-white/20 rounded-xl px-2.5 py-2 md:px-4 md:py-3 backdrop-blur-md"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${idx.up ? "bg-secondary/20" : "bg-destructive/20"}`}>
                    {idx.up ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-secondary" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-destructive" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] md:text-[10px] text-primary-foreground/60 font-semibold uppercase tracking-wide truncate">{idx.name}</div>
                    <div className="text-xs md:text-sm font-bold text-primary-foreground truncate">{idx.price}</div>
                    <div className={`text-[10px] md:text-xs font-bold ${idx.up ? "text-secondary" : "text-destructive"}`}>{idx.change}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.h1
              className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-4 md:mb-8 leading-[1.1]"
              variants={itemVariants}
            >
              <motion.span initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3, duration: 0.7 }}>
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

            <motion.p className="text-base md:text-xl text-primary-foreground/85 mb-4 md:mb-6 max-w-xl leading-relaxed" variants={itemVariants}>
              Parasram India brings decades of stock broking expertise to Panipat.
              Join thousands of investors who trust us with their financial future.
            </motion.p>

            {/* Rotating investment tip */}
            <motion.div
              className="flex items-center gap-2 md:gap-3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 md:px-4 md:py-3 mb-6 md:mb-10 backdrop-blur-md"
              variants={itemVariants}
            >
              <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <motion.span
                key={tipIndex}
                className="text-xs md:text-sm text-primary-foreground/90 line-clamp-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4 }}
              >
                {dynamicTips[tipIndex % dynamicTips.length]}
              </motion.span>
            </motion.div>

            <motion.div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-14" variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-secondary to-brand-green hover:from-secondary/90 hover:to-brand-green/90 text-secondary-foreground font-bold text-sm md:text-lg px-6 md:px-10 py-4 md:py-6 shadow-xl shadow-secondary/30 transition-all duration-300 w-full sm:w-auto"
                >
                  <Link to="/open-account">
                    Start Investing Today
                    <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-2 border-secondary/60 text-primary-foreground bg-secondary/20 hover:bg-secondary/40 font-bold text-sm md:text-lg px-6 md:px-10 py-4 md:py-6 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
                >
                  <a href="https://webtrade.parasramindia.com/#!/app" target="_blank" rel="noopener noreferrer">Start Trading Now</a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats with count-up */}
            <motion.div
              className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-primary-foreground/20"
              variants={containerVariants}
            >
              <StatCounter target={50} suffix="+" label="Years Legacy" delay={0.8} />
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, duration: 0.6 }}
              >
                <div className="text-2xl md:text-4xl font-bold text-primary-foreground">10L+</div>
                <div className="text-[10px] md:text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">Happy Clients</div>
              </motion.div>
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="text-2xl md:text-4xl font-bold text-primary-foreground">SEBI</div>
                <div className="text-[10px] md:text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">Registered</div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Right side — animated graphic + floating cards */}
          <motion.div
            className="hidden lg:flex items-center justify-center relative h-[520px]"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {/* Central orb */}
            <motion.div
              className="relative w-80 h-80"
              animate={{ y: [-10, 10, -10], rotate: [0, 3, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-dashed border-secondary/30"
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border-2 border-brand-gold/40"
                animate={{ rotate: -360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-16 rounded-full border border-secondary/20"
                animate={{ rotate: 180 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-12 rounded-full bg-gradient-to-br from-secondary/20 to-brand-gold/10 backdrop-blur-xl flex items-center justify-center border border-secondary/30">
                <motion.div
                  className="text-center"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <div className="text-4xl font-bold text-primary-foreground mb-1">₹</div>
                  <div className="text-sm text-primary-foreground/80 font-semibold">Invest Smart</div>
                </motion.div>
              </div>
              {/* Orbiting icons */}
              {[TrendingUp, Shield, Users, BarChart2].map((Icon, i) => {
                const angle = (i * 2 * Math.PI) / 4;
                const nextAngle = angle + 2 * Math.PI;
                return (
                  <motion.div
                    key={i}
                    className="absolute w-11 h-11 bg-gradient-to-br from-secondary to-brand-green rounded-full flex items-center justify-center shadow-lg"
                    style={{ top: '50%', left: '50%', marginTop: '-22px', marginLeft: '-22px' }}
                    animate={{
                      x: [Math.cos(angle) * 140, Math.cos(angle + Math.PI) * 140, Math.cos(nextAngle) * 140],
                      y: [Math.sin(angle) * 140, Math.sin(angle + Math.PI) * 140, Math.sin(nextAngle) * 140],
                    }}
                    transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Floating info cards — live data */}
            <FloatingCard delay={1.0} className="top-4 left-0 min-w-[160px]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${niftyData?.up !== false ? "bg-secondary/20" : "bg-destructive/20"}`}>
                  {niftyData?.up !== false ? <TrendingUp className="w-5 h-5 text-secondary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">NIFTY 50</div>
                  <div className={`font-bold text-sm ${niftyData?.up !== false ? "text-secondary" : "text-destructive"}`}>{niftyData?.change || "+0.85%"}</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1.2} className="top-4 right-0 min-w-[160px]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${sensexData?.up !== false ? "bg-secondary/20" : "bg-destructive/20"}`}>
                  {sensexData?.up !== false ? <TrendingUp className="w-5 h-5 text-secondary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">SENSEX</div>
                  <div className={`font-bold text-sm ${sensexData?.up !== false ? "text-secondary" : "text-destructive"}`}>{sensexData?.change || "+0.72%"}</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1.4} className="bottom-4 left-0 min-w-[170px]">
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${goldData?.up !== false ? "bg-brand-gold/20" : "bg-destructive/20"}`}>
                  {goldData?.up !== false ? <TrendingUp className="w-5 h-5 text-brand-gold" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">GOLD</div>
                  <div className={`font-bold text-sm ${goldData?.up !== false ? "text-brand-gold" : "text-destructive"}`}>{goldData?.price || "$2,345.60"}</div>
                </div>
              </div>
            </FloatingCard>

            <FloatingCard delay={1.6} className="bottom-4 right-0 min-w-[160px]">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">Since</div>
                  <div className="font-bold text-foreground text-sm">1970</div>
                </div>
              </div>
            </FloatingCard>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator — hidden on mobile */}
      <motion.a
        href="#about"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
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
