import { create } from "zustand";
import type { DocumentType } from "@/lib/documentTypes";
import { emitAppNotification } from "@/lib/events";
import { supabase } from "@/integrations/supabase/client";

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
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `doc-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const defaultReminders: DocumentReminderPrefs = {
  whatsapp: true,
  emailReports: true,
  autoRenew: false,
  phone: "",
};

function isUuid(s: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(s);
}

let _userId: string | null = null;

function rowToDoc(row: Record<string, unknown>): ComplianceDocument {
  return {
    id: row.id as string,
    type: row.type as DocumentType,
    title: row.title as string,
    reference: row.reference as string,
    issuer: (row.issuer as string | null) ?? undefined,
    expiryDate: row.expiry_date as string,
    issueDate: (row.issue_date as string | null) ?? undefined,
    lastRenewedAt: (row.last_renewed_at as string | null) ?? undefined,
    notes: (row.notes as string | null) ?? undefined,
    attachmentName: (row.attachment_name as string | null) ?? undefined,
    renewalStatus: (row.renewal_status as ComplianceDocument["renewalStatus"]) ?? "none",
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

async function pushDoc(d: ComplianceDocument, userId: string) {
  if (!isUuid(d.id)) return;
  await supabase.from("compliance_documents").upsert({
    id: d.id,
    user_id: userId,
    type: d.type,
    title: d.title,
    reference: d.reference,
    issuer: d.issuer ?? null,
    expiry_date: d.expiryDate,
    issue_date: d.issueDate ?? null,
    last_renewed_at: d.lastRenewedAt ?? null,
    notes: d.notes ?? null,
    attachment_name: d.attachmentName ?? null,
    renewal_status: d.renewalStatus,
  } as never);
}

export const useDocumentsStore = create<DocumentsState>()((set, get) => ({
      documents: [] as ComplianceDocument[],
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
        if (_userId) void pushDoc(doc, _userId);
        return doc;
      },

      updateDocument: (id, patch) => {
        set((s) => ({
          documents: s.documents.map((d) =>
            d.id === id ? { ...d, ...patch, updatedAt: new Date().toISOString() } : d,
          ),
        }));
        emitAppNotification({ level: "success", title: "Document updated", description: "Changes saved." });
        const found = get().documents.find((d) => d.id === id);
        if (_userId && found) void pushDoc(found, _userId);
      },

      removeDocument: (id) => {
        set((s) => ({ documents: s.documents.filter((d) => d.id !== id) }));
        emitAppNotification({ level: "info", title: "Document removed", description: "Document removed from tracking." });
        if (_userId && isUuid(id)) void supabase.from("compliance_documents").delete().eq("id", id);
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
        const found = get().documents.find((d) => d.id === id);
        if (_userId && found) void pushDoc(found, _userId);
      },

      setReminders: (patch) => {
        set((s) => ({ reminders: { ...s.reminders, ...patch } }));
        const next = get().reminders;
        if (_userId) {
          void supabase.from("document_reminders").upsert({
            user_id: _userId,
            whatsapp: next.whatsapp,
            email_reports: next.emailReports,
            auto_renew: next.autoRenew,
            phone: next.phone,
          } as never, { onConflict: "user_id" });
        }
      },

      clearAll: () => set({ documents: [], reminders: defaultReminders }),
}));

async function hydrateDocuments(userId: string) {
  const [docs, rem] = await Promise.all([
    supabase.from("compliance_documents").select("*").eq("user_id", userId).order("expiry_date", { ascending: true }),
    supabase.from("document_reminders").select("*").eq("user_id", userId).maybeSingle(),
  ]);
  if (docs.data) {
    useDocumentsStore.setState({
      documents: (docs.data as unknown as Record<string, unknown>[]).map(rowToDoc),
    });
  }
  if (rem.data) {
    const r = rem.data as unknown as Record<string, unknown>;
    useDocumentsStore.setState({
      reminders: {
        whatsapp: !!r.whatsapp,
        emailReports: !!r.email_reports,
        autoRenew: !!r.auto_renew,
        phone: (r.phone as string | null) ?? "",
      },
    });
  }
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => {
    const uid = data.session?.user?.id ?? null;
    _userId = uid;
    if (uid) void hydrateDocuments(uid);
  });
  supabase.auth.onAuthStateChange((event, session) => {
    const uid = session?.user?.id ?? null;
    _userId = uid;
    if (event === "SIGNED_OUT" || !uid) {
      useDocumentsStore.setState({ documents: [], reminders: defaultReminders });
    } else if (event === "SIGNED_IN") {
      void hydrateDocuments(uid);
    }
  });
}
