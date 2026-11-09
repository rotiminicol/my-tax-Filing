import { useEffect, useState } from "react";
import { useFeatureAccess } from "@/hooks/useFeatureAccess";
import type { FeatureKey } from "@/lib/featureAccess";

const SB = {
  ink: "#18623f",
  mint: "#d5f5c2",
  yellow: "#ffe95c",
  muted: "#6b6b6b",
};

interface UsageIndicatorProps {
  feature: FeatureKey;
  label?: string;
  className?: string;
}

export function UsageIndicator({ feature, label, className }: UsageIndicatorProps) {
  const { limit, getUsage } = useFeatureAccess(feature);
  const [used, setUsed] = useState<number | null>(null);

  useEffect(() => {
    if (limit !== null) {
      getUsage()
        .then(setUsed)
        .catch(() => setUsed(null));
    }
  }, [feature, limit, getUsage]);

  if (limit === null || limit === 0) return null;
  if (used === null) return null;

  const pct = Math.min(100, Math.round((used / limit) * 100));
  const isWarning = pct >= 80;
  const isFull = pct >= 100;

  const barColor = isFull ? "#ef4444" : isWarning ? "#f59e0b" : SB.ink;

  return (
    <div className={className}>
      <div className="flex justify-between text-xs mb-1" style={{ color: SB.muted }}>
        <span>{label ?? feature}</span>
        <span style={{ color: isFull ? "#ef4444" : SB.muted }}>
          {used}/{limit} used
        </span>
      </div>
      <div className="rounded-full h-1.5 w-full" style={{ background: SB.mint }}>
        <div
          className="rounded-full h-1.5 transition-all"
          style={{ width: `${pct}%`, background: barColor }}
        />
      </div>
      {isFull && <p className="text-xs mt-1 text-red-500">Limit reached. Upgrade to continue.</p>}
    </div>
  );
}

export default UsageIndicator;
