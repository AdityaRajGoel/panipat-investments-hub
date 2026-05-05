-- Telegram channel updates table
-- Run this on the MAIN Supabase project (zbkjbbujsdlpujotgltm)
create table if not exists telegram_updates (
  id uuid primary key default gen_random_uuid(),
  telegram_message_id bigint unique not null,
  message_text text,
  message_date timestamptz not null,
  has_photo boolean not null default false,
  photo_url text,
  is_forwarded boolean not null default false,
  forward_from_title text,
  created_at timestamptz not null default now()
);

-- Index for fast ordered queries
drop index if exists idx_telegram_updates_date;
create index idx_telegram_updates_date on telegram_updates(message_date desc);

-- Enable RLS
alter table telegram_updates enable row level security;

-- Anyone can read updates (public display on website)
DROP POLICY IF EXISTS "Public can view telegram updates" ON telegram_updates;
create policy "Public can view telegram updates"
  on telegram_updates for select
  using (true);

-- Only service role can insert (webhook edge function)
-- No insert/update/delete policies for anon role = only service_role can write
