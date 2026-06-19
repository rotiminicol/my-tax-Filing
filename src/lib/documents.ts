import type { ComplianceDocument } from "@/store/documents";

export type DocumentComplianceStatus = "compliant" | "expiring" | "overdue";

export interface DocumentStatusInfo {
  status: DocumentComplianceStatus;
  statusLabel: string;
  daysUntilExpiry: number;
  progressLabel: string;
  progressPct: number;
  progressColorKey: "primary" | "error";
}

const EXPIRING_WITHIN_DAYS = 90;

export function daysUntil(isoDate: string): number {
  const end = new Date(isoDate);
  end.setHours(23, 59, 59, 999);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

export function formatExpiryDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatShortMonth(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("en-GB", {
    month: "short",
    year: "numeric",
  });
}

export function getDocumentStatus(expiryDate: string): DocumentStatusInfo {
  const days = daysUntil(expiryDate);

  if (days < 0) {
    const overdue = Math.abs(days);
    return {
      status: "overdue",
      statusLabel: "Overdue",
      daysUntilExpiry: days,
      progressLabel: `Expired ${overdue} day${overdue === 1 ? "" : "s"} ago`,
      progressPct: 100,
      progressColorKey: "error",
    };
  }

  if (days <= EXPIRING_WITHIN_DAYS) {
    const pct = Math.min(100, Math.round(((EXPIRING_WITHIN_DAYS - days) / EXPIRING_WITHIN_DAYS) * 100));
    return {
      status: "expiring",
      statusLabel: "Expiring Soon",
      daysUntilExpiry: days,
      progressLabel: `${days} day${days === 1 ? "" : "s"} left`,
      progressPct: Math.max(pct, 8),
      progressColorKey: "error",
    };
  }

  const pct = Math.min(100, Math.round((days / 365) * 100));
  return {
    status: "compliant",
    statusLabel: "Compliant",
    daysUntilExpiry: days,
    progressLabel: `${days} days left`,
    progressPct: Math.max(pct, 12),
    progressColorKey: "primary",
  };
}

export function maskPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 6) return phone;
  return `+${digits.slice(0, 3)} ${digits.slice(3, 5)} *** ${digits.slice(-2)}`;
}

export function documentSubtitle(doc: ComplianceDocument): string {
  const parts = [doc.reference];
  if (doc.issuer) parts.push(doc.issuer);
  return parts.filter(Boolean).join(" · ");
}
