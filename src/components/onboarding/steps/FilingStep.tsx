import { Building2, FileCheck, Hash, Loader2, Shield } from "lucide-react";
import type { AccountType } from "@/store/auth";
import AuthInput from "@/components/auth/AuthInput";
import { fiscal } from "@/components/fiscal-landing/tokens";

interface Props {
  accountType: AccountType;
  tin: string;
  organization: string;
  errors: Record<string, string>;
  busy: boolean;
  onTinChange: (v: string) => void;
  onOrgChange: (v: string) => void;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function FilingStep({
  accountType,
  tin,
  organization,
  errors,
  busy,
  onTinChange,
  onOrgChange,
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
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: fiscal.primary }}>
          Complete your filing profile
        </h1>
        <p className="text-lg" style={{ color: fiscal.onSurfaceVariant }}>
          Add your Tax Identification Number so we can generate compliant receipts and sync with Nigerian tax
          authorities.
        </p>
      </section>

      <div className="w-full max-w-xl">
        <form onSubmit={onSubmit} className="flex flex-col gap-6">
          <div
            className="rounded-xl border p-6 space-y-4"
            style={{ borderColor: `${fiscal.outlineVariant}4D`, backgroundColor: fiscal.surfaceContainerLowest }}
          >
            <AuthInput
              label="Tax Identification Number (TIN)"
              placeholder="e.g. 12345678-0001"
              value={tin}
              onChange={(e) => onTinChange(e.target.value)}
              error={errors.tin}
              autoComplete="off"
            />

            {isOrg && (
              <AuthInput
                label="Organization / Business name"
                placeholder="e.g. Lagos Property Holdings Ltd"
                value={organization}
                onChange={(e) => onOrgChange(e.target.value)}
                error={errors.organization}
              />
            )}
          </div>

          <div className="grid gap-3">
            {[
              { icon: Hash, text: "TIN is validated against FCT-IRS records (demo mode simulates approval)." },
              { icon: Shield, text: "Your credentials are encrypted and never shared without consent." },
              ...(isOrg
                ? [{ icon: Building2, text: "Business accounts unlock WHT and corporate filing tools in your dashboard." }]
                : [{ icon: FileCheck, text: "Individual accounts can file PIT and store rent receipts immediately." }]),
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-start gap-3 p-4 rounded-lg text-sm"
                style={{ backgroundColor: "rgba(255,255,255,0.6)", borderColor: `${fiscal.outlineVariant}33`, borderWidth: 1 }}
              >
                <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: fiscal.primary }} />
                <span style={{ color: fiscal.onSurfaceVariant }}>{text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button type="button" onClick={onBack} className="text-sm font-bold hover:underline" style={{ color: fiscal.primary }}>
              Back
            </button>
            <button
              type="submit"
              disabled={busy}
              className="w-full sm:w-auto px-12 py-4 font-bold rounded-lg text-white flex items-center justify-center gap-2 disabled:opacity-60"
              style={{ backgroundColor: fiscal.secondaryContainer, color: fiscal.onSecondaryContainer }}
            >
              {busy ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Verifying…
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
