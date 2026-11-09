import type { PlanTier } from "@/store/auth";

const BADGE_STYLES: Record<PlanTier, { bg: string; color: string; label: string }> = {
  free: { bg: "#e5e7eb", color: "#374151", label: "Free" },
  deluxe: { bg: "#ffe95c", color: "#18623f", label: "Deluxe" },
  premium: { bg: "#d5f5c2", color: "#18623f", label: "Premium" },
};

interface PlanBadgeProps {
  plan: PlanTier | null | undefined;
  size?: "sm" | "md";
}

export function PlanBadge({ plan, size = "md" }: PlanBadgeProps) {
  const tier: PlanTier = plan ?? "free";
  const { bg, color, label } = BADGE_STYLES[tier];
  const cls =
    size === "sm"
      ? "text-xs px-2 py-0.5 rounded-full font-semibold"
      : "text-sm px-3 py-1 rounded-full font-bold";

  return (
    <span className={cls} style={{ background: bg, color }}>
      {label}
    </span>
  );
}

export default PlanBadge;
