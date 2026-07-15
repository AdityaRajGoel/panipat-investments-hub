-- End-of-day security-wise bhavcopy (price + delivery), auto-fed daily by
-- sync-bhavcopy from NSE's official public archive (sec_bhavdata_full_<date>.csv).
-- Only the latest trading day is retained (the sync prunes older dates), so this
-- powers "latest EOD download" and the Delivery % column on the screener.
-- Run on the MAIN Supabase project (zbkjbbujsdlpujotgltm).

create table if not exists bhavcopy_eod (
  symbol         text   not null,
  series         text   not null,
  trade_date     date   not null,
  prev_close     numeric,
  open           numeric,
  high           numeric,
  low            numeric,
  close          numeric,
  avg_price      numeric,
  ttl_trd_qty    bigint,
  turnover_lacs  numeric,
  no_of_trades   bigint,
  deliv_qty      bigint,
  deliv_per      numeric,
  updated_at     timestamptz not null default now(),
  primary key (symbol, series, trade_date)
);

alter table bhavcopy_eod enable row level security;

DROP POLICY IF EXISTS "Public can view bhavcopy" ON bhavcopy_eod;
create policy "Public can view bhavcopy"
  on bhavcopy_eod for select
  using (true);

-- writes come only from the service role (sync-bhavcopy); no other policies needed

create index if not exists bhavcopy_eod_date_idx on bhavcopy_eod (trade_date);
create index if not exists bhavcopy_eod_deliv_idx on bhavcopy_eod (trade_date, deliv_per desc);
