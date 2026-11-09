import type { PlanTier } from "@/store/auth";

export type FeatureKey =
  | "receipt-generate"
  | "batch-receipts"
  | "vat-filing"
  | "wht-automation"
  | "invoice-create"
  | "invoice-templates"
  | "document-renewal"
  | "tax-consultant"
  | "analytics-advanced"
  | "api-access"
  | "batch-import-excel"
  | "compliance-health-check"
  | "priority-support"
  | "tin-verification"
  | "audit-documents"
  | "paye-filing"
  | "withholding-tax";

export type FeatureAccess =
  | "allowed" // fully allowed, no limit
  | "limited" // allowed up to a monthly count
  | "blocked"; // not available on this plan

export interface FeaturePolicy {
  access: FeatureAccess;
  limit?: number; // only when access === "limited", monthly count
  upgradeRequired?: PlanTier; // minimum plan needed
}

/** Full feature × plan matrix */
export const FEATURE_MATRIX: Record<FeatureKey, Record<PlanTier, FeaturePolicy>> = {
  "receipt-generate": {
    free: { access: "limited", limit: 5, upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "batch-receipts": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "limited", limit: 50, upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "vat-filing": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "wht-automation": {
    free: { access: "blocked", upgradeRequired: "premium" },
    deluxe: { access: "blocked", upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "invoice-create": {
    free: { access: "limited", limit: 3, upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "invoice-templates": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "document-renewal": {
    free: { access: "limited", limit: 1, upgradeRequired: "deluxe" },
    deluxe: { access: "limited", limit: 5, upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "tax-consultant": {
    free: { access: "blocked", upgradeRequired: "premium" },
    deluxe: { access: "blocked", upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "analytics-advanced": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "limited", limit: 1 }, // basic analytics
    premium: { access: "allowed" },
  },
  "api-access": {
    free: { access: "blocked", upgradeRequired: "premium" },
    deluxe: { access: "blocked", upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "batch-import-excel": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "compliance-health-check": {
    free: { access: "blocked", upgradeRequired: "premium" },
    deluxe: { access: "blocked", upgradeRequired: "premium" },
    premium: { access: "allowed" },
  },
  "priority-support": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "tin-verification": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "audit-documents": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "paye-filing": {
    free: { access: "limited", limit: 1, upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
  "withholding-tax": {
    free: { access: "blocked", upgradeRequired: "deluxe" },
    deluxe: { access: "allowed" },
    premium: { access: "allowed" },
  },
};

/** Get the feature policy for a plan */
export function getFeaturePolicy(
  feature: FeatureKey,
  plan: PlanTier | null | undefined,
): FeaturePolicy {
  const tier: PlanTier = plan ?? "free";
  return FEATURE_MATRIX[feature]?.[tier] ?? { access: "blocked", upgradeRequired: "deluxe" };
}

/** Check if a plan can access a feature at all */
export function canAccess(feature: FeatureKey, plan: PlanTier | null | undefined): boolean {
  const policy = getFeaturePolicy(feature, plan);
  return policy.access !== "blocked";
}

/** Get usage limit for a feature+plan combo, null = unlimited */
export function getLimit(feature: FeatureKey, plan: PlanTier | null | undefined): number | null {
  const policy = getFeaturePolicy(feature, plan);
  if (policy.access === "blocked") return 0;
  if (policy.access === "limited") return policy.limit ?? 0;
  return null; // unlimited
}

/** Get the minimum plan required to access a feature */
export function getRequiredPlan(feature: FeatureKey): PlanTier {
  const order: PlanTier[] = ["free", "deluxe", "premium"];
  for (const tier of order) {
    if (FEATURE_MATRIX[feature]?.[tier]?.access !== "blocked") return tier;
  }
  return "premium";
}

export const PLAN_LABELS: Record<PlanTier, string> = {
  free: "Free",
  deluxe: "Deluxe",
  premium: "Premium",
};
