const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

async function fetchRss(url: string, sourceName: string, defaultCategory: string) {
  try {
    const res = await fetch(url);
    if (!res.ok) return [];
    const xml = await res.text();
    
    // Very basic XML parsing using Regex to avoid heavy Deno dependencies
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].slice(0, 10);
    
    return items.map(match => {
      const itemStr = match[1];
      
      // Handle CDATA or regular text
      const titleMatch = itemStr.match(/<title>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/title>/i) || itemStr.match(/<title>\s*([\s\S]*?)\s*<\/title>/i);
      const descMatch = itemStr.match(/<description>\s*<!\[CDATA\[([\s\S]*?)\]\]>\s*<\/description>/i) || itemStr.match(/<description>\s*([\s\S]*?)\s*<\/description>/i);
      const dateMatch = itemStr.match(/<pubDate>\s*([\s\S]*?)\s*<\/pubDate>/i);
      
      const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : "Market Update";
      let summary = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : "Click to read more details about this market event.";
      
      // Decode basic HTML entities
      summary = summary.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, '&');
      
      if (summary.length > 150) summary = summary.substring(0, 147) + "...";
      if (!summary) summary = title; // fallback

      let date = new Date();
      if (dateMatch) {
         date = new Date(dateMatch[1]);
      }
      
      // Calculate timeAgo
      const diffMs = new Date().getTime() - date.getTime();
      const diffHrs = diffMs / (1000 * 60 * 60);
      let timeAgo = "Just now";
      if (diffHrs < 1) {
         timeAgo = `${Math.floor(diffHrs * 60)}m ago`;
      } else if (diffHrs < 24) {
         timeAgo = `${Math.floor(diffHrs)}h ago`;
      } else {
         timeAgo = `${Math.floor(diffHrs / 24)}d ago`;
      }

      return {
        title,
        summary,
        category: defaultCategory,
        timeAgo,
        source: sourceName
      };
    }).filter(i => i.title !== "Market Update");
  } catch (e) {
    console.error("RSS Fetch Error for", url, e);
    return [];
  }
}

async function getLiveNews() {
  // Fetch Indian News
  const etMarkets = await fetchRss("https://economictimes.indiatimes.com/markets/rssfeeds/1977021501.cms", "Economic Times", "Markets");
  const moneyControl = await fetchRss("https://www.moneycontrol.com/rss/MCtopnews.xml", "Moneycontrol", "Business");
  
  // Fetch World News
  const cnbcWorld = await fetchRss("https://search.cnbc.com/rs/search/combinedcms/view.xml?profile=120000000&id=10000664", "CNBC", "Global");
  const yahooFinance = await fetchRss("https://query2.finance.yahoo.com/v1/finance/rss/news", "Yahoo Finance", "Markets");

  const indian = [...etMarkets, ...moneyControl].slice(0, 8);
  const world = [...cnbcWorld, ...yahooFinance].slice(0, 8);

  return { indian, world };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const news = await getLiveNews();

    return new Response(
      JSON.stringify({ success: true, ...news, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch live news' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
