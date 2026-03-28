import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovableSupabase } from "@/integrations/supabase/lovable-client";

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
  const [refreshing, setRefreshing] = useState(false);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mapStock = useCallback((s: any): ScreenerStock => ({
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
  }), []);

  const fetchStocks = useCallback(async (refresh = false) => {
    try {
      setError(null);

      // ─── Phase 1: Load cached data from Supabase DB instantly ───────────────
      // This is a direct DB query (no Yahoo Finance), typically resolves in <200ms.
      // It lets the table render immediately with the last-known prices.
      if (!refresh) {
        const { data: cached } = await supabase
          .from("screener_stocks")
          .select("*")
          .order("market_cap", { ascending: false });

        if (cached && cached.length > 0) {
          setStocks(cached.map(mapStock));
          setUpdatedAt(cached[0]?.updated_at || null);
          setLoading(false); // ← Show table NOW, before Yahoo refresh
        }
      }

      // ─── Phase 2: Refresh prices via edge function (Yahoo Finance) ───────────
      // Runs in background — edge function checks if cache is fresh (<5 min)
      // and only fetches from Yahoo if stale. This keeps prices up-to-date.
      setRefreshing(true);
      const { data, error: fnError } = await lovableSupabase.functions.invoke("fetch-screener-data", {
        body: { refresh },
      });

      if (fnError) throw fnError;

      if (data?.success && data.stocks?.length > 0) {
        setStocks(data.stocks.map(mapStock));
        setUpdatedAt(data.updated_at);
      }
    } catch (e: any) {
      console.error("Failed to fetch screener stocks:", e);
      setError(e.message || "Failed to load stock data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [mapStock]);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(() => {
      if (!document.hidden) fetchStocks();
    }, 5 * 60 * 1000);

    const handleVisibility = () => {
      if (!document.hidden) fetchStocks();
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [fetchStocks]);

  return { stocks, loading, refreshing, updatedAt, error, refresh: () => fetchStocks(true) };
}
