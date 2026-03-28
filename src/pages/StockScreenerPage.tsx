import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown, RefreshCw, Loader2, BarChart3, Bot, LayoutGrid, List, Landmark, Cpu, Car, Building2, ShoppingCart, Activity, Zap, PiggyBank, Radar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useScreenerStocks, type ScreenerStock } from "@/hooks/useScreenerStocks";
import StockHeatmap from "@/components/StockHeatmap";
import GlobalStockSearch from "@/components/GlobalStockSearch";
import AIAnalysisModal from "@/components/AIAnalysisModal";

const THEMATIC_BASKETS = [
  { id: "banking", name: "Banking & Finance", desc: "Top private & PSU banks", icon: Landmark, filter: (s: ScreenerStock) => s.sector === "Banking" || s.sector === "NBFC" || s.sector === "Insurance" },
  { id: "it", name: "IT Leaders", desc: "India's tech giants", icon: Cpu, filter: (s: ScreenerStock) => s.sector === "IT" },
  { id: "auto", name: "Auto & EV", desc: "Automobile stocks", icon: Car, filter: (s: ScreenerStock) => s.sector === "Auto" },
  { id: "psu", name: "PSU Momentum", desc: "Public sector entities", icon: Building2, filter: (s: ScreenerStock) => ["SBIN", "BANKBARODA", "PNB", "CANBK", "UNIONBANK", "COALINDIA", "NTPC", "POWERGRID", "ONGC", "IOC", "BPCL", "GAIL", "NHPC", "HAL", "BEL", "BHEL", "IRFC", "RECLTD", "PFC", "CONCOR", "NMDC", "SAIL", "NATIONALUM"].includes(s.symbol) },
  { id: "fmcg", name: "FMCG Staples", desc: "Everyday consumer goods", icon: ShoppingCart, filter: (s: ScreenerStock) => s.sector === "FMCG" },
];

const TECHNICAL_SCANNERS = [
  { id: "vol_shocker", name: "Volume Shockers", desc: "Unusual high volume today", icon: Activity, filter: (s: ScreenerStock) => s.volume > 5000000 && Math.abs(s.change_pct) > 2 },
  { id: "52w_high", name: "52W High Breakout", desc: "Trading near 52-week high", icon: TrendingUp, filter: (s: ScreenerStock) => s.price >= s.high_52 * 0.95 && s.high_52 > 0 },
  { id: "52w_low", name: "52W Low Breakdown", desc: "Trading near 52-week low", icon: TrendingDown, filter: (s: ScreenerStock) => s.price <= s.low_52 * 1.05 && s.low_52 > 0 },
  { id: "momentum", name: "High Momentum", desc: "Strong intraday trend", icon: Zap, filter: (s: ScreenerStock) => s.change_pct > 4 },
  { id: "value_buy", name: "Value Buys", desc: "Low P/E & profitable", icon: PiggyBank, filter: (s: ScreenerStock) => s.pe > 0 && s.pe < 15 && s.market_cap > 5000 },
];

const formatMarketCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(0)}K Cr`;
  if (cr > 0) return `₹${cr.toFixed(0)} Cr`;
  return "—";
};

type SortKey = "symbol" | "price" | "change_pct" | "market_cap" | "pe";

/** Animated candlestick loading skeleton */
const StockLoadingAnimation = () => {
  const bars = Array.from({ length: 12 });
  return (
    <div className="flex flex-col items-center justify-center py-10 md:py-20 gap-6">
      <div className="flex items-end gap-1.5 h-24">
        {bars.map((_, i) => {
          const h = 30 + Math.random() * 60;
          const isGreen = Math.random() > 0.4;
          return (
            <motion.div
              key={i}
              className={`w-3 rounded-sm ${isGreen ? "bg-secondary/70" : "bg-destructive/70"}`}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: h, opacity: [0, 1, 0.7, 1] }}
              transition={{
                height: { duration: 0.6, delay: i * 0.08, ease: "easeOut" },
                opacity: { duration: 1.5, delay: i * 0.08, repeat: Infinity, repeatType: "reverse" },
              }}
            />
          );
        })}
      </div>
      <div className="flex flex-col items-center gap-2">
        <motion.div
          className="flex items-center gap-2 text-muted-foreground"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-sm font-medium">Loading market data...</span>
        </motion.div>
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-secondary via-primary to-destructive rounded-full"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ width: "60%" }}
          />
        </div>
      </div>
    </div>
  );
};

/** Row skeleton for table */
const TableRowSkeleton = ({ index }: { index: number }) => (
  <motion.tr
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: index * 0.05 }}
    className="border-b border-border/50"
  >
    {[32, 20, 16, 20, 12, 40, 16].map((w, j) => (
      <td key={j} className="px-4 py-3">
        <motion.div
          className={`h-5 bg-muted rounded ${j === 6 ? "ml-auto" : ""}`}
          style={{ width: `${w * 4}px`, maxWidth: "100%" }}
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: j * 0.1 }}
        />
      </td>
    ))}
  </motion.tr>
);

const StockScreenerPage = () => {
  const { stocks, loading, refreshing: bgRefreshing, updatedAt, error, refresh } = useScreenerStocks();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [peRange, setPeRange] = useState("all");
  const [capRange, setCapRange] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);
  const [analyzingStock, setAnalyzingStock] = useState<ScreenerStock | null>(null);
  const [activeBasket, setActiveBasket] = useState<string | null>(null);
  const [activeScanner, setActiveScanner] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "heatmap">("list");

  const sectors = useMemo(() => [...new Set(stocks.map(s => s.sector))].sort(), [stocks]);

  const filtered = useMemo(() => {
    let list = [...stocks];
    if (search) list = list.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));
    if (sector !== "all") list = list.filter(s => s.sector === sector);
    if (peRange === "low") list = list.filter(s => s.pe > 0 && s.pe < 20);
    else if (peRange === "mid") list = list.filter(s => s.pe >= 20 && s.pe <= 40);
    else if (peRange === "high") list = list.filter(s => s.pe > 40);
    if (capRange === "large") list = list.filter(s => s.market_cap >= 50000);
    else if (capRange === "mid") list = list.filter(s => s.market_cap >= 10000 && s.market_cap < 50000);
    else if (capRange === "small") list = list.filter(s => s.market_cap > 0 && s.market_cap < 10000);

    if (activeBasket) {
      const basket = THEMATIC_BASKETS.find(b => b.id === activeBasket);
      if (basket) list = list.filter(basket.filter);
    }
    if (activeScanner) {
      const scanner = TECHNICAL_SCANNERS.find(s => s.id === activeScanner);
      if (scanner) list = list.filter(scanner.filter);
    }

    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [stocks, search, sector, peRange, capRange, sortKey, sortDir, activeBasket, activeScanner]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Stock Screener | Live NSE BSE Stocks" description="Screen and filter live Indian stocks by sector, market cap, P/E ratio, 52-week range. Real-time prices from Yahoo Finance." keywords="stock screener India, NSE stock filter, BSE stocks, PE ratio filter, live stock prices" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Stock Screener</h1>
            <p className="text-muted-foreground">Live prices for {stocks.length}+ NSE stocks • Filter by sector, market cap, P/E & more</p>
          </div>
          <div className="flex items-center gap-3">
            {updatedAt && (
              <span className="text-xs text-muted-foreground">
                Updated {new Date(updatedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            <Button variant="outline" size="sm" onClick={handleRefresh} disabled={refreshing}>
              {refreshing ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              <span className="ml-1.5">Refresh</span>
            </Button>
          </div>
        </motion.div>

        {/* Global Stock Search */}
        <GlobalStockSearch className="mb-6" />

        {/* Thematic Baskets */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <LayoutGrid className="w-5 h-5 text-brand-orange" />
              Thematic Baskets
            </h2>
            {activeBasket && (
              <Button variant="ghost" size="sm" onClick={() => setActiveBasket(null)} className="h-8 text-muted-foreground hover:text-foreground">
                Clear Selection
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {THEMATIC_BASKETS.map(b => {
              const Icon = b.icon;
              const isActive = activeBasket === b.id;
              return (
                <Card 
                  key={b.id} 
                  className={`p-4 flex flex-col cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isActive ? "ring-2 ring-brand-orange bg-brand-orange/5 border-brand-orange/50" : "hover:border-primary/50"}`}
                  onClick={() => setActiveBasket(isActive ? null : b.id)}
                >
                  <Icon className={`w-6 h-6 mb-3 ${isActive ? "text-brand-orange" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{b.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{b.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Technical Scanners */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-heading font-bold flex items-center gap-2">
              <Radar className="w-5 h-5 text-secondary" />
              Technical Scanners
            </h2>
            {activeScanner && (
              <Button variant="ghost" size="sm" onClick={() => setActiveScanner(null)} className="h-8 text-muted-foreground hover:text-foreground">
                Clear Selection
              </Button>
            )}
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            {TECHNICAL_SCANNERS.map(s => {
              const Icon = s.icon;
              const isActive = activeScanner === s.id;
              return (
                <Card 
                  key={s.id} 
                  className={`p-4 flex flex-col cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98] ${isActive ? "ring-2 ring-secondary bg-secondary/5 border-secondary/50" : "hover:border-primary/50"}`}
                  onClick={() => setActiveScanner(isActive ? null : s.id)}
                >
                  <Icon className={`w-6 h-6 mb-3 ${isActive ? "text-secondary" : "text-muted-foreground"}`} />
                  <h3 className="font-semibold text-sm mb-1 text-foreground">{s.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{s.desc}</p>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex items-center gap-2 mb-3 text-sm font-medium text-muted-foreground">
            <Filter className="w-4 h-4" /> Filters
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search stock..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={sector} onValueChange={setSector}>
              <SelectTrigger><SelectValue placeholder="Sector" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sectors</SelectItem>
                {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={peRange} onValueChange={setPeRange}>
              <SelectTrigger><SelectValue placeholder="P/E Ratio" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All P/E</SelectItem>
                <SelectItem value="low">Low (&lt;20)</SelectItem>
                <SelectItem value="mid">Mid (20-40)</SelectItem>
                <SelectItem value="high">High (&gt;40)</SelectItem>
              </SelectContent>
            </Select>
            <Select value={capRange} onValueChange={setCapRange}>
              <SelectTrigger><SelectValue placeholder="Market Cap" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Caps</SelectItem>
                <SelectItem value="large">Large Cap (₹50K+ Cr)</SelectItem>
                <SelectItem value="mid">Mid Cap (₹10K-50K Cr)</SelectItem>
                <SelectItem value="small">Small Cap (&lt;₹10K Cr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Heatmap (Moved inside View Toggles) */}

        {error && (
          <Card className="p-4 mb-4 border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">⚠️ {error}. Showing cached data if available.</p>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StockLoadingAnimation />
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  {filtered.length} stocks matching criteria
                  {bgRefreshing && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-brand-orange animate-pulse">
                      <Loader2 className="w-3 h-3 animate-spin" /> Refreshing prices...
                    </span>
                  )}
                </p>
                
                {/* View Toggles */}
                <div className="flex bg-muted rounded-lg p-1 self-start sm:self-auto">
                  <button 
                    onClick={() => setViewMode("list")} 
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <List className="w-4 h-4" /> List
                  </button>
                  <button 
                    onClick={() => setViewMode("heatmap")} 
                    className={`px-4 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-2 ${viewMode === "heatmap" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Heatmap
                  </button>
                </div>
              </div>

              {viewMode === "heatmap" ? (
                <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="min-h-[50vh]">
                  <StockHeatmap stocks={filtered} maxItems={150} />
                </motion.div>
              ) : (
              <Card className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      {([["symbol", "Stock"], ["price", "Price"], ["change_pct", "Change"], ["market_cap", "Market Cap"], ["pe", "P/E"]] as [SortKey, string][]).map(([key, label]) => (
                        <th key={key} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort(key)}>
                          <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className="w-3 h-3" /></span>
                        </th>
                      ))}
                      <th className="text-left px-4 py-3 font-medium text-muted-foreground">52W Range</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Volume</th>
                      <th className="text-right px-4 py-3 font-medium text-muted-foreground">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((s, i) => {
                      const range = s.high_52 - s.low_52;
                      const pct52 = range > 0 ? ((s.price - s.low_52) / range) * 100 : 50;
                      return (
                        <motion.tr key={s.symbol} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.01 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="font-semibold text-foreground">{s.symbol}</div>
                            <div className="text-xs text-muted-foreground">{s.name}</div>
                          </td>
                          <td className="px-4 py-3 font-mono font-medium text-foreground">₹{s.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-flex items-center gap-1 font-medium ${s.change_pct >= 0 ? "text-secondary" : "text-destructive"}`}>
                              {s.change_pct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                              {s.change_pct >= 0 ? "+" : ""}{s.change_pct.toFixed(2)}%
                            </span>
                          </td>
                          <td className="px-4 py-3 text-foreground">{formatMarketCap(s.market_cap)}</td>
                          <td className="px-4 py-3">
                            {s.pe > 0 ? (
                              <Badge variant={s.pe < 20 ? "default" : s.pe <= 40 ? "secondary" : "outline"} className="text-xs">{s.pe.toFixed(1)}</Badge>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 min-w-[180px]">
                            {s.high_52 > 0 ? (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>₹{s.low_52.toLocaleString("en-IN")}</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full relative">
                                  <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-destructive to-secondary rounded-full" style={{ width: `${Math.min(100, Math.max(0, pct52))}%` }} />
                                </div>
                                <span>₹{s.high_52.toLocaleString("en-IN")}</span>
                              </div>
                            ) : <span className="text-muted-foreground text-xs">—</span>}
                          </td>
                          <td className="px-4 py-3 text-right font-mono text-muted-foreground">
                            {s.volume > 0 ? `${(s.volume / 1000000).toFixed(1)}M` : "—"}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-brand-orange border-brand-orange/30 hover:bg-brand-orange/10 bg-transparent text-xs h-8 px-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                setAnalyzingStock(s);
                              }}
                            >
                              <Bot className="w-3.5 h-3.5 mr-1" /> AI Edit
                            </Button>
                          </td>
                        </motion.tr>
                      );
                    })}
                  </tbody>
                </table>
              </Card>
              )}

              <p className="text-xs text-muted-foreground mt-4 text-center">
                Live data from Yahoo Finance. Prices may be delayed by up to 15 minutes. Auto-refreshes every 5 minutes.
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <AIAnalysisModal 
          isOpen={!!analyzingStock} 
          onClose={() => setAnalyzingStock(null)} 
          stock={analyzingStock ? {
            name: analyzingStock.name,
            symbol: analyzingStock.symbol,
            price: analyzingStock.price,
            change_pct: analyzingStock.change_pct,
            pe: analyzingStock.pe,
            high_52: analyzingStock.high_52,
            low_52: analyzingStock.low_52,
            day_high: analyzingStock.day_high,
            day_low: analyzingStock.day_low,
            volume: analyzingStock.volume,
            market_cap: analyzingStock.market_cap,
            sector: analyzingStock.sector,
          } : null} 
        />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default StockScreenerPage;
