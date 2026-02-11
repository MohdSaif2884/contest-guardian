
-- Fix the overly permissive RLS policy on sync_logs
DROP POLICY IF EXISTS "Service role can manage sync logs" ON public.sync_logs;

-- Only admins can read, no one else needs direct access (edge functions use service role which bypasses RLS)
-- No INSERT/UPDATE/DELETE policies needed for regular users
