import { useNavigate , useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import AccountTypeStep from "@/components/onboarding/steps/AccountTypeStep";
import PlanStep from "@/components/onboarding/steps/PlanStep";
import FilingStep from "@/components/onboarding/steps/FilingStep";
import {
  ONBOARDING_STEPS,
  type OnboardingStepId,
} from "@/components/onboarding/onboardingSteps";
import { useAuth, type AccountType, type PlanBillingCycle, type PlanTier } from "@/store/auth";
import { useLoadingStore } from "@/store/loading";
import { notify } from "@/components/Toaster";

const searchSchema = z.object({
  step: z.enum(ONBOARDING_STEPS).optional().catch(undefined),
});

const PROGRESS: Record<OnboardingStepId, number> = {
  account: 33,
  plan: 66,
  filing: 100,
};

function OnboardingPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const user = useAuth((s) => s.user);
  const updateProfile = useAuth((s) => s.updateProfile);
  const updatePlan = useAuth((s) => s.updatePlan);
  const completeOnboarding = useAuth((s) => s.completeOnboarding);

  const parsed = searchSchema.safeParse(Object.fromEntries(searchParams));
  const urlStep = parsed.success ? parsed.data.step : undefined;

  const [step, setStep] = useState<OnboardingStepId>(urlStep ?? "account");
  const [accountType, setAccountType] = useState<AccountType | null>(user?.accountType ?? null);
  const [plan, setPlan] = useState<PlanTier | null>(null);
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>(user?.planBillingCycle ?? "monthly");
  const signupPlan = user?.plan;
  const [tin, setTin] = useState(user?.tin ?? "");
  const [organization, setOrganization] = useState(user?.organization ?? "");
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!user) navigate("/customer-dashboard/login");
    else if (!user.emailVerified) navigate("/customer-dashboard/verify-email");
    else if (user.onboarded) navigate("/customer-dashboard/receipts");
  }, [user, navigate]);

  useEffect(() => {
    if (urlStep && urlStep !== step) setStep(urlStep);
  }, [urlStep]);

  useEffect(() => {
    if (step === "plan" && plan === null && signupPlan) {
      setPlan(signupPlan);
    }
  }, [step, plan, signupPlan]);

  const goTo = (next: OnboardingStepId) => {
    setStep(next);
    navigate("/customer-dashboard/onboarding", { replace: true });
  };

  if (!user) return null;

  const persistDraft = () => {
    updateProfile({
      accountType: accountType ?? undefined,
      tin: tin || undefined,
      organization: organization || undefined,
    });
    if (plan) updatePlan(plan, { billingCycle, accountType: accountType ?? undefined });
  };

  const continueFromAccount = () => {
    if (!accountType) return;
    updateProfile({ accountType });
    goTo("plan");
  };

  const continueFromPlan = () => {
    if (!plan) {
      notify.error("Select a plan", "Choose Free, Deluxe, or Premium to continue.");
      return;
    }
    updatePlan(plan, { billingCycle, accountType: accountType ?? undefined });
    goTo("filing");
  };

  const submitFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};
    if (!accountType) next.accountType = "Account type is required.";
    if (!plan) next.plan = "Please select a subscription plan.";

    if (!tin.trim()) next.tin = "TIN is required for compliance.";
    else if (!/^\d{8,12}$/.test(tin.replace(/-/g, ""))) next.tin = "TIN must be 8–12 digits.";

    if (accountType === "organization" && !organization.trim()) {
      next.organization = "Organization name is required for business accounts.";
    }

    setErrs(next);
    if (Object.keys(next).length || !plan) return;

    const finalPlan = plan;

    setBusy(true);
    useLoadingStore.getState().showLoader("Verifying TIN & securing your profile…");
    try {
      await new Promise((r) => setTimeout(r, 1200));
      updateProfile({
        tin: tin.trim(),
        organization: organization.trim() || undefined,
        accountType: accountType ?? undefined,
      });
      updatePlan(finalPlan, { billingCycle, accountType: accountType ?? undefined });
      completeOnboarding();
      notify.success("You're all set", "Your tax compliance profile is active.");
      navigate("/customer-dashboard/receipts");
    } catch {
      notify.error("Verification failed", "Please try again in a moment.");
    } finally {
      setBusy(false);
      useLoadingStore.getState().hideLoader();
    }
  };

  return (
    <OnboardingShell currentStep={step} progressPercent={PROGRESS[step]} onSaveExit={persistDraft}>
      {step === "account" && (
        <AccountTypeStep
          value={accountType}
          onChange={setAccountType}
          onContinue={continueFromAccount}
          busy={busy}
        />
      )}
      {step === "plan" && (
        <PlanStep
          value={plan}
          billing={billingCycle}
          signupPlan={signupPlan}
          onSelect={setPlan}
          onBillingChange={setBillingCycle}
          onContinue={continueFromPlan}
          onBack={() => goTo("account")}
        />
      )}
      {step === "filing" && accountType && (
        <FilingStep
          accountType={accountType}
          tin={tin}
          organization={organization}
          errors={errs}
          busy={busy}
          onTinChange={setTin}
          onOrgChange={setOrganization}
          onBack={() => goTo("plan")}
          onSubmit={submitFiling}
        />
      )}
      {step === "filing" && !accountType && (
        <p className="text-center text-sm" style={{ color: "#404944" }}>
          Please complete account type first.{" "}
          <button type="button" className="font-bold underline" onClick={() => goTo("account")}>
            Go back
          </button>
        </p>
      )}
    </OnboardingShell>
  );
}

export default OnboardingPage;
