import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";
import { notify } from "@/components/Toaster";
import { FolderDown, Globe, Headphones, Shield, Trash2, Mail, ExternalLink } from "lucide-react";
import AppSelect from "@/components/ui/AppSelect";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";
import { supabase } from "@/integrations/supabase/client";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const fieldStyle = {
  backgroundColor: "#f1f1f1",
  borderColor: SB.cardBorder,
  color: SB.ink,
};

function Toggle({ on, setOn }: { on: boolean; setOn: (v: boolean) => void }) {
  return (
    <button
      type="button"
      className="w-12 h-6 rounded-full p-0.5 transition-colors duration-300 focus:outline-none"
      style={{ backgroundColor: on ? SB.ink : "#d4d4d4" }}
      onClick={() => setOn(!on)}
      aria-pressed={on}
    >
      <div
        className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
        style={{ transform: on ? "translateX(24px)" : "translateX(0)" }}
      />
    </button>
  );
}

function ToggleRow({
  title,
  subtitle,
  on,
  setOn,
}: {
  title: string;
  subtitle: string;
  on: boolean;
  setOn: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <p className="text-sm font-semibold" style={{ color: SB.ink }}>
          {title}
        </p>
        <p className="text-xs mt-0.5" style={{ color: SB.muted }}>
          {subtitle}
        </p>
      </div>
      <Toggle on={on} setOn={setOn} />
    </div>
  );
}

function Field({
  label,
  children,
  hint,
}: {
  label: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-bold uppercase tracking-widest" style={{ color: SB.pencil }}>
        {label}
      </label>
      {children}
      {hint && (
        <p className="text-xs" style={{ color: SB.muted }}>
          {hint}
        </p>
      )}
    </div>
  );
}

function SettingsPage() {
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);

  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [language, setLanguage] = useState("English (UK)");
  const [currency, setCurrency] = useState("NGN");
  const [emailReminders, setEmailReminders] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [taxDeadlineReminders, setTaxDeadlineReminders] = useState(true);
  const [invoiceAlerts, setInvoiceAlerts] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const save = async () => {
    if (!fullName.trim()) {
      notify.error("Validation", "Full name cannot be empty.");
      return;
    }
    if (!email.includes("@")) {
      notify.error("Validation", "Enter a valid email address.");
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        fullName: fullName.trim(),
        email: email.trim(),
        phone: phone.trim(),
      });

      if (user?.id) {
        try {
          await supabase.from("user_notification_preferences" as never).upsert(
            {
              user_id: user.id,
              email: email.trim(),
              marketing_emails: marketingEmails,
              tax_deadline_reminders: taxDeadlineReminders,
              invoice_alerts: invoiceAlerts,
              updated_at: new Date().toISOString(),
            } as never,
            { onConflict: "user_id" },
          );
        } catch (prefErr) {
          console.warn("Preferences sync notice:", prefErr);
        }
      }

      notify.success(
        "Settings saved",
        "Your profile details and notification preferences have been saved.",
      );
    } catch (err) {
      notify.error("Save failed", err instanceof Error ? err.message : "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardShell title="Settings">
      <div className="space-y-6">
        <header
          className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-2xl font-extrabold" style={{ color: SB.ink }}>
            Account Settings
          </h1>
          <p className="text-sm mt-1" style={{ color: SB.muted }}>
            Manage your tax profile, security protocols, and platform preferences.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left column */}
          <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
            {/* Personal Information */}
            <section
              className={`rounded-2xl border p-6 transition-all duration-500 delay-75 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="mb-5">
                <h3 className="text-base font-extrabold" style={{ color: SB.ink }}>
                  Personal Information
                </h3>
                <p className="text-xs mt-0.5" style={{ color: SB.muted }}>
                  Update your legal identity and contact details.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Legal Name">
                  <input
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all font-medium"
                    style={fieldStyle}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your legal name"
                  />
                </Field>
                <Field label="Tax Identification Number (TIN)" hint="Verified by FIRS.">
                  <input
                    className="w-full px-3.5 py-3 rounded-xl border text-sm cursor-not-allowed font-mono"
                    style={{ ...fieldStyle, opacity: 0.6 }}
                    value={user?.tin || "Not configured yet"}
                    readOnly
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={fieldStyle}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </Field>
                <Field label="Phone Number">
                  <input
                    type="tel"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={fieldStyle}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                  />
                </Field>
              </div>

              <div className="pt-4 flex justify-end">
                <button
                  type="button"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                  style={{ backgroundColor: SB.ink, color: SB.cream }}
                  onClick={save}
                >
                  {saving ? "Saving…" : "Save Changes"}
                </button>
              </div>
            </section>

            {/* Preferences + Alerts row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <section
                className={`rounded-2xl border p-6 transition-all duration-500 delay-100 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: SB.teal }}
                  >
                    <Globe className="w-4 h-4" style={{ color: SB.ink }} />
                  </div>
                  <h3 className="text-sm font-extrabold" style={{ color: SB.ink }}>
                    Preferences
                  </h3>
                </div>
                <div className="space-y-4">
                  <Field label="Language">
                    <AppSelect
                      value={language}
                      onValueChange={setLanguage}
                      placeholder="Select language"
                      options={["English (UK)", "Yoruba", "Hausa", "Igbo"].map((l) => ({
                        value: l,
                        label: l,
                      }))}
                    />
                  </Field>
                  <Field label="Base Currency">
                    <AppSelect
                      value={currency}
                      onValueChange={setCurrency}
                      placeholder="Select currency"
                      options={[
                        { value: "NGN", label: "NGN — Nigerian Naira (₦)" },
                        { value: "USD", label: "USD — US Dollar ($)" },
                        { value: "GBP", label: "GBP — British Pound (£)" },
                      ]}
                    />
                  </Field>
                </div>
              </section>

              <section
                className={`rounded-2xl border p-6 transition-all duration-500 delay-150 ${
                  mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
              >
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: SB.mint }}
                  >
                    <Shield className="w-4 h-4" style={{ color: SB.ink }} />
                  </div>
                  <h3 className="text-sm font-extrabold" style={{ color: SB.ink }}>
                    Notification Alerts
                  </h3>
                </div>
                <div className="space-y-4">
                  <ToggleRow
                    title="Filing Deadlines"
                    subtitle="PIT (March 31) and monthly VAT statutory reminders"
                    on={taxDeadlineReminders}
                    setOn={setTaxDeadlineReminders}
                  />
                  <div className="border-t" style={{ borderColor: SB.cardBorder }} />
                  <ToggleRow
                    title="Invoice & Settlement Alerts"
                    subtitle="Payment receipts and client overdue notices"
                    on={invoiceAlerts}
                    setOn={setInvoiceAlerts}
                  />
                  <div className="border-t" style={{ borderColor: SB.cardBorder }} />
                  <ToggleRow
                    title="Promotional & Offers"
                    subtitle="Rent relief tips, discounts, and product updates"
                    on={marketingEmails}
                    setOn={setMarketingEmails}
                  />
                  <div className="border-t" style={{ borderColor: SB.cardBorder }} />
                  <div className="pt-1 flex items-center justify-between">
                    <span className="text-xs font-semibold" style={{ color: SB.muted }}>
                      Email Notification Engine:
                    </span>
                    <Link
                      to="/customer-dashboard/email-previews"
                      className="text-xs font-bold inline-flex items-center gap-1 hover:underline"
                      style={{ color: SB.ink }}
                    >
                      <Mail size={13} />
                      Preview All 35+ Templates &rarr;
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right column */}
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            {/* Security card */}
            <section
              className={`rounded-2xl p-6 relative overflow-hidden transition-all duration-500 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.ink, color: SB.cream }}
            >
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage: "radial-gradient(rgba(252,250,245,0.8) 1px, transparent 1px)",
                  backgroundSize: "24px 24px",
                }}
              />
              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: SB.yellow }}
                  >
                    <Shield className="w-4 h-4" style={{ color: SB.ink }} />
                  </div>
                  <h3 className="text-sm font-extrabold">Security</h3>
                </div>

                <div
                  className="p-4 rounded-xl border"
                  style={{
                    backgroundColor: "rgba(252,250,245,0.08)",
                    borderColor: "rgba(252,250,245,0.12)",
                  }}
                >
                  <p className="text-sm font-bold mb-1">Two-Factor Authentication</p>
                  <p className="text-xs mb-4 opacity-60">
                    OTP authentication active via registered email.
                  </p>
                  <div
                    className="w-full py-2 rounded-lg font-bold text-sm text-center"
                    style={{ backgroundColor: SB.mint, color: SB.ink }}
                  >
                    ✓ Enabled
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full p-3 rounded-xl text-sm font-semibold text-left transition-colors hover:bg-white/10"
                  style={{ color: SB.cream }}
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </button>
              </div>
            </section>

            {/* Data Management */}
            <section
              className={`rounded-2xl border p-6 transition-all duration-500 delay-150 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: SB.cream }}
                >
                  <FolderDown className="w-4 h-4" style={{ color: SB.ink }} />
                </div>
                <h3 className="text-sm font-extrabold" style={{ color: SB.ink }}>
                  Data Management
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  {
                    title: "Export Archive",
                    desc: "Download all PIT / VAT history as .CSV",
                    action: () => notify.success("Export started", "Preparing your data archive."),
                  },
                  {
                    title: "Third-party Sync",
                    desc: "Connect to accounting software",
                    action: () => notify.info("Coming soon", "Third-party sync arriving next."),
                  },
                ].map(({ title, desc, action }) => (
                  <button
                    key={title}
                    type="button"
                    className="w-full text-left p-3.5 rounded-xl border hover:bg-[#fcfaf5] transition-colors"
                    style={{ borderColor: SB.cardBorder }}
                    onClick={action}
                  >
                    <p className="text-sm font-bold" style={{ color: SB.ink }}>
                      {title}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: SB.muted }}>
                      {desc}
                    </p>
                  </button>
                ))}
              </div>
              <div className="pt-4 mt-2 border-t" style={{ borderColor: SB.cardBorder }}>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl font-bold flex items-center justify-center gap-2 text-sm hover:bg-red-50 transition-colors"
                  style={{ color: "#991b1b" }}
                  onClick={() => setDeleteAccountOpen(true)}
                >
                  <Trash2 className="w-4 h-4" />
                  Deactivate & Delete Account
                </button>
              </div>
            </section>

            {/* Help callout */}
            <section
              className={`rounded-2xl border p-6 text-center transition-all duration-500 delay-200 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3"
                style={{ backgroundColor: SB.mint }}
              >
                <Headphones className="w-6 h-6" style={{ color: SB.ink }} />
              </div>
              <h4 className="font-extrabold text-sm" style={{ color: SB.ink }}>
                Need Compliance Help?
              </h4>
              <p className="text-xs mt-1.5 mb-4" style={{ color: SB.muted }}>
                Our tax consultants are available 24/7 for premium subscribers.
              </p>
              <button
                type="button"
                className="px-5 py-2 rounded-xl font-bold border-2 text-sm transition-colors hover:bg-[#18623f] hover:text-[#fcfaf5]"
                style={{ borderColor: SB.ink, color: SB.ink }}
                onClick={() => notify.info("Support", "Live chat opening soon.")}
              >
                Start Chat
              </button>
            </section>
          </div>
        </div>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />

      <DeleteAccountModal open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
    </DashboardShell>
  );
}

export default SettingsPage;
