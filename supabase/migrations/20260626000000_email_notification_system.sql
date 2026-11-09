-- Migration: Complete Email Notification & Preferences System

-- 1. Notification preferences table
CREATE TABLE IF NOT EXISTS public.user_notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  email TEXT NOT NULL,
  marketing_emails BOOLEAN NOT NULL DEFAULT true,
  transactional_emails BOOLEAN NOT NULL DEFAULT true,
  tax_deadline_reminders BOOLEAN NOT NULL DEFAULT true,
  invoice_alerts BOOLEAN NOT NULL DEFAULT true,
  subscription_alerts BOOLEAN NOT NULL DEFAULT true,
  unsubscribe_token TEXT DEFAULT gen_random_uuid()::TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Email logs table
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  recipient TEXT NOT NULL,
  template_id TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'transactional',
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, sent, failed, simulated
  provider TEXT NOT NULL DEFAULT 'resend',
  provider_message_id TEXT,
  error TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_email_logs_recipient ON public.email_logs (recipient);
CREATE INDEX IF NOT EXISTS idx_email_logs_template ON public.email_logs (template_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs (user_id);
CREATE INDEX IF NOT EXISTS idx_user_notif_prefs_token ON public.user_notification_preferences (unsubscribe_token);

-- RLS
ALTER TABLE public.user_notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users view own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users update own notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Service role manages notification preferences" ON public.user_notification_preferences;
DROP POLICY IF EXISTS "Users view own email logs" ON public.email_logs;
DROP POLICY IF EXISTS "Service role manages email logs" ON public.email_logs;

CREATE POLICY "Users view own notification preferences" ON public.user_notification_preferences
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users update own notification preferences" ON public.user_notification_preferences
  FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role manages notification preferences" ON public.user_notification_preferences
  FOR ALL TO service_role USING (true);

CREATE POLICY "Users view own email logs" ON public.email_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Service role manages email logs" ON public.email_logs
  FOR ALL TO service_role USING (true);

GRANT SELECT, INSERT, UPDATE ON public.user_notification_preferences TO authenticated;
GRANT ALL ON public.user_notification_preferences TO service_role;
GRANT SELECT ON public.email_logs TO authenticated;
GRANT ALL ON public.email_logs TO service_role;

-- RPC: Record sent or attempted email
CREATE OR REPLACE FUNCTION public.log_email(
  p_recipient TEXT,
  p_template_id TEXT,
  p_subject TEXT,
  p_status TEXT,
  p_category TEXT DEFAULT 'transactional',
  p_user_id UUID DEFAULT NULL,
  p_provider_message_id TEXT DEFAULT NULL,
  p_error TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS UUID LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO public.email_logs (
    recipient, template_id, subject, status, category, user_id, provider_message_id, error, metadata
  ) VALUES (
    p_recipient, p_template_id, p_subject, p_status, p_category, p_user_id, p_provider_message_id, p_error, p_metadata
  )
  RETURNING id INTO v_id;
  RETURN v_id;
END; $$;

GRANT EXECUTE ON FUNCTION public.log_email(TEXT, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, TEXT, JSONB) TO anon, authenticated, service_role;

-- RPC: Unsubscribe user by token
CREATE OR REPLACE FUNCTION public.unsubscribe_user_by_token(
  p_token TEXT,
  p_channel TEXT DEFAULT 'marketing'
) RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_found UUID;
BEGIN
  IF p_channel = 'all' THEN
    UPDATE public.user_notification_preferences
    SET marketing_emails = false, tax_deadline_reminders = false, invoice_alerts = false, updated_at = now()
    WHERE unsubscribe_token = p_token
    RETURNING id INTO v_found;
  ELSE
    UPDATE public.user_notification_preferences
    SET marketing_emails = false, updated_at = now()
    WHERE unsubscribe_token = p_token
    RETURNING id INTO v_found;
  END IF;

  IF v_found IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired unsubscribe token');
  END IF;

  RETURN jsonb_build_object('success', true);
END; $$;

GRANT EXECUTE ON FUNCTION public.unsubscribe_user_by_token(TEXT, TEXT) TO anon, authenticated, service_role;

