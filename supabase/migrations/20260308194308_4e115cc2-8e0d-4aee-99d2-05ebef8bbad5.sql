-- Fix account_leads: drop broken RESTRICTIVE INSERT, add PERMISSIVE INSERT for anon
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.account_leads;

CREATE POLICY "Allow anonymous lead submission"
ON public.account_leads
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Fix account_leads: drop overly broad SELECT, restrict to service_role only
DROP POLICY IF EXISTS "Service role can read leads" ON public.account_leads;

-- No SELECT policy needed — service_role bypasses RLS anyway.
-- This ensures anon/authenticated users cannot read leads.