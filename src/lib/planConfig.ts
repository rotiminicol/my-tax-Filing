import type { AccountType, PlanBillingCycle, PlanTier } from "@/store/auth";

export const PLAN_ORDER: PlanTier[] = ["free", "deluxe", "premium"];

export const PLAN_PRICES: Record<
  PlanBillingCycle,
  Record<Exclude<PlanTier, "free">, string> & { free: string }
> = {
  monthly: { free: "₦0", deluxe: "₦12,500", premium: "₦45,000" },
  annual: { free: "₦0", deluxe: "₦10,000", premium: "₦36,000" },
};

export function planDisplayName(plan: PlanTier | null | undefined): string {
  if (!plan || plan === "free") return "Free";
  return plan.charAt(0).toUpperCase() + plan.slice(1);
}

export function formatPlanSummary(
  plan: PlanTier | null | undefined,
  billing?: PlanBillingCycle | null,
): string {
  const name = planDisplayName(plan);
  if (!plan || plan === "free") return `${name} plan`;
  const cycle = billing === "annual" ? "Annual" : "Monthly";
  return `${name} · ${cycle}`;
}

export function getPlanPrice(plan: PlanTier, billing: PlanBillingCycle): string {
  return PLAN_PRICES[billing][plan];
}

export function getPlanPerks(plan: PlanTier, accountType: AccountType | null | undefined): {
  title: string;
  desc: string;
  perks: string[];
} {
  const p = plan || "free";
  const t = accountType || "individual";
  const key = `${p}_${t}`;

  const details: Record<string, { title: string; desc: string; perks: string[] }> = {
    free_individual: {
      title: "Free Individual Filing Profile",
      desc: "Basic PIT filing and receipt storage for personal use.",
      perks: ["Basic PIT filing", "Tax receipt storage (50MB)", "Email support (48h)"],
    },
    free_organization: {
      title: "Free Organization Portal",
      desc: "Starter workspace for property managers.",
      perks: ["Single-agent access", "Basic agency validation", "Standard layout templates"],
    },
    deluxe_individual: {
      title: "Deluxe Individual Account",
      desc: "Unlimited personal filings with priority support.",
      perks: ["Unlimited VAT & PIT filing", "Audit-ready documentation", "Priority chat support", "TIN verification"],
    },
    deluxe_organization: {
      title: "Deluxe Organization Workspace",
      desc: "Growing SMEs with multi-unit compliance tools.",
      perks: ["Unlimited VAT & PIT filing", "WHT management", "Property income dashboards", "Priority support"],
    },
    premium_individual: {
      title: "Premium Individual Protection",
      desc: "Dedicated consultant and advanced automation.",
      perks: ["Dedicated Tax Consultant", "WHT automation", "API access for payroll", "Compliance health-checks"],
    },
    premium_organization: {
      title: "Premium Enterprise Organization",
      desc: "Corporate-grade compliance at scale.",
      perks: ["Dedicated Tax Consultant", "WHT automation", "API access for payroll", "Compliance health-checks"],
    },
  };

  return details[key] ?? details.free_individual;
}
