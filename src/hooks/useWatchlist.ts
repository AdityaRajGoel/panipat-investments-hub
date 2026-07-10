import { useState, useCallback } from "react";

const STORAGE_KEY = "panipat_watchlist";

export interface WatchlistItem {
  symbol: string;
  name: string;
  addedAt: number;
}

function loadWatchlist(): WatchlistItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveWatchlist(list: WatchlistItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch { /* localStorage unavailable */ }
}

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>(loadWatchlist);

  const addToWatchlist = useCallback((symbol: string, name: string) => {
    setWatchlist((prev) => {
      if (prev.find((w) => w.symbol === symbol)) return prev;
      const next = [...prev, { symbol, name, addedAt: Date.now() }];
      saveWatchlist(next);
      return next;
    });
  }, []);

  const removeFromWatchlist = useCallback((symbol: string) => {
    setWatchlist((prev) => {
      const next = prev.filter((w) => w.symbol !== symbol);
      saveWatchlist(next);
      return next;
    });
  }, []);

  const isInWatchlist = useCallback(
    (symbol: string) => watchlist.some((w) => w.symbol === symbol),
    [watchlist]
  );

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}
