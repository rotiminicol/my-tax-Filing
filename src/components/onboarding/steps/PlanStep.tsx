import { CheckCircle } from "lucide-react";
import type { PlanBillingCycle, PlanTier } from "@/store/auth";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { getPlanPrice } from "@/lib/planConfig";

const PLANS: {
  id: PlanTier;
  name: string;
  tagline: string;
  features: string[];
  featured?: boolean;
  accent?: "secondary" | "primary";
}[] = [
  {
    id: "free",
    name: "Free",
    tagline: "For individual contractors",
    features: ["Basic PIT filing", "Tax receipt storage (50MB)", "Email support (48h)"],
    accent: "primary",
  },
  {
    id: "deluxe",
    name: "Deluxe",
    tagline: "Perfect for growing SMEs",
    featured: true,
    accent: "secondary",
    features: [
      "Unlimited VAT & PIT filing",
      "Audit-ready documentation",
      "Priority chat support",
      "TIN verification service",
    ],
  },
  {
    id: "premium",
    name: "Premium",
    tagline: "Corporate-grade compliance",
    features: [
      "Dedicated Tax Consultant",
      "Withholding Tax (WHT) automation",
      "API access for payroll",
      "Compliance health-checks",
    ],
    accent: "primary",
  },
];

interface Props {
  value: PlanTier | null;
  billing: PlanBillingCycle;
  signupPlan?: PlanTier | null;
  onSelect: (plan: PlanTier) => void;
  onBillingChange: (billing: PlanBillingCycle) => void;
  onContinue: () => void;
  onBack: () => void;
}

export default function PlanStep({
  value,
  billing,
  signupPlan,
  onSelect,
  onBillingChange,
  onContinue,
  onBack,
}: Props) {
  return (
    <>
      <header className="text-center max-w-3xl mx-auto mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4" style={{ color: fiscal.onSurface }}>
          Choose your growth path
        </h1>
        <p className="text-lg" style={{ color: fiscal.onSurfaceVariant }}>
          Select the plan that fits your financial scale. Your choice is saved to your account and shown on the
          dashboard.
        </p>
        <div
          className="mt-8 inline-flex items-center p-1 rounded-full border"
          style={{ backgroundColor: fiscal.surfaceContainerLow, borderColor: `${fiscal.outlineVariant}4D` }}
        >
          <button
            type="button"
            onClick={() => onBillingChange("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
              billing === "monthly" ? "bg-white shadow-sm" : ""
            }`}
            style={{ color: billing === "monthly" ? fiscal.primary : fiscal.onSurfaceVariant }}
          >
            Monthly
          </button>
          <button
            type="button"
            onClick={() => onBillingChange("annual")}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
              billing === "annual" ? "bg-white shadow-sm" : ""
            }`}
            style={{ color: billing === "annual" ? fiscal.primary : fiscal.onSurfaceVariant }}
          >
            Annual
            <span
              className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: fiscal.secondaryContainer, color: fiscal.onSecondaryContainer }}
            >
              Save 20%
            </span>
          </button>
        </div>
      </header>

      {signupPlan && value !== signupPlan && (
        <p
          className="text-center text-sm font-medium mb-6 max-w-xl mx-auto px-4 py-3 rounded-lg border"
          style={{ borderColor: fiscal.secondaryContainer, backgroundColor: `${fiscal.secondaryFixed}66` }}
        >
          You started signup on <strong>{signupPlan}</strong>   tap any plan below to change your selection.
        </p>
      )}

      {!value && (
        <p className="text-center text-sm font-medium mb-6" style={{ color: fiscal.onSurfaceVariant }}>
          Select a plan to continue.
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-[1280px] items-stretch mb-10">
        {PLANS.map((plan) => {
          const selected = value === plan.id;
          const price = getPlanPrice(plan.id, billing);
          const isFeatured = plan.featured;

          return (
            <button
              key={plan.id}
              type="button"
              onClick={() => onSelect(plan.id)}
              className={`relative flex flex-col p-8 rounded-xl border text-left transition-transform duration-300 hover:scale-[1.02] ${
                isFeatured ? "border-2 shadow-lg ring-4" : "border"
              }`}
              style={{
                background: "rgba(255, 255, 255, 0.8)",
                backdropFilter: "blur(12px)",
                borderColor: selected ? fiscal.primaryContainer : isFeatured ? fiscal.secondary : "#E2E8F0",
                boxShadow: selected
                  ? `0 0 0 3px ${fiscal.primaryContainer}33`
                  : isFeatured
                    ? `0 0 0 4px ${fiscal.secondaryContainer}1A`
                    : undefined,
              }}
            >
              {isFeatured && (
                <div
                  className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wider text-white pointer-events-none"
                  style={{ backgroundColor: fiscal.secondary }}
                >
                  Most Popular
                </div>
              )}
              {selected && (
                <div
                  className="absolute top-4 right-4 rounded-full p-1 text-white pointer-events-none"
                  style={{ backgroundColor: fiscal.primaryContainer }}
                >
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-1">{plan.name}</h3>
                <p className="text-sm" style={{ color: fiscal.onSurfaceVariant }}>
                  {plan.tagline}
                </p>
              </div>
              <div className="mb-6">
                <span className="text-4xl font-bold">{price}</span>
                <span className="text-sm font-medium" style={{ color: fiscal.onSurfaceVariant }}>
                  /month
                </span>
                {billing === "annual" && plan.id !== "free" && (
                  <p className="text-xs mt-1" style={{ color: fiscal.onSurfaceVariant }}>
                    Billed annually
                  </p>
                )}
              </div>
              <ul className="space-y-4 mb-4 flex-grow">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm" style={{ color: fiscal.onSurfaceVariant }}>
                    <CheckCircle
                      className="w-4 h-4 shrink-0 mt-0.5"
                      style={{ color: plan.accent === "secondary" ? fiscal.secondary : fiscal.primary }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <span
                className="w-full py-3 font-bold rounded-lg text-sm text-center block"
                style={
                  selected
                    ? { backgroundColor: fiscal.primary, color: "#fff" }
                    : isFeatured
                      ? { backgroundColor: fiscal.secondary, color: "#fff" }
                      : plan.id === "premium"
                        ? { backgroundColor: fiscal.primary, color: "#fff" }
                        : { border: `1px solid ${fiscal.primary}`, color: fiscal.primary }
                }
              >
                {selected ? "Selected" : `Select ${plan.name}`}
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full max-w-[1280px]">
        <button type="button" onClick={onBack} className="text-sm font-bold hover:underline" style={{ color: fiscal.primary }}>
          Back
        </button>
        <button
          type="button"
          disabled={!value}
          onClick={onContinue}
          className="px-12 py-4 font-bold rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: fiscal.primary }}
        >
          Continue with {value ? value.charAt(0).toUpperCase() + value.slice(1) : "plan"}
        </button>
      </div>
    </>
  );
}
