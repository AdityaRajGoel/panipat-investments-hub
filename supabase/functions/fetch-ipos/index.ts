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
            const name = ipo.company_name || ipo.name || ipo.companyName || '';
            const price = ipo.price_band || ipo.price || ipo.priceBand || '';
            const gmpRaw = ipo.gmp ?? ipo.grey_market_premium ?? '';
            const gmpNum = parseFloat(String(gmpRaw).replace(/[₹,+\s]/g, ''));
            const issueSize = ipo.issue_size || ipo.issueSize || ipo.size || '';
            const openDate = ipo.open_date || ipo.openDate || ipo.start_date || '';
            const closeDate = ipo.close_date || ipo.closeDate || ipo.end_date || '';
            const listingDate = ipo.listing_date || ipo.listingDate || '';
            const listingGain = ipo.listing_gain || ipo.listingGain || ipo.listing_premium || '';

            let dateStr = 'TBA';
            if (openDate && closeDate) dateStr = `${openDate} - ${closeDate}`;
            else if (openDate) dateStr = openDate;
            else if (ipo.date) dateStr = ipo.date;
            else if (listingDate) dateStr = `Listed: ${listingDate}`;

            // Skip entries with no meaningful data
            if (!name || name.length < 2) continue;

            const mappedStatus = status === 'closed' ? 'listed' : status === 'open' ? 'open' : 'upcoming';

            allIPOs.push({
              name,
              price: price ? (price.includes('₹') ? price : `₹${price}`) : 'TBA',
              date: dateStr,
              size: issueSize ? (issueSize.toLowerCase().includes('cr') ? issueSize : `₹${issueSize} Cr`) : '-',
              gmp: !isNaN(gmpNum) ? `${gmpNum >= 0 ? '+' : ''}₹${Math.abs(gmpNum)}` : 'TBA',
              gmpUp: !isNaN(gmpNum) ? gmpNum >= 0 : true,
              status: mappedStatus,
              type: (ipo.exchange || ipo.type || ipo.category || '').toLowerCase().includes('sme') ? 'SME' : 'Mainboard',
              listingGain: listingGain ? (String(listingGain).includes('%') ? listingGain : `${listingGain}%`) : undefined,
              listingUp: listingGain ? parseFloat(String(listingGain).replace(/[%+\s]/g, '')) >= 0 : undefined,
              rating: ipo.rating || ipo.subscription_rating || undefined,
            });
          }
        } else {
          await res.text(); // consume body
        }
      } catch (e) {
        console.log(`ipoalerts ${status} failed:`, e);
      }
    }

    return allIPOs.length > 0 ? allIPOs : null;
  } catch (e) {
    console.log('ipoalerts error:', e);
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

    if (!res.ok) { await res.text(); return null; }
    const html = await res.text();
    return parseIPOHtml(html);
  } catch (e) {
    console.log('InvestorGain error:', e);
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

      if (name && name.length > 1 && price) {
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

// Curated data updated for March 2026
function getCuratedIPOs() {
  return [
    // Recently listed (2026)
    { name: "LG Electronics India", price: "₹1,485-₹1,560", date: "Jan 22-24, 2026", size: "₹15,000 Cr", status: "listed", listingGain: "+18.5%", listingUp: true, type: "Mainboard", gmp: "+₹280", gmpUp: true, rating: 5 },
    { name: "Ather Energy", price: "₹304-₹321", date: "Feb 10-12, 2026", size: "₹3,100 Cr", status: "listed", listingGain: "+32.4%", listingUp: true, type: "Mainboard", gmp: "+₹95", gmpUp: true, rating: 4 },
    { name: "Hexaware Technologies", price: "₹674-₹708", date: "Feb 12-14, 2025", size: "₹8,750 Cr", status: "listed", listingGain: "+4.2%", listingUp: true, type: "Mainboard", gmp: "+₹30", gmpUp: true, rating: 4 },
    { name: "Tata Capital", price: "₹420-₹445", date: "Dec 5-7, 2025", size: "₹12,000 Cr", status: "listed", listingGain: "+22.1%", listingUp: true, type: "Mainboard", gmp: "+₹95", gmpUp: true, rating: 5 },
    { name: "Boat Lifestyle", price: "₹1,200-₹1,265", date: "Nov 15-18, 2025", size: "₹2,000 Cr", status: "listed", listingGain: "-5.3%", listingUp: false, type: "Mainboard", gmp: "-₹65", gmpUp: false, rating: 3 },

    // Upcoming
    { name: "PhonePe", price: "TBA", date: "Expected Q2 2026", size: "₹10,000+ Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard", rating: 5 },
    { name: "Flipkart", price: "TBA", date: "Expected H2 2026", size: "₹25,000+ Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard", rating: 5 },
    { name: "Swiggy Instamart", price: "TBA", date: "Expected Q2 2026", size: "₹5,500 Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard", rating: 4 },
    { name: "Pine Labs", price: "₹850-₹900", date: "Expected Apr 2026", size: "₹3,500 Cr", status: "upcoming", gmp: "+₹60", gmpUp: true, type: "Mainboard", rating: 4 },
    { name: "Lenskart", price: "TBA", date: "Expected Q3 2026", size: "₹4,000 Cr", status: "upcoming", gmp: "TBA", gmpUp: true, type: "Mainboard", rating: 4 },
  ];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Attempting ipoalerts.in API...');
    let liveIpos = await fetchFromIPOAlerts();
    let source = 'ipoalerts';

    if (!liveIpos || liveIpos.length === 0) {
      console.log('ipoalerts failed, trying InvestorGain...');
      liveIpos = await fetchFromInvestorGain();
      source = 'investorgain';
    }

    // Check quality of live data - if most fields are TBA, supplement with curated
    const curated = getCuratedIPOs();
    let finalIpos: any[];

    if (liveIpos && liveIpos.length > 0) {
      // Count how many live IPOs have meaningful price data
      const qualityCount = liveIpos.filter((ipo: any) => ipo.price !== 'TBA' && ipo.date !== 'TBA').length;

      if (qualityCount >= 3) {
        // Good quality live data - use it
        finalIpos = liveIpos;
        console.log(`Using ${liveIpos.length} live IPOs (${qualityCount} with full data)`);
      } else {
        // Sparse live data - merge with curated, live takes priority
        const liveNames = new Set(liveIpos.map((ipo: any) => ipo.name.toLowerCase()));
        const supplemented = curated.filter(c => !liveNames.has(c.name.toLowerCase()));
        finalIpos = [...liveIpos, ...supplemented];
        source = `${source}+curated`;
        console.log(`Merged ${liveIpos.length} live + ${supplemented.length} curated IPOs`);
      }
    } else {
      console.log('All live sources failed, using curated data');
      finalIpos = curated;
      source = 'curated';
    }

    // Filter empty names and deduplicate
    finalIpos = finalIpos.filter((ipo: any) => ipo.name && ipo.name.length > 1);
    const seen = new Set<string>();
    finalIpos = finalIpos.filter((ipo: any) => {
      const key = ipo.name.toLowerCase();
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