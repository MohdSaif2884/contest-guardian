
-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_contests_start_time ON public.contests (start_time);
CREATE INDEX IF NOT EXISTS idx_contests_platform ON public.contests (platform);
CREATE INDEX IF NOT EXISTS idx_contests_is_featured ON public.contests (is_featured);
CREATE INDEX IF NOT EXISTS idx_contests_external_id ON public.contests (external_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_contests_platform_external_id ON public.contests (platform, external_id);

-- Add indexes for reminders
CREATE INDEX IF NOT EXISTS idx_reminders_status ON public.reminders (status);
CREATE INDEX IF NOT EXISTS idx_reminders_reminder_time ON public.reminders (reminder_time);
CREATE INDEX IF NOT EXISTS idx_reminders_user_contest ON public.reminders (user_id, contest_id);

-- Add sync_log table for tracking sync operations
CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sync_type TEXT NOT NULL,
  platform TEXT,
  contests_synced INTEGER DEFAULT 0,
  error_message TEXT,
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'running'
);

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view sync logs" ON public.sync_logs
FOR SELECT USING (is_admin());

CREATE POLICY "Service role can manage sync logs" ON public.sync_logs
FOR ALL USING (true) WITH CHECK (true);

-- Enable pg_cron and pg_net extensions for scheduled functions
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA pg_catalog;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;
