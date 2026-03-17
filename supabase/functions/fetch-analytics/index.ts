import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const { password, period } = body;

    // Verify admin password
    const adminPassword = Deno.env.get("ADMIN_PASSWORD");
    if (!password || password !== adminPassword) {
      return new Response(JSON.stringify({ success: false, error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const sb = createClient(supabaseUrl, serviceKey);

    // Default to last 30 days
    const days = period === "7d" ? 7 : period === "90d" ? 90 : 30;
    const since = new Date(Date.now() - days * 86400000).toISOString();

    // Page views
    const { data: pageViews } = await sb
      .from("page_analytics")
      .select("page_path, event_type, created_at, metadata, session_id")
      .gte("created_at", since)
      .order("created_at", { ascending: true });

    const events = pageViews || [];

    // Aggregate page views by path
    const pageMap: Record<string, number> = {};
    events.filter(e => e.event_type === "page_view").forEach(e => {
      pageMap[e.page_path] = (pageMap[e.page_path] || 0) + 1;
    });
    const topPages = Object.entries(pageMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(([path, views]) => ({ path, views }));

    // Daily views trend
    const dailyMap: Record<string, number> = {};
    events.filter(e => e.event_type === "page_view").forEach(e => {
      const day = e.created_at.slice(0, 10);
      dailyMap[day] = (dailyMap[day] || 0) + 1;
    });
    const dailyViews = Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, views]) => ({ date, views }));

    // Form conversions
    const formEvents = events.filter(e => e.event_type === "form_submission");
    const formMap: Record<string, number> = {};
    formEvents.forEach(e => {
      const form = (e.metadata as any)?.form || "unknown";
      formMap[form] = (formMap[form] || 0) + 1;
    });

    // Popular stocks viewed
    const stockEvents = events.filter(e => e.event_type === "stock_view");
    const stockMap: Record<string, number> = {};
    stockEvents.forEach(e => {
      const symbol = (e.metadata as any)?.symbol || "unknown";
      stockMap[symbol] = (stockMap[symbol] || 0) + 1;
    });
    const popularStocks = Object.entries(stockMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 20)
      .map(([symbol, views]) => ({ symbol, views }));

    // Unique sessions
    const uniqueSessions = new Set(events.map(e => e.session_id).filter(Boolean)).size;

    // Lead trends (from account_leads)
    const { data: leads } = await sb
      .from("account_leads")
      .select("status, created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: true });

    const leadDailyMap: Record<string, { total: number; new: number; contacted: number; converted: number; closed: number }> = {};
    (leads || []).forEach(l => {
      const day = l.created_at.slice(0, 10);
      if (!leadDailyMap[day]) leadDailyMap[day] = { total: 0, new: 0, contacted: 0, converted: 0, closed: 0 };
      leadDailyMap[day].total++;
      const s = l.status as keyof typeof leadDailyMap[string];
      if (s in leadDailyMap[day]) (leadDailyMap[day] as any)[s]++;
    });
    const leadTrend = Object.entries(leadDailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, data]) => ({ date, ...data }));

    return new Response(
      JSON.stringify({
        success: true,
        totalPageViews: events.filter(e => e.event_type === "page_view").length,
        uniqueSessions,
        topPages,
        dailyViews,
        formConversions: formMap,
        popularStocks,
        leadTrend,
        period: `${days}d`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch analytics";
    console.error("Analytics error:", error);
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
