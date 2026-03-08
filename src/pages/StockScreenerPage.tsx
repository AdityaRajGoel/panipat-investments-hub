import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown, RefreshCw, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useScreenerStocks, type ScreenerStock } from "@/hooks/useScreenerStocks";
import StockHeatmap from "@/components/StockHeatmap";
import GlobalStockSearch from "@/components/GlobalStockSearch";

const formatMarketCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(0)}K Cr`;
  if (cr > 0) return `₹${cr.toFixed(0)} Cr`;
  return "—";
};

type SortKey = "symbol" | "price" | "change_pct" | "market_cap" | "pe";

const StockScreenerPage = () => {
  const { stocks, loading, updatedAt, error, refresh } = useScreenerStocks();
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [peRange, setPeRange] = useState("all");
  const [capRange, setCapRange] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("market_cap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [refreshing, setRefreshing] = useState(false);

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

    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [stocks, search, sector, peRange, capRange, sortKey, sortDir]);

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
                <SelectItem value="large">Large Cap (₹500+ Cr)</SelectItem>
                <SelectItem value="mid">Mid Cap (₹100-500 Cr)</SelectItem>
                <SelectItem value="small">Small Cap (&lt;₹100 Cr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Heatmap */}
        {!loading && filtered.length > 0 && (
          <div className="mb-6">
            <StockHeatmap stocks={filtered} maxItems={60} />
          </div>
        )}

        {error && (
          <Card className="p-4 mb-4 border-destructive/50 bg-destructive/5">
            <p className="text-sm text-destructive">⚠️ {error}. Showing cached data if available.</p>
          </Card>
        )}

        <p className="text-sm text-muted-foreground mb-3">{filtered.length} stocks found</p>

        {/* Table */}
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
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 15 }).map((_, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="px-4 py-3"><Skeleton className="h-8 w-32" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-20" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-12" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-40" /></td>
                    <td className="px-4 py-3"><Skeleton className="h-5 w-16 ml-auto" /></td>
                  </tr>
                ))
              ) : filtered.map((s, i) => {
                const range = s.high_52 - s.low_52;
                const pct52 = range > 0 ? ((s.price - s.low_52) / range) * 100 : 50;
                return (
                  <motion.tr key={s.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.01 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
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
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Live data from Yahoo Finance. Prices may be delayed by up to 15 minutes. Auto-refreshes every 5 minutes.
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default StockScreenerPage;
