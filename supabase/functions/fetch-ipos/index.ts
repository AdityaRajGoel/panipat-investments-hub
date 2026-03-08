const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

// Source 1: ipoalerts.in free API
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
            allIPOs.push({
              name: ipo.company_name || ipo.name || ipo.companyName || '',
              price: ipo.price_band || ipo.price || ipo.priceBand || 'TBA',
              date: ipo.open_date ? `${ipo.open_date}${ipo.close_date ? ' - ' + ipo.close_date : ''}` : ipo.date || 'TBA',
              size: ipo.issue_size || ipo.issueSize || ipo.size || '-',
              gmp: ipo.gmp ? `${Number(ipo.gmp) >= 0 ? '+' : ''}₹${ipo.gmp}` : 'TBA',
              gmpUp: ipo.gmp ? Number(ipo.gmp) >= 0 : true,
              status: status === 'closed' ? 'listed' : status === 'open' ? 'open' : 'upcoming',
              type: (ipo.exchange || ipo.type || '').toLowerCase().includes('sme') ? 'SME' : 'Mainboard',
              listingGain: ipo.listing_gain || ipo.listingGain || undefined,
              listingUp: ipo.listing_gain ? parseFloat(String(ipo.listing_gain)) >= 0 : undefined,
            });
          }
        }
      } catch (e) {
        console.log(`ipoalerts ${status} fetch failed:`, e);
      }
    }

    return allIPOs.length > 0 ? allIPOs : null;
  } catch (e) {
    console.log('ipoalerts fetch error:', e);
    return null;
  }
}

// Source 2: Scrape from investorgain.com
async function fetchFromInvestorGain(): Promise<any[] | null> {
  try {
    const res = await fetch('https://www.investorgain.com/report/live-ipo-gmp/331/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok) return null;
    const html = await res.text();
    return parseIPOHtml(html);
  } catch (e) {
    console.log('InvestorGain fetch error:', e);
    return null;
  }
}

function parseIPOHtml(html: string): any[] | null {
  try {
    const rows: any[] = [];
    const tableMatch = html.match(/<table[^>]*class="[^"]*table[^"]*"[^>]*>([\s\S]*?)<\/table>/i);
    if (!tableMatch) return null;

    const trMatches = tableMatch[1].match(/<tr[^>]*>([\s\S]*?)<\/tr>/gi);
    if (!trMatches || trMatches.length < 2) return null;

    for (let i = 1; i < Math.min(trMatches.length, 25); i++) {
      const tdMatches = trMatches[i].match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
      if (!tdMatches || tdMatches.length < 4) continue;

      const cleanText = (h: string) => h.replace(/<[^>]*>/g, '').trim();
      const name = cleanText(tdMatches[0]);
      const price = cleanText(tdMatches[1]);
      const gmp = cleanText(tdMatches[2]);
      const date = cleanText(tdMatches[3]);
      const size = tdMatches[4] ? cleanText(tdMatches[4]) : '';

      if (name && price) {
        const gmpNum = parseFloat(gmp.replace(/[₹,+\s]/g, ''));
        const dateLower = date.toLowerCase();
        rows.push({
          name,
          price: price.includes('₹') ? price : `₹${price}`,
          gmp: gmp || '₹0',
          gmpUp: !isNaN(gmpNum) ? gmpNum >= 0 : true,
          date: date || 'TBA',
          size: size || '-',
          status: dateLower.includes('listed') ? 'listed' : dateLower.includes('open') ? 'open' : 'upcoming',
          type: 'Mainboard' as const,
        });
      }
    }

    return rows.length > 0 ? rows : null;
  } catch {
    return null;
  }
}

// Source 3: Curated fallback with recent real IPOs
function getCuratedIPOs() {
  return [
    { name: "Hexaware Technologies", price: "₹674-₹708", date: "Feb 12-14, 2025", size: "₹8,750 Cr", status: "listed", listingGain: "+4.2%", listingUp: true, type: "Mainboard", gmp: "+₹30", gmpUp: true },
    { name: "Dr Agarwal's Health Care", price: "₹382-₹402", date: "Jan 29-31, 2025", size: "₹3,027 Cr", status: "listed", listingGain: "+11.8%", listingUp: true, type: "Mainboard", gmp: "+₹45", gmpUp: true },
    { name: "Stallion India Fluorochemicals", price: "₹85-₹90", date: "Jan 16-20, 2025", size: "₹199 Cr", status: "listed", listingGain: "+90%", listingUp: true, type: "SME", gmp: "+₹80", gmpUp: true },
    { name: "Capital Infra Trust InvIT", price: "₹99-₹100", date: "Jan 7-9, 2025", size: "₹2,488 Cr", status: "listed", listingGain: "-2.5%", listingUp: false, type: "Mainboard", gmp: "-₹2", gmpUp: false },
    { name: "LG Electronics India", price: "₹1,485-₹1,560", date: "Expected Q1 2025", size: "₹15,000 Cr", status: "upcoming", gmp: "+₹120", gmpUp: true, type: "Mainboard" },
    { name: "Ather Energy", price: "₹304-₹321", date: "Expected Q2 2025", size: "₹3,100 Cr", status: "upcoming", gmp: "+₹45", gmpUp: true, type: "Mainboard" },
    { name: "PhonePe", price: "TBA", date: "Expected 2025", size: "₹10,000+ Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard" },
    { name: "Flipkart", price: "TBA", date: "Expected 2025-26", size: "₹25,000+ Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard" },
  ];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Try multiple sources in priority order
    console.log('Attempting ipoalerts.in API...');
    let ipos = await fetchFromIPOAlerts();
    let source = 'ipoalerts';

    if (!ipos || ipos.length === 0) {
      console.log('ipoalerts failed, trying InvestorGain scraper...');
      ipos = await fetchFromInvestorGain();
      source = 'investorgain';
    }

    if (!ipos || ipos.length === 0) {
      console.log('All live sources failed, using curated data');
      ipos = getCuratedIPOs();
      source = 'curated';
    }

    // Filter out entries with empty names
    ipos = ipos.filter((ipo: any) => ipo.name && ipo.name.length > 1);

    return new Response(
      JSON.stringify({
        success: true,
        ipos,
        source,
        fetchedAt: new Date().toISOString(),
        count: ipos.length,
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
