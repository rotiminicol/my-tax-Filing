import type { DocumentTypeConfig } from "@/lib/documentTypes";

export const docInputClass =
  "w-full px-4 py-3 rounded-xl border text-sm outline-none transition-all focus:ring-2 focus:ring-[#1a3300]/20 focus:border-[#1a3300]";

export const docInputStyle = {
  borderColor: "rgba(26,51,0,0.10)",
  backgroundColor: "#f1f1f1",
  color: "#1a3300",
} as const;

export interface DocumentFormValues {
  title: string;
  reference: string;
  issuer: string;
  expiryDate: string;
  issueDate: string;
  notes: string;
}

export const emptyDocumentForm = (): DocumentFormValues => ({
  title: "",
  reference: "",
  issuer: "",
  expiryDate: "",
  issueDate: "",
  notes: "",
});

interface Props {
  config: DocumentTypeConfig;
  values: DocumentFormValues;
  onChange: (values: DocumentFormValues) => void;
  onReferenceBlur?: () => void;
}

export function DocumentFormFields({ config, values, onChange, onReferenceBlur }: Props) {
  const set = (patch: Partial<DocumentFormValues>) => onChange({ ...values, ...patch });

  return (
    <div className="space-y-4">
      <Field label="Display name">
        <input
          type="text"
          value={values.title}
          onChange={(e) => set({ title: e.target.value })}
          placeholder={`e.g. My ${config.shortLabel}`}
          className={docInputClass}
          style={docInputStyle}
        />
      </Field>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label={config.referenceLabel}>
          <input
            type="text"
            value={values.reference}
            onChange={(e) => set({ reference: e.target.value })}
            onBlur={onReferenceBlur}
            placeholder={config.referencePlaceholder}
            className={docInputClass}
            style={docInputStyle}
          />
        </Field>
        {config.issuerLabel && (
          <Field label={config.issuerLabel}>
            <input
              type="text"
              value={values.issuer}
              onChange={(e) => set({ issuer: e.target.value })}
              placeholder={config.issuerPlaceholder}
              className={docInputClass}
              style={docInputStyle}
            />
          </Field>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Expiry date">
          <input
            type="date"
            value={values.expiryDate}
            onChange={(e) => set({ expiryDate: e.target.value })}
            className={docInputClass}
            style={docInputStyle}
            required
          />
        </Field>
        <Field label="Issue date (optional)">
          <input
            type="date"
            value={values.issueDate}
            onChange={(e) => set({ issueDate: e.target.value })}
            className={docInputClass}
            style={docInputStyle}
          />
        </Field>
      </div>
      <Field label="Notes (optional)">
        <textarea
          value={values.notes}
          onChange={(e) => set({ notes: e.target.value })}
          rows={2}
          className={docInputClass}
          style={docInputStyle}
          placeholder="Additional details for your records"
        />
      </Field>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2" style={{ color: "#1a3300" }}>
        {label}
      </label>
      {children}
    </div>
  );
}
