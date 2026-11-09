import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { z } from "zod";
import OnboardingShell from "@/components/onboarding/OnboardingShell";
import AccountTypeStep from "@/components/onboarding/steps/AccountTypeStep";
import PlanStep from "@/components/onboarding/steps/PlanStep";
import FilingStep from "@/components/onboarding/steps/FilingStep";
import { ONBOARDING_STEPS, type OnboardingStepId } from "@/components/onboarding/onboardingSteps";
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
  const saveOnboardingProgress = useAuth((s) => s.saveOnboardingProgress);
  const completeOnboarding = useAuth((s) => s.completeOnboarding);

  const parsed = searchSchema.safeParse(Object.fromEntries(searchParams));
  const urlStep = parsed.success ? parsed.data.step : undefined;

  // Determine starting step based on URL or saved database progress
  const initialStep: OnboardingStepId =
    urlStep ??
    ((user?.onboardingStep as OnboardingStepId) ||
      (user?.accountType ? (user?.plan ? "filing" : "plan") : "account"));

  const [step, setStep] = useState<OnboardingStepId>(initialStep);
  const [accountType, setAccountType] = useState<AccountType | null>(user?.accountType ?? null);
  const [plan, setPlan] = useState<PlanTier | null>(user?.plan ?? null);
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>(
    user?.planBillingCycle ?? "monthly",
  );
  const [tin, setTin] = useState(user?.tin ?? "");
  const [organization, setOrganization] = useState(user?.organization ?? "");
  const [nin, setNin] = useState(user?.nin ?? "");
  const [stateOfResidence, setStateOfResidence] = useState(
    user?.stateOfResidence ?? "Lagos State (LIRS)",
  );
  const [employmentStatus, setEmploymentStatus] = useState(
    user?.employmentStatus ?? "Employed (PAYE)",
  );
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  // Sync profile data when user changes
  useEffect(() => {
    if (user) {
      if (!accountType && user.accountType) setAccountType(user.accountType);
      if (!plan && user.plan) setPlan(user.plan);
      if (user.planBillingCycle) setBillingCycle(user.planBillingCycle);
      if (!tin && user.tin) setTin(user.tin);
      if (!organization && user.organization) setOrganization(user.organization);
      if (!nin && user.nin) setNin(user.nin);
      if (user.stateOfResidence) setStateOfResidence(user.stateOfResidence);
      if (user.employmentStatus) setEmploymentStatus(user.employmentStatus);
    }
  }, [user]);

  // Auth & Onboarding Guard
  useEffect(() => {
    if (!user) {
      navigate("/customer-dashboard/login");
    } else if (!user.emailVerified) {
      navigate(`/customer-dashboard/verify-email?email=${encodeURIComponent(user.email)}`);
    } else if (user.onboarded) {
      navigate("/customer-dashboard/receipts");
    }
  }, [user, navigate]);

  useEffect(() => {
    if (urlStep && urlStep !== step) setStep(urlStep);
  }, [urlStep]);

  const goTo = (next: OnboardingStepId) => {
    setStep(next);
    navigate(`/customer-dashboard/onboarding?step=${next}`, { replace: true });
  };

  if (!user) return null;

  // Persists intermediate draft to Supabase profiles
  const persistDraft = async () => {
    await saveOnboardingProgress({
      step,
      accountType: accountType ?? undefined,
      plan: plan ?? undefined,
      billingCycle,
      tin: tin || undefined,
      organization: organization || undefined,
      nin: nin || undefined,
      stateOfResidence: stateOfResidence || undefined,
      employmentStatus: employmentStatus || undefined,
    });
  };

  const continueFromAccount = async () => {
    if (!accountType) return;
    setBusy(true);
    try {
      await saveOnboardingProgress({
        step: "plan",
        accountType,
      });
      goTo("plan");
    } catch (err) {
      notify.error("Error saving step", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const continueFromPlan = async () => {
    if (!plan) {
      notify.error("Select a plan", "Choose Free, Deluxe, or Premium to continue.");
      return;
    }
    setBusy(true);
    try {
      await saveOnboardingProgress({
        step: "filing",
        plan,
        billingCycle,
        accountType: accountType ?? undefined,
      });
      goTo("filing");
    } catch (err) {
      notify.error("Error saving plan", err instanceof Error ? err.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const submitFiling = async (e: React.FormEvent) => {
    e.preventDefault();
    const next: Record<string, string> = {};

    if (!accountType) next.accountType = "Account type is required.";
    if (!plan) next.plan = "Please select a subscription plan.";

    if (!tin.trim()) {
      next.tin = "TIN is required for tax compliance.";
    } else if (!/^\d{8,12}$/.test(tin.replace(/[\s-]/g, ""))) {
      next.tin = "TIN must be 8–12 numeric digits.";
    }

    if (nin.trim() && !/^\d{11}$/.test(nin.replace(/[\s-]/g, ""))) {
      next.nin = "NIN must be 11 numeric digits.";
    }

    if (accountType === "organization" && !organization.trim()) {
      next.organization = "Organization name is required for business accounts.";
    }

    setErrs(next);
    if (Object.keys(next).length || !plan) return;

    setBusy(true);
    useLoadingStore.getState().showLoader("Verifying TIN & linking compliance profile…");

    try {
      // 1. Centralised update to Supabase user profile
      await saveOnboardingProgress({
        step: "filing",
        accountType: accountType ?? undefined,
        plan,
        billingCycle,
        tin: tin.trim(),
        organization: organization.trim() || undefined,
        nin: nin.trim() || undefined,
        stateOfResidence,
        employmentStatus,
        onboarded: true,
      });

      // 2. Mark completed
      await completeOnboarding();

      notify.success("Profile Activated", "Your compliance profile and account are ready.");
      navigate("/customer-dashboard/receipts");
    } catch (err) {
      notify.error("Verification failed", err instanceof Error ? err.message : "Please try again.");
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
          signupPlan={user?.plan}
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
          nin={nin}
          organization={organization}
          stateOfResidence={stateOfResidence}
          employmentStatus={employmentStatus}
          errors={errs}
          busy={busy}
          onTinChange={setTin}
          onNinChange={setNin}
          onOrgChange={setOrganization}
          onStateChange={setStateOfResidence}
          onEmploymentChange={setEmploymentStatus}
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
