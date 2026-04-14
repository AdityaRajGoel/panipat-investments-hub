import { ArrowRight, TrendingUp, TrendingDown, Shield, Users, Sparkles, Award, BarChart2, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion";
import { useEffect, useState, useRef, useMemo, memo } from "react";
import { useLiveMarket } from "@/hooks/useLiveMarket";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";
import platformImg from "@/assets/parasram-india.webp";

type IndexData = { name: string; price: string; change: string; up: boolean };

// Lightweight count-up — requestAnimationFrame based
function useCountUp(target: number, duration = 2, delay = 0) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let raf: number;
    let startTime: number;

    const timeout = setTimeout(() => {
      startTime = performance.now();
      const tick = (now: number) => {
        const elapsed = (now - startTime) / 1000;
        if (elapsed >= duration) { setCount(target); return; }
        setCount(Math.floor((elapsed / duration) * target));
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, delay * 1000);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [target, duration, delay]);

  return count;
}

const StatCounter = memo(({ target, label, suffix = "", delay = 0 }: { target: number; label: string; suffix?: string; delay?: number }) => {
  const count = useCountUp(target, 2, delay);
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
    >
      <div className="text-2xl md:text-4xl font-bold text-primary-foreground">
        {count.toLocaleString('en-IN')}{suffix}
      </div>
      <div className="text-[10px] md:text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">{label}</div>
    </motion.div>
  );
});

// Market Summary Bar — advances/declines/unchanged
const MarketBreadthBar = memo(() => {
  const { marketOverview, marketOpen, marketStatusText } = useLiveMarket();
  const advances = marketOverview?.advances ?? 0;
  const declines = marketOverview?.declines ?? 0;
  const unchanged = marketOverview?.unchanged ?? 0;
  const total = advances + declines + unchanged;

  if (total === 0) return null;

  const advPct = (advances / total) * 100;
  const decPct = (declines / total) * 100;

  return (
    <motion.div
      className="flex flex-col gap-1.5 bg-white/8 border border-white/15 rounded-xl px-3 py-2.5 md:px-4 md:py-3 backdrop-blur-sm mb-4 md:mb-6"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.5 }}
    >
      <div className="flex items-center justify-between">
        <span className="text-[10px] md:text-xs text-primary-foreground/70 font-semibold uppercase tracking-wide">
          Market Breadth
        </span>
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${marketOpen ? "bg-secondary animate-pulse" : "bg-destructive/60"}`} />
          <span className="text-[9px] md:text-[10px] text-primary-foreground/50 font-medium">{marketStatusText}</span>
        </div>
      </div>
      {/* Breadth bar */}
      <div className="w-full h-2 md:h-2.5 rounded-full overflow-hidden flex bg-white/10">
        <div className="bg-secondary rounded-l-full transition-all duration-700" style={{ width: `${advPct}%` }} />
        <div className="bg-primary-foreground/30 transition-all duration-700" style={{ width: `${100 - advPct - decPct}%` }} />
        <div className="bg-destructive rounded-r-full transition-all duration-700" style={{ width: `${decPct}%` }} />
      </div>
      <div className="flex items-center justify-between text-[10px] md:text-xs">
        <span className="text-secondary font-bold">▲ {advances} Advances</span>
        <span className="text-primary-foreground/50 font-medium">{unchanged} Unchanged</span>
        <span className="text-destructive font-bold">▼ {declines} Declines</span>
      </div>
    </motion.div>
  );
});

const Hero = () => {
  const isMobile = useIsMobile();
  const { indices: liveIndices, commodities, marketOverview } = useLiveMarket();

  const heroIndices = useMemo(() =>
    liveIndices.filter(idx => ["NIFTY", "SENSEX", "BANKNIFTY"].includes(idx.key)).map(idx => ({
      name: idx.name, price: idx.price, change: idx.change, up: idx.up,
    })),
    [liveIndices]
  );

  const niftyData = liveIndices.find(idx => idx.key === "NIFTY");
  const sensexData = liveIndices.find(idx => idx.key === "SENSEX");
  const goldData = commodities.find(c => c.name === "GOLD");

  const dynamicTips = useMemo(() => {
    const tips = [
      "💡 Diversify your portfolio across sectors",
      "🛡️ Never invest money you can't afford to lose",
      "🔍 Research before you invest",
    ];
    if (niftyData?.up) tips.unshift(`📈 NIFTY 50 is up ${niftyData.change} — markets looking bullish today`);
    else if (niftyData) tips.unshift(`📉 NIFTY 50 is down ${niftyData.change} — consider buying the dip wisely`);
    if (goldData?.up) tips.push(`✨ Gold is up ${goldData.change} — a safe haven in volatile markets`);
    if (marketOverview) {
      const { advances = 0, declines = 0 } = marketOverview;
      if (advances > declines) tips.push(`🟢 ${advances} advances vs ${declines} declines — broad market strength`);
      else if (declines > advances) tips.push(`🔴 ${declines} declines vs ${advances} advances — stay cautious`);
    }
    return tips;
  }, [niftyData, goldData, marketOverview]);

  const trustBadges = useMemo(() => [
    { icon: Award, label: "SEBI Registered" },
    { icon: Lock, label: "Secure Trading" },
    { icon: Star, label: "5-Star Rated" },
  ], []);

  const [tipIndex, setTipIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTipIndex(i => (i + 1) % dynamicTips.length), 3500);
    return () => clearInterval(t);
  }, [dynamicTips.length]);

  // Mouse-tracking parallax for the platform image
  const sectionRef = useRef<HTMLElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 60, damping: 20 });
  const imgX = useTransform(springX, [-1, 1], [-18, 18]);
  const imgY = useTransform(springY, [-1, 1], [-12, 12]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    requestAnimationFrame(() => {
      const rect = sectionRef.current?.getBoundingClientRect();
      if (!rect) return;
      mouseX.set(((e.clientX - rect.left) / rect.width - 0.5) * 2);
      mouseY.set(((e.clientY - rect.top) / rect.height - 0.5) * 2);
    });
  };

  return (
    <section ref={sectionRef} onMouseMove={handleMouseMove} className="relative min-[85svh] lg:min-h-screen flex items-center overflow-hidden">
      {/* Video background */}
      <div 
        className="absolute inset-0 pointer-events-none z-0" 
        style={{ willChange: 'transform', transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
      >
        {/* LCP: discoverable poster image with high fetch priority */}
        <img
          src="/hero-bg.jpg"
          alt="Parasram India - Stock Trading Platform and Investment Background"
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
        />
        <video
          src="/video.mp4"
          poster="/hero-bg.jpg"
          autoPlay
          loop
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ transform: 'translate3d(0,0,0)', backfaceVisibility: 'hidden' }}
        />
        {/* Brand overlay — keeps text legible */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-navy/72 via-brand-navy/58 to-brand-green/40" />
        {/* Original solid gradient as mid-layer */}
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, hsl(213 80% 12% / 0.72) 0%, hsl(213 80% 22% / 0.68) 50%, hsl(145 70% 25% / 0.65) 100%)`,
          }}
        />
        {/* Subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-8 md:py-24 2xl:py-32 relative z-10 h-full min-h-screen flex items-center">
        <div className="w-full md:w-[55%] lg:w-1/2 2xl:w-[50%]">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-4 md:mb-6">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="inline-flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-2.5 py-1 md:px-3 md:py-1.5 backdrop-blur-sm"
                >
                  <Icon className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary" />
                  <span className="text-primary-foreground text-[11px] md:text-xs font-semibold">{label}</span>
                </div>
              ))}
            </div>

            {/* Live Index Cards */}
            <div className="flex overflow-x-auto snap-x snap-mandatory gap-2 md:flex-wrap md:gap-3 mb-4 md:mb-6 w-full pb-2 md:pb-0 scrollbar-hide">
              {heroIndices.map((idx) => (
                <div
                  key={idx.name}
                  className="flex items-center w-[160px] md:w-auto md:min-w-0 flex-shrink-0 md:flex-shrink md:flex-1 gap-2 md:gap-3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 md:px-4 md:py-3 backdrop-blur-sm hover:bg-white/15 transition-colors snap-center"
                >
                  <div className={`w-6 h-6 md:w-8 md:h-8 rounded-lg flex items-center justify-center shrink-0 ${idx.up ? "bg-secondary/20" : "bg-destructive/20"}`}>
                    {idx.up ? <TrendingUp className="w-3 h-3 md:w-4 md:h-4 text-secondary" /> : <TrendingDown className="w-3 h-3 md:w-4 md:h-4 text-destructive" />}
                  </div>
                  <div className="min-w-0">
                    <div className="text-[9px] md:text-[10px] text-primary-foreground/60 font-semibold uppercase tracking-wide truncate">{idx.name}</div>
                    <div className="text-xs md:text-sm font-bold text-primary-foreground truncate">{idx.price}</div>
                    <div className={`text-[10px] md:text-xs font-bold ${idx.up ? "text-secondary" : "text-destructive"}`}>{idx.change}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Market Breadth Bar — NEW */}
            <div className="w-full hidden md:block">
              <MarketBreadthBar />
            </div>

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold text-primary-foreground mb-4 md:mb-8 2xl:mb-12 leading-[1.1] 2xl:leading-[1.15]" style={{ minHeight: '2.6em' }}>
              Your Trusted Partner
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-brand-gold to-secondary pb-1 2xl:pb-2 block">
                for Smart Investments
              </span>
            </h1>

            <p className="text-sm md:text-xl 2xl:text-2xl text-primary-foreground/80 mb-3 md:mb-6 2xl:mb-10 max-w-xl 2xl:max-w-3xl leading-snug md:leading-relaxed line-clamp-3 md:line-clamp-none">
              Parasram India brings decades of stock broking expertise to Panipat.
              Join thousands of investors who trust us with their financial future.
            </p>

            {/* Rotating investment tip */}
            <div className="flex items-center gap-2 md:gap-3 bg-white/10 border border-white/20 rounded-xl px-3 py-2 md:px-4 md:py-3 mb-6 md:mb-10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-brand-gold flex-shrink-0" />
              <span className="text-xs md:text-sm text-primary-foreground/90 line-clamp-2">
                {dynamicTips[tipIndex % dynamicTips.length]}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-14 2xl:mb-20">
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-secondary to-brand-green hover:from-secondary/90 hover:to-brand-green/90 text-secondary-foreground font-bold text-sm md:text-lg 2xl:text-xl px-6 md:px-10 2xl:px-14 py-4 md:py-6 2xl:py-8 shadow-xl shadow-secondary/30 transition-all duration-300 w-full sm:w-auto"
              >
                <Link to="/open-account">
                  Start Investing Today
                  <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 2xl:w-6 2xl:h-6" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-secondary/60 text-primary-foreground bg-secondary/20 hover:bg-secondary/40 font-bold text-sm md:text-lg 2xl:text-xl px-6 md:px-10 2xl:px-14 py-4 md:py-6 2xl:py-8 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
              >
                <a href="https://webtrade.parasramindia.com/#!/app" target="_blank" rel="noopener noreferrer">Start Trading Now</a>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 md:gap-6 pt-6 md:pt-8 border-t border-primary-foreground/20">
              <StatCounter target={50} suffix="+" label="Years Legacy" delay={0.8} />
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-primary-foreground">10L+</div>
                <div className="text-[10px] md:text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">Happy Clients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-primary-foreground">SEBI</div>
                <div className="text-[10px] md:text-xs text-primary-foreground/60 uppercase tracking-wide mt-1">Registered</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Platform image + floating cards — absolutely positioned right half */}
      {!isMobile && (
        <motion.div
          className="absolute inset-y-0 right-0 w-[45%] lg:w-1/2 hidden md:flex flex-col items-center justify-center z-10 pointer-events-none px-6 2xl:px-12"
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.4 }}
        >
          {/* Floating live market cards to fill gap above image */}
          <div className="flex items-center gap-3 mb-5 pointer-events-auto">
            {[
              { label: "NIFTY 50", data: niftyData, delay: 0 },
              { label: "SENSEX", data: sensexData, delay: 0.5 },
              { label: "GOLD", data: goldData, delay: 1 },
            ].map(({ label, data, delay }) => (
              <div
                key={label}
                className="bg-black/35 backdrop-blur-md border border-white/15 rounded-2xl px-3 py-2.5 flex items-center gap-2.5 shadow-xl"
              >
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${data?.up !== false ? "bg-secondary/20" : "bg-destructive/20"}`}>
                  {data?.up !== false
                    ? <TrendingUp className="w-4 h-4 text-secondary" />
                    : <TrendingDown className="w-4 h-4 text-destructive" />}
                </div>
                <div>
                  <div className="text-[10px] text-white/50 font-bold uppercase tracking-wider">{label}</div>
                  <div className={`text-sm font-bold ${data?.up !== false ? "text-secondary" : "text-destructive"}`}>
                    {data?.change || "+0.00%"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Glow halo */}
          <div
            className="absolute w-[50%] h-[50%] rounded-full blur-3xl pointer-events-none"
            style={{ 
              background: 'radial-gradient(circle, hsl(145 70% 40% / 0.3) 0%, hsl(213 80% 40% / 0.15) 60%, transparent 100%)',
              animation: 'pulse-glow 4s ease-in-out infinite' 
            }}
          />

          {/* Platform screenshot */}
          <motion.img
            src={platformImg}
            alt="Parasram India Platform"
            width={896}
            height={560}
            fetchPriority="high"
            className="w-full object-contain drop-shadow-2xl relative z-10 2xl:max-w-4xl"
            style={{ maxHeight: '75%', x: imgX, y: imgY }}
          />
        </motion.div>
      )}

      {/* Scroll indicator — desktop only */}
      {!isMobile && (
        <a
          href="#about"
          aria-label="Scroll down to explore more content"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium tracking-wider uppercase">Scroll Down</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full" style={{ animation: 'scrollBounce 1.5s ease-in-out infinite' }} />
          </div>
        </a>
      )}
    </section>
  );
};

export default memo(Hero);
