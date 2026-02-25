const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const AI_GATEWAY_URL = 'https://ai.gateway.lovable.dev/v1/chat/completions';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, error: 'API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const today = new Date().toISOString().split('T')[0];

    const response = await fetch(AI_GATEWAY_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
        messages: [
          {
            role: 'system',
            content: `You are a financial news aggregator. Return a JSON object with two arrays: "indian" and "world". Each array should have exactly 6 news items. Each item should have: "title" (string, max 80 chars), "summary" (string, max 120 chars), "category" (one of: "Markets", "Economy", "Business", "Policy", "Banking", "Tech", "Global", "Commodities"), "timeAgo" (string like "2h ago", "5h ago", "1d ago"), "source" (string, realistic Indian/global financial news source). Make the news realistic, current-sounding for ${today}, focused on Indian stock markets, economy, RBI, and global markets. Return ONLY valid JSON, no markdown.`
          },
          {
            role: 'user',
            content: `Generate today's top financial news headlines for ${today}. Include Indian market news (Nifty, Sensex, RBI, Indian companies) and world news (Fed, global markets, crypto, oil). Make them sound like real headlines from Economic Times, Moneycontrol, LiveMint, Reuters, Bloomberg.`
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('AI Gateway error:', errText);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to generate news' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || '';
    
    // Parse JSON from response, handling potential markdown wrapping
    let newsData;
    try {
      const jsonStr = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      newsData = JSON.parse(jsonStr);
    } catch {
      console.error('Failed to parse AI response:', content);
      return new Response(
        JSON.stringify({ success: false, error: 'Failed to parse news data' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, ...newsData, fetchedAt: new Date().toISOString() }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error fetching news:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Failed to fetch news' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
