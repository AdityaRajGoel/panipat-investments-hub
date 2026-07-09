-- Admin-fed market data: FII/DII/MF daily activity + corporate actions.
-- Run this on the MAIN Supabase project (zbkjbbujsdlpujotgltm).
-- Pattern mirrors banner_messages: public read, authenticated (admin) write.

-- ── Daily institutional / mutual fund flows ──────────────────────────────
create table if not exists market_flows (
  id uuid primary key default gen_random_uuid(),
  activity_date date not null,
  -- fii_cash | dii_cash | fii_fno | mf_activity
  category text not null check (category in ('fii_cash','dii_cash','fii_fno','mf_activity')),
  buy_cr numeric not null default 0,
  sell_cr numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (activity_date, category)
);

alter table market_flows enable row level security;

DROP POLICY IF EXISTS "Public can view market flows" ON market_flows;
create policy "Public can view market flows"
  on market_flows for select
  using (true);

DROP POLICY IF EXISTS "Authenticated users can insert market flows" ON market_flows;
create policy "Authenticated users can insert market flows"
  on market_flows for insert
  to authenticated
  with check (true);

DROP POLICY IF EXISTS "Authenticated users can update market flows" ON market_flows;
create policy "Authenticated users can update market flows"
  on market_flows for update
  to authenticated
  using (true);

DROP POLICY IF EXISTS "Authenticated users can delete market flows" ON market_flows;
create policy "Authenticated users can delete market flows"
  on market_flows for delete
  to authenticated
  using (true);

create index if not exists idx_market_flows_date on market_flows (activity_date desc);

-- ── Corporate actions (dividends, splits, bonus, buyback, results) ──────
create table if not exists corporate_actions (
  id uuid primary key default gen_random_uuid(),
  company text not null,
  -- Dividend | Bonus | Split | Buyback | Rights | Results | AGM | Other
  action_type text not null default 'Dividend',
  details text not null,           -- e.g. "₹18/share" or "1:1"
  ex_date date not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table corporate_actions enable row level security;

DROP POLICY IF EXISTS "Public can view active corporate actions" ON corporate_actions;
create policy "Public can view active corporate actions"
  on corporate_actions for select
  using (is_active = true);

DROP POLICY IF EXISTS "Authenticated users can view all corporate actions" ON corporate_actions;
create policy "Authenticated users can view all corporate actions"
  on corporate_actions for select
  to authenticated
  using (true);

DROP POLICY IF EXISTS "Authenticated users can insert corporate actions" ON corporate_actions;
create policy "Authenticated users can insert corporate actions"
  on corporate_actions for insert
  to authenticated
  with check (true);

DROP POLICY IF EXISTS "Authenticated users can update corporate actions" ON corporate_actions;
create policy "Authenticated users can update corporate actions"
  on corporate_actions for update
  to authenticated
  using (true);

DROP POLICY IF EXISTS "Authenticated users can delete corporate actions" ON corporate_actions;
create policy "Authenticated users can delete corporate actions"
  on corporate_actions for delete
  to authenticated
  using (true);

create index if not exists idx_corporate_actions_exdate on corporate_actions (ex_date desc);
