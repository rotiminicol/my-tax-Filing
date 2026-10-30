import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FilePlus,
  Upload,
  Download,
  Send,
  Receipt as ReceiptIcon,
  TrendingUp,
  Clock,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Printer,
  Share2,
} from "lucide-react";
import { useReceiptsStore } from "@/store/receipts";
import { formatNaira } from "@/lib/rr/format";
import type { Receipt } from "@/lib/rr/types";
import ExportModal from "@/components/dashboard/ExportModal";
import ShareModal from "@/components/dashboard/ShareModal";
import { useState } from "react";

/* Say Briefly tokens */
const sb = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  blush: "#f6d0ff",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

function StatusBadge({ status }: { status: Receipt["status"] }) {
  if (status === "generated") {
    return (
      <span
        className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
        style={{ backgroundColor: "#d5f5c2", color: "#18623f" }}
      >
        Generated
      </span>
    );
  }
  return (
    <span
      className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
      style={{ backgroundColor: "#ffe95c", color: "#18623f" }}
    >
      Pending
    </span>
  );
}

const AVATAR_COLORS = [
  { bg: "#d5f5c2", color: "#18623f" },
  { bg: "#ffe95c", color: "#18623f" },
  { bg: "#a8e5e5", color: "#18623f" },
  { bg: "#f6d0ff", color: "#18623f" },
  { bg: "#fcfaf5", color: "#18623f" },
];

function initials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

const DEADLINE = new Date("2026-05-31T23:59:59");

function useDeadlineCountdown() {
  const now = new Date();
  const diff = DEADLINE.getTime() - now.getTime();
  if (diff <= 0) return { label: "Overdue", urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return { label: "Today", urgent: true };
  if (days === 1) return { label: "1 day left", urgent: true };
  return { label: `${days} days left`, urgent: days <= 7 };
}

export default function RentReceiptPage() {
  const receipts = useReceiptsStore((s) => s.receipts);
  const deadline = useDeadlineCountdown();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  const stats = useMemo(() => {
    const total = receipts.length;
    const totalClaimed = receipts.reduce((sum, r) => sum + r.taxpayer.allowanceClaimed, 0);
    const pending = receipts.filter((r) => r.status !== "generated").length;
    const generated = receipts.filter((r) => r.status === "generated").length;
    return { total, totalClaimed, pending, generated };
  }, [receipts]);

  const recent = useMemo(() => receipts.slice(0, 5), [receipts]);

  const TIMELINE = [
    {
      label: "Receipts created",
      sub: stats.total > 0 ? "Completed" : "Not started",
      done: stats.total > 0,
      active: false,
    },
    {
      label: "Signatures & review",
      sub: stats.pending > 0 ? "In progress" : stats.total > 0 ? "Completed" : "Pending",
      done: stats.pending === 0 && stats.total > 0,
      active: stats.pending > 0,
    },
    {
      label: "Submit to employer",
      sub: "By 31 May 2026",
      done: false,
      active: false,
    },
    {
      label: "FCT-IRS filing",
      sub: "Employer submits",
      done: false,
      active: false,
    },
  ];

  const timelineDoneCount = TIMELINE.filter((step) => step.done).length;
  const filingPct = Math.round((timelineDoneCount / TIMELINE.length) * 100);

  const QUICK_ACTIONS = [
    {
      to: "/customer-dashboard/receipt/new",
      icon: FilePlus,
      label: "New receipt",
      desc: "4-step wizard",
      cardBg: sb.mint,
      onClick: undefined,
    },
    {
      to: "/customer-dashboard/batch",
      icon: Upload,
      label: "Batch import",
      desc: "Upload CSV or Excel",
      cardBg: sb.teal,
      onClick: undefined,
    },
    {
      to: undefined,
      icon: Download,
      label: "Export all",
      desc: "PDF bundle download",
      cardBg: sb.yellow,
      onClick: () => setIsExportModalOpen(true),
    },
    {
      to: undefined,
      icon: Send,
      label: "Share to employer",
      desc: "Email or copy link",
      cardBg: sb.blush,
      onClick: () => setIsShareModalOpen(true),
    },
  ];

  /* Pastel stat card backgrounds — sticky-note palette */
  const STAT_CARDS = [
    {
      icon: ReceiptIcon,
      label: "Total issued",
      value: stats.total.toString(),
      sub: `${stats.generated} generated`,
      bg: sb.mint,
    },
    {
      icon: TrendingUp,
      label: "Total claimed",
      value: stats.totalClaimed > 0 ? formatNaira(stats.totalClaimed) : "₦0",
      sub: "Across all receipts",
      bg: sb.teal,
    },
    {
      icon: Clock,
      label: "Pending review",
      value: stats.pending.toString(),
      sub: "Awaiting signature",
      bg: sb.yellow,
    },
    {
      icon: AlertTriangle,
      label: "Filing deadline",
      value: deadline.label,
      sub: "Due 31 May 2026",
      bg: deadline.urgent ? "#fecaca" : sb.blush,
    },
  ];

  return (
    <>
      {/* Page header */}
      <div className="flex flex-wrap items-start justify-between mb-6 sm:mb-8 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight" style={{ color: sb.forestInk, fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}>
            Rent Receipts
          </h1>
          <p className="text-sm mt-1" style={{ color: sb.pencilGray }}>
            2026 tax year overview · FCT-IRS compliant
          </p>
        </div>
        <Link
          to="/customer-dashboard/receipt/new"
          className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-md font-bold text-sm transition-all hover:opacity-90 active:scale-[0.98]"
          style={{ backgroundColor: sb.forestInk, color: "#fcfaf5" }}
        >
          <FilePlus className="w-4 h-4" />
          <span>New Receipt</span>
        </Link>
      </div>

      {/* Pastel stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {STAT_CARDS.map(({ icon: Icon, label, value, sub, bg }) => (
          <div
            key={label}
            className="rounded-xl p-5"
            style={{ backgroundColor: bg, border: "1.5px solid rgba(26,51,0,0.08)" }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Icon className="w-4 h-4" style={{ color: sb.forestInk, opacity: 0.7 }} />
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: sb.forestInk, opacity: 0.6 }}
              >
                {label}
              </span>
            </div>
            <p className="text-2xl font-bold leading-none mb-1" style={{ color: sb.forestInk }}>
              {value}
            </p>
            <p className="text-xs" style={{ color: sb.forestInk, opacity: 0.55 }}>
              {sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left column: quick actions + recent receipts */}
        <div className="lg:col-span-7 space-y-6">

          {/* Quick actions */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: "#ffffff", borderColor: sb.cardBorder }}
          >
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ color: sb.pencilGray }}
            >
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {QUICK_ACTIONS.map(({ to, icon: Icon, label, desc, cardBg, onClick }) => {
                const inner = (
                  <>
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: cardBg }}
                    >
                      <Icon className="w-4 h-4" style={{ color: sb.forestInk }} />
                    </div>
                    <div className="min-w-0 text-left">
                      <p className="text-sm font-semibold leading-tight" style={{ color: sb.forestInk }}>
                        {label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: sb.pencilGray }}>
                        {desc}
                      </p>
                    </div>
                  </>
                );
                return to ? (
                  <Link
                    key={label}
                    to={to}
                    className="flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-[#fcfaf5]"
                    style={{ borderColor: sb.cardBorder }}
                  >
                    {inner}
                  </Link>
                ) : (
                  <button
                    key={label}
                    onClick={onClick}
                    className="flex items-center gap-3 p-4 rounded-lg border transition-colors hover:bg-[#fcfaf5] w-full"
                    style={{ borderColor: sb.cardBorder }}
                  >
                    {inner}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Recent receipts */}
          <section
            className="rounded-xl border overflow-hidden"
            style={{ backgroundColor: "#ffffff", borderColor: sb.cardBorder }}
          >
            <div
              className="px-6 py-4 border-b flex items-center justify-between"
              style={{ borderColor: sb.cardBorder }}
            >
              <h2
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: sb.pencilGray }}
              >
                Recent Receipts
              </h2>
              <Link
                to="/customer-dashboard/receipts"
                className="text-xs font-semibold hover:underline flex items-center gap-0.5 transition-opacity hover:opacity-70"
                style={{ color: sb.forestInk }}
              >
                View all <ChevronRight className="w-3 h-3" />
              </Link>
            </div>

            {recent.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <ReceiptIcon className="w-8 h-8 mx-auto mb-3" style={{ color: sb.pencilGray }} />
                <p className="text-sm font-medium" style={{ color: sb.forestInk }}>
                  No receipts yet
                </p>
                <p className="text-xs mt-1" style={{ color: sb.pencilGray }}>
                  Issue your first receipt to get started.
                </p>
                <Link
                  to="/customer-dashboard/receipt/new"
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 rounded-md text-xs font-bold transition-opacity hover:opacity-90"
                  style={{ backgroundColor: sb.forestInk, color: "#fcfaf5" }}
                >
                  <FilePlus className="w-3.5 h-3.5" /> Generate Receipt
                </Link>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: sb.cardBorder }}>
                {recent.map((r, i) => {
                  const av = AVATAR_COLORS[i % AVATAR_COLORS.length];
                  return (
                    <div
                      key={r.id}
                      className="flex items-center gap-2 px-4 sm:px-6 py-3.5 hover:bg-[#fcfaf5] transition-colors"
                    >
                      {/* Main row content → links to preview */}
                      <Link
                        to="/customer-dashboard/receipt/preview"
                        className="flex items-center gap-3 flex-1 min-w-0"
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold border"
                          style={{ backgroundColor: av.bg, color: av.color, borderColor: "rgba(26,51,0,0.10)" }}
                        >
                          {initials(r.taxpayer.fullName)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: sb.forestInk }}>
                            {r.taxpayer.fullName}
                          </p>
                          <p className="text-xs truncate mt-0.5" style={{ color: sb.pencilGray }}>
                            {r.taxpayer.propertyAddress} · {r.employer.claimYear}
                          </p>
                        </div>
                        <div className="text-right shrink-0 hidden sm:block">
                          <p className="text-sm font-bold" style={{ color: sb.forestInk }}>
                            {formatNaira(r.taxpayer.allowanceClaimed)}
                          </p>
                          <p className="text-[10px] mt-0.5" style={{ color: sb.pencilGray }}>
                            {new Date(r.createdAt).toLocaleDateString("en-NG", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                        <span className="hidden sm:block">
                          <StatusBadge status={r.status} />
                        </span>
                      </Link>

                      {/* Action buttons */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        <button
                          title="Download PDF"
                          onClick={() => window.print()}
                          className="p-2 rounded-md transition-colors hover:bg-[#d5f5c2]"
                          style={{ color: sb.forestInk }}
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Print"
                          onClick={() => window.print()}
                          className="p-2 rounded-md transition-colors hover:bg-[#d5f5c2]"
                          style={{ color: sb.forestInk }}
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>
                        <button
                          title="Share"
                          onClick={() => setIsShareModalOpen(true)}
                          className="p-2 rounded-md transition-colors hover:bg-[#d5f5c2]"
                          style={{ color: sb.forestInk }}
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* Right column: filing status */}
        <div className="lg:col-span-5 space-y-6">

          {/* Filing progress */}
          <section
            className="rounded-xl border p-6"
            style={{ backgroundColor: "#ffffff", borderColor: sb.cardBorder }}
          >
            <h2
              className="text-[11px] font-bold uppercase tracking-widest mb-4"
              style={{ color: sb.pencilGray }}
            >
              Filing Status
            </h2>

            <div className="flex items-baseline justify-between mb-2">
              <span className="text-xs font-medium" style={{ color: sb.pencilGray }}>
                Completion
              </span>
              <span className="text-sm font-bold" style={{ color: sb.forestInk }}>
                {filingPct}%
              </span>
            </div>
            <div
              className="w-full h-2 rounded-full mb-1 overflow-hidden"
              style={{ backgroundColor: sb.whisperGray }}
            >
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${filingPct}%`,
                  backgroundColor: filingPct === 100 ? "#2B8A3E" : sb.yellow,
                  border: filingPct > 0 ? "1px solid rgba(26,51,0,0.15)" : "none",
                }}
              />
            </div>
            <p className="text-xs mb-6" style={{ color: sb.pencilGray }}>
              {stats.generated} of {stats.total} receipts fully signed
            </p>

            {/* Timeline */}
            <div className="border-t pt-6" style={{ borderColor: sb.cardBorder }}>
              <p
                className="text-[11px] font-bold uppercase tracking-widest mb-5"
                style={{ color: sb.pencilGray }}
              >
                Filing Timeline
              </p>
              <div className="space-y-0">
                {TIMELINE.map(({ label, sub, done, active }, index) => (
                  <div key={label} className="relative flex items-start gap-4">
                    {index < TIMELINE.length - 1 && (
                      <div
                        className="absolute left-[9px] top-7 w-0.5 border-l border-dashed"
                        style={{
                          height: "calc(100% - 4px)",
                          borderColor: done ? sb.mint : sb.cardBorder,
                        }}
                      />
                    )}
                    <div className="relative flex flex-col items-center shrink-0 mt-1">
                      <div
                        className="w-[18px] h-[18px] rounded-full border-2 transition-all flex items-center justify-center"
                        style={{
                          backgroundColor: done ? sb.mint : active ? sb.yellow : "#ffffff",
                          borderColor: done ? "#2B8A3E" : active ? "#18623f" : sb.cardBorder,
                        }}
                      >
                        {done && <CheckCircle2 className="w-3 h-3" style={{ color: "#2B8A3E" }} />}
                      </div>
                    </div>
                    <div className="flex-1 pt-0 pb-6">
                      <p
                        className={`text-sm font-semibold leading-tight ${done ? "line-through" : ""}`}
                        style={{ color: done ? sb.pencilGray : sb.forestInk }}
                      >
                        {label}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: active ? sb.forestInk : sb.pencilGray }}
                      >
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Deadline warning */}
          <div
            className="rounded-xl border p-5"
            style={{
              backgroundColor: deadline.urgent ? "#fff1f2" : sb.blush,
              borderColor: deadline.urgent ? "#fca5a5" : "rgba(246,208,255,0.5)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle
                className="w-4 h-4 shrink-0"
                style={{ color: deadline.urgent ? "#C92A2A" : sb.forestInk }}
              />
              <p
                className="text-[11px] font-bold uppercase tracking-widest"
                style={{ color: deadline.urgent ? "#C92A2A" : sb.forestInk }}
              >
                FCT-IRS Filing Deadline
              </p>
            </div>
            <p
              className="text-xs leading-relaxed"
              style={{ color: deadline.urgent ? "#862E2E" : sb.forestInk, opacity: deadline.urgent ? 1 : 0.75 }}
            >
              All rent allowance claims must be submitted to your employer's PAYE tax office on or before{" "}
              <strong className="font-bold">31st May 2026</strong>. Delayed submissions forfeit the housing allowance tax relief for the year.
            </p>
            {stats.pending > 0 && (
              <Link
                to="/customer-dashboard/receipt/new"
                className="inline-flex items-center gap-1.5 mt-3 text-xs font-bold hover:underline"
                style={{ color: deadline.urgent ? "#C92A2A" : sb.forestInk }}
              >
                Complete {stats.pending} pending receipt{stats.pending > 1 ? "s" : ""}
                <ChevronRight className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
      <ShareModal isOpen={isShareModalOpen} onClose={() => setIsShareModalOpen(false)} />
    </>
  );
}
