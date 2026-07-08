import { motion } from "motion/react";
import { Card } from "@/components/ui/card";
import type { ScreenerStock } from "@/hooks/useScreenerStocks";

const getColor = (pct: number): string => {
  if (pct >= 2) return "hsl(var(--secondary) / 0.9)";
  if (pct >= 1) return "hsl(var(--secondary) / 0.65)";
  if (pct >= 0.3) return "hsl(var(--secondary) / 0.4)";
  if (pct >= 0) return "hsl(var(--secondary) / 0.2)";
  if (pct >= -1) return "hsl(var(--destructive) / 0.35)";
  if (pct >= -2) return "hsl(var(--destructive) / 0.6)";
  return "hsl(var(--destructive) / 0.85)";
};

const getTextColor = (pct: number): string => {
  if (Math.abs(pct) >= 1) return "hsl(var(--primary-foreground))";
  return "hsl(var(--foreground))";
};

const formatCap = (cr: number) => {
  if (cr >= 100000) return `₹${(cr / 100000).toFixed(1)}L Cr`;
  if (cr >= 1000) return `₹${(cr / 1000).toFixed(0)}K Cr`;
  return `₹${cr} Cr`;
};

type Props = {
  stocks: ScreenerStock[];
  maxItems?: number;
};

const StockHeatmap = ({ stocks, maxItems = 50 }: Props) => {
  // Take top N by market cap, filter out zero-cap
  const data = stocks
    .filter(s => s.market_cap > 0)
    .sort((a, b) => b.market_cap - a.market_cap)
    .slice(0, maxItems);

  const totalCap = data.reduce((sum, s) => sum + s.market_cap, 0);

  if (data.length === 0) return null;

  return (
    <Card className="p-3 md:p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-foreground">Market Heatmap</h3>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
          <span className="w-3 h-2.5 rounded" style={{ background: "hsl(var(--destructive) / 0.7)" }} /> Loss
          <span className="w-3 h-2.5 rounded bg-muted" /> Flat
          <span className="w-3 h-2.5 rounded" style={{ background: "hsl(var(--secondary) / 0.7)" }} /> Gain
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.map((stock, i) => {
          const pctArea = Math.max((stock.market_cap / totalCap) * 100, 2);
          const minW = pctArea > 8 ? 130 : 80;
          const minH = pctArea > 8 ? 70 : 48;
          return (
            <motion.div
              key={stock.symbol}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.015 }}
              className="rounded-md flex flex-col items-center justify-center cursor-default transition-transform hover:scale-105 hover:z-10"
              style={{
                background: getColor(stock.change_pct),
                color: getTextColor(stock.change_pct),
                flexBasis: `${pctArea}%`,
                flexGrow: 1,
                minWidth: `${minW}px`,
                minHeight: `${minH}px`,
                maxWidth: `${Math.max(pctArea * 2, 14)}%`,
              }}
              title={`${stock.name} | ₹${stock.price.toLocaleString("en-IN")} | ${stock.change_pct >= 0 ? "+" : ""}${stock.change_pct.toFixed(2)}% | MCap: ${formatCap(stock.market_cap)}`}
            >
              <span className="font-bold text-[10px] md:text-xs leading-tight">{stock.symbol}</span>
              <span className="text-[9px] md:text-[10px] font-medium opacity-90">
                {stock.change_pct >= 0 ? "+" : ""}{stock.change_pct.toFixed(2)}%
              </span>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
};

export default StockHeatmap;
