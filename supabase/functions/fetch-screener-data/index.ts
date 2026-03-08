import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ~200 major NSE stocks across sectors
const NSE_SYMBOLS: { symbol: string; yahoo: string; name: string; sector: string }[] = [
  // Banking & Finance
  { symbol: "HDFCBANK", yahoo: "HDFCBANK.NS", name: "HDFC Bank", sector: "Banking" },
  { symbol: "ICICIBANK", yahoo: "ICICIBANK.NS", name: "ICICI Bank", sector: "Banking" },
  { symbol: "SBIN", yahoo: "SBIN.NS", name: "State Bank of India", sector: "Banking" },
  { symbol: "KOTAKBANK", yahoo: "KOTAKBANK.NS", name: "Kotak Mahindra Bank", sector: "Banking" },
  { symbol: "AXISBANK", yahoo: "AXISBANK.NS", name: "Axis Bank", sector: "Banking" },
  { symbol: "INDUSINDBK", yahoo: "INDUSINDBK.NS", name: "IndusInd Bank", sector: "Banking" },
  { symbol: "BANKBARODA", yahoo: "BANKBARODA.NS", name: "Bank of Baroda", sector: "Banking" },
  { symbol: "PNB", yahoo: "PNB.NS", name: "Punjab National Bank", sector: "Banking" },
  { symbol: "FEDERALBNK", yahoo: "FEDERALBNK.NS", name: "Federal Bank", sector: "Banking" },
  { symbol: "IDFCFIRSTB", yahoo: "IDFCFIRSTB.NS", name: "IDFC First Bank", sector: "Banking" },
  { symbol: "AUBANK", yahoo: "AUBANK.NS", name: "AU Small Finance Bank", sector: "Banking" },
  { symbol: "BANDHANBNK", yahoo: "BANDHANBNK.NS", name: "Bandhan Bank", sector: "Banking" },
  { symbol: "CANBK", yahoo: "CANBK.NS", name: "Canara Bank", sector: "Banking" },
  { symbol: "UNIONBANK", yahoo: "UNIONBANK.NS", name: "Union Bank of India", sector: "Banking" },

  // NBFC
  { symbol: "BAJFINANCE", yahoo: "BAJFINANCE.NS", name: "Bajaj Finance", sector: "NBFC" },
  { symbol: "BAJAJFINSV", yahoo: "BAJAJFINSV.NS", name: "Bajaj Finserv", sector: "NBFC" },
  { symbol: "CHOLAFIN", yahoo: "CHOLAFIN.NS", name: "Cholamandalam Investment", sector: "NBFC" },
  { symbol: "MUTHOOTFIN", yahoo: "MUTHOOTFIN.NS", name: "Muthoot Finance", sector: "NBFC" },
  { symbol: "SHRIRAMFIN", yahoo: "SHRIRAMFIN.NS", name: "Shriram Finance", sector: "NBFC" },
  { symbol: "M&MFIN", yahoo: "M%26MFIN.NS", name: "Mahindra & Mahindra Financial", sector: "NBFC" },
  { symbol: "POONAWALLA", yahoo: "POONAWALLA.NS", name: "Poonawalla Fincorp", sector: "NBFC" },

  // IT
  { symbol: "TCS", yahoo: "TCS.NS", name: "Tata Consultancy Services", sector: "IT" },
  { symbol: "INFY", yahoo: "INFY.NS", name: "Infosys", sector: "IT" },
  { symbol: "HCLTECH", yahoo: "HCLTECH.NS", name: "HCL Technologies", sector: "IT" },
  { symbol: "WIPRO", yahoo: "WIPRO.NS", name: "Wipro", sector: "IT" },
  { symbol: "TECHM", yahoo: "TECHM.NS", name: "Tech Mahindra", sector: "IT" },
  { symbol: "LTIM", yahoo: "LTIM.NS", name: "LTIMindtree", sector: "IT" },
  { symbol: "PERSISTENT", yahoo: "PERSISTENT.NS", name: "Persistent Systems", sector: "IT" },
  { symbol: "COFORGE", yahoo: "COFORGE.NS", name: "Coforge", sector: "IT" },
  { symbol: "MPHASIS", yahoo: "MPHASIS.NS", name: "Mphasis", sector: "IT" },
  { symbol: "LTTS", yahoo: "LTTS.NS", name: "L&T Technology Services", sector: "IT" },

  // Energy
  { symbol: "RELIANCE", yahoo: "RELIANCE.NS", name: "Reliance Industries", sector: "Energy" },
  { symbol: "ONGC", yahoo: "ONGC.NS", name: "Oil & Natural Gas Corp", sector: "Energy" },
  { symbol: "NTPC", yahoo: "NTPC.NS", name: "NTPC Ltd", sector: "Energy" },
  { symbol: "POWERGRID", yahoo: "POWERGRID.NS", name: "Power Grid Corp", sector: "Energy" },
  { symbol: "ADANIGREEN", yahoo: "ADANIGREEN.NS", name: "Adani Green Energy", sector: "Energy" },
  { symbol: "TATAPOWER", yahoo: "TATAPOWER.NS", name: "Tata Power", sector: "Energy" },
  { symbol: "IOC", yahoo: "IOC.NS", name: "Indian Oil Corporation", sector: "Energy" },
  { symbol: "BPCL", yahoo: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy" },
  { symbol: "GAIL", yahoo: "GAIL.NS", name: "GAIL India", sector: "Energy" },
  { symbol: "COALINDIA", yahoo: "COALINDIA.NS", name: "Coal India", sector: "Energy" },
  { symbol: "ADANIENSOL", yahoo: "ADANIENSOL.NS", name: "Adani Energy Solutions", sector: "Energy" },
  { symbol: "NHPC", yahoo: "NHPC.NS", name: "NHPC", sector: "Energy" },
  { symbol: "SJVN", yahoo: "SJVN.NS", name: "SJVN", sector: "Energy" },

  // Auto
  { symbol: "MARUTI", yahoo: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS", yahoo: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "M&M", yahoo: "M%26M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "BAJAJ-AUTO", yahoo: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Auto" },
  { symbol: "EICHERMOT", yahoo: "EICHERMOT.NS", name: "Eicher Motors", sector: "Auto" },
  { symbol: "HEROMOTOCO", yahoo: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Auto" },
  { symbol: "ASHOKLEY", yahoo: "ASHOKLEY.NS", name: "Ashok Leyland", sector: "Auto" },
  { symbol: "TVSMOTOR", yahoo: "TVSMOTOR.NS", name: "TVS Motor", sector: "Auto" },
  { symbol: "MOTHERSON", yahoo: "MOTHERSON.NS", name: "Samvardhana Motherson", sector: "Auto" },

  // Pharma
  { symbol: "SUNPHARMA", yahoo: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma" },
  { symbol: "DRREDDY", yahoo: "DRREDDY.NS", name: "Dr Reddy's Labs", sector: "Pharma" },
  { symbol: "CIPLA", yahoo: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB", yahoo: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "APOLLOHOSP", yahoo: "APOLLOHOSP.NS", name: "Apollo Hospitals", sector: "Pharma" },
  { symbol: "LUPIN", yahoo: "LUPIN.NS", name: "Lupin", sector: "Pharma" },
  { symbol: "TORNTPHARM", yahoo: "TORNTPHARM.NS", name: "Torrent Pharma", sector: "Pharma" },
  { symbol: "ZYDUSLIFE", yahoo: "ZYDUSLIFE.NS", name: "Zydus Lifesciences", sector: "Pharma" },
  { symbol: "BIOCON", yahoo: "BIOCON.NS", name: "Biocon", sector: "Pharma" },
  { symbol: "MAXHEALTH", yahoo: "MAXHEALTH.NS", name: "Max Healthcare", sector: "Pharma" },

  // FMCG
  { symbol: "HINDUNILVR", yahoo: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC", yahoo: "ITC.NS", name: "ITC Ltd", sector: "FMCG" },
  { symbol: "NESTLEIND", yahoo: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "BRITANNIA", yahoo: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG" },
  { symbol: "GODREJCP", yahoo: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "FMCG" },
  { symbol: "DABUR", yahoo: "DABUR.NS", name: "Dabur India", sector: "FMCG" },
  { symbol: "MARICO", yahoo: "MARICO.NS", name: "Marico", sector: "FMCG" },
  { symbol: "COLPAL", yahoo: "COLPAL.NS", name: "Colgate-Palmolive India", sector: "FMCG" },
  { symbol: "TATACONSUM", yahoo: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG" },
  { symbol: "VBL", yahoo: "VBL.NS", name: "Varun Beverages", sector: "FMCG" },
  { symbol: "UNITDSPR", yahoo: "UNITDSPR.NS", name: "United Spirits", sector: "FMCG" },

  // Metals & Mining
  { symbol: "TATASTEEL", yahoo: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "JSWSTEEL", yahoo: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "HINDALCO", yahoo: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "VEDL", yahoo: "VEDL.NS", name: "Vedanta", sector: "Metals" },
  { symbol: "NMDC", yahoo: "NMDC.NS", name: "NMDC", sector: "Metals" },
  { symbol: "SAIL", yahoo: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { symbol: "NATIONALUM", yahoo: "NATIONALUM.NS", name: "National Aluminium", sector: "Metals" },
  { symbol: "JINDALSTEL", yahoo: "JINDALSTEL.NS", name: "Jindal Steel & Power", sector: "Metals" },

  // Telecom
  { symbol: "BHARTIARTL", yahoo: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "JIOFIN", yahoo: "JIOFIN.NS", name: "Jio Financial Services", sector: "Telecom" },
  { symbol: "IDEA", yahoo: "IDEA.NS", name: "Vodafone Idea", sector: "Telecom" },
  { symbol: "INDUSTOWER", yahoo: "INDUSTOWER.NS", name: "Indus Towers", sector: "Telecom" },

  // Infrastructure & Construction
  { symbol: "LT", yahoo: "LT.NS", name: "Larsen & Toubro", sector: "Infrastructure" },
  { symbol: "ADANIENT", yahoo: "ADANIENT.NS", name: "Adani Enterprises", sector: "Infrastructure" },
  { symbol: "ADANIPORTS", yahoo: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infrastructure" },
  { symbol: "ULTRACEMCO", yahoo: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Infrastructure" },
  { symbol: "GRASIM", yahoo: "GRASIM.NS", name: "Grasim Industries", sector: "Infrastructure" },
  { symbol: "SHREECEM", yahoo: "SHREECEM.NS", name: "Shree Cement", sector: "Infrastructure" },
  { symbol: "ACC", yahoo: "ACC.NS", name: "ACC Ltd", sector: "Infrastructure" },
  { symbol: "AMBUJACEM", yahoo: "AMBUJACEM.NS", name: "Ambuja Cements", sector: "Infrastructure" },
  { symbol: "DLF", yahoo: "DLF.NS", name: "DLF Ltd", sector: "Infrastructure" },
  { symbol: "GODREJPROP", yahoo: "GODREJPROP.NS", name: "Godrej Properties", sector: "Infrastructure" },
  { symbol: "OBEROIRLTY", yahoo: "OBEROIRLTY.NS", name: "Oberoi Realty", sector: "Infrastructure" },
  { symbol: "IRCTC", yahoo: "IRCTC.NS", name: "IRCTC", sector: "Infrastructure" },

  // Consumer & Retail
  { symbol: "TITAN", yahoo: "TITAN.NS", name: "Titan Company", sector: "Consumer" },
  { symbol: "ASIANPAINT", yahoo: "ASIANPAINT.NS", name: "Asian Paints", sector: "Consumer" },
  { symbol: "PIDILITIND", yahoo: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Consumer" },
  { symbol: "BERGEPAINT", yahoo: "BERGEPAINT.NS", name: "Berger Paints", sector: "Consumer" },
  { symbol: "PAGEIND", yahoo: "PAGEIND.NS", name: "Page Industries", sector: "Consumer" },
  { symbol: "HAVELLS", yahoo: "HAVELLS.NS", name: "Havells India", sector: "Consumer" },
  { symbol: "VOLTAS", yahoo: "VOLTAS.NS", name: "Voltas", sector: "Consumer" },
  { symbol: "WHIRLPOOL", yahoo: "WHIRLPOOL.NS", name: "Whirlpool India", sector: "Consumer" },
  { symbol: "TRENT", yahoo: "TRENT.NS", name: "Trent Ltd", sector: "Consumer" },
  { symbol: "DMART", yahoo: "DMART.NS", name: "Avenue Supermarts (DMart)", sector: "Consumer" },
  { symbol: "NYKAA", yahoo: "NYKAA.NS", name: "FSN E-Commerce (Nykaa)", sector: "Consumer" },
  { symbol: "ZOMATO", yahoo: "ZOMATO.NS", name: "Zomato", sector: "Consumer" },

  // Insurance
  { symbol: "SBILIFE", yahoo: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance" },
  { symbol: "HDFCLIFE", yahoo: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance" },
  { symbol: "ICICIPRULI", yahoo: "ICICIPRULI.NS", name: "ICICI Prudential Life", sector: "Insurance" },
  { symbol: "ICICIGI", yahoo: "ICICIGI.NS", name: "ICICI Lombard", sector: "Insurance" },
  { symbol: "NIACL", yahoo: "NIACL.NS", name: "New India Assurance", sector: "Insurance" },
  { symbol: "STARHEALTH", yahoo: "STARHEALTH.NS", name: "Star Health Insurance", sector: "Insurance" },

  // Chemicals
  { symbol: "SOLARINDS", yahoo: "SOLARINDS.NS", name: "Solar Industries", sector: "Chemicals" },
  { symbol: "SRF", yahoo: "SRF.NS", name: "SRF Ltd", sector: "Chemicals" },
  { symbol: "PIIND", yahoo: "PIIND.NS", name: "PI Industries", sector: "Chemicals" },
  { symbol: "ATUL", yahoo: "ATUL.NS", name: "Atul Ltd", sector: "Chemicals" },
  { symbol: "DEEPAKNTR", yahoo: "DEEPAKNTR.NS", name: "Deepak Nitrite", sector: "Chemicals" },
  { symbol: "UPL", yahoo: "UPL.NS", name: "UPL Ltd", sector: "Chemicals" },

  // Defence & Aerospace
  { symbol: "HAL", yahoo: "HAL.NS", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "BEL", yahoo: "BEL.NS", name: "Bharat Electronics", sector: "Defence" },
  { symbol: "BDL", yahoo: "BDL.NS", name: "Bharat Dynamics", sector: "Defence" },
  { symbol: "MAZAGON", yahoo: "MAZAGON.NS", name: "Mazagon Dock", sector: "Defence" },

  // IT Services / Digital
  { symbol: "OFSS", yahoo: "OFSS.NS", name: "Oracle Financial Services", sector: "IT" },
  { symbol: "TATAELXSI", yahoo: "TATAELXSI.NS", name: "Tata Elxsi", sector: "IT" },
  { symbol: "ROUTE", yahoo: "ROUTE.NS", name: "Route Mobile", sector: "IT" },

  // Diversified / Conglomerate
  { symbol: "SIEMENS", yahoo: "SIEMENS.NS", name: "Siemens", sector: "Conglomerate" },
  { symbol: "ABB", yahoo: "ABB.NS", name: "ABB India", sector: "Conglomerate" },
  { symbol: "HONAUT", yahoo: "HONAUT.NS", name: "Honeywell Automation", sector: "Conglomerate" },
  { symbol: "CUMMINSIND", yahoo: "CUMMINSIND.NS", name: "Cummins India", sector: "Conglomerate" },

  // Misc
  { symbol: "PAYTM", yahoo: "PAYTM.NS", name: "One97 Communications (Paytm)", sector: "Fintech" },
  { symbol: "POLICYBZR", yahoo: "POLICYBZR.NS", name: "PB Fintech (PolicyBazaar)", sector: "Fintech" },
  { symbol: "DELHIVERY", yahoo: "DELHIVERY.NS", name: "Delhivery", sector: "Logistics" },
  { symbol: "INDIGO", yahoo: "INDIGO.NS", name: "InterGlobe Aviation (IndiGo)", sector: "Aviation" },
  { symbol: "TATACOMM", yahoo: "TATACOMM.NS", name: "Tata Communications", sector: "Telecom" },
  { symbol: "HINDPETRO", yahoo: "HINDPETRO.NS", name: "Hindustan Petroleum", sector: "Energy" },
  { symbol: "PETRONET", yahoo: "PETRONET.NS", name: "Petronet LNG", sector: "Energy" },
  { symbol: "IEX", yahoo: "IEX.NS", name: "Indian Energy Exchange", sector: "Energy" },
  { symbol: "RECLTD", yahoo: "RECLTD.NS", name: "REC Ltd", sector: "Energy" },
  { symbol: "PFC", yahoo: "PFC.NS", name: "Power Finance Corp", sector: "NBFC" },
  { symbol: "MANAPPURAM", yahoo: "MANAPPURAM.NS", name: "Manappuram Finance", sector: "NBFC" },
  { symbol: "CANFINHOME", yahoo: "CANFINHOME.NS", name: "Can Fin Homes", sector: "NBFC" },
  { symbol: "LICI", yahoo: "LICI.NS", name: "Life Insurance Corp", sector: "Insurance" },
  { symbol: "SBICARD", yahoo: "SBICARD.NS", name: "SBI Cards", sector: "NBFC" },
  { symbol: "CENTRALBK", yahoo: "CENTRALBK.NS", name: "Central Bank of India", sector: "Banking" },
  { symbol: "INDIANB", yahoo: "INDIANB.NS", name: "Indian Bank", sector: "Banking" },
  { symbol: "SYNGENE", yahoo: "SYNGENE.NS", name: "Syngene International", sector: "Pharma" },
  { symbol: "LAURUSLABS", yahoo: "LAURUSLABS.NS", name: "Laurus Labs", sector: "Pharma" },
  { symbol: "AUROPHARMA", yahoo: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharma" },
  { symbol: "ALKEM", yahoo: "ALKEM.NS", name: "Alkem Laboratories", sector: "Pharma" },
  { symbol: "IPCALAB", yahoo: "IPCALAB.NS", name: "IPCA Laboratories", sector: "Pharma" },
  { symbol: "BALKRISIND", yahoo: "BALKRISIND.NS", name: "Balkrishna Industries", sector: "Auto" },
  { symbol: "MRF", yahoo: "MRF.NS", name: "MRF", sector: "Auto" },
  { symbol: "APOLLOTYRE", yahoo: "APOLLOTYRE.NS", name: "Apollo Tyres", sector: "Auto" },
  { symbol: "JSWENERGY", yahoo: "JSWENERGY.NS", name: "JSW Energy", sector: "Energy" },
  { symbol: "TORNTPOWER", yahoo: "TORNTPOWER.NS", name: "Torrent Power", sector: "Energy" },
  { symbol: "IIFL", yahoo: "IIFL.NS", name: "IIFL Finance", sector: "NBFC" },
  { symbol: "HDFCAMC", yahoo: "HDFCAMC.NS", name: "HDFC AMC", sector: "NBFC" },
  { symbol: "NAUKRI", yahoo: "NAUKRI.NS", name: "Info Edge (Naukri)", sector: "IT" },
  { symbol: "DIXON", yahoo: "DIXON.NS", name: "Dixon Technologies", sector: "Consumer" },
  { symbol: "POLYCAB", yahoo: "POLYCAB.NS", name: "Polycab India", sector: "Consumer" },
  { symbol: "CROMPTON", yahoo: "CROMPTON.NS", name: "Crompton Greaves", sector: "Consumer" },
  { symbol: "CONCOR", yahoo: "CONCOR.NS", name: "Container Corp of India", sector: "Logistics" },
  { symbol: "LODHA", yahoo: "LODHA.NS", name: "Macrotech Developers (Lodha)", sector: "Infrastructure" },
  { symbol: "PRESTIGE", yahoo: "PRESTIGE.NS", name: "Prestige Estates", sector: "Infrastructure" },
  { symbol: "PHOENIXLTD", yahoo: "PHOENIXLTD.NS", name: "Phoenix Mills", sector: "Infrastructure" },
  { symbol: "ABCAPITAL", yahoo: "ABCAPITAL.NS", name: "Aditya Birla Capital", sector: "NBFC" },
  { symbol: "LICHSGFIN", yahoo: "LICHSGFIN.NS", name: "LIC Housing Finance", sector: "NBFC" },
];

// Use Yahoo v6 quote API - supports batch and returns marketCap, PE, etc.
async function fetchBatchQuotes(symbols: string[]): Promise<Map<string, any>> {
  const results = new Map();
  // v6 quote supports comma-separated symbols
  const symbolStr = symbols.join(",");
  try {
    const url = `https://query1.finance.yahoo.com/v6/finance/quote?symbols=${encodeURIComponent(symbolStr)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
    });
    if (res.ok) {
      const json = await res.json();
      const quotes = json?.quoteResponse?.result || [];
      for (const q of quotes) {
        results.set(q.symbol, q);
      }
      return results;
    }
  } catch (e) {
    console.log("v6 quote failed, trying v8 chart fallback");
  }

  // Fallback: fetch individually via v8 chart API
  await Promise.all(symbols.map(async (sym) => {
    try {
      const url = `https://query1.finance.yahoo.com/v8/finance/chart/${sym}?range=5d&interval=1d&includePrePost=false`;
      const res = await fetch(url, {
        headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
      });
      if (!res.ok) return;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return;
      const meta = result.meta;
      // Build a compatible object
      results.set(sym, {
        symbol: sym,
        regularMarketPrice: meta.regularMarketPrice ?? 0,
        regularMarketChange: (meta.regularMarketPrice ?? 0) - (meta.chartPreviousClose ?? meta.previousClose ?? 0),
        regularMarketChangePercent: meta.chartPreviousClose ? ((meta.regularMarketPrice - meta.chartPreviousClose) / meta.chartPreviousClose) * 100 : 0,
        regularMarketVolume: result.indicators?.quote?.[0]?.volume?.slice(-1)?.[0] ?? 0,
        regularMarketDayHigh: result.indicators?.quote?.[0]?.high?.slice(-1)?.[0] ?? 0,
        regularMarketDayLow: result.indicators?.quote?.[0]?.low?.slice(-1)?.[0] ?? 0,
        regularMarketOpen: result.indicators?.quote?.[0]?.open?.slice(-1)?.[0] ?? 0,
        regularMarketPreviousClose: meta.chartPreviousClose ?? meta.previousClose ?? 0,
        fiftyTwoWeekHigh: meta.fiftyTwoWeekHigh ?? 0,
        fiftyTwoWeekLow: meta.fiftyTwoWeekLow ?? 0,
        marketCap: 0,
        trailingPE: 0,
      });
    } catch {}
  }));
  return results;
}

function buildStockRow(stock: typeof NSE_SYMBOLS[0], q: any) {
  const price = q.regularMarketPrice ?? 0;
  const change = q.regularMarketChange ?? 0;
  const changePct = q.regularMarketChangePercent ?? 0;
  const marketCapRaw = q.marketCap ?? 0;
  // Convert market cap to Crores (1 Cr = 10M = 10,000,000)
  const marketCapCr = marketCapRaw > 0 ? Math.round(marketCapRaw / 10000000) : 0;

  return {
    symbol: stock.symbol,
    name: stock.name,
    sector: stock.sector,
    price,
    change,
    change_pct: changePct,
    market_cap: marketCapCr,
    pe: q.trailingPE ?? q.forwardPE ?? 0,
    high_52: q.fiftyTwoWeekHigh ?? 0,
    low_52: q.fiftyTwoWeekLow ?? 0,
    volume: q.regularMarketVolume ?? 0,
    day_high: q.regularMarketDayHigh ?? 0,
    day_low: q.regularMarketDayLow ?? 0,
    open_price: q.regularMarketOpen ?? 0,
    prev_close: q.regularMarketPreviousClose ?? 0,
    updated_at: new Date().toISOString(),
  };
}

// Process in batches - v6 supports up to ~20 symbols per request
async function processBatch(stocks: typeof NSE_SYMBOLS, batchSize = 15, delayMs = 400) {
  const results: any[] = [];
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize);
    const yahooSymbols = batch.map(s => s.yahoo);
    const quoteMap = await fetchBatchQuotes(yahooSymbols);
    
    for (const stock of batch) {
      const q = quoteMap.get(stock.yahoo);
      if (q) results.push(buildStockRow(stock, q));
    }
    
    if (i + batchSize < stocks.length) {
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
  return results;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, supabaseKey);

    // Check if cache is fresh (< 5 min)
    const { data: existing } = await sb
      .from("screener_stocks")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);

    const lastUpdate = existing?.[0]?.updated_at;
    const isFresh = lastUpdate && (Date.now() - new Date(lastUpdate).getTime()) < 5 * 60 * 1000;

    // If requesting refresh or cache is stale, fetch new data
    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const forceRefresh = body.refresh === true;

    if (!isFresh || forceRefresh) {
      console.log(`Fetching ${NSE_SYMBOLS.length} stocks from Yahoo Finance...`);
      const stockData = await processBatch(NSE_SYMBOLS, 5, 500);
      console.log(`Got data for ${stockData.length} stocks`);

      if (stockData.length > 0) {
        // Upsert in batches of 50
        for (let i = 0; i < stockData.length; i += 50) {
          const batch = stockData.slice(i, i + 50);
          const { error } = await sb
            .from("screener_stocks")
            .upsert(batch, { onConflict: "symbol" });
          if (error) console.error("Upsert error:", error.message);
        }
      }
    }

    // Return cached data
    const { data: stocks, error } = await sb
      .from("screener_stocks")
      .select("*")
      .order("market_cap", { ascending: false });

    if (error) throw error;

    return new Response(JSON.stringify({
      success: true,
      stocks: stocks || [],
      count: stocks?.length || 0,
      cached: isFresh && !forceRefresh,
      updated_at: stocks?.[0]?.updated_at || null,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
