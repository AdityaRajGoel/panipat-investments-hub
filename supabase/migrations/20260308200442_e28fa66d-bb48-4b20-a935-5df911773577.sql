
CREATE TABLE public.screener_stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  symbol text NOT NULL UNIQUE,
  name text NOT NULL,
  sector text DEFAULT 'General',
  price numeric DEFAULT 0,
  change numeric DEFAULT 0,
  change_pct numeric DEFAULT 0,
  market_cap numeric DEFAULT 0,
  pe numeric DEFAULT 0,
  high_52 numeric DEFAULT 0,
  low_52 numeric DEFAULT 0,
  volume bigint DEFAULT 0,
  day_high numeric DEFAULT 0,
  day_low numeric DEFAULT 0,
  open_price numeric DEFAULT 0,
  prev_close numeric DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.screener_stocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view screener stocks"
ON public.screener_stocks
FOR SELECT
TO anon, authenticated
USING (true);
