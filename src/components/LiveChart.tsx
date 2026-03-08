import { motion } from "framer-motion";
import { useState, useMemo, useCallback, useEffect } from "react";
import { TrendingUp, TrendingDown, BarChart3, Activity, ArrowUpRight, ArrowDownRight, Clock, Layers } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useLiveMarket } from "@/hooks/useLiveMarket";

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
        {large && [0, 1, 2, 3].map(i => (
          <line key={i} x1={0} y1={(h / 3) * i} x2={w} y2={(h / 3) * i} stroke="hsl(var(--border))" strokeWidth="0.5" strokeDasharray="4 4" opacity="0.3" />
        ))}
        <polygon points={areaPoints} fill={`url(#${gradientId})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth={large ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" />
        {large && volumeData && volumeData.map((v, i) => {
          const barW = w / volumeData.length;
          const barH = (v / 100) * volH;
          return (
            <rect key={i} x={i * barW} y={h + volH - barH} width={barW * 0.7} height={barH}
              fill={data[i] >= (data[i - 1] || data[i]) ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)"}
              opacity={hoverIdx === i ? 0.8 : 0.25} rx="1" />
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

const useCountdown = (targetISO: string | null) => {
  const [remaining, setRemaining] = useState("");
  useEffect(() => {
    if (!targetISO) { setRemaining(""); return; }
    const update = () => {
      const diff = new Date(targetISO).getTime() - Date.now();
      if (diff <= 0) { setRemaining(""); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setRemaining(h > 0 ? `${h}h ${m}m ${s}s` : m > 0 ? `${m}m ${s}s` : `${s}s`);
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [targetISO]);
  return remaining;
};

const LiveChart = () => {
  const { indices, fetchedAt, marketOpen, marketStatusText, lastTradingDate, nextMarketOpen, marketClose } = useLiveMarket();
  const [activeIndexKey, setActiveIndexKey] = useState("NIFTY");
  const [activeTimeframe, setActiveTimeframe] = useState("1D");
  const nextOpenCountdown = useCountdown(nextMarketOpen);
  const closeCountdown = useCountdown(marketClose);

  const activeIndex = indices.find(i => i.key === activeIndexKey) || indices[0];
  const currentUp = activeIndex?.up ?? true;

  const idxPosition = indices.findIndex(i => i.key === activeIndexKey);

  const chartData = useMemo(() => {
    const trend = currentUp ? "up" : "down";
    const points = timeframePoints[activeTimeframe] || 60;
    const seed = timeframeSeed[activeTimeframe] + idxPosition;
    return generateChartData(trend, points, seed);
  }, [activeIndexKey, activeTimeframe, currentUp, idxPosition]);

  const volumeData = useMemo(() => {
    const points = timeframePoints[activeTimeframe] || 60;
    const seed = timeframeSeed[activeTimeframe] + idxPosition + 10;
    return generateVolumeData(points, seed);
  }, [activeIndexKey, activeTimeframe, idxPosition]);

  const formatTradingDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  };

  const statusColor = marketOpen 
    ? "bg-secondary/10 text-secondary border-secondary/20"
    : marketStatusText === "Pre-Market"
      ? "bg-brand-orange/10 text-brand-orange border-brand-orange/20"
      : marketStatusText === "After Hours"
        ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
        : "bg-destructive/10 text-destructive border-destructive/20";

  const dotColor = marketOpen 
    ? "bg-secondary animate-pulse"
    : marketStatusText === "Pre-Market" ? "bg-brand-orange animate-pulse"
    : marketStatusText === "After Hours" ? "bg-purple-400 animate-pulse"
    : "bg-destructive/60";

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-orange/3 to-transparent rounded-full blur-3xl" />
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <motion.div className="flex items-center flex-wrap gap-2 mb-6" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="w-8 h-8 rounded-lg bg-brand-orange/10 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-brand-orange" />
          </div>
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Market Watch</h2>
          <div className="ml-auto flex items-center gap-2 flex-wrap justify-end">
            {/* Market status badge */}
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColor}`}>
              <span className={`w-2 h-2 rounded-full ${dotColor}`} />
              {marketStatusText}
            </div>
            {/* Countdown to open/close */}
            {!marketOpen && nextOpenCountdown && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                Opens in {nextOpenCountdown}
              </div>
            )}
            {marketOpen && closeCountdown && (
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                <Clock className="w-3 h-3" />
                Closes in {closeCountdown}
              </div>
            )}
            {!marketOpen && lastTradingDate && (
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                Closing prices: {formatTradingDate(lastTradingDate)}
              </span>
            )}
            {marketOpen && fetchedAt && (
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                Updated: {new Date(fetchedAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          <motion.div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            {indices.map((idx) => {
              const isActive = activeIndexKey === idx.key;
              return (
                <motion.button key={idx.key} onClick={() => setActiveIndexKey(idx.key)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px] lg:min-w-0 text-left ${isActive ? "bg-card border-brand-orange/40 shadow-lg shadow-brand-orange/10" : "bg-card/50 border-border/30 hover:border-border"}`}
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${idx.up ? "bg-secondary/10" : "bg-destructive/10"}`}>
                    {idx.up ? <TrendingUp className="w-4 h-4 text-secondary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-medium">{idx.name}</div>
                    <div className="text-sm font-bold text-foreground">₹{idx.price}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${idx.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>{idx.change}</div>
                </motion.button>
              );
            })}
          </motion.div>

          <div className="space-y-4">
            <Card className="border-border/50 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-foreground">{activeIndex?.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-2xl font-bold text-foreground">₹{activeIndex?.price}</span>
                      <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${currentUp ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                        {currentUp ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}{activeIndex?.change}
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
                <motion.div key={`${activeIndexKey}-${activeTimeframe}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
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

            {/* OHLC Data from live feed */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Open", value: activeIndex?.open ? `₹${activeIndex.open}` : "-", icon: Activity },
                { label: "High", value: activeIndex?.high ? `₹${activeIndex.high}` : "-", icon: ArrowUpRight, color: "text-secondary" },
                { label: "Low", value: activeIndex?.low ? `₹${activeIndex.low}` : "-", icon: ArrowDownRight, color: "text-destructive" },
                { label: "Prev Close", value: activeIndex?.prevClose ? `₹${activeIndex.prevClose}` : "-", icon: Layers },
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
            {activeIndex?.volume && (
              <div className="bg-muted/30 border border-border/30 rounded-xl p-3 text-center">
                <span className="text-[10px] text-muted-foreground font-medium">Volume: </span>
                <span className="text-sm font-bold text-foreground">{activeIndex.volume}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveChart;
