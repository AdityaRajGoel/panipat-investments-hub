-- Cache table for AI stock analysis reports.
-- One fresh report per symbol serves every viewer within the TTL window,
-- avoiding a repeat Yahoo fetch + LLM call on each "Analyze" click.
CREATE TABLE IF NOT EXISTS public.ai_stock_reports (
  symbol text PRIMARY KEY,
  report jsonb NOT NULL,
  model text,
  price numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Only the edge function (service role, which bypasses RLS) reads/writes this.
-- Enable RLS with no public policies so anon/authenticated clients can't touch it.
ALTER TABLE public.ai_stock_reports ENABLE ROW LEVEL SECURITY;

-- Index to prune/query by freshness.
CREATE INDEX IF NOT EXISTS idx_ai_stock_reports_created_at
  ON public.ai_stock_reports (created_at);
