import { motion } from "framer-motion";
import { useState } from "react";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const indices = [
  { name: "NIFTY 50", symbol: "NIFTY" },
  { name: "SENSEX", symbol: "SENSEX" },
  { name: "BANK NIFTY", symbol: "BANKNIFTY" },
  { name: "NIFTY IT", symbol: "NIFTYIT" },
];

// Generate realistic-looking chart data
const generateChartData = (trend: "up" | "down" | "mixed", points = 60) => {
  const data: number[] = [];
  let value = 100 + Math.random() * 20;
  for (let i = 0; i < points; i++) {
    const drift = trend === "up" ? 0.15 : trend === "down" ? -0.15 : 0;
    value += (Math.random() - 0.5 + drift) * 2;
    value = Math.max(80, Math.min(130, value));
    data.push(value);
  }
  return data;
};

const chartDataMap: Record<string, { data: number[]; change: string; price: string; up: boolean }> = {
  NIFTY: { data: generateChartData("up"), change: "+0.85%", price: "22,147.00", up: true },
  SENSEX: { data: generateChartData("up"), change: "+0.72%", price: "72,831.94", up: true },
  BANKNIFTY: { data: generateChartData("down"), change: "-0.32%", price: "46,893.65", up: false },
  NIFTYIT: { data: generateChartData("mixed"), change: "+0.41%", price: "34,521.20", up: true },
};

const MiniChart = ({ data, up, large = false }: { data: number[]; up: boolean; large?: boolean }) => {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const h = large ? 120 : 40;
  const w = large ? 400 : 100;

  const points = data
    .map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`)
    .join(" ");

  const areaPoints = `0,${h} ${points} ${w},${h}`;
  const color = up ? "hsl(145, 70%, 40%)" : "hsl(0, 84%, 60%)";
  const gradientId = `grad-${large ? "lg" : "sm"}-${up ? "up" : "down"}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={large ? "w-full h-[120px]" : "w-[100px] h-[40px]"} preserveAspectRatio="none">
      <defs>
        <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={points} fill="none" stroke={color} strokeWidth={large ? "2" : "1.5"} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

const LiveChart = () => {
  const [activeIndex, setActiveIndex] = useState("NIFTY");
  const active = chartDataMap[activeIndex];

  return (
    <section className="py-16 bg-background relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <BarChart3 className="w-5 h-5 text-secondary" />
          <h2 className="font-heading text-xl md:text-2xl font-bold text-foreground">Market Watch</h2>
          <div className="ml-auto flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span className="text-xs text-muted-foreground font-medium">Live</span>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-6">
          {/* Index selector list */}
          <motion.div
            className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            {indices.map((idx) => {
              const d = chartDataMap[idx.symbol];
              const isActive = activeIndex === idx.symbol;
              return (
                <motion.button
                  key={idx.symbol}
                  onClick={() => setActiveIndex(idx.symbol)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all min-w-[200px] lg:min-w-0 text-left ${
                    isActive
                      ? "bg-card border-secondary/50 shadow-lg shadow-secondary/10"
                      : "bg-card/50 border-border/30 hover:border-border"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.up ? "bg-secondary/10" : "bg-destructive/10"}`}>
                    {d.up ? <TrendingUp className="w-4 h-4 text-secondary" /> : <TrendingDown className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-muted-foreground font-medium">{idx.name}</div>
                    <div className="text-sm font-bold text-foreground">₹{d.price}</div>
                  </div>
                  <div className={`text-xs font-bold px-2 py-1 rounded-full ${d.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                    {d.change}
                  </div>
                </motion.button>
              );
            })}
          </motion.div>

          {/* Main chart area */}
          <Card className="border-border/50 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-heading text-lg font-bold text-foreground">
                    {indices.find(i => i.symbol === activeIndex)?.name}
                  </h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-2xl font-bold text-foreground">₹{active.price}</span>
                    <span className={`text-sm font-bold px-2.5 py-1 rounded-full ${active.up ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}>
                      {active.up ? <TrendingUp className="w-3.5 h-3.5 inline mr-1" /> : <TrendingDown className="w-3.5 h-3.5 inline mr-1" />}
                      {active.change}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {["1D", "1W", "1M", "3M", "1Y"].map((tf) => (
                    <button
                      key={tf}
                      className="px-2.5 py-1 text-xs font-medium rounded-md text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-colors first:bg-muted first:text-foreground"
                    >
                      {tf}
                    </button>
                  ))}
                </div>
              </div>
              <motion.div
                key={activeIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <MiniChart data={active.data} up={active.up} large />
              </motion.div>
              <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
                <span>09:15</span><span>10:30</span><span>11:45</span><span>13:00</span><span>14:15</span><span>15:30</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default LiveChart;
