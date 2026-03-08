import { TrendingUp, TrendingDown, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveMarket, LiveStock } from "@/hooks/useLiveMarket";

interface TickerRowProps {
  items: LiveStock[];
  direction?: "left" | "right";
  bgClass?: string;
  textClass?: string;
  duration?: number;
}

const TickerRow = ({ items, direction = "left", bgClass = "bg-brand-charcoal", textClass = "text-primary-foreground", duration = 40 }: TickerRowProps) => {
  const [selectedItem, setSelectedItem] = useState<LiveStock | null>(null);
  const duplicated = [...items, ...items];
  const isReverse = direction === "right";

  return (
    <div className={`${bgClass} ${textClass} py-2.5 overflow-hidden whitespace-nowrap relative border-b border-brand-orange/10`}>
      <div
        className="inline-flex gap-10"
        style={{
          animation: `${isReverse ? 'ticker-right' : 'ticker-left'} ${duration}s linear infinite`,
          animationPlayState: selectedItem ? 'paused' : 'running',
        }}
      >
        {duplicated.map((item, i) => (
          <div
            key={i}
            className="inline-flex items-center gap-3 text-sm cursor-pointer select-none px-3 py-1 rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setSelectedItem(item)}
          >
            <span className="font-semibold tracking-wide">{item.name}</span>
            {item.unit ? <span className="opacity-70 text-xs">{item.unit}</span> : null}
            <span className="opacity-80">{item.price}</span>
            <span className={`flex items-center gap-0.5 font-medium ${item.up ? "text-secondary" : "text-destructive"}`}>
              {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {item.change}
            </span>
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
                  <span className={`flex items-center gap-1 text-base md:text-lg font-bold ${selectedItem.up ? "text-secondary" : "text-destructive"}`}>
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

const StockTicker = () => {
  const { stocks, commodities } = useLiveMarket();

  // Combine index data with stocks for first row
  return (
    <div className="border-b border-brand-orange/20 bg-brand-charcoal">
      <TickerRow items={stocks} direction="left" bgClass="bg-brand-charcoal" textClass="text-primary-foreground" duration={80} />
      <div className="h-px bg-brand-orange/15" />
      <TickerRow items={commodities} direction="right" bgClass="bg-brand-charcoal/95" textClass="text-primary-foreground" duration={80} />
    </div>
  );
};

export default StockTicker;
