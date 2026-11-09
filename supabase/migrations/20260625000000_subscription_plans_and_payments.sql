-- 1. Create or extend subscription_plan enum
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
    CREATE TYPE public.subscription_plan AS ENUM (
      'free', 'starter', 'deluxe', 'pro', 'premium', 'business', 'enterprise'
    );
  ELSE
    BEGIN
      ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'deluxe';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
    BEGIN
      ALTER TYPE public.subscription_plan ADD VALUE IF NOT EXISTS 'premium';
    EXCEPTION WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;

-- 2. Create subscription_status enum if not exists
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_status') THEN
    CREATE TYPE public.subscription_status AS ENUM (
      'active', 'trialing', 'past_due', 'canceled', 'expired'
    );
  END IF;
END $$;

-- 3. Ensure public.subscriptions table exists
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

-- Ensure billing_cycle column exists if subscriptions was created previously without it
DO $$ BEGIN
  ALTER TABLE public.subscriptions ADD COLUMN IF NOT EXISTS billing_cycle TEXT;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Subscriptions RLS
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users view own subscription'
  ) THEN
    CREATE POLICY "Users view own subscription" ON public.subscriptions
      FOR SELECT TO authenticated USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Users manage own subscription'
  ) THEN
    CREATE POLICY "Users manage own subscription" ON public.subscriptions
      FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'subscriptions' AND policyname = 'Service role manages subscriptions'
  ) THEN
    CREATE POLICY "Service role manages subscriptions" ON public.subscriptions
      FOR ALL TO service_role USING (true);
  END IF;
END $$;

GRANT SELECT, INSERT, UPDATE ON public.subscriptions TO authenticated;
GRANT ALL ON public.subscriptions TO service_role;

-- 4. Payment transactions table
CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  subscription_id UUID REFERENCES public.subscriptions(id),
  provider TEXT NOT NULL DEFAULT 'paystack',
  provider_reference TEXT UNIQUE,
  amount_kobo BIGINT NOT NULL,
  currency TEXT NOT NULL DEFAULT 'NGN',
  plan TEXT NOT NULL,
  billing_cycle TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Usage tracking table
CREATE TABLE IF NOT EXISTS public.feature_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  feature TEXT NOT NULL,
  period_start DATE NOT NULL DEFAULT CURRENT_DATE,
  count INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, feature, period_start)
);

-- RLS for payments and usage
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_usage ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own payments" ON public.payment_transactions;
DROP POLICY IF EXISTS "Service role manages payments" ON public.payment_transactions;
DROP POLICY IF EXISTS "Users read own usage" ON public.feature_usage;
DROP POLICY IF EXISTS "Service role manages usage" ON public.feature_usage;
DROP POLICY IF EXISTS "Users manage own usage" ON public.feature_usage;

CREATE POLICY "Users read own payments" ON public.payment_transactions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role manages payments" ON public.payment_transactions
  FOR ALL TO service_role USING (true);

CREATE POLICY "Users read own usage" ON public.feature_usage
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users manage own usage" ON public.feature_usage
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages usage" ON public.feature_usage
  FOR ALL TO service_role USING (true);

GRANT SELECT ON public.payment_transactions TO authenticated;
GRANT ALL ON public.payment_transactions TO service_role;
GRANT SELECT, INSERT, UPDATE ON public.feature_usage TO authenticated;
GRANT ALL ON public.feature_usage TO service_role;

-- 6. RPC: increment feature usage
CREATE OR REPLACE FUNCTION public.increment_feature_usage(p_feature TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_user_id UUID := auth.uid();
  v_count INTEGER;
  v_period DATE := date_trunc('month', CURRENT_DATE)::DATE;
BEGIN
  IF v_user_id IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  INSERT INTO public.feature_usage (user_id, feature, period_start, count)
  VALUES (v_user_id, p_feature, v_period, 1)
  ON CONFLICT (user_id, feature, period_start)
  DO UPDATE SET count = feature_usage.count + 1, updated_at = now()
  RETURNING count INTO v_count;
  RETURN v_count;
END; $$;

GRANT EXECUTE ON FUNCTION public.increment_feature_usage(TEXT) TO authenticated;

-- 7. RPC: get feature usage for current month
CREATE OR REPLACE FUNCTION public.get_feature_usage(p_feature TEXT)
RETURNS INTEGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_count INTEGER;
  v_period DATE := date_trunc('month', CURRENT_DATE)::DATE;
BEGIN
  SELECT count INTO v_count FROM public.feature_usage
  WHERE user_id = auth.uid() AND feature = p_feature
  AND period_start = v_period;
  RETURN COALESCE(v_count, 0);
END; $$;

GRANT EXECUTE ON FUNCTION public.get_feature_usage(TEXT) TO authenticated;

-- 8. RPC: verify payment and activate subscription (called via service_role)
CREATE OR REPLACE FUNCTION public.activate_subscription_after_payment(
  p_user_id UUID,
  p_plan TEXT,
  p_billing_cycle TEXT,
  p_provider_reference TEXT,
  p_amount_kobo BIGINT
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_period_start TIMESTAMPTZ := now();
  v_period_end TIMESTAMPTZ;
  v_sub_id UUID;
  v_tx_id UUID;
  v_plan_enum public.subscription_plan;
BEGIN
  BEGIN
    v_plan_enum := p_plan::public.subscription_plan;
  EXCEPTION WHEN OTHERS THEN
    v_plan_enum := 'free'::public.subscription_plan;
  END;

  IF p_billing_cycle = 'annual' THEN
    v_period_end := now() + INTERVAL '1 year';
  ELSE
    v_period_end := now() + INTERVAL '1 month';
  END IF;

  INSERT INTO public.subscriptions (user_id, plan, status, current_period_start, current_period_end, billing_cycle, provider, provider_subscription_id, updated_at)
  VALUES (p_user_id, v_plan_enum, 'active', v_period_start, v_period_end, p_billing_cycle, 'paystack', p_provider_reference, now())
  ON CONFLICT (user_id) DO UPDATE SET
    plan = EXCLUDED.plan,
    status = 'active',
    current_period_start = EXCLUDED.current_period_start,
    current_period_end = EXCLUDED.current_period_end,
    billing_cycle = EXCLUDED.billing_cycle,
    provider = EXCLUDED.provider,
    provider_subscription_id = EXCLUDED.provider_subscription_id,
    updated_at = now()
  RETURNING id INTO v_sub_id;

  INSERT INTO public.payment_transactions (user_id, subscription_id, provider, provider_reference, amount_kobo, currency, plan, billing_cycle, status)
  VALUES (p_user_id, v_sub_id, 'paystack', p_provider_reference, p_amount_kobo, 'NGN', p_plan, p_billing_cycle, 'success')
  RETURNING id INTO v_tx_id;

  RETURN jsonb_build_object('subscription_id', v_sub_id, 'transaction_id', v_tx_id, 'plan', p_plan, 'expires_at', v_period_end);
END; $$;

GRANT EXECUTE ON FUNCTION public.activate_subscription_after_payment(UUID, TEXT, TEXT, TEXT, BIGINT) TO service_role;
