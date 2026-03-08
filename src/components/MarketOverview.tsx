import { motion, AnimatePresence } from "framer-motion";
import { useRef, useState, useMemo, useCallback } from "react";
import {
  TrendingUp, TrendingDown, Activity, Eye, ArrowUpRight, ArrowDownRight,
  BarChart3, Layers, PieChart, Gem, Maximize2, X, Clock, Volume2,
  IndianRupee, Percent, ChevronRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from "@/components/ui/dialog";
import { useLiveMarket } from "@/hooks/useLiveMarket";

type Stock = { name: string; price: string; change: string; up: boolean; volume?: string; high?: string; low?: string };

const fallbackTopGainers: Stock[] = [
  { name: "TATA POWER", price: "₹432.50", change: "+4.8%", up: true, volume: "12.4M", high: "₹438.20", low: "₹415.60" },
  { name: "ADANI GREEN", price: "₹1,892.30", change: "+3.9%", up: true, volume: "8.2M", high: "₹1,905.00", low: "₹1,820.50" },
  { name: "ZOMATO", price: "₹178.60", change: "+3.5%", up: true, volume: "22.1M", high: "₹180.40", low: "₹171.20" },
  { name: "BHARTI AIRTEL", price: "₹1,245.60", change: "+2.1%", up: true, volume: "5.6M", high: "₹1,252.00", low: "₹1,218.30" },
  { name: "INFOSYS", price: "₹1,523.40", change: "+3.1%", up: true, volume: "9.8M", high: "₹1,535.80", low: "₹1,478.90" },
  { name: "RELIANCE", price: "₹2,890.50", change: "+1.8%", up: true, volume: "15.3M", high: "₹2,910.00", low: "₹2,845.20" },
  { name: "HDFCLIFE", price: "₹678.40", change: "+2.6%", up: true, volume: "4.1M", high: "₹685.00", low: "₹660.30" },
];

const fallbackTopLosers: Stock[] = [
  { name: "PAYTM", price: "₹412.80", change: "-3.2%", up: false, volume: "18.5M", high: "₹428.60", low: "₹408.10" },
  { name: "BAJAJ FIN", price: "₹6,892.30", change: "-1.2%", up: false, volume: "3.4M", high: "₹7,010.00", low: "₹6,850.00" },
  { name: "HDFC BANK", price: "₹1,678.25", change: "-0.8%", up: false, volume: "11.2M", high: "₹1,698.50", low: "₹1,670.00" },
  { name: "WIPRO", price: "₹478.90", change: "-0.6%", up: false, volume: "7.8M", high: "₹485.20", low: "₹475.00" },
  { name: "COAL INDIA", price: "₹425.30", change: "-1.5%", up: false, volume: "6.2M", high: "₹434.80", low: "₹422.10" },
  { name: "HINDALCO", price: "₹542.60", change: "-2.1%", up: false, volume: "5.9M", high: "₹558.40", low: "₹538.20" },
  { name: "TECHM", price: "₹1,245.80", change: "-1.8%", up: false, volume: "4.5M", high: "₹1,272.00", low: "₹1,238.50" },
];

const mostActive: Stock[] = [
  { name: "TATA STEEL", price: "₹145.80", change: "+1.2%", up: true, volume: "45.2M", high: "₹148.50", low: "₹142.30" },
  { name: "SBIN", price: "₹812.40", change: "-0.5%", up: false, volume: "32.8M", high: "₹820.00", low: "₹808.60" },
  { name: "ITC", price: "₹465.20", change: "+0.8%", up: true, volume: "28.4M", high: "₹468.90", low: "₹460.10" },
  { name: "TATAMOTORS", price: "₹985.60", change: "+2.4%", up: true, volume: "25.1M", high: "₹992.00", low: "₹962.30" },
  { name: "ICICIBANK", price: "₹1,125.80", change: "-0.3%", up: false, volume: "22.6M", high: "₹1,132.40", low: "₹1,118.50" },
  { name: "MARUTI", price: "₹12,450.00", change: "+1.5%", up: true, volume: "1.8M", high: "₹12,520.00", low: "₹12,280.00" },
];

const fnoData: Stock[] = [
  { name: "NIFTY 22500 CE", price: "₹185.50", change: "+12.5%", up: true, volume: "2.1L", high: "₹198.00", low: "₹145.20" },
  { name: "NIFTY 22000 PE", price: "₹72.30", change: "-8.2%", up: false, volume: "1.8L", high: "₹88.40", low: "₹68.50" },
  { name: "BANKNIFTY 47000 CE", price: "₹312.80", change: "+6.3%", up: true, volume: "95K", high: "₹325.00", low: "₹278.60" },
  { name: "RELIANCE 2900 CE", price: "₹45.60", change: "+15.1%", up: true, volume: "78K", high: "₹52.40", low: "₹38.20" },
  { name: "TCS 4000 PE", price: "₹28.40", change: "-4.7%", up: false, volume: "45K", high: "₹32.80", low: "₹26.10" },
  { name: "HDFCBANK 1700 CE", price: "₹22.80", change: "+8.9%", up: true, volume: "62K", high: "₹25.40", low: "₹18.60" },
];

const mutualFunds: Stock[] = [
  { name: "SBI Bluechip Fund", price: "₹78.52", change: "+1.2%", up: true, volume: "₹2,450 Cr", high: "₹79.10", low: "₹77.80" },
  { name: "HDFC Mid-Cap Opp.", price: "₹156.34", change: "+2.8%", up: true, volume: "₹1,820 Cr", high: "₹157.20", low: "₹152.10" },
  { name: "Axis Small Cap", price: "₹92.18", change: "+3.5%", up: true, volume: "₹980 Cr", high: "₹93.40", low: "₹89.20" },
  { name: "ICICI Pru Tech Fund", price: "₹189.45", change: "-0.4%", up: false, volume: "₹1,560 Cr", high: "₹191.20", low: "₹188.30" },
  { name: "Kotak Flexi Cap", price: "₹65.72", change: "+1.8%", up: true, volume: "₹2,100 Cr", high: "₹66.30", low: "₹64.50" },
  { name: "Nippon India Growth", price: "₹3,245.80", change: "+2.2%", up: true, volume: "₹1,340 Cr", high: "₹3,260.00", low: "₹3,178.40" },
];

const commoditiesData: Stock[] = [
  { name: "GOLD", price: "₹73,450/10g", change: "+0.8%", up: true, volume: "₹8,450 Cr", high: "₹73,680", low: "₹72,920" },
  { name: "SILVER", price: "₹89,200/kg", change: "+1.2%", up: true, volume: "₹4,280 Cr", high: "₹89,850", low: "₹88,100" },
  { name: "CRUDE OIL", price: "₹6,280/bbl", change: "-1.5%", up: false, volume: "₹3,120 Cr", high: "₹6,420", low: "₹6,240" },
  { name: "NATURAL GAS", price: "₹185.40", change: "-2.1%", up: false, volume: "₹1,560 Cr", high: "₹192.80", low: "₹183.60" },
  { name: "COPPER", price: "₹785.60/kg", change: "+0.4%", up: true, volume: "₹2,340 Cr", high: "₹790.20", low: "₹780.40" },
  { name: "ALUMINIUM", price: "₹212.40/kg", change: "+0.6%", up: true, volume: "₹1,180 Cr", high: "₹214.80", low: "₹210.20" },
];

const marketStats = [
  { icon: Activity, label: "Market Cap", value: "₹385L Cr", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: BarChart3, label: "Volume", value: "18.2B", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
  { icon: TrendingUp, label: "Advances", value: "1,456", color: "text-secondary", bgColor: "bg-secondary/10" },
  { icon: TrendingDown, label: "Declines", value: "892", color: "text-destructive", bgColor: "bg-destructive/10" },
  { icon: Eye, label: "Most Active", value: "TATA STEEL", color: "text-primary", bgColor: "bg-primary/10" },
  { icon: Activity, label: "India VIX", value: "13.45", color: "text-brand-gold", bgColor: "bg-brand-gold/10" },
  { icon: IndianRupee, label: "FII Flow", value: "-₹1,245 Cr", color: "text-destructive", bgColor: "bg-destructive/10" },
  { icon: Percent, label: "DII Flow", value: "+₹2,180 Cr", color: "text-secondary", bgColor: "bg-secondary/10" },
];

// Generate realistic chart data
const generateChartData = (up: boolean, points = 60) => {
  const data: number[] = [];
  let value = 100 + Math.random() * 20;
  for (let i = 0; i < points; i++) {
    const drift = up ? 0.12 : -0.12;
    value += (Math.random() - 0.5 + drift) * 2;
    value = Math.max(75, Math.min(135, value));
    data.push(value);
  }
  return data;
};

// Interactive full chart for the dialog
const FullChart = ({ stock, data, up }: { stock: Stock; data: number[]; up: boolean }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = 220;
  const w = 600;

  const coords = useMemo(() => data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * (h - 20) - 10,
    val: v,
  })), [data, w, h, min, range]);

  const points = coords.map(c => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const color = up ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)";

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    let closest = 0;
    let closestDist = Infinity;
    coords.forEach((c, i) => {
      const d = Math.abs(c.x - x);
      if (d < closestDist) { closestDist = d; closest = i; }
    });
    setHoverIdx(closest);
  }, [w, coords]);

  const basePrice = parseFloat(stock.price.replace(/[₹,/a-z]/gi, '')) || 100;

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        className="w-full h-[220px] cursor-crosshair"
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id="full-chart-grad" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines */}
        {[0, 1, 2, 3, 4].map(i => (
          <line key={i} x1={0} y1={(h / 4) * i} x2={w} y2={(h / 4) * i} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.4" />
        ))}
        <polygon points={areaPoints} fill="url(#full-chart-grad)" />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {hoverIdx !== null && coords[hoverIdx] && (
          <>
            <line x1={coords[hoverIdx].x} y1={0} x2={coords[hoverIdx].x} y2={h} stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            <line x1={0} y1={coords[hoverIdx].y} x2={w} y2={coords[hoverIdx].y} stroke={color} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
            <circle cx={coords[hoverIdx].x} cy={coords[hoverIdx].y} r="5" fill={color} stroke="hsl(var(--background))" strokeWidth="2.5" />
          </>
        )}
      </svg>
      {hoverIdx !== null && coords[hoverIdx] && (
        <div
          className="absolute top-2 bg-card border border-border rounded-xl px-4 py-2 shadow-xl pointer-events-none text-xs z-10"
          style={{ left: `${Math.min(Math.max((coords[hoverIdx].x / w) * 100, 10), 90)}%`, transform: "translateX(-50%)" }}
        >
          <div className="font-bold text-foreground text-sm">₹{(basePrice * (coords[hoverIdx].val / 100)).toFixed(2)}</div>
          <div className="text-muted-foreground">{`${9 + Math.floor(hoverIdx / 10)}:${String((hoverIdx % 10) * 6).padStart(2, "0")} IST`}</div>
        </div>
      )}
      <div className="flex justify-between mt-1 text-[10px] text-muted-foreground px-1">
        <span>09:15</span><span>10:30</span><span>11:45</span><span>13:00</span><span>14:15</span><span>15:30</span>
      </div>
    </div>
  );
};

// Mini sparkline for table rows
const MiniSparkline = ({ up, onClick }: { up: boolean; onClick?: () => void }) => {
  const points = up
    ? "0,20 5,18 10,15 15,17 20,12 25,14 30,8 35,10 40,5 45,3 50,2"
    : "0,2 5,5 10,8 15,6 20,12 25,10 30,15 35,13 40,18 45,19 50,20";
  const color = up ? "hsl(145 70% 40%)" : "hsl(0 84% 60%)";
  return (
    <div className="relative group/spark cursor-pointer" onClick={onClick}>
      <svg viewBox="0 0 50 22" className="w-16 h-6" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`spark-${up ? 'up' : 'down'}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,22 ${points} 50,22`} fill={`url(#spark-${up ? 'up' : 'down'})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/spark:opacity-100 transition-opacity bg-muted/60 rounded">
        <Maximize2 className="w-3 h-3 text-foreground" />
      </div>
    </div>
  );
};

const StockRow = ({ stock, index, onChartClick }: { stock: Stock; index: number; onChartClick: (stock: Stock) => void }) => (
  <motion.div
    className="flex items-center justify-between py-3 px-3 sm:px-4 rounded-xl hover:bg-muted/50 transition-all duration-200 cursor-pointer group border-b border-border/30 last:border-0"
    initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.04 }}
    whileHover={{ x: 4 }}
    onClick={() => onChartClick(stock)}
  >
    <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-bold shrink-0 ${stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
        {stock.name.slice(0, 2)}
      </div>
      <div className="min-w-0">
        <span className="font-semibold text-sm text-foreground group-hover:text-secondary transition-colors block truncate">{stock.name}</span>
        {stock.volume && <span className="text-[10px] text-muted-foreground hidden sm:block">Vol: {stock.volume}</span>}
      </div>
    </div>
    <div className="flex items-center gap-2 sm:gap-4 shrink-0">
      <div className="hidden sm:block">
        <MiniSparkline up={stock.up} onClick={() => onChartClick(stock)} />
      </div>
      <div className="text-right">
        <span className="text-sm text-foreground font-medium block">{stock.price}</span>
        {stock.high && stock.low && (
          <span className="text-[9px] text-muted-foreground hidden md:block">H: {stock.high} L: {stock.low}</span>
        )}
      </div>
      <span className={`flex items-center gap-0.5 text-xs font-bold px-2 sm:px-2.5 py-1 rounded-full min-w-[60px] sm:min-w-[70px] justify-center ${stock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
        {stock.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}{stock.change}
      </span>
      <button
        onClick={() => onChartClick(stock)}
        className="sm:hidden p-1.5 rounded-lg hover:bg-muted transition-colors"
      >
        <Maximize2 className="w-3.5 h-3.5 text-muted-foreground" />
      </button>
    </div>
  </motion.div>
);

type TabKey = "gainers" | "losers" | "active" | "fno" | "mf" | "commodities";

const tabConfig: { key: TabKey; label: string; icon: any; data: Stock[] }[] = [
  { key: "gainers", label: "Top Gainers", icon: TrendingUp, data: fallbackTopGainers },
  { key: "losers", label: "Top Losers", icon: TrendingDown, data: fallbackTopLosers },
  { key: "active", label: "Most Active", icon: Activity, data: mostActive },
  { key: "fno", label: "F&O", icon: Layers, data: fnoData },
  { key: "mf", label: "Mutual Funds", icon: PieChart, data: mutualFunds },
  { key: "commodities", label: "Commodities", icon: Gem, data: commoditiesData },
];

const MarketOverview = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("gainers");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [chartData] = useState(() => new Map<string, number[]>());
  const { marketOverview: liveData, fetchedAt } = useLiveMarket();

  // Merge live data with fallbacks
  const dynamicTabConfig = useMemo(() => {
    const cfg: { key: TabKey; label: string; icon: any; data: Stock[] }[] = [
      { key: "gainers", label: "Top Gainers", icon: TrendingUp, data: liveData?.gainers?.length ? liveData.gainers as Stock[] : fallbackTopGainers },
      { key: "losers", label: "Top Losers", icon: TrendingDown, data: liveData?.losers?.length ? liveData.losers as Stock[] : fallbackTopLosers },
      { key: "active", label: "Most Active", icon: Activity, data: liveData?.mostActive?.length ? liveData.mostActive as Stock[] : mostActive },
      { key: "fno", label: "F&O", icon: Layers, data: fnoData },
      { key: "mf", label: "Mutual Funds", icon: PieChart, data: mutualFunds },
      { key: "commodities", label: "Commodities", icon: Gem, data: commoditiesData },
    ];
    return cfg;
  }, [liveData]);

  const activeConfig = dynamicTabConfig.find(t => t.key === activeTab)!;

  const liveAdvances = liveData?.advances ?? 1456;
  const liveDeclines = liveData?.declines ?? 892;
  const liveUnchanged = liveData?.unchanged ?? 186;
  const totalStocks = liveAdvances + liveDeclines + liveUnchanged;

  const getChartData = useCallback((stock: Stock) => {
    if (!chartData.has(stock.name)) {
      chartData.set(stock.name, generateChartData(stock.up));
    }
    return chartData.get(stock.name)!;
  }, [chartData]);

  const handleChartClick = useCallback((stock: Stock) => {
    setSelectedStock(stock);
  }, []);

  return (
    <section ref={sectionRef} className="py-20 bg-muted/30 relative overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.03]">
        <div style={{ backgroundImage: `linear-gradient(hsl(213 80% 25%) 1px, transparent 1px), linear-gradient(90deg, hsl(213 80% 25%) 1px, transparent 1px)`, backgroundSize: '60px 60px', width: '100%', height: '100%' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange font-semibold text-sm uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            Market Pulse
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">Today's Market Overview</h2>
          <motion.div className="w-20 h-1 bg-gradient-to-r from-brand-orange to-brand-gold mx-auto rounded-full" initial={{ width: 0 }} whileInView={{ width: 80 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.6 }} />
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto text-sm">
            Real-time market data across equities, derivatives, mutual funds & commodities
          </p>
        </motion.div>

        {/* Stats strip */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {marketStats.map((stat) => (
            <motion.div key={stat.label} className="bg-card border border-border/50 rounded-xl p-3 text-center group cursor-pointer" whileHover={{ scale: 1.05, y: -4 }} transition={{ type: "spring", stiffness: 300 }}>
              <div className={`w-9 h-9 mx-auto mb-1.5 rounded-xl flex items-center justify-center ${stat.bgColor}`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div className="text-sm font-bold text-foreground">{stat.value}</div>
              <div className="text-[10px] text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabbed Section */}
        <Card className="overflow-hidden border-border/50 shadow-xl">
          <div className="bg-muted/50 px-2 sm:px-4 py-2.5 border-b border-border/50 flex items-center gap-1 overflow-x-auto scrollbar-hide">
            {tabConfig.map((tab) => {
              const Icon = tab.icon;
              return (
                <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-lg text-[11px] sm:text-xs font-semibold transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.key
                      ? tab.key === "losers" ? "bg-destructive/10 text-destructive shadow-sm" : "bg-secondary/10 text-secondary shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}>
                  <Icon className="w-3.5 h-3.5" />{tab.label}
                  <span className="hidden sm:inline text-[10px] opacity-60">({tab.data.length})</span>
                </button>
              );
            })}
          </div>

          <CardContent className="p-0">
            {/* Column headers */}
            <div className="flex items-center justify-between py-2 px-3 sm:px-4 text-[10px] text-muted-foreground font-semibold uppercase tracking-wide border-b border-border/30 bg-muted/20">
              <span>{activeTab === "fno" ? "Contract" : activeTab === "mf" ? "Fund" : activeTab === "commodities" ? "Commodity" : "Company"}</span>
              <div className="flex items-center gap-2 sm:gap-4">
                <span className="w-16 text-center hidden sm:block">Chart</span>
                <span className="w-20 sm:w-28 text-right">Price</span>
                <span className="w-[60px] sm:w-[70px] text-center">Change</span>
                <span className="w-8 sm:hidden"></span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="p-1 sm:p-2">
                {activeConfig.data.map((stock, i) => (
                  <StockRow key={`${activeTab}-${stock.name}`} stock={stock} index={i} onChartClick={handleChartClick} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Footer summary */}
            <div className="flex items-center justify-between px-4 py-3 border-t border-border/30 bg-muted/20">
              <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                <Clock className="w-3 h-3" />
                <span>Last updated: {new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
              <div className="flex items-center gap-1 text-[10px] text-secondary font-medium cursor-pointer hover:underline">
                <span>View All</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Market Breadth Bar */}
        <motion.div className="mt-8 bg-card border border-border/50 rounded-xl p-5" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">Market Breadth</h3>
            <span className="text-[10px] text-muted-foreground">NSE</span>
          </div>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs font-bold text-secondary">1,456 Advances</span>
            <div className="flex-1 h-3 rounded-full bg-muted overflow-hidden flex">
              <div className="bg-secondary/80 rounded-l-full transition-all" style={{ width: "62%" }} />
              <div className="bg-muted-foreground/30" style={{ width: "8%" }} />
              <div className="bg-destructive/80 rounded-r-full transition-all" style={{ width: "30%" }} />
            </div>
            <span className="text-xs font-bold text-destructive">892 Declines</span>
          </div>
          <div className="text-center text-[10px] text-muted-foreground">186 Unchanged</div>
        </motion.div>
      </div>

      {/* Chart Dialog */}
      <Dialog open={!!selectedStock} onOpenChange={(open) => !open && setSelectedStock(null)}>
        <DialogContent className="max-w-2xl w-[95vw]">
          {selectedStock && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold ${selectedStock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                    {selectedStock.name.slice(0, 2)}
                  </div>
                  <div>
                    <div className="text-lg font-bold text-foreground">{selectedStock.name}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-base font-semibold text-foreground">{selectedStock.price}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedStock.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                        {selectedStock.up ? <ArrowUpRight className="w-3 h-3 inline" /> : <ArrowDownRight className="w-3 h-3 inline" />}
                        {selectedStock.change}
                      </span>
                    </div>
                  </div>
                </DialogTitle>
                <DialogDescription className="sr-only">Price chart for {selectedStock.name}</DialogDescription>
              </DialogHeader>

              {/* Key metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-2">
                {[
                  { label: "High", value: selectedStock.high || "-", icon: TrendingUp, up: true },
                  { label: "Low", value: selectedStock.low || "-", icon: TrendingDown, up: false },
                  { label: "Volume", value: selectedStock.volume || "-", icon: Volume2, up: true },
                  { label: "Change", value: selectedStock.change, icon: Activity, up: selectedStock.up },
                ].map(m => (
                  <div key={m.label} className="bg-muted/50 rounded-lg p-2.5 text-center">
                    <m.icon className={`w-3.5 h-3.5 mx-auto mb-1 ${m.up ? "text-secondary" : "text-destructive"}`} />
                    <div className="text-xs text-muted-foreground">{m.label}</div>
                    <div className="text-sm font-bold text-foreground">{m.value}</div>
                  </div>
                ))}
              </div>

              {/* Interactive chart */}
              <div className="bg-muted/30 rounded-xl p-3 border border-border/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-muted-foreground font-medium">Intraday Price Chart</span>
                  <div className="flex gap-1">
                    {["1D", "1W", "1M", "3M"].map(tf => (
                      <button key={tf} className="px-2 py-0.5 text-[10px] font-medium rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors first:bg-muted first:text-foreground">{tf}</button>
                    ))}
                  </div>
                </div>
                <FullChart stock={selectedStock} data={getChartData(selectedStock)} up={selectedStock.up} />
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default MarketOverview;
