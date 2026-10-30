import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plus,
  RefreshCw,
  BellRing,
  Upload,
} from "lucide-react";
import { cardElevation } from "@/components/dashboard/documentRenewalShared";
import { SUPPORTED_DOCUMENT_TYPES, getDocumentTypeConfig } from "@/lib/documentTypes";
import {
  documentSubtitle,
  formatShortMonth,
  getDocumentStatus,
  maskPhone,
} from "@/lib/documents";
import { useDocumentsStore } from "@/store/documents";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";
import DocumentUploadZone from "@/components/dashboard/documents/DocumentUploadZone";

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

function FiscalToggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => onChange(!on)}
      className="w-10 h-5 rounded-full relative shrink-0 transition-colors"
      style={{ backgroundColor: on ? SB.yellow : "rgba(26,51,0,0.25)" }}
    >
      <span
        className={`absolute top-0.5 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${on ? "right-0.5" : "left-0.5"}`}
      />
    </button>
  );
}

function statusBadgeStyle(status: "compliant" | "expiring" | "overdue"): React.CSSProperties {
  if (status === "expiring") return { backgroundColor: SB.yellow, color: SB.forestInk };
  if (status === "overdue") return { backgroundColor: "#fecaca", color: "#991b1b" };
  return { backgroundColor: SB.mint, color: SB.forestInk };
}

export default function DocumentRenewalPage() {
  const documents = useDocumentsStore((s) => s.documents);
  const reminders = useDocumentsStore((s) => s.reminders);
  const setReminders = useDocumentsStore((s) => s.setReminders);
  const user = useAuth((s) => s.user);

  const [uploadTarget, setUploadTarget] = useState<string | null>(null);

  const supportedDocuments = documents.filter((document) =>
    SUPPORTED_DOCUMENT_TYPES.some((typeConfig) => typeConfig.type === document.type),
  );

  const urgent = supportedDocuments.filter((d) => {
    const s = getDocumentStatus(d.expiryDate).status;
    return s === "expiring" || s === "overdue";
  });
  const firstUrgent = urgent[0];
  const firstUrgentRoute = firstUrgent
    ? getDocumentTypeConfig(firstUrgent.type).route
    : "/customer-dashboard/documents/new";

  const phoneDisplay = reminders.phone.trim()
    ? maskPhone(reminders.phone)
    : "Add phone in reminders below";

  const emailDisplay = user?.email ?? "your account email";

  return (
    <>
      <section className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight mb-2"
            style={{ color: SB.forestInk, fontFamily: "'Bricolage Grotesque', 'Plus Jakarta Sans', sans-serif", fontWeight: 800 }}
          >
            Document Renewal
          </h1>
          <p className="text-sm max-w-2xl" style={{ color: SB.pencilGray }}>
            Manage and monitor your legal compliance documents. Track expirations and get reminders before deadlines.
          </p>
        </div>
        <div className="flex flex-wrap gap-3 shrink-0">
          <Link
            to="/customer-dashboard/documents/new"
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold border transition-colors hover:bg-[#fcfaf5] text-sm"
            style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder, color: SB.forestInk }}
          >
            <Upload className="w-4 h-4" />
            Upload New
          </Link>
          <Link
            to={firstUrgentRoute}
            className="flex items-center gap-2 px-5 py-2.5 rounded-md font-bold text-sm transition-opacity hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
          >
            <RefreshCw className="w-4 h-4" />
            {urgent.length > 0 ? "Renew Now" : "Add Document"}
          </Link>
        </div>
      </section>

      {documents.length === 0 ? (
        <EmptyHub />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          {documents.map((doc) => {
            const config = getDocumentTypeConfig(doc.type);
            const Icon = config.icon;
            const info = getDocumentStatus(doc.expiryDate);
            const progressColor = info.progressColorKey === "error" ? "#991b1b" : SB.forestInk;

            return (
              <div
                key={doc.id}
                className="rounded-xl p-4 flex flex-col gap-4 transition-all hover:-translate-y-1 duration-300 group"
                style={{ ...cardElevation, backgroundColor: "#ffffff" }}
              >
                <div className="flex justify-between items-start">
                  <div
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: SB.mint, color: SB.forestInk }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className="px-3 py-1 text-xs font-bold rounded-full"
                    style={statusBadgeStyle(info.status)}
                  >
                    {doc.renewalStatus === "pending" ? "Renewal pending" : info.statusLabel}
                  </span>
                </div>
                <div>
                  <h3 className="text-lg font-bold" style={{ color: SB.forestInk }}>{doc.title}</h3>
                  <p className="text-sm mt-1" style={{ color: SB.pencilGray }}>
                    {documentSubtitle(doc)}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: SB.pencilGray }}>
                    {config.label}
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span style={{ color: SB.pencilGray }}>Renewal Progress</span>
                    <span style={{ color: progressColor, fontWeight: 700 }}>{info.progressLabel}</span>
                  </div>
                  <div
                    className="w-full h-2 rounded-full overflow-hidden"
                    style={{ backgroundColor: SB.whisperGray }}
                  >
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${info.progressPct}%`, backgroundColor: progressColor }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between mt-auto pt-4">
                  {info.status === "overdue" ? (
                    <Link
                      to={config.route}
                      className="w-full py-2 text-center rounded-md font-bold text-sm transition-opacity hover:opacity-90"
                      style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
                    >
                      Renew Immediately
                    </Link>
                  ) : (
                    <>
                      <span className="text-xs font-medium" style={{ color: SB.pencilGray }}>
                        {doc.lastRenewedAt
                          ? `Last renewed: ${formatShortMonth(doc.lastRenewedAt)}`
                          : `Expires ${formatShortMonth(doc.expiryDate)}`}
                      </span>
                      <Link
                        to={config.route}
                        className="font-bold flex items-center gap-1 group-hover:gap-2 transition-all text-sm"
                        style={{ color: SB.forestInk }}
                      >
                        Manage <ArrowRight className="w-4 h-4" />
                      </Link>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Upload zone */}
        <div
          className="lg:col-span-8 rounded-xl p-6 md:p-8 relative overflow-hidden"
          style={{ ...cardElevation, backgroundColor: "#ffffff" }}
        >
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-3" style={{ color: SB.forestInk }}>
              Digitize New Document
            </h2>
            <p className="text-sm mb-6 max-w-md" style={{ color: SB.pencilGray }}>
              Upload a scan or photo. Attach it when adding a document, or add details manually.
            </p>
            <DocumentUploadZone
              onFile={(name) => {
                setUploadTarget(name);
                notify.info("Next step", "Choose a document type to complete your upload.");
              }}
            />
            {uploadTarget && (
              <p className="text-sm mt-3" style={{ color: SB.pencilGray }}>
                Selected: <strong style={{ color: SB.forestInk }}>{uploadTarget}</strong> —{" "}
                <Link
                  to="/customer-dashboard/documents/new"
                  className="font-semibold underline"
                  style={{ color: SB.forestInk }}
                >
                  continue to add document
                </Link>
              </p>
            )}
          </div>
        </div>

        {/* Smart reminders */}
        <div
          className="lg:col-span-4 rounded-xl p-6 md:p-8"
          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <BellRing className="w-5 h-5" style={{ color: SB.yellow }} />
            <h2 className="text-xl font-bold" style={{ color: "#fcfaf5" }}>Smart Reminders</h2>
          </div>
          <p className="text-sm mb-4" style={{ color: "rgba(252,250,245,0.70)" }}>
            Never miss a deadline. Preferences are saved to your account on this device.
          </p>
          <label className="block text-xs mb-4" style={{ color: "rgba(252,250,245,0.70)" }}>
            WhatsApp number
            <input
              type="tel"
              value={reminders.phone}
              onChange={(e) => setReminders({ phone: e.target.value })}
              placeholder="+234 800 000 0000"
              className="mt-1 w-full px-3 py-2 rounded-md text-sm"
              style={{ backgroundColor: "#fcfaf5", color: SB.forestInk }}
            />
          </label>
          <div className="space-y-3">
            {[
              { title: "WhatsApp Alerts", sub: reminders.whatsapp ? phoneDisplay : "Disabled", on: reminders.whatsapp, key: "whatsapp" as const },
              { title: "Email Reports", sub: reminders.emailReports ? emailDisplay : "Disabled", on: reminders.emailReports, key: "emailReports" as const },
              { title: "Auto-Renewal", sub: "Pay via Paystack when available", on: reminders.autoRenew, key: "autoRenew" as const },
            ].map((row) => (
              <div
                key={row.title}
                className="flex items-center justify-between p-3 rounded-lg border"
                style={{ backgroundColor: "rgba(252,250,245,0.08)", borderColor: "rgba(252,250,245,0.15)" }}
              >
                <div>
                  <p className="text-sm font-semibold" style={{ color: "#fcfaf5" }}>{row.title}</p>
                  <p className="text-[10px]" style={{ color: "rgba(252,250,245,0.55)" }}>{row.sub}</p>
                </div>
                <FiscalToggle
                  on={row.on}
                  onChange={(v) => {
                    setReminders({ [row.key]: v });
                    notify.success("Saved", `${row.title} ${v ? "enabled" : "disabled"}.`);
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Browse by type */}
      <section className="mt-10">
        <h2 className="text-base font-bold mb-4" style={{ color: SB.forestInk }}>
          Browse by document type
        </h2>
        <div className="flex flex-wrap gap-2">
          {SUPPORTED_DOCUMENT_TYPES.map((t) => (
            <Link
              key={t.type}
              to={t.route}
              className="px-4 py-2 rounded-full text-sm font-semibold border transition-colors hover:bg-[#18623f] hover:text-[#fcfaf5]"
              style={{ borderColor: SB.cardBorder, color: SB.forestInk, backgroundColor: "#ffffff" }}
            >
              {t.label}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function EmptyHub() {
  return (
    <div
      className="rounded-xl p-10 text-center mb-8 border"
      style={{ backgroundColor: "#ffffff", borderColor: "rgba(26,51,0,0.10)" }}
    >
      <p className="text-lg font-bold mb-2" style={{ color: "#18623f" }}>No documents tracked yet</p>
      <p className="text-sm mb-6 max-w-md mx-auto" style={{ color: "#b6b6b6" }}>
        Add your vehicle licence or driver&apos;s licence to start receiving expiry reminders.
      </p>
      <Link
        to="/customer-dashboard/documents/new"
        className="inline-flex items-center gap-2 px-6 py-3 rounded-md font-bold text-sm transition-opacity hover:opacity-90"
        style={{ backgroundColor: "#18623f", color: "#fcfaf5" }}
      >
        <Plus className="w-5 h-5" />
        Add your first document
      </Link>
    </div>
  );
}
