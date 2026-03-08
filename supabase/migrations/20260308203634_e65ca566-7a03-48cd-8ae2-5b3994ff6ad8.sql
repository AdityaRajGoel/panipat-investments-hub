
CREATE TABLE public.page_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path text NOT NULL,
  event_type text NOT NULL DEFAULT 'page_view',
  metadata jsonb DEFAULT '{}'::jsonb,
  session_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.page_analytics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anonymous inserts" ON public.page_analytics FOR INSERT WITH CHECK (true);

CREATE POLICY "No public reads" ON public.page_analytics FOR SELECT USING (false);

CREATE INDEX idx_analytics_page ON public.page_analytics(page_path);
CREATE INDEX idx_analytics_created ON public.page_analytics(created_at);
CREATE INDEX idx_analytics_event ON public.page_analytics(event_type);

CREATE TABLE public.market_cache (
  id text PRIMARY KEY,
  data jsonb NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.market_cache ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read cache" ON public.market_cache FOR SELECT USING (true);
