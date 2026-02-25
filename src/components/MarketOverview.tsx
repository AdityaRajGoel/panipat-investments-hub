import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Activity, Eye, ArrowUpRight, ArrowDownRight, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type Stock = {
  name: string;
  price: string;
  change: string;
  up: boolean;
};

const fallbackTopGainers: Stock[] = [
  { name: "TATA POWER", price: "₹432.50", change: "+4.8%", up: true },
  { name: "ADANI GREEN", price: "₹1,892.30", change: "+3.9%", up: true },
  { name: "ZOMATO", price: "₹178.60", change: "+3.5%", up: true },
  { name: "BHARTI AIRTEL", price: "₹1,245.60", change: "+2.1%", up: true },
  { name: "INFOSYS", price: "₹1,523.40", change: "+3.1%", up: true },
];

const fallbackTopLosers: Stock[] = [
  { name: "PAYTM", price: "₹412.80", change: "-3.2%", up: false },
  { name: "BAJAJ FIN", price: "₹6,892.30", change: "-1.2%", up: false },
  { name: "HDFC BANK", price: "₹1,678.25", change: "-0.8%", up: false },
  { name: "WIPRO", price: "₹478.90", change: "-0.6%", up: false },
  { name: "COAL INDIA", price: "₹425.30", change: "-1.5%", up: false },
];

const marketStats = [
  { icon: Activity, label: "Market Cap", value: "₹385L Cr", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: BarChart3, label: "Volume", value: "18.2B", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
  { icon: TrendingUp, label: "Advances", value: "1,456", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: TrendingDown, label: "Declines", value: "892", color: "text-destructive", bgColor: "bg-destructive/10" },
  { icon: Eye, label: "Most Active", value: "TATA STEEL", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Activity, label: "India VIX", value: "13.45", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
];

// Mini sparkline component
const MiniSparkline = ({ up, className = "" }: { up: boolean; className?: string }) => {
  const points = up
    ? "0,20 5,18 10,15 15,17 20,12 25,14 30,8 35,10 40,5 45,3 50,2"
    : "0,2 5,5 10,8 15,6 20,12 25,10 30,15 35,13 40,18 45,19 50,20";
  return (
    <svg viewBox="0 0 50 22" className={`w-16 h-6 ${className}`} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={up ? "hsl(145 70% 40%)" : "hsl(0 84% 60%)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const StockRow = ({ stock, index }: { stock: Stock; index: number }) => (
  <motion.div
    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group border-b border-border/30 last:border-0"
    initial={{ opacity: 0, x: -10 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: index * 0.06 }}
    whileHover={{ x: 4, backgroundColor: "hsl(145 70% 40% / 0.05)" }}
  >
    <div className="flex items-center gap-3">
      <motion.div
        className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${
          stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
        }`}
        whileHover={{ scale: 1.1, rotate: 5 }}
      >
        {stock.name.slice(0, 2)}
      </motion.div>
      <span className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors">{stock.name}</span>
    </div>
    <div className="flex items-center gap-4">
      <MiniSparkline up={stock.up} />
      <span className="text-sm text-muted-foreground font-medium w-24 text-right">{stock.price}</span>
      <span className={`flex items-center gap-0.5 text-xs font-bold px-2.5 py-1 rounded-full min-w-[70px] justify-center ${
        stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"
      }`}>
        {stock.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
        {stock.change}
      </span>
    </div>
  </motion.div>
);

const MarketOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const [activeTab, setActiveTab] = useState<"gainers" | "losers" | "active">("gainers");

  const activeData = activeTab === "gainers" ? fallbackTopGainers :
    activeTab === "losers" ? fallbackTopLosers : fallbackTopGainers;

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <motion.div
          className="absolute top-10 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl"
          animate={{ scale: [1.1, 0.9, 1.1] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
      </motion.div>

      {/* Animated grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div
          style={{
            backgroundImage: `linear-gradient(hsl(213 80% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 80% 25%) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            width: '100%',
            height: '100%',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <motion.span
            className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3"
            initial={{ letterSpacing: "0em" }}
            whileInView={{ letterSpacing: "0.15em" }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Market Pulse
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Today's Market Overview
          </h2>
          <motion.div
            className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full"
            initial={{ width: 0 }}
            whileInView={{ width: 80 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
          />
        </motion.div>

        {/* Market stats strip */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {marketStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="bg-card border border-border/50 rounded-xl p-4 text-center group cursor-pointer"
              whileHover={{ scale: 1.05, y: -4, borderColor: "hsl(145 70% 40% / 0.4)" }}
              transition={{ type: "spring", stiffness: 300 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <motion.div
                className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${stat.bgColor} group-hover:scale-110 transition-transform`}
                whileHover={{ rotate: [0, -10, 10, 0] }}
                transition={{ duration: 0.4 }}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </motion.div>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabbed Gainers/Losers/Active */}
        <Card className="overflow-hidden border-border/50 shadow-xl">
          <div className="bg-muted/50 px-5 py-3 border-b border-border/50 flex items-center gap-1">
            {(["gainers", "losers", "active"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab
                    ? tab === "losers"
                      ? "bg-destructive/10 text-destructive"
                      : "bg-secondary/10 text-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {tab === "gainers" && <TrendingUp className="w-4 h-4" />}
                {tab === "losers" && <TrendingDown className="w-4 h-4" />}
                {tab === "active" && <Activity className="w-4 h-4" />}
                {tab === "gainers" ? "Top Gainers" : tab === "losers" ? "Top Losers" : "Most Active"}
              </button>
            ))}
          </div>
          <CardContent className="p-2">
            {/* Table header */}
            <div className="flex items-center justify-between py-2 px-4 text-xs text-muted-foreground font-semibold uppercase tracking-wide border-b border-border/30">
              <span>Company</span>
              <div className="flex items-center gap-4">
                <span className="w-16 text-center">Chart</span>
                <span className="w-24 text-right">Price</span>
                <span className="w-[70px] text-center">Change</span>
              </div>
            </div>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {activeData.map((stock, i) => (
                <StockRow key={`${activeTab}-${stock.name}`} stock={stock} index={i} />
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default MarketOverview;
