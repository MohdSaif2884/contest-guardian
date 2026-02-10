
-- Enums
CREATE TYPE public.subscription_status AS ENUM ('free', 'pro');
CREATE TYPE public.reminder_status AS ENUM ('pending', 'sent', 'failed');
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ========== USER ROLES (create first for is_admin) ==========
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Helper function: check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- user_roles RLS
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE USING (public.is_admin());

-- ========== PROFILES ==========
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  reminder_offsets JSONB NOT NULL DEFAULT '[30, 60]'::jsonb,
  notification_channels JSONB NOT NULL DEFAULT '{"email": true, "browser": true, "whatsapp": false}'::jsonb,
  subscription_status public.subscription_status NOT NULL DEFAULT 'free',
  rating_codeforces INTEGER,
  rating_codechef INTEGER,
  rating_leetcode INTEGER,
  preferred_platforms TEXT[] DEFAULT ARRAY['codeforces', 'leetcode', 'codechef', 'atcoder'],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ========== CONTESTS ==========
CREATE TABLE public.contests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  platform TEXT NOT NULL,
  name TEXT NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL DEFAULT 0,
  url TEXT NOT NULL,
  difficulty TEXT,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  external_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(platform, external_id)
);

ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Contests are publicly readable" ON public.contests FOR SELECT USING (true);
CREATE POLICY "Admins can insert contests" ON public.contests FOR INSERT WITH CHECK (public.is_admin());
CREATE POLICY "Admins can update contests" ON public.contests FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admins can delete contests" ON public.contests FOR DELETE USING (public.is_admin());

CREATE TRIGGER update_contests_updated_at BEFORE UPDATE ON public.contests FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_contests_start_time ON public.contests (start_time);
CREATE INDEX idx_contests_platform ON public.contests (platform);

-- ========== CONTEST SUBSCRIPTIONS ==========
CREATE TABLE public.contest_subscriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, contest_id)
);

ALTER TABLE public.contest_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions" ON public.contest_subscriptions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can subscribe" ON public.contest_subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unsubscribe" ON public.contest_subscriptions FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX idx_contest_subs_user ON public.contest_subscriptions (user_id);

-- ========== REMINDERS ==========
CREATE TABLE public.reminders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  reminder_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status public.reminder_status NOT NULL DEFAULT 'pending',
  channel TEXT NOT NULL DEFAULT 'browser',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own reminders" ON public.reminders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can create reminders" ON public.reminders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reminders" ON public.reminders FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reminders" ON public.reminders FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_reminders_updated_at BEFORE UPDATE ON public.reminders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_reminders_user ON public.reminders (user_id);
CREATE INDEX idx_reminders_status ON public.reminders (status);
CREATE INDEX idx_reminders_time ON public.reminders (reminder_time);

-- ========== SUBMISSIONS ==========
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contest_id UUID NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  solved INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  rating_change INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, contest_id)
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions" ON public.submissions FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "Users can insert own submissions" ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own submissions" ON public.submissions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can delete submissions" ON public.submissions FOR DELETE USING (public.is_admin());

CREATE TRIGGER update_submissions_updated_at BEFORE UPDATE ON public.submissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_submissions_user ON public.submissions (user_id);
