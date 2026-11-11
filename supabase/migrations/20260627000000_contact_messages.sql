-- ============================================================================
-- Migration: 20260627000000_contact_messages.sql
-- Description: Support & Contact messages table, RLS policies, indexes, and RPC
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  client_type TEXT NOT NULL DEFAULT 'individual',
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  category TEXT NOT NULL DEFAULT 'general',
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new', -- 'new', 'in_progress', 'responded', 'resolved', 'closed'
  priority TEXT NOT NULL DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  source TEXT NOT NULL DEFAULT 'contact_page', -- 'contact_page', 'dashboard_support', 'email'
  admin_notes TEXT,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for swift searching & filtering
CREATE INDEX IF NOT EXISTS idx_contact_messages_ticket_id ON public.contact_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON public.contact_messages(email);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON public.contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON public.contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON public.contact_messages(user_id);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 1. Anyone (public anonymous or authenticated) can submit a contact inquiry
DROP POLICY IF EXISTS "Public can submit contact messages" ON public.contact_messages;
CREATE POLICY "Public can submit contact messages" ON public.contact_messages
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

-- 2. Authenticated users can view their own inquiries
DROP POLICY IF EXISTS "Users can view own contact messages" ON public.contact_messages;
CREATE POLICY "Users can view own contact messages" ON public.contact_messages
  FOR SELECT TO authenticated
  USING (
    user_id = auth.uid()
    OR email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

-- 3. Service role has full unrestricted access
DROP POLICY IF EXISTS "Service role full access to contact messages" ON public.contact_messages;
CREATE POLICY "Service role full access to contact messages" ON public.contact_messages
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant appropriate permissions
GRANT SELECT, INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;

-- 4. RPC to submit a contact message securely with automatic validation & ticket ID generation
CREATE OR REPLACE FUNCTION public.submit_contact_message(
  p_name TEXT,
  p_email TEXT,
  p_phone TEXT DEFAULT NULL,
  p_client_type TEXT DEFAULT 'individual',
  p_category TEXT DEFAULT 'general',
  p_subject TEXT DEFAULT 'Contact Inquiry',
  p_message TEXT DEFAULT '',
  p_user_id UUID DEFAULT NULL,
  p_source TEXT DEFAULT 'contact_page',
  p_metadata JSONB DEFAULT '{}'::JSONB
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_clean_name TEXT;
  v_clean_email TEXT;
  v_clean_subject TEXT;
  v_clean_message TEXT;
  v_ticket_id TEXT;
  v_id UUID;
  v_rand_suffix TEXT;
BEGIN
  -- Trim inputs
  v_clean_name := trim(COALESCE(p_name, ''));
  v_clean_email := lower(trim(COALESCE(p_email, '')));
  v_clean_subject := trim(COALESCE(p_subject, 'Contact Inquiry'));
  v_clean_message := trim(COALESCE(p_message, ''));

  -- Validation
  IF v_clean_name = '' THEN
    RAISE EXCEPTION 'Full name is required';
  END IF;

  IF v_clean_email = '' OR v_clean_email NOT LIKE '%@%.%' THEN
    RAISE EXCEPTION 'A valid email address is required';
  END IF;

  IF v_clean_message = '' THEN
    RAISE EXCEPTION 'Message content is required';
  END IF;

  -- Generate unique ticket ID: TK-YYYYMMDD-XXXX
  v_rand_suffix := upper(substr(md5(random()::text || clock_timestamp()::text), 1, 4));
  v_ticket_id := 'TK-' || to_char(now(), 'YYYYMMDD') || '-' || v_rand_suffix;

  -- Insert record
  INSERT INTO public.contact_messages (
    ticket_id,
    user_id,
    client_type,
    name,
    email,
    phone,
    category,
    subject,
    message,
    source,
    metadata
  ) VALUES (
    v_ticket_id,
    p_user_id,
    COALESCE(NULLIF(trim(p_client_type), ''), 'individual'),
    v_clean_name,
    v_clean_email,
    NULLIF(trim(p_phone), ''),
    COALESCE(NULLIF(trim(p_category), ''), 'general'),
    v_clean_subject,
    v_clean_message,
    COALESCE(NULLIF(trim(p_source), ''), 'contact_page'),
    COALESCE(p_metadata, '{}'::JSONB)
  )
  RETURNING id INTO v_id;

  RETURN jsonb_build_object(
    'success', true,
    'ticket_id', v_ticket_id,
    'id', v_id,
    'message', 'Inquiry recorded successfully'
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.submit_contact_message(
  TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, UUID, TEXT, JSONB
) TO anon, authenticated, service_role;

