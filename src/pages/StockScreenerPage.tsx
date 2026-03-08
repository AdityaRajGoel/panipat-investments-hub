import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Search, Filter, TrendingUp, TrendingDown, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type Stock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  changePct: number;
  marketCap: number;
  pe: number;
  high52: number;
  low52: number;
  volume: number;
};

const STOCKS: Stock[] = [
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2945.30, change: 32.15, changePct: 1.10, marketCap: 1993000, pe: 28.5, high52: 3217, low52: 2220, volume: 8945000 },
  { symbol: "TCS", name: "Tata Consultancy Services", sector: "IT", price: 3872.60, change: -18.40, changePct: -0.47, marketCap: 1412000, pe: 32.1, high52: 4243, low52: 3311, volume: 3210000 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1678.90, change: 12.30, changePct: 0.74, marketCap: 1278000, pe: 19.8, high52: 1880, low52: 1363, volume: 12340000 },
  { symbol: "INFY", name: "Infosys", sector: "IT", price: 1542.75, change: -8.90, changePct: -0.57, marketCap: 640000, pe: 27.3, high52: 1953, low52: 1358, volume: 6780000 },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1234.50, change: 15.60, changePct: 1.28, marketCap: 870000, pe: 18.2, high52: 1362, low52: 898, volume: 9120000 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1687.40, change: 28.90, changePct: 1.74, marketCap: 980000, pe: 72.3, high52: 1779, low52: 1130, volume: 4560000 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", price: 812.35, change: -4.25, changePct: -0.52, marketCap: 725000, pe: 10.8, high52: 912, low52: 600, volume: 15670000 },
  { symbol: "ITC", name: "ITC Ltd", sector: "FMCG", price: 467.80, change: 3.40, changePct: 0.73, marketCap: 583000, pe: 28.9, high52: 528, low52: 399, volume: 11230000 },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3456.20, change: 45.60, changePct: 1.34, marketCap: 475000, pe: 35.7, high52: 3925, low52: 2880, volume: 2340000 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1876.90, change: -12.10, changePct: -0.64, marketCap: 373000, pe: 22.4, high52: 2065, low52: 1644, volume: 3450000 },
  { symbol: "HINDUNILVR", name: "Hindustan Unilever", sector: "FMCG", price: 2534.60, change: 8.90, changePct: 0.35, marketCap: 595000, pe: 58.2, high52: 2859, low52: 2136, volume: 1890000 },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", price: 1156.40, change: 21.30, changePct: 1.88, marketCap: 357000, pe: 14.6, high52: 1340, low52: 956, volume: 8760000 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", price: 7234.50, change: -56.80, changePct: -0.78, marketCap: 448000, pe: 33.5, high52: 8192, low52: 5875, volume: 1560000 },
  { symbol: "MARUTI", name: "Maruti Suzuki", sector: "Auto", price: 12456.30, change: 134.50, changePct: 1.09, marketCap: 389000, pe: 29.8, high52: 13680, low52: 9750, volume: 890000 },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer", price: 3567.80, change: -23.40, changePct: -0.65, marketCap: 316000, pe: 85.3, high52: 3887, low52: 2877, volume: 1230000 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", price: 1789.40, change: 15.20, changePct: 0.86, marketCap: 429000, pe: 38.6, high52: 1960, low52: 1218, volume: 3450000 },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", price: 945.60, change: 18.90, changePct: 2.04, marketCap: 348000, pe: 8.7, high52: 1179, low52: 615, volume: 14560000 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "IT", price: 478.90, change: -3.20, changePct: -0.66, marketCap: 250000, pe: 22.8, high52: 576, low52: 381, volume: 5670000 },
  { symbol: "ADANIENT", name: "Adani Enterprises", sector: "Conglomerate", price: 2876.40, change: 67.30, changePct: 2.40, marketCap: 328000, pe: 78.9, high52: 3744, low52: 2025, volume: 4230000 },
  { symbol: "HCLTECH", name: "HCL Technologies", sector: "IT", price: 1634.20, change: 11.80, changePct: 0.73, marketCap: 443000, pe: 25.1, high52: 1862, low52: 1235, volume: 2890000 },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", price: 2876.50, change: -34.20, changePct: -1.18, marketCap: 276000, pe: 62.4, high52: 3395, low52: 2274, volume: 1560000 },
  { symbol: "NESTLEIND", name: "Nestle India", sector: "FMCG", price: 2345.60, change: 12.30, changePct: 0.53, marketCap: 226000, pe: 72.5, high52: 2778, low52: 2032, volume: 567000 },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Energy", price: 312.40, change: 5.80, changePct: 1.89, marketCap: 292000, pe: 18.3, high52: 358, low52: 215, volume: 12340000 },
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Energy", price: 378.90, change: 7.60, changePct: 2.05, marketCap: 367000, pe: 17.5, high52: 418, low52: 252, volume: 15670000 },
  { symbol: "TATASTEEL", name: "Tata Steel", sector: "Metals", price: 156.80, change: 4.30, changePct: 2.82, marketCap: 191000, pe: 56.2, high52: 184, low52: 114, volume: 34560000 },
];

const SECTORS = [...new Set(STOCKS.map(s => s.sector))].sort();

const formatMarketCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  return `₹${(cr / 1000).toFixed(0)}K Cr`;
};

type SortKey = "symbol" | "price" | "changePct" | "marketCap" | "pe";

const StockScreenerPage = () => {
  const [search, setSearch] = useState("");
  const [sector, setSector] = useState("all");
  const [peRange, setPeRange] = useState("all");
  const [capRange, setCapRange] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("marketCap");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const filtered = useMemo(() => {
    let list = [...STOCKS];
    if (search) list = list.filter(s => s.symbol.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()));
    if (sector !== "all") list = list.filter(s => s.sector === sector);
    if (peRange === "low") list = list.filter(s => s.pe < 20);
    else if (peRange === "mid") list = list.filter(s => s.pe >= 20 && s.pe <= 40);
    else if (peRange === "high") list = list.filter(s => s.pe > 40);
    if (capRange === "large") list = list.filter(s => s.marketCap >= 500000);
    else if (capRange === "mid") list = list.filter(s => s.marketCap >= 200000 && s.marketCap < 500000);
    else if (capRange === "small") list = list.filter(s => s.marketCap < 200000);

    list.sort((a, b) => {
      const av = a[sortKey], bv = b[sortKey];
      return sortDir === "asc" ? (av > bv ? 1 : -1) : (av < bv ? 1 : -1);
    });
    return list;
  }, [search, sector, peRange, capRange, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Stock Screener | Filter NSE BSE Stocks" description="Screen and filter Indian stocks by sector, market cap, P/E ratio, 52-week range. Find the best investment opportunities." keywords="stock screener India, NSE stock filter, BSE stocks, PE ratio filter" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Stock Screener</h1>
          <p className="text-muted-foreground">Filter and discover stocks by sector, market cap, P/E ratio & more</p>
        </motion.div>

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
                {SECTORS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
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
                <SelectItem value="large">Large Cap (₹5L+ Cr)</SelectItem>
                <SelectItem value="mid">Mid Cap (₹2-5L Cr)</SelectItem>
                <SelectItem value="small">Small Cap (&lt;₹2L Cr)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <p className="text-sm text-muted-foreground mb-3">{filtered.length} stocks found</p>

        {/* Table */}
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {([["symbol", "Stock"], ["price", "Price"], ["changePct", "Change"], ["marketCap", "Market Cap"], ["pe", "P/E"]] as [SortKey, string][]).map(([key, label]) => (
                  <th key={key} className="text-left px-4 py-3 font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors" onClick={() => toggleSort(key)}>
                    <span className="inline-flex items-center gap-1">{label} <ArrowUpDown className="w-3 h-3" /></span>
                  </th>
                ))}
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">52W Range</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Volume</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => {
                const pct52 = ((s.price - s.low52) / (s.high52 - s.low52)) * 100;
                return (
                  <motion.tr key={s.symbol} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.02 }} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-foreground">{s.symbol}</div>
                      <div className="text-xs text-muted-foreground">{s.name}</div>
                    </td>
                    <td className="px-4 py-3 font-mono font-medium text-foreground">₹{s.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 font-medium ${s.changePct >= 0 ? "text-secondary" : "text-destructive"}`}>
                        {s.changePct >= 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                        {s.changePct >= 0 ? "+" : ""}{s.changePct.toFixed(2)}%
                      </span>
                    </td>
                    <td className="px-4 py-3 text-foreground">{formatMarketCap(s.marketCap)}</td>
                    <td className="px-4 py-3">
                      <Badge variant={s.pe < 20 ? "default" : s.pe <= 40 ? "secondary" : "outline"} className="text-xs">{s.pe.toFixed(1)}</Badge>
                    </td>
                    <td className="px-4 py-3 min-w-[180px]">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>₹{s.low52}</span>
                        <div className="flex-1 h-1.5 bg-muted rounded-full relative">
                          <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-destructive to-secondary rounded-full" style={{ width: `${pct52}%` }} />
                        </div>
                        <span>₹{s.high52}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-muted-foreground">{(s.volume / 1000000).toFixed(1)}M</td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">Data shown is for demonstration purposes. Prices are indicative and may not reflect real-time values.</p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default StockScreenerPage;
