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

export type SectorData = {
  name: string;
  change: string;
  changePercent: number;
  up: boolean;
  weight: number;
};

export type GlobalMarket = {
  name: string;
  price: string;
  change: string;
  up: boolean;
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
  globalMarkets: GlobalMarket[];
  sectors: SectorData[];
  vix: LiveStock | null;
  marketOverview: MarketOverviewData | null;
  fetchedAt: string | null;
  loading: boolean;
  refresh: () => void;
};

const LiveMarketContext = createContext<LiveMarketContextType>({
  indices: [],
  stocks: [],
  commodities: [],
  globalMarkets: [],
  sectors: [],
  vix: null,
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
  { key: "NIFTYIT", name: "NIFTY IT", price: "34,521.20", change: "+0.41%", up: true },
  { key: "NIFTYFIN", name: "NIFTY FIN", price: "21,456.80", change: "+0.62%", up: true },
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

const fallbackGlobalMarkets: GlobalMarket[] = [
  { name: "S&P 500", price: "5,234.18", change: "+0.52%", up: true },
  { name: "NASDAQ", price: "16,742.39", change: "+0.75%", up: true },
  { name: "DOW JONES", price: "39,512.84", change: "+0.34%", up: true },
  { name: "HANG SENG", price: "17,284.54", change: "-0.92%", up: false },
  { name: "NIKKEI 225", price: "39,098.68", change: "+1.12%", up: true },
  { name: "FTSE 100", price: "8,164.12", change: "-0.18%", up: false },
];

const fallbackSectors: SectorData[] = [
  { name: "IT", change: "+2.4%", changePercent: 2.4, up: true, weight: 18 },
  { name: "Banks", change: "-0.8%", changePercent: -0.8, up: false, weight: 25 },
  { name: "Pharma", change: "+1.6%", changePercent: 1.6, up: true, weight: 10 },
  { name: "Auto", change: "+3.1%", changePercent: 3.1, up: true, weight: 12 },
  { name: "Energy", change: "-1.2%", changePercent: -1.2, up: false, weight: 15 },
  { name: "FMCG", change: "+0.5%", changePercent: 0.5, up: true, weight: 8 },
  { name: "Realty", change: "+4.2%", changePercent: 4.2, up: true, weight: 5 },
  { name: "Metal", change: "-0.3%", changePercent: -0.3, up: false, weight: 7 },
];

export const LiveMarketProvider = ({ children }: { children: ReactNode }) => {
  const [indices, setIndices] = useState<LiveIndex[]>(fallbackIndices);
  const [stocks, setStocks] = useState<LiveStock[]>(fallbackStocks);
  const [commodities, setCommodities] = useState<LiveStock[]>(fallbackCommodities);
  const [globalMarkets, setGlobalMarkets] = useState<GlobalMarket[]>(fallbackGlobalMarkets);
  const [sectors, setSectors] = useState<SectorData[]>(fallbackSectors);
  const [vix, setVix] = useState<LiveStock | null>(null);
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
        if (data.globalMarkets?.length > 0) setGlobalMarkets(data.globalMarkets);
        if (data.sectors?.length > 0) setSectors(data.sectors);
        if (data.vix) setVix(data.vix);
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
    const interval = setInterval(fetchData, 3 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  return (
    <LiveMarketContext.Provider value={{ indices, stocks, commodities, globalMarkets, sectors, vix, marketOverview, fetchedAt, loading, refresh: fetchData }}>
      {children}
    </LiveMarketContext.Provider>
  );
};
