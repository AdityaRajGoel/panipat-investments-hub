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
  { symbol: "IOC", yahoo: "IOC.NS", name: "Indian Oil Corp", sector: "Energy" },
  { symbol: "BPCL", yahoo: "BPCL.NS", name: "Bharat Petroleum", sector: "Energy" },
  { symbol: "GAIL", yahoo: "GAIL.NS", name: "GAIL India", sector: "Energy" },
  { symbol: "NTPC", yahoo: "NTPC.NS", name: "NTPC", sector: "Energy" },
  { symbol: "POWERGRID", yahoo: "POWERGRID.NS", name: "Power Grid Corp", sector: "Energy" },
  { symbol: "ADANIGREEN", yahoo: "ADANIGREEN.NS", name: "Adani Green Energy", sector: "Energy" },
  { symbol: "TATAPOWER", yahoo: "TATAPOWER.NS", name: "Tata Power", sector: "Energy" },
  { symbol: "ADANIPOWER", yahoo: "ADANIPOWER.NS", name: "Adani Power", sector: "Energy" },
  { symbol: "NHPC", yahoo: "NHPC.NS", name: "NHPC", sector: "Energy" },
  { symbol: "COALINDIA", yahoo: "COALINDIA.NS", name: "Coal India", sector: "Energy" },
  { symbol: "PETRONET", yahoo: "PETRONET.NS", name: "Petronet LNG", sector: "Energy" },

  // Automobiles
  { symbol: "MARUTI", yahoo: "MARUTI.NS", name: "Maruti Suzuki", sector: "Auto" },
  { symbol: "TATAMOTORS", yahoo: "TATAMOTORS.NS", name: "Tata Motors", sector: "Auto" },
  { symbol: "M&M", yahoo: "M%26M.NS", name: "Mahindra & Mahindra", sector: "Auto" },
  { symbol: "BAJAJ-AUTO", yahoo: "BAJAJ-AUTO.NS", name: "Bajaj Auto", sector: "Auto" },
  { symbol: "HEROMOTOCO", yahoo: "HEROMOTOCO.NS", name: "Hero MotoCorp", sector: "Auto" },
  { symbol: "EICHERMOT", yahoo: "EICHERMOT.NS", name: "Eicher Motors", sector: "Auto" },
  { symbol: "ASHOKLEY", yahoo: "ASHOKLEY.NS", name: "Ashok Leyland", sector: "Auto" },
  { symbol: "TVSMOTOR", yahoo: "TVSMOTOR.NS", name: "TVS Motor", sector: "Auto" },
  { symbol: "BALKRISIND", yahoo: "BALKRISIND.NS", name: "Balkrishna Industries", sector: "Auto" },
  { symbol: "MOTHERSON", yahoo: "MOTHERSON.NS", name: "Motherson Sumi", sector: "Auto" },

  // Pharma & Healthcare
  { symbol: "SUNPHARMA", yahoo: "SUNPHARMA.NS", name: "Sun Pharma", sector: "Pharma" },
  { symbol: "DRREDDY", yahoo: "DRREDDY.NS", name: "Dr. Reddy's Labs", sector: "Pharma" },
  { symbol: "CIPLA", yahoo: "CIPLA.NS", name: "Cipla", sector: "Pharma" },
  { symbol: "DIVISLAB", yahoo: "DIVISLAB.NS", name: "Divi's Laboratories", sector: "Pharma" },
  { symbol: "APOLLOHOSP", yahoo: "APOLLOHOSP.NS", name: "Apollo Hospitals", sector: "Pharma" },
  { symbol: "TORNTPHARM", yahoo: "TORNTPHARM.NS", name: "Torrent Pharma", sector: "Pharma" },
  { symbol: "LUPIN", yahoo: "LUPIN.NS", name: "Lupin", sector: "Pharma" },
  { symbol: "AUROPHARMA", yahoo: "AUROPHARMA.NS", name: "Aurobindo Pharma", sector: "Pharma" },
  { symbol: "BIOCON", yahoo: "BIOCON.NS", name: "Biocon", sector: "Pharma" },
  { symbol: "MAXHEALTH", yahoo: "MAXHEALTH.NS", name: "Max Healthcare", sector: "Pharma" },
  { symbol: "ZYDUSLIFE", yahoo: "ZYDUSLIFE.NS", name: "Zydus Lifesciences", sector: "Pharma" },
  { symbol: "ALKEM", yahoo: "ALKEM.NS", name: "Alkem Laboratories", sector: "Pharma" },

  // FMCG
  { symbol: "HINDUNILVR", yahoo: "HINDUNILVR.NS", name: "Hindustan Unilever", sector: "FMCG" },
  { symbol: "ITC", yahoo: "ITC.NS", name: "ITC", sector: "FMCG" },
  { symbol: "NESTLEIND", yahoo: "NESTLEIND.NS", name: "Nestle India", sector: "FMCG" },
  { symbol: "BRITANNIA", yahoo: "BRITANNIA.NS", name: "Britannia Industries", sector: "FMCG" },
  { symbol: "DABUR", yahoo: "DABUR.NS", name: "Dabur India", sector: "FMCG" },
  { symbol: "MARICO", yahoo: "MARICO.NS", name: "Marico", sector: "FMCG" },
  { symbol: "GODREJCP", yahoo: "GODREJCP.NS", name: "Godrej Consumer Products", sector: "FMCG" },
  { symbol: "COLPAL", yahoo: "COLPAL.NS", name: "Colgate-Palmolive", sector: "FMCG" },
  { symbol: "TATACONSUM", yahoo: "TATACONSUM.NS", name: "Tata Consumer Products", sector: "FMCG" },
  { symbol: "PGHH", yahoo: "PGHH.NS", name: "Procter & Gamble Hygiene", sector: "FMCG" },
  { symbol: "UBL", yahoo: "UBL.NS", name: "United Breweries", sector: "FMCG" },
  { symbol: "VBL", yahoo: "VBL.NS", name: "Varun Beverages", sector: "FMCG" },

  // Metals & Mining
  { symbol: "TATASTEEL", yahoo: "TATASTEEL.NS", name: "Tata Steel", sector: "Metals" },
  { symbol: "JSWSTEEL", yahoo: "JSWSTEEL.NS", name: "JSW Steel", sector: "Metals" },
  { symbol: "HINDALCO", yahoo: "HINDALCO.NS", name: "Hindalco Industries", sector: "Metals" },
  { symbol: "VEDL", yahoo: "VEDL.NS", name: "Vedanta", sector: "Metals" },
  { symbol: "NMDC", yahoo: "NMDC.NS", name: "NMDC", sector: "Metals" },
  { symbol: "SAIL", yahoo: "SAIL.NS", name: "Steel Authority of India", sector: "Metals" },
  { symbol: "JINDALSTEL", yahoo: "JINDALSTEL.NS", name: "Jindal Steel & Power", sector: "Metals" },
  { symbol: "NATIONALUM", yahoo: "NATIONALUM.NS", name: "National Aluminium", sector: "Metals" },

  // Infra & Construction
  { symbol: "LT", yahoo: "LT.NS", name: "Larsen & Toubro", sector: "Infra" },
  { symbol: "ADANIENT", yahoo: "ADANIENT.NS", name: "Adani Enterprises", sector: "Infra" },
  { symbol: "ADANIPORTS", yahoo: "ADANIPORTS.NS", name: "Adani Ports", sector: "Infra" },
  { symbol: "ULTRACEMCO", yahoo: "ULTRACEMCO.NS", name: "UltraTech Cement", sector: "Infra" },
  { symbol: "GRASIM", yahoo: "GRASIM.NS", name: "Grasim Industries", sector: "Infra" },
  { symbol: "SHREECEM", yahoo: "SHREECEM.NS", name: "Shree Cement", sector: "Infra" },
  { symbol: "AMBUJACEM", yahoo: "AMBUJACEM.NS", name: "Ambuja Cements", sector: "Infra" },
  { symbol: "ACC", yahoo: "ACC.NS", name: "ACC Cement", sector: "Infra" },
  { symbol: "DLF", yahoo: "DLF.NS", name: "DLF", sector: "Infra" },
  { symbol: "GODREJPROP", yahoo: "GODREJPROP.NS", name: "Godrej Properties", sector: "Infra" },
  { symbol: "OBEROIRLTY", yahoo: "OBEROIRLTY.NS", name: "Oberoi Realty", sector: "Infra" },
  { symbol: "IRCTC", yahoo: "IRCTC.NS", name: "IRCTC", sector: "Infra" },

  // Telecom & Media
  { symbol: "BHARTIARTL", yahoo: "BHARTIARTL.NS", name: "Bharti Airtel", sector: "Telecom" },
  { symbol: "IDEA", yahoo: "IDEA.NS", name: "Vodafone Idea", sector: "Telecom" },
  { symbol: "ZEEL", yahoo: "ZEEL.NS", name: "Zee Entertainment", sector: "Telecom" },
  { symbol: "DELHIVERY", yahoo: "DELHIVERY.NS", name: "Delhivery", sector: "Telecom" },

  // Insurance
  { symbol: "SBILIFE", yahoo: "SBILIFE.NS", name: "SBI Life Insurance", sector: "Insurance" },
  { symbol: "HDFCLIFE", yahoo: "HDFCLIFE.NS", name: "HDFC Life Insurance", sector: "Insurance" },
  { symbol: "ICICIPRULI", yahoo: "ICICIPRULI.NS", name: "ICICI Prudential Life", sector: "Insurance" },
  { symbol: "ICICIGI", yahoo: "ICICIGI.NS", name: "ICICI Lombard GIC", sector: "Insurance" },
  { symbol: "NIACL", yahoo: "NIACL.NS", name: "New India Assurance", sector: "Insurance" },
  { symbol: "STARHEALTH", yahoo: "STARHEALTH.NS", name: "Star Health Insurance", sector: "Insurance" },

  // Chemicals
  { symbol: "PIDILITIND", yahoo: "PIDILITIND.NS", name: "Pidilite Industries", sector: "Chemicals" },
  { symbol: "SOLARINDS", yahoo: "SOLARINDS.NS", name: "Solar Industries", sector: "Chemicals" },
  { symbol: "SRF", yahoo: "SRF.NS", name: "SRF Ltd", sector: "Chemicals" },
  { symbol: "UPL", yahoo: "UPL.NS", name: "UPL", sector: "Chemicals" },
  { symbol: "ATUL", yahoo: "ATUL.NS", name: "Atul Ltd", sector: "Chemicals" },
  { symbol: "DEEPAKNTR", yahoo: "DEEPAKNTR.NS", name: "Deepak Nitrite", sector: "Chemicals" },

  // Consumer Durables
  { symbol: "TITAN", yahoo: "TITAN.NS", name: "Titan Company", sector: "Consumer" },
  { symbol: "HAVELLS", yahoo: "HAVELLS.NS", name: "Havells India", sector: "Consumer" },
  { symbol: "VOLTAS", yahoo: "VOLTAS.NS", name: "Voltas", sector: "Consumer" },
  { symbol: "WHIRLPOOL", yahoo: "WHIRLPOOL.NS", name: "Whirlpool of India", sector: "Consumer" },
  { symbol: "CROMPTON", yahoo: "CROMPTON.NS", name: "Crompton Greaves", sector: "Consumer" },
  { symbol: "PAGEIND", yahoo: "PAGEIND.NS", name: "Page Industries", sector: "Consumer" },
  { symbol: "TRENT", yahoo: "TRENT.NS", name: "Trent", sector: "Consumer" },
  { symbol: "DMART", yahoo: "DMART.NS", name: "Avenue Supermarts", sector: "Consumer" },

  // Defence & PSU
  { symbol: "HAL", yahoo: "HAL.NS", name: "Hindustan Aeronautics", sector: "Defence" },
  { symbol: "BEL", yahoo: "BEL.NS", name: "Bharat Electronics", sector: "Defence" },
  { symbol: "BHEL", yahoo: "BHEL.NS", name: "Bharat Heavy Electricals", sector: "Defence" },
  { symbol: "IRFC", yahoo: "IRFC.NS", name: "Indian Railway Finance", sector: "Defence" },
  { symbol: "RECLTD", yahoo: "RECLTD.NS", name: "REC Ltd", sector: "Defence" },
  { symbol: "PFC", yahoo: "PFC.NS", name: "Power Finance Corp", sector: "Defence" },
  { symbol: "CONCOR", yahoo: "CONCOR.NS", name: "Container Corp", sector: "Defence" },

  // Tech / New Age
  { symbol: "ZOMATO", yahoo: "ZOMATO.NS", name: "Zomato", sector: "Tech" },
  { symbol: "PAYTM", yahoo: "PAYTM.NS", name: "One97 Communications", sector: "Tech" },
  { symbol: "NYKAA", yahoo: "NYKAA.NS", name: "FSN E-Commerce", sector: "Tech" },
  { symbol: "POLICYBZR", yahoo: "POLICYBZR.NS", name: "PB Fintech", sector: "Tech" },
  { symbol: "INDIGRID", yahoo: "INDIGRID.NS", name: "India Grid Trust", sector: "Tech" },

  // Diversified / Others
  { symbol: "ASIANPAINT", yahoo: "ASIANPAINT.NS", name: "Asian Paints", sector: "Diversified" },
  { symbol: "BERGEPAINT", yahoo: "BERGEPAINT.NS", name: "Berger Paints", sector: "Diversified" },
  { symbol: "SIEMENS", yahoo: "SIEMENS.NS", name: "Siemens India", sector: "Diversified" },
  { symbol: "ABB", yahoo: "ABB.NS", name: "ABB India", sector: "Diversified" },
  { symbol: "CUMMINSIND", yahoo: "CUMMINSIND.NS", name: "Cummins India", sector: "Diversified" },
  { symbol: "CGPOWER", yahoo: "CGPOWER.NS", name: "CG Power", sector: "Diversified" },
  { symbol: "HINDPETRO", yahoo: "HINDPETRO.NS", name: "Hindustan Petroleum", sector: "Diversified" },
  { symbol: "INDIGO", yahoo: "INDIGO.NS", name: "InterGlobe Aviation", sector: "Diversified" },
  { symbol: "SBICARD", yahoo: "SBICARD.NS", name: "SBI Cards", sector: "Diversified" },
  { symbol: "MCDOWELL", yahoo: "MCDOWELL-N.NS", name: "United Spirits", sector: "Diversified" },
  { symbol: "TATACOMM", yahoo: "TATACOMM.NS", name: "Tata Communications", sector: "Diversified" },
  { symbol: "TATAELXSI", yahoo: "TATAELXSI.NS", name: "Tata Elxsi", sector: "Diversified" },
  { symbol: "POLYCAB", yahoo: "POLYCAB.NS", name: "Polycab India", sector: "Diversified" },
  { symbol: "KAYNES", yahoo: "KAYNES.NS", name: "Kaynes Technology", sector: "Diversified" },
  { symbol: "DIXON", yahoo: "DIXON.NS", name: "Dixon Technologies", sector: "Diversified" },
  { symbol: "LTFOODS", yahoo: "LTFOODS.NS", name: "LT Foods", sector: "Diversified" },
  { symbol: "JUBLFOOD", yahoo: "JUBLFOOD.NS", name: "Jubilant FoodWorks", sector: "Diversified" },
  { symbol: "LICI", yahoo: "LICI.NS", name: "Life Insurance Corp", sector: "Insurance" },
  { symbol: "JIOFIN", yahoo: "JIOFIN.NS", name: "Jio Financial Services", sector: "NBFC" },
  { symbol: "LODHA", yahoo: "LODHA.NS", name: "Macrotech Developers", sector: "Infra" },
  { symbol: "MANKIND", yahoo: "MANKIND.NS", name: "Mankind Pharma", sector: "Pharma" },
  { symbol: "JSWENERGY", yahoo: "JSWENERGY.NS", name: "JSW Energy", sector: "Energy" },
  { symbol: "CAMS", yahoo: "CAMS.NS", name: "Computer Age Mgmt", sector: "Diversified" },
  { symbol: "CDSL", yahoo: "CDSL.NS", name: "Central Depository Services", sector: "Diversified" },
  { symbol: "BSE", yahoo: "BSE.NS", name: "BSE Ltd", sector: "Diversified" },
  { symbol: "SONACOMS", yahoo: "SONACOMS.NS", name: "Sona BLW Precision", sector: "Auto" },
  { symbol: "APLAPOLLO", yahoo: "APLAPOLLO.NS", name: "APL Apollo Tubes", sector: "Metals" },
  { symbol: "SUPREMEIND", yahoo: "SUPREMEIND.NS", name: "Supreme Industries", sector: "Diversified" },
  { symbol: "HONAUT", yahoo: "HONAUT.NS", name: "Honeywell Automation", sector: "Diversified" },
  { symbol: "OFSS", yahoo: "OFSS.NS", name: "Oracle Financial Services", sector: "IT" },
];

// Get Yahoo Finance crumb + cookies for authenticated API access
async function getYahooCrumb(): Promise<{ crumb: string; cookie: string }> {
  const initRes = await fetch("https://fc.yahoo.com", {
    redirect: "manual",
    headers: { "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36" },
  });
  const setCookies = initRes.headers.getSetCookie?.() || [];
  const cookieStr = setCookies.map(c => c.split(";")[0]).join("; ");

  const crumbRes = await fetch("https://query2.finance.yahoo.com/v1/test/getcrumb", {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      "Cookie": cookieStr,
    },
  });
  const crumb = await crumbRes.text();
  if (!crumb || crumb.includes("<!DOCTYPE")) throw new Error("Failed to get Yahoo crumb");
  return { crumb, cookie: cookieStr };
}

// Use Yahoo v7 quote API with crumb authentication
async function fetchBatchQuotes(symbols: string[], crumb: string, cookie: string): Promise<Map<string, any>> {
  const results = new Map();
  const symbolStr = symbols.join(",");
  try {
    const url = `https://query2.finance.yahoo.com/v7/finance/quote?symbols=${encodeURIComponent(symbolStr)}&crumb=${encodeURIComponent(crumb)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Cookie": cookie,
      },
    });
    if (res.ok) {
      const json = await res.json();
      const quotes = json?.quoteResponse?.result || [];
      for (const q of quotes) {
        results.set(q.symbol, q);
      }
      return results;
    }
    console.log(`v7 quote returned ${res.status}, trying v8 fallback`);
  } catch (e) {
    console.log("v7 quote failed, trying v8 chart fallback");
  }

  // Fallback: fetch individually via v8 chart API
  await Promise.all(symbols.map(async (sym) => {
    try {
      const url = `https://query2.finance.yahoo.com/v8/finance/chart/${sym}?range=5d&interval=1d&includePrePost=false&crumb=${encodeURIComponent(crumb)}`;
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Cookie": cookie,
        },
      });
      if (!res.ok) return;
      const json = await res.json();
      const result = json?.chart?.result?.[0];
      if (!result) return;
      const meta = result.meta;
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

async function processBatch(stocks: typeof NSE_SYMBOLS, crumb: string, cookie: string, batchSize = 15, delayMs = 400) {
  const results: any[] = [];
  for (let i = 0; i < stocks.length; i += batchSize) {
    const batch = stocks.slice(i, i + batchSize);
    const yahooSymbols = batch.map(s => s.yahoo);
    const quoteMap = await fetchBatchQuotes(yahooSymbols, crumb, cookie);

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

    const { data: existing } = await sb
      .from("screener_stocks")
      .select("updated_at")
      .order("updated_at", { ascending: false })
      .limit(1);

    const lastUpdate = existing?.[0]?.updated_at;
    const isFresh = lastUpdate && (Date.now() - new Date(lastUpdate).getTime()) < 5 * 60 * 1000;

    const body = req.method === "POST" ? await req.json().catch(() => ({})) : {};
    const forceRefresh = body.refresh === true;

    if (!isFresh || forceRefresh) {
      console.log(`Fetching ${NSE_SYMBOLS.length} stocks from Yahoo Finance...`);
      const { crumb, cookie } = await getYahooCrumb();
      const stockData = await processBatch(NSE_SYMBOLS, crumb, cookie, 5, 500);
      console.log(`Got data for ${stockData.length} stocks`);

      if (stockData.length > 0) {
        for (let i = 0; i < stockData.length; i += 50) {
          const batch = stockData.slice(i, i + 50);
          const { error } = await sb
            .from("screener_stocks")
            .upsert(batch, { onConflict: "symbol" });
          if (error) console.error("Upsert error:", error.message);
        }
      }
    }

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
    const errorMessage = e instanceof Error ? e.message : "Failed to fetch screener data";
    console.error("Error:", e);
    return new Response(JSON.stringify({ success: false, error: errorMessage }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
