import { useCallback } from "react";
import { useAuth } from "@/store/auth";
import { supabase } from "@/integrations/supabase/client";
import { canAccess, getLimit, getRequiredPlan } from "@/lib/featureAccess";
import type { FeatureKey } from "@/lib/featureAccess";
import type { PlanTier } from "@/store/auth";

/**
 * Synchronous feature access check using the user's current plan.
 * Does not query the DB — use this for simple gate checks.
 */
export function useCanAccess(feature: FeatureKey): boolean {
  const plan = useAuth((s) => s.user?.plan ?? null);
  return canAccess(feature, plan as PlanTier | null);
}

/**
 * Returns whether user is allowed, what their limit is, and a function to
 * increment usage (calls the DB RPC).
 */
export function useFeatureAccess(feature: FeatureKey) {
  const plan = useAuth((s) => s.user?.plan ?? null) as PlanTier | null;
  const allowed = canAccess(feature, plan);
  const limit = getLimit(feature, plan);
  const requiredPlan = getRequiredPlan(feature);

  const incrementUsage = useCallback(async (): Promise<number> => {
    const { data, error } = await supabase.rpc(
      "increment_feature_usage" as never,
      { p_feature: feature } as never,
    );
    if (error) throw error;
    return (data as number) ?? 0;
  }, [feature]);

  const getUsage = useCallback(async (): Promise<number> => {
    const { data, error } = await supabase.rpc(
      "get_feature_usage" as never,
      { p_feature: feature } as never,
    );
    if (error) throw error;
    return (data as number) ?? 0;
  }, [feature]);

  return { allowed, limit, requiredPlan, incrementUsage, getUsage };
}
