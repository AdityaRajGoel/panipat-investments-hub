import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import { motion } from "framer-motion";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, ArrowUp, ArrowDown } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TrackerStock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  high52: number;
  low52: number;
  changePct: number;
};

const NEAR_HIGH: TrackerStock[] = [
  { symbol: "NTPC", name: "NTPC Ltd", sector: "Energy", price: 378.90, high52: 418, low52: 252, changePct: 2.05 },
  { symbol: "BHARTIARTL", name: "Bharti Airtel", sector: "Telecom", price: 1687.40, high52: 1779, low52: 1130, changePct: 1.74 },
  { symbol: "POWERGRID", name: "Power Grid Corp", sector: "Energy", price: 312.40, high52: 358, low52: 215, changePct: 1.89 },
  { symbol: "RELIANCE", name: "Reliance Industries", sector: "Energy", price: 2945.30, high52: 3217, low52: 2220, changePct: 1.10 },
  { symbol: "SUNPHARMA", name: "Sun Pharma", sector: "Pharma", price: 1789.40, high52: 1960, low52: 1218, changePct: 0.86 },
  { symbol: "HDFCBANK", name: "HDFC Bank", sector: "Banking", price: 1678.90, high52: 1880, low52: 1363, changePct: 0.74 },
  { symbol: "ICICIBANK", name: "ICICI Bank", sector: "Banking", price: 1234.50, high52: 1362, low52: 898, changePct: 1.28 },
  { symbol: "TATAMOTORS", name: "Tata Motors", sector: "Auto", price: 945.60, high52: 1179, low52: 615, changePct: 2.04 },
  { symbol: "LT", name: "Larsen & Toubro", sector: "Infrastructure", price: 3456.20, high52: 3925, low52: 2880, changePct: 1.34 },
  { symbol: "AXISBANK", name: "Axis Bank", sector: "Banking", price: 1156.40, high52: 1340, low52: 956, changePct: 1.88 },
];

const NEAR_LOW: TrackerStock[] = [
  { symbol: "ASIANPAINT", name: "Asian Paints", sector: "Consumer", price: 2876.50, high52: 3395, low52: 2274, changePct: -1.18 },
  { symbol: "BAJFINANCE", name: "Bajaj Finance", sector: "NBFC", price: 7234.50, high52: 8192, low52: 5875, changePct: -0.78 },
  { symbol: "WIPRO", name: "Wipro Ltd", sector: "IT", price: 478.90, high52: 576, low52: 381, changePct: -0.66 },
  { symbol: "TITAN", name: "Titan Company", sector: "Consumer", price: 3567.80, high52: 3887, low52: 2877, changePct: -0.65 },
  { symbol: "KOTAKBANK", name: "Kotak Mahindra Bank", sector: "Banking", price: 1876.90, high52: 2065, low52: 1644, changePct: -0.64 },
  { symbol: "TCS", name: "Tata Consultancy", sector: "IT", price: 3872.60, high52: 4243, low52: 3311, changePct: -0.47 },
  { symbol: "INFY", name: "Infosys", sector: "IT", price: 1542.75, high52: 1953, low52: 1358, changePct: -0.57 },
  { symbol: "SBIN", name: "State Bank of India", sector: "Banking", price: 812.35, high52: 912, low52: 600, changePct: -0.52 },
];

const StockRow = ({ stock, type }: { stock: TrackerStock; type: "high" | "low" }) => {
  const range = stock.high52 - stock.low52;
  const pctFromHigh = ((stock.high52 - stock.price) / stock.high52) * 100;
  const pctFromLow = ((stock.price - stock.low52) / stock.low52) * 100;
  const posInRange = ((stock.price - stock.low52) / range) * 100;

  return (
    <Card className="p-4 hover:bg-muted/30 transition-colors">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="font-bold text-foreground">{stock.symbol}</span>
          <span className="text-xs text-muted-foreground ml-2">{stock.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs">{stock.sector}</Badge>
          <span className={`text-sm font-medium ${stock.changePct >= 0 ? "text-secondary" : "text-destructive"}`}>
            {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(2)}%
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3 text-sm">
        <div className="text-muted-foreground min-w-[70px]">
          <div className="text-xs">52W Low</div>
          <div className="font-mono font-medium text-foreground">₹{stock.low52}</div>
        </div>
        <div className="flex-1">
          <div className="relative h-2 bg-muted rounded-full">
            <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-destructive via-brand-gold to-secondary rounded-full" style={{ width: "100%" }} />
            <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-card border-2 border-foreground rounded-full shadow" style={{ left: `${posInRange}%`, transform: `translate(-50%, -50%)` }} />
          </div>
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>{pctFromLow.toFixed(1)}% from low</span>
            <span className="font-semibold text-foreground">₹{stock.price.toLocaleString("en-IN")}</span>
            <span>{pctFromHigh.toFixed(1)}% from high</span>
          </div>
        </div>
        <div className="text-right min-w-[70px]">
          <div className="text-xs text-muted-foreground">52W High</div>
          <div className="font-mono font-medium text-foreground">₹{stock.high52}</div>
        </div>
      </div>
    </Card>
  );
};

const Week52TrackerPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="52-Week High Low Tracker | NSE Stocks" description="Track stocks near their 52-week highs and lows. Identify breakout and reversal opportunities." keywords="52 week high stocks, 52 week low stocks, NSE stock tracker, breakout stocks" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">52-Week High / Low Tracker</h1>
          <p className="text-muted-foreground">Stocks near their yearly extremes — spot breakout and reversal candidates</p>
        </motion.div>

        <Tabs defaultValue="high" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="high" className="gap-1.5">
              <ArrowUp className="w-4 h-4" /> Near 52W High
            </TabsTrigger>
            <TabsTrigger value="low" className="gap-1.5">
              <ArrowDown className="w-4 h-4" /> Near 52W Low
            </TabsTrigger>
          </TabsList>

          <TabsContent value="high">
            <div className="grid gap-3">
              {NEAR_HIGH.map((stock, i) => (
                <motion.div key={stock.symbol} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <StockRow stock={stock} type="high" />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="low">
            <div className="grid gap-3">
              {NEAR_LOW.map((stock, i) => (
                <motion.div key={stock.symbol} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
                  <StockRow stock={stock} type="low" />
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <p className="text-xs text-muted-foreground mt-6 text-center">Data shown is for demonstration purposes. Prices are indicative and may not reflect real-time values.</p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Week52TrackerPage;
