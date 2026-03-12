import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const NSE_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Referer": "https://www.nseindia.com/option-chain",
  "Connection": "keep-alive",
};

// Step 1: Get NSE session cookies by hitting the main page
async function getNSECookies(): Promise<string> {
  const res = await fetch("https://www.nseindia.com/option-chain", {
    headers: NSE_HEADERS,
    redirect: "follow",
  });
  
  const setCookies = res.headers.getSetCookie?.() || [];
  const cookies = setCookies.map(c => c.split(";")[0]).join("; ");
  
  // Also consume the body to properly close the connection
  await res.text();
  
  if (!cookies) {
    throw new Error("Failed to get NSE session cookies");
  }
  return cookies;
}

// Step 2: Fetch option chain from NSE API
async function fetchNSEOptionChain(symbol: string, cookies: string) {
  const endpoint = symbol === "NIFTY" || symbol === "BANKNIFTY" || symbol === "FINNIFTY" || symbol === "MIDCPNIFTY"
    ? `https://www.nseindia.com/api/option-chain-indices?symbol=${symbol}`
    : `https://www.nseindia.com/api/option-chain-equities?symbol=${symbol}`;
  
  const res = await fetch(endpoint, {
    headers: {
      ...NSE_HEADERS,
      "Cookie": cookies,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`NSE API returned ${res.status}: ${text.substring(0, 200)}`);
  }

  return await res.json();
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

function processNSEData(nseData: any, selectedExpiry?: string) {
  const records = nseData?.records;
  const filtered = nseData?.filtered;
  
  if (!records?.data?.length) {
    throw new Error("No options data available from NSE");
  }

  // Get spot price from underlying value
  const spot = records.underlyingValue || filtered?.data?.[0]?.PE?.underlyingValue || filtered?.data?.[0]?.CE?.underlyingValue || 0;
  
  // Get all available expiry dates
  const expiryDates: string[] = records.expiryDates || [];
  const expiries = expiryDates.map((d: string) => ({
    timestamp: d, // NSE uses date strings like "27-Mar-2025"
    label: d,
  }));

  // Use selected expiry or first available
  const activeExpiry = selectedExpiry || expiryDates[0];
  
  // Filter data for the selected expiry
  const dataForExpiry = records.data.filter((row: any) => row.expiryDate === activeExpiry);
  
  // Build option chain
  const strikeMap = new Map<number, OptionRow>();
  
  for (const row of dataForExpiry) {
    const strike = row.strikePrice;
    
    if (!strikeMap.has(strike)) {
      strikeMap.set(strike, {
        strike,
        callOI: 0, callChange: 0, callLTP: 0, callIV: 0, callVolume: 0,
        putOI: 0, putChange: 0, putLTP: 0, putIV: 0, putVolume: 0,
      });
    }
    
    const entry = strikeMap.get(strike)!;
    
    if (row.CE) {
      entry.callOI = row.CE.openInterest || 0;
      entry.callChange = row.CE.changeinOpenInterest || 0;
      entry.callLTP = row.CE.lastPrice || 0;
      entry.callIV = row.CE.impliedVolatility || 0;
      entry.callVolume = row.CE.totalTradedVolume || 0;
    }
    
    if (row.PE) {
      entry.putOI = row.PE.openInterest || 0;
      entry.putChange = row.PE.changeinOpenInterest || 0;
      entry.putLTP = row.PE.lastPrice || 0;
      entry.putIV = row.PE.impliedVolatility || 0;
      entry.putVolume = row.PE.totalTradedVolume || 0;
    }
  }

  const chain = Array.from(strikeMap.values()).sort((a, b) => a.strike - b.strike);
  
  // Filter to ±15 strikes around ATM
  const atmIndex = chain.findIndex(r => r.strike >= spot);
  const startIdx = Math.max(0, atmIndex - 15);
  const endIdx = Math.min(chain.length, atmIndex + 16);
  const filteredChain = chain.slice(startIdx, endIdx);

  // Calculate max pain
  const maxPain = calculateMaxPain(filteredChain);
  
  // Calculate totals from filtered data
  const totalCallOI = filteredChain.reduce((s, r) => s + r.callOI, 0);
  const totalPutOI = filteredChain.reduce((s, r) => s + r.putOI, 0);
  const pcr = totalCallOI > 0 ? totalPutOI / totalCallOI : 0;

  return {
    spot,
    chain: filteredChain,
    expiries,
    currentExpiry: activeExpiry,
    maxPain,
    pcr,
    totalCallOI,
    totalPutOI,
  };
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
    const selectedExpiry = body.expiry || undefined;

    // Get NSE session cookies first
    const cookies = await getNSECookies();
    
    // Fetch option chain data
    const nseData = await fetchNSEOptionChain(symbol, cookies);
    
    // Process and format the data
    const processed = processNSEData(nseData, selectedExpiry);

    return new Response(
      JSON.stringify({
        success: true,
        symbol,
        ...processed,
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
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});