import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export type ScreenerStock = {
  symbol: string;
  name: string;
  sector: string;
  price: number;
  change: number;
  change_pct: number;
  market_cap: number;
  pe: number;
  high_52: number;
  low_52: number;
  volume: number;
  day_high: number;
  day_low: number;
  open_price: number;
  prev_close: number;
  updated_at: string;
};

export function useScreenerStocks() {
  const [stocks, setStocks] = useState<ScreenerStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStocks = useCallback(async (refresh = false) => {
    try {
      setError(null);
      const { data, error: fnError } = await supabase.functions.invoke("fetch-screener-data", {
        body: { refresh },
      });

      if (fnError) throw fnError;

      if (data?.success && data.stocks?.length > 0) {
        setStocks(data.stocks.map((s: any) => ({
          symbol: s.symbol,
          name: s.name,
          sector: s.sector || "General",
          price: Number(s.price) || 0,
          change: Number(s.change) || 0,
          change_pct: Number(s.change_pct) || 0,
          market_cap: Number(s.market_cap) || 0,
          pe: Number(s.pe) || 0,
          high_52: Number(s.high_52) || 0,
          low_52: Number(s.low_52) || 0,
          volume: Number(s.volume) || 0,
          day_high: Number(s.day_high) || 0,
          day_low: Number(s.day_low) || 0,
          open_price: Number(s.open_price) || 0,
          prev_close: Number(s.prev_close) || 0,
          updated_at: s.updated_at,
        })));
        setUpdatedAt(data.updated_at);
      }
    } catch (e: any) {
      console.error("Failed to fetch screener stocks:", e);
      setError(e.message || "Failed to load stock data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(() => fetchStocks(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  return { stocks, loading, updatedAt, error, refresh: () => fetchStocks(true) };
}
