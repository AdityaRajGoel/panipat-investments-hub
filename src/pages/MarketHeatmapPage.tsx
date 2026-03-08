import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import WhatsAppButton from "@/components/WhatsAppButton";
import StockHeatmap from "@/components/StockHeatmap";
import { useScreenerStocks } from "@/hooks/useScreenerStocks";
import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";

const MarketHeatmapPage = () => {
  const { stocks, loading } = useScreenerStocks();
  const [filter, setFilter] = useState("all");

  const sectors = useMemo(() => [...new Set(stocks.map(s => s.sector))].sort(), [stocks]);
  const filtered = useMemo(() => filter === "all" ? stocks : stocks.filter(s => s.sector === filter), [stocks, filter]);

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Market Heatmap | Live NSE Stock Performance" description="Visual heatmap of NSE stocks showing live daily performance colored by gains/losses, sized by market cap." keywords="NSE heatmap, market heatmap India, stock performance visualization, live heatmap" />
      <Header />
      <main className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-2">Market Heatmap</h1>
          <p className="text-muted-foreground">Live NSE stocks — sized by market cap, colored by daily performance</p>
        </motion.div>

        <div className="flex items-center gap-4 mb-6">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Sectors</SelectItem>
              {sectors.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <Card className="p-4">
            <Skeleton className="h-64 w-full" />
          </Card>
        ) : (
          <StockHeatmap stocks={filtered} maxItems={100} />
        )}

        <p className="text-xs text-muted-foreground mt-4 text-center">
          Block size represents relative market cap. Colors indicate daily % change. Live data from Yahoo Finance.
        </p>
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default MarketHeatmapPage;
