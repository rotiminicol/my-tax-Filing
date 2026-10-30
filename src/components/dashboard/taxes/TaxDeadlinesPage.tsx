import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react";
import { deadlineLabel, TAX_CATEGORY_LABELS, type TaxCategory } from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { TaxStatusBadge, glassCard } from "./taxShared";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

function monthDayBadge(iso: string) {
  const d = new Date(iso);
  const month = d.toLocaleDateString("en-GB", { month: "short" });
  const day = d.getDate();
  const urgent = deadlineLabel(iso).startsWith("Overdue") || deadlineLabel(iso) === "Due today";
  return { month, day, urgent };
}

export default function TaxDeadlinesPage() {
  const filings = useTaxesStore((s) => s.filings);
  const vatReturns = useTaxesStore((s) => s.vatReturns);
  const syncStatuses = useTaxesStore((s) => s.syncStatuses);

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  const upcomingDeadlines = useMemo(() => {
    const allItems = [
      ...filings
        .filter((f) => f.status === "pending" || f.status === "overdue" || f.status === "filed")
        .map((f) => ({
          id: f.id,
          title: f.title,
          authority: f.authority,
          dueDate: f.dueDate,
          category: f.category as TaxCategory,
          status: f.status,
          source: "filing" as const,
        })),
      ...vatReturns
        .filter((v) => v.status === "pending" || v.status === "overdue" || v.status === "filed")
        .map((v) => ({
          id: v.id,
          title: `VAT — ${v.period}`,
          authority: "FIRS" as const,
          dueDate: v.dueDate,
          category: "vat" as const,
          status: v.status,
          source: "vat" as const,
        })),
    ].sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return allItems;
  }, [filings, vatReturns]);

  const overdue = upcomingDeadlines.filter((d) => deadlineLabel(d.dueDate).startsWith("Overdue"));
  const urgent = upcomingDeadlines.filter((d) => deadlineLabel(d.dueDate).includes("day") && !deadlineLabel(d.dueDate).startsWith("Overdue"));
  const upcoming = upcomingDeadlines.filter((d) => deadlineLabel(d.dueDate) === "Upcoming");

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={glassCard}>
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: SB.forestInk, fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif" }}
        >
          Tax Deadlines
        </h1>
        <p className="text-base" style={{ color: SB.pencilGray }}>
          Track all your filing and payment due dates in one place.
        </p>
      </div>

      {overdue.length > 0 && (
        <div className="rounded-xl p-6 border-2" style={{ backgroundColor: "#fef2f2", borderColor: "#991b1b" }}>
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="w-5 h-5" style={{ color: "#991b1b" }} />
            <h3 className="text-lg font-bold" style={{ color: "#991b1b" }}>
              Overdue ({overdue.length})
            </h3>
          </div>
          <div className="space-y-3">
            {overdue.map((item) => (
              <DeadlineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      {urgent.length > 0 && (
        <div className="rounded-xl p-6" style={glassCard}>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5" style={{ color: "#92400e" }} />
            <h3 className="text-lg font-bold" style={{ color: "#92400e" }}>
              Due Soon ({urgent.length})
            </h3>
          </div>
          <div className="space-y-3">
            {urgent.map((item) => (
              <DeadlineItem key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="rounded-xl p-6" style={glassCard}>
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-5 h-5" style={{ color: SB.forestInk, opacity: 0.5 }} />
          <h3 className="text-lg font-bold" style={{ color: SB.forestInk }}>
            Upcoming ({upcoming.length})
          </h3>
        </div>
        {upcoming.length === 0 ? (
          <p className="text-sm py-4" style={{ color: SB.pencilGray }}>
            No upcoming deadlines. Add a tax filing or VAT return to track due dates.
          </p>
        ) : (
          <div className="space-y-3">
            {upcoming.map((item) => (
              <DeadlineItem key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function DeadlineItem({ item }: { item: any }) {
  const badge = monthDayBadge(item.dueDate);
  const label = deadlineLabel(item.dueDate);

  return (
    <Link
      to={item.source === "vat" ? "/customer-dashboard/taxes/vat" : "/customer-dashboard/taxes/filing"}
      className="flex items-center justify-between p-4 rounded-lg border hover:border-[#18623f]/30 hover:bg-[#fcfaf5] transition-all gap-3 flex-wrap"
      style={{ backgroundColor: "#f9f9f9", borderColor: "rgba(26,51,0,0.10)" }}
    >
      <div className="flex items-center gap-4">
        <div
          className="w-12 h-12 rounded-lg flex flex-col items-center justify-center text-xs font-bold"
          style={{
            backgroundColor: badge.urgent ? "#fecaca" : "#ffe95c",
            color: badge.urgent ? "#991b1b" : "#18623f",
          }}
        >
          <span className="uppercase leading-none">{badge.month}</span>
          <span className="text-lg leading-tight">{badge.day}</span>
        </div>
        <div>
          <p className="font-bold" style={{ color: "#18623f" }}>{item.title}</p>
          <p className="text-xs" style={{ color: "#b6b6b6" }}>
            {item.authority === "FIRS"
              ? "Federal Inland Revenue Service"
              : item.authority === "LIRS"
                ? "Lagos State Internal Revenue Service"
                : item.authority}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs font-medium" style={{ color: "#b6b6b6" }}>
          {label}
        </span>
        <TaxStatusBadge status={item.status} />
      </div>
    </Link>
  );
}
