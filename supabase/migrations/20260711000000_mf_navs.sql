-- Curated mutual-fund NAVs, auto-fed daily from AMFI by sync-market-feed.
-- Run on the MAIN Supabase project (zbkjbbujsdlpujotgltm).

create table if not exists mf_navs (
  scheme_code text primary key,
  scheme_name text not null,
  nav numeric not null,
  prev_nav numeric,
  nav_date date not null,
  updated_at timestamptz not null default now()
);

alter table mf_navs enable row level security;

DROP POLICY IF EXISTS "Public can view mf navs" ON mf_navs;
create policy "Public can view mf navs"
  on mf_navs for select
  using (true);

-- writes come only from the service role (sync function); no other policies needed
