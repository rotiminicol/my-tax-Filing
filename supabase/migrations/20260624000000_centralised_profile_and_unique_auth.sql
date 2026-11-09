-- Migration: Centralised User Profile, Unique Email and Phone Constraints, Availability Check, and Phone Login Lookup

-- 1. Ensure profiles table exists with all columns
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

-- Ensure columns exist
DO $$
BEGIN
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS account_type TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS organization TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_step TEXT DEFAULT 'account';
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS state_of_residence TEXT;
  ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employment_status TEXT;
END $$;

-- 2. Enforce Unique Indexes on profiles (email and phone)
CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_email_unique
  ON public.profiles (lower(trim(email)))
  WHERE email IS NOT NULL AND email != '';

CREATE UNIQUE INDEX IF NOT EXISTS idx_profiles_phone_unique
  ON public.profiles (trim(phone))
  WHERE phone IS NOT NULL AND phone != '';

-- 3. Function to check registration availability (securely checks uniqueness on backend)
CREATE OR REPLACE FUNCTION public.check_registration_availability(p_email TEXT, p_phone TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_email_clean TEXT := lower(trim(COALESCE(p_email, '')));
  v_phone_clean TEXT := trim(COALESCE(p_phone, ''));
  v_normalized_phone TEXT;
  v_email_taken BOOLEAN := false;
  v_phone_taken BOOLEAN := false;
BEGIN
  -- Normalize phone for flexible lookup
  IF v_phone_clean != '' THEN
    v_normalized_phone := regexp_replace(v_phone_clean, '[\s\-\(\)]', '', 'g');
    IF NOT v_normalized_phone LIKE '+%' THEN
      IF v_normalized_phone LIKE '234%' THEN
        v_normalized_phone := '+' || v_normalized_phone;
      ELSIF v_normalized_phone LIKE '0%' THEN
        v_normalized_phone := '+234' || substr(v_normalized_phone, 2);
      ELSE
        v_normalized_phone := '+234' || v_normalized_phone;
      END IF;
    END IF;
  END IF;

  -- Check email across auth.users and profiles
  IF v_email_clean != '' THEN
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE lower(trim(email)) = v_email_clean
      UNION
      SELECT 1 FROM public.profiles WHERE lower(trim(email)) = v_email_clean
    ) INTO v_email_taken;
  END IF;

  -- Check phone across auth.users and profiles
  IF v_phone_clean != '' THEN
    SELECT EXISTS (
      SELECT 1 FROM auth.users WHERE phone = v_phone_clean OR phone = v_normalized_phone
      UNION
      SELECT 1 FROM public.profiles WHERE phone = v_phone_clean OR phone = v_normalized_phone
    ) INTO v_phone_taken;
  END IF;

  RETURN jsonb_build_object(
    'email_taken', v_email_taken,
    'phone_taken', v_phone_taken
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.check_registration_availability(TEXT, TEXT) TO anon, authenticated, service_role;

-- 4. Function to resolve login identifier (supports logging in by phone or email)
CREATE OR REPLACE FUNCTION public.get_login_identifier(p_identifier TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean TEXT := trim(COALESCE(p_identifier, ''));
  v_digits TEXT;
  v_normalized_phone TEXT;
  v_email TEXT;
BEGIN
  -- If it's already an email format
  IF v_clean LIKE '%@%.%' THEN
    RETURN jsonb_build_object('found', true, 'type', 'email', 'email', lower(v_clean));
  END IF;

  -- Normalize phone variations
  v_digits := regexp_replace(v_clean, '\D', '', 'g');
  IF v_clean LIKE '+%' THEN
    v_normalized_phone := v_clean;
  ELSIF v_digits LIKE '234%' THEN
    v_normalized_phone := '+' || v_digits;
  ELSIF length(v_digits) >= 10 THEN
    v_normalized_phone := '+234' || regexp_replace(v_digits, '^0+', '');
  ELSE
    v_normalized_phone := v_clean;
  END IF;

  -- Check profiles for associated email
  SELECT email INTO v_email
  FROM public.profiles
  WHERE phone = v_clean
     OR phone = v_normalized_phone
     OR regexp_replace(phone, '\D', '', 'g') = v_digits
  LIMIT 1;

  IF v_email IS NOT NULL AND v_email != '' THEN
    RETURN jsonb_build_object('found', true, 'type', 'phone', 'email', lower(v_email));
  END IF;

  -- Also check auth.users directly
  SELECT email INTO v_email
  FROM auth.users
  WHERE phone = v_clean
     OR phone = v_normalized_phone
     OR regexp_replace(phone, '\D', '', 'g') = v_digits
  LIMIT 1;

  IF v_email IS NOT NULL AND v_email != '' THEN
    RETURN jsonb_build_object('found', true, 'type', 'phone', 'email', lower(v_email));
  END IF;

  RETURN jsonb_build_object('found', false);
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_login_identifier(TEXT) TO anon, authenticated, service_role;

-- 5. Enhanced handle_new_user trigger enforcing uniqueness and centralised profile creation
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
  v_step text := 'account';
  v_existing_user_id uuid;
BEGIN
  -- Extract full_name
  v_full_name := COALESCE(
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'name',
    ''
  );

  -- Extract phone
  v_phone := NULLIF(trim(COALESCE(
    NEW.raw_user_meta_data->>'phone',
    NEW.phone,
    ''
  )), '');

  -- Enforce uniqueness of phone if provided
  IF v_phone IS NOT NULL THEN
    SELECT id INTO v_existing_user_id
    FROM public.profiles
    WHERE phone = v_phone AND id <> NEW.id
    LIMIT 1;

    IF v_existing_user_id IS NOT NULL THEN
      RAISE EXCEPTION 'Phone number % is already associated with another account.', v_phone;
    END IF;
  END IF;

  -- Extract desired_account_type
  v_account_type := COALESCE(
    NEW.raw_user_meta_data->>'desired_account_type',
    NEW.raw_user_meta_data->>'account_type'
  );

  -- If account type was chosen during signup, advance onboarding step
  IF v_account_type IS NOT NULL AND v_account_type != '' THEN
    v_step := 'plan';
  END IF;

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
    onboarded,
    onboarding_step
  )
  VALUES (
    NEW.id,
    NEW.email,
    NULLIF(v_full_name, ''),
    v_phone,
    v_account_type,
    v_addons_array,
    false,
    v_step
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    phone = COALESCE(EXCLUDED.phone, profiles.phone),
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

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
