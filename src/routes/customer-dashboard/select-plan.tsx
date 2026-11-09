import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { useAuth, type PlanTier } from "@/store/auth";
import { notify } from "@/components/Toaster";
import loginImg from "@/assets/login.png";
import { checkoutWithPaystack } from "@/lib/paystack";
import { Check, X, Star, Zap, ArrowRight, Shield, Loader2 } from "lucide-react";

const tiers = [
  {
    id: "free" as PlanTier,
    label: "FREE",
    price: "₦0",
    cadence: "Forever free",
    headline: "Just you & your landlord",
    sub: "For individuals generating single compliant receipts",
    cta: "Start Free",
    featured: false,
    icon: Shield,
    features: [true, true, false, false, false],
  },
  {
    id: "deluxe" as PlanTier,
    label: "DELUXE",
    price: "₦12,500",
    cadence: "per month",
    headline: "You & your properties",
    sub: "Unlimited VAT & PIT filing, audit docs and priority support",
    cta: "Get Deluxe",
    featured: false,
    icon: Zap,
    features: [true, true, true, true, false],
  },
  {
    id: "premium" as PlanTier,
    label: "PREMIUM",
    price: "₦45,000",
    cadence: "per month",
    headline: "You & your agency",
    sub: "Full-scale compliance, dedicated tax consultant and WHT automation",
    cta: "Get Premium",
    featured: true,
    icon: Star,
    features: [true, true, true, true, true],
  },
];

const featuresList = [
  "FCT-IRS Compliant Receipt Generation",
  "PDF Downloads & Email Delivery",
  "Batch Generation (up to 50 receipts)",
  "Advanced Excel Import & Export",
  "Dedicated Consultant & Support",
];

function SelectPlanPage() {
  const navigate = useNavigate();
  const user = useAuth((s) => s.user);
  const updatePlan = useAuth((s) => s.updatePlan);
  const [processingPlan, setProcessingPlan] = useState<PlanTier | null>(null);

  useEffect(() => {
    if (!user) navigate("/customer-dashboard/login");
  }, [user, navigate]);

  if (!user) return null;

  const handleSelect = async (planId: PlanTier) => {
    if (planId === "free") {
      updatePlan("free");
      notify.success("Plan Activated", "You're now on the Free plan.");
      navigate("/customer-dashboard/receipts");
      return;
    }

    if (!user.email) {
      notify.error("Email required", "Please ensure your account has a valid email.");
      return;
    }

    setProcessingPlan(planId);

    await checkoutWithPaystack({
      email: user.email,
      userId: user.id,
      plan: planId,
      billingCycle: "monthly",
      onSuccess: async (reference) => {
        try {
          const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
          const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

          if (supabaseUrl && anonKey) {
            try {
              await fetch(`${supabaseUrl}/functions/v1/verify-paystack-payment`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${anonKey}`,
                },
                body: JSON.stringify({
                  reference,
                  userId: user.id,
                  plan: planId,
                  billingCycle: "monthly",
                }),
              });
            } catch (fnErr) {
              console.warn("Edge function fallback:", fnErr);
            }
          }

          updatePlan(planId, { billingCycle: "monthly" });
          const planLabel = tiers.find((t) => t.id === planId)?.label || planId;
          notify.success(
            "Plan Activated",
            `Welcome to ${planLabel}! Payment reference: ${reference}`,
          );
          navigate("/customer-dashboard/receipts");
        } catch (err) {
          const msg = err instanceof Error ? err.message : "Payment error";
          notify.error("Payment failed", msg);
        } finally {
          setProcessingPlan(null);
        }
      },
      onClose: () => {
        setProcessingPlan(null);
        notify.info("Payment cancelled", "You can continue with the Free plan or retry anytime.");
      },
      onError: (err) => {
        setProcessingPlan(null);
        notify.error("Payment error", err.message || "Failed to initialize Paystack.");
      },
    });
  };

  return (
    <AuthLayout
      eyebrow="Almost there"
      title="Choose your plan."
      subtitle="Select the filing plan that works for you. You can upgrade or downgrade anytime from your dashboard."
      image={loginImg}
    >
      <div className="space-y-3">
        {tiers.map((tier) => {
          const isActive = user.plan === tier.id;
          const isProcessing = processingPlan === tier.id;
          const Icon = tier.icon;
          return (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl border-2 p-5 transition-all ${
                tier.featured
                  ? "border-black bg-black text-white shadow-xl shadow-black/15"
                  : isActive
                    ? "border-black bg-slate-50 shadow-md"
                    : "border-slate-200 bg-white hover:border-slate-400 hover:shadow-sm"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-white text-black text-[8px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-black" /> Most Popular
                </div>
              )}

              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    tier.featured ? "bg-white/10" : "bg-slate-100"
                  }`}
                >
                  <Icon className={`w-5 h-5 ${tier.featured ? "text-white" : "text-slate-500"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2 mb-0.5">
                    <p
                      className={`text-[9px] font-black uppercase tracking-widest ${tier.featured ? "text-white/60" : "text-slate-400"}`}
                    >
                      {tier.label}
                    </p>
                    {isActive && (
                      <span className="text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-xl font-black tracking-tight ${tier.featured ? "text-white" : "text-black"}`}
                  >
                    {tier.price}
                    <span
                      className={`text-[10px] font-bold ml-1.5 ${tier.featured ? "text-white/50" : "text-slate-400"}`}
                    >
                      {tier.cadence}
                    </span>
                  </div>
                  <p
                    className={`text-[11px] font-semibold mt-1 leading-relaxed ${tier.featured ? "text-white/60" : "text-slate-500"}`}
                  >
                    {tier.sub}
                  </p>
                </div>
              </div>

              {/* Feature pills */}
              <div className="flex flex-wrap gap-1.5 mt-4 mb-4">
                {featuresList.map((feat, i) => (
                  <span
                    key={i}
                    className={`inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-md ${
                      tier.features[i]
                        ? tier.featured
                          ? "bg-white/10 text-white"
                          : "bg-slate-100 text-slate-700"
                        : tier.featured
                          ? "bg-white/5 text-white/30 line-through"
                          : "bg-slate-50 text-slate-300 line-through"
                    }`}
                  >
                    {tier.features[i] ? (
                      <Check className="w-2.5 h-2.5" strokeWidth={3} />
                    ) : (
                      <X className="w-2.5 h-2.5" strokeWidth={3} />
                    )}
                    {feat}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleSelect(tier.id)}
                disabled={isActive || processingPlan !== null}
                className={`w-full h-11 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-default ${
                  isActive
                    ? "bg-slate-200 text-slate-500"
                    : tier.featured
                      ? "bg-white text-black hover:bg-white/90 shadow-md"
                      : "bg-black text-white hover:opacity-90 shadow-md shadow-black/10"
                }`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Opening Paystack…
                  </>
                ) : isActive ? (
                  "Active Plan"
                ) : (
                  tier.cta
                )}
                {!isActive && !isProcessing && <ArrowRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          );
        })}
      </div>

      {/* Skip link */}
      <button
        onClick={() => {
          updatePlan("free");
          navigate("/customer-dashboard/receipts");
        }}
        className="w-full mt-4 text-center text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors cursor-pointer py-2"
      >
        Skip for now — continue with Free plan
      </button>
    </AuthLayout>
  );
}

export default SelectPlanPage;
