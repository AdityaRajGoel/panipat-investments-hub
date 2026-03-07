import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { TrendingUp, TrendingDown, Activity, Eye, ArrowUpRight, ArrowDownRight, BarChart3, Layers, PieChart, Gem } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Stock = { name: string; price: string; change: string; up: boolean };

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

const fnoData: Stock[] = [
  { name: "NIFTY 22500 CE", price: "₹185.50", change: "+12.5%", up: true },
  { name: "NIFTY 22000 PE", price: "₹72.30", change: "-8.2%", up: false },
  { name: "BANKNIFTY 47000 CE", price: "₹312.80", change: "+6.3%", up: true },
  { name: "RELIANCE 2900 CE", price: "₹45.60", change: "+15.1%", up: true },
  { name: "TCS 4000 PE", price: "₹28.40", change: "-4.7%", up: false },
];

const mutualFunds: Stock[] = [
  { name: "SBI Bluechip Fund", price: "₹78.52", change: "+1.2%", up: true },
  { name: "HDFC Mid-Cap Opp.", price: "₹156.34", change: "+2.8%", up: true },
  { name: "Axis Small Cap", price: "₹92.18", change: "+3.5%", up: true },
  { name: "ICICI Pru Tech Fund", price: "₹189.45", change: "-0.4%", up: false },
  { name: "Kotak Flexi Cap", price: "₹65.72", change: "+1.8%", up: true },
];

const commoditiesData: Stock[] = [
  { name: "GOLD", price: "₹73,450/10g", change: "+0.8%", up: true },
  { name: "SILVER", price: "₹89,200/kg", change: "+1.2%", up: true },
  { name: "CRUDE OIL", price: "₹6,280/bbl", change: "-1.5%", up: false },
  { name: "NATURAL GAS", price: "₹185.40", change: "-2.1%", up: false },
  { name: "COPPER", price: "₹785.60/kg", change: "+0.4%", up: true },
];

const marketStats = [
  { icon: Activity, label: "Market Cap", value: "₹385L Cr", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: BarChart3, label: "Volume", value: "18.2B", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
  { icon: TrendingUp, label: "Advances", value: "1,456", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: TrendingDown, label: "Declines", value: "892", color: "text-destructive", bgColor: "bg-destructive/10" },
  { icon: Eye, label: "Most Active", value: "TATA STEEL", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Activity, label: "India VIX", value: "13.45", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
];

const MiniSparkline = ({ up }: { up: boolean }) => {
  const points = up ? "0,20 5,18 10,15 15,17 20,12 25,14 30,8 35,10 40,5 45,3 50,2" : "0,2 5,5 10,8 15,6 20,12 25,10 30,15 35,13 40,18 45,19 50,20";
  return (
    <svg viewBox="0 0 50 22" className="w-16 h-6" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={up ? "hsl(145 70% 40%)" : "hsl(0 84% 60%)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const StockRow = ({ stock, index }: { stock: Stock; index: number }) => (
  <motion.div
    className="flex items-center justify-between py-3 px-4 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group border-b border-border/30 last:border-0"
    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.06 }}
    whileHover={{ x: 4 }}
  >
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold ${stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
        {stock.name.slice(0, 2)}
      </div>
      <span className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors">{stock.name}</span>
    </div>
    <div className="flex items-center gap-4">
      <MiniSparkline up={stock.up} />
      <span className="text-sm text-muted-foreground font-medium w-28 text-right">{stock.price}</span>
      <span className={`flex items-center gap-0.5 text-xs font-bold px-2.5 py-1 rounded-full min-w-[70px] justify-center ${stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
        {stock.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stock.change}
      </span>
    </div>
  </motion.div>
);

type TabKey = "gainers" | "losers" | "active" | "fno" | "mf" | "commodities";

const tabConfig: { key: TabKey; label: string; icon: any; data: Stock[] }[] = [
  { key: "gainers", label: "Top Gainers", icon: TrendingUp, data: fallbackTopGainers },
  { key: "losers", label: "Top Losers", icon: TrendingDown, data: fallbackTopLosers },
  { key: "active", label: "Most Active", icon: Activity, data: fallbackTopGainers },
  { key: "fno", label: "F&O", icon: Layers, data: fnoData },
  { key: "mf", label: "Mutual Funds", icon: PieChart, data: mutualFunds },
  { key: "commodities", label: "Commodities", icon: Gem, data: commoditiesData },
];

const MarketOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], [30, -30]);

  const [activeTab, setActiveTab] = useState<TabKey>("gainers");
  const activeConfig = tabConfig.find(t => t.key === activeTab)!;

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30 relative overflow-hidden">
      <motion.div className="absolute inset-0 pointer-events-none" style={{ y: bgY }}>
        <motion.div className="absolute top-10 left-1/4 w-72 h-72 bg-secondary/5 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 8, repeat: Infinity }} />
        <motion.div className="absolute bottom-20 right-10 w-96 h-96 bg-brand-gold/5 rounded-full blur-3xl" animate={{ scale: [1.1, 0.9, 1.1] }} transition={{ duration: 10, repeat: Infinity }} />
      </motion.div>

      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div style={{ backgroundImage: `linear-gradient(hsl(213 80% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 80% 25%) 1px, transparent 1px)`, backgroundSize: '60px 60px', width: '100%', height: '100%' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-3" initial={{ letterSpacing: "0em" }} whileInView={{ letterSpacing: "0.15em" }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            Market Pulse
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Today's Market Overview</h2>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-secondary to-brand-gold mx-auto rounded-full" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} />
        </motion.div>

        {/* Stats strip */}
        <motion.div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {marketStats.map((stat) => (
            <motion.div key={stat.label} className="bg-card border border-border/50 rounded-xl p-4 text-center group cursor-pointer" whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className={`w-10 h-10 mx-auto mb-2 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
              <div className="text-lg font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabbed Section */}
        <Card className="overflow-hidden border-border/50 shadow-xl">
          <div className="bg-muted/50 px-3 sm:px-5 py-3 border-b border-border/50 flex items-center gap-1 overflow-x-auto">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? tab.key === "losers" ? "bg-destructive/10 text-destructive" : "bg-secondary/10 text-secondary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />{tab.label}
                </button>
              );
            })}
          </div>
          <CardContent className="p-2">
            <div className="flex items-center justify-between py-2 px-4 text-xs text-muted-foreground font-semibold uppercase tracking-wide border-b border-border/30">
              <span>{activeTab === "fno" ? "Contract" : activeTab === "mf" ? "Fund" : activeTab === "commodities" ? "Commodity" : "Company"}</span>
              <div className="flex items-center gap-4">
                <span className="w-16 text-center">Chart</span>
                <span className="w-28 text-right">Price</span>
                <span className="w-[70px] text-center">Change</span>
              </div>
            </div>
            <motion.div key={activeTab} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {activeConfig.data.map((stock, i) => (
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
