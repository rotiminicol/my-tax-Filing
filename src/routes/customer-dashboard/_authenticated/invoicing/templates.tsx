import { Link } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { useInvoicingStore } from "@/store/invoicing";
import { notify } from "@/components/Toaster";
import { ArrowLeft, Copy, LayoutTemplate, PlusCircle, Trash2 } from "lucide-react";
import { formatInvoiceDate } from "@/lib/invoicing";

function TemplatesRoute() {
  const templates = useInvoicingStore((s) => s.templates);
  const addTemplate = useInvoicingStore((s) => s.addTemplate);
  const removeTemplate = useInvoicingStore((s) => s.removeTemplate);
  const incrementTemplateUsage = useInvoicingStore((s) => s.incrementTemplateUsage);
  const createDraft = useInvoicingStore((s) => s.createDraft);
  const updateInvoice = useInvoicingStore((s) => s.updateInvoice);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  const handleCreate = () => {
    if (!name.trim()) {
      notify.error("Name required", "Enter a template name.");
      return;
    }
    addTemplate({
      name: name.trim(),
      description: description.trim() || "Custom invoice template",
      lines: [{ description: "Service", qty: 1, price: 0 }],
    });
    setName("");
    setDescription("");
    setShowForm(false);
    notify.success("Template created", `${name} saved.`);
  };

  const applyTemplate = (templateId: string) => {
    const tpl = templates.find((t) => t.id === templateId);
    if (!tpl) return;
    const draft = createDraft();
    const lines = tpl.lines.map((l, i) => ({
      id: `line-${Date.now()}-${i}`,
      description: l.description,
      qty: l.qty,
      price: l.price,
    }));
    updateInvoice(draft.id, { lines });
    incrementTemplateUsage(templateId);
    notify.success("Template applied", `Loaded into draft ${draft.invoiceNumber}.`);
  };

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

        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: fiscal.primary }}>
              Invoice templates
            </h1>
            <p className="text-sm mt-1" style={{ color: fiscal.onSurfaceVariant }}>
              Save reusable layouts and apply them to new drafts.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((v) => !v)}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm"
            style={{
              backgroundColor: fiscal.secondaryContainer,
              color: fiscal.onSecondaryContainer,
            }}
          >
            <PlusCircle className="w-5 h-5" />
            {showForm ? "Cancel" : "New template"}
          </button>
        </header>

        {showForm && (
          <section className="rounded-xl p-6 space-y-4" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Template name"
              className="w-full px-4 py-3 rounded-xl border text-sm"
              style={{ borderColor: fiscal.outlineVariant }}
            />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Short description"
              rows={2}
              className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
              style={{ borderColor: fiscal.outlineVariant }}
            />
            <button
              type="button"
              onClick={handleCreate}
              className="w-full py-3 rounded-xl font-bold text-sm text-white"
              style={{ backgroundColor: fiscal.primary }}
            >
              Save template
            </button>
          </section>
        )}

        {templates.length === 0 ? (
          <div className="rounded-xl p-12 text-center" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
            <LayoutTemplate className="w-12 h-12 mx-auto mb-4 opacity-40" style={{ color: fiscal.primary }} />
            <p className="text-sm" style={{ color: fiscal.onSurfaceVariant }}>
              No templates yet. Create one to speed up recurring invoices.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {templates.map((template) => (
              <div
                key={template.id}
                className="rounded-xl p-6"
                style={{ ...cardElevation, backgroundColor: fiscal.surface }}
              >
                <div className="flex justify-between items-start mb-4">
                  <div
                    className="p-3 rounded-xl"
                    style={{ backgroundColor: fiscal.surfaceContainerLow }}
                  >
                    <LayoutTemplate className="w-7 h-7" style={{ color: fiscal.primary }} />
                  </div>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      title="Apply to new draft"
                      onClick={() => applyTemplate(template.id)}
                      className="p-2 rounded-lg hover:bg-[#eff4ff]"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      title="Delete"
                      onClick={() => {
                        removeTemplate(template.id);
                        notify.info("Removed", `${template.name} deleted.`);
                      }}
                      className="p-2 rounded-lg hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold">{template.name}</h3>
                <p className="text-sm mt-1 mb-4" style={{ color: fiscal.onSurfaceVariant }}>
                  {template.description}
                </p>
                <div className="flex justify-between text-xs pt-4 border-t" style={{ borderColor: fiscal.outlineVariant }}>
                  <span style={{ color: fiscal.onSurfaceVariant }}>
                    Used {template.usageCount} time{template.usageCount === 1 ? "" : "s"}
                  </span>
                  <span style={{ color: fiscal.onSurfaceVariant }}>
                    {formatInvoiceDate(template.createdAt.slice(0, 10))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}

export default TemplatesRoute;
