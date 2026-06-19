import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  calculateInvoiceTotals,
  defaultDueDate,
  effectiveStatus,
  generateInvoiceNumber,
  type InvoiceStatus,
} from "@/lib/invoicing";

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
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

function lineWithId(line: Omit<InvoiceLine, "id">, id?: string): InvoiceLine {
  return { ...line, id: id ?? newId("line") };
}

function recalcInvoice(patch: { lines: InvoiceLine[] }): Pick<Invoice, "subtotal" | "vat" | "total"> {
  return calculateInvoiceTotals(patch.lines);
}

export const useInvoicingStore = create<InvoicingState>()(
  persist(
    (set, get) => ({
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
        return client;
      },

      updateClient: (id, patch) => {
        set((s) => ({
          clients: s.clients.map((c) => (c.id === id ? { ...c, ...patch } : c)),
        }));
      },

      removeClient: (id) => {
        set((s) => ({
          clients: s.clients.filter((c) => c.id !== id),
          invoices: s.invoices.filter((inv) => inv.clientId !== id),
        }));
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
      },

      deleteInvoice: (id) => {
        set((s) => ({
          invoices: s.invoices.filter((inv) => inv.id !== id),
        }));
      },

      getInvoice: (id) => get().invoices.find((inv) => inv.id === id),

      sendInvoice: (id) => {
        const state = get();
        const inv = state.invoices.find((i) => i.id === id);
        if (!inv) return;
        if (!inv.clientId) return;

        const client = state.getClient(inv.clientId);
        const now = new Date().toISOString();

        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id ? { ...i, status: "sent" as const, sentAt: now, updatedAt: now } : i,
          ),
          activities: [
            {
              id: newId("act"),
              type: "sent" as const,
              invoiceId: id,
              clientId: inv.clientId,
              title: "Invoice sent",
              detail: client
                ? `Sent ${inv.invoiceNumber} to ${client.name}`
                : `Sent ${inv.invoiceNumber}`,
              createdAt: now,
            },
            ...s.activities,
          ].slice(0, 50),
        }));
      },

      markInvoicePaid: (id) => {
        const state = get();
        const inv = state.invoices.find((i) => i.id === id);
        if (!inv) return;
        const client = state.getClient(inv.clientId);
        const now = new Date().toISOString();

        set((s) => ({
          invoices: s.invoices.map((i) =>
            i.id === id
              ? { ...i, status: "paid" as const, paidAt: now, updatedAt: now }
              : i,
          ),
          activities: [
            {
              id: newId("act"),
              type: "paid" as const,
              invoiceId: id,
              clientId: inv.clientId,
              title: "Invoice paid",
              detail: client
                ? `${client.name} settled ${inv.invoiceNumber}`
                : `Payment received for ${inv.invoiceNumber}`,
              createdAt: now,
            },
            ...s.activities,
          ].slice(0, 50),
        }));
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
        return template;
      },

      removeTemplate: (id) => {
        set((s) => ({
          templates: s.templates.filter((t) => t.id !== id),
        }));
      },

      incrementTemplateUsage: (id) => {
        set((s) => ({
          templates: s.templates.map((t) =>
            t.id === id ? { ...t, usageCount: t.usageCount + 1 } : t,
          ),
        }));
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
    }),
    { name: "mtf-invoicing-v1" },
  ),
);
