import { Building2, FileCheck, Hash, Loader2, Shield, MapPin, Briefcase } from "lucide-react";
import type { AccountType } from "@/store/auth";
import AuthInput from "@/components/auth/AuthInput";
import AppSelect from "@/components/ui/AppSelect";
import { fiscal } from "@/components/fiscal-landing/tokens";

interface Props {
  accountType: AccountType;
  tin: string;
  nin: string;
  organization: string;
  stateOfResidence: string;
  employmentStatus: string;
  errors: Record<string, string>;
  busy: boolean;
  onTinChange: (v: string) => void;
  onNinChange: (v: string) => void;
  onOrgChange: (v: string) => void;
  onStateChange: (v: string) => void;
  onEmploymentChange: (v: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

const STATE_OPTIONS = [
  { value: "Lagos State (LIRS)", label: "Lagos State (LIRS)" },
  { value: "Federal Capital Territory (FCT-IRS)", label: "FCT Abuja (FCT-IRS / FIRS)" },
  { value: "Rivers State (RIRS)", label: "Rivers State (RIRS)" },
  { value: "Ogun State (OGIRS)", label: "Ogun State (OGIRS)" },
  { value: "Oyo State (OYSIRS)", label: "Oyo State (OYSIRS)" },
  { value: "Kano State (KIRS)", label: "Kano State (KIRS)" },
  { value: "Kaduna State (KADIRS)", label: "Kaduna State (KADIRS)" },
  { value: "Delta State (DBIR)", label: "Delta State (DBIR)" },
  { value: "Edo State (EIRS)", label: "Edo State (EIRS)" },
  { value: "Enugu State (ESIRS)", label: "Enugu State (ESIRS)" },
  { value: "Anambra State (AIRS)", label: "Anambra State (AIRS)" },
  { value: "Akwa Ibom State (AKIRS)", label: "Akwa Ibom State (AKIRS)" },
  { value: "Other Nigerian State", label: "Other Nigerian State" },
];

const EMPLOYMENT_OPTIONS = [
  { value: "Employed (PAYE)", label: "Employed / Salaried (PAYE)" },
  { value: "Self-Employed / Freelancer", label: "Self-Employed / Freelancer / Consultant" },
  { value: "Business Owner / Enterprise", label: "Business Owner / MSME Enterprise" },
  { value: "Property Owner / Landlord", label: "Property Owner / Landlord (Rental Income)" },
  { value: "Corporate Director", label: "Company Director / Shareholder" },
];

export default function FilingStep({
  accountType,
  tin,
  nin,
  organization,
  stateOfResidence,
  employmentStatus,
  errors,
  busy,
  onTinChange,
  onNinChange,
  onOrgChange,
  onStateChange,
  onEmploymentChange,
  onBack,
  onSubmit,
}: Props) {
  const isOrg = accountType === "organization";

  return (
    <>
      <section className="max-w-2xl w-full text-center space-y-4 mb-10">
        <div
          className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-2"
          style={{ backgroundColor: fiscal.primaryFixed, color: fiscal.primaryContainer }}
        >
          <FileCheck className="w-8 h-8" />
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold tracking-tight"
          style={{ color: fiscal.primary }}
        >
          Complete your filing profile
        </h1>
        <p className="text-lg" style={{ color: fiscal.onSurfaceVariant }}>
          Add your tax and jurisdictional details so we can generate compliant receipts and sync
          with Nigerian tax authorities.
        </p>
      </section>

      <div className="w-full max-w-xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div
            className="rounded-xl border p-6 space-y-5"
            style={{
              borderColor: `${fiscal.outlineVariant}4D`,
              backgroundColor: fiscal.surfaceContainerLowest,
            }}
          >
            <AuthInput
              label="Tax Identification Number (TIN)"
              placeholder="e.g. 12345678-0001"
              value={tin}
              onChange={(e) => onTinChange(e.target.value)}
              error={errors.tin}
              autoComplete="off"
            />

            {!isOrg && (
              <AuthInput
                label="National Identification Number (NIN)"
                placeholder="11-digit NIN"
                value={nin}
                onChange={(e) => onNinChange(e.target.value)}
                error={errors.nin}
                autoComplete="off"
              />
            )}

            {isOrg && (
              <AuthInput
                label="Organization / Business name"
                placeholder="e.g. Lagos Property Holdings Ltd"
                value={organization}
                onChange={(e) => onOrgChange(e.target.value)}
                error={errors.organization}
              />
            )}

            <div className="space-y-1.5">
              <label
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: fiscal.onSurfaceVariant }}
              >
                <MapPin className="w-3.5 h-3.5" style={{ color: fiscal.primary }} />
                Tax Jurisdiction / State of Residence
              </label>
              <AppSelect
                value={stateOfResidence}
                onValueChange={onStateChange}
                placeholder="Select State or Tax Office"
                options={STATE_OPTIONS}
              />
              {errors.state && (
                <p className="text-xs font-semibold text-red-600 mt-1">{errors.state}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                style={{ color: fiscal.onSurfaceVariant }}
              >
                <Briefcase className="w-3.5 h-3.5" style={{ color: fiscal.primary }} />
                Employment &amp; Income Category
              </label>
              <AppSelect
                value={employmentStatus}
                onValueChange={onEmploymentChange}
                placeholder="Select Employment Category"
                options={EMPLOYMENT_OPTIONS}
              />
            </div>
          </div>

          <div className="grid gap-3">
            {[
              {
                icon: Hash,
                text: "TIN is recorded and linked directly to your Supabase compliance record.",
              },
              {
                icon: Shield,
                text: "Your financial credentials are encrypted with 256-bit AES standards.",
              },
              ...(isOrg
                ? [
                    {
                      icon: Building2,
                      text: "Business accounts unlock WHT, VAT, and corporate filing dashboards.",
                    },
                  ]
                : [
                    {
                      icon: FileCheck,
                      text: "Individual accounts can generate rent receipts and file PIT immediately.",
                    },
                  ]),
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 p-4 rounded-lg text-sm"
                style={{
                  backgroundColor: "rgba(255,255,255,0.6)",
                  borderColor: `${fiscal.outlineVariant}33`,
                  borderWidth: 1,
                }}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: fiscal.primary }} />
                <span style={{ color: fiscal.onSurfaceVariant }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={onBack}
              className="text-sm font-bold hover:underline"
              style={{ color: fiscal.primary }}
            >
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="w-full sm:w-auto px-12 py-4 font-bold rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-transform active:scale-95"
              style={{
                backgroundColor: fiscal.secondaryContainer,
                color: fiscal.onSecondaryContainer,
              }}
            >
              {busy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Securing Profile…
                </>
              ) : (
                "Finish setup & enter dashboard"
              )}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
