import { motion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Clock, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const indices = [
  { name: "NIFTY 50", symbol: "NIFTY" },
  { name: "SENSEX", symbol: "SENSEX" },
  { name: "BANK NIFTY", symbol: "BANKNIFTY" },
  { name: "NIFTY IT", symbol: "NIFTYIT" },
  { name: "NIFTY FIN", symbol: "NIFTYFIN" },
];

const generateChartData = (trend: "up" | "down" | "mixed", points = 60, seed = 0) => {
  const data: number[] = [];
  let value = 100 + ((seed * 7 + 13) % 20);
  const volatility = points > 100 ? 1.5 : points > 30 ? 2 : 2.5;
  for (let i = 0; i < points; i++) {
    const drift = trend === "up" ? 0.12 : trend === "down" ? -0.12 : 0;
    const pseudo = Math.sin(seed * 1000 + i * 3.7) * 0.5 + Math.cos(seed * 500 + i * 2.3) * 0.5;
    value += (pseudo + drift) * volatility;
    value = Math.max(75, Math.min(135, value));
    data.push(value);
  }
  return data;
};

const generateVolumeData = (points: number, seed: number) => {
  const data: number[] = [];
  for (let i = 0; i < points; i++) {
    const pseudo = Math.abs(Math.sin(seed * 500 + i * 2.1)) * 0.7 + 0.3;
    data.push(pseudo * 100);
  }
  return data;
};

type IndexInfo = { trend: "up" | "down" | "mixed"; change: Record<string, string>; price: string; up: Record<string, boolean>; open: string; high: string; low: string; prevClose: string; pe: string; marketCap: string; w52High: string; w52Low: string };

const indexMeta: Record<string, IndexInfo> = {
  NIFTY: { trend: "up", price: "22,147.00", change: { "1D": "+0.85%", "1W": "+2.14%", "1M": "+4.52%", "3M": "+8.31%", "1Y": "+18.65%" }, up: { "1D": true, "1W": true, "1M": true, "3M": true, "1Y": true }, open: "21,960.50", high: "22,189.30", low: "21,912.45", prevClose: "21,960.15", pe: "21.8", marketCap: "₹243L Cr", w52High: "22,526.60", w52Low: "18,837.85" },
  SENSEX: { trend: "up", price: "72,831.94", change: { "1D": "+0.72%", "1W": "+1.89%", "1M": "+3.76%", "3M": "+7.12%", "1Y": "+16.42%" }, up: { "1D": true, "1W": true, "1M": true, "3M": true, "1Y": true }, open: "72,280.60", high: "72,950.40", low: "72,180.20", prevClose: "72,310.80", pe: "23.2", marketCap: "₹385L Cr", w52High: "73,427.59", w52Low: "62,293.74" },
  BANKNIFTY: { trend: "down", price: "46,893.65", change: { "1D": "-0.32%", "1W": "-1.45%", "1M": "+1.22%", "3M": "+3.85%", "1Y": "+10.20%" }, up: { "1D": false, "1W": false, "1M": true, "3M": true, "1Y": true }, open: "47,120.30", high: "47,245.80", low: "46,780.15", prevClose: "47,044.05", pe: "18.4", marketCap: "₹98L Cr", w52High: "48,636.35", w52Low: "42,105.20" },
  NIFTYIT: { trend: "mixed", price: "34,521.20", change: { "1D": "+0.41%", "1W": "-0.78%", "1M": "+2.35%", "3M": "-1.52%", "1Y": "+12.80%" }, up: { "1D": true, "1W": false, "1M": true, "3M": false, "1Y": true }, open: "34,380.00", high: "34,650.80", low: "34,280.10", prevClose: "34,380.20", pe: "28.6", marketCap: "₹45L Cr", w52High: "37,880.25", w52Low: "29,480.60" },
  NIFTYFIN: { trend: "up", price: "21,456.80", change: { "1D": "+0.62%", "1W": "+1.34%", "1M": "+2.88%", "3M": "+5.42%", "1Y": "+14.30%" }, up: { "1D": true, "1W": true, "1M": true, "3M": true, "1Y": true }, open: "21,320.40", high: "21,510.60", low: "21,280.15", prevClose: "21,324.50", pe: "19.2", marketCap: "₹72L Cr", w52High: "22,134.80", w52Low: "17,680.40" },
};

const timeframePoints: Record<string, number> = { "1D": 60, "1W": 90, "1M": 120, "3M": 180, "1Y": 250 };
const timeframeSeed: Record<string, number> = { "1D": 1, "1W": 2, "1M": 3, "3M": 4, "1Y": 5 };

const InteractiveChart = ({ data, volumeData, up, large = false }: { data: number[]; volumeData?: number[]; up: boolean; large?: boolean }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = large ? 160 : 40;
  const volH = large ? 40 : 0;
  const w = large ? 500 : 100;

  const coords = useMemo(() => data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h,
    val: v,
  })), [data, w, h, min, range]);

  const points = coords.map(c => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const color = up ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)";
  const warmAccent = "hsl(24, 95%, 53%)";
  const gradientId = `grad-${large ? "lg" : "sm"}-${up ? "up" : "down"}-interactive`;

  const handleMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!large) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * w;
    let closest = 0;
    let closestDist = Infinity;
    coords.forEach((c, i) => { const d = Math.abs(c.x - x); if (d < closestDist) { closestDist = d; closest = i; } });
    setHoverIdx(closest);
  }, [large, w, coords]);

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${w} ${h + volH}`}
        className={large ? "w-full h-[200px] cursor-crosshair" : "w-[100px] h-[40px]"}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {/* Grid lines for large */}
        {large && [0, 1, 2, 3].map(i => (
          <line key={i} x1={0} y1={(h / 3) * i} x2={w} y2={(h / 3) * i} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        ))}
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth={large ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" />
        {/* Volume bars for large chart */}
        {large && volumeData && volumeData.map((v, i) => {
          const barW = w / volumeData.length;
          const barH = (v / 100) * volH;
          return (
            <rect
              key={i}
              x={i * barW}
              y={h + volH - barH}
              width={barW * 0.7}
              height={barH}
              fill={data[i] >= (data[i - 1] || data[i]) ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)"}
              opacity={hoverIdx === i ? 0.8 : 0.25}
              rx="1"
            />
          );
        })}
        {large && hoverIdx !== null && coords[hoverIdx] && (
          <>
            <line x1={coords[hoverIdx].x} y1={0} x2={coords[hoverIdx].x} y2={h + volH} stroke={warmAccent} strokeWidth="1" strokeDasharray="4 3" opacity="0.6" />
            <line x1={0} y1={coords[hoverIdx].y} x2={w} y2={coords[hoverIdx].y} stroke={color} strokeWidth="0.5" strokeDasharray="4 3" opacity="0.3" />
            <circle cx={coords[hoverIdx].x} cy={coords[hoverIdx].y} r="5" fill={warmAccent} stroke="hsl(var(--background))" strokeWidth="2.5" />
          </>
        )}
      </svg>
      {large && hoverIdx !== null && coords[hoverIdx] && (
        <div
          className="absolute top-0 bg-card border border-brand-orange/30 rounded-xl px-4 py-2 shadow-xl pointer-events-none text-xs z-10"
          style={{ left: `${(coords[hoverIdx].x / w) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="font-bold text-foreground text-sm">₹{(coords[hoverIdx].val * 220).toFixed(2)}</div>
          <div className="text-muted-foreground">{`${9 + Math.floor(hoverIdx / 10)}:${String((hoverIdx % 10) * 6).padStart(2, "0")}`}</div>
          {volumeData && <div className="text-brand-orange text-[10px]">Vol: {(volumeData[hoverIdx] * 1.2).toFixed(0)}K</div>}
        </div>
      )}
    </div>
  );
};

const timeLabels: Record<string, string[]> = {
  "1D": ["09:15", "10:30", "11:45", "13:00", "14:15", "15:30"],
  "1W": ["Mon", "Tue", "Wed", "Thu", "Fri", ""],
  "1M": ["Week 1", "Week 2", "Week 3", "Week 4", "", ""],
  "3M": ["Jan", "Feb", "Mar", "", "", ""],
  "1Y": ["Mar", "May", "Jul", "Sep", "Nov", "Jan"],
};

const LiveChart = () => {
  const [activeIndex, setActiveIndex] = useState("NIFTY");
  const [activeTimeframe, setActiveTimeframe] = useState("1D");

  const meta = indexMeta[activeIndex];
  const currentChange = meta.change[activeTimeframe] || meta.change["1D"];
  const currentUp = meta.up[activeTimeframe] ?? meta.up["1D"];

  const chartData = useMemo(() => {
    const trend = currentUp ? "up" : "down";
    const points = timeframePoints[activeTimeframe] || 60;
    const seed = timeframeSeed[activeTimeframe] + indices.findIndex(i => i.symbol === activeIndex);
    return generateChartData(trend, points, seed);
  }, [activeIndex, activeTimeframe, currentUp]);

  const volumeData = useMemo(() => {
    const points = timeframePoints[activeTimeframe] || 60;
    const seed = timeframeSeed[activeTimeframe] + indices.findIndex(i => i.symbol === activeIndex) + 10;
    return generateVolumeData(points, seed);
  }, [activeIndex, activeTimeframe]);

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      {/* Warm subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-orange/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="flex items-center gap-2 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-brand-orange" />
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Market Watch</h2>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-brand-orange animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Live</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <motion.div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {indices.map((idx) => {
              const m = indexMeta[idx.symbol];
              const idxUp = m.up["1D"];
              const isActive = activeIndex === idx.symbol;
              return (
                <motion.button key={idx.symbol} onClick={() => setActiveIndex(idx.symbol)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px] lg:min-w-0 text-left ${isActive ? "bg-card border-brand-orange/40 shadow-lg shadow-brand-orange/10" : "bg-card/50 border-border/30 hover:border-border"}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idxUp ? "bg-secondary/10" : "bg-destructive/10"}`}>
                    {idxUp ? <TrendingUp className="w-4 h-4 text-secondary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-medium">{idx.name}</div>
                    <div className="text-sm font-bold text-foreground">₹{m.price}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${idxUp ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>{m.change["1D"]}</div>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="space-y-4">
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{indices.find(i => i.symbol === activeIndex)?.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold text-foreground">₹{meta.price}</span>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${currentUp ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                        {currentUp ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}{currentChange}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                      <button key={tf} onClick={() => setActiveTimeframe(tf)}
                        className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTimeframe === tf ? "bg-brand-orange/10 text-brand-orange border border-brand-orange/30" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}>{tf}</button>
                    ))}
                  </div>
                </div>
                <motion.div key={`${activeIndex}-${activeTimeframe}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                  <InteractiveChart data={chartData} volumeData={volumeData} up={currentUp} large />
                </motion.div>
                <div className="flex justify-between mt-2 text-[10px] text-muted-foreground">
                  {(timeLabels[activeTimeframe] || timeLabels["1D"]).map((label, i) => (
                    <span key={i}>{label}</span>
                  ))}
                </div>
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm bg-secondary/40" />
                      <span className="text-[10px] text-muted-foreground">Buy Vol</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2.5 h-2.5 rounded-sm bg-destructive/40" />
                      <span className="text-[10px] text-muted-foreground">Sell Vol</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    <span>{new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* OHLC + Key Data Strip — MoneyControl / Motilal Oswal style */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Open", value: `₹${meta.open}`, icon: Activity },
                { label: "High", value: `₹${meta.high}`, icon: ArrowUpRight, color: "text-secondary" },
                { label: "Low", value: `₹${meta.low}`, icon: ArrowDownRight, color: "text-destructive" },
                { label: "Prev Close", value: `₹${meta.prevClose}`, icon: Layers },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div key={item.label} className="bg-card border border-border/50 rounded-xl p-3" whileHover={{ y: -2 }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon className={`w-3 h-3 ${item.color || "text-brand-orange"}`} />
                      <span className="text-[10px] text-muted-foreground font-medium">{item.label}</span>
                    </div>
                    <span className="text-sm font-bold text-foreground">{item.value}</span>
                  </motion.div>
                );
              })}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "P/E Ratio", value: meta.pe },
                { label: "Market Cap", value: meta.marketCap },
                { label: "52W High", value: `₹${meta.w52High}` },
                { label: "52W Low", value: `₹${meta.w52Low}` },
              ].map((item) => (
                <motion.div key={item.label} className="bg-muted/30 border border-border/30 rounded-xl p-3" whileHover={{ y: -2 }}>
                  <span className="text-[10px] text-muted-foreground font-medium block mb-1">{item.label}</span>
                  <span className="text-sm font-bold text-foreground">{item.value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveChart;
