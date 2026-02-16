
-- Add unique constraint for auto-subscribe upsert support
ALTER TABLE public.contest_subscriptions
ADD CONSTRAINT contest_subscriptions_user_contest_unique UNIQUE (user_id, contest_id);
