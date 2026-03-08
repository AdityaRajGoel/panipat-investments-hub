import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, TrendingDown, Building2, BarChart3, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

type StockResult = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  change_pct: number;
  market_cap: number;
  pe: number;
  high_52: number;
  low_52: number;
  volume: number;
  day_high: number;
  day_low: number;
  open_price: number;
  prev_close: number;
};

const formatMarketCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(0)}K Cr`;
  if (cr > 0) return `₹${cr.toFixed(0)} Cr`;
  return "—";
};

const generateMiniChart = (up: boolean, points = 30): number[] => {
  const data: number[] = [];
  let val = 100;
  const trend = up ? 0.3 : -0.3;
  for (let i = 0; i < points; i++) {
    val += trend + (Math.random() - 0.48) * 2;
    data.push(val);
  }
  return data;
};

const MiniChart = ({ up, width = 200, height = 60 }: { up: boolean; width?: number; height?: number }) => {
  const data = generateMiniChart(up);
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - ((v - min) / range) * height}`).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <defs>
        <linearGradient id={`grad-${up}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={up ? "hsl(var(--secondary))" : "hsl(var(--destructive))"} stopOpacity="0.3" />
          <stop offset="100%" stopColor={up ? "hsl(var(--secondary))" : "hsl(var(--destructive))"} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon
        points={`0,${height} ${points} ${width},${height}`}
        fill={`url(#grad-${up})`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={up ? "hsl(var(--secondary))" : "hsl(var(--destructive))"}
        strokeWidth="2"
      />
    </svg>
  );
};

type Props = {
  className?: string;
};

const GlobalStockSearch = ({ className }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<StockResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchStocks = useCallback(async (q: string) => {
    if (q.length < 1) { setResults([]); return; }
    setSearching(true);
    try {
      const { data } = await supabase
        .from("screener_stocks")
        .select("*")
        .or(`symbol.ilike.%${q}%,name.ilike.%${q}%`)
        .order("market_cap", { ascending: false })
        .limit(10);
      setResults((data as StockResult[]) || []);
    } catch {
      setResults([]);
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim()) searchStocks(query.trim());
      else setResults([]);
    }, 250);
    return () => clearTimeout(timer);
  }, [query, searchStocks]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <div className={`relative ${className || ""}`}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            ref={inputRef}
            placeholder="Search any stock (e.g. RELIANCE, TCS)..."
            value={query}
            onChange={e => { setQuery(e.target.value); setShowDropdown(true); }}
            onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
            className="pl-9 pr-9"
          />
          {query && (
            <button onClick={() => { setQuery(""); setResults([]); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="w-4 h-4" />
            </button>
          )}
          {searching && <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-muted-foreground" />}
        </div>

        <AnimatePresence>
          {showDropdown && results.length > 0 && (
            <motion.div
              ref={dropdownRef}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg overflow-hidden max-h-80 overflow-y-auto"
            >
              {results.map(stock => (
                <button
                  key={stock.symbol}
                  className="w-full px-4 py-3 flex items-center justify-between hover:bg-muted/50 transition-colors text-left border-b border-border/30 last:border-0"
                  onClick={() => {
                    setSelected(stock);
                    setShowDropdown(false);
                  }}
                >
                  <div>
                    <span className="font-semibold text-sm text-foreground">{stock.symbol}</span>
                    <span className="text-xs text-muted-foreground ml-2">{stock.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm text-foreground">₹{stock.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span className={`text-xs font-medium ${stock.change_pct >= 0 ? "text-secondary" : "text-destructive"}`}>
                      {stock.change_pct >= 0 ? "+" : ""}{stock.change_pct.toFixed(2)}%
                    </span>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {showDropdown && query.length > 0 && results.length === 0 && !searching && (
          <div className="absolute z-50 top-full mt-1 w-full bg-popover border border-border rounded-lg shadow-lg p-4 text-center text-sm text-muted-foreground">
            No stocks found for "{query}"
          </div>
        )}
      </div>

      {/* Stock Detail Dialog */}
      <Dialog open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <span className="text-xl font-bold">{selected.symbol}</span>
                  <Badge variant="outline" className="text-xs">{selected.sector}</Badge>
                </DialogTitle>
                <p className="text-sm text-muted-foreground">{selected.name}</p>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                {/* Price */}
                <div className="flex items-end gap-4">
                  <span className="text-3xl font-bold font-mono text-foreground">
                    ₹{selected.price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className={`text-lg font-medium flex items-center gap-1 ${selected.change_pct >= 0 ? "text-secondary" : "text-destructive"}`}>
                    {selected.change_pct >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    {selected.change >= 0 ? "+" : ""}{selected.change.toFixed(2)} ({selected.change_pct >= 0 ? "+" : ""}{selected.change_pct.toFixed(2)}%)
                  </span>
                </div>

                {/* Chart */}
                <Card className="p-4 flex items-center justify-center">
                  <MiniChart up={selected.change_pct >= 0} width={400} height={100} />
                </Card>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Open", value: `₹${selected.open_price.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    { label: "Prev Close", value: `₹${selected.prev_close.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    { label: "Day High", value: `₹${selected.day_high.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    { label: "Day Low", value: `₹${selected.day_low.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
                    { label: "52W High", value: `₹${selected.high_52.toLocaleString("en-IN")}` },
                    { label: "52W Low", value: `₹${selected.low_52.toLocaleString("en-IN")}` },
                    { label: "Market Cap", value: selected.market_cap > 0 ? formatMarketCap(selected.market_cap) : "—" },
                    { label: "P/E Ratio", value: selected.pe > 0 ? selected.pe.toFixed(1) : "—" },
                    { label: "Volume", value: selected.volume > 0 ? `${(selected.volume / 1000000).toFixed(2)}M` : "—" },
                    { label: "Sector", value: selected.sector },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between items-center py-1.5 border-b border-border/30">
                      <span className="text-xs text-muted-foreground">{label}</span>
                      <span className="text-sm font-medium text-foreground">{value}</span>
                    </div>
                  ))}
                </div>

                {/* 52W Range Bar */}
                {selected.high_52 > 0 && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">52-Week Range</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>₹{selected.low_52.toLocaleString("en-IN")}</span>
                      <div className="flex-1 h-2 bg-muted rounded-full relative">
                        <div
                          className="absolute left-0 top-0 h-full bg-gradient-to-r from-destructive to-secondary rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, ((selected.price - selected.low_52) / (selected.high_52 - selected.low_52)) * 100))}%` }}
                        />
                        <div
                          className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground rounded-full border-2 border-background"
                          style={{ left: `${Math.min(100, Math.max(0, ((selected.price - selected.low_52) / (selected.high_52 - selected.low_52)) * 100))}%` }}
                        />
                      </div>
                      <span>₹{selected.high_52.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default GlobalStockSearch;
