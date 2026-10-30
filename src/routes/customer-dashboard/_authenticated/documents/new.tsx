import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { SUPPORTED_DOCUMENT_TYPES, getDocumentTypeConfig, type DocumentType } from "@/lib/documentTypes";
import { useDocumentsStore } from "@/store/documents";
import { notify } from "@/components/Toaster";
import DocumentUploadZone from "@/components/dashboard/documents/DocumentUploadZone";
import {
  DocumentFormFields,
  emptyDocumentForm,
  type DocumentFormValues,
} from "@/components/dashboard/documents/DocumentFormFields";
import { docInputClass, docInputStyle } from "@/components/dashboard/documents/DocumentFormFields";
import AppSelect from "@/components/ui/AppSelect";

type NewDocSearch = { type?: DocumentType };

function NewDocumentRoute() {
  const [_sp] = useSearchParams();
  const initialType = _sp.get("type") as DocumentType | null;
  const navigate = useNavigate();
  const addDocument = useDocumentsStore((s) => s.addDocument);

  const [selectedType, setSelectedType] = useState<DocumentType | "">(initialType ?? "");
  const [form, setForm] = useState<DocumentFormValues>(emptyDocumentForm());
  const [attachmentName, setAttachmentName] = useState<string | undefined>();
  const [lookupStatus, setLookupStatus] = useState<"idle" | "busy" | "found" | "missing">("idle");
  const [lookupError, setLookupError] = useState<string | undefined>();
  const [lastLookupPlate, setLastLookupPlate] = useState<string>("");

  const vehicleMode = selectedType === "vehicle-license";
  const driversMode = selectedType === "drivers-license";

  const config = selectedType ? getDocumentTypeConfig(selectedType) : null;

  const handleSave = () => {
    if (!selectedType || !config) {
      notify.error("Select type", "Choose a document type to continue.");
      return;
    }
    if (vehicleMode || driversMode) {
      if (!form.reference.trim()) {
        notify.error("Missing fields", driversMode ? "Please enter your license number." : "Please enter your vehicle plate number.");
        return;
      }
      const normalizePlate = (plate: string) => plate.trim().toUpperCase();
      const defaultVehicleExpiry = () => {
        const nextYear = new Date();
        nextYear.setFullYear(nextYear.getFullYear() + 1);
        return nextYear.toISOString().slice(0, 10);
      };

      if (vehicleMode) {
        const reference = normalizePlate(form.reference);
        const payload = {
          type: selectedType,
          title: reference ? `Vehicle license ${reference}` : "Vehicle license",
          reference,
          issuer: form.issuer.trim() || "Vehicle registry",
          expiryDate: form.expiryDate || defaultVehicleExpiry(),
          issueDate: form.issueDate || new Date().toISOString().slice(0, 10),
          notes: form.notes.trim() || "Added by plate number.",
          attachmentName,
          lastRenewedAt: form.issueDate || undefined,
        };
        addDocument(payload as any);
        notify.success("Document added", `${payload.title} is now being tracked.`);
        navigate(config.route);
        return;
      }

      // drivers mode
      const payload = {
        type: selectedType,
        title: form.reference.trim() ? `Driver's license ${form.reference.trim()}` : "Driver's license",
        reference: form.reference.trim(),
        issuer: form.issuer.trim() || undefined,
        expiryDate: form.expiryDate || defaultVehicleExpiry(),
        issueDate: form.issueDate || undefined,
        notes: form.notes.trim() || undefined,
        attachmentName,
        lastRenewedAt: form.issueDate || undefined,
      };
      addDocument(payload as any);
      notify.success("Document added", `${payload.title} is now being tracked.`);
      navigate(config.route);
      return;
    }

    if (!form.title.trim() || !form.reference.trim() || !form.expiryDate) {
      notify.error("Missing fields", "Name, reference, and expiry date are required.");
      return;
    }
    addDocument({
      type: selectedType,
      title: form.title.trim(),
      reference: form.reference.trim(),
      issuer: form.issuer.trim() || undefined,
      expiryDate: form.expiryDate,
      issueDate: form.issueDate || undefined,
      notes: form.notes.trim() || undefined,
      attachmentName,
      lastRenewedAt: form.issueDate || undefined,
    });
    notify.success("Document added", `${form.title} is now being tracked.`);
    navigate(config.route);
  };

  return (
    <DashboardShell>
      <div className="max-w-2xl mx-auto space-y-6">
        <header>
          <h1 className="text-2xl font-bold" style={{ color: fiscal.primary }}>
            Add document
          </h1>
          <p className="text-sm mt-1" style={{ color: fiscal.onSurfaceVariant }}>
            Select a document type and enter expiry details to start tracking.
          </p>
        </header>

        <section className="rounded-xl p-6" style={{ ...cardElevation, backgroundColor: fiscal.surface }}>
          <label className="block text-sm font-medium mb-2" style={{ color: fiscal.onSurface }}>
            Document type
          </label>
          <AppSelect
            className="mb-6"
            value={selectedType || undefined}
            onValueChange={(v) => {
              setSelectedType(v as DocumentType);
              setForm(emptyDocumentForm());
            }}
            placeholder="Select type…"
            options={SUPPORTED_DOCUMENT_TYPES.map((t) => ({ value: t.type, label: t.label }))}
          />

          {config && (
            <>
              {vehicleMode || driversMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2" style={{ color: fiscal.onSurface }}>
                      {config.referenceLabel}
                    </label>
                    <input
                      type="text"
                      value={form.reference}
                      onChange={(e) => setForm({ ...form, reference: e.target.value })}
                      placeholder={config.referencePlaceholder}
                      className={docInputClass}
                      style={docInputStyle}
                    />
                  </div>
                  {vehicleMode && (
                    <div className="mt-2 text-sm">
                      {lookupStatus === "busy" && <p style={{ color: "#18623f" }}>Looking up plate details…</p>}
                      {lookupStatus === "found" && (
                        <p style={{ color: "#18623f" }}>Plate details loaded. We'll use these for the record.</p>
                      )}
                      {lookupStatus === "missing" && <p style={{ color: "#b91c1c" }}>{lookupError}</p>}
                    </div>
                  )}
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="mt-2 w-full py-3 rounded-xl font-bold text-sm text-white"
                      style={{ backgroundColor: fiscal.primary }}
                    >
                      Process
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <DocumentFormFields config={config} values={form} onChange={setForm} />
                  <div className="mt-6">
                    <p className="text-sm font-medium mb-2">Attach scan (optional)</p>
                    <DocumentUploadZone compact onFile={setAttachmentName} />
                    {attachmentName && (
                      <p className="text-xs mt-2" style={{ color: fiscal.onSurfaceVariant }}>
                        {attachmentName}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={handleSave}
                    className="mt-6 w-full py-3 rounded-xl font-bold text-sm text-white"
                    style={{ backgroundColor: fiscal.primary }}
                  >
                    Save and track
                  </button>
                </>
              )}
            </>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

export default NewDocumentRoute;
