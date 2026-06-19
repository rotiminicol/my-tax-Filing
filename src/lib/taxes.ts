export const VAT_RATE = 0.075;

export type TaxAuthority = "FIRS" | "LIRS" | "Other";

export type TaxFilingStatus = "draft" | "pending" | "filed" | "paid" | "overdue";

export type TaxCategory = "pit" | "vat" | "wht" | "cit" | "paye";

export const WHT_RATES: Record<string, number> = {
  rent: 10,
  consulting: 10,
  director_fees: 10,
  interest: 10,
  dividends: 10,
  royalties: 5,
  commissions: 5,
  construction: 5,
  supplies: 5,
};

export const WHT_TYPE_LABELS: Record<string, string> = {
  rent: "Rent",
  consulting: "Consulting Services",
  director_fees: "Director's Fees",
  interest: "Interest",
  dividends: "Dividends",
  royalties: "Royalties",
  commissions: "Commissions",
  construction: "Construction",
  supplies: "Supplies / Contracts",
};

export const TAX_CATEGORY_LABELS: Record<TaxCategory, string> = {
  pit: "Personal Income Tax",
  vat: "Value Added Tax (VAT)",
  wht: "Withholding Tax",
  cit: "Company Income Tax",
  paye: "PAYE Assessment",
};

export const NIGERIA_PIT_BRACKETS = [
  { min: 0, max: 300000, rate: 0 },
  { min: 300001, max: 600000, rate: 0.07 },
  { min: 600001, max: 1100000, rate: 0.11 },
  { min: 1100001, max: 1600000, rate: 0.15 },
  { min: 1600001, max: 3200000, rate: 0.19 },
  { min: 3200001, max: Infinity, rate: 0.24 },
];

export function calculatePAYE(monthlyGross: number, monthlyAllowances = 0) {
  const annualGross = monthlyGross * 12;
  const totalAllowances = monthlyAllowances * 12;
  const taxableIncome = Math.max(0, annualGross - totalAllowances);

  let annualTax = 0;
  for (const bracket of NIGERIA_PIT_BRACKETS) {
    if (taxableIncome > bracket.min) {
      const taxableInBracket = Math.min(taxableIncome, bracket.max) - bracket.min;
      annualTax += taxableInBracket * bracket.rate;
    }
  }

  const monthlyTax = annualTax / 12;
  const monthlyNet = monthlyGross - monthlyTax;

  return {
    monthlyGross,
    annualGross,
    totalAllowances,
    taxableIncome,
    annualTax: Math.round(annualTax),
    monthlyTax: Math.round(monthlyTax),
    monthlyNet: Math.round(monthlyNet),
    effectiveRate: annualGross > 0 ? ((annualTax / annualGross) * 100).toFixed(1) : "0.0",
  };
}

export function calculateWHT(amount: number, type: string) {
  const rate = WHT_RATES[type] ?? 10;
  const whtAmount = Math.round((amount * rate) / 100);
  return { rate, whtAmount, netAmount: amount - whtAmount };
}

export function calculateVATPayable(outputVAT: number, inputVAT: number) {
  return Math.max(0, outputVAT - inputVAT);
}

export function daysUntil(isoDate: string): number {
  const end = new Date(isoDate);
  end.setHours(23, 59, 59, 999);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function effectiveFilingStatus(status: TaxFilingStatus, dueDate?: string): TaxFilingStatus {
  if ((status === "pending" || status === "filed") && dueDate && daysUntil(dueDate) < 0) {
    return "overdue";
  }
  return status;
}

export function formatTaxDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatTaxDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function deadlineLabel(dueDate: string): string {
  const days = daysUntil(dueDate);
  if (days < 0) return `Overdue ${Math.abs(days)} day${Math.abs(days) === 1 ? "" : "s"}`;
  if (days === 0) return "Due today";
  if (days <= 30) return `Due in ${days} day${days === 1 ? "" : "s"}`;
  return "Upcoming";
}

export function generateTaxRef(prefix: string, existing: string[]): string {
  const year = new Date().getFullYear();
  const base = `${prefix}-${year}-`;
  const nums = existing
    .filter((n) => n.startsWith(base))
    .map((n) => parseInt(n.slice(base.length), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${base}${String(next).padStart(3, "0")}`;
}

export function categoryIcon(category: TaxCategory): "receipt" | "vat" | "wht" | "building" {
  if (category === "vat") return "vat";
  if (category === "wht") return "wht";
  if (category === "cit") return "building";
  return "receipt";
}
