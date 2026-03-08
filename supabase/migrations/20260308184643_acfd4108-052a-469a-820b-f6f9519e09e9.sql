
CREATE TABLE public.account_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  city text,
  message text,
  status text NOT NULL DEFAULT 'new',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.account_leads ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (no auth required for lead form)
CREATE POLICY "Anyone can submit a lead"
  ON public.account_leads
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Only service role can read (for admin)
CREATE POLICY "Service role can read leads"
  ON public.account_leads
  FOR SELECT
  TO service_role
  USING (true);
