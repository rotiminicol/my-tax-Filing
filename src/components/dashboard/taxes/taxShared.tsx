import type { CSSProperties, ReactNode } from "react";
import { Building2, FileText, Receipt } from "lucide-react";
import type { TaxCategory, TaxFilingStatus } from "@/lib/taxes";
import { categoryIcon, TAX_CATEGORY_LABELS } from "@/lib/taxes";

const SB = {
  forestInk: "#1a3300",
  cream: "#fcfaf5",
  white: "#ffffff",
  cardBorder: "rgba(26,51,0,0.10)",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  yellow: "#ffe95c",
  blush: "#f6d0ff",
};

export const glassCard: CSSProperties = {
  background: SB.white,
  border: `1.5px solid ${SB.cardBorder}`,
  boxShadow: "0 1px 3px rgba(26,51,0,0.05)",
};

export const fiscalInputClass =
  "w-full px-4 py-3 rounded-lg text-sm outline-none focus:ring-2 transition-all";

export function fiscalInputStyle(bg = "#f1f1f1"): CSSProperties {
  return { backgroundColor: bg, border: `1px solid rgba(26,51,0,0.10)` };
}

const STATUS_STYLES: Record<TaxFilingStatus, { bg: string; color: string; label: string }> = {
  draft: { bg: SB.whisperGray, color: SB.pencilGray, label: "Draft" },
  pending: { bg: SB.yellow, color: SB.forestInk, label: "Pending" },
  filed: { bg: SB.teal, color: SB.forestInk, label: "Filed" },
  paid: { bg: SB.mint, color: SB.forestInk, label: "Paid" },
  overdue: { bg: "#fecaca", color: "#991b1b", label: "Overdue" },
};

export function TaxStatusBadge({ status }: { status: TaxFilingStatus }) {
  const s = STATUS_STYLES[status];
  return (
    <span
      className="px-3 py-1 text-[10px] font-bold rounded-full uppercase inline-flex items-center gap-1"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      {s.label}
    </span>
  );
}

export function TaxCategoryIcon({ category }: { category: TaxCategory }) {
  const kind = categoryIcon(category);
  const Icon = kind === "building" ? Building2 : kind === "vat" ? Receipt : FileText;
  const bg =
    kind === "vat" ? SB.yellow
    : kind === "wht" ? SB.teal
    : kind === "building" ? SB.blush
    : SB.mint;

  return (
    <span className="p-2 rounded inline-flex" style={{ backgroundColor: bg, color: SB.forestInk }}>
      <Icon className="w-4 h-4" />
    </span>
  );
}

export function TaxCategoryLabel({ category }: { category: TaxCategory }) {
  return <>{TAX_CATEGORY_LABELS[category]}</>;
}

export function TaxPageHeader({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl p-6 mb-6" style={glassCard}>
      <div className="flex items-start gap-4">
        <div
          className="p-3 rounded-xl shrink-0"
          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
        >
          {icon}
        </div>
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ color: SB.forestInk }}>
            {title}
          </h2>
          <p className="text-sm" style={{ color: SB.pencilGray }}>
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

export function TaxEmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="rounded-xl p-10 text-center border"
      style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
    >
      <p className="font-semibold mb-1" style={{ color: SB.forestInk }}>
        {title}
      </p>
      <p className="text-sm mb-4" style={{ color: SB.pencilGray }}>
        {description}
      </p>
      {action}
    </div>
  );
}
