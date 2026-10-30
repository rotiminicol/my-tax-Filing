import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Shield, TrendingUp, Calendar } from "lucide-react";
import { formatNaira } from "@/lib/rr/format";
import { effectiveFilingStatus } from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { glassCard } from "./taxShared";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

export default function TaxCompliancePage() {
  const filings = useTaxesStore((s) => s.filings);
  const vatReturns = useTaxesStore((s) => s.vatReturns);
  const syncStatuses = useTaxesStore((s) => s.syncStatuses);
  const getHubStats = useTaxesStore((s) => s.getHubStats);

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  const { totalPaidYear, complianceScore, upcomingDeadlines } = useMemo(
    () => getHubStats(),
    [filings, vatReturns, getHubStats],
  );

  const complianceMessage =
    complianceScore >= 90
      ? "Your filing status is strong. Keep deadlines on track for priority processing."
      : complianceScore >= 70
        ? "Most obligations are on track. Review pending items before they become overdue."
        : "Several items need attention. File or pay outstanding returns to improve your score.";

  const trackable = [
    ...filings.filter((f) => f.status !== "draft"),
    ...vatReturns.filter((v) => v.status !== "draft"),
  ];
  const compliant = trackable.filter(
    (t) => effectiveFilingStatus(t.status, t.dueDate) === "paid" || t.status === "filed",
  );
  const overdue = trackable.filter((t) => effectiveFilingStatus(t.status, t.dueDate) === "overdue");
  const pending = trackable.filter((t) => effectiveFilingStatus(t.status, t.dueDate) === "pending");

  return (
    <div className="space-y-6">
      <div className="rounded-xl p-6" style={glassCard}>
        <h1
          className="text-3xl font-bold tracking-tight mb-2"
          style={{ color: SB.forestInk, fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif" }}
        >
          Tax Compliance
        </h1>
        <p className="text-base" style={{ color: SB.pencilGray }}>
          Monitor your compliance status and improve your tax standing.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Compliance score */}
        <div
          className="rounded-xl overflow-hidden border"
          style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
        >
          <div className="h-32 relative overflow-hidden" style={{ backgroundColor: SB.mint }}>
            <div className="absolute inset-0 p-4 flex flex-col justify-end">
              <span
                className="text-[10px] font-bold px-2 py-1 rounded w-fit mb-2 uppercase"
                style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
              >
                Compliance
              </span>
              <h4 className="font-bold" style={{ color: SB.forestInk }}>Tax Compliance Score</h4>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-end justify-between mb-2">
              <span className="text-4xl font-bold" style={{ color: SB.forestInk }}>
                {complianceScore}%
              </span>
              {complianceScore >= 80 && (
                <CheckCircle2 className="w-6 h-6" style={{ color: "#1a5c3a" }} />
              )}
            </div>
            <div
              className="w-full h-2 rounded-full overflow-hidden mb-4"
              style={{ backgroundColor: SB.whisperGray }}
            >
              <div
                className="h-full transition-all"
                style={{ width: `${complianceScore}%`, backgroundColor: SB.mint, border: "1px solid rgba(26,51,0,0.15)" }}
              />
            </div>
            <p className="text-sm" style={{ color: SB.pencilGray }}>
              {complianceMessage}
            </p>
          </div>
        </div>

        {/* Total paid */}
        <div
          className="rounded-xl p-6 border"
          style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
        >
          <h3
            className="text-base font-bold mb-4 flex items-center gap-2"
            style={{ color: SB.forestInk }}
          >
            <TrendingUp className="w-5 h-5" style={{ opacity: 0.5 }} />
            Total Tax Paid This Year
          </h3>
          <span className="text-4xl md:text-5xl font-bold" style={{ color: SB.forestInk }}>
            {formatNaira(totalPaidYear)}
          </span>
          {totalPaidYear === 0 && (
            <p className="text-sm mt-2" style={{ color: SB.pencilGray }}>
              Mark returns as paid to track totals here.
            </p>
          )}
        </div>
      </div>

      {/* Stats row */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Compliant", value: compliant.length, icon: CheckCircle2, color: "#1a5c3a" },
          { label: "Pending", value: pending.length, icon: Calendar, color: "#92400e" },
          { label: "Overdue", value: overdue.length, icon: AlertTriangle, color: "#991b1b" },
        ].map((c) => (
          <div key={c.label} className="rounded-xl p-6" style={glassCard}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: SB.pencilGray }}>
                {c.label}
              </span>
              <c.icon className="w-5 h-5" style={{ color: c.color }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: c.color }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      {/* Compliance tips */}
      <div className="rounded-xl p-6" style={glassCard}>
        <h3
          className="text-base font-bold mb-4 flex items-center gap-2"
          style={{ color: SB.forestInk }}
        >
          <Shield className="w-5 h-5" style={{ opacity: 0.5 }} />
          Compliance Tips
        </h3>
        <ul className="space-y-3 text-sm" style={{ color: SB.pencilGray }}>
          {[
            "File all returns before the due date to avoid penalties and interest charges.",
            "Keep accurate records of all income, deductions, and supporting documents.",
            "Use the PAYE calculator to estimate monthly tax and avoid underpayment.",
            "Track VAT returns quarterly to ensure timely remittance to FIRS.",
          ].map((tip) => (
            <li key={tip} className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#1a5c3a" }} />
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Quick actions */}
      <div
        className="rounded-xl p-6"
        style={{ backgroundColor: SB.cream, border: `1.5px solid ${SB.cardBorder}` }}
      >
        <h3 className="text-base font-bold mb-4" style={{ color: SB.forestInk }}>
          Quick Actions
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              to: "/customer-dashboard/taxes/filing",
              icon: Calendar,
              label: "Manage Filings",
              sub: "Create and track tax filings",
            },
            {
              to: "/customer-dashboard/taxes/vat",
              icon: TrendingUp,
              label: "VAT Returns",
              sub: "Manage quarterly VAT filings",
            },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="p-4 rounded-lg border hover:bg-white transition-colors"
              style={{ borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5" style={{ color: SB.forestInk, opacity: 0.5 }} />
                <div>
                  <p className="font-bold text-sm" style={{ color: SB.forestInk }}>{item.label}</p>
                  <p className="text-xs" style={{ color: SB.pencilGray }}>{item.sub}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
