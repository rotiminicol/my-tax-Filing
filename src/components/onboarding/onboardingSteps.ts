export const ONBOARDING_STEPS = ["account", "plan", "filing"] as const;
export type OnboardingStepId = (typeof ONBOARDING_STEPS)[number];

export const STEP_LABELS: Record<OnboardingStepId, string> = {
  account: "Profile",
  plan: "Subscription",
  filing: "Filing",
};

export function stepIndex(id: OnboardingStepId): number {
  return ONBOARDING_STEPS.indexOf(id);
}
