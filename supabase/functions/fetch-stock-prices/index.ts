const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const STOCK_SYMBOLS = [
  { symbol: "^NSEI", name: "NIFTY 50" },
  { symbol: "^BSESN", name: "SENSEX" },
  { symbol: "^NSEBANK", name: "BANK NIFTY" },
  { symbol: "RELIANCE.NS", name: "RELIANCE" },
  { symbol: "TCS.NS", name: "TCS" },
  { symbol: "HDFCBANK.NS", name: "HDFC BANK" },
  { symbol: "INFY.NS", name: "INFOSYS" },
  { symbol: "ICICIBANK.NS", name: "ICICI BANK" },
  { symbol: "ITC.NS", name: "ITC" },
  { symbol: "BAJFINANCE.NS", name: "BAJAJ FIN" },
];

async function fetchYahooQuote(symbol: string): Promise<{price: number; change: number; changePercent: number} | null> {
  try {
    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=2d`;
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
    });
    if (!res.ok) return null;
    const data = await res.json();
    const result = data?.chart?.result?.[0];
    if (!result) return null;
    
    const meta = result.meta;
    const price = meta.regularMarketPrice;
    const prevClose = meta.chartPreviousClose || meta.previousClose;
    const change = price - prevClose;
    const changePercent = (change / prevClose) * 100;
    
    return { price, change, changePercent };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results = await Promise.all(
      STOCK_SYMBOLS.map(async (stock) => {
        const quote = await fetchYahooQuote(stock.symbol);
        if (quote) {
          return {
            name: stock.name,
            symbol: stock.symbol,
            price: quote.price.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
            change: `${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%`,
            up: quote.changePercent >= 0,
          };
        }
        return null;
      })
    );

    const validResults = results.filter(Boolean);

    return new Response(
      JSON.stringify({ success: true, data: validResults, fetchedAt: new Date().toISOString() }),
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
