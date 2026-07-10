import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

// Reads the admin-fed market tables (see supabase/migrations/20260709000000_market_feed.sql).
// FII/DII/MF flows are published daily after market close, so we show the
// latest available date rather than pretending they're intraday-live.

export type MarketFlow = {
  activity_date: string;
  category: "fii_cash" | "dii_cash" | "fii_fno" | "mf_activity";
  buy_cr: number;
  sell_cr: number;
};

export type CorporateAction = {
  id: string;
  company: string;
  action_type: string;
  details: string;
  ex_date: string;
};

export function useMarketFlows() {
  const [flows, setFlows] = useState<MarketFlow[]>([]);
  const [asOf, setAsOf] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // latest available date, then that date's rows
        const { data: latest } = await (supabase.from("market_flows" as never) as ReturnType<typeof supabase.from>)
          .select("activity_date")
          .order("activity_date", { ascending: false })
          .limit(1);
        const latestDate = (latest as { activity_date: string }[] | null)?.[0]?.activity_date;
        if (!latestDate) return;
        const { data } = await (supabase.from("market_flows" as never) as ReturnType<typeof supabase.from>)
          .select("activity_date, category, buy_cr, sell_cr")
          .eq("activity_date", latestDate);
        if (!cancelled && data) {
          setFlows(data as MarketFlow[]);
          setAsOf(latestDate);
        }
      } catch {
        // table may not exist yet - UI falls back to its awaiting-data state
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { flows, asOf, loading };
}

export type MfNav = {
  scheme_code: string;
  scheme_name: string;
  nav: number;
  prev_nav: number | null;
  nav_date: string;
};

export function useMfNavs() {
  const [navs, setNavs] = useState<MfNav[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await (supabase.from("mf_navs" as never) as ReturnType<typeof supabase.from>)
          .select("scheme_code, scheme_name, nav, prev_nav, nav_date")
          .order("scheme_name");
        if (!cancelled && data) setNavs(data as MfNav[]);
      } catch {
        // table may not exist yet - tab simply hides
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { navs, loading };
}

export function useCorporateActions() {
  const [actions, setActions] = useState<CorporateAction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await (supabase.from("corporate_actions" as never) as ReturnType<typeof supabase.from>)
          .select("id, company, action_type, details, ex_date")
          .gte("ex_date", new Date(Date.now() - 86400000).toISOString().slice(0, 10))
          .order("ex_date", { ascending: true })
          .limit(12);
        if (!cancelled && data) setActions(data as CorporateAction[]);
      } catch {
        // fall back to static list in the component
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { actions, loading };
}
