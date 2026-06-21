
-- Rent receipts
CREATE TABLE public.receipts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'draft',
  taxpayer JSONB NOT NULL DEFAULT '{}'::jsonb,
  landlord JSONB NOT NULL DEFAULT '{}'::jsonb,
  employer JSONB NOT NULL DEFAULT '{}'::jsonb,
  declaration BOOLEAN NOT NULL DEFAULT false,
  signature_data TEXT,
  typed_signature TEXT,
  sig_mode TEXT,
  certified_date TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.receipts TO authenticated;
GRANT ALL ON public.receipts TO service_role;
ALTER TABLE public.receipts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own receipts" ON public.receipts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all receipts" ON public.receipts FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Compliance documents
CREATE TABLE public.compliance_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  reference TEXT NOT NULL,
  issuer TEXT,
  expiry_date DATE NOT NULL,
  issue_date DATE,
  last_renewed_at TIMESTAMPTZ,
  notes TEXT,
  attachment_name TEXT,
  renewal_status TEXT NOT NULL DEFAULT 'none',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.compliance_documents TO authenticated;
GRANT ALL ON public.compliance_documents TO service_role;
ALTER TABLE public.compliance_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own documents" ON public.compliance_documents FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all documents" ON public.compliance_documents FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Document reminders (per user)
CREATE TABLE public.document_reminders (
  user_id UUID NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  whatsapp BOOLEAN NOT NULL DEFAULT true,
  email_reports BOOLEAN NOT NULL DEFAULT true,
  auto_renew BOOLEAN NOT NULL DEFAULT false,
  phone TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.document_reminders TO authenticated;
GRANT ALL ON public.document_reminders TO service_role;
ALTER TABLE public.document_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own reminders" ON public.document_reminders FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Invoice clients
CREATE TABLE public.invoice_clients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  city TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_clients TO authenticated;
GRANT ALL ON public.invoice_clients TO service_role;
ALTER TABLE public.invoice_clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own clients" ON public.invoice_clients FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all clients" ON public.invoice_clients FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Invoices
CREATE TABLE public.invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.invoice_clients(id) ON DELETE SET NULL,
  invoice_number TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  issue_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE NOT NULL,
  notes TEXT,
  lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(14,2) NOT NULL DEFAULT 0,
  vat NUMERIC(14,2) NOT NULL DEFAULT 0,
  total NUMERIC(14,2) NOT NULL DEFAULT 0,
  sent_at TIMESTAMPTZ,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, invoice_number)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoices TO authenticated;
GRANT ALL ON public.invoices TO service_role;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own invoices" ON public.invoices FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins view all invoices" ON public.invoices FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Invoice templates
CREATE TABLE public.invoice_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  lines JSONB NOT NULL DEFAULT '[]'::jsonb,
  usage_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_templates TO authenticated;
GRANT ALL ON public.invoice_templates TO service_role;
ALTER TABLE public.invoice_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own templates" ON public.invoice_templates FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Invoice activities
CREATE TABLE public.invoice_activities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  invoice_id UUID REFERENCES public.invoices(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.invoice_clients(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.invoice_activities TO authenticated;
GRANT ALL ON public.invoice_activities TO service_role;
ALTER TABLE public.invoice_activities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own activities" ON public.invoice_activities FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Updated_at triggers
CREATE TRIGGER trg_receipts_updated_at BEFORE UPDATE ON public.receipts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_compliance_documents_updated_at BEFORE UPDATE ON public.compliance_documents FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_document_reminders_updated_at BEFORE UPDATE ON public.document_reminders FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_invoice_clients_updated_at BEFORE UPDATE ON public.invoice_clients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_invoices_updated_at BEFORE UPDATE ON public.invoices FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_invoice_templates_updated_at BEFORE UPDATE ON public.invoice_templates FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Helpful indexes
CREATE INDEX idx_receipts_user ON public.receipts(user_id, created_at DESC);
CREATE INDEX idx_compliance_documents_user ON public.compliance_documents(user_id, expiry_date);
CREATE INDEX idx_invoice_clients_user ON public.invoice_clients(user_id, created_at DESC);
CREATE INDEX idx_invoices_user ON public.invoices(user_id, created_at DESC);
CREATE INDEX idx_invoices_client ON public.invoices(client_id);
CREATE INDEX idx_invoice_templates_user ON public.invoice_templates(user_id, created_at DESC);
CREATE INDEX idx_invoice_activities_user ON public.invoice_activities(user_id, created_at DESC);
