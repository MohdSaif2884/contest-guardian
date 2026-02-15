
-- Add auto_reminder_platforms column to profiles
ALTER TABLE public.profiles
ADD COLUMN auto_reminder_platforms text[] DEFAULT ARRAY[]::text[];
