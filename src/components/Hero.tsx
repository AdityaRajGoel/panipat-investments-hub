import { ArrowRight, TrendingUp, TrendingDown, Shield, Users, Sparkles, Award, BarChart2, Lock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useEffect, useState, useMemo, memo } from "react";
import { useLiveMarket } from "@/hooks/useLiveMarket";
import { Link } from "react-router-dom";
import { useIsMobile } from "@/hooks/use-mobile";

type IndexData = { name: string; price: string; change: string; up: boolean };

// Lightweight count-up — requestAnimationFrame based
function useCountUp(target: number, duration = 2) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!started) return;
    const startTime = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      if (elapsed >= duration) { setCount(target); return; }
      setCount(Math.floor((elapsed / duration) * target));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, target, duration]);

  return { count, start: () => setStarted(true) };
}

const StatCounter = memo(({ target, label, suffix = "", delay = 0 }: { target: number; label: string; suffix?: string; delay?: number }) => {
  const { count, start } = useCountUp(target, 2);
  return (
    <motion.div
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6 }}
      onAnimationComplete={start}
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

  return (
    <section
      className="relative min-h-[85vh] md:min-h-screen flex items-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, hsl(213 80% 12% / 0.92) 0%, hsl(213 80% 22% / 0.88) 50%, hsl(145 70% 25% / 0.85) 100%)`,
      }}
    >
      {/* Lightweight background — CSS only, no framer-motion */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-48 md:w-96 h-48 md:h-96 bg-gradient-to-br from-secondary/20 to-brand-gold/10 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '8s' }} />
        {!isMobile && (
          <>
            <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-tl from-brand-gold/15 to-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '12s' }} />
            <div className="absolute top-1/2 left-1/3 w-60 h-60 bg-gradient-to-r from-primary/15 to-secondary/15 rounded-full blur-2xl animate-pulse" style={{ animationDuration: '10s' }} />
          </>
        )}
        {/* Grid pattern — CSS only */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
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
            <div className="grid grid-cols-3 gap-2 md:flex md:flex-wrap md:gap-3 mb-4 md:mb-6">
              {heroIndices.map((idx) => (
                <div
                  key={idx.name}
                  className="flex items-center gap-2 md:gap-3 bg-white/10 border border-white/20 rounded-xl px-2.5 py-2 md:px-4 md:py-3 backdrop-blur-sm"
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
            <MarketBreadthBar />

            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-primary-foreground mb-4 md:mb-8 leading-[1.1]">
              Your Trusted Partner
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-brand-gold to-secondary">
                for Smart Investments
              </span>
            </h1>

            <p className="text-base md:text-xl text-primary-foreground/85 mb-4 md:mb-6 max-w-xl leading-relaxed">
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

            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-8 md:mb-14">
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
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-secondary/60 text-primary-foreground bg-secondary/20 hover:bg-secondary/40 font-bold text-sm md:text-lg px-6 md:px-10 py-4 md:py-6 backdrop-blur-sm transition-all duration-300 w-full sm:w-auto"
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

          {/* Right side — desktop only, simplified */}
          {!isMobile && (
            <div className="hidden lg:flex items-center justify-center relative h-[520px]">
              {/* Central orb — CSS animations instead of framer-motion */}
              <div className="relative w-80 h-80" style={{ animation: 'float 6s ease-in-out infinite' }}>
                <div className="absolute inset-0 rounded-full border-4 border-dashed border-secondary/30" style={{ animation: 'spin 30s linear infinite' }} />
                <div className="absolute inset-8 rounded-full border-2 border-brand-gold/40" style={{ animation: 'spin 25s linear infinite reverse' }} />
                <div className="absolute inset-16 rounded-full border border-secondary/20" style={{ animation: 'spin 15s linear infinite' }} />
                <div className="absolute inset-12 rounded-full bg-gradient-to-br from-secondary/20 to-brand-gold/10 backdrop-blur-xl flex items-center justify-center border border-secondary/30">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary-foreground mb-1">₹</div>
                    <div className="text-sm text-primary-foreground/80 font-semibold">Invest Smart</div>
                  </div>
                </div>
                {/* Orbiting icons — CSS transforms */}
                {[TrendingUp, Shield, Users, BarChart2].map((Icon, i) => (
                  <div
                    key={i}
                    className="absolute w-11 h-11 bg-gradient-to-br from-secondary to-brand-green rounded-full flex items-center justify-center shadow-lg"
                    style={{
                      top: '50%', left: '50%',
                      marginTop: '-22px', marginLeft: '-22px',
                      animation: `orbit 18s linear infinite`,
                      animationDelay: `${-i * 4.5}s`,
                    }}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                ))}
              </div>

              {/* Floating cards — static positioned, CSS hover only */}
              <div className="absolute top-4 left-0 bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[160px]" style={{ animation: 'float 4s ease-in-out infinite' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${niftyData?.up !== false ? "bg-secondary/20" : "bg-destructive/20"}`}>
                    {niftyData?.up !== false ? <TrendingUp className="w-5 h-5 text-secondary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">NIFTY 50</div>
                    <div className={`font-bold text-sm ${niftyData?.up !== false ? "text-secondary" : "text-destructive"}`}>{niftyData?.change || "+0.85%"}</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 right-0 bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[160px]" style={{ animation: 'float 5s ease-in-out infinite 0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${sensexData?.up !== false ? "bg-secondary/20" : "bg-destructive/20"}`}>
                    {sensexData?.up !== false ? <TrendingUp className="w-5 h-5 text-secondary" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">SENSEX</div>
                    <div className={`font-bold text-sm ${sensexData?.up !== false ? "text-secondary" : "text-destructive"}`}>{sensexData?.change || "+0.72%"}</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-0 bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[170px]" style={{ animation: 'float 4.5s ease-in-out infinite 1s' }}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${goldData?.up !== false ? "bg-brand-gold/20" : "bg-destructive/20"}`}>
                    {goldData?.up !== false ? <TrendingUp className="w-5 h-5 text-brand-gold" /> : <TrendingDown className="w-5 h-5 text-destructive" />}
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">GOLD</div>
                    <div className={`font-bold text-sm ${goldData?.up !== false ? "text-brand-gold" : "text-destructive"}`}>{goldData?.price || "$2,345.60"}</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 right-0 bg-card/80 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-4 min-w-[160px]" style={{ animation: 'float 5.5s ease-in-out infinite 1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Since</div>
                    <div className="font-bold text-foreground text-sm">1970</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      {!isMobile && (
        <a
          href="#about"
          className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-primary-foreground/60 hover:text-primary-foreground transition-colors cursor-pointer"
        >
          <span className="text-sm font-medium tracking-wider uppercase">Explore</span>
          <div className="w-6 h-10 rounded-full border-2 border-primary-foreground/40 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-secondary rounded-full" style={{ animation: 'scrollBounce 1.5s ease-in-out infinite' }} />
          </div>
        </a>
      )}
    </section>
  );
};

export default memo(Hero);
