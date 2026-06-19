import { Building2, CheckCircle, Lock, User } from "lucide-react";
import type { AccountType } from "@/store/auth";
import { fiscal } from "@/components/fiscal-landing/tokens";

const OPTIONS: {
  id: AccountType;
  title: string;
  description: string;
  icon: typeof User;
  iconBg: string;
  iconColor: string;
  checkColor: string;
  perks: string[];
}[] = [
  {
    id: "individual",
    title: "Individual/Tenant",
    description: "Perfect for employees, freelancers, or residents filing personal income tax or seeking tax relief.",
    icon: User,
    iconBg: fiscal.primaryFixed,
    iconColor: fiscal.primary,
    checkColor: fiscal.primary,
    perks: ["Simple Personal Income Tax (PIT)", "Rent-based tax deductions", "Direct e-filing to state authorities"],
  },
  {
    id: "organization",
    title: "Business/Landlord",
    description: "Designed for companies, property owners, and organizations managing corporate compliance.",
    icon: Building2,
    iconBg: fiscal.secondaryFixed,
    iconColor: fiscal.secondary,
    checkColor: fiscal.secondary,
    perks: ["VAT and Corporate Tax filings", "Withholding Tax (WHT) management", "Property income dashboards"],
  },
];

interface Props {
  value: AccountType | null;
  onChange: (type: AccountType) => void;
  onContinue: () => void;
  busy?: boolean;
}

export default function AccountTypeStep({ value, onChange, onContinue, busy }: Props) {
  return (
    <>
      <section className="max-w-4xl w-full text-center space-y-4 mb-8">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight" style={{ color: fiscal.primary }}>
          Let&apos;s get started
        </h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: fiscal.onSurfaceVariant }}>
          Select the account type that best describes your filing status. This helps us tailor the experience to your
          specific tax obligations.
        </p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-10">
        {OPTIONS.map((opt) => {
          const selected = value === opt.id;
          const Icon = opt.icon;
          return (
            <label key={opt.id} className="group relative cursor-pointer">
              <input
                type="radio"
                name="account_type"
                className="sr-only"
                checked={selected}
                onChange={() => onChange(opt.id)}
              />
              <div
                className={`h-full p-8 rounded-xl border-2 transition-all duration-300 group-hover:shadow-lg group-hover:-translate-y-1 ${
                  selected ? "ring-2" : ""
                }`}
                style={{
                  backgroundColor: fiscal.surfaceContainerLowest,
                  borderColor: selected ? fiscal.primaryContainer : `${fiscal.outlineVariant}4D`,
                  boxShadow: selected ? `0 0 0 2px ${fiscal.primaryContainer}33` : undefined,
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3"
                  style={{ backgroundColor: opt.iconBg, color: opt.iconColor }}
                >
                  <Icon className="w-9 h-9" />
                </div>
                <h3 className="text-xl font-semibold mb-2" style={{ color: fiscal.primary }}>
                  {opt.title}
                </h3>
                <p className="text-base mb-6" style={{ color: fiscal.onSurfaceVariant }}>
                  {opt.description}
                </p>
                <ul className="space-y-3 text-left">
                  {opt.perks.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm font-medium">
                      <CheckCircle className="w-4 h-4 shrink-0" style={{ color: opt.checkColor }} />
                      {p}
                    </li>
                  ))}
                </ul>
                {selected && (
                  <div
                    className="absolute top-6 right-6 rounded-full p-1 text-white"
                    style={{ backgroundColor: fiscal.primaryContainer }}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </div>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="w-full max-w-4xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3 text-sm" style={{ color: fiscal.onSurfaceVariant }}>
          <Lock className="w-4 h-4" />
          Your data is secured with AES-256 encryption.
        </div>
        <button
          type="button"
          disabled={!value || busy}
          onClick={onContinue}
          className="w-full md:w-auto px-12 py-4 font-bold rounded-lg text-lg transition-all active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            backgroundColor: value ? fiscal.primary : fiscal.outlineVariant,
            color: "#fff",
          }}
        >
          {busy ? "Continuing…" : "Continue"}
        </button>
      </div>
    </>
  );
}
