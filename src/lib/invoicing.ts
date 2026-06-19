export const VAT_RATE = 0.075;

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue";

export interface InvoiceLineInput {
  qty: number;
  price: number;
}

export function calculateInvoiceTotals(lines: InvoiceLineInput[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.qty * line.price, 0);
  const vat = Math.round(subtotal * VAT_RATE * 100) / 100;
  const total = subtotal + vat;
  return { subtotal, vat, total };
}

export function generateInvoiceNumber(existingNumbers: string[]): string {
  const year = new Date().getFullYear();
  const prefix = `MTF-${year}-`;
  const nums = existingNumbers
    .filter((n) => n.startsWith(prefix))
    .map((n) => parseInt(n.slice(prefix.length), 10))
    .filter((n) => !Number.isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return `${prefix}${String(next).padStart(3, "0")}`;
}

export function clientInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function formatInvoiceDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatActivityTime(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function isPastDue(dueDate: string | undefined): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  return due.getTime() < Date.now();
}

export function effectiveStatus(
  status: InvoiceStatus,
  dueDate?: string,
): InvoiceStatus {
  if (status === "sent" && isPastDue(dueDate)) return "overdue";
  return status;
}

export function defaultDueDate(daysFromNow = 14): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().slice(0, 10);
}
