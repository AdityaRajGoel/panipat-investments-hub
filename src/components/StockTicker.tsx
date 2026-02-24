import { TrendingUp, TrendingDown, X } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

type Stock = {
  name: string;
  price: string;
  change: string;
  up: boolean;
  unit?: string;
};

const fallbackStocks: Stock[] = [
  { name: "NIFTY 50", price: "22,147.00", change: "+0.85%", up: true },
  { name: "SENSEX", price: "72,831.94", change: "+0.72%", up: true },
  { name: "BANK NIFTY", price: "46,893.65", change: "-0.32%", up: false },
  { name: "RELIANCE", price: "2,847.50", change: "+2.30%", up: true },
  { name: "TCS", price: "3,456.80", change: "+1.50%", up: true },
  { name: "HDFC BANK", price: "1,678.25", change: "-0.80%", up: false },
  { name: "INFOSYS", price: "1,523.40", change: "+3.10%", up: true },
  { name: "ICICI BANK", price: "987.65", change: "+0.90%", up: true },
  { name: "ITC", price: "435.20", change: "+1.15%", up: true },
  { name: "BAJAJ FIN", price: "6,892.30", change: "-1.20%", up: false },
  { name: "TATA MOTORS", price: "785.40", change: "+1.45%", up: true },
  { name: "SBI", price: "625.80", change: "+0.65%", up: true },
  { name: "BHARTI AIRTEL", price: "1,245.60", change: "+2.10%", up: true },
  { name: "WIPRO", price: "478.90", change: "-0.55%", up: false },
  { name: "HCL TECH", price: "1,567.30", change: "+1.80%", up: true },
];

const fallbackCommodities: Stock[] = [
  { name: "GOLD", price: "2,345.60", change: "+0.45%", up: true, unit: "USD/oz" },
  { name: "SILVER", price: "29.82", change: "+1.20%", up: true, unit: "USD/oz" },
  { name: "CRUDE OIL", price: "78.45", change: "-0.65%", up: false, unit: "USD/bbl" },
  { name: "NAT GAS", price: "2.34", change: "-1.10%", up: false, unit: "USD/MMBtu" },
  { name: "COPPER", price: "4.52", change: "+0.80%", up: true, unit: "USD/lb" },
  { name: "ALUMINIUM", price: "0.96", change: "-0.45%", up: false, unit: "USD/lb" },
  { name: "ZINC", price: "2,785.00", change: "+0.60%", up: true, unit: "USD/t" },
  { name: "MCX LEAD", price: "0.88", change: "-0.30%", up: false, unit: "USD/lb" },
  { name: "WHEAT", price: "548.25", change: "-0.30%", up: false, unit: "USD/bu" },
  { name: "NIFTY FUT", price: "22,180.00", change: "+0.90%", up: true, unit: "INR" },
  { name: "BANKNIFTY FUT", price: "46,950.00", change: "-0.25%", up: false, unit: "INR" },
  { name: "INDIA VIX", price: "13.45", change: "-2.10%", up: false, unit: "" },
  { name: "USD/INR", price: "83.42", change: "+0.05%", up: true, unit: "" },
  { name: "EUR/INR", price: "90.15", change: "-0.12%", up: false, unit: "" },
  { name: "GBP/INR", price: "105.78", change: "+0.08%", up: true, unit: "" },
];

interface TickerRowProps {
  items: Stock[];
  direction?: "left" | "right";
  bgClass?: string;
  textClass?: string;
  duration?: number;
}

const TickerRow = ({ items, direction = "left", bgClass = "bg-foreground", textClass = "text-primary-foreground", duration = 40 }: TickerRowProps) => {
  const [selectedItem, setSelectedItem] = useState<Stock | null>(null);

  const duplicated = [...items, ...items];
  const isReverse = direction === "right";

  const handleClick = (item: Stock) => {
    setSelectedItem(item);
  };

  const handleClose = () => {
    setSelectedItem(null);
  };

  return (
    <div className={`${bgClass} ${textClass} py-2.5 overflow-hidden whitespace-nowrap relative`}>
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
            onClick={() => handleClick(item)}
          >
            <span className="font-semibold tracking-wide">{item.name}</span>
            {item.unit ? (
              <span className="opacity-70 text-xs">{item.unit}</span>
            ) : null}
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className={`flex items-center gap-6 ${textClass}`}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
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
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
              >
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
  const [stocks, setStocks] = useState<Stock[]>(fallbackStocks);
  const [commodities, setCommodities] = useState<Stock[]>(fallbackCommodities);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-stock-prices');
        if (!error && data?.success) {
          if (data.data?.length > 0) setStocks(data.data);
          if (data.commodities?.length > 0) setCommodities(data.commodities);
        }
      } catch (e) {
        console.log('Using fallback stock data');
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="border-b border-border/20">
      <TickerRow items={stocks} direction="left" bgClass="bg-foreground" textClass="text-primary-foreground" duration={80} />
      <div className="h-px bg-primary/20" />
      <TickerRow items={commodities} direction="right" bgClass="bg-foreground/90" textClass="text-primary-foreground" duration={80} />
    </div>
  );
};

export default StockTicker;
