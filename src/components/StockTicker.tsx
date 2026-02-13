import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, TrendingDown, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

type Stock = {
  name: string;
  price: string;
  change: string;
  up: boolean;
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
];

const StockTicker = () => {
  const [stocks, setStocks] = useState<Stock[]>(fallbackStocks);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('fetch-stock-prices');
        if (!error && data?.success && data.data?.length > 0) {
          setStocks(data.data);
        }
      } catch (e) {
        console.log('Using fallback stock data');
      }
    };

    fetchPrices();
    // Refresh every 5 minutes during market hours
    const interval = setInterval(fetchPrices, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const duplicated = [...stocks, ...stocks];

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsPaused(true);
  };

  const handleClose = () => {
    setSelectedStock(null);
    setIsPaused(false);
  };

  return (
    <div className="bg-foreground text-primary-foreground py-3 overflow-hidden whitespace-nowrap relative">
      <motion.div
        ref={tickerRef}
        className="inline-flex gap-10"
        animate={isPaused ? {} : { x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {duplicated.map((stock, i) => (
          <motion.div
            key={i}
            className="inline-flex items-center gap-3 text-base cursor-pointer select-none px-3 py-1 rounded-md hover:bg-primary-foreground/10 transition-colors"
            onClick={() => handleStockClick(stock)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="font-semibold">{stock.name}</span>
            <span className="text-primary-foreground/80">₹{stock.price}</span>
            <span className={`flex items-center gap-0.5 font-medium ${stock.up ? "text-secondary" : "text-destructive"}`}>
              {stock.up ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
              {stock.change}
            </span>
          </motion.div>
        ))}
      </motion.div>

      {/* Expanded stock overlay */}
      <AnimatePresence>
        {selectedStock && (
          <motion.div
            className="absolute inset-0 bg-foreground flex items-center justify-center z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="flex items-center gap-6 text-primary-foreground"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <div className="text-center">
                <h3 className="text-2xl md:text-3xl font-bold">{selectedStock.name}</h3>
                <div className="flex items-center justify-center gap-4 mt-1">
                  <span className="text-xl md:text-2xl font-semibold text-primary-foreground/90">₹{selectedStock.price}</span>
                  <span className={`flex items-center gap-1 text-lg md:text-xl font-bold ${selectedStock.up ? "text-secondary" : "text-destructive"}`}>
                    {selectedStock.up ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {selectedStock.change}
                  </span>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="p-2 rounded-full hover:bg-primary-foreground/10 transition-colors"
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

export default StockTicker;
