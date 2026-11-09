-- Migration: Complete Base Schema, User Profiles, Auth Trigger, and Account Deletion

-- 1. Helper function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- 2. App roles enum and user_roles table
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'user_roles' AND policyname = 'Users can view their own roles'
  ) THEN
    CREATE POLICY "Users can view their own roles" ON public.user_roles
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;
END $$;

-- 3. Base profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  phone TEXT,
  business_name TEXT,
  organization TEXT,
  account_type TEXT,
  tin TEXT,
  nin TEXT,
  avatar_url TEXT,
  add_ons TEXT[] DEFAULT '{}'::TEXT[],
  onboarded BOOLEAN DEFAULT false,
  onboarding_step TEXT DEFAULT 'account',
  state_of_residence TEXT,
  employment_status TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Ensure all columns exist even if profiles already existed
DO $$
BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS business_name TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tin TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS nin TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS add_ons TEXT[] DEFAULT '{}'::TEXT[];
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarded BOOLEAN DEFAULT false;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'account';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_of_residence TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT;
END $$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

-- Profiles RLS policies
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users view own profile'
  ) THEN
    CREATE POLICY "Users view own profile" ON public.profiles
      FOR SELECT TO authenticated USING (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users update own profile'
  ) THEN
    CREATE POLICY "Users update own profile" ON public.profiles
      FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users insert own profile'
  ) THEN
    CREATE POLICY "Users insert own profile" ON public.profiles
      FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile" ON public.profiles
      FOR DELETE TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

-- 4. Subscription plan enum & table (needed by trigger)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
    CREATE TYPE public.subscription_plan AS ENUM (
      'free', 'starter', 'deluxe', 'pro', 'premium', 'business', 'enterprise'
    );
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE public.subscription_status AS ENUM (
      'active', 'trialing', 'past_due', 'canceled', 'expired'
    );
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  plan public.subscription_plan NOT NULL DEFAULT 'free',
  status public.subscription_status NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at TIMESTAMPTZ,
  provider TEXT,
  provider_subscription_id TEXT,
  billing_cycle TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- 5. Enhanced handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_plan public.subscription_plan := 'free';
  v_plan_text text;
  v_addons jsonb;
  v_addons_array text[] := '{}'::text[];
  v_phone text;
  v_account_type text;
  v_full_name text;
BEGIN
  -- Extract full_name
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );

  -- Extract phone
  v_phone := COALESCE(
    NEW.raw_user_meta_data->>'phone',
    NEW.phone
  );

  -- Extract desired_account_type
  v_account_type := COALESCE(
    NEW.raw_user_meta_data->>'desired_account_type',
    NEW.raw_user_meta_data->>'account_type'
  );

  -- Extract plan if valid
  v_plan_text := COALESCE(
    NEW.raw_user_meta_data->>'desired_plan',
    NEW.raw_user_meta_data->>'plan'
  );
  IF v_plan_text IN ('free', 'starter', 'deluxe', 'pro', 'premium', 'business', 'enterprise') THEN
    BEGIN
      v_plan := v_plan_text::public.subscription_plan;
    EXCEPTION WHEN OTHERS THEN
      v_plan := 'free';
    END;
  END IF;

  -- Extract add_ons array if provided
  v_addons := COALESCE(
    NEW.raw_user_meta_data->'desired_add_ons',
    NEW.raw_user_meta_data->'add_ons'
  );
  IF v_addons IS NOT NULL AND jsonb_typeof(v_addons) = 'array' THEN
    SELECT COALESCE(array_agg(x.value::text), '{}'::text[])
    INTO v_addons_array
    FROM jsonb_array_elements_text(v_addons) AS x(value);
  END IF;

  -- Insert or update profile with all registration fields
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    phone,
    account_type,
    add_ons,
    onboarded
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(v_full_name, ''),
    NULLIF(v_phone, ''),
    v_account_type,
    v_addons_array,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    phone = COALESCE(NULLIF(EXCLUDED.phone, ''), profiles.phone),
    account_type = COALESCE(EXCLUDED.account_type, profiles.account_type),
    add_ons = CASE 
      WHEN cardinality(EXCLUDED.add_ons) > 0 THEN EXCLUDED.add_ons 
      ELSE profiles.add_ons 
    END,
    updated_at = now();

  -- Insert default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id, role) DO NOTHING;

  -- Insert or update subscription
  INSERT INTO public.subscriptions (user_id, plan, status)
  VALUES (NEW.id, v_plan, 'active')
  ON CONFLICT (user_id) DO UPDATE SET
    plan = CASE 
      WHEN subscriptions.plan = 'free' AND EXCLUDED.plan <> 'free' THEN EXCLUDED.plan 
      ELSE subscriptions.plan 
    END,
    updated_at = now();

  RETURN NEW;
END;
$$;

-- Ensure trigger is active
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Secure Account Deletion Function
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user data across all tables safely
  IF to_regclass('public.document_reminders') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.document_reminders WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.compliance_documents') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.compliance_documents WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.invoice_activities') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.invoice_activities WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.invoices') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.invoices WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.invoice_templates') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.invoice_templates WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.invoice_clients') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.invoice_clients WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.receipts') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.receipts WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.feature_usage') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.feature_usage WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.payment_transactions') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.payment_transactions WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.subscriptions') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.subscriptions WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.user_roles WHERE user_id = $1' USING v_user_id;
  END IF;
  IF to_regclass('public.profiles') IS NOT NULL THEN
    EXECUTE 'DELETE FROM public.profiles WHERE id = $1' USING v_user_id;
  END IF;

  -- Finally delete the auth user record
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated, service_role;
