-- Migration: Update user profile handling on signup, RLS policies, and account deletion function

-- 1. Ensure columns exist on profiles table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'phone'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN phone TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'account_type'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN account_type TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'organization'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN organization TEXT;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'add_ons'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN add_ons TEXT[] DEFAULT '{}'::TEXT[];
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'onboarded'
  ) THEN
    ALTER TABLE public.profiles ADD COLUMN onboarded BOOLEAN DEFAULT false;
  END IF;
END $$;

-- 2. Enhanced handle_new_user trigger function to capture every registration field
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
    v_plan := v_plan_text::public.subscription_plan;
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

  -- Insert user role
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

-- 3. Row Level Security policies on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'profiles' AND policyname = 'Users can delete own profile'
  ) THEN
    CREATE POLICY "Users can delete own profile" ON public.profiles
      FOR DELETE TO authenticated USING (auth.uid() = id);
  END IF;
END $$;

-- 4. Secure Account Deletion Function
-- Allows authenticated users to permanently delete their own account and all associated data
CREATE OR REPLACE FUNCTION public.delete_user_account()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Authenticate caller
  v_user_id := auth.uid();
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Delete user data across all tables
  DELETE FROM public.document_reminders WHERE user_id = v_user_id;
  DELETE FROM public.compliance_documents WHERE user_id = v_user_id;
  DELETE FROM public.invoice_activities WHERE user_id = v_user_id;
  DELETE FROM public.invoices WHERE user_id = v_user_id;
  DELETE FROM public.invoice_templates WHERE user_id = v_user_id;
  DELETE FROM public.invoice_clients WHERE user_id = v_user_id;
  DELETE FROM public.receipts WHERE user_id = v_user_id;
  DELETE FROM public.subscriptions WHERE user_id = v_user_id;
  DELETE FROM public.user_roles WHERE user_id = v_user_id;
  DELETE FROM public.profiles WHERE id = v_user_id;

  -- Finally delete the auth user record
  DELETE FROM auth.users WHERE id = v_user_id;
END;
$$;

-- Grant execution permission to authenticated users only
REVOKE EXECUTE ON FUNCTION public.delete_user_account() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.delete_user_account() TO authenticated, service_role;

