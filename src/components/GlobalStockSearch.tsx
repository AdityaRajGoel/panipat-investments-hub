import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, TrendingUp, TrendingDown, Loader2, CandlestickChart, LineChart, Bot } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { lovableSupabase } from "@/integrations/supabase/lovable-client";
import AIAnalysisModal from "@/components/AIAnalysisModal";

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

type ChartPoint = { t: number; o: number; h: number; l: number; c: number; v: number };
type TimeRange = "1d" | "5d" | "1mo" | "3mo" | "6mo" | "1y" | "5y";
type ChartMode = "candle" | "line";

const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: "1d", label: "1D" },
  { key: "5d", label: "5D" },
  { key: "1mo", label: "1M" },
  { key: "3mo", label: "3M" },
  { key: "6mo", label: "6M" },
  { key: "1y", label: "1Y" },
  { key: "5y", label: "5Y" },
];

const formatMarketCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(0)}K Cr`;
  if (cr > 0) return `₹${cr.toFixed(0)} Cr`;
  return "—";
};

// Candlestick + Volume chart
const CandlestickSVGChart = ({ data, width = 420, height = 180 }: { data: ChartPoint[]; width?: number; height?: number }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const chartH = height * 0.72;
  const volH = height * 0.2;
  const gap = height * 0.08;
  const pad = { left: 0, right: 0 };
  const cw = width - pad.left - pad.right;

  const allPrices = data.flatMap(d => [d.h, d.l]);
  const pMin = Math.min(...allPrices);
  const pMax = Math.max(...allPrices);
  const pRange = pMax - pMin || 1;
  const maxVol = Math.max(...data.map(d => d.v)) || 1;

  const candleW = Math.max(1, (cw / data.length) * 0.65);
  const wickW = Math.max(0.5, candleW * 0.15);

  const toY = (price: number) => 4 + chartH - ((price - pMin) / pRange) * (chartH - 8);
  const toVolY = (vol: number) => chartH + gap + volH - (vol / maxVol) * volH;

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round((x / cw) * (data.length - 1));
    setHoverIdx(Math.max(0, Math.min(data.length - 1, idx)));
  };

  const hovered = hoverIdx !== null ? data[hoverIdx] : null;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible cursor-crosshair"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setHoverIdx(null)}
    >
      {/* Grid lines */}
      {[0, 0.25, 0.5, 0.75, 1].map(pct => (
        <line key={pct} x1={0} x2={width} y1={toY(pMin + pRange * pct)} y2={toY(pMin + pRange * pct)}
          stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
      ))}

      {/* Candles */}
      {data.map((d, i) => {
        const x = pad.left + (i / (data.length - 1)) * cw;
        const up = d.c >= d.o;
        const color = up ? "hsl(var(--secondary))" : "hsl(var(--destructive))";
        const bodyTop = toY(Math.max(d.o, d.c));
        const bodyBot = toY(Math.min(d.o, d.c));
        const bodyH = Math.max(1, bodyBot - bodyTop);

        return (
          <g key={i}>
            {/* Wick */}
            <line x1={x} x2={x} y1={toY(d.h)} y2={toY(d.l)} stroke={color} strokeWidth={wickW} />
            {/* Body */}
            <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={bodyH} fill={up ? color : color} rx="0.5" />
            {/* Volume bar */}
            <rect x={x - candleW / 2} y={toVolY(d.v)} width={candleW} height={chartH + gap + volH - toVolY(d.v)}
              fill={color} opacity="0.3" rx="0.5" />
          </g>
        );
      })}

      {/* Hover tooltip */}
      {hovered && hoverIdx !== null && (
        <>
          {(() => {
            const x = pad.left + (hoverIdx / (data.length - 1)) * cw;
            return (
              <>
                <line x1={x} y1={0} x2={x} y2={height} stroke="hsl(var(--muted-foreground))" strokeWidth="0.5" strokeDasharray="3,3" opacity="0.6" />
                <rect x={Math.min(x + 8, width - 130)} y={4} width="122" height="72" rx="6"
                  fill="hsl(var(--popover))" stroke="hsl(var(--border))" strokeWidth="1" opacity="0.95" />
                <text x={Math.min(x + 14, width - 124)} y={18} fontSize="9" fill="hsl(var(--muted-foreground))">
                  {new Date(hovered.t).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
                </text>
                {[
                  { label: "O", val: hovered.o },
                  { label: "H", val: hovered.h },
                  { label: "L", val: hovered.l },
                  { label: "C", val: hovered.c },
                ].map((item, idx) => (
                  <text key={item.label} x={Math.min(x + 14, width - 124)} y={32 + idx * 11} fontSize="10" fontFamily="monospace"
                    fill={item.label === "C" ? (hovered.c >= hovered.o ? "hsl(var(--secondary))" : "hsl(var(--destructive))") : "hsl(var(--foreground))"}>
                    {item.label}: ₹{item.val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </text>
                ))}
              </>
            );
          })()}
        </>
      )}
    </svg>
  );
};

// Line chart with area fill
const LineAreaChart = ({ data, up, width = 420, height = 180 }: { data: ChartPoint[]; up: boolean; width?: number; height?: number }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const closes = data.map(d => d.c);
  const min = Math.min(...closes);
  const max = Math.max(...closes);
  const range = max - min || 1;
  const pad = { top: 10, bottom: 20 };
  const ch = height - pad.top - pad.bottom;

  const points = closes.map((v, i) => ({
    x: (i / (closes.length - 1)) * width,
    y: pad.top + ch - ((v - min) / range) * ch,
    val: v, time: data[i].t,
  }));

  const polyline = points.map(p => `${p.x},${p.y}`).join(" ");
  const polygon = `0,${pad.top + ch} ${polyline} ${width},${pad.top + ch}`;
  const color = up ? "hsl(var(--secondary))" : "hsl(var(--destructive))";

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const idx = Math.round((x / width) * (points.length - 1));
    setHoverIdx(Math.max(0, Math.min(points.length - 1, idx)));
  };

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  return (
    <svg ref={svgRef} width="100%" height={height} viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible cursor-crosshair" onMouseMove={handleMouseMove} onMouseLeave={() => setHoverIdx(null)}>
      <defs>
        <linearGradient id="line-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={polygon} fill="url(#line-grad)" />
      <polyline points={polyline} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" />
      {hovered && (
        <>
          <line x1={hovered.x} y1={pad.top} x2={hovered.x} y2={pad.top + ch} stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
          <circle cx={hovered.x} cy={hovered.y} r="4" fill={color} stroke="hsl(var(--background))" strokeWidth="2" />
          <rect x={Math.min(hovered.x - 55, width - 115)} y={Math.max(hovered.y - 42, 0)} width="110" height="36" rx="6"
            fill="hsl(var(--popover))" stroke="hsl(var(--border))" strokeWidth="1" />
          <text x={Math.min(hovered.x - 50, width - 110)} y={Math.max(hovered.y - 25, 13)} fontSize="11" fontWeight="600" fill="hsl(var(--foreground))" fontFamily="monospace">
            ₹{hovered.val.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </text>
          <text x={Math.min(hovered.x - 50, width - 110)} y={Math.max(hovered.y - 12, 26)} fontSize="9" fill="hsl(var(--muted-foreground))">
            {new Date(hovered.time).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
          </text>
        </>
      )}
    </svg>
  );
};

type Props = { className?: string };

const GlobalStockSearch = ({ className }: Props) => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StockResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selected, setSelected] = useState<StockResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const [chartLoading, setChartLoading] = useState(false);
  const [chartRange, setChartRange] = useState<TimeRange>("3mo");
  const [chartMode, setChartMode] = useState<ChartMode>("candle");
  const [analyzingStock, setAnalyzingStock] = useState<StockResult | null>(null);
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

  const fetchChart = useCallback(async (symbol: string, range: TimeRange) => {
    setChartLoading(true);
    setChartData([]);
    try {
      const { data, error } = await lovableSupabase.functions.invoke("fetch-stock-chart", {
        body: { symbol, range },
      });
      if (!error && data?.success && data.dataPoints?.length > 0) {
        setChartData(data.dataPoints);
      }
    } catch {} finally {
      setChartLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selected) fetchChart(selected.symbol, chartRange);
  }, [selected, chartRange, fetchChart]);

  const handleSelect = (stock: StockResult) => {
    setSelected(stock);
    setChartRange("3mo");
    setShowDropdown(false);
  };

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

  const chartUp = useMemo(() => {
    if (chartData.length < 2) return (selected?.change_pct ?? 0) >= 0;
    return chartData[chartData.length - 1].c >= chartData[0].c;
  }, [chartData, selected]);

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
                  onClick={() => handleSelect(stock)}
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
                <Card className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {TIME_RANGES.map(({ key, label }) => (
                          <Button key={key} variant={chartRange === key ? "default" : "ghost"} size="sm"
                            className="h-7 px-2.5 text-xs" onClick={() => setChartRange(key)}>
                            {label}
                          </Button>
                        ))}
                      </div>
                      
                      {/* AI Analyze Button added here */}
                      <div className="hidden sm:block w-px h-6 bg-border mx-1"></div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-brand-orange border-brand-orange/30 hover:bg-brand-orange/10 bg-transparent text-xs h-7 px-3 hidden sm:flex"
                        onClick={() => setAnalyzingStock(selected)}
                      >
                        <Bot className="w-3.5 h-3.5 mr-1" /> AI Analyze
                      </Button>
                    </div>
                    <div className="flex items-center gap-0.5 border border-border rounded-md p-0.5">
                      <button
                        className={`p-1 rounded ${chartMode === "candle" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setChartMode("candle")}
                        title="Candlestick"
                      >
                        <CandlestickChart className="w-4 h-4" />
                      </button>
                      <button
                        className={`p-1 rounded ${chartMode === "line" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                        onClick={() => setChartMode("line")}
                        title="Line"
                      >
                        <LineChart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Mobile AI Button (If it doesn't fit on top) */}
                  <div className="sm:hidden mb-4">
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-brand-orange border-brand-orange/30 hover:bg-brand-orange/10 bg-transparent text-xs w-full h-8"
                        onClick={() => setAnalyzingStock(selected)}
                      >
                        <Bot className="w-3.5 h-3.5 mr-1" /> Generate AI Technical Analysis
                      </Button>
                  </div>

                  {chartLoading ? (
                    <Skeleton className="h-[180px] w-full rounded" />
                  ) : chartData.length > 1 ? (
                    chartMode === "candle" ? (
                      <CandlestickSVGChart data={chartData} />
                    ) : (
                      <LineAreaChart data={chartData} up={chartUp} />
                    )
                  ) : (
                    <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
                      No chart data available
                    </div>
                  )}
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
                        <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-destructive to-secondary rounded-full"
                          style={{ width: `${Math.min(100, Math.max(0, ((selected.price - selected.low_52) / (selected.high_52 - selected.low_52)) * 100))}%` }} />
                        <div className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-foreground rounded-full border-2 border-background"
                          style={{ left: `${Math.min(100, Math.max(0, ((selected.price - selected.low_52) / (selected.high_52 - selected.low_52)) * 100))}%` }} />
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
    </>
  );
};

export default GlobalStockSearch;
