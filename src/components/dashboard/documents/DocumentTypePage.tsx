import { useMemo, useState } from "react";
import { Calendar, CheckCircle, Plus, Trash2 } from "lucide-react";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import type { DocumentTypeConfig } from "@/lib/documentTypes";
import { formatExpiryDate, getDocumentStatus } from "@/lib/documents";
import { useDocumentsStore, type ComplianceDocument } from "@/store/documents";
import { notify } from "@/components/Toaster";
import DocumentUploadZone from "./DocumentUploadZone";
import {
  DocumentFormFields,
  emptyDocumentForm,
  type DocumentFormValues,
  docInputClass,
  docInputStyle,
} from "./DocumentFormFields";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

interface Props {
  config: DocumentTypeConfig;
}

export default function DocumentTypePage({ config }: Props) {
  const allDocuments = useDocumentsStore((s) => s.documents);
  const documents = useMemo(
    () => allDocuments.filter((d) => d.type === config.type),
    [allDocuments, config.type],
  );
  const addDocument = useDocumentsStore((s) => s.addDocument);
  const updateDocument = useDocumentsStore((s) => s.updateDocument);
  const removeDocument = useDocumentsStore((s) => s.removeDocument);
  const submitRenewal = useDocumentsStore((s) => s.submitRenewal);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DocumentFormValues>(emptyDocumentForm());
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [lookupStatus, setLookupStatus] = useState<"idle" | "busy" | "found" | "missing">("idle");
  const [lookupError, setLookupError] = useState<string | undefined>();
  const [lastLookupPlate, setLastLookupPlate] = useState<string>("");
  const vehicleLicenseMode = config.type === "vehicle-license";
  const driversLicenseMode = config.type === "drivers-license";

  const pending = documents.filter((d) => d.renewalStatus === "pending").length;
  const expiringSoon = documents.filter((d) => {
    const { status } = getDocumentStatus(d.expiryDate);
    return status === "expiring" || status === "overdue";
  }).length;
  const compliant = documents.filter((d) => getDocumentStatus(d.expiryDate).status === "compliant").length;

  const resetForm = () => {
    setForm(emptyDocumentForm());
    setAttachmentName(undefined);
    setLookupStatus("idle");
    setLookupError(undefined);
    setLastLookupPlate("");
    setShowForm(false);
    setEditingId(null);
  };

  const normalizePlate = (plate: string) => plate.trim().toUpperCase();

  const defaultVehicleTitle = (reference: string) =>
    reference ? `Vehicle license ${normalizePlate(reference)}` : "Vehicle license";

  const defaultVehicleExpiry = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().slice(0, 10);
  };

  const defaultDriverTitle = (reference: string) =>
    reference ? `Driver's license ${reference}` : "Driver's license";

  const buildDriverPayload = () => {
    const reference = form.reference.trim();
    return {
      title: defaultDriverTitle(reference),
      reference,
      issuer: form.issuer.trim() || undefined,
      expiryDate: form.expiryDate || defaultVehicleExpiry(),
      issueDate: form.issueDate || undefined,
      notes: form.notes.trim() || undefined,
      attachmentName,
    };
  };

  const mockPlateDatabase: Record<
    string,
    Pick<DocumentFormValues, "title" | "issuer" | "expiryDate" | "issueDate" | "notes">
  > = {
    "ABC-123XY": {
      title: "Toyota Corolla 2018",
      issuer: "Lagos State",
      expiryDate: "2025-12-31",
      issueDate: "2022-12-31",
      notes: "Auto-filled from plate lookup.",
    },
    "DEF-456ZT": {
      title: "Honda Civic 2020",
      issuer: "Abuja FCT",
      expiryDate: "2026-06-30",
      issueDate: "2023-07-01",
      notes: "Auto-filled from plate lookup.",
    },
  };

  const lookupVehiclePlate = async (plate: string) => {
    const normalized = normalizePlate(plate);
    if (!normalized) return;
    if (normalized === lastLookupPlate) return;

    setLookupStatus("busy");
    setLookupError(undefined);
    setLastLookupPlate(normalized);

    await new Promise((resolve) => setTimeout(resolve, 300));

    const result = mockPlateDatabase[normalized];
    if (!result) {
      setLookupStatus("missing");
      setLookupError("No vehicle record found for that plate number.");
      return;
    }

    setForm((current) => ({
      ...current,
      title: current.title.trim() ? current.title : `${result.title} · ${normalized}`,
      issuer: current.issuer.trim() ? current.issuer : result.issuer,
      expiryDate: current.expiryDate || result.expiryDate,
      issueDate: current.issueDate || result.issueDate,
      notes: current.notes || result.notes,
    }));
    setLookupStatus("found");
  };

  const handleReferenceBlur = () => {
    if (!vehicleLicenseMode) return;
    if (!form.reference.trim()) return;
    lookupVehiclePlate(form.reference);
  };

  const startEdit = (doc: ComplianceDocument) => {
    setEditingId(doc.id);
    setShowForm(true);
    setForm({
      title: doc.title,
      reference: doc.reference,
      issuer: doc.issuer ?? "",
      expiryDate: doc.expiryDate,
      issueDate: doc.issueDate ?? "",
      notes: doc.notes ?? "",
    });
    setAttachmentName(doc.attachmentName);
  };

  const buildVehicleLicensePayload = () => {
    const reference = normalizePlate(form.reference);
    return {
      title: defaultVehicleTitle(reference),
      reference,
      issuer: form.issuer.trim() || "Vehicle registry",
      expiryDate: form.expiryDate || defaultVehicleExpiry(),
      issueDate: form.issueDate || new Date().toISOString().slice(0, 10),
      notes: form.notes.trim() || "Added by plate number.",
      attachmentName,
    };
  };

  const handleSave = () => {
    if (vehicleLicenseMode || driversLicenseMode) {
      if (!form.reference.trim()) {
        notify.error("Missing fields", vehicleLicenseMode ? "Please enter your vehicle plate number." : "Please enter your license number.");
        return;
      }

      const payload = vehicleLicenseMode ? buildVehicleLicensePayload() : buildDriverPayload();
      if (editingId) {
        updateDocument(editingId, {
          ...payload,
          lastRenewedAt: new Date().toISOString().slice(0, 10),
          renewalStatus: "none",
        });
      } else {
        addDocument({
          type: config.type,
          ...payload,
          lastRenewedAt: payload.issueDate,
        });
      }
      resetForm();
      return;
    }

    if (!form.title.trim() || !form.reference.trim() || !form.expiryDate) {
      notify.error("Missing fields", "Name, reference, and expiry date are required.");
      return;
    }
    const payload = {
      title: form.title.trim(),
      reference: form.reference.trim(),
      issuer: form.issuer.trim() || undefined,
      expiryDate: form.expiryDate,
      issueDate: form.issueDate || undefined,
      notes: form.notes.trim() || undefined,
      attachmentName,
    };

    if (editingId) {
      updateDocument(editingId, {
        ...payload,
        lastRenewedAt: new Date().toISOString().slice(0, 10),
        renewalStatus: "none",
      });
    } else {
      addDocument({
        type: config.type,
        ...payload,
        lastRenewedAt: form.issueDate || undefined,
      });
    }
    resetForm();
  };

  const Icon = config.icon;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <div className="flex items-start gap-4">
            <div
              className="p-3 rounded-xl shrink-0"
              style={{ backgroundColor: SB.mint, color: SB.forestInk }}
            >
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight" style={{ color: SB.forestInk }}>
                {config.label}
              </h1>
              <p className="text-sm mt-1 max-w-2xl" style={{ color: SB.pencilGray }}>
                {config.description}
              </p>
            </div>
          </div>
        </div>
        <button
          type="button"
          onClick={() => (showForm ? resetForm() : setShowForm(true))}
          className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm shrink-0 transition-opacity hover:opacity-90"
          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
        >
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "Add document"}
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Tracked" value={documents.length} />
        <StatCard label="Needs attention" value={expiringSoon} accent="warning" />
        <StatCard label="Compliant" value={compliant} accent="success" />
      </div>

      {showForm && (
        <section
          className="rounded-xl p-6"
          style={{ ...cardElevation, backgroundColor: "#ffffff" }}
        >
          <h2 className="text-base font-bold mb-4" style={{ color: SB.forestInk }}>
            {editingId ? "Edit" : "Add"} {config.shortLabel}
          </h2>
          {vehicleLicenseMode || driversLicenseMode ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: "#18623f" }}>
                  {config.referenceLabel}
                </label>
                <input
                  type="text"
                  value={form.reference}
                  onChange={(e) => setForm({ ...form, reference: e.target.value })}
                  onBlur={handleReferenceBlur}
                  placeholder={config.referencePlaceholder}
                  className={docInputClass}
                  style={docInputStyle}
                />
              </div>

              {vehicleLicenseMode && (
                <div className="mt-1 text-sm">
                  {lookupStatus === "busy" && <p style={{ color: "#18623f" }}>Looking up plate details…</p>}
                  {lookupStatus === "found" && (
                    <p style={{ color: "#18623f" }}>Plate details loaded. We'll use these for the record.</p>
                  )}
                  {lookupStatus === "missing" && <p style={{ color: "#b91c1c" }}>{lookupError}</p>}
                </div>
              )}

              <div className="mt-4">
                <button
                  type="button"
                  onClick={handleSave}
                  className="mt-2 w-full py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
                >
                  {editingId ? "Save changes" : "Process"}
                </button>
              </div>
            </div>
          ) : (
            <>
              <DocumentFormFields
                config={config}
                values={form}
                onChange={setForm}
                onReferenceBlur={handleReferenceBlur}
              />
              <div className="mt-4">
                <p className="text-sm font-medium mb-2" style={{ color: SB.forestInk }}>
                  Attach scan (optional)
                </p>
                <DocumentUploadZone compact onFile={setAttachmentName} />
                {attachmentName && (
                  <p className="text-xs mt-2" style={{ color: SB.pencilGray }}>
                    Attached: {attachmentName}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={handleSave}
                className="mt-6 w-full py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                {editingId ? "Save changes" : "Save document"}
              </button>
            </>
          )}
        </section>
      )}

      <section
        className="rounded-xl p-6"
        style={{ ...cardElevation, backgroundColor: "#ffffff" }}
      >
        <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: SB.forestInk }}>
          <Calendar className="w-5 h-5" style={{ opacity: 0.5 }} />
          Your documents
        </h2>

        {documents.length === 0 ? (
          <EmptyTypeState config={config} onAdd={() => setShowForm(true)} />
        ) : (
          <div className="space-y-4">
            {documents.map((doc) => (
                <DocumentRow
                key={doc.id}
                doc={doc}
                onRenew={() => {
                  submitRenewal(doc.id);
                }}
                onEdit={() => startEdit(doc)}
                onDelete={() => {
                  removeDocument(doc.id);
                }}
                onMarkRenewed={() => {
                  const today = new Date().toISOString().slice(0, 10);
                  updateDocument(doc.id, {
                    renewalStatus: "none",
                    lastRenewedAt: today,
                  });
                  
                }}
              />
            ))}
          </div>
        )}

        {pending > 0 && (
          <p className="text-xs mt-4" style={{ color: SB.pencilGray }}>
            {pending} renewal application{pending === 1 ? "" : "s"} pending review.
          </p>
        )}
      </section>

      <RequirementsPanel typeLabel={config.label} />
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "warning" | "success";
}) {
  const bg =
    accent === "warning" ? "#fff7ed"
    : accent === "success" ? "#d5f5c2"
    : "#ffffff";
  const valueColor =
    accent === "warning" ? "#92400e"
    : accent === "success" ? "#1a5c3a"
    : "#18623f";

  return (
    <div
      className="rounded-xl p-5"
      style={{ ...cardElevation, backgroundColor: bg }}
    >
      <p className="text-sm" style={{ color: "#b6b6b6" }}>{label}</p>
      <p className="text-3xl font-bold mt-1" style={{ color: valueColor }}>{value}</p>
    </div>
  );
}

function EmptyTypeState({
  config,
  onAdd,
}: {
  config: DocumentTypeConfig;
  onAdd: () => void;
}) {
  return (
    <div className="text-center py-10 px-4">
      <p className="text-sm mb-4" style={{ color: "#b6b6b6" }}>
        No {config.shortLabel.toLowerCase()} records yet. Add your first document to track expiry and renewals.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="px-5 py-2.5 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#18623f", color: "#fcfaf5" }}
      >
        Add {config.shortLabel}
      </button>
    </div>
  );
}

function DocumentRow({
  doc,
  onRenew,
  onEdit,
  onDelete,
  onMarkRenewed,
}: {
  doc: ComplianceDocument;
  onRenew: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onMarkRenewed: () => void;
}) {
  const info = getDocumentStatus(doc.expiryDate);
  const borderColor =
    info.status === "overdue"
      ? "#991b1b"
      : info.status === "expiring"
        ? "#f59e0b"
        : "#18623f";

  return (
    <div
      className="p-4 rounded-xl border-l-4"
      style={{
        borderLeftColor: borderColor,
        backgroundColor: "#fcfaf5",
      }}
    >
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-3">
        <div>
          <p className="font-bold" style={{ color: "#18623f" }}>{doc.title}</p>
          <p className="text-sm" style={{ color: "#b6b6b6" }}>
            {doc.reference}
            {doc.issuer ? ` · ${doc.issuer}` : ""}
          </p>
          {doc.attachmentName && (
            <p className="text-xs mt-1" style={{ color: "#b6b6b6" }}>
              Attachment: {doc.attachmentName}
            </p>
          )}
        </div>
        <span
          className="self-start px-3 py-1 text-xs font-bold rounded-full"
          style={{
            backgroundColor:
              info.status === "compliant" ? "#d5f5c2"
              : info.status === "overdue" ? "#fecaca"
              : "#ffe95c",
            color:
              info.status === "overdue" ? "#991b1b" : "#18623f",
          }}
        >
          {doc.renewalStatus === "pending" ? "Renewal pending" : info.statusLabel}
        </span>
      </div>

      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t"
        style={{ borderColor: "rgba(26,51,0,0.10)" }}
      >
        <div>
          <p className="text-sm" style={{ color: "#b6b6b6" }}>
            Expires: {formatExpiryDate(doc.expiryDate)}
          </p>
          <p
            className="text-sm font-semibold"
            style={{ color: info.progressColorKey === "error" ? "#991b1b" : "#18623f" }}
          >
            {info.progressLabel}
          </p>
          {doc.lastRenewedAt && (
            <p className="text-xs mt-1" style={{ color: "#b6b6b6" }}>
              Last renewed: {formatExpiryDate(doc.lastRenewedAt)}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {(info.status !== "compliant" || doc.renewalStatus === "none") && doc.renewalStatus !== "pending" && (
            <button
              type="button"
              onClick={onRenew}
              className="px-4 py-2 rounded-md text-sm font-bold transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#18623f", color: "#fcfaf5" }}
            >
              {info.status === "overdue" ? "Renew now" : "Start renewal"}
            </button>
          )}
          {doc.renewalStatus === "pending" && (
            <button
              type="button"
              onClick={onMarkRenewed}
              className="px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-1 border transition-opacity hover:opacity-70"
              style={{ borderColor: "rgba(26,51,0,0.10)", color: "#18623f" }}
            >
              <CheckCircle className="w-4 h-4" />
              Mark renewed
            </button>
          )}
          <button
            type="button"
            onClick={onEdit}
            className="px-4 py-2 rounded-md text-sm font-semibold border transition-opacity hover:opacity-70"
            style={{ borderColor: "rgba(26,51,0,0.10)", color: "#18623f" }}
          >
            Edit
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="px-3 py-2 rounded-md text-sm text-red-600 hover:bg-red-50 flex items-center gap-1"
            aria-label={`Remove ${doc.title}`}
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}

function RequirementsPanel({ typeLabel }: { typeLabel: string }) {
  return (
    <section
      className="rounded-xl p-6"
      style={{ backgroundColor: "#fcfaf5", border: `1.5px solid rgba(26,51,0,0.10)` }}
    >
      <h3 className="text-base font-bold mb-4" style={{ color: "#18623f" }}>
        {typeLabel} — what to prepare
      </h3>
      <p className="text-sm" style={{ color: "#b6b6b6" }}>
        Keep digital copies of your current document, valid ID, and proof of payment. Processing times vary by
        agency; use renewal reminders on the hub page so you never miss a deadline.
      </p>
    </section>
  );
}
