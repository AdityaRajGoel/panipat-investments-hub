import { motion } from "framer-motion";
import { useState, useMemo, useCallback } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const indices = [
  { name: "NIFTY 50", symbol: "NIFTY" },
  { name: "SENSEX", symbol: "SENSEX" },
  { name: "BANK NIFTY", symbol: "BANKNIFTY" },
  { name: "NIFTY IT", symbol: "NIFTYIT" },
];

const generateChartData = (trend: "up" | "down" | "mixed", points = 60, seed = 0) => {
  const data: number[] = [];
  // Use seed to produce different but deterministic-feeling data per timeframe
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

type IndexInfo = { trend: "up" | "down" | "mixed"; change: Record<string, string>; price: string; up: Record<string, boolean> };

const indexMeta: Record<string, IndexInfo> = {
  NIFTY: { trend: "up", price: "22,147.00", change: { "1D": "+0.85%", "1W": "+2.14%", "1M": "+4.52%", "3M": "+8.31%", "1Y": "+18.65%" }, up: { "1D": true, "1W": true, "1M": true, "3M": true, "1Y": true } },
  SENSEX: { trend: "up", price: "72,831.94", change: { "1D": "+0.72%", "1W": "+1.89%", "1M": "+3.76%", "3M": "+7.12%", "1Y": "+16.42%" }, up: { "1D": true, "1W": true, "1M": true, "3M": true, "1Y": true } },
  BANKNIFTY: { trend: "down", price: "46,893.65", change: { "1D": "-0.32%", "1W": "-1.45%", "1M": "+1.22%", "3M": "+3.85%", "1Y": "+10.20%" }, up: { "1D": false, "1W": false, "1M": true, "3M": true, "1Y": true } },
  NIFTYIT: { trend: "mixed", price: "34,521.20", change: { "1D": "+0.41%", "1W": "-0.78%", "1M": "+2.35%", "3M": "-1.52%", "1Y": "+12.80%" }, up: { "1D": true, "1W": false, "1M": true, "3M": false, "1Y": true } },
};

const timeframePoints: Record<string, number> = { "1D": 60, "1W": 90, "1M": 120, "3M": 180, "1Y": 250 };
const timeframeSeed: Record<string, number> = { "1D": 1, "1W": 2, "1M": 3, "3M": 4, "1Y": 5 };

const InteractiveChart = ({ data, up, large = false }: { data: number[]; up: boolean; large?: boolean }) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = large ? 180 : 40;
  const w = large ? 500 : 100;

  const coords = useMemo(() => data.map((v, i) => ({
    x: (i / (data.length - 1)) * w,
    y: h - ((v - min) / range) * h,
    val: v,
  })), [data, w, h, min, range]);

  const points = coords.map(c => `${c.x},${c.y}`).join(" ");
  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const color = up ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)";
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
        viewBox={`0 0 ${w} ${h}`}
        className={large ? "w-full h-[180px] cursor-crosshair" : "w-[100px] h-[40px]"}
        preserveAspectRatio="none"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoverIdx(null)}
      >
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth={large ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" />
        {large && hoverIdx !== null && coords[hoverIdx] && (
          <>
            <line x1={coords[hoverIdx].x} y1={0} x2={coords[hoverIdx].x} y2={h} stroke={color} strokeWidth="1" strokeDasharray="4 3" opacity="0.5" />
            <circle cx={coords[hoverIdx].x} cy={coords[hoverIdx].y} r="4" fill={color} stroke="white" strokeWidth="2" />
          </>
        )}
      </svg>
      {large && hoverIdx !== null && coords[hoverIdx] && (
        <div
          className="absolute top-0 bg-card border border-border rounded-lg px-3 py-1.5 shadow-lg pointer-events-none text-xs z-10"
          style={{ left: `${(coords[hoverIdx].x / w) * 100}%`, transform: "translateX(-50%)" }}
        >
          <div className="font-bold text-foreground">₹{(coords[hoverIdx].val * 220).toFixed(2)}</div>
          <div className="text-muted-foreground">{`${9 + Math.floor(hoverIdx / 10)}:${String((hoverIdx % 10) * 6).padStart(2, "0")}`}</div>
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

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="flex items-center gap-2 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <BarChart3 className="w-5 h-5 text-secondary" />
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Market Watch</h2>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
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
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px] lg:min-w-0 text-left ${isActive ? "bg-card border-secondary/50 shadow-lg shadow-secondary/10" : "bg-card/50 border-border/30 hover:border-border"}`}
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
                      className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${activeTimeframe === tf ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground"}`}>{tf}</button>
                  ))}
                </div>
              </div>
              <motion.div key={`${activeIndex}-${activeTimeframe}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                <InteractiveChart data={chartData} up={currentUp} large />
              </motion.div>
              <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                {(timeLabels[activeTimeframe] || timeLabels["1D"]).map((label, i) => (
                  <span key={i}>{label}</span>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveChart;
