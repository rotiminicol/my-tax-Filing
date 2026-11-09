import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useAuth } from "@/store/auth";
import { planDisplayName } from "@/lib/planConfig";
import { notify } from "@/components/Toaster";
import { Camera, CheckCircle2, ShieldCheck } from "lucide-react";
import ChangePasswordModal from "@/components/auth/ChangePasswordModal";
import DeleteAccountModal from "@/components/auth/DeleteAccountModal";

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

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
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
    <div className="space-y-1.5">
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

function RowToggle({
  label,
  on,
  setOn,
}: {
  label: string;
  on: boolean;
  setOn: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-medium" style={{ color: SB.ink }}>
        {label}
      </span>
      <button
        type="button"
        className="w-12 h-6 rounded-full p-0.5 transition-colors duration-300"
        style={{ backgroundColor: on ? SB.ink : "#d4d4d4" }}
        onClick={() => setOn(!on)}
      >
        <div
          className="w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-300"
          style={{ transform: on ? "translateX(24px)" : "translateX(0)" }}
        />
      </button>
    </div>
  );
}

function ProfilePage() {
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);

  const [biometric, setBiometric] = useState(true);
  const [fullName, setFullName] = useState(user?.fullName ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [tin, setTin] = useState(user?.tin ?? "");
  const [nin, setNin] = useState(user?.nin ?? "");
  const [organization, setOrganization] = useState(user?.organization ?? "");
  const [stateOfResidence, setStateOfResidence] = useState(user?.stateOfResidence ?? "");
  const [employmentStatus, setEmploymentStatus] = useState(user?.employmentStatus ?? "");

  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setTin(user.tin || "");
      setNin(user.nin || "");
      setOrganization(user.organization || "");
      setStateOfResidence(user.stateOfResidence || "");
      setEmploymentStatus(user.employmentStatus || "");
    }
  }, [user]);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const save = async () => {
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
        tin: tin.trim() || undefined,
        nin: nin.trim() || undefined,
        organization: organization.trim() || undefined,
        stateOfResidence: stateOfResidence || undefined,
        employmentStatus: employmentStatus || undefined,
      });
      notify.success("Profile updated", "Your profile information has been saved in Supabase.");
    } catch (err) {
      notify.error("Save failed", err instanceof Error ? err.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.fullName || fullName || "User";
  const initials = getInitials(displayName);
  const accountType = user?.accountType === "organization" ? "Organization" : "Individual";
  const planName = planDisplayName(user?.plan ?? null);

  return (
    <DashboardShell title="Profile">
      <div className="space-y-6">
        <header
          className={`transition-all duration-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h1 className="text-2xl font-extrabold" style={{ color: SB.ink }}>
            User Profile
          </h1>
          <p className="text-sm mt-1" style={{ color: SB.muted }}>
            Manage your centralized identity, contact details, and account security.
          </p>
        </header>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left sidebar */}
          <div className="lg:w-1/3 space-y-5">
            {/* Avatar card */}
            <section
              className={`rounded-2xl border p-6 text-center transition-all duration-500 delay-75 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="relative inline-block mb-4">
                {/* Avatar: initials-based */}
                <div
                  className="w-28 h-28 rounded-full flex items-center justify-center text-3xl font-extrabold ring-4 ring-[rgba(26,51,0,0.10)] shadow-lg"
                  style={{
                    backgroundColor: SB.mint,
                    color: SB.ink,
                  }}
                >
                  {initials}
                </div>
                <button
                  type="button"
                  className="absolute bottom-1 right-1 w-9 h-9 rounded-full flex items-center justify-center shadow-md border-2"
                  style={{
                    backgroundColor: SB.ink,
                    color: SB.cream,
                    borderColor: SB.white,
                  }}
                  onClick={() =>
                    notify.info("Avatar", "Avatar photo upload coming in next release.")
                  }
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-lg font-extrabold" style={{ color: SB.ink }}>
                {displayName}
              </h3>
              <p className="text-sm mt-0.5" style={{ color: SB.muted }}>
                {accountType} · {planName} Plan
              </p>

              <div
                className="mt-5 pt-5 border-t grid grid-cols-2 gap-3"
                style={{ borderColor: SB.cardBorder }}
              >
                <div className="text-left p-3 rounded-xl" style={{ backgroundColor: SB.cream }}>
                  <p
                    className="text-[9px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: SB.pencil }}
                  >
                    Tax Status
                  </p>
                  <div
                    className="flex items-center gap-1 font-extrabold text-sm"
                    style={{ color: SB.ink }}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#1a5c3a" }} />
                    {user?.onboarded ? "Compliant" : "In Progress"}
                  </div>
                </div>
                <div className="text-left p-3 rounded-xl" style={{ backgroundColor: SB.cream }}>
                  <p
                    className="text-[9px] font-bold uppercase tracking-widest mb-1"
                    style={{ color: SB.pencil }}
                  >
                    Compliance Score
                  </p>
                  <p className="font-extrabold text-sm" style={{ color: "#b45309" }}>
                    {user?.onboarded ? "810 / 850" : "650 / 850"}
                  </p>
                </div>
              </div>

              {/* Member since */}
              <div className="mt-4 pt-4 border-t" style={{ borderColor: SB.cardBorder }}>
                <p className="text-xs" style={{ color: SB.muted }}>
                  Member since{" "}
                  <strong style={{ color: SB.ink }}>
                    {new Date(user?.createdAt ?? Date.now()).toLocaleDateString("en-NG", {
                      month: "long",
                      year: "numeric",
                    })}
                  </strong>
                </p>
              </div>
            </section>

            {/* Security Pulse */}
            <section
              className={`rounded-2xl border p-6 transition-all duration-500 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: SB.mint }}
                >
                  <ShieldCheck className="w-4 h-4" style={{ color: SB.ink }} />
                </div>
                <h4 className="text-sm font-extrabold" style={{ color: SB.ink }}>
                  Security & Access
                </h4>
              </div>
              <div className="space-y-4">
                <RowToggle label="Biometric Login" on={biometric} setOn={setBiometric} />
                <div className="border-t" style={{ borderColor: SB.cardBorder }} />
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium" style={{ color: SB.ink }}>
                    Email Verified
                  </span>
                  <div
                    className="flex items-center gap-1 font-bold text-sm"
                    style={{ color: "#1a5c3a" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {user?.emailVerified ? "Verified" : "Pending"}
                  </div>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-xl border text-sm font-bold transition-all hover:bg-[#fcfaf5]"
                  style={{ borderColor: SB.ink, color: SB.ink }}
                  onClick={() => setChangePasswordOpen(true)}
                >
                  Change Password
                </button>
              </div>
            </section>
          </div>

          {/* Right panel */}
          <div className="lg:w-2/3 space-y-5">
            {/* Personal info */}
            <section
              className={`rounded-2xl border overflow-hidden transition-all duration-500 delay-75 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <div
                className="px-6 py-4 border-b flex items-center justify-between"
                style={{
                  backgroundColor: SB.cream,
                  borderColor: SB.cardBorder,
                }}
              >
                <h4 className="text-base font-extrabold" style={{ color: SB.ink }}>
                  Centralized Profile Information
                </h4>
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{ backgroundColor: SB.mint, color: SB.ink }}
                >
                  Official Record
                </span>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Full Legal Name">
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all font-medium"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Enter full name"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Field>
                <Field label="Unique Phone Number">
                  <input
                    type="tel"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+234 800 000 0000"
                  />
                </Field>

                <Field label="Tax Identification Number (TIN)" hint="Verified by FIRS.">
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={tin}
                    onChange={(e) => setTin(e.target.value)}
                    placeholder="e.g. 12345678-0001"
                  />
                </Field>

                <Field label="State of Residence / Tax Jurisdiction">
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={stateOfResidence}
                    onChange={(e) => setStateOfResidence(e.target.value)}
                    placeholder="e.g. Lagos State (LIRS)"
                  />
                </Field>

                <Field label="Employment / Income Category">
                  <input
                    type="text"
                    className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                    style={{
                      backgroundColor: "#f1f1f1",
                      borderColor: SB.cardBorder,
                      color: SB.ink,
                    }}
                    value={employmentStatus}
                    onChange={(e) => setEmploymentStatus(e.target.value)}
                    placeholder="e.g. Employed (PAYE)"
                  />
                </Field>

                {user?.accountType === "organization" ? (
                  <Field label="Organization / Business Name">
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 rounded-xl border text-sm outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderColor: SB.cardBorder,
                        color: SB.ink,
                      }}
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="Business Name"
                    />
                  </Field>
                ) : (
                  <Field label="National Identification Number (NIN)">
                    <input
                      type="text"
                      className="w-full px-3.5 py-3 rounded-xl border text-sm font-mono outline-none focus:ring-2 focus:ring-[#18623f]/20 focus:border-[#18623f] transition-all"
                      style={{
                        backgroundColor: "#f1f1f1",
                        borderColor: SB.cardBorder,
                        color: SB.ink,
                      }}
                      value={nin}
                      onChange={(e) => setNin(e.target.value)}
                      placeholder="11-digit NIN"
                    />
                  </Field>
                )}
              </div>

              <div className="px-6 pb-6 flex justify-end">
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

            {/* Account plan summary */}
            <section
              className={`rounded-2xl border p-6 transition-all duration-500 delay-100 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h4 className="text-sm font-extrabold mb-4" style={{ color: SB.ink }}>
                Account Summary
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Plan", value: planName },
                  { label: "Account Type", value: accountType },
                  {
                    label: "Billing",
                    value: user?.planBillingCycle
                      ? user.planBillingCycle.charAt(0).toUpperCase() +
                        user.planBillingCycle.slice(1)
                      : "—",
                  },
                  {
                    label: "Onboarding Status",
                    value: user?.onboarded ? "Completed" : "In Progress",
                  },
                ].map(({ label, value }) => (
                  <div key={label} className="p-3 rounded-xl" style={{ backgroundColor: SB.cream }}>
                    <p
                      className="text-[9px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: SB.pencil }}
                    >
                      {label}
                    </p>
                    <p className="text-sm font-extrabold" style={{ color: SB.ink }}>
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Danger zone */}
            <section
              className={`rounded-2xl border p-6 transition-all duration-500 delay-150 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                backgroundColor: "#fff9f9",
                borderColor: "rgba(186,26,26,0.20)",
              }}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h5 className="font-extrabold text-sm" style={{ color: "#991b1b" }}>
                    Account Deactivation & Deletion
                  </h5>
                  <p className="text-xs mt-1 max-w-sm" style={{ color: "#b91c1c" }}>
                    Permanently delete your account and all associated tax records. This action
                    cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  className="px-5 py-2 rounded-xl font-bold border-2 text-sm whitespace-nowrap transition-colors hover:bg-red-50"
                  style={{ borderColor: "#991b1b", color: "#991b1b" }}
                  onClick={() => setDeleteAccountOpen(true)}
                >
                  Close Account
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>

      <ChangePasswordModal open={changePasswordOpen} onClose={() => setChangePasswordOpen(false)} />

      <DeleteAccountModal open={deleteAccountOpen} onClose={() => setDeleteAccountOpen(false)} />
    </DashboardShell>
  );
}

export default ProfilePage;
