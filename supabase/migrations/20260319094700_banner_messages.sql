-- Banner Messages table for admin-controlled website banners
-- Run this on the MAIN Supabase project (zbkjbbujsdlpujotgltm)
create table if not exists banner_messages (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  type text not null default 'info',
  link_url text,
  link_text text,
  is_active boolean not null default true,
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table banner_messages enable row level security;

-- Anyone can read active banners (public display)
DROP POLICY IF EXISTS "Public can view active banners" ON banner_messages;
create policy "Public can view active banners"
  on banner_messages for select
  using (is_active = true);

-- Authenticated users can read ALL banners (admin view)
DROP POLICY IF EXISTS "Authenticated users can view all banners" ON banner_messages;
create policy "Authenticated users can view all banners"
  on banner_messages for select
  to authenticated
  using (true);

-- Authenticated users can insert banners
DROP POLICY IF EXISTS "Authenticated users can insert banners" ON banner_messages;
create policy "Authenticated users can insert banners"
  on banner_messages for insert
  to authenticated
  with check (true);

-- Authenticated users can update banners
DROP POLICY IF EXISTS "Authenticated users can update banners" ON banner_messages;
create policy "Authenticated users can update banners"
  on banner_messages for update
  to authenticated
  using (true);

-- Authenticated users can delete banners
DROP POLICY IF EXISTS "Authenticated users can delete banners" ON banner_messages;
create policy "Authenticated users can delete banners"
  on banner_messages for delete
  to authenticated
  using (true);
