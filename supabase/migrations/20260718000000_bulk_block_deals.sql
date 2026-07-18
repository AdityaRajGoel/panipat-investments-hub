-- NSE bulk & block deals (who bought/sold big), auto-fed daily by sync-bhavcopy
-- from NSE's public archive CSVs (content/equities/bulk.csv and block.csv).
-- Only the latest published day is retained (the sync replaces older rows), so
-- this powers the "Bulk & Block Deals" board on the screener.
-- Run on the MAIN Supabase project (zbkjbbujsdlpujotgltm).

create table if not exists bulk_block_deals (
  id            bigint generated always as identity primary key,
  trade_date    date not null,
  deal_type     text not null check (deal_type in ('bulk', 'block')),
  symbol        text not null,
  security_name text,
  client_name   text,
  buy_sell      text,
  quantity      bigint,
  price         numeric,
  updated_at    timestamptz not null default now()
);

alter table bulk_block_deals enable row level security;

DROP POLICY IF EXISTS "Public can view bulk block deals" ON bulk_block_deals;
create policy "Public can view bulk block deals"
  on bulk_block_deals for select
  using (true);

-- writes come only from the service role (sync-bhavcopy); no other policies needed

create index if not exists bulk_block_deals_date_idx on bulk_block_deals (trade_date, deal_type);
