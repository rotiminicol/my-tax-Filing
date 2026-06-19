import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import AuthFooter from "@/components/auth/AuthFooter";
import { fiscal } from "@/components/fiscal-landing/tokens";
import { ONBOARDING_STEPS, STEP_LABELS, type OnboardingStepId } from "./onboardingSteps";
import { notify } from "@/components/Toaster";

interface Props {
  children: ReactNode;
  currentStep: OnboardingStepId;
  progressPercent: number;
  onSaveExit?: () => void;
}

export default function OnboardingShell({ children, currentStep, progressPercent, onSaveExit }: Props) {
  const navigate = useNavigate();
  const stepNum = ONBOARDING_STEPS.indexOf(currentStep) + 1;
  const total = ONBOARDING_STEPS.length;

  const handleSaveExit = () => {
    onSaveExit?.();
    notify.info("Progress saved", "You can continue setup anytime from your account.");
    navigate("/customer-dashboard/login");
  };

  return (
    <div className="min-h-screen flex flex-col font-sans" style={{ backgroundColor: fiscal.surface, color: fiscal.onSurface }}>
      <header
        className="sticky top-0 z-50 h-20 flex items-center border-b backdrop-blur-md px-4 md:px-10"
        style={{ backgroundColor: "rgba(248, 249, 255, 0.8)", borderColor: `${fiscal.outlineVariant}4D` }}
      >
        <div className="max-w-[1280px] mx-auto w-full flex justify-between items-center gap-4">
          <FiscalBrand />
          <div className="hidden md:flex items-center gap-6">
            {ONBOARDING_STEPS.map((id, i) => {
              const idx = ONBOARDING_STEPS.indexOf(currentStep);
              const done = i < idx;
              const active = id === currentStep;
              return (
                <div key={id} className="flex items-center gap-2">
                  {i > 0 && (
                    <div
                      className="w-8 h-0.5"
                      style={{ backgroundColor: done || active ? fiscal.primary : fiscal.outlineVariant }}
                    />
                  )}
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                    style={{
                      backgroundColor: done || active ? fiscal.primary : fiscal.outlineVariant,
                      color: done || active ? "#fff" : fiscal.onSurfaceVariant,
                    }}
                  >
                    {i + 1}
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{
                      color: active ? fiscal.primary : fiscal.onSurfaceVariant,
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {STEP_LABELS[id]}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 shrink-0">
            <span className="text-sm font-medium hidden sm:inline" style={{ color: fiscal.onSurfaceVariant }}>
              Step {stepNum} of {total}
            </span>
            <button
              type="button"
              onClick={handleSaveExit}
              className="text-sm font-medium hover:underline transition-colors"
              style={{ color: fiscal.onSurfaceVariant }}
            >
              Save &amp; Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center py-8 px-4 md:px-10 relative overflow-hidden">
        <div className="w-full max-w-4xl mb-8">
          <div className="relative w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: fiscal.surfaceContainer }}>
            <div
              className="absolute left-0 top-0 h-full transition-all duration-700 ease-out"
              style={{
                width: `${progressPercent}%`,
                backgroundColor: fiscal.primaryContainer,
                boxShadow: "0 0 0 0 rgba(6, 78, 59, 0.4)",
                animation: "onboarding-pulse 2s infinite",
              }}
            />
          </div>
        </div>

        {children}

        <div className="fixed inset-0 -z-10 pointer-events-none opacity-40 overflow-hidden">
          <div
            className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ backgroundColor: fiscal.primaryFixed }}
          />
          <div
            className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full blur-[120px]"
            style={{ backgroundColor: `${fiscal.secondaryFixed}4D` }}
          />
        </div>
      </main>

      <AuthFooter />

      <style>{`
        @keyframes onboarding-pulse {
          0% { box-shadow: 0 0 0 0 rgba(6, 78, 59, 0.4); }
          70% { box-shadow: 0 0 0 10px rgba(6, 78, 59, 0); }
          100% { box-shadow: 0 0 0 0 rgba(6, 78, 59, 0); }
        }
      `}</style>
    </div>
  );
}
