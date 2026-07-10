import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

// Simple session ID for grouping events
const getSessionId = () => {
  let sid = sessionStorage.getItem("analytics_sid");
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem("analytics_sid", sid);
  }
  return sid;
};

const trackEvent = async (
  pagePath: string,
  eventType: string = "page_view",
  metadata: Record<string, unknown> = {}
) => {
  try {
    await (supabase.from("page_analytics" as never) as ReturnType<typeof supabase.from>).insert({
      page_path: pagePath,
      event_type: eventType,
      session_id: getSessionId(),
      metadata,
    } as never);
  } catch {
    // Silent fail - analytics should never break the app
  }
};

/** Auto-tracks page views on route changes */
export const usePageTracking = () => {
  const location = useLocation();
  const lastPath = useRef("");

  useEffect(() => {
    if (location.pathname !== lastPath.current) {
      lastPath.current = location.pathname;
      trackEvent(location.pathname, "page_view");
    }
  }, [location.pathname]);
};

/** Track a custom event (form submission, stock view, etc.) */
export const trackCustomEvent = (
  eventType: string,
  metadata: Record<string, unknown> = {}
) => {
  trackEvent(window.location.pathname, eventType, metadata);
};

export default usePageTracking;
