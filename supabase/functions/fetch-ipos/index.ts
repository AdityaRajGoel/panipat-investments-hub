const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Source 1: Scrape from investorgain.com (most reliable for GMP data)
async function fetchFromInvestorGain(): Promise<any[] | null> {
  try {
    const res = await fetch('https://www.investorgain.com/report/live-ipo-gmp/331/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!res.ok) { await res.text(); return null; }
    const html = await res.text();
    return parseInvestorGainHtml(html);
  } catch (e) {
    console.log('InvestorGain error:', e);
    return null;
  }
}

function parseInvestorGainHtml(html: string): any[] | null {
  try {
    const rows: any[] = [];
    // Find the main GMP table
    const tableMatch = html.match(/<table[^>]*id="mainTable"[^>]*>([\s\S]*?)<\/table>/i) 
      || html.match(/<table[^>]*class="[^"]*table[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) return null;

    const tbodyMatch = tableMatch[1].match(/<tbody[^>]*>([\s\S]*?)<\/tbody>/i);
    const tableContent = tbodyMatch ? tbodyMatch[1] : tableMatch[1];
    
    const trMatches = tableContent.match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!trMatches || trMatches.length < 1) return null;

    const cleanText = (h: string) => h.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

    for (let i = 0; i < Math.min(trMatches.length, 30); i++) {
      const row = trMatches[i];
      const tdMatches = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (!tdMatches || tdMatches.length < 8) continue;

      const name = cleanText(tdMatches[0]).replace(/\s*(U|O|C|L@[\d.]+\s*\([^)]*\))\s*$/, '').trim();
      const gmpRaw = cleanText(tdMatches[1]);
      const price = cleanText(tdMatches[4]);
      const size = cleanText(tdMatches[5]);
      const lot = cleanText(tdMatches[6]);
      const openDate = cleanText(tdMatches[7]);
      const closeDate = cleanText(tdMatches[8]);
      const listingDate = tdMatches[10] ? cleanText(tdMatches[10]) : '';

      if (!name || name.length < 2 || name === '--') continue;

      // Parse GMP value
      const gmpMatch = gmpRaw.match(/₹\s*\*?\*?(-?\d+[\d.]*)/);
      const gmpNum = gmpMatch ? parseFloat(gmpMatch[1]) : 0;
      const gmpStr = gmpMatch ? `${gmpNum >= 0 ? '+' : ''}₹${Math.abs(gmpNum)}` : '₹0';

      // Determine status from row content
      const rowText = cleanText(row);
      let status: 'upcoming' | 'open' | 'listed' = 'upcoming';
      const listingMatch = cleanText(tdMatches[0]).match(/L@([\d.]+)\s*\(([^)]+)\)/);
      if (listingMatch) {
        status = 'listed';
      } else if (rowText.includes(' O ') || /\bO\b/.test(cleanText(tdMatches[0]).slice(-3))) {
        status = 'open';
      } else if (rowText.includes(' C ') || /\bC\b/.test(cleanText(tdMatches[0]).slice(-3))) {
        status = 'listed'; // closed = awaiting listing, treat as listed
      }

      // Format date
      let dateStr = 'TBA';
      if (openDate && closeDate) {
        dateStr = `${openDate} - ${closeDate} Mar`;
      } else if (openDate) {
        dateStr = `${openDate} Mar`;
      }

      // Listing gain
      let listingGain: string | undefined;
      let listingUp: boolean | undefined;
      if (listingMatch) {
        listingGain = listingMatch[2];
        listingUp = !listingGain.startsWith('-');
      }

      // Type detection
      const isSME = name.toLowerCase().includes('sme') || name.toLowerCase().includes('bse sme') || name.toLowerCase().includes('nse sme');
      const cleanName = name.replace(/\s*(NSE SME|BSE SME|NSE|BSE)\s*/gi, '').trim();

      rows.push({
        name: cleanName,
        price: price ? (price.includes('₹') ? price : `₹${price}`) : 'TBA',
        date: dateStr,
        size: size ? (size.toLowerCase().includes('cr') ? `₹${size}` : size.includes('Share') ? size : `₹${size} Cr`) : '-',
        gmp: gmpStr,
        gmpUp: gmpNum >= 0,
        status,
        type: isSME ? 'SME' : 'Mainboard',
        listingGain,
        listingUp,
        lot: lot || undefined,
      });
    }

    return rows.length > 0 ? rows : null;
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

// Source 2: ipoalerts.in API
async function fetchFromIPOAlerts(): Promise<any[] | null> {
  try {
    const statuses = ['open', 'upcoming', 'closed'];
    const allIPOs: any[] = [];

    for (const status of statuses) {
      try {
        const res = await fetch(`https://api.ipoalerts.in/ipos?status=${status}`, {
          headers: { 'Accept': 'application/json', 'User-Agent': 'ParasramIndia/1.0' },
          signal: AbortSignal.timeout(8000),
        });
        if (res.ok) {
          const data = await res.json();
          const ipos = Array.isArray(data) ? data : data?.ipos || data?.data || [];
          for (const ipo of ipos) {
            const name = ipo.company_name || ipo.name || ipo.companyName || '';
            if (!name || name.length < 2) continue;
            
            const price = ipo.price_band || ipo.price || ipo.priceBand || '';
            const gmpRaw = ipo.gmp ?? '';
            const gmpNum = parseFloat(String(gmpRaw).replace(/[₹,+\s]/g, ''));
            const openDate = ipo.open_date || ipo.openDate || '';
            const closeDate = ipo.close_date || ipo.closeDate || '';

            allIPOs.push({
              name,
              price: price ? (price.includes('₹') ? price : `₹${price}`) : 'TBA',
              date: openDate && closeDate ? `${openDate} - ${closeDate}` : openDate || ipo.date || 'TBA',
              size: ipo.issue_size || ipo.issueSize || '-',
              gmp: !isNaN(gmpNum) ? `${gmpNum >= 0 ? '+' : ''}₹${Math.abs(gmpNum)}` : 'TBA',
              gmpUp: !isNaN(gmpNum) ? gmpNum >= 0 : true,
              status: status === 'closed' ? 'listed' : status === 'open' ? 'open' : 'upcoming',
              type: (ipo.exchange || ipo.type || '').toLowerCase().includes('sme') ? 'SME' : 'Mainboard',
            });
          }
        } else {
          await res.text();
        }
      } catch (e) {
        console.log(`ipoalerts ${status} failed:`, e);
      }
    }
    return allIPOs.length > 0 ? allIPOs : null;
  } catch {
    return null;
  }
}

// Curated fallback with REAL data from InvestorGain (March 8, 2026)
function getCuratedIPOs() {
  return [
    // Upcoming IPOs (March 2026)
    { name: "Skyways Air", price: "TBA", date: "18-Mar - 20-Mar", size: "₹4.22 Cr", status: "upcoming", gmp: "₹0", gmpUp: true, type: "Mainboard" },
    { name: "Apsis Aerocom", price: "₹110", date: "11-Mar - 13-Mar", size: "₹33.95 Cr", status: "upcoming", gmp: "₹0", gmpUp: true, type: "SME" },
    { name: "Raajmarg Infra Investment Trust", price: "TBA", date: "11-Mar - 13-Mar", size: "₹6,000 Cr", status: "upcoming", gmp: "₹0", gmpUp: true, type: "Mainboard" },
    { name: "Innovision", price: "₹548", date: "10-Mar - 12-Mar", size: "₹322.84 Cr", status: "upcoming", gmp: "₹0", gmpUp: true, type: "Mainboard" },
    { name: "Rajputana Stainless", price: "₹122", date: "9-Mar - 11-Mar", size: "₹254.98 Cr", status: "upcoming", gmp: "+₹2", gmpUp: true, type: "Mainboard" },
    
    // Currently Open
    { name: "Srinibas Pradhan Constructions", price: "₹98", date: "6-Mar - 10-Mar", size: "₹19.30 Cr", status: "open", gmp: "₹0", gmpUp: true, type: "SME" },
    { name: "Elfin Agro India", price: "₹47", date: "5-Mar - 9-Mar", size: "₹23.77 Cr", status: "open", gmp: "₹0", gmpUp: true, type: "SME" },
    
    // Recently Listed
    { name: "SEDEMAC Mechatronics", price: "₹1,352", date: "4-Mar - 6-Mar", size: "₹1,087.45 Cr", status: "listed", gmp: "+₹11", gmpUp: true, type: "Mainboard", listingGain: "Awaiting listing", listingUp: true },
    { name: "PNGS Reva Diamond Jewellery", price: "₹386", date: "24-Feb - 26-Feb", size: "₹379.52 Cr", status: "listed", gmp: "-₹20", gmpUp: false, type: "Mainboard", listingGain: "-2.85%", listingUp: false },
    { name: "Clean Max Enviro Energy Solutions", price: "₹1,053", date: "23-Feb - 25-Feb", size: "₹3,079.88 Cr", status: "listed", gmp: "-₹35", gmpUp: false, type: "Mainboard", listingGain: "-8.83%", listingUp: false },
    { name: "Fractal Analytics", price: "₹900", date: "9-Feb - 11-Feb", size: "₹2,833.90 Cr", status: "listed", gmp: "-₹28", gmpUp: false, type: "Mainboard", listingGain: "-2.67%", listingUp: false },
    { name: "Aye Finance", price: "₹129", date: "9-Feb - 11-Feb", size: "₹1,010 Cr", status: "listed", gmp: "-₹2", gmpUp: false, type: "Mainboard", listingGain: "0%", listingUp: true },
  ];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Priority 1: InvestorGain (best GMP data)
    console.log('Attempting InvestorGain scrape...');
    let ipos = await fetchFromInvestorGain();
    let source = 'investorgain';

    // Priority 2: ipoalerts.in API
    if (!ipos || ipos.length < 3) {
      console.log('InvestorGain insufficient, trying ipoalerts.in...');
      const alertsData = await fetchFromIPOAlerts();
      if (alertsData && alertsData.length > (ipos?.length || 0)) {
        ipos = alertsData;
        source = 'ipoalerts';
      }
    }

    // Check data quality - supplement if needed
    const curated = getCuratedIPOs();
    let finalIpos: any[];

    if (ipos && ipos.length >= 5) {
      // Good amount of live data
      finalIpos = ipos;
      console.log(`Using ${ipos.length} live IPOs from ${source}`);
    } else if (ipos && ipos.length > 0) {
      // Some live data, merge with curated
      const liveNames = new Set(ipos.map((ipo: any) => ipo.name.toLowerCase()));
      const supplemented = curated.filter(c => !liveNames.has(c.name.toLowerCase()));
      finalIpos = [...ipos, ...supplemented];
      source = `${source}+curated`;
      console.log(`Merged ${ipos.length} live + ${supplemented.length} curated`);
    } else {
      console.log('All live sources failed, using curated data');
      finalIpos = curated;
      source = 'curated';
    }

    // Deduplicate and filter
    const seen = new Set<string>();
    finalIpos = finalIpos.filter((ipo: any) => {
      if (!ipo.name || ipo.name.length < 2) return false;
      const key = ipo.name.toLowerCase().replace(/\s*(ipo|limited|ltd)\s*/gi, '').trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return new Response(
      JSON.stringify({
        success: true,
        ipos: finalIpos,
        source,
        fetchedAt: new Date().toISOString(),
        count: finalIpos.length,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('IPO fetch error:', error);
    return new Response(
      JSON.stringify({
        success: true,
        ipos: getCuratedIPOs(),
        source: 'fallback',
        fetchedAt: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});