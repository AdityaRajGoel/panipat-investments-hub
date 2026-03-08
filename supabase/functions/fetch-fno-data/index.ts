import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYMBOL_MAP: Record<string, string> = {
  NIFTY: "^NSEI",
  BANKNIFTY: "^NSEBANK",
  FINNIFTY: "NIFTY_FIN_SERVICE.NS",
};

interface YahooOption {
  strike: number;
  lastPrice: number;
  change: number;
  percentChange: number;
  volume: number;
  openInterest: number;
  impliedVolatility: number;
  inTheMoney: boolean;
}

interface OptionRow {
  strike: number;
  callOI: number;
  callChange: number;
  callLTP: number;
  callIV: number;
  callVolume: number;
  putOI: number;
  putChange: number;
  putLTP: number;
  putIV: number;
  putVolume: number;
}

async function fetchOptionsChain(symbol: string, expiry?: number) {
  const yahooSymbol = SYMBOL_MAP[symbol] || "^NSEI";
  let url = `https://query1.finance.yahoo.com/v7/finance/options/${yahooSymbol}`;
  if (expiry) url += `?date=${expiry}`;

  const res = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  });

  if (!res.ok) {
    throw new Error(`Yahoo Finance returned ${res.status}`);
  }

  const json = await res.json();
  const result = json?.optionChain?.result?.[0];
  if (!result) throw new Error("No options data returned");

  return result;
}

function mergeChain(calls: YahooOption[], puts: YahooOption[]): OptionRow[] {
  const strikeMap = new Map<number, OptionRow>();

  for (const c of calls) {
    strikeMap.set(c.strike, {
      strike: c.strike,
      callOI: c.openInterest || 0,
      callChange: c.change || 0,
      callLTP: c.lastPrice || 0,
      callIV: (c.impliedVolatility || 0) * 100,
      callVolume: c.volume || 0,
      putOI: 0,
      putChange: 0,
      putLTP: 0,
      putIV: 0,
      putVolume: 0,
    });
  }

  for (const p of puts) {
    const existing = strikeMap.get(p.strike);
    if (existing) {
      existing.putOI = p.openInterest || 0;
      existing.putChange = p.change || 0;
      existing.putLTP = p.lastPrice || 0;
      existing.putIV = (p.impliedVolatility || 0) * 100;
      existing.putVolume = p.volume || 0;
    } else {
      strikeMap.set(p.strike, {
        strike: p.strike,
        callOI: 0,
        callChange: 0,
        callLTP: 0,
        callIV: 0,
        callVolume: 0,
        putOI: p.openInterest || 0,
        putChange: p.change || 0,
        putLTP: p.lastPrice || 0,
        putIV: (p.impliedVolatility || 0) * 100,
        putVolume: p.volume || 0,
      });
    }
  }

  return Array.from(strikeMap.values()).sort((a, b) => a.strike - b.strike);
}

function calculateMaxPain(chain: OptionRow[]): number {
  let minPain = Infinity;
  let maxPainStrike = chain[0]?.strike ?? 0;

  for (const row of chain) {
    let totalPain = 0;
    for (const other of chain) {
      if (row.strike < other.strike)
        totalPain += other.putOI * (other.strike - row.strike);
      if (row.strike > other.strike)
        totalPain += other.callOI * (row.strike - other.strike);
    }
    if (totalPain < minPain) {
      minPain = totalPain;
      maxPainStrike = row.strike;
    }
  }
  return maxPainStrike;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const symbol = (body.symbol || "NIFTY").toUpperCase();
    const expiryTimestamp = body.expiry || undefined;

    const result = await fetchOptionsChain(symbol, expiryTimestamp);

    const spot = result.quote?.regularMarketPrice || 0;
    const calls: YahooOption[] = result.options?.[0]?.calls || [];
    const puts: YahooOption[] = result.options?.[0]?.puts || [];

    // Available expiries as unix timestamps
    const expirationDates: number[] = result.expirationDates || [];

    // Convert expiry timestamps to readable dates
    const expiries = expirationDates.map((ts: number) => ({
      timestamp: ts,
      label: new Date(ts * 1000).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
    }));

    const chain = mergeChain(calls, puts);

    // Filter to strikes near the money (±15 strikes around ATM)
    const atmIndex = chain.findIndex(
      (r) => r.strike >= spot
    );
    const startIdx = Math.max(0, atmIndex - 15);
    const endIdx = Math.min(chain.length, atmIndex + 16);
    const filteredChain = chain.slice(startIdx, endIdx);

    const maxPain = calculateMaxPain(filteredChain);

    const totalCallOI = filteredChain.reduce((s, r) => s + r.callOI, 0);
    const totalPutOI = filteredChain.reduce((s, r) => s + r.putOI, 0);
    const pcr = totalCallOI > 0 ? totalPutOI / totalCallOI : 0;

    return new Response(
      JSON.stringify({
        success: true,
        symbol,
        spot,
        chain: filteredChain,
        expiries,
        currentExpiry: expirationDates[0] || null,
        maxPain,
        pcr,
        totalCallOI,
        totalPutOI,
        fetchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("F&O fetch error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to fetch F&O data",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
