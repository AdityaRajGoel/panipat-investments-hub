import fs from 'fs';
const path = 'supabase/functions/fetch-stock-prices/index.ts';
let code = fs.readFileSync(path, 'utf8');

const oldSymbols = `const COMMODITY_SYMBOLS = [
  { symbol: "GC=F", name: "GOLD", unit: "₹/10g", convert: true, factor: (10 / 31.1035) * 1.06 }, 
  { symbol: "SI=F", name: "SILVER", unit: "₹/kg", convert: true, factor: (1000 / 31.1035) * 1.06 }, 
  { symbol: "CL=F", name: "CRUDE OIL", unit: "₹/bbl", convert: true, factor: 1 },
  { symbol: "NG=F", name: "NAT GAS", unit: "₹/MMBtu", convert: true, factor: 1 },
  { symbol: "HG=F", name: "COPPER", unit: "₹/kg", convert: true, factor: 2.20462 }, 
  { symbol: "ALI=F", name: "ALUMINIUM", unit: "₹/kg", convert: true, factor: 2.20462 },
  { symbol: "ZW=F", name: "WHEAT", unit: "₹/quintal", convert: true, factor: 3.67437 },
  { symbol: "USDINR=X", name: "USD/INR", unit: "", convert: false, factor: 1 },
  { symbol: "EURINR=X", name: "EUR/INR", unit: "", convert: false, factor: 1 },
  { symbol: "GBPINR=X", name: "GBP/INR", unit: "", convert: false, factor: 1 },
  { symbol: "^INDIAVIX", name: "INDIA VIX", unit: "", convert: false, factor: 1 },
];`;

const newSymbols = `const ET_COMMODITIES = [
  { symbol: "GOLD", name: "GOLD", unit: "₹/10g" }, 
  { symbol: "SILVER", name: "SILVER", unit: "₹/kg" }, 
  { symbol: "CRUDEOIL", name: "CRUDE OIL", unit: "₹/bbl" },
  { symbol: "NATURALGAS", name: "NAT GAS", unit: "₹/MMBtu" },
  { symbol: "COPPER", name: "COPPER", unit: "₹/kg" }, 
  { symbol: "ALUMINIUM", name: "ALUMINIUM", unit: "₹/kg" },
];

const YAHOO_CURRENCIES = [
  { symbol: "USDINR=X", name: "USD/INR", unit: "" },
  { symbol: "EURINR=X", name: "EUR/INR", unit: "" },
  { symbol: "GBPINR=X", name: "GBP/INR", unit: "" },
  { symbol: "^INDIAVIX", name: "INDIA VIX", unit: "" },
];`;

code = code.replace(oldSymbols, newSymbols);

const fetchCodeToInsert = `async function fetchETCommodity(symbol: string) {
  try {
    const res = await fetch(\`https://economictimes.indiatimes.com/commoditysummary/symbol-\${symbol}.cms\`, {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    if (!res.ok) return null;
    const html = await res.text();
    const priceMatch = html.match(/class="commodityPrice"[^>]*>([^<]+)<\\//i);
    const changeMatch = html.match(/class="data perChng"[^>]*>([^<]+)<\\//i);
    
    if (!priceMatch) return null;
    
    const price = parseFloat(priceMatch[1].replace(/,/g, ''));
    let changePercent = 0;
    if (changeMatch) {
      const pMatch = changeMatch[1].match(/\\(([^)]+)\\)/);
      if (pMatch) {
        changePercent = parseFloat(pMatch[1].replace('%',''));
      }
    }
    
    return {
      price,
      changePercent,
      up: changePercent >= 0
    };
  } catch {
    return null;
  }
}

async function fetchYahooQuote(symbol: string): Promise<QuoteResult | null> {`;

code = code.replace("async function fetchYahooQuote(symbol: string): Promise<QuoteResult | null> {", fetchCodeToInsert);

const oldLogic = `      // First fetch USD/INR rate for commodity conversion
      (async () => {
        const usdInrQuote = await fetchYahooQuote("USDINR=X");
        const usdInrRate = usdInrQuote?.price || 83.5; // fallback rate

        const results = await Promise.all(COMMODITY_SYMBOLS.map(async (item) => {
          const q = await fetchYahooQuote(item.symbol);
          if (!q) return null;

          let displayPrice = q.price;
          if (item.convert && item.factor) {
            displayPrice = q.price * item.factor * usdInrRate;
          }

          const isCurrency = item.name.includes("INR");
          const isVix = item.name === "INDIA VIX";

          return {
            name: item.name,
            price: (isCurrency || isVix) ? formatPrice(displayPrice, false) : \`₹\${formatPrice(displayPrice)}\`,
            change: \`\${q.changePercent >= 0 ? '+' : ''}\${q.changePercent.toFixed(2)}%\`,
            up: q.changePercent >= 0,
            unit: item.unit,
          };
        }));
        return results;
      })(),`;

const newLogic = `      // Fetch ET Commodities and Yahoo Currencies independently
      (async () => {
        const etResults = await Promise.all(ET_COMMODITIES.map(async (item) => {
          const q = await fetchETCommodity(item.symbol);
          if (!q) return null;
          return {
            name: item.name,
            price: \`₹\${formatPrice(q.price)}\`,
            change: \`\${q.changePercent >= 0 ? '+' : ''}\${q.changePercent.toFixed(2)}%\`,
            up: q.changePercent >= 0,
            unit: item.unit,
          };
        }));
        
        const currencyResults = await Promise.all(YAHOO_CURRENCIES.map(async (item) => {
          const q = await fetchYahooQuote(item.symbol);
          if (!q) return null;
          return {
            name: item.name,
            price: formatPrice(q.price, false),
            change: \`\${q.changePercent >= 0 ? '+' : ''}\${q.changePercent.toFixed(2)}%\`,
            up: q.changePercent >= 0,
            unit: item.unit,
          };
        }));
        
        return [...etResults, ...currencyResults];
      })(),`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync(path, code);
console.log("Patched fetching logic successfully");
