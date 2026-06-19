import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  calculateVATPayable,
  calculateWHT,
  effectiveFilingStatus,
  generateTaxRef,
  TAX_CATEGORY_LABELS,
  type TaxAuthority,
  type TaxCategory,
  type TaxFilingStatus,
  WHT_RATES,
} from "@/lib/taxes";

export interface TaxFiling {
  id: string;
  reference: string;
  category: TaxCategory;
  title: string;
  period: string;
  amount: number;
  authority: TaxAuthority;
  status: TaxFilingStatus;
  dueDate: string;
  notes?: string;
  filedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface VATReturn {
  id: string;
  reference: string;
  period: string;
  dueDate: string;
  outputVAT: number;
  inputVAT: number;
  payable: number;
  status: TaxFilingStatus;
  filedAt?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WHTPayment {
  id: string;
  type: string;
  description: string;
  recipient: string;
  amount: number;
  rate: number;
  whtAmount: number;
  paymentDate: string;
  createdAt: string;
}

interface TaxesState {
  filings: TaxFiling[];
  vatReturns: VATReturn[];
  whtPayments: WHTPayment[];

  addFiling: (
    input: Omit<TaxFiling, "id" | "reference" | "createdAt" | "updatedAt" | "status"> & {
      status?: TaxFilingStatus;
    },
  ) => TaxFiling;
  updateFiling: (id: string, patch: Partial<TaxFiling>) => void;
  removeFiling: (id: string) => void;
  fileFiling: (id: string) => void;
  payFiling: (id: string) => void;

  addVATReturn: (
    input: Omit<VATReturn, "id" | "reference" | "payable" | "createdAt" | "updatedAt" | "status"> & {
      status?: TaxFilingStatus;
    },
  ) => VATReturn;
  updateVATReturn: (id: string, patch: Partial<VATReturn>) => void;
  removeVATReturn: (id: string) => void;
  fileVATReturn: (id: string) => void;
  payVATReturn: (id: string) => void;

  addWHTPayment: (input: {
    type: string;
    description: string;
    recipient: string;
    amount: number;
    paymentDate: string;
  }) => WHTPayment;
  removeWHTPayment: (id: string) => void;

  syncStatuses: () => void;
  getHubStats: () => {
    totalPaidYear: number;
    complianceScore: number;
    upcomingDeadlines: Array<{
      id: string;
      title: string;
      authority: string;
      dueDate: string;
      category: TaxCategory;
      status: TaxFilingStatus;
    }>;
    historyRows: Array<{
      id: string;
      category: TaxCategory;
      title: string;
      period: string;
      amount: number;
      authority: TaxAuthority;
      status: TaxFilingStatus;
      source: "filing" | "vat";
      sourceId: string;
    }>;
  };
}

function newId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const filingPrefix: Record<TaxCategory, string> = {
  pit: "TAX",
  vat: "VAT",
  wht: "WHT",
  cit: "CIT",
  paye: "PAYE",
};

export const useTaxesStore = create<TaxesState>()(
  persist(
    (set, get) => ({
      filings: [],
      vatReturns: [],
      whtPayments: [],

      addFiling: (input) => {
        const refs = get().filings.map((f) => f.reference);
        const now = new Date().toISOString();
        const filing: TaxFiling = {
          ...input,
          id: newId("tax"),
          reference: generateTaxRef(filingPrefix[input.category], refs),
          status: input.status ?? "draft",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ filings: [filing, ...s.filings] }));
        return filing;
      },

      updateFiling: (id, patch) => {
        set((s) => ({
          filings: s.filings.map((f) =>
            f.id === id ? { ...f, ...patch, updatedAt: new Date().toISOString() } : f,
          ),
        }));
      },

      removeFiling: (id) => {
        set((s) => ({ filings: s.filings.filter((f) => f.id !== id) }));
      },

      fileFiling: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          filings: s.filings.map((f) =>
            f.id === id ? { ...f, status: "filed" as const, filedAt: now, updatedAt: now } : f,
          ),
        }));
      },

      payFiling: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          filings: s.filings.map((f) =>
            f.id === id ? { ...f, status: "paid" as const, paidAt: now, updatedAt: now } : f,
          ),
        }));
      },

      addVATReturn: (input) => {
        const refs = get().vatReturns.map((v) => v.reference);
        const payable = calculateVATPayable(input.outputVAT, input.inputVAT);
        const now = new Date().toISOString();
        const row: VATReturn = {
          ...input,
          id: newId("vat"),
          reference: generateTaxRef("VAT", refs),
          payable,
          status: input.status ?? "pending",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ vatReturns: [row, ...s.vatReturns] }));
        return row;
      },

      updateVATReturn: (id, patch) => {
        set((s) => ({
          vatReturns: s.vatReturns.map((v) => {
            if (v.id !== id) return v;
            const next = { ...v, ...patch, updatedAt: new Date().toISOString() };
            if (patch.outputVAT !== undefined || patch.inputVAT !== undefined) {
              next.payable = calculateVATPayable(next.outputVAT, next.inputVAT);
            }
            return next;
          }),
        }));
      },

      removeVATReturn: (id) => {
        set((s) => ({ vatReturns: s.vatReturns.filter((v) => v.id !== id) }));
      },

      fileVATReturn: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          vatReturns: s.vatReturns.map((v) =>
            v.id === id ? { ...v, status: "filed" as const, filedAt: now, updatedAt: now } : v,
          ),
        }));
      },

      payVATReturn: (id) => {
        const now = new Date().toISOString();
        set((s) => ({
          vatReturns: s.vatReturns.map((v) =>
            v.id === id ? { ...v, status: "paid" as const, paidAt: now, updatedAt: now } : v,
          ),
        }));
      },

      addWHTPayment: (input) => {
        const { rate, whtAmount } = calculateWHT(input.amount, input.type);
        const payment: WHTPayment = {
          ...input,
          id: newId("wht"),
          rate,
          whtAmount,
          createdAt: new Date().toISOString(),
        };
        set((s) => ({ whtPayments: [payment, ...s.whtPayments] }));
        return payment;
      },

      removeWHTPayment: (id) => {
        set((s) => ({ whtPayments: s.whtPayments.filter((p) => p.id !== id) }));
      },

      syncStatuses: () => {
        set((s) => {
          let changed = false;
          const filings = s.filings.map((f) => {
            const next = effectiveFilingStatus(f.status, f.dueDate);
            if (next === f.status) return f;
            changed = true;
            return { ...f, status: next, updatedAt: new Date().toISOString() };
          });
          const vatReturns = s.vatReturns.map((v) => {
            const next = effectiveFilingStatus(v.status, v.dueDate);
            if (next === v.status) return v;
            changed = true;
            return { ...v, status: next, updatedAt: new Date().toISOString() };
          });
          return changed ? { filings, vatReturns } : {};
        });
      },

      getHubStats: () => {
        const { filings, vatReturns } = get();
        const year = new Date().getFullYear();

        const paidFilings = filings.filter((f) => f.status === "paid");
        const paidVat = vatReturns.filter((v) => v.status === "paid");
        const paidInYear = (items: { paidAt?: string; amount?: number; payable?: number }[]) =>
          items
            .filter((i) => i.paidAt && new Date(i.paidAt).getFullYear() === year)
            .reduce((s, i) => s + ("payable" in i && i.payable !== undefined ? i.payable : (i.amount ?? 0)), 0);

        const totalPaidYear = paidInYear(paidFilings) + paidInYear(paidVat);

        const trackable = [
          ...filings.filter((f) => f.status !== "draft"),
          ...vatReturns.filter((v) => v.status !== "draft"),
        ];
        const compliant = trackable.filter(
          (t) => effectiveFilingStatus(t.status, t.dueDate) === "paid" || t.status === "filed",
        );
        const complianceScore =
          trackable.length === 0 ? 100 : Math.round((compliant.length / trackable.length) * 100);

        const upcomingDeadlines = [
          ...filings
            .filter((f) => f.status === "pending" || f.status === "overdue" || f.status === "filed")
            .map((f) => ({
              id: f.id,
              title: f.title,
              authority: f.authority,
              dueDate: f.dueDate,
              category: f.category,
              status: effectiveFilingStatus(f.status, f.dueDate),
            })),
          ...vatReturns
            .filter((v) => v.status === "pending" || v.status === "overdue" || v.status === "filed")
            .map((v) => ({
              id: v.id,
              title: `VAT — ${v.period}`,
              authority: "FIRS" as const,
              dueDate: v.dueDate,
              category: "vat" as const,
              status: effectiveFilingStatus(v.status, v.dueDate),
            })),
        ]
          .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
          .slice(0, 6);

        const historyRows = [
          ...filings.map((f) => ({
            id: f.id,
            category: f.category,
            title: f.title,
            period: f.period,
            amount: f.amount,
            authority: f.authority,
            status: effectiveFilingStatus(f.status, f.dueDate),
            source: "filing" as const,
            sourceId: f.id,
          })),
          ...vatReturns.map((v) => ({
            id: v.id,
            category: "vat" as const,
            title: TAX_CATEGORY_LABELS.vat,
            period: v.period,
            amount: v.payable,
            authority: "FIRS" as const,
            status: effectiveFilingStatus(v.status, v.dueDate),
            source: "vat" as const,
            sourceId: v.id,
          })),
        ].sort((a, b) => b.period.localeCompare(a.period));

        return { totalPaidYear, complianceScore, upcomingDeadlines, historyRows };
      },
    }),
    { name: "mtf-taxes-v1" },
  ),
);
