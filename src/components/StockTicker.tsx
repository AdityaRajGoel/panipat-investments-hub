import { TrendingUp, TrendingDown, X, Clock } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveMarket, LiveStock } from "@/hooks/useLiveMarket";
import { useIsMobile } from "@/hooks/use-mobile";

interface TickerRowProps {
  items: LiveStock[];
  direction?: "left" | "right";
  bgClass?: string;
  textClass?: string;
  duration?: number;
}

const PriceCell = ({ item }: { item: LiveStock }) => {
  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevPrice = useRef(item.price);

  useEffect(() => {
    if (prevPrice.current !== item.price) {
      const prevNum = parseFloat(prevPrice.current.replace(/[,₹]/g, ''));
      const newNum = parseFloat(item.price.replace(/[,₹]/g, ''));
      if (!isNaN(prevNum) && !isNaN(newNum) && prevNum !== newNum) {
        setFlash(newNum > prevNum ? "up" : "down");
        const timer = setTimeout(() => setFlash(null), 1200);
        prevPrice.current = item.price;
        return () => clearTimeout(timer);
      }
      prevPrice.current = item.price;
    }
  }, [item.price]);

  return (
    <span
      className={`opacity-80 ${
        flash === "up" ? "text-secondary font-bold" :
        flash === "down" ? "text-destructive font-bold" : ""
      }`}
    >
      {item.price}
    </span>
  );
};

const TickerRow = ({ items, direction = "left", bgClass = "bg-brand-charcoal", textClass = "text-primary-foreground", duration = 40 }: TickerRowProps) => {
  const [selectedItem, setSelectedItem] = useState<LiveStock | null>(null);
  const duplicated = [...items, ...items];
  const isReverse = direction === "right";

  return (
    <div className={`${bgClass} ${textClass} py-1.5 md:py-2.5 overflow-hidden whitespace-nowrap relative border-b border-white/5`}>
      {/* Edge fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to right, hsl(220 20% 10%), transparent)` }} />
      <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none" style={{ background: `linear-gradient(to left, hsl(220 20% 10%), transparent)` }} />
      <div
        className="inline-flex gap-4 md:gap-10"
        style={{
          animation: `${isReverse ? 'ticker-right' : 'ticker-left'} ${duration}s linear infinite`,
          animationPlayState: selectedItem ? 'paused' : 'running',
          willChange: 'transform',
          transform: 'translate3d(0, 0, 0)',
          backfaceVisibility: 'hidden',
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-1.5 md:gap-3 text-xs md:text-sm cursor-pointer select-none px-2 md:px-3 py-1 rounded-md hover:bg-white/10 transition-colors group"
            onClick={() => setSelectedItem(item)}
          >
            <span className="font-bold tracking-wide text-white/90 group-hover:text-white transition-colors">{item.name}</span>
            {item.unit ? <span className="opacity-50 text-[10px] md:text-xs">{item.unit}</span> : null}
            <PriceCell item={item} />
            <span className={`flex items-center gap-0.5 font-bold text-[11px] md:text-xs px-1.5 py-0.5 rounded-full ${item.up ? "bg-secondary/30 text-[#4ade80]" : "bg-destructive/30 text-[#ff6b6b]"}`}>
              {item.up ? <TrendingUp className="w-2.5 h-2.5 md:w-3 md:h-3" /> : <TrendingDown className="w-2.5 h-2.5 md:w-3 md:h-3" />}
              {item.change}
            </span>
            <span className="text-white/10 text-lg mx-1">·</span>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedItem && (
          <motion.div
            className={`absolute inset-0 ${bgClass} flex items-center justify-center z-10`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`flex items-center gap-6 ${textClass}`}
              initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-center">
                <h3 className="text-xl md:text-2xl font-bold">
                  {selectedItem.name}
                  {selectedItem.unit ? <span className="text-sm font-normal ml-2 opacity-60">({selectedItem.unit})</span> : null}
                </h3>
                <div className="flex items-center justify-center gap-4 mt-1">
                  <span className="text-lg md:text-xl font-semibold opacity-90">{selectedItem.price}</span>
                  <span className={`flex items-center gap-1 text-base md:text-lg font-bold px-3 py-1 rounded-full ${selectedItem.up ? "bg-secondary/15 text-secondary" : "bg-destructive/15 text-destructive"}`}>
                    {selectedItem.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {selectedItem.change}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedItem(null)} className="p-2 rounded-full hover:bg-white/10 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const formatTradingDate = (dateStr: string) => {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

const useCountdown = (targetISO: string | null) => {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (!targetISO) { setRemaining(""); return; }
    
    const update = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) { setRemaining(""); return; }
      
      const hours = Math.floor(diff / 3600000);
      const mins = Math.floor((diff % 3600000) / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      
      if (hours > 0) {
        setRemaining(`${hours}h ${mins}m ${secs}s`);
      } else if (mins > 0) {
        setRemaining(`${mins}m ${secs}s`);
      } else {
        setRemaining(`${secs}s`);
      }
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetISO]);

  return remaining;
};

const CountdownTimer = ({ fetchedAt, marketOpen }: { fetchedAt: string | null, marketOpen: boolean }) => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (!fetchedAt) return;
    const fetchTime = new Date(fetchedAt).getTime();
    const interval = marketOpen ? 60 : 300;
    
    const timer = setInterval(() => {
      if (document.hidden) return; // Skip updates when tab is hidden
      const elapsed = Math.floor((Date.now() - fetchTime) / 1000);
      const remaining = Math.max(0, interval - elapsed);
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(timer);
  }, [fetchedAt, marketOpen]);

  if (!marketOpen) return null;

  return (
    <span className="text-[9px] text-primary-foreground/40 font-medium">
      {countdown > 0 ? `↻ ${countdown}s` : "Updating..."}
    </span>
  );
};

const StockTicker = () => {
  const isMobile = useIsMobile();
  const { stocks, commodities, fetchedAt, marketOpen, marketStatusText, lastTradingDate, nextMarketOpen, marketClose } = useLiveMarket();
  const nextOpenCountdown = useCountdown(nextMarketOpen);
  const closeCountdown = useCountdown(marketClose);

  return (
    <div className="border-b border-brand-orange/20 bg-brand-charcoal relative">
      <TickerRow items={stocks} direction="left" bgClass="bg-brand-charcoal" textClass="text-primary-foreground" duration={60} />
      {!isMobile && (
        <>
          <div className="h-px bg-brand-orange/15" />
          <TickerRow items={commodities} direction="right" bgClass="bg-brand-charcoal/95" textClass="text-primary-foreground" duration={60} />
        </>
      )}
      
      {/* Market status bar */}
      <div className="absolute top-1 right-2 flex items-center gap-2 z-20">
        {/* Status badge */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full ${
          marketOpen 
            ? "bg-secondary/20 border border-secondary/30" 
            : marketStatusText === "Pre-Market"
              ? "bg-brand-orange/20 border border-brand-orange/30"
              : marketStatusText === "After Hours"
                ? "bg-purple-500/20 border border-purple-500/30"
                : "bg-destructive/15 border border-destructive/20"
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            marketOpen ? "bg-secondary animate-pulse" 
            : marketStatusText === "Pre-Market" ? "bg-brand-orange animate-pulse"
            : marketStatusText === "After Hours" ? "bg-purple-400 animate-pulse"
            : "bg-destructive/60"
          }`} />
          <span className={`text-[9px] font-semibold ${
            marketOpen ? "text-secondary" 
            : marketStatusText === "Pre-Market" ? "text-brand-orange"
            : marketStatusText === "After Hours" ? "text-purple-300"
            : "text-[#ff8a8a]"
          }`}>
            {marketStatusText}
          </span>
        </div>

        {/* Countdown / date info */}
        {marketOpen && closeCountdown && (
          <span className="text-[8px] text-primary-foreground/50 font-medium flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Closes in {closeCountdown}
          </span>
        )}
        {!marketOpen && nextOpenCountdown && (
          <span className="text-[8px] text-primary-foreground/50 font-medium flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" />
            Opens in {nextOpenCountdown}
          </span>
        )}
        {!marketOpen && lastTradingDate && !nextOpenCountdown && (
          <span className="text-[8px] text-primary-foreground/40 font-medium">
            Closing: {formatTradingDate(lastTradingDate)}
          </span>
        )}
        {marketOpen && (
          <CountdownTimer fetchedAt={fetchedAt} marketOpen={marketOpen} />
        )}
      </div>
    </div>
  );
};

export default StockTicker;
