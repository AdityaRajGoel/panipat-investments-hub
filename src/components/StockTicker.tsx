import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

const stocks = [
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
  const duplicated = [...stocks, ...stocks];

  return (
    <div className="bg-foreground text-primary-foreground py-2 overflow-hidden whitespace-nowrap">
      <motion.div
        className="inline-flex gap-8"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {duplicated.map((stock, i) => (
          <div key={i} className="inline-flex items-center gap-2 text-sm">
            <span className="font-semibold">{stock.name}</span>
            <span className="text-primary-foreground/80">₹{stock.price}</span>
            <span className={`flex items-center gap-0.5 font-medium ${stock.up ? "text-secondary" : "text-destructive"}`}>
              {stock.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {stock.change}
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default StockTicker;
