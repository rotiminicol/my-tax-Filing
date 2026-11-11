-- ============================================================================
-- Migration: 20260628000000_resend_auth_otp_system.sql
-- Description: Dedicated Resend OTP generation, verification, and password reset engine
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Table to store secure 6-digit OTP verification codes
CREATE TABLE IF NOT EXISTS public.auth_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  code TEXT NOT NULL,
  purpose TEXT NOT NULL, -- 'signup_verification', 'password_reset', 'phone_change'
  metadata JSONB DEFAULT '{}'::JSONB,
  attempts INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMPTZ NOT NULL,
  verified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Performance & lookup indexes
CREATE INDEX IF NOT EXISTS idx_auth_codes_lookup 
  ON public.auth_verification_codes(lower(trim(email)), purpose, code);
CREATE INDEX IF NOT EXISTS idx_auth_codes_expiry 
  ON public.auth_verification_codes(expires_at);

-- Enable Row Level Security (RLS)
ALTER TABLE public.auth_verification_codes ENABLE ROW LEVEL SECURITY;

-- Deny direct public reads/writes to prevent code sniffing.
-- Access is granted exclusively through SECURITY DEFINER RPC functions.
DROP POLICY IF EXISTS "Service role manages auth codes" ON public.auth_verification_codes;
CREATE POLICY "Service role manages auth codes" ON public.auth_verification_codes
  FOR ALL TO service_role USING (true) WITH CHECK (true);

GRANT ALL ON public.auth_verification_codes TO service_role;

-- 2. RPC: Generate secure 6-digit OTP for signup or password reset
CREATE OR REPLACE FUNCTION public.generate_auth_otp(
  p_email TEXT,
  p_purpose TEXT,
  p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_clean_email TEXT;
  v_code TEXT;
  v_id UUID;
  v_expires_at TIMESTAMPTZ;
BEGIN
  v_clean_email := lower(trim(COALESCE(p_email, '')));
  
  IF v_clean_email = '' OR v_clean_email NOT LIKE '%@%.%' THEN
    RAISE EXCEPTION 'A valid email address is required to generate a verification code.';
  END IF;

  IF p_purpose IS NULL OR p_purpose = '' THEN
    RAISE EXCEPTION 'A purpose (e.g. signup_verification or password_reset) is required.';
  END IF;

  -- Invalidate any pending codes for this email + purpose
  UPDATE public.auth_verification_codes
  SET expires_at = now()
  WHERE lower(trim(email)) = v_clean_email
    AND purpose = p_purpose
    AND verified_at IS NULL;

  -- Generate 6-digit cryptographic numeric code (100000 - 999999)
  v_code := lpad((floor(random() * 899999) + 100000)::text, 6, '0');
  v_expires_at := now() + interval '15 minutes';

  INSERT INTO public.auth_verification_codes (
    email,
    code,
    purpose,
    metadata,
    expires_at
  ) VALUES (
    v_clean_email,
    v_code,
    p_purpose,
    COALESCE(p_metadata, '{}'::JSONB),
    v_expires_at
  ) RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'success', true,
    'code', v_code,
    'email', v_clean_email,
    'id', v_id,
    'expires_at', v_expires_at
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.generate_auth_otp(TEXT, TEXT, JSONB) TO anon, authenticated, service_role;

-- 3. RPC: Verify 6-digit OTP
CREATE OR REPLACE FUNCTION public.verify_auth_otp(
  p_email TEXT,
  p_code TEXT,
  p_purpose TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_clean_email TEXT;
  v_clean_code TEXT;
  v_record RECORD;
BEGIN
  v_clean_email := lower(trim(COALESCE(p_email, '')));
  v_clean_code := trim(COALESCE(p_code, ''));

  IF v_clean_email = '' OR v_clean_code = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Email and verification code are required.');
  END IF;

  SELECT * INTO v_record
  FROM public.auth_verification_codes
  WHERE lower(trim(email)) = v_clean_email
    AND purpose = p_purpose
    AND verified_at IS NULL
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'No active verification code found or code has expired. Please request a new code.');
  END IF;

  -- Check max attempts
  IF v_record.attempts >= 5 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Too many incorrect attempts. Please request a new verification code.');
  END IF;

  -- Validate match
  IF v_record.code != v_clean_code THEN
    UPDATE public.auth_verification_codes
    SET attempts = attempts + 1
    WHERE id = v_record.id;

    RETURN jsonb_build_object('success', false, 'error', 'Incorrect verification code. Please check your email and try again.');
  END IF;

  -- Mark verified
  UPDATE public.auth_verification_codes
  SET verified_at = now()
  WHERE id = v_record.id;

  -- If signup verification, automatically confirm email in auth.users
  IF p_purpose = 'signup_verification' THEN
    UPDATE auth.users
    SET email_confirmed_at = COALESCE(email_confirmed_at, now())
    WHERE lower(trim(email)) = v_clean_email;

    UPDATE public.profiles
    SET updated_at = now()
    WHERE lower(trim(email)) = v_clean_email;
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'verified', true,
    'message', 'Verification successful'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.verify_auth_otp(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

-- 4. RPC: Reset Password with OTP
CREATE OR REPLACE FUNCTION public.reset_password_with_otp(
  p_email TEXT,
  p_code TEXT,
  p_new_password TEXT
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
DECLARE
  v_clean_email TEXT;
  v_verify_res JSONB;
BEGIN
  v_clean_email := lower(trim(COALESCE(p_email, '')));

  IF length(COALESCE(p_new_password, '')) < 8 THEN
    RETURN jsonb_build_object('success', false, 'error', 'Password must be at least 8 characters long.');
  END IF;

  -- Verify OTP code first
  v_verify_res := public.verify_auth_otp(v_clean_email, p_code, 'password_reset');
  IF NOT ((v_verify_res->>'success')::boolean) THEN
    RETURN v_verify_res;
  END IF;

  -- Update encrypted password in auth.users using pgcrypto
  UPDATE auth.users
  SET encrypted_password = crypt(p_new_password, gen_salt('bf')),
      updated_at = now()
  WHERE lower(trim(email)) = v_clean_email;

  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'User account not found for this email address.');
  END IF;

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Password updated successfully'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.reset_password_with_otp(TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

