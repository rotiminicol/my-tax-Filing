import { create } from "zustand";
import {
  calculateInvoiceTotals,
  defaultDueDate,
  effectiveStatus,
  generateInvoiceNumber,
  type InvoiceStatus,
} from "@/lib/invoicing";
import { supabase } from "@/integrations/supabase/client";

export interface InvoiceClient {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  createdAt: string;
}

export interface InvoiceLine {
  id: string;
  description: string;
  qty: number;
  price: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  clientId: string;
  lines: InvoiceLine[];
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  notes?: string;
  subtotal: number;
  vat: number;
  total: number;
  sentAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceTemplate {
  id: string;
  name: string;
  description: string;
  lines: Omit<InvoiceLine, "id">[];
  usageCount: number;
  createdAt: string;
}

export interface InvoiceActivity {
  id: string;
  type: "paid" | "sent" | "overdue" | "draft" | "created";
  invoiceId?: string;
  clientId?: string;
  title: string;
  detail: string;
  createdAt: string;
}

interface InvoicingState {
  clients: InvoiceClient[];
  invoices: Invoice[];
  templates: InvoiceTemplate[];
  activities: InvoiceActivity[];

  addClient: (input: Omit<InvoiceClient, "id" | "createdAt">) => InvoiceClient;
  updateClient: (id: string, patch: Partial<InvoiceClient>) => void;
  removeClient: (id: string) => void;
  getClient: (id: string) => InvoiceClient | undefined;

  createDraft: (clientId?: string) => Invoice;
  updateInvoice: (id: string, patch: Partial<Omit<Invoice, "id">> & { lines?: InvoiceLine[] }) => void;
  deleteInvoice: (id: string) => void;
  getInvoice: (id: string) => Invoice | undefined;
  sendInvoice: (id: string) => void;
  markInvoicePaid: (id: string) => void;
  syncOverdueStatuses: () => void;

  addTemplate: (input: { name: string; description: string; lines: Omit<InvoiceLine, "id">[] }) => InvoiceTemplate;
  removeTemplate: (id: string) => void;
  incrementTemplateUsage: (id: string) => void;

  getStats: () => {
    paidTotal: number;
    paidCount: number;
    overdueTotal: number;
    overdueCount: number;
    draftTotal: number;
    draftCount: number;
    vatAccumulated: number;
  };
  hydrate: (userId: string) => Promise<void>;
}

function newId(prefix: string): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function lineWithId(line: Omit<InvoiceLine, "id">, id?: string): InvoiceLine {
  return { ...line, id: id ?? newId("line") };
}

function recalcInvoice(patch: { lines: InvoiceLine[] }): Pick<Invoice, "subtotal" | "vat" | "total"> {
  return calculateInvoiceTotals(patch.lines);
}

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

let _userId: string | null = null;

async function pushClient(c: InvoiceClient) {
  if (!_userId || !isUuid(c.id)) return;
  await supabase.from("invoice_clients").upsert({
    id: c.id, user_id: _userId, name: c.name,
    email: c.email ?? null, phone: c.phone ?? null,
    address: c.address ?? null, city: c.city ?? null,
  } as never);
}
async function pushInvoice(i: Invoice) {
  if (!_userId || !isUuid(i.id)) return;
  await supabase.from("invoices").upsert({
    id: i.id, user_id: _userId,
    client_id: i.clientId && isUuid(i.clientId) ? i.clientId : null,
    invoice_number: i.invoiceNumber, status: i.status,
    issue_date: i.issueDate, due_date: i.dueDate,
    notes: i.notes ?? null, lines: i.lines,
    subtotal: i.subtotal, vat: i.vat, total: i.total,
    sent_at: i.sentAt ?? null, paid_at: i.paidAt ?? null,
  } as never);
}
async function pushTemplate(t: InvoiceTemplate) {
  if (!_userId || !isUuid(t.id)) return;
  await supabase.from("invoice_templates").upsert({
    id: t.id, user_id: _userId, name: t.name,
    description: t.description, lines: t.lines, usage_count: t.usageCount,
  } as never);
}
async function pushActivity(a: InvoiceActivity) {
  if (!_userId || !isUuid(a.id)) return;
  await supabase.from("invoice_activities").insert({
    id: a.id, user_id: _userId,
    invoice_id: a.invoiceId && isUuid(a.invoiceId) ? a.invoiceId : null,
    client_id: a.clientId && isUuid(a.clientId) ? a.clientId : null,
    type: a.type, title: a.title, detail: a.detail,
  } as never);
}

export const useInvoicingStore = create<InvoicingState>()((set, get) => ({
      clients: [],
      invoices: [],
      templates: [],
      activities: [],

      addClient: (input) => {
        const client: InvoiceClient = {
          ...input,
          id: newId("client"),
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ clients: [client, ...s.clients] }));
        void pushClient(client);
        return client;
      },

      updateClient: (id, patch) => {
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
        const c = get().clients.find((x) => x.id === id);
        if (c) void pushClient(c);
      },

      removeClient: (id) => {
        set((s) => ({
          clients: s.clients.filter((c) => c.id !== id),
          invoices: s.invoices.filter((inv) => inv.clientId !== id),
        }));
        if (isUuid(id)) void supabase.from("invoice_clients").delete().eq("id", id);
      },

      getClient: (id) => get().clients.find((c) => c.id === id),

      createDraft: (clientId) => {
        const state = get();
        const numbers = state.invoices.map((i) => i.invoiceNumber);
        const lines: InvoiceLine[] = [
          lineWithId({ description: "", qty: 1, price: 0 }),
        ];
        const totals = recalcInvoice({ lines });
        const now = new Date().toISOString();
        const firstClientId = clientId ?? state.clients[0]?.id ?? "";

        const invoice: Invoice = {
          id: newId("inv"),
          invoiceNumber: generateInvoiceNumber(numbers),
          clientId: firstClientId,
          lines,
          status: "draft",
          issueDate: now.slice(0, 10),
          dueDate: defaultDueDate(),
          ...totals,
          createdAt: now,
          updatedAt: now,
        };

        const activity: InvoiceActivity = {
          id: newId("act"),
          type: "draft",
          invoiceId: invoice.id,
          clientId: firstClientId || undefined,
          title: "Draft created",
          detail: `Invoice ${invoice.invoiceNumber} started`,
          createdAt: now,
        };

        set((s) => ({
          invoices: [invoice, ...s.invoices],
          activities: [activity, ...s.activities].slice(0, 50),
        }));
        void pushInvoice(invoice);
        void pushActivity(activity);

        return invoice;
      },

      updateInvoice: (id, patch) => {
        set((s) => ({
          invoices: s.invoices.map((inv) => {
            if (inv.id !== id) return inv;
            const lines = patch.lines ?? inv.lines;
            const totals = patch.lines ? recalcInvoice({ lines }) : {};
            return {
              ...inv,
              ...patch,
              lines,
              ...totals,
              updatedAt: new Date().toISOString(),
            };
          }),
        }));
        const inv = get().invoices.find((x) => x.id === id);
        if (inv) void pushInvoice(inv);
      },

      deleteInvoice: (id) => {
        set((s) => ({
          invoices: s.invoices.filter((inv) => inv.id !== id),
        }));
        if (isUuid(id)) void supabase.from("invoices").delete().eq("id", id);
      },

      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),

      sendInvoice: (id) => {
        const state = get();
        const inv = state.invoices.find((i) => i.id === id);
        if (!inv) return;
        if (!inv.clientId) return;

        const client = state.getClient(inv.clientId);
        const now = new Date().toISOString();

        const activity: InvoiceActivity = {
          id: newId("act"),
          type: "sent" as const,
          invoiceId: id,
          clientId: inv.clientId,
          title: "Invoice sent",
          detail: client
            ? `Sent ${inv.invoiceNumber} to ${client.name}`
            : `Sent ${inv.invoiceNumber}`,
          createdAt: now,
        };
        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id ? { ...i, status: "sent" as const, sentAt: now, updatedAt: now } : i,
          ),
          activities: [activity, ...s.activities].slice(0, 50),
        }));
        const updated = get().invoices.find((x) => x.id === id);
        if (updated) void pushInvoice(updated);
        void pushActivity(activity);
      },

      markInvoicePaid: (id) => {
        const state = get();
        const inv = state.invoices.find((i) => i.id === id);
        if (!inv) return;
        const client = state.getClient(inv.clientId);
        const now = new Date().toISOString();

        const activity: InvoiceActivity = {
          id: newId("act"),
          type: "paid" as const,
          invoiceId: id,
          clientId: inv.clientId,
          title: "Invoice paid",
          detail: client
            ? `${client.name} settled ${inv.invoiceNumber}`
            : `Payment received for ${inv.invoiceNumber}`,
          createdAt: now,
        };
        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id
              ? { ...i, status: "paid" as const, paidAt: now, updatedAt: now }
              : i,
          ),
          activities: [activity, ...s.activities].slice(0, 50),
        }));
        const updated = get().invoices.find((x) => x.id === id);
        if (updated) void pushInvoice(updated);
        void pushActivity(activity);
      },

      syncOverdueStatuses: () => {
        set((s) => {
          let changed = false;
          const invoices = s.invoices.map((inv) => {
            const next = effectiveStatus(inv.status, inv.dueDate);
            if (next === inv.status) return inv;
            changed = true;
            return { ...inv, status: next, updatedAt: new Date().toISOString() };
          });
          return changed ? { invoices } : {};
        });
      },

      addTemplate: (input) => {
        const template: InvoiceTemplate = {
          id: newId("tpl"),
          name: input.name,
          description: input.description,
          lines: input.lines,
          usageCount: 0,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ templates: [template, ...s.templates] }));
        void pushTemplate(template);
        return template;
      },

      removeTemplate: (id) => {
        set((s) => ({
          templates: s.templates.filter((t) => t.id !== id),
        }));
        if (isUuid(id)) void supabase.from("invoice_templates").delete().eq("id", id);
      },

      incrementTemplateUsage: (id) => {
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t,
          ),
        }));
        const t = get().templates.find((x) => x.id === id);
        if (t) void pushTemplate(t);
      },

      getStats: () => {
        const { invoices } = get();
        const withStatus = invoices.map((inv) => ({
          ...inv,
          status: effectiveStatus(inv.status, inv.dueDate),
        }));

        const paid = withStatus.filter((i) => i.status === "paid");
        const overdue = withStatus.filter((i) => i.status === "overdue");
        const draft = withStatus.filter((i) => i.status === "draft");

        const paidTotal = paid.reduce((s, i) => s + i.total, 0);
        const overdueTotal = overdue.reduce((s, i) => s + i.total, 0);
        const draftTotal = draft.reduce((s, i) => s + i.total, 0);
        const vatAccumulated = withStatus
          .filter((i) => i.status === "paid" || i.status === "sent" || i.status === "overdue")
          .reduce((s, i) => s + i.vat, 0);

        return {
          paidTotal,
          paidCount: paid.length,
          overdueTotal,
          overdueCount: overdue.length,
          draftTotal,
          draftCount: draft.length,
          vatAccumulated,
        };
      },

      hydrate: async (userId) => {
        const [c, i, t, a] = await Promise.all([
          supabase.from("invoice_clients").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("invoices").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("invoice_templates").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
          supabase.from("invoice_activities").select("*").eq("user_id", userId).order("created_at", { ascending: false }).limit(50),
        ]);
        const clients: InvoiceClient[] = ((c.data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
          id: r.id as string, name: r.name as string,
          email: (r.email as string | null) ?? undefined,
          phone: (r.phone as string | null) ?? undefined,
          address: (r.address as string | null) ?? undefined,
          city: (r.city as string | null) ?? undefined,
          createdAt: r.created_at as string,
        }));
        const invoices: Invoice[] = ((i.data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
          id: r.id as string,
          invoiceNumber: r.invoice_number as string,
          clientId: (r.client_id as string | null) ?? "",
          lines: (r.lines as InvoiceLine[]) ?? [],
          status: (r.status as InvoiceStatus) ?? "draft",
          issueDate: r.issue_date as string,
          dueDate: r.due_date as string,
          notes: (r.notes as string | null) ?? undefined,
          subtotal: Number(r.subtotal ?? 0),
          vat: Number(r.vat ?? 0),
          total: Number(r.total ?? 0),
          sentAt: (r.sent_at as string | null) ?? undefined,
          paidAt: (r.paid_at as string | null) ?? undefined,
          createdAt: r.created_at as string,
          updatedAt: r.updated_at as string,
        }));
        const templates: InvoiceTemplate[] = ((t.data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
          id: r.id as string, name: r.name as string,
          description: (r.description as string) ?? "",
          lines: (r.lines as Omit<InvoiceLine, "id">[]) ?? [],
          usageCount: Number(r.usage_count ?? 0),
          createdAt: r.created_at as string,
        }));
        const activities: InvoiceActivity[] = ((a.data ?? []) as unknown as Record<string, unknown>[]).map((r) => ({
          id: r.id as string,
          type: r.type as InvoiceActivity["type"],
          invoiceId: (r.invoice_id as string | null) ?? undefined,
          clientId: (r.client_id as string | null) ?? undefined,
          title: r.title as string,
          detail: (r.detail as string) ?? "",
          createdAt: r.created_at as string,
        }));
        set({ clients, invoices, templates, activities });
      },
}));

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user?.id ?? null;
    _userId = uid;
    if (uid) void useInvoicingStore.getState().hydrate(uid);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    const uid = session?.user?.id ?? null;
    _userId = uid;
    if (event === "SIGNED_OUT" || !uid) {
      useInvoicingStore.setState({ clients: [], invoices: [], templates: [], activities: [] });
    } else if (event === "SIGNED_IN") {
      void useInvoicingStore.getState().hydrate(uid);
    }
  });
}
