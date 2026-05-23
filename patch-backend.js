const fs = require('fs');
const path = 'supabase/functions/fetch-stock-prices/index.ts';
let code = fs.readFileSync(path, 'utf8');

const oldSymbols = `const COMMODITY_SYMBOLS = [
  { symbol: "GC=F", name: "GOLD", unit: "$/oz", isUSD: true },
  { symbol: "SI=F", name: "SILVER", unit: "$/oz", isUSD: true },
  { symbol: "CL=F", name: "CRUDE OIL", unit: "$/bbl", isUSD: true },
  { symbol: "NG=F", name: "NAT GAS", unit: "$/MMBtu", isUSD: true },
  { symbol: "HG=F", name: "COPPER", unit: "$/lb", isUSD: true },
  { symbol: "ALI=F", name: "ALUMINIUM", unit: "$/lb", isUSD: true },
  { symbol: "ZW=F", name: "WHEAT", unit: "$/bu", isUSD: true },
  { symbol: "USDINR=X", name: "USD/INR", unit: "", isUSD: false },
  { symbol: "EURINR=X", name: "EUR/INR", unit: "", isUSD: false },
  { symbol: "GBPINR=X", name: "GBP/INR", unit: "", isUSD: false },
  { symbol: "^INDIAVIX", name: "INDIA VIX", unit: "", isUSD: false },
];`;

const newSymbols = `const COMMODITY_SYMBOLS = [
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

code = code.replace(oldSymbols, newSymbols);

const oldLogic = `          let displayPrice = q.price;

          const isCurrency = item.name.includes("INR");
          const isVix = item.name === "INDIA VIX";

          let formattedPrice;
          if (item.isUSD) {
            formattedPrice = \`$\${formatPrice(displayPrice, false)}\`;
          } else if (isCurrency || isVix) {
            formattedPrice = formatPrice(displayPrice, false);
          } else {
            formattedPrice = \`₹\${formatPrice(displayPrice)}\`;
          }

          return {
            name: item.name,
            price: formattedPrice,`;

const newLogic = `          let displayPrice = q.price;
          if (item.convert && item.factor) {
            displayPrice = q.price * item.factor * usdInrRate;
          }

          const isCurrency = item.name.includes("INR");
          const isVix = item.name === "INDIA VIX";

          return {
            name: item.name,
            price: (isCurrency || isVix) ? formatPrice(displayPrice, false) : \`₹\${formatPrice(displayPrice)}\`,`;

code = code.replace(oldLogic, newLogic);
fs.writeFileSync(path, code);
console.log("Patched fetch-stock-prices successfully");
