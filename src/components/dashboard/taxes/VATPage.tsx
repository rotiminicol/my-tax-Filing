import { useEffect, useMemo, useState } from "react";
import { Calendar, FileText, Percent, PlusCircle, Trash2 } from "lucide-react";
import { inputBg } from "@/components/dashboard/dashboardTokens";
import { formatNaira } from "@/lib/rr/format";
import { VAT_RATE, formatTaxDate, effectiveFilingStatus } from "@/lib/taxes";
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

export default function VATPage() {
  const vatReturns = useTaxesStore((s) => s.vatReturns);
  const syncStatuses = useTaxesStore((s) => s.syncStatuses);
  const addVATReturn = useTaxesStore((s) => s.addVATReturn);
  const fileVATReturn = useTaxesStore((s) => s.fileVATReturn);
  const payVATReturn = useTaxesStore((s) => s.payVATReturn);
  const removeVATReturn = useTaxesStore((s) => s.removeVATReturn);

  const [showForm, setShowForm] = useState(false);
  const [period, setPeriod] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [outputVAT, setOutputVAT] = useState("");
  const [inputVAT, setInputVAT] = useState("");

  useEffect(() => {
    syncStatuses();
  }, [syncStatuses]);

  const pending = useMemo(
    () => vatReturns.filter((r) => effectiveFilingStatus(r.status, r.dueDate) === "pending"),
    [vatReturns],
  );
  const pendingPayable = useMemo(
    () => pending.reduce((s, r) => s + r.payable, 0),
    [pending],
  );

  const handleAdd = () => {
    if (!period.trim() || !dueDate) {
      notify.error("Missing fields", "Period and due date are required.");
      return;
    }
    const out = parseFloat(outputVAT) || 0;
    const inp = parseFloat(inputVAT) || 0;
    addVATReturn({ period: period.trim(), dueDate, outputVAT: out, inputVAT: inp });
    notify.success("VAT return added", period.trim());
    setShowForm(false);
    setPeriod("");
    setDueDate("");
    setOutputVAT("");
    setInputVAT("");
  };

  return (
    <div className="space-y-6">
      <TaxPageHeader
        icon={<Percent className="w-6 h-6" />}
        title="VAT Returns"
        description={`Manage Value Added Tax returns at Nigeria's standard rate of ${(VAT_RATE * 100).toFixed(1)}%. File quarterly with FIRS.`}
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Pending returns", value: String(pending.length) },
          { label: "Total payable (pending)", value: formatNaira(pendingPayable), accent: "#991b1b" },
          { label: "VAT rate", value: `${(VAT_RATE * 100).toFixed(1)}%`, accent: "#1a5c3a" },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-6" style={glassCard}>
            <span className="text-sm" style={{ color: SB.pencilGray }}>
              {card.label}
            </span>
            <p className="text-3xl font-bold mt-2" style={{ color: card.accent ?? SB.forestInk }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-xl overflow-hidden" style={glassCard}>
        <div
          className="p-6 border-b flex flex-wrap items-center justify-between gap-4"
          style={{ borderColor: SB.cardBorder }}
        >
          <h3 className="text-lg font-bold" style={{ color: SB.forestInk }}>
            Return history
          </h3>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
            style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
          >
            <PlusCircle className="w-4 h-4" />
            {showForm ? "Cancel" : "New return"}
          </button>
        </div>

        {showForm && (
          <div className="p-6 border-b grid md:grid-cols-2 gap-4" style={{ borderColor: SB.cardBorder }}>
            <div>
              <label className="block text-sm font-medium mb-2">Period</label>
              <input
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                placeholder="Q1 2026 (Jan–Mar)"
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
              <label className="block text-sm font-medium mb-2">Output VAT (₦)</label>
              <input
                type="number"
                value={outputVAT}
                onChange={(e) => setOutputVAT(e.target.value)}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Input VAT (₦)</label>
              <input
                type="number"
                value={inputVAT}
                onChange={(e) => setInputVAT(e.target.value)}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div className="md:col-span-2">
              <button
                type="button"
                onClick={handleAdd}
                className="px-6 py-2 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                Add return
              </button>
            </div>
          </div>
        )}

        {vatReturns.length === 0 ? (
          <div className="p-6">
            <TaxEmptyState
              title="No VAT returns"
              description="Add your first quarterly return to track output VAT, input VAT, and remittance."
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px]">
              <thead style={{ backgroundColor: SB.cream }}>
                <tr>
                  {["Period", "Due", "Output", "Input", "Payable", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={`px-6 py-4 text-[11px] font-bold uppercase tracking-wider ${h !== "Period" && h !== "Actions" ? "text-right" : "text-left"} ${h === "Status" ? "text-center" : ""}`}
                      style={{ color: SB.pencilGray }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {vatReturns.map((row) => {
                  const status = effectiveFilingStatus(row.status, row.dueDate);
                  return (
                    <tr
                      key={row.id}
                      className="border-t hover:bg-[#fcfaf5] transition-colors"
                      style={{ borderColor: SB.cardBorder }}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4" style={{ color: SB.forestInk, opacity: 0.4 }} />
                          <div>
                            <p className="font-semibold" style={{ color: SB.forestInk }}>{row.period}</p>
                            <p className="text-xs" style={{ color: SB.pencilGray }}>
                              {row.reference}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-right" style={{ color: SB.forestInk }}>{formatTaxDate(row.dueDate)}</td>
                      <td className="px-6 py-4 text-right font-mono" style={{ color: SB.forestInk }}>{formatNaira(row.outputVAT)}</td>
                      <td className="px-6 py-4 text-right font-mono" style={{ color: SB.forestInk }}>{formatNaira(row.inputVAT)}</td>
                      <td className="px-6 py-4 text-right font-bold" style={{ color: SB.forestInk }}>{formatNaira(row.payable)}</td>
                      <td className="px-6 py-4 text-center">
                        <TaxStatusBadge status={status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          {status === "pending" && (
                            <button
                              type="button"
                              onClick={() => {
                                fileVATReturn(row.id);
                                notify.success("Filed", `${row.reference} marked as filed.`);
                              }}
                              className="text-xs font-bold px-3 py-1.5 rounded-md transition-opacity hover:opacity-70"
                              style={{ backgroundColor: "#d5f5c2", color: SB.forestInk }}
                            >
                              File
                            </button>
                          )}
                          {status === "filed" && (
                            <button
                              type="button"
                              onClick={() => {
                                payVATReturn(row.id);
                                notify.success("Paid", `${row.reference} marked as paid.`);
                              }}
                              className="text-xs font-bold px-3 py-1.5 rounded-md transition-opacity hover:opacity-70"
                              style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
                            >
                              Pay
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => {
                              removeVATReturn(row.id);
                              notify.info("Removed", row.reference);
                            }}
                            className="p-2 rounded hover:bg-red-50"
                            aria-label="Remove"
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: SB.cream, border: `1.5px solid ${SB.cardBorder}` }}>
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: SB.forestInk }}>
          <FileText className="w-5 h-5" style={{ opacity: 0.5 }} />
          Filing notes
        </h3>
        <ul className="space-y-2 text-sm" style={{ color: SB.pencilGray }}>
          <li>Quarterly due dates: 21 April, July, October, and January</li>
          <li>Registration threshold: ₦25 million annual turnover</li>
          <li>Remit net VAT within 21 days of filing</li>
        </ul>
      </div>
    </div>
  );
}
