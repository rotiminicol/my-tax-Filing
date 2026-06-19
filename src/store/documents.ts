import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { DocumentType } from "@/lib/documentTypes";
import { emitAppNotification } from "@/lib/events";

export type RenewalApplicationStatus = "pending" | "approved" | "rejected";

export interface ComplianceDocument {
  id: string;
  type: DocumentType;
  title: string;
  reference: string;
  issuer?: string;
  expiryDate: string;
  issueDate?: string;
  lastRenewedAt?: string;
  notes?: string;
  attachmentName?: string;
  renewalStatus: RenewalApplicationStatus | "none";
  createdAt: string;
  updatedAt: string;
}

export interface DocumentReminderPrefs {
  whatsapp: boolean;
  emailReports: boolean;
  autoRenew: boolean;
  phone: string;
}

interface DocumentsState {
  documents: ComplianceDocument[];
  reminders: DocumentReminderPrefs;
  addDocument: (input: Omit<ComplianceDocument, "id" | "createdAt" | "updatedAt" | "renewalStatus">) => ComplianceDocument;
  updateDocument: (id: string, patch: Partial<ComplianceDocument>) => void;
  removeDocument: (id: string) => void;
  getDocument: (id: string) => ComplianceDocument | undefined;
  byType: (type: DocumentType) => ComplianceDocument[];
  submitRenewal: (id: string) => void;
  setReminders: (patch: Partial<DocumentReminderPrefs>) => void;
  clearAll: () => void;
}

function newId(): string {
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultReminders: DocumentReminderPrefs = {
  whatsapp: true,
  emailReports: true,
  autoRenew: false,
  phone: "",
};

export const useDocumentsStore = create<DocumentsState>()(
  persist(
    (set, get) => ({
      documents: [],
      reminders: defaultReminders,

      addDocument: (input) => {
        const now = new Date().toISOString();
        const doc: ComplianceDocument = {
          ...input,
          id: newId(),
          renewalStatus: "none",
          createdAt: now,
          updatedAt: now,
        };
        set((s) => ({ documents: [doc, ...s.documents] }));
        emitAppNotification({
          level: "success",
          title: "Document added",
          description: `${doc.title} is now being tracked.`,
        });
        return doc;
      },

      updateDocument: (id, patch) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d,
          ),
        }));
        emitAppNotification({ level: "success", title: "Document updated", description: "Changes saved." });
      },

      removeDocument: (id) => {
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }));
        emitAppNotification({ level: "info", title: "Document removed", description: "Document removed from tracking." });
      },

      getDocument: (id) => get().documents.find((d) => d.id === id),

      byType: (type) => get().documents.filter((d) => d.type === type),

      submitRenewal: (id) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id
              ? { ...d, renewalStatus: "pending" as const, updatedAt: new Date().toISOString() }
              : d,
          ),
        }));
        emitAppNotification({ level: "info", title: "Renewal submitted", description: "We'll track your application status." });
      },

      setReminders: (patch) => {
        set((s) => ({ reminders: { ...s.reminders, ...patch } }));
      },

      clearAll: () => set({ documents: [], reminders: defaultReminders }),
    }),
    { name: "mtf-documents-v1" },
  ),
);
