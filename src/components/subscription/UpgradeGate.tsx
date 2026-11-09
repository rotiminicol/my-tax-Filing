import React from "react";
import { Link } from "react-router-dom";
import { Lock, Zap } from "lucide-react";
import { useAuth } from "@/store/auth";
import { canAccess, getRequiredPlan, PLAN_LABELS } from "@/lib/featureAccess";
import type { FeatureKey } from "@/lib/featureAccess";
import type { PlanTier } from "@/store/auth";

const SB = {
  ink: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
};

interface UpgradeGateProps {
  feature: FeatureKey;
  /** Override the required plan label shown to the user */
  requiredPlanOverride?: PlanTier;
  /** Content to render when access is allowed */
  children: React.ReactNode;
  /** Optional custom fallback instead of the default upgrade card */
  fallback?: React.ReactNode;
  /** Render as inline (small pill) instead of full card */
  inline?: boolean;
}

export function UpgradeGate({
  feature,
  requiredPlanOverride,
  children,
  fallback,
  inline,
}: UpgradeGateProps) {
  const plan = useAuth((s) => s.user?.plan ?? null) as PlanTier | null;
  const allowed = canAccess(feature, plan);

  if (allowed) return <>{children}</>;

  const required = requiredPlanOverride ?? getRequiredPlan(feature);
  const requiredLabel = PLAN_LABELS[required] ?? required;

  if (fallback) return <>{fallback}</>;

  if (inline) {
    return (
      <span
        className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold"
        style={{ background: SB.yellow, color: SB.ink }}
        title={`Requires ${requiredLabel} plan`}
      >
        <Lock size={10} />
        {requiredLabel}
      </span>
    );
  }

  return (
    <div
      className="rounded-2xl border p-6 flex flex-col items-center text-center gap-3"
      style={{ background: SB.cream, borderColor: SB.cardBorder }}
    >
      <div className="rounded-full p-3" style={{ background: SB.mint }}>
        <Lock size={22} style={{ color: SB.ink }} />
      </div>
      <div>
        <p className="font-bold text-base" style={{ color: SB.ink }}>
          {requiredLabel} Plan Required
        </p>
        <p className="text-sm mt-1" style={{ color: SB.muted }}>
          This feature is available on the <strong>{requiredLabel}</strong> plan and above.
        </p>
      </div>
      <Link
        to="/customer-dashboard/subscription"
        className="inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-black uppercase tracking-wide transition hover:opacity-90"
        style={{ background: SB.yellow, color: SB.ink }}
      >
        <Zap size={15} />
        Upgrade to {requiredLabel}
      </Link>
    </div>
  );
}

export default UpgradeGate;
