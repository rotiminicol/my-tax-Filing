-- MyTaxFiling custom application authentication
-- Account creation is owned by the FastAPI backend. This migration deliberately
-- does not create users in auth.users or use Supabase Auth triggers.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  password_hash TEXT NOT NULL,
  email_verified_at TIMESTAMPTZ,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'disabled')),
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_users_email_unique ON public.app_users (lower(trim(email)));
CREATE UNIQUE INDEX IF NOT EXISTS idx_app_users_phone_unique ON public.app_users (trim(phone)) WHERE phone IS NOT NULL AND trim(phone) <> '';
ALTER TABLE public.app_users ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.app_users FROM anon, authenticated;
GRANT ALL ON public.app_users TO service_role;

CREATE TABLE IF NOT EXISTS public.auth_signup_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  phone TEXT,
  full_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  desired_plan TEXT NOT NULL DEFAULT 'free',
  account_type TEXT,
  add_ons TEXT[] NOT NULL DEFAULT '{}'::TEXT[],
  expires_at TIMESTAMPTZ NOT NULL DEFAULT now() + interval '30 minutes',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS idx_signup_requests_email_unique ON public.auth_signup_requests (lower(trim(email)));
ALTER TABLE public.auth_signup_requests ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_signup_requests FROM anon, authenticated;
GRANT ALL ON public.auth_signup_requests TO service_role;

CREATE TABLE IF NOT EXISTS public.auth_otp_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  purpose TEXT NOT NULL CHECK (purpose IN ('signup_verification', 'password_reset')),
  code_hash TEXT NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  last_sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  consumed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_auth_otp_lookup ON public.auth_otp_codes (lower(trim(email)), purpose, created_at DESC);
ALTER TABLE public.auth_otp_codes ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON public.auth_otp_codes FROM anon, authenticated;
GRANT ALL ON public.auth_otp_codes TO service_role;

-- Backfill identities that already exist in Supabase Auth. This does not create
-- any new Supabase Auth users; it only preserves existing application data while
-- the application moves to its own identity table.
INSERT INTO public.app_users (id, email, phone, password_hash, email_verified_at, created_at, updated_at)
SELECT id, lower(trim(email)), phone, encrypted_password, email_confirmed_at,
       COALESCE(created_at, now()), COALESCE(updated_at, now())
FROM auth.users
WHERE email IS NOT NULL
ON CONFLICT (id) DO NOTHING;

-- Move application-owned profile/subscription/role identity away from auth.users.
-- Existing auth.users records are intentionally not used for new accounts.
DO $$
DECLARE
  c RECORD;
BEGIN
  IF to_regclass('public.profiles') IS NOT NULL THEN
    ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;
    IF NOT EXISTS (
      SELECT 1 FROM pg_constraint WHERE conname = 'profiles_id_app_users_fkey'
    ) THEN
      ALTER TABLE public.profiles ADD CONSTRAINT profiles_id_app_users_fkey FOREIGN KEY (id) REFERENCES public.app_users(id) ON DELETE CASCADE;
    END IF;
  END IF;
  FOR c IN
    SELECT conrelid::regclass AS table_name, conname
    FROM pg_constraint
    JOIN pg_class child_table ON child_table.oid = conrelid
    JOIN pg_namespace child_schema ON child_schema.oid = child_table.relnamespace
    WHERE contype = 'f'
      AND confrelid = 'auth.users'::regclass
      AND child_schema.nspname = 'public'
  LOOP
    EXECUTE format('ALTER TABLE %s DROP CONSTRAINT %I', c.table_name, c.conname);
  END LOOP;
END $$;

-- Re-add identity foreign keys for existing application tables where present.
DO $$
DECLARE
  t TEXT;
  col TEXT;
BEGIN
  FOREACH t IN ARRAY ARRAY['user_roles','subscriptions','payment_transactions','feature_usage','user_notification_preferences','email_logs','contact_messages','admin_audit_log'] LOOP
    IF to_regclass('public.' || t) IS NOT NULL THEN
      col := CASE WHEN t = 'admin_audit_log' THEN 'admin_id' ELSE 'user_id' END;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=t AND column_name=col) THEN
        BEGIN
          EXECUTE format('ALTER TABLE public.%I ADD CONSTRAINT %I FOREIGN KEY (%I) REFERENCES public.app_users(id) ON DELETE %s', t, t || '_' || col || '_app_users_fkey', col, CASE WHEN t IN ('email_logs','contact_messages') THEN 'SET NULL' ELSE 'CASCADE' END);
        EXCEPTION WHEN duplicate_object THEN NULL;
        END;
      END IF;
    END IF;
  END LOOP;
END $$;

-- New-account defaults are created by the FastAPI verification transaction.
-- Supabase-managed auth tables and triggers are intentionally left untouched.

-- Service-role-only access is intentional: clients must use FastAPI for auth/data.
COMMENT ON TABLE public.app_users IS 'Application-owned identities. Do not use Supabase Auth for account creation.';
COMMENT ON TABLE public.auth_otp_codes IS 'Hashed OTPs managed by the Python authentication service.';
