const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Index symbols
const INDEX_SYMBOLS = [
  { symbol: "^NSEI", name: "NIFTY 50", key: "NIFTY" },
  { symbol: "^BSESN", name: "SENSEX", key: "SENSEX" },
  { symbol: "^NSEBANK", name: "BANK NIFTY", key: "BANKNIFTY" },
  { symbol: "^CNXIT", name: "NIFTY IT", key: "NIFTYIT" },
  { symbol: "^CNXFIN", name: "NIFTY FIN", key: "NIFTYFIN" },
];

// Ticker stocks
const STOCK_SYMBOLS = [
  { symbol: "RELIANCE.NS", name: "RELIANCE" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK" },
  { symbol: "INFY.NS", name: "INFOSYS" },
  { symbol: "ICICIBANK.NS", name: "ICICI BANK" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "BAJFINANCE.NS", name: "BAJAJ FIN" },
  { symbol: "TATAMOTORS.NS", name: "TATA MOTORS" },
  { symbol: "SBIN.NS", name: "SBI" },
  { symbol: "BHARTIARTL.NS", name: "BHARTI AIRTEL" },
  { symbol: "WIPRO.NS", name: "WIPRO" },
  { symbol: "HCLTECH.NS", name: "HCL TECH" },
  { symbol: "TATASTEEL.NS", name: "TATA STEEL" },
  { symbol: "ADANIENT.NS", name: "ADANI ENT" },
  { symbol: "LT.NS", name: "L&T" },
];

// Top gainers/losers candidates (wider set)
const MARKET_SYMBOLS = [
  { symbol: "TATAPOWER.NS", name: "TATA POWER" },
  { symbol: "ADANIGREEN.NS", name: "ADANI GREEN" },
  { symbol: "ZOMATO.NS", name: "ZOMATO" },
  { symbol: "BAJFINANCE.NS", name: "BAJAJ FIN" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK" },
  { symbol: "WIPRO.NS", name: "WIPRO" },
  { symbol: "COALINDIA.NS", name: "COAL INDIA" },
  { symbol: "HINDALCO.NS", name: "HINDALCO" },
  { symbol: "TECHM.NS", name: "TECH MAHI" },
  { symbol: "TATASTEEL.NS", name: "TATA STEEL" },
  { symbol: "SBIN.NS", name: "SBIN" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "TATAMOTORS.NS", name: "TATAMOTORS" },
  { symbol: "ICICIBANK.NS", name: "ICICIBANK" },
  { symbol: "MARUTI.NS", name: "MARUTI" },
  { symbol: "RELIANCE.NS", name: "RELIANCE" },
  { symbol: "HDFCLIFE.NS", name: "HDFCLIFE" },
  { symbol: "INFY.NS", name: "INFOSYS" },
  { symbol: "BHARTIARTL.NS", name: "BHARTI AIRTEL" },
  { symbol: "LT.NS", name: "L&T" },
];

const COMMODITY_SYMBOLS = [
  { symbol: "GC=F", name: "GOLD", unit: "USD/oz" },
  { symbol: "SI=F", name: "SILVER", unit: "USD/oz" },
  { symbol: "CL=F", name: "CRUDE OIL", unit: "USD/bbl" },
  { symbol: "NG=F", name: "NAT GAS", unit: "USD/MMBtu" },
  { symbol: "HG=F", name: "COPPER", unit: "USD/lb" },
  { symbol: "ALI=F", name: "ALUMINIUM", unit: "USD/lb" },
  { symbol: "ZW=F", name: "WHEAT", unit: "USD/bu" },
  { symbol: "USDINR=X", name: "USD/INR", unit: "" },
  { symbol: "EURINR=X", name: "EUR/INR", unit: "" },
  { symbol: "GBPINR=X", name: "GBP/INR", unit: "" },
  { symbol: "^INDIAVIX", name: "INDIA VIX", unit: "" },
];

interface QuoteResult {
  price: number;
  change: number;
  changePercent: number;
  open?: number;
  high?: number;
  low?: number;
  prevClose?: number;
  volume?: number;
}

async function fetchYahooQuote(symbol: string): Promise<QuoteResult | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;

    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = price - prevClose;
    const changePercent = prevClose ? (change / prevClose) * 100 : 0;

    const indicators = result.indicators?.quote?.[0];
    const lastIdx = indicators?.close?.length ? indicators.close.length - 1 : 0;

    return {
      price,
      change,
      changePercent,
      open: indicators?.open?.[lastIdx] || meta.regularMarketOpen || undefined,
      high: indicators?.high?.[lastIdx] || meta.regularMarketDayHigh || undefined,
      low: indicators?.low?.[lastIdx] || meta.regularMarketDayLow || undefined,
      prevClose,
      volume: indicators?.volume?.[lastIdx] || meta.regularMarketVolume || undefined,
    };
  } catch {
    return null;
  }
}

function formatPrice(price: number, isINR = true): string {
  if (isINR) return price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function formatVolume(vol?: number): string {
  if (!vol) return "-";
  if (vol >= 10000000) return `${(vol / 10000000).toFixed(1)}Cr`;
  if (vol >= 100000) return `${(vol / 100000).toFixed(1)}L`;
  if (vol >= 1000) return `${(vol / 1000).toFixed(1)}K`;
  return vol.toString();
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Fetch all in parallel
    const [indexResults, stockResults, marketResults, commodityResults] = await Promise.all([
      // Indices
      Promise.all(INDEX_SYMBOLS.map(async (idx) => {
        const q = await fetchYahooQuote(idx.symbol);
        if (!q) return null;
        return {
          key: idx.key,
          name: idx.name,
          price: formatPrice(q.price),
          change: `${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}%`,
          changeValue: `${q.change >= 0 ? '+' : ''}${formatPrice(Math.abs(q.change))}`,
          up: q.changePercent >= 0,
          open: q.open ? formatPrice(q.open) : undefined,
          high: q.high ? formatPrice(q.high) : undefined,
          low: q.low ? formatPrice(q.low) : undefined,
          prevClose: q.prevClose ? formatPrice(q.prevClose) : undefined,
          volume: formatVolume(q.volume),
        };
      })),
      // Ticker stocks
      Promise.all(STOCK_SYMBOLS.map(async (stock) => {
        const q = await fetchYahooQuote(stock.symbol);
        if (!q) return null;
        return {
          name: stock.name,
          price: formatPrice(q.price),
          change: `${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}%`,
          up: q.changePercent >= 0,
        };
      })),
      // Market overview stocks (gainers/losers)
      Promise.all(MARKET_SYMBOLS.map(async (stock) => {
        const q = await fetchYahooQuote(stock.symbol);
        if (!q) return null;
        return {
          name: stock.name,
          price: `₹${formatPrice(q.price)}`,
          change: `${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}%`,
          changePercent: q.changePercent,
          up: q.changePercent >= 0,
          volume: formatVolume(q.volume),
          high: q.high ? `₹${formatPrice(q.high)}` : undefined,
          low: q.low ? `₹${formatPrice(q.low)}` : undefined,
        };
      })),
      // Commodities
      Promise.all(COMMODITY_SYMBOLS.map(async (item) => {
        const q = await fetchYahooQuote(item.symbol);
        if (!q) return null;
        return {
          name: item.name,
          price: formatPrice(q.price, item.unit !== "" && !item.name.includes("INR")),
          change: `${q.changePercent >= 0 ? '+' : ''}${q.changePercent.toFixed(2)}%`,
          up: q.changePercent >= 0,
          unit: item.unit,
        };
      })),
    ]);

    const validMarket = marketResults.filter(Boolean) as any[];
    const gainers = validMarket.filter(s => s.up).sort((a, b) => b.changePercent - a.changePercent).slice(0, 7);
    const losers = validMarket.filter(s => !s.up).sort((a, b) => a.changePercent - b.changePercent).slice(0, 7);
    const mostActive = [...validMarket].sort((a, b) => {
      const volA = parseFloat(a.volume?.replace(/[CLK]/g, '') || '0');
      const volB = parseFloat(b.volume?.replace(/[CLK]/g, '') || '0');
      return volB - volA;
    }).slice(0, 7);

    const advances = validMarket.filter(s => s.up).length;
    const declines = validMarket.filter(s => !s.up).length;

    return new Response(
      JSON.stringify({
        success: true,
        indices: indexResults.filter(Boolean),
        data: stockResults.filter(Boolean),
        commodities: commodityResults.filter(Boolean),
        marketOverview: {
          gainers,
          losers,
          mostActive,
          advances,
          declines,
          unchanged: Math.max(0, validMarket.length - advances - declines),
        },
        fetchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching stock prices:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch stock prices' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
