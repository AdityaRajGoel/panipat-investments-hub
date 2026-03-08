import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type HeatmapStock = {
  symbol: string;
  name: string;
  sector: string;
  changePct: number;
  marketCap: number; // in Cr
};

const HEATMAP_DATA: HeatmapStock[] = [
  { symbol: "RELIANCE", name: "Reliance", sector: "Energy", changePct: 1.10, marketCap: 1993000 },
  { symbol: "TCS", name: "TCS", sector: "IT", changePct: -0.47, marketCap: 1412000 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", changePct: 0.74, marketCap: 1278000 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", changePct: 1.74, marketCap: 980000 },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", changePct: 1.28, marketCap: 870000 },
  { symbol: "SBIN", name: "SBI", sector: "Banking", changePct: -0.52, marketCap: 725000 },
  { symbol: "INFY", name: "Infosys", sector: "IT", changePct: -0.57, marketCap: 640000 },
  { symbol: "HINDUNILVR", name: "HUL", sector: "FMCG", changePct: 0.35, marketCap: 595000 },
  { symbol: "ITC", name: "ITC", sector: "FMCG", changePct: 0.73, marketCap: 583000 },
  { symbol: "LT", name: "L&T", sector: "Infrastructure", changePct: 1.34, marketCap: 475000 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", changePct: -0.78, marketCap: 448000 },
  { symbol: "HCLTECH", name: "HCL Tech", sector: "IT", changePct: 0.73, marketCap: 443000 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", changePct: 0.86, marketCap: 429000 },
  { symbol: "MARUTI", name: "Maruti", sector: "Auto", changePct: 1.09, marketCap: 389000 },
  { symbol: "KOTAKBANK", name: "Kotak Bank", sector: "Banking", changePct: -0.64, marketCap: 373000 },
  { symbol: "NTPC", name: "NTPC", sector: "Energy", changePct: 2.05, marketCap: 367000 },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", changePct: 1.88, marketCap: 357000 },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", changePct: 2.04, marketCap: 348000 },
  { symbol: "ADANIENT", name: "Adani Ent", sector: "Conglomerate", changePct: 2.40, marketCap: 328000 },
  { symbol: "TITAN", name: "Titan", sector: "Consumer", changePct: -0.65, marketCap: 316000 },
  { symbol: "POWERGRID", name: "Power Grid", sector: "Energy", changePct: 1.89, marketCap: 292000 },
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", changePct: -1.18, marketCap: 276000 },
  { symbol: "WIPRO", name: "Wipro", sector: "IT", changePct: -0.66, marketCap: 250000 },
  { symbol: "NESTLEIND", name: "Nestle", sector: "FMCG", changePct: 0.53, marketCap: 226000 },
  { symbol: "TATASTEEL", name: "Tata Steel", sector: "Metals", changePct: 2.82, marketCap: 191000 },
];

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

const MarketHeatmapPage = () => {
  const [filter, setFilter] = useState("all");
  const sectors = [...new Set(HEATMAP_DATA.map(s => s.sector))].sort();
  
  const data = filter === "all" ? HEATMAP_DATA : HEATMAP_DATA.filter(s => s.sector === filter);
  const totalCap = data.reduce((sum, s) => sum + s.marketCap, 0);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Market Heatmap | NIFTY 50 Performance" description="Visual heatmap of NIFTY 50 stocks showing daily performance colored by gains/losses, sized by market cap." keywords="NIFTY 50 heatmap, market heatmap India, stock performance visualization" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Market Heatmap</h1>
          <p className="text-muted-foreground">NIFTY 50 stocks — sized by market cap, colored by daily performance</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="w-4 h-3 rounded" style={{ background: "hsl(var(--destructive) / 0.7)" }} /> Loss
            <span className="w-4 h-3 rounded bg-muted" /> Flat
            <span className="w-4 h-3 rounded" style={{ background: "hsl(var(--secondary) / 0.7)" }} /> Gain
          </div>
        </div>

        <Card className="p-3 md:p-4">
          <div className="flex flex-wrap gap-1.5">
            {data.map((stock, i) => {
              const pctArea = Math.max((stock.marketCap / totalCap) * 100, 3);
              const minW = pctArea > 8 ? 140 : 90;
              const minH = pctArea > 8 ? 80 : 56;
              return (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.02 }}
                  className="rounded-lg flex flex-col items-center justify-center cursor-pointer transition-transform hover:scale-105 hover:z-10 relative"
                  style={{
                    background: getColor(stock.changePct),
                    color: getTextColor(stock.changePct),
                    flexBasis: `${pctArea}%`,
                    flexGrow: 1,
                    minWidth: `${minW}px`,
                    minHeight: `${minH}px`,
                    maxWidth: `${Math.max(pctArea * 2, 15)}%`,
                  }}
                  title={`${stock.name} | ${stock.changePct >= 0 ? "+" : ""}${stock.changePct}% | MCap: ₹${(stock.marketCap / 100000).toFixed(1)}L Cr`}
                >
                  <span className="font-bold text-xs md:text-sm leading-tight">{stock.symbol}</span>
                  <span className="text-[10px] md:text-xs font-medium opacity-90">
                    {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
                  </span>
                </motion.div>
              );
            })}
          </div>
        </Card>

        <p className="text-xs text-muted-foreground mt-4 text-center">Block size represents relative market cap. Colors indicate daily % change. Data is indicative.</p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MarketHeatmapPage;
