import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export type LiveIndex = {
  key: string;
  name: string;
  price: string;
  change: string;
  changeValue?: string;
  up: boolean;
  open?: string;
  high?: string;
  low?: string;
  prevClose?: string;
  volume?: string;
};

export type LiveStock = {
  name: string;
  price: string;
  change: string;
  up: boolean;
  unit?: string;
  volume?: string;
  high?: string;
  low?: string;
  changePercent?: number;
};

export type MarketOverviewData = {
  gainers: LiveStock[];
  losers: LiveStock[];
  mostActive: LiveStock[];
  advances: number;
  declines: number;
  unchanged: number;
};

type LiveMarketContextType = {
  indices: LiveIndex[];
  stocks: LiveStock[];
  commodities: LiveStock[];
  marketOverview: MarketOverviewData | null;
  fetchedAt: string | null;
  loading: boolean;
  refresh: () => void;
};

const LiveMarketContext = createContext<LiveMarketContextType>({
  indices: [],
  stocks: [],
  commodities: [],
  marketOverview: null,
  fetchedAt: null,
  loading: true,
  refresh: () => {},
});

export const useLiveMarket = () => useContext(LiveMarketContext);

// Fallback data
const fallbackIndices: LiveIndex[] = [
  { key: "NIFTY", name: "NIFTY 50", price: "22,147.00", change: "+0.85%", up: true, open: "21,960.50", high: "22,189.30", low: "21,912.45", prevClose: "21,960.15" },
  { key: "SENSEX", name: "SENSEX", price: "72,831.94", change: "+0.72%", up: true, open: "72,280.60", high: "72,950.40", low: "72,180.20", prevClose: "72,310.80" },
  { key: "BANKNIFTY", name: "BANK NIFTY", price: "46,893.65", change: "-0.32%", up: false, open: "47,120.30", high: "47,245.80", low: "46,780.15", prevClose: "47,044.05" },
  { key: "NIFTYIT", name: "NIFTY IT", price: "34,521.20", change: "+0.41%", up: true, open: "34,380.00", high: "34,650.80", low: "34,280.10", prevClose: "34,380.20" },
  { key: "NIFTYFIN", name: "NIFTY FIN", price: "21,456.80", change: "+0.62%", up: true, open: "21,320.40", high: "21,510.60", low: "21,280.15", prevClose: "21,324.50" },
];

const fallbackStocks: LiveStock[] = [
  { name: "NIFTY 50", price: "22,147.00", change: "+0.85%", up: true },
  { name: "SENSEX", price: "72,831.94", change: "+0.72%", up: true },
  { name: "BANK NIFTY", price: "46,893.65", change: "-0.32%", up: false },
  { name: "RELIANCE", price: "2,847.50", change: "+2.30%", up: true },
  { name: "TCS", price: "3,456.80", change: "+1.50%", up: true },
  { name: "HDFC BANK", price: "1,678.25", change: "-0.80%", up: false },
  { name: "INFOSYS", price: "1,523.40", change: "+3.10%", up: true },
  { name: "ICICI BANK", price: "987.65", change: "+0.90%", up: true },
  { name: "ITC", price: "435.20", change: "+1.15%", up: true },
  { name: "BAJAJ FIN", price: "6,892.30", change: "-1.20%", up: false },
  { name: "TATA MOTORS", price: "785.40", change: "+1.45%", up: true },
  { name: "SBI", price: "625.80", change: "+0.65%", up: true },
  { name: "BHARTI AIRTEL", price: "1,245.60", change: "+2.10%", up: true },
  { name: "WIPRO", price: "478.90", change: "-0.55%", up: false },
  { name: "HCL TECH", price: "1,567.30", change: "+1.80%", up: true },
];

const fallbackCommodities: LiveStock[] = [
  { name: "GOLD", price: "2,345.60", change: "+0.45%", up: true, unit: "USD/oz" },
  { name: "SILVER", price: "29.82", change: "+1.20%", up: true, unit: "USD/oz" },
  { name: "CRUDE OIL", price: "78.45", change: "-0.65%", up: false, unit: "USD/bbl" },
  { name: "NAT GAS", price: "2.34", change: "-1.10%", up: false, unit: "USD/MMBtu" },
  { name: "COPPER", price: "4.52", change: "+0.80%", up: true, unit: "USD/lb" },
  { name: "USD/INR", price: "83.42", change: "+0.05%", up: true, unit: "" },
  { name: "EUR/INR", price: "90.15", change: "-0.12%", up: false, unit: "" },
  { name: "GBP/INR", price: "105.78", change: "+0.08%", up: true, unit: "" },
  { name: "INDIA VIX", price: "13.45", change: "-2.10%", up: false, unit: "" },
];

export const LiveMarketProvider = ({ children }: { children: ReactNode }) => {
  const [indices, setIndices] = useState<LiveIndex[]>(fallbackIndices);
  const [stocks, setStocks] = useState<LiveStock[]>(fallbackStocks);
  const [commodities, setCommodities] = useState<LiveStock[]>(fallbackCommodities);
  const [marketOverview, setMarketOverview] = useState<MarketOverviewData | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const { data, error } = await supabase.functions.invoke('fetch-stock-prices');
      if (!error && data?.success) {
        if (data.indices?.length > 0) setIndices(data.indices);
        if (data.data?.length > 0) setStocks(data.data);
        if (data.commodities?.length > 0) setCommodities(data.commodities);
        if (data.marketOverview) setMarketOverview(data.marketOverview);
        if (data.fetchedAt) setFetchedAt(data.fetchedAt);
      }
    } catch (e) {
      console.log('Using fallback market data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3 * 60 * 1000); // 3 min refresh
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <LiveMarketContext.Provider value={{ indices, stocks, commodities, marketOverview, fetchedAt, loading, refresh: fetchData }}>
      {children}
    </LiveMarketContext.Provider>
  );
};
