-- Per-client rate limiting for the AI stock analysis edge function.
-- Protects against spamming expensive Yahoo + LLM calls with the public anon key.
create table if not exists public.ai_rate_limits (
  bucket text primary key,
  count int not null default 0,
  expires_at timestamptz not null
);

alter table public.ai_rate_limits enable row level security;
-- Only the edge function (service role, bypasses RLS) touches this. No public policies.

-- Atomic check-and-increment. Returns true if the request is within the limit.
-- A single upsert keeps it race-free under concurrent requests.
create or replace function public.check_ai_rate_limit(
  p_bucket text,
  p_max int,
  p_window_seconds int
) returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  v_count int;
begin
  insert into public.ai_rate_limits (bucket, count, expires_at)
  values (p_bucket, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (bucket) do update
    set count = case
                  when public.ai_rate_limits.expires_at < now() then 1
                  else public.ai_rate_limits.count + 1
                end,
        expires_at = case
                       when public.ai_rate_limits.expires_at < now()
                         then now() + make_interval(secs => p_window_seconds)
                       else public.ai_rate_limits.expires_at
                     end
  returning count into v_count;

  return v_count <= p_max;
end;
$$;
