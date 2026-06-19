import { Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { formatNaira } from "@/lib/rr/format";
import { useInvoicingStore } from "@/store/invoicing";
import { effectiveStatus, formatInvoiceDate } from "@/lib/invoicing";
import { notify } from "@/components/Toaster";
import { AlertCircle, ArrowLeft, CheckCircle, Clock, CreditCard, TrendingUp } from "lucide-react";

function PaymentTrackingRoute() {
  const invoices = useInvoicingStore((s) => s.invoices);
  const clients = useInvoicingStore((s) => s.clients);
  const markInvoicePaid = useInvoicingStore((s) => s.markInvoicePaid);
  const syncOverdueStatuses = useInvoicingStore((s) => s.syncOverdueStatuses);

  useEffect(() => {
    syncOverdueStatuses();
  }, [syncOverdueStatuses]);

  const rows = useMemo(
    () =>
      invoices
        .filter((inv) => inv.status !== "draft")
        .map((inv) => {
          const status = effectiveStatus(inv.status, inv.dueDate);
          const client = clients.find((c) => c.id === inv.clientId);
          return { ...inv, status, clientName: client?.name ?? "—" };
        })
        .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt)),
    [invoices, clients],
  );

  const completed = rows.filter((r) => r.status === "paid");
  const pending = rows.filter((r) => r.status === "sent");
  const overdue = rows.filter((r) => r.status === "overdue");

  const sum = (list: typeof rows) => list.reduce((s, r) => s + r.total, 0);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <Link
          to="/customer-dashboard/invoicing/manage"
          className="inline-flex items-center gap-1 text-sm font-medium hover:underline"
          style={{ color: fiscal.onSurfaceVariant }}
        >
          <ArrowLeft className="w-4 h-4" />
          E-Invoicing
        </Link>

        <header>
          <h1 className="text-2xl font-bold" style={{ color: fiscal.primary }}>
            Payment tracking
          </h1>
          <p className="text-sm mt-1" style={{ color: fiscal.onSurfaceVariant }}>
            Monitor sent and overdue invoices. Mark payments when received.
          </p>
        </header>

        <div className="grid md:grid-cols-3 gap-4">
          <SummaryCard
            label="Total received"
            value={formatNaira(sum(completed))}
            sub={`${completed.length} paid`}
            icon={<TrendingUp className="w-5 h-5 text-green-600" />}
            valueColor="#15803d"
          />
          <SummaryCard
            label="Pending"
            value={formatNaira(sum(pending))}
            sub={`${pending.length} awaiting payment`}
            icon={<Clock className="w-5 h-5 text-amber-600" />}
            valueColor="#b45309"
          />
          <SummaryCard
            label="Overdue"
            value={formatNaira(sum(overdue))}
            sub={`${overdue.length} past due`}
            icon={<AlertCircle className="w-5 h-5 text-red-600" />}
            valueColor={fiscal.error}
          />
        </div>

        <section className="rounded-xl overflow-hidden" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
          <div className="p-6 border-b" style={{ borderColor: fiscal.outlineVariant }}>
            <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: fiscal.primary }}>
              <CreditCard className="w-5 h-5" />
              Invoice payments
            </h2>
          </div>

          {rows.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm mb-4" style={{ color: fiscal.onSurfaceVariant }}>
                No sent invoices yet. Send an invoice from the builder to track payments here.
              </p>
              <Link
                to="/customer-dashboard/invoicing/manage"
                className="inline-block px-5 py-2.5 rounded-lg font-bold text-sm"
                style={{
                  backgroundColor: fiscal.secondaryContainer,
                  color: fiscal.onSecondaryContainer,
                }}
              >
                Go to invoice builder
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead style={{ backgroundColor: fiscal.surfaceContainerLow }}>
                  <tr>
                    {["Invoice", "Client", "Due", "Amount", "Status", ""].map((h) => (
                      <th
                        key={h}
                        className="text-left px-6 py-3 text-xs font-bold uppercase tracking-wider"
                        style={{ color: fiscal.onSurfaceVariant }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id} className="border-t" style={{ borderColor: fiscal.outlineVariant }}>
                      <td className="px-6 py-4 font-medium">{row.invoiceNumber}</td>
                      <td className="px-6 py-4">{row.clientName}</td>
                      <td className="px-6 py-4">{formatInvoiceDate(row.dueDate)}</td>
                      <td className="px-6 py-4 text-right font-mono font-semibold">
                        {formatNaira(row.total)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={row.status} />
                      </td>
                      <td className="px-6 py-4 text-right">
                        {row.status !== "paid" && (
                          <button
                            type="button"
                            onClick={() => {
                              markInvoicePaid(row.id);
                              notify.success("Marked paid", `${row.invoiceNumber} recorded as paid.`);
                            }}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold"
                            style={{
                              backgroundColor: fiscal.primary,
                              color: "#ffffff",
                            }}
                          >
                            Mark paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

function SummaryCard({
  label,
  value,
  sub,
  icon,
  valueColor,
}: {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  valueColor: string;
}) {
  return (
    <div className="rounded-xl p-5" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
      <div className="flex justify-between mb-3">
        <span className="text-sm" style={{ color: fiscal.onSurfaceVariant }}>
          {label}
        </span>
        {icon}
      </div>
      <p className="text-2xl font-bold" style={{ color: valueColor }}>
        {value}
      </p>
      <p className="text-xs mt-1" style={{ color: fiscal.onSurfaceVariant }}>
        {sub}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles =
    status === "paid"
      ? "bg-green-100 text-green-800"
      : status === "sent"
        ? "bg-amber-100 text-amber-800"
        : "bg-red-100 text-red-800";
  const Icon = status === "paid" ? CheckCircle : status === "sent" ? Clock : AlertCircle;
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${styles}`}>
      <Icon className="w-3 h-3" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

export default PaymentTrackingRoute;
