import { useState, useMemo } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { notify } from "@/components/Toaster";
import { EMAIL_TEMPLATES, type EmailTemplateDefinition } from "@/lib/email/emailRegistry";
import { sendAppEmail } from "@/lib/email/emailClient";
import { useAuth } from "@/store/auth";
import {
  Mail,
  Send,
  Smartphone,
  Monitor,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  RefreshCw,
  Search,
  Sliders,
  ExternalLink,
} from "lucide-react";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  cardBorder: "rgba(26,51,0,0.12)",
  muted: "#6b7280",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Templates",
  auth: "Auth & Account",
  subscriptions: "Subscriptions & Pay",
  marketing: "Marketing Campaigns",
  rent_relief: "Rent Relief",
  invoicing: "E-Invoicing",
  taxes: "Taxes & Compliance",
  support: "Support & Ops",
};

function EmailPreviewPage() {
  const user = useAuth((s) => s.user);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>("welcome");
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [testEmailRecipient, setTestEmailRecipient] = useState(
    user?.email || "test@taxfiling.com.ng",
  );
  const [sendingTest, setSendingTest] = useState(false);
  const [customVariables, setCustomVariables] = useState<string>("");
  const [customVarError, setCustomVarError] = useState<string | null>(null);

  const filteredTemplates = useMemo(() => {
    return EMAIL_TEMPLATES.filter((tpl) => {
      const matchesCategory = activeCategory === "all" || tpl.category === activeCategory;
      const matchesSearch =
        tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tpl.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const selectedTemplate: EmailTemplateDefinition = useMemo(() => {
    return EMAIL_TEMPLATES.find((t) => t.id === selectedTemplateId) || EMAIL_TEMPLATES[0];
  }, [selectedTemplateId]);

  // Sync sample data to editor when template changes
  const effectiveVariables = useMemo(() => {
    if (!customVariables.trim()) return selectedTemplate.sampleData;
    try {
      return JSON.parse(customVariables) as Record<string, unknown>;
    } catch {
      return selectedTemplate.sampleData;
    }
  }, [customVariables, selectedTemplate]);

  const renderedEmail = useMemo(() => {
    try {
      return selectedTemplate.render(effectiveVariables);
    } catch (err) {
      return {
        subject: selectedTemplate.defaultSubject,
        html: `<div style="padding: 24px; color: red;">Error rendering template: ${String(err)}</div>`,
      };
    }
  }, [selectedTemplate, effectiveVariables]);

  const handleSelectTemplate = (id: string) => {
    setSelectedTemplateId(id);
    const tpl = EMAIL_TEMPLATES.find((t) => t.id === id);
    if (tpl) {
      setCustomVariables(JSON.stringify(tpl.sampleData, null, 2));
      setCustomVarError(null);
    }
  };

  const handleVariableChange = (val: string) => {
    setCustomVariables(val);
    try {
      JSON.parse(val);
      setCustomVarError(null);
    } catch (err) {
      setCustomVarError(err instanceof Error ? err.message : "Invalid JSON");
    }
  };

  const handleResetVariables = () => {
    setCustomVariables(JSON.stringify(selectedTemplate.sampleData, null, 2));
    setCustomVarError(null);
    notify.info("Reset to default", "Loaded sample template variables.");
  };

  const handleSendTestEmail = async () => {
    if (!testEmailRecipient || !testEmailRecipient.includes("@")) {
      notify.error("Invalid recipient", "Please provide a valid test email address.");
      return;
    }

    setSendingTest(true);
    try {
      const res = await sendAppEmail({
        templateId: selectedTemplate.id,
        to: testEmailRecipient,
        variables: effectiveVariables,
        customSubject: `[TEST] ${renderedEmail.subject}`,
      });

      if (res.success) {
        notify.success(
          "Test Email Dispatched!",
          `Status: ${res.status || "sent"}. Sent to ${testEmailRecipient} via Resend.`,
        );
      } else {
        notify.error("Test delivery notice", res.error || "Could not deliver test email");
      }
    } catch (err) {
      notify.error("Send error", String(err));
    } finally {
      setSendingTest(false);
    }
  };

  return (
    <DashboardShell title="Email Notification System">
      <div className="space-y-6">
        {/* Header */}
        <div
          className="rounded-2xl border p-6 flex flex-col md:flex-row md:items-center justify-between gap-4"
          style={{ background: SB.cream, borderColor: SB.cardBorder }}
        >
          <div>
            <div className="flex items-center gap-2">
              <span
                className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                style={{ background: SB.yellow, color: SB.ink }}
              >
                Production Ready
              </span>
              <span className="text-xs font-medium text-muted-foreground">
                Powered by Resend &bull; 35+ Standardized Templates
              </span>
            </div>
            <h1 className="text-2xl font-black mt-2" style={{ color: SB.ink }}>
              Email Templates &amp; Notification Preview
            </h1>
            <p className="text-sm mt-1" style={{ color: SB.muted }}>
              Live rendering, dynamic personalization variables, and delivery testing for all
              TaxFilling email templates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setViewMode(viewMode === "desktop" ? "mobile" : "desktop")}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition hover:opacity-90"
              style={{ background: "#ffffff", borderColor: SB.cardBorder, color: SB.ink }}
            >
              {viewMode === "desktop" ? <Smartphone size={16} /> : <Monitor size={16} />}
              Switch to {viewMode === "desktop" ? "Mobile View (375px)" : "Desktop View (640px)"}
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap gap-2">
          {Object.entries(CATEGORY_LABELS).map(([catKey, label]) => {
            const isActive = activeCategory === catKey;
            return (
              <button
                key={catKey}
                onClick={() => setActiveCategory(catKey)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer"
                style={{
                  background: isActive ? SB.ink : "#ffffff",
                  color: isActive ? "#ffffff" : SB.ink,
                  border: `1px solid ${isActive ? SB.ink : SB.cardBorder}`,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Template Sidebar List */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl border text-xs bg-white"
                style={{ borderColor: SB.cardBorder }}
              />
            </div>

            <div
              className="rounded-2xl border divide-y max-h-[680px] overflow-y-auto bg-white"
              style={{ borderColor: SB.cardBorder }}
            >
              {filteredTemplates.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  No templates match filter
                </div>
              ) : (
                filteredTemplates.map((tpl) => {
                  const isSelected = tpl.id === selectedTemplateId;
                  return (
                    <button
                      key={tpl.id}
                      onClick={() => handleSelectTemplate(tpl.id)}
                      className="w-full text-left p-3.5 transition-all flex flex-col gap-1 cursor-pointer"
                      style={{
                        background: isSelected ? "rgba(213,245,194,0.35)" : "transparent",
                        borderLeft: isSelected ? `4px solid ${SB.ink}` : "4px solid transparent",
                      }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold" style={{ color: SB.ink }}>
                          {tpl.name}
                        </span>
                        <span
                          className="text-[9px] px-2 py-0.5 rounded font-black uppercase tracking-wider"
                          style={{ background: "#e5e7eb", color: "#374151" }}
                        >
                          {tpl.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-1">
                        {tpl.description}
                      </p>
                    </button>
                  );
                })
              )}
            </div>

            {/* Test Send Card */}
            <div
              className="rounded-2xl border p-4 bg-white space-y-3"
              style={{ borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" style={{ color: SB.ink }} />
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: SB.ink }}
                >
                  Send Real Test Email
                </h4>
              </div>
              <p className="text-xs text-muted-foreground">
                Dispatch this template via Resend to your personal inbox for real-device inspection.
              </p>
              <input
                type="email"
                placeholder="Recipient email address"
                value={testEmailRecipient}
                onChange={(e) => setTestEmailRecipient(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs"
                style={{ borderColor: SB.cardBorder }}
              />
              <button
                type="button"
                disabled={sendingTest}
                onClick={handleSendTestEmail}
                className="w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition hover:opacity-90 disabled:opacity-60 cursor-pointer"
                style={{ background: SB.yellow, color: SB.ink }}
              >
                {sendingTest ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                {sendingTest ? "Dispatching via Resend…" : "Send Test to Inbox"}
              </button>
            </div>
          </div>

          {/* Live Preview Panel */}
          <div className="lg:col-span-8 space-y-4">
            {/* Meta bar */}
            <div
              className="rounded-2xl border p-4 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              style={{ borderColor: SB.cardBorder }}
            >
              <div className="min-w-0">
                <p className="text-xs text-muted-foreground font-semibold">Subject Line:</p>
                <p className="text-sm font-bold truncate mt-0.5" style={{ color: SB.ink }}>
                  {renderedEmail.subject}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(renderedEmail.html);
                    notify.success("HTML Copied", "Raw email HTML copied to clipboard.");
                  }}
                  className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50"
                  style={{ borderColor: SB.cardBorder, color: SB.ink }}
                >
                  <Copy size={13} />
                  Copy HTML
                </button>
              </div>
            </div>

            {/* Email Iframe Display */}
            <div
              className="flex justify-center bg-slate-100 rounded-2xl p-4 border overflow-hidden"
              style={{ borderColor: SB.cardBorder }}
            >
              <div
                className="transition-all duration-300 shadow-md rounded-xl overflow-hidden bg-white"
                style={{
                  width: viewMode === "mobile" ? "375px" : "100%",
                  maxWidth: viewMode === "mobile" ? "375px" : "680px",
                  height: "750px",
                }}
              >
                <iframe
                  title="Email Template Live Preview"
                  srcDoc={renderedEmail.html}
                  className="w-full h-full border-0"
                />
              </div>
            </div>

            {/* JSON Variables Customizer */}
            <div
              className="rounded-2xl border p-4 bg-white space-y-3"
              style={{ borderColor: SB.cardBorder }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sliders className="w-4 h-4" style={{ color: SB.ink }} />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: SB.ink }}
                  >
                    Customize Template Variables (JSON)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleResetVariables}
                  className="text-xs text-muted-foreground hover:underline"
                >
                  Reset Defaults
                </button>
              </div>

              <textarea
                rows={5}
                value={customVariables || JSON.stringify(selectedTemplate.sampleData, null, 2)}
                onChange={(e) => handleVariableChange(e.target.value)}
                className="w-full p-3 rounded-xl border font-mono text-xs bg-slate-50 focus:bg-white"
                style={{ borderColor: customVarError ? "#ef4444" : SB.cardBorder }}
              />

              {customVarError && (
                <p className="text-xs text-red-600 font-semibold">{customVarError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}

export default EmailPreviewPage;
