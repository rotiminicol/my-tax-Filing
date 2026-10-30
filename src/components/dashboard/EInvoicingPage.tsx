import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  CirclePlus,
  FileText,
  History,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { inputBg } from "@/components/dashboard/dashboardTokens";
import { formatNaira } from "@/lib/rr/format";
import { notify } from "@/components/Toaster";
import AppSelect from "@/components/ui/AppSelect";
import { useInvoicingStore } from "@/store/invoicing";
import { clientInitials, calculateInvoiceTotals } from "@/lib/invoicing";
import AddClientModal from "@/components/dashboard/invoicing/AddClientModal";

/* Say Briefly tokens */
const SB = {
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

const glassCard: CSSProperties = {
  background: "#ffffff",
  border: `1.5px solid ${SB.cardBorder}`,
  boxShadow: "0 1px 3px rgba(26,51,0,0.05)",
};


export default function EInvoicingPage() {
  const clients = useInvoicingStore((s) => s.clients);
  const invoices = useInvoicingStore((s) => s.invoices);
  const createDraft = useInvoicingStore((s) => s.createDraft);
  const updateInvoice = useInvoicingStore((s) => s.updateInvoice);
  const sendInvoice = useInvoicingStore((s) => s.sendInvoice);
  const syncOverdueStatuses = useInvoicingStore((s) => s.syncOverdueStatuses);
  const getStats = useInvoicingStore((s) => s.getStats);
  const getClient = useInvoicingStore((s) => s.getClient);

  const [draftId, setDraftId] = useState<string | null>(null);
  const [clientModalOpen, setClientModalOpen] = useState(false);

  useEffect(() => {
    syncOverdueStatuses();
  }, [syncOverdueStatuses]);

  useEffect(() => {
    const current = draftId ? invoices.find((i) => i.id === draftId) : undefined;
    if (current?.status === "draft") return;

    const existingDraft = invoices.find((i) => i.status === "draft");
    if (existingDraft) {
      setDraftId(existingDraft.id);
      return;
    }

    const d = createDraft(clients[0]?.id);
    setDraftId(d.id);
  }, [invoices, draftId, createDraft, clients]);

  const draft = useMemo(
    () => (draftId ? invoices.find((i) => i.id === draftId) : undefined),
    [draftId, invoices],
  );

  const stats = useMemo(() => getStats(), [invoices, getStats]);

  const clientOptions = useMemo(
    () => clients.map((c) => ({ value: c.id, label: c.name })),
    [clients],
  );

  const handleNewDraft = () => {
    const d = createDraft(clients[0]?.id);
    setDraftId(d.id);
    notify.success("New draft", `Invoice ${d.invoiceNumber} created.`);
  };

  const patchDraft = (patch: Parameters<typeof updateInvoice>[1]) => {
    if (!draftId) return;
    updateInvoice(draftId, patch);
  };

  const handleSend = () => {
    if (!draft) return;
    if (!draft.clientId) {
      notify.error("Select a client", "Choose a client before sending.");
      return;
    }
    if (!draft.lines.some((l) => l.description.trim() && l.price > 0)) {
      notify.error("Add line items", "Add at least one item with a price.");
      return;
    }
    sendInvoice(draft.id);
    notify.success("Invoice sent", `Invoice ${draft.invoiceNumber} marked as sent.`);
    const next = createDraft(draft.clientId);
    setDraftId(next.id);
  };

  const handleExportPdf = () => {
    if (!draft) return;
    const client = draft.clientId ? getClient(draft.clientId) : undefined;
    const totals = calculateInvoiceTotals(draft.lines);
    const rows = draft.lines
      .filter((l) => l.description.trim())
      .map(
        (l) =>
          `<tr><td>${l.description}</td><td>${l.qty}</td><td>${formatNaira(l.price)}</td><td>${formatNaira(l.qty * l.price)}</td></tr>`,
      )
      .join("");
    const html = `<!DOCTYPE html><html><head><title>${draft.invoiceNumber}</title>
      <style>body{font-family:system-ui;padding:40px;color:#18623f}table{width:100%;border-collapse:collapse;margin:16px 0}
      th,td{border:1px solid rgba(26,51,0,0.1);padding:10px;text-align:left}th{background:#fcfaf5}</style></head>
      <body><h1>Invoice ${draft.invoiceNumber}</h1>
      <p><strong>Client:</strong> ${client?.name ?? "—"}</p>
      <p><strong>Issue date:</strong> ${draft.issueDate} · <strong>Due:</strong> ${draft.dueDate}</p>
      <table><thead><tr><th>Description</th><th>Qty</th><th>Price</th><th>Amount</th></tr></thead><tbody>${rows}</tbody></table>
      <p><strong>Subtotal:</strong> ${formatNaira(totals.subtotal)}</p>
      <p><strong>VAT (7.5%):</strong> ${formatNaira(totals.vat)}</p>
      <p><strong>Total:</strong> ${formatNaira(totals.total)}</p>
      </body></html>`;
    const w = window.open("", "_blank");
    if (w) {
      w.document.write(html);
      w.document.close();
      w.print();
    }
    notify.success("PDF ready", "Use your browser print dialog to save as PDF.");
  };

  const handleShare = async () => {
    if (!draft) return;
    const text = `Invoice ${draft.invoiceNumber} — Total ${formatNaira(draft.total)}`;
    try {
      await navigator.clipboard.writeText(text);
      notify.success("Copied", "Invoice summary copied to clipboard.");
    } catch {
      notify.info("Share", text);
    }
  };

  return (
    <>
      <AddClientModal
        open={clientModalOpen}
        onClose={() => setClientModalOpen(false)}
        onAdded={(id) => patchDraft({ clientId: id })}
      />

      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight" style={{ color: SB.forestInk }}>
              E-Invoicing Dashboard
            </h1>
            <p className="text-sm mt-1 max-w-2xl" style={{ color: SB.pencilGray }}>
              Create invoices, manage clients, and keep your billing workflow clean.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              to="/customer-dashboard/invoicing/payments"
              className="flex items-center gap-2 border px-4 py-2 rounded-md text-sm transition-colors hover:bg-[#fcfaf5]"
              style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder, color: SB.forestInk }}
            >
              <History className="w-4 h-4" />
              History
            </Link>
            <button
              type="button"
              onClick={handleNewDraft}
              className="flex items-center gap-2 px-5 py-2 rounded-md font-semibold text-sm transition-all hover:opacity-90"
              style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
            >
              <Plus className="w-4 h-4" />
              New Draft
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard
          label="Paid"
          value={formatNaira(stats.paidTotal)}
          sub={stats.paidCount === 0 ? "No paid invoices" : `${stats.paidCount} invoices`}
        />
        <StatCard
          label="Overdue"
          value={formatNaira(stats.overdueTotal)}
          sub={stats.overdueCount === 0 ? "All clear" : `${stats.overdueCount} overdue`}
          accent="#991b1b"
        />
        <StatCard
          label="Drafts"
          value={formatNaira(stats.draftTotal)}
          sub={stats.draftCount === 0 ? "No drafts" : `${stats.draftCount} drafts`}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <section className="lg:col-span-8">
          {!draft ? (
            <div className="rounded-xl p-10 text-center" style={glassCard}>
              <p className="text-sm mb-6" style={{ color: SB.pencilGray }}>
                Start with a fresh invoice draft and send it in minutes.
              </p>
              <button
                type="button"
                onClick={handleNewDraft}
                className="px-6 py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                Create invoice draft
              </button>
            </div>
          ) : (
            <div className="rounded-xl overflow-hidden" style={glassCard}>
              <div className="p-6 border-b" style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}>
                <h2 className="text-xl font-bold" style={{ color: SB.forestInk }}>
                  Invoice Builder
                </h2>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Client">
                    {clients.length === 0 ? (
                      <button
                        type="button"
                        onClick={() => setClientModalOpen(true)}
                        className="w-full py-3 rounded-xl border border-dashed text-sm font-semibold"
                        style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
                      >
                        + Add client
                      </button>
                    ) : (
                      <AppSelect
                        value={draft.clientId || undefined}
                        onValueChange={(clientId) => patchDraft({ clientId })}
                        placeholder="Select client…"
                        options={clientOptions}
                      />
                    )}
                  </Field>
                  <Field label="Invoice ID">
                    <input
                      type="text"
                      className="w-full border-none rounded-lg p-3 text-base focus:ring-2 focus:bg-white outline-none"
                      style={{ backgroundColor: inputBg }}
                      value={draft.invoiceNumber}
                      onChange={(e) => patchDraft({ invoiceNumber: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Issue date">
                    <input
                      type="date"
                      className="w-full border-none rounded-lg p-3 text-base focus:ring-2 outline-none"
                      style={{ backgroundColor: inputBg }}
                      value={draft.issueDate}
                      onChange={(e) => patchDraft({ issueDate: e.target.value })}
                    />
                  </Field>
                  <Field label="Due date">
                    <input
                      type="date"
                      className="w-full border-none rounded-lg p-3 text-base focus:ring-2 outline-none"
                      style={{ backgroundColor: inputBg }}
                      value={draft.dueDate}
                      onChange={(e) => patchDraft({ dueDate: e.target.value })}
                    />
                  </Field>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left min-w-[480px]">
                    <thead className="border-b" style={{ borderColor: SB.cardBorder }}>
                      <tr>
                        <th className="py-4 text-sm font-medium" style={{ color: SB.pencilGray }}>Description</th>
                        <th className="py-4 text-sm font-medium w-24" style={{ color: SB.pencilGray }}>Qty</th>
                        <th className="py-4 text-sm font-medium w-32" style={{ color: SB.pencilGray }}>Price</th>
                        <th className="py-4 text-sm font-medium w-32 text-right" style={{ color: SB.pencilGray }}>Amount</th>
                        <th className="w-10" />
                      </tr>
                    </thead>
                    <tbody>
                      {draft.lines.map((line) => (
                        <tr key={line.id} className="border-b" style={{ borderColor: SB.cardBorder }}>
                          <td className="py-4 pr-4">
                            <input
                              type="text"
                              className="w-full border-none bg-transparent p-1 outline-none"
                              placeholder="Item description"
                              value={line.description}
                              onChange={(e) =>
                                patchDraft({
                                  lines: draft.lines.map((l) =>
                                    l.id === line.id ? { ...l, description: e.target.value } : l,
                                  ),
                                })
                              }
                            />
                          </td>
                          <td className="py-4">
                            <input
                              type="number"
                              min={0}
                              className="w-full border-none bg-transparent p-1 outline-none"
                              value={line.qty}
                              onChange={(e) =>
                                patchDraft({
                                  lines: draft.lines.map((l) =>
                                    l.id === line.id ? { ...l, qty: Number(e.target.value) || 0 } : l,
                                  ),
                                })
                              }
                            />
                          </td>
                          <td className="py-4">
                            <input
                              type="number"
                              min={0}
                              className="w-full border-none bg-transparent p-1 outline-none font-mono"
                              value={line.price}
                              onChange={(e) =>
                                patchDraft({
                                  lines: draft.lines.map((l) =>
                                    l.id === line.id ? { ...l, price: Number(e.target.value) || 0 } : l,
                                  ),
                                })
                              }
                            />
                          </td>
                          <td className="py-4 text-right font-bold font-mono">
                            {(line.qty * line.price).toLocaleString("en-NG", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            })}
                          </td>
                          <td className="py-4 text-right">
                            <button
                              type="button"
                              className="hover:opacity-70"
                              style={{ color: "#991b1b" }}
                              onClick={() => {
                                if (draft.lines.length <= 1) return;
                                patchDraft({ lines: draft.lines.filter((l) => l.id !== line.id) });
                              }}
                              aria-label="Remove line"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <button
                  type="button"
                  className="flex items-center gap-2 font-semibold text-sm py-2"
                  style={{ color: SB.forestInk }}
                  onClick={() =>
                    patchDraft({
                      lines: [
                        ...draft.lines,
                        {
                          id: `line-${Date.now()}`,
                          description: "",
                          qty: 1,
                          price: 0,
                        },
                      ],
                    })
                  }
                >
                  <CirclePlus className="w-5 h-5" />
                  Add line
                </button>

                <div className="flex flex-col gap-3 md:items-end md:text-right pt-6 border-t" style={{ borderColor: SB.cardBorder }}>
                  <div className="flex justify-between text-sm" style={{ color: SB.pencilGray }}>
                    <span>Subtotal</span>
                    <span className="font-mono">{formatNaira(draft.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm" style={{ color: "#1a5c3a" }}>
                    <span>VAT (7.5%)</span>
                    <span className="font-mono">{formatNaira(draft.vat)}</span>
                  </div>
                  <div className="flex justify-between text-2xl font-bold" style={{ color: SB.forestInk }}>
                    <span>Total</span>
                    <span className="font-mono">{formatNaira(draft.total)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 flex flex-col sm:flex-row justify-between items-center gap-3 border-t" style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}>
                <button
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 border px-6 py-3 rounded-md font-semibold text-sm hover:bg-[#fcfaf5] transition-colors"
                  style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
                  onClick={handleExportPdf}
                >
                  <FileText className="w-5 h-5" />
                  Export PDF
                </button>
                <button
                  type="button"
                  className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-7 py-3 rounded-md font-semibold text-sm active:scale-95 transition-all hover:opacity-90"
                  style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
                  onClick={handleSend}
                >
                  <Send className="w-5 h-5" />
                  Send
                </button>
              </div>
            </div>
          )}
        </section>

        <aside className="lg:col-span-4">
            <div className="rounded-xl p-6" style={glassCard}>
              <h3 className="text-xl font-bold mb-4" style={{ color: SB.forestInk }}>
                Quick actions
              </h3>
              <p className="text-sm mb-6" style={{ color: SB.pencilGray }}>
                Keep your invoices moving with a single client selection and a quick send button.
              </p>
              <button
                type="button"
                onClick={() => setClientModalOpen(true)}
                className="w-full mb-3 px-4 py-3 rounded-xl font-semibold text-sm"
                style={{ backgroundColor: SB.mint, color: SB.forestInk }}
              >
                Add client
              </button>
              <Link
                to="/customer-dashboard/invoicing/payments"
                className="block w-full mb-3 px-4 py-3 rounded-xl text-center text-sm font-semibold"
                style={{ backgroundColor: SB.cream, color: SB.forestInk, border: `1px solid ${SB.cardBorder}` }}
              >
                View payments
              </Link>
              <Link
                to="/customer-dashboard/invoicing/templates"
                className="block w-full px-4 py-3 rounded-xl text-center text-sm font-semibold"
                style={{ backgroundColor: SB.cream, color: SB.forestInk, border: `1px solid ${SB.cardBorder}` }}
              >
                Templates
              </Link>
            </div>
          </aside>
      </div>
    </>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string;
  sub: string;
  accent?: string;
}) {
  return (
    <div className="p-5 rounded-xl" style={{ ...glassCard, borderLeft: accent ? `4px solid ${accent}` : undefined }}>
      <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "#6b7280" }}>
        {label}
      </span>
      <p className="text-3xl font-bold mt-3" style={{ color: accent || "#18623f" }}>
        {value}
      </p>
      <p className="text-xs mt-2" style={{ color: "#6b7280" }}>
        {sub}
      </p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-sm font-semibold mb-2 block" style={{ color: SB.forestInk }}>
        {label}
      </span>
      <div>{children}</div>
    </label>
  );
}

