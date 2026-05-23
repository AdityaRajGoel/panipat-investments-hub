const symbols = ["GOLD.NS", "GOLD.BO", "MCXGOLD.NS", "MCXGOLD", "GC=F", "SILVER.NS", "CRUDEOIL.NS"];
for (const symbol of symbols) {
  const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1d`, {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  if (res.ok) {
    const data = await res.json();
    if (data.chart.result) {
      console.log(symbol, "SUCCESS", data.chart.result[0].meta.regularMarketPrice);
    } else {
      console.log(symbol, "NO RESULT");
    }
  } else {
    console.log(symbol, "HTTP ERROR", res.status);
  }
}
