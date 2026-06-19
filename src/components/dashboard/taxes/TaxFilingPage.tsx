import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CheckCircle, Clock, FileText, Plus, Send } from "lucide-react";
import { inputBg } from "@/components/dashboard/dashboardTokens";
import AppSelect from "@/components/ui/AppSelect";
import { formatNaira } from "@/lib/rr/format";
import {
  TAX_CATEGORY_LABELS,
  daysUntil,
  effectiveFilingStatus,
  formatTaxDateLong,
  type TaxAuthority,
  type TaxCategory,
} from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { notify } from "@/components/Toaster";
import {
  TaxEmptyState,
  TaxPageHeader,
  TaxStatusBadge,
  fiscalInputClass,
  fiscalInputStyle,
  glassCard,
} from "@/components/dashboard/taxes/taxShared";

const SB = {
  forestInk: "#1a3300",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  cream: "#fcfaf5",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

const CATEGORY_OPTIONS: { value: TaxCategory; label: string }[] = [
  { value: "pit", label: TAX_CATEGORY_LABELS.pit },
  { value: "cit", label: TAX_CATEGORY_LABELS.cit },
  { value: "paye", label: TAX_CATEGORY_LABELS.paye },
  { value: "wht", label: TAX_CATEGORY_LABELS.wht },
];

const AUTHORITY_OPTIONS: { value: TaxAuthority; label: string }[] = [
  { value: "FIRS", label: "FIRS" },
  { value: "LIRS", label: "LIRS" },
  { value: "Other", label: "Other" },
];

export default function TaxFilingPage() {
  const filings = useTaxesStore((s) => s.filings);
  const syncStatuses = useTaxesStore((s) => s.syncStatuses);
  const addFiling = useTaxesStore((s) => s.addFiling);
  const fileFiling = useTaxesStore((s) => s.fileFiling);
  const payFiling = useTaxesStore((s) => s.payFiling);
  const removeFiling = useTaxesStore((s) => s.removeFiling);
  const updateFiling = useTaxesStore((s) => s.updateFiling);

  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState<TaxCategory>("pit");
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState("");
  const [amount, setAmount] = useState("");
  const [authority, setAuthority] = useState<TaxAuthority>("FIRS");
  const [dueDate, setDueDate] = useState("");

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  const counts = useMemo(
    () => ({
      pending: filings.filter((f) => effectiveFilingStatus(f.status, f.dueDate) === "pending").length,
      filed: filings.filter((f) => f.status === "filed").length,
      paid: filings.filter((f) => f.status === "paid").length,
    }),
    [filings],
  );

  const sorted = useMemo(
    () => [...filings].sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [filings],
  );

  const handleAdd = () => {
    if (!title.trim() || !period.trim() || !dueDate) {
      notify.error("Missing fields", "Title, period, and due date are required.");
      return;
    }
    const amt = parseFloat(amount) || 0;
    addFiling({
      category,
      title: title.trim(),
      period: period.trim(),
      amount: amt,
      authority,
      dueDate,
      status: "pending",
    });
    notify.success("Filing created", title.trim());
    setShowForm(false);
    setTitle("");
    setPeriod("");
    setAmount("");
    setDueDate("");
  };

  return (
    <div className="space-y-6">
      <TaxPageHeader
        icon={<Send className="w-6 h-6" />}
        title="Tax filing"
        description="Create and track personal and corporate tax filings. Mark items as filed when submitted and paid when remittance is complete."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Pending", value: counts.pending, icon: AlertCircle, color: "#92400e" },
          { label: "Filed", value: counts.filed, icon: Send, color: SB.forestInk },
          { label: "Paid", value: counts.paid, icon: CheckCircle, color: "#1a5c3a" },
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

      <div className="rounded-xl p-6" style={glassCard}>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h3 className="text-base font-bold flex items-center gap-2" style={{ color: SB.forestInk }}>
            <FileText className="w-5 h-5" style={{ opacity: 0.5 }} />
            Filings &amp; deadlines
          </h3>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
          >
            <Plus className="w-4 h-4" />
            {showForm ? "Cancel" : "New filing"}
          </button>
        </div>

        {showForm && (
          <div
            className="grid md:grid-cols-2 gap-4 mb-8 p-4 rounded-xl"
            style={{ backgroundColor: SB.cream, border: `1px solid ${SB.cardBorder}` }}
          >
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <AppSelect
                value={category}
                onValueChange={(v) => setCategory(v as TaxCategory)}
                options={CATEGORY_OPTIONS}
                placeholder="Category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Authority</label>
              <AppSelect
                value={authority}
                onValueChange={(v) => setAuthority(v as TaxAuthority)}
                options={AUTHORITY_OPTIONS}
                placeholder="Authority"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Personal Income Tax 2026"
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Tax year 2026"
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Due date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Estimated amount (₦)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div className="flex items-end">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                Create filing
              </button>
            </div>
          </div>
        )}

        {sorted.length === 0 ? (
          <TaxEmptyState
            title="No filings yet"
            description="Start a new filing to track PIT, CIT, PAYE estimates, or other obligations."
          />
        ) : (
          <div className="space-y-4">
            {sorted.map((filing) => {
              const status = effectiveFilingStatus(filing.status, filing.dueDate);
              const days = daysUntil(filing.dueDate);
              const isOverdue = status === "overdue";
              const isUrgent = days <= 30 && days >= 0 && status === "pending";

              return (
                <div
                  key={filing.id}
                  className="p-4 rounded-xl border-l-4"
                  style={{
                    backgroundColor: SB.cream,
                    borderLeftColor: isOverdue
                      ? "#991b1b"
                      : isUrgent
                        ? "#92400e"
                        : status === "paid"
                          ? "#1a5c3a"
                          : SB.forestInk,
                  }}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-3">
                    <div>
                      <p className="font-bold" style={{ color: SB.forestInk }}>{filing.title}</p>
                      <p className="text-sm" style={{ color: SB.pencilGray }}>
                        {filing.period} · {filing.reference}
                      </p>
                    </div>
                    <TaxStatusBadge status={status} />
                  </div>
                  <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t" style={{ borderColor: SB.cardBorder }}>
                    <div>
                      <p className="text-sm" style={{ color: SB.pencilGray }}>
                        Due: {formatTaxDateLong(filing.dueDate)}
                      </p>
                      <p className="text-sm font-medium" style={{ color: SB.forestInk }}>
                        Estimated: {formatNaira(filing.amount)}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(status === "pending" || status === "overdue") && (
                        <button
                          type="button"
                          onClick={() => {
                            fileFiling(filing.id);
                            notify.success("Filed", filing.reference);
                          }}
                          className="px-4 py-2 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
                        >
                          Mark filed
                        </button>
                      )}
                      {status === "filed" && (
                        <button
                          type="button"
                          onClick={() => {
                            payFiling(filing.id);
                            notify.success("Paid", filing.reference);
                          }}
                          className="px-4 py-2 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
                          style={{ backgroundColor: SB.mint, color: SB.forestInk }}
                        >
                          Mark paid
                        </button>
                      )}
                      {status === "paid" && (
                        <span className="inline-flex items-center gap-1 text-sm" style={{ color: "#1a5c3a" }}>
                          <CheckCircle className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                      {status === "draft" && (
                        <button
                          type="button"
                          onClick={() => {
                            updateFiling(filing.id, { status: "pending" });
                            notify.success("Submitted", "Draft moved to pending.");
                          }}
                          className="px-4 py-2 rounded-md text-sm font-bold border transition-opacity hover:opacity-70"
                          style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
                        >
                          Submit
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          removeFiling(filing.id);
                          notify.info("Removed", filing.reference);
                        }}
                        className="px-3 py-2 text-sm transition-opacity hover:opacity-60"
                        style={{ color: SB.pencilGray }}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div
        className="rounded-xl p-6 grid md:grid-cols-2 gap-6"
        style={{ backgroundColor: SB.cream, border: `1.5px solid ${SB.cardBorder}` }}
      >
        <div>
          <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: SB.forestInk }}>
            <FileText className="w-4 h-4" style={{ opacity: 0.5 }} />
            Required documents
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: SB.pencilGray }}>
            <li>Valid Tax Identification Number (TIN)</li>
            <li>Form A and employment income (PAYE certificate)</li>
            <li>Business income statements if self-employed</li>
            <li>Withholding tax credit evidence</li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold mb-2 flex items-center gap-2" style={{ color: SB.forestInk }}>
            <Clock className="w-4 h-4" style={{ opacity: 0.5 }} />
            Key deadlines
          </h4>
          <ul className="space-y-2 text-sm" style={{ color: SB.pencilGray }}>
            <li>Personal income tax: 31 March annually</li>
            <li>Company income tax: 6 months after year-end</li>
            <li>VAT: 21st of April, July, October, January</li>
            <li>WHT: 21st of month following payment</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
