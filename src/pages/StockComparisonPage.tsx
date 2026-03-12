import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GitCompareArrows, Search, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Stock = {
  symbol: string;
  name: string;
  price: number | null;
  change: number | null;
  change_pct: number | null;
  market_cap: number | null;
  pe: number | null;
  volume: number | null;
  high_52: number | null;
  low_52: number | null;
  day_high: number | null;
  day_low: number | null;
  sector: string | null;
};

const StockComparisonPage = () => {
  const [allStocks, setAllStocks] = useState<Stock[]>([]);
  const [selected, setSelected] = useState<Stock[]>([]);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState<number | null>(null); // which slot is searching

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("screener_stocks").select("*").order("market_cap", { ascending: false });
      if (data) setAllStocks(data as Stock[]);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    if (!search.trim()) return allStocks.slice(0, 20);
    const q = search.toLowerCase();
    return allStocks.filter(s => s.name.toLowerCase().includes(q) || s.symbol.toLowerCase().includes(q)).slice(0, 15);
  }, [search, allStocks]);

  const addStock = (stock: Stock) => {
    if (selected.length < 3 && !selected.find(s => s.symbol === stock.symbol)) {
      setSelected([...selected, stock]);
    }
    setSearchOpen(null);
    setSearch("");
  };

  const removeStock = (symbol: string) => {
    setSelected(selected.filter(s => s.symbol !== symbol));
  };

  const fmt = (n: number | null) => n != null ? `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 2 })}` : "—";
  const fmtCr = (n: number | null) => {
    if (n == null) return "—";
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(0)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(0)} L`;
    return fmt(n);
  };
  const fmtVol = (n: number | null) => {
    if (n == null) return "—";
    if (n >= 10000000) return `${(n / 10000000).toFixed(1)} Cr`;
    if (n >= 100000) return `${(n / 100000).toFixed(1)} L`;
    return n.toLocaleString("en-IN");
  };

  const metrics: { label: string; key: string; format: (s: Stock) => string; compare?: "higher" | "lower" }[] = [
    { label: "Price", key: "price", format: s => fmt(s.price) },
    { label: "Change", key: "change_pct", format: s => s.change_pct != null ? `${s.change_pct >= 0 ? "+" : ""}${s.change_pct.toFixed(2)}%` : "—" },
    { label: "Market Cap", key: "market_cap", format: s => fmtCr(s.market_cap), compare: "higher" },
    { label: "P/E Ratio", key: "pe", format: s => s.pe != null ? s.pe.toFixed(2) : "—", compare: "lower" },
    { label: "Volume", key: "volume", format: s => fmtVol(s.volume), compare: "higher" },
    { label: "Day High", key: "day_high", format: s => fmt(s.day_high) },
    { label: "Day Low", key: "day_low", format: s => fmt(s.day_low) },
    { label: "52W High", key: "high_52", format: s => fmt(s.high_52) },
    { label: "52W Low", key: "low_52", format: s => fmt(s.low_52) },
    { label: "Sector", key: "sector", format: s => s.sector || "—" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Stock Comparison Tool | Parasram India" description="Compare stocks side-by-side with key financial metrics, ratios, and performance data." keywords="stock comparison, compare stocks India, stock analysis, PE ratio comparison" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <GitCompareArrows className="w-8 h-8 text-primary" />
            <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground">Stock Comparison</h1>
          </div>
          <p className="text-muted-foreground">Compare up to 3 stocks side-by-side with key metrics</p>
        </motion.div>

        {/* Stock selector */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[0, 1, 2].map(i => (
            <div key={i} className="relative">
              {selected[i] ? (
                <Badge variant="secondary" className="text-sm py-2 px-4 gap-2">
                  {selected[i].symbol}
                  <button onClick={() => removeStock(selected[i].symbol)} className="hover:text-destructive">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </Badge>
              ) : (
                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSearchOpen(searchOpen === i ? null : i)}
                    className="border-dashed"
                  >
                    <Search className="w-4 h-4 mr-1" />
                    Add Stock {i + 1}
                  </Button>

                  <AnimatePresence>
                    {searchOpen === i && (
                      <motion.div
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-lg shadow-lg z-30 p-2"
                      >
                        <Input
                          autoFocus
                          placeholder="Search stocks..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="mb-2"
                        />
                        <div className="max-h-48 overflow-y-auto space-y-0.5">
                          {filtered.map(stock => (
                            <button
                              key={stock.symbol}
                              onClick={() => addStock(stock)}
                              className="w-full text-left px-3 py-2 text-sm rounded hover:bg-muted/50 transition-colors flex justify-between"
                            >
                              <span className="font-medium">{stock.symbol}</span>
                              <span className="text-muted-foreground text-xs truncate ml-2">{stock.name}</span>
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          ))}
        </div>

        {selected.length === 0 ? (
          <Card className="p-12 text-center text-muted-foreground">
            <GitCompareArrows className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">Select stocks to compare</p>
            <p className="text-sm mt-1">Add up to 3 stocks for a side-by-side comparison</p>
          </Card>
        ) : (
          <Card className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-semibold text-muted-foreground min-w-[140px]">Metric</th>
                  {selected.map(s => (
                    <th key={s.symbol} className="text-center px-4 py-3 font-semibold text-foreground min-w-[160px]">
                      <div>{s.symbol}</div>
                      <div className="text-xs font-normal text-muted-foreground truncate">{s.name}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, idx) => {
                  const values = selected.map(s => (s as any)[m.key] as number | null);
                  const validValues = values.filter((v): v is number => v != null);
                  const best = m.compare === "higher" ? Math.max(...validValues) : m.compare === "lower" ? Math.min(...validValues) : null;

                  return (
                    <motion.tr
                      key={m.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.03 }}
                      className="border-b border-border/30 hover:bg-muted/20"
                    >
                      <td className="px-4 py-3 font-medium text-muted-foreground">{m.label}</td>
                      {selected.map((s, si) => {
                        const val = (s as any)[m.key] as number | null;
                        const isBest = best != null && val === best && validValues.length > 1;
                        const isChange = m.key === "change_pct";

                        return (
                          <td key={s.symbol} className={`px-4 py-3 text-center font-mono ${isBest ? "text-secondary font-semibold" : ""} ${isChange && val != null ? (val >= 0 ? "text-secondary" : "text-destructive") : ""}`}>
                            {m.format(s)}
                          </td>
                        );
                      })}
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </Card>
        )}
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default StockComparisonPage;