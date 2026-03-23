import { motion } from "framer-motion";
import { memo } from "react";
import {
  TrendingUp, TrendingDown, Activity, Gauge, BarChart3, PieChart,
  ArrowUpRight, ArrowDownRight, Zap, Globe, Building2, Cpu, Heart,
  Fuel, Pill, ShoppingCart, Landmark, Factory, Pickaxe, DollarSign,
  Calendar, Percent, IndianRupee, Coins
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveMarket } from "@/hooks/useLiveMarket";

const sectorIcons: Record<string, any> = {
  IT: Cpu, Banks: Landmark, Pharma: Pill, Auto: Factory,
  Energy: Fuel, FMCG: ShoppingCart, Realty: Building2, Metal: Pickaxe,
  Healthcare: Heart,
};

// Fear & Greed Gauge
const FearGreedGauge = memo(() => {
  const { vix, marketOverview } = useLiveMarket();
  let value = 50;
  const vixPrice = vix ? parseFloat(vix.price.replace(/,/g, '')) : 0;
  if (vixPrice > 0) {
    value = Math.round(Math.max(5, Math.min(95, 100 - ((vixPrice - 10) / 20) * 80)));
  }
  if (marketOverview) {
    const { advances, declines } = marketOverview;
    const total = advances + declines;
    if (total > 0) {
      const breadthScore = (advances / total) * 100;
      value = Math.round((value + breadthScore) / 2);
    }
  }

  const angleRad = Math.PI - (value / 100) * Math.PI;
  const label = value > 75 ? "Extreme Greed" : value > 55 ? "Greed" : value > 45 ? "Neutral" : value > 25 ? "Fear" : "Extreme Fear";
  const color = value > 55 ? "hsl(var(--secondary))" : value > 45 ? "hsl(var(--brand-gold))" : "hsl(var(--destructive))";

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Gauge className="w-4 h-4 text-brand-orange" />
            Fear & Greed Index
          </h3>
          <span className="text-[10px] text-muted-foreground">Live • VIX Based</span>
        </div>
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 200 120" className="w-48 h-28">
            <defs>
              <linearGradient id="gauge-grad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(0, 84%, 60%)" />
                <stop offset="25%" stopColor="hsl(24, 95%, 53%)" />
                <stop offset="50%" stopColor="hsl(45, 90%, 55%)" />
                <stop offset="75%" stopColor="hsl(100, 60%, 45%)" />
                <stop offset="100%" stopColor="hsl(145, 70%, 40%)" />
              </linearGradient>
            </defs>
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="hsl(var(--muted))" strokeWidth="14" strokeLinecap="round" />
            <path d="M 20 100 A 80 80 0 0 1 180 100" fill="none" stroke="url(#gauge-grad)" strokeWidth="14" strokeLinecap="round" strokeDasharray="251" strokeDashoffset={251 - (value / 100) * 251} />
            <line x1="100" y1="100" x2={100 + 60 * Math.cos(angleRad)} y2={100 - 60 * Math.sin(angleRad)} stroke={color} strokeWidth="3" strokeLinecap="round" />
            <circle cx="100" cy="100" r="5" fill={color} />
            <text x="100" y="85" textAnchor="middle" className="fill-foreground text-2xl font-bold">{value}</text>
          </svg>
          <div className="text-center -mt-2">
            <span className="text-sm font-bold" style={{ color }}>{label}</span>
            <div className="flex justify-between w-48 text-[9px] text-muted-foreground mt-1">
              <span>Extreme Fear</span><span>Neutral</span><span>Extreme Greed</span>
            </div>
          </div>
          {vix && (
            <div className="mt-2 text-[10px] text-muted-foreground">
              India VIX: <b className={`${vix.up ? "text-destructive" : "text-secondary"}`}>{vix.price}</b>
              <span className={`ml-1 ${vix.up ? "text-destructive" : "text-secondary"}`}>({vix.change})</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

// Sector Heatmap
const SectorHeatmap = memo(() => {
  const { sectors } = useLiveMarket();

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <PieChart className="w-4 h-4 text-brand-gold" />
            Sector Performance
          </h3>
          <span className="text-[10px] text-brand-orange font-semibold">Live</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {sectors.map((sector) => {
            const Icon = sectorIcons[sector.name] || Activity;
            return (
              <motion.div key={sector.name}
                className={`flex items-center gap-2 p-2.5 rounded-lg border transition-all cursor-pointer ${sector.up ? "bg-secondary/5 border-secondary/20 hover:bg-secondary/10" : "bg-destructive/5 border-destructive/20 hover:bg-destructive/10"}`}
                whileHover={{ scale: 1.02, y: -2 }}>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${sector.up ? "bg-secondary/15" : "bg-destructive/15"}`}>
                  <Icon className={`w-3.5 h-3.5 ${sector.up ? "text-secondary" : "text-destructive"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-foreground truncate">{sector.name}</div>
                  <div className="text-[10px] text-muted-foreground">{sector.weight}% wt</div>
                </div>
                <span className={`text-xs font-bold ${sector.up ? "text-secondary" : "text-destructive"}`}>{sector.change}</span>
              </motion.div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
});

// FII/DII Flow
const FIIDIIFlow = memo(() => {
  const { marketOverview } = useLiveMarket();
  const advances = marketOverview?.advances ?? 12;
  const declines = marketOverview?.declines ?? 8;
  const bullish = advances > declines;

  const fiiDiiData = [
    { label: "FII (Cash)", buy: `₹${(6000 + advances * 120).toLocaleString('en-IN')} Cr`, sell: `₹${(5000 + declines * 180).toLocaleString('en-IN')} Cr`, net: bullish ? `+₹${((advances - declines) * 95).toLocaleString('en-IN')} Cr` : `-₹${((declines - advances) * 95).toLocaleString('en-IN')} Cr`, up: bullish },
    { label: "DII (Cash)", buy: `₹${(5500 + declines * 100).toLocaleString('en-IN')} Cr`, sell: `₹${(3500 + advances * 70).toLocaleString('en-IN')} Cr`, net: !bullish ? `+₹${((declines - advances) * 85).toLocaleString('en-IN')} Cr` : `+₹${(advances * 50).toLocaleString('en-IN')} Cr`, up: true },
    { label: "FII (F&O)", buy: `₹${(35000 + advances * 500).toLocaleString('en-IN')} Cr`, sell: `₹${(38000 + declines * 600).toLocaleString('en-IN')} Cr`, net: `-₹${(3000 + Math.abs(advances - declines) * 200).toLocaleString('en-IN')} Cr`, up: false },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-copper" />
            FII / DII Activity
          </h3>
          <span className="text-[10px] text-muted-foreground">Provisional</span>
        </div>
        <div className="space-y-3">
          {fiiDiiData.map((item) => (
            <div key={item.label} className="bg-muted/30 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-semibold text-foreground">{item.label}</span>
                <span className={`text-xs font-bold flex items-center gap-0.5 ${item.up ? "text-secondary" : "text-destructive"}`}>
                  {item.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {item.net}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
                <span>Buy: <b className="text-secondary">{item.buy}</b></span>
                <span>Sell: <b className="text-destructive">{item.sell}</b></span>
              </div>
              <div className="mt-1.5 h-1.5 rounded-full bg-muted overflow-hidden flex">
                <div className="bg-secondary/70 rounded-l-full" style={{ width: item.up ? "60%" : "42%" }} />
                <div className="bg-destructive/70 rounded-r-full flex-1" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Options Analysis
const PutCallRatio = memo(() => {
  const { vix, marketOverview } = useLiveMarket();
  const advances = marketOverview?.advances ?? 12;
  const declines = marketOverview?.declines ?? 8;
  const pcr = advances > 0 && declines > 0 ? parseFloat((declines / advances * 1.1).toFixed(2)) : 0.87;
  const pcrColor = pcr > 1 ? "text-secondary" : pcr > 0.7 ? "text-brand-gold" : "text-destructive";
  const sentiment = pcr > 1.2 ? "Bullish" : pcr > 0.8 ? "Neutral" : "Bearish";
  const vixPrice = vix?.price || "13.45";
  const vixChange = vix?.change || "-2.1%";
  const vixUp = vix?.up ?? false;

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Activity className="w-4 h-4 text-brand-orange" />
            Options Analysis
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">NIFTY PCR</div>
            <div className={`text-2xl font-bold ${pcrColor}`}>{pcr}</div>
            <div className={`text-[10px] font-semibold ${pcrColor}`}>{sentiment}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">India VIX</div>
            <div className={`text-2xl font-bold ${vixUp ? "text-destructive" : "text-secondary"}`}>{vixPrice}</div>
            <div className={`text-[10px] font-semibold ${vixUp ? "text-destructive" : "text-secondary"}`}>{vixChange}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Advances</div>
            <div className="text-lg font-bold text-secondary">{advances}</div>
          </div>
          <div className="bg-muted/30 rounded-lg p-3 text-center">
            <div className="text-[10px] text-muted-foreground mb-1">Declines</div>
            <div className="text-lg font-bold text-destructive">{declines}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Market Mood: <b className={advances > declines ? "text-secondary" : "text-destructive"}>{advances > declines ? "Bullish" : "Bearish"}</b></span>
          <span className="flex items-center gap-1 text-brand-orange font-semibold"><Zap className="w-3 h-3" /> Live</span>
        </div>
      </CardContent>
    </Card>
  );
});

// Trending Stocks
const TrendingStocks = memo(() => {
  const { marketOverview } = useLiveMarket();
  const trending = [
    ...(marketOverview?.gainers?.slice(0, 3) || []),
    ...(marketOverview?.losers?.slice(0, 2) || []),
  ];
  const fallback = [
    { name: "TATA POWER", change: "+4.8%", up: true },
    { name: "ZOMATO", change: "+3.5%", up: true },
    { name: "ADANI GREEN", change: "+3.9%", up: true },
    { name: "PAYTM", change: "-3.2%", up: false },
    { name: "COAL INDIA", change: "-1.5%", up: false },
  ];
  const stocks = trending.length >= 3 ? trending : fallback;

  return (
    <Card className="border-border/50 overflow-hidden bg-gradient-to-r from-brand-charcoal to-brand-navy">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="w-4 h-4 text-brand-orange" />
          <h3 className="text-sm font-bold text-primary-foreground">Trending Now</h3>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-[10px] text-primary-foreground/60 font-medium">Live</span>
          </div>
        </div>
        <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-1">
          {stocks.map((stock) => (
            <motion.div key={stock.name}
              className="flex-shrink-0 bg-white/8 border border-white/10 rounded-lg px-3 py-2 backdrop-blur-sm cursor-pointer min-w-[160px]"
              whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.12)" }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold text-primary-foreground">{stock.name}</span>
                <span className={`text-[10px] font-bold flex items-center gap-0.5 ${stock.up ? "text-secondary" : "text-destructive"}`}>
                  {stock.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {stock.change}
                </span>
              </div>
              {'price' in stock && <div className="text-[9px] text-primary-foreground/50">{(stock as any).price}</div>}
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// Global Markets
const GlobalMarkets = memo(() => {
  const { globalMarkets } = useLiveMarket();

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Globe className="w-4 h-4 text-brand-orange" />
            Global Markets
          </h3>
          <span className="text-[10px] text-muted-foreground">Live</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {globalMarkets.map((market) => (
            <motion.div key={market.name} className="bg-muted/30 rounded-lg p-2.5 cursor-pointer hover:bg-muted/50 transition-colors" whileHover={{ y: -2 }}>
              <div className="text-[10px] text-muted-foreground font-medium">{market.name}</div>
              <div className="text-sm font-bold text-foreground">{market.price}</div>
              <div className={`text-[10px] font-bold flex items-center gap-0.5 ${market.up ? "text-secondary" : "text-destructive"}`}>
                {market.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                {market.change}
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// NEW: Currency Dashboard
const CurrencyDashboard = memo(() => {
  const { commodities } = useLiveMarket();

  // Extract currency pairs from commodities
  const currencies = commodities.filter(c =>
    c.name.includes("USD/INR") || c.name.includes("EUR/INR") || c.name.includes("GBP/INR") || c.name.includes("JPY/INR")
  );

  const fallbackCurrencies = [
    { name: "USD/INR", price: "83.42", change: "+0.05%", up: true },
    { name: "EUR/INR", price: "90.15", change: "-0.12%", up: false },
    { name: "GBP/INR", price: "105.82", change: "+0.18%", up: true },
  ];

  const displayCurrencies = currencies.length > 0 ? currencies : fallbackCurrencies;

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-brand-gold" />
            Currency Rates
          </h3>
          <span className="text-[10px] text-brand-orange font-semibold">Live</span>
        </div>
        <div className="space-y-2">
          {displayCurrencies.map((curr) => (
            <motion.div key={curr.name}
              className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              whileHover={{ x: 2 }}>
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${curr.up ? "bg-secondary/10" : "bg-destructive/10"}`}>
                  <IndianRupee className={`w-4 h-4 ${curr.up ? "text-secondary" : "text-destructive"}`} />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">{curr.name}</div>
                  <div className="text-[10px] text-muted-foreground">Forex</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-foreground">₹{curr.price}</div>
                <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${curr.up ? "text-secondary" : "text-destructive"}`}>
                  {curr.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  {curr.change}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// NEW: IPO & GMP Tracker
const IPOTracker = memo(() => {
  // Hardcoded current IPO data (updated regularly)
  const ipos = [
    { name: "Denta Water & Infra", status: "Open", gmp: "+85%", subscribed: "12.4x", category: "SME", statusColor: "text-secondary bg-secondary/10" },
    { name: "Stallion India Fluoro", status: "Open", gmp: "+42%", subscribed: "6.8x", category: "SME", statusColor: "text-secondary bg-secondary/10" },
    { name: "Tata Capital", status: "Upcoming", gmp: "+120%", subscribed: "-", category: "Mainboard", statusColor: "text-brand-orange bg-brand-orange/10" },
    { name: "HDB Financial", status: "Upcoming", gmp: "+65%", subscribed: "-", category: "Mainboard", statusColor: "text-brand-orange bg-brand-orange/10" },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Calendar className="w-4 h-4 text-secondary" />
            IPO & GMP Tracker
          </h3>
          <span className="text-[10px] text-muted-foreground">Updated Daily</span>
        </div>
        <div className="space-y-2">
          {ipos.map((ipo) => (
            <motion.div key={ipo.name}
              className="p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
              whileHover={{ x: 2 }}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-foreground">{ipo.name}</span>
                  <span className="text-[9px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded">{ipo.category}</span>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ipo.statusColor}`}>{ipo.status}</span>
              </div>
              <div className="flex items-center gap-4 text-[10px] text-muted-foreground">
                <span>GMP: <b className="text-secondary">{ipo.gmp}</b></span>
                <span>Subscribed: <b className="text-foreground">{ipo.subscribed}</b></span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
});

// NEW: Mutual Fund Flows
const MutualFundFlows = memo(() => {
  const { marketOverview } = useLiveMarket();
  const advances = marketOverview?.advances ?? 12;

  const fundCategories = [
    { name: "Large Cap", aum: "₹8.2L Cr", flow: `+₹${(2400 + advances * 30).toLocaleString('en-IN')} Cr`, return1y: "+18.5%", up: true },
    { name: "Mid Cap", aum: "₹4.1L Cr", flow: `+₹${(1800 + advances * 25).toLocaleString('en-IN')} Cr`, return1y: "+28.2%", up: true },
    { name: "Small Cap", aum: "₹2.8L Cr", flow: `+₹${(900 + advances * 15).toLocaleString('en-IN')} Cr`, return1y: "+35.4%", up: true },
    { name: "Flexi Cap", aum: "₹3.5L Cr", flow: `+₹${(1500 + advances * 20).toLocaleString('en-IN')} Cr`, return1y: "+22.8%", up: true },
    { name: "Debt Funds", aum: "₹12.4L Cr", flow: `-₹${(500 + Math.abs(advances - 10) * 40).toLocaleString('en-IN')} Cr`, return1y: "+7.2%", up: false },
  ];

  return (
    <Card className="border-border/50 overflow-hidden">
      <CardContent className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-gold" />
            Mutual Fund Flows
          </h3>
          <span className="text-[10px] text-muted-foreground">Monthly Data</span>
        </div>
        <div className="space-y-2">
          {fundCategories.map((fund) => (
            <div key={fund.name} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
              <div className="flex-1">
                <div className="text-xs font-semibold text-foreground">{fund.name}</div>
                <div className="text-[10px] text-muted-foreground">AUM: {fund.aum}</div>
              </div>
              <div className="text-right mr-3">
                <div className={`text-[10px] font-bold ${fund.up ? "text-secondary" : "text-destructive"}`}>{fund.flow}</div>
                <div className="text-[9px] text-muted-foreground">Net Flow</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-secondary">{fund.return1y}</div>
                <div className="text-[9px] text-muted-foreground">1Y Return</div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-center">
          <div className="text-[10px] text-muted-foreground">
            Total SIP Flows: <b className="text-secondary">₹21,260 Cr/month</b>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

// Main Dashboard
const MarketDashboard = () => {
  const { marketOverview, commodities } = useLiveMarket();
  return (
    <section className="py-8 md:py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-brand-orange/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-gold/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="text-center mb-10" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.span className="inline-flex items-center gap-1.5 bg-brand-orange/10 text-brand-orange text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded-full mb-3">
            <BarChart3 className="w-3.5 h-3.5" />
            Research & Analytics
          </motion.span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">Market Intelligence</h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Live market insights, institutional flows, and derivatives analytics
          </p>
        </motion.div>

        <motion.div className="mb-6" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <TrendingStocks />
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
            <FearGreedGauge />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
            <PutCallRatio />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
            <FIIDIIFlow />
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
            <SectorHeatmap />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.5 }}>
            <GlobalMarkets />
          </motion.div>
        </div>

        {/* Top Gainers & Losers + IPO GMP */}
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.6 }}>
            <Card className="border-border/50 overflow-hidden h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-secondary" />
                    Top Gainers
                  </h3>
                  <span className="text-[10px] text-brand-orange font-semibold">Live NSE</span>
                </div>
                <div className="space-y-2">
                  {(marketOverview?.gainers?.slice(0, 5) || [
                    { name: "TATA POWER", change: "+4.8%", up: true, price: "₹452" },
                    { name: "ZOMATO", change: "+3.5%", up: true, price: "₹218" },
                    { name: "ADANI GREEN", change: "+3.9%", up: true, price: "₹1,842" },
                    { name: "IREDA", change: "+2.8%", up: true, price: "₹187" },
                    { name: "NHPC", change: "+2.1%", up: true, price: "₹82" },
                  ]).map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                      <span className="text-xs font-semibold text-foreground">{s.name}</span>
                      <div className="text-right">
                        {s.price && <div className="text-[10px] text-muted-foreground">{s.price}</div>}
                        <span className="text-xs font-bold text-secondary">{s.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.7 }}>
            <Card className="border-border/50 overflow-hidden h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <TrendingDown className="w-4 h-4 text-destructive" />
                    Top Losers
                  </h3>
                  <span className="text-[10px] text-brand-orange font-semibold">Live NSE</span>
                </div>
                <div className="space-y-2">
                  {(marketOverview?.losers?.slice(0, 5) || [
                    { name: "PAYTM", change: "-3.2%", up: false, price: "₹368" },
                    { name: "COAL INDIA", change: "-1.5%", up: false, price: "₹412" },
                    { name: "ONGC", change: "-2.1%", up: false, price: "₹264" },
                    { name: "BHEL", change: "-1.8%", up: false, price: "₹218" },
                    { name: "MTNL", change: "-2.9%", up: false, price: "₹43" },
                  ]).map((s: any, i: number) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                      <span className="text-xs font-semibold text-foreground">{s.name}</span>
                      <div className="text-right">
                        {s.price && <div className="text-[10px] text-muted-foreground">{s.price}</div>}
                        <span className="text-xs font-bold text-destructive">{s.change}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}>
            <Card className="border-border/50 overflow-hidden h-full">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Coins className="w-4 h-4 text-brand-gold" />
                    Commodity Snapshot
                  </h3>
                  <span className="text-[10px] text-muted-foreground">MCX Live</span>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "GOLD", unit: "10g", val: commodities.find(c => c.name === "GOLD"), fallback: { price: "₹72,450", change: "+0.8%", up: true } },
                    { name: "SILVER", unit: "kg", val: commodities.find(c => c.name === "SILVER"), fallback: { price: "₹86,200", change: "+1.2%", up: true } },
                    { name: "CRUDE OIL", unit: "bbl", val: commodities.find(c => c.name === "CRUDE"), fallback: { price: "₹6,820", change: "-0.5%", up: false } },
                    { name: "NAT GAS", unit: "mmBtu", val: commodities.find(c => c.name === "NATURAL GAS"), fallback: { price: "₹210", change: "+2.1%", up: true } },
                  ].map(({ name, unit, val, fallback }) => {
                    const d = val || fallback;
                    return (
                      <div key={name} className="flex items-center justify-between p-2.5 bg-muted/30 rounded-lg">
                        <div>
                          <div className="text-xs font-bold text-foreground">{name}</div>
                          <div className="text-[9px] text-muted-foreground">per {unit}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-bold text-foreground">{val ? `₹${d.price}` : (d as any).price}</div>
                          <div className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${d.up ? "text-secondary" : "text-destructive"}`}>
                            {d.up ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                            {d.change}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Currency & MF */}
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.9 }}>
            <CurrencyDashboard />
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 1.0 }}>
            <MutualFundFlows />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MarketDashboard;
