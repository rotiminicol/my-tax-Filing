import { useMemo } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";
import { useReceiptsStore } from "@/store/receipts";
import { useTaxesStore } from "@/store/taxes";
import { useDocumentsStore } from "@/store/documents";
import { useInvoicingStore } from "@/store/invoicing";
import { PlanBadge } from "@/components/subscription/PlanBadge";
import { UsageIndicator } from "@/components/subscription/UsageIndicator";
import { planDisplayName } from "@/lib/planConfig";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Layers,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

function formatCurrency(amount: number) {
  return `₦${amount.toLocaleString("en-NG")}`;
}

function DashboardHomePage() {
  const user = useAuth((s) => s.user);
  const receiptsCount = useReceiptsStore((s) => s.receipts.length);
  const documents = useDocumentsStore((s) => s.documents);
  const filings = useTaxesStore((s) => s.filings);
  const vatReturns = useTaxesStore((s) => s.vatReturns);
  const invoices = useInvoicingStore((s) => s.invoices);

  const pendingRenewals = useMemo(
    () => documents.filter((d) => d.renewalStatus === "pending").length,
    [documents],
  );

  const { totalPaidYear, complianceScore, upcomingDeadlines } = useMemo(() => {
    const year = new Date().getFullYear();

    const paidFilings = filings.filter((f) => f.status === "paid");
    const paidVat = vatReturns.filter((v) => v.status === "paid");

    const paidInYear = (items: Array<{ paidAt?: string; amount?: number; payable?: number }>) =>
      items
        .filter((item) => item.paidAt && new Date(item.paidAt).getFullYear() === year)
        .reduce((sum, item) => sum + (item.payable ?? item.amount ?? 0), 0);

    const totalPaidYear = paidInYear(paidFilings) + paidInYear(paidVat);

    const trackable = [
      ...filings.filter((f) => f.status !== "draft"),
      ...vatReturns.filter((v) => v.status !== "draft"),
    ];

    const compliant = trackable.filter(
      (t) =>
        t.status === "paid" ||
        t.status === "filed" ||
        (t.dueDate !== undefined && new Date(t.dueDate) <= new Date()),
    );

    const complianceScore =
      trackable.length === 0 ? 100 : Math.round((compliant.length / trackable.length) * 100);

    const upcomingDeadlines = [
      ...filings
        .filter((f) => ["pending", "overdue", "filed"].includes(f.status))
        .map((f) => ({
          id: f.id,
          title: f.title,
          authority: f.authority,
          dueDate: f.dueDate,
          status: f.status,
        })),
      ...vatReturns
        .filter((v) => ["pending", "overdue", "filed"].includes(v.status))
        .map((v) => ({
          id: v.id,
          title: `VAT — ${v.period}`,
          authority: "FIRS",
          dueDate: v.dueDate,
          status: v.status,
        })),
    ]
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
      .slice(0, 6);

    return { totalPaidYear, complianceScore, upcomingDeadlines };
  }, [filings, vatReturns]);

  const paidCount = useMemo(() => invoices.filter((i) => i.status === "paid").length, [invoices]);

  const cards = useMemo(
    () => [
      {
        title: "Rent Receipt",
        value: `${receiptsCount} saved`,
        detail: "Create pay-as-you-go certified rent receipts for employers or landlords.",
        icon: ClipboardCheck,
        link: "/customer-dashboard/receipts",
      },
      {
        title: "Taxes",
        value: `${complianceScore}% compliance`,
        detail: "Track deadlines, filing status, and year-to-date tax payments.",
        icon: ShieldCheck,
        link: "/customer-dashboard/taxes",
      },
      {
        title: "Document Renewal",
        value: `${documents.length} documents`,
        detail: "Monitor renewals and submit new applications in one place.",
        icon: FileText,
        link: "/customer-dashboard/documents",
      },
      {
        title: "E-Invoicing",
        value: `${paidCount} paid invoices`,
        detail: "Manage invoices, overdue balances, and payment collections.",
        icon: TrendingUp,
        link: "/customer-dashboard/invoicing/manage",
      },
    ],
    [receiptsCount, complianceScore, documents.length, paidCount],
  );

  return (
    <DashboardShell title="Dashboard Overview">
      <div className="space-y-8">
        {/* Subscription Plan Status Banner */}
        <div
          className="rounded-2xl border p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
          style={{ background: SB.cream, borderColor: SB.cardBorder }}
        >
          <div className="flex items-center gap-3">
            <PlanBadge plan={user?.plan} />
            <div>
              <p className="text-sm font-bold" style={{ color: SB.ink }}>
                {planDisplayName(user?.plan)} Subscription
                {user?.planBillingCycle
                  ? ` · ${user.planBillingCycle === "annual" ? "Annual" : "Monthly"}`
                  : ""}
              </p>
              <p className="text-xs" style={{ color: SB.muted }}>
                {user?.plan === "premium"
                  ? "Unlimited access to all tax filing, receipt generation, and consultant services."
                  : user?.plan === "deluxe"
                    ? "Unlimited VAT & PIT filing, audit docs, priority support."
                    : "Free tier with 5 receipts/month. Upgrade to unlock batch filing and unlimited tools."}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {user?.plan === "free" && (
              <UsageIndicator feature="receipt-generate" label="Receipts" className="min-w-32" />
            )}
            {user?.plan !== "premium" && (
              <Link
                to="/customer-dashboard/subscription"
                className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase tracking-wide shrink-0 transition hover:opacity-90"
                style={{ background: SB.yellow, color: SB.ink }}
              >
                <Zap size={14} />
                Upgrade Plan
              </Link>
            )}
          </div>
        </div>

        <section
          className="rounded-[32px] border p-6 shadow-sm"
          style={{ backgroundColor: "rgba(252,250,245,0.96)", borderColor: "rgba(26,51,0,0.08)" }}
        >
          <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <p
                className="text-xs font-bold uppercase tracking-[0.35em] mb-3"
                style={{ color: SB.yellow }}
              >
                Smart dashboard
              </p>
              <h1 className="text-4xl font-extrabold tracking-tight" style={{ color: SB.ink }}>
                Your compliance command center
              </h1>
              <p className="mt-4 text-sm leading-7" style={{ color: SB.muted }}>
                Get an instant pulse on rent receipts, tax obligations, renewals, and invoices — all
                in one streamlined workspace.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/customer-dashboard/receipts"
                className="inline-flex items-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-all duration-200 hover:bg-black/5"
                style={{ borderColor: SB.cardBorder, color: SB.ink }}
              >
                <Zap className="w-4 h-4" />
                New receipt
              </Link>
              <Link
                to="/customer-dashboard/taxes"
                className="inline-flex items-center gap-2 rounded-full bg-[#18623f] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:opacity-90"
              >
                <BarChart3 className="w-4 h-4" />
                Review taxes
              </Link>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                label: "Compliance score",
                value: `${complianceScore}%`,
                icon: CheckCircle2,
                bg: SB.mint,
              },
              {
                label: "Pending renewals",
                value: pendingRenewals.toString(),
                icon: CalendarCheck,
                bg: SB.yellow,
              },
              {
                label: "Paid invoices",
                value: paidCount.toString(),
                icon: TrendingUp,
                bg: SB.teal,
              },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div
                  key={stat.label}
                  className="rounded-[28px] p-5"
                  style={{ backgroundColor: stat.bg, color: SB.ink }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.45em] font-bold">
                        {stat.label}
                      </p>
                      <p className="mt-3 text-3xl font-extrabold">{stat.value}</p>
                    </div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-[#18623f]">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div
                key={card.title}
                className="rounded-[28px] border p-6 shadow-sm transition hover:-translate-y-1"
                style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="text-sm uppercase tracking-[0.2em] font-bold"
                      style={{ color: SB.pencil }}
                    >
                      {card.title}
                    </p>
                    <p className="text-3xl font-extrabold mt-4" style={{ color: SB.ink }}>
                      {card.value}
                    </p>
                  </div>
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-3xl"
                    style={{
                      backgroundColor:
                        index % 2 === 0 ? SB.mint : index === 1 ? SB.yellow : SB.cream,
                      color: SB.ink,
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6" style={{ color: SB.muted }}>
                  {card.detail}
                </p>
                <Link
                  to={card.link}
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold"
                  style={{ color: SB.ink }}
                >
                  Use {card.title}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            );
          })}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div
            className="rounded-[32px] border p-6 shadow-sm"
            style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
          >
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <p
                  className="text-sm uppercase tracking-[0.2em] font-bold"
                  style={{ color: SB.pencil }}
                >
                  Operational view
                </p>
                <h2 className="text-2xl font-extrabold mt-2" style={{ color: SB.ink }}>
                  Top priorities this week
                </h2>
              </div>
              <span
                className="rounded-full bg-[#e5f4e6] px-4 py-2 text-xs font-semibold"
                style={{ color: SB.ink }}
              >
                Updated now
              </span>
            </div>

            <div className="grid gap-4">
              {upcomingDeadlines.slice(0, 3).map((deadline) => (
                <div
                  key={deadline.id}
                  className="rounded-[26px] border p-5"
                  style={{ borderColor: SB.cardBorder, backgroundColor: SB.cream }}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold" style={{ color: SB.ink }}>
                        {deadline.title}
                      </p>
                      <p className="text-sm mt-1" style={{ color: SB.muted }}>
                        {deadline.authority}
                      </p>
                    </div>
                    <span className="rounded-2xl bg-[#18623f] px-3 py-1 text-[11px] font-bold uppercase text-white">
                      {deadline.status}
                    </span>
                  </div>
                  <div
                    className="mt-4 flex items-center justify-between gap-3 text-sm"
                    style={{ color: SB.muted }}
                  >
                    <p>{deadline.dueDate}</p>
                    <div className="inline-flex items-center gap-2 text-[#18623f] font-semibold">
                      <Layers className="w-4 h-4" />
                      Review
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div
              className="rounded-[32px] border p-6 shadow-sm"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#fef3c7] text-[#18623f]">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <p
                    className="text-sm uppercase tracking-[0.2em] font-bold"
                    style={{ color: SB.pencil }}
                  >
                    Productivity boost
                  </p>
                  <h2 className="text-xl font-extrabold mt-2" style={{ color: SB.ink }}>
                    Faster filing, less friction
                  </h2>
                </div>
              </div>
              <div className="space-y-4">
                {[
                  {
                    title: "Automated checks",
                    description:
                      "The system flags missing fields and suggests the next best compliance step.",
                  },
                  {
                    title: "Unified follow-up",
                    description:
                      "One place for receipts, invoices, tax deadlines and document applications.",
                  },
                  {
                    title: "Clear action cards",
                    description: "Quick entry points keep every task reachable in two clicks.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[24px] border p-4"
                    style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                  >
                    <p className="text-sm font-semibold" style={{ color: SB.ink }}>
                      {item.title}
                    </p>
                    <p className="text-sm mt-1" style={{ color: SB.muted }}>
                      {item.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-[32px] border p-6 shadow-sm"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="flex items-center justify-between gap-3 mb-5">
                <div>
                  <p
                    className="text-sm uppercase tracking-[0.2em] font-bold"
                    style={{ color: SB.pencil }}
                  >
                    Quick actions
                  </p>
                  <h2 className="text-xl font-extrabold mt-2" style={{ color: SB.ink }}>
                    Stay on top of every task
                  </h2>
                </div>
              </div>
              <div className="grid gap-3">
                {[
                  { label: "Create receipt", to: "/customer-dashboard/receipts" },
                  { label: "Start new filing", to: "/customer-dashboard/taxes" },
                  { label: "Renew document", to: "/customer-dashboard/documents" },
                  { label: "Send invoice", to: "/customer-dashboard/invoicing/manage" },
                ].map((action) => (
                  <Link
                    key={action.to}
                    to={action.to}
                    className="rounded-3xl border px-5 py-4 text-sm font-semibold transition-all duration-200 hover:bg-black/5"
                    style={{ borderColor: SB.cardBorder, color: SB.ink }}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}

export default DashboardHomePage;
