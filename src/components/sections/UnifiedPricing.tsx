import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { useAuth } from "@/store/auth";
import { getPlanPrice } from "@/lib/planConfig";
import type { PlanBillingCycle } from "@/store/auth";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";
const MINT = "#d5f5c2";

const plans = [
  {
    id: "free" as const,
    name: "Free",
    featured: false,
    description: "Get started at no cost",
    features: [
      "5 Rent Receipts / Month",
      "Basic PIT Filing",
      "5 E‑Invoices / Month",
      "1 Document Renewal / Year",
      "Email Support",
    ],
    cta: "Get Started",
    to: "/customer-dashboard/signup" as const,
    bg: "#f5f2ec",
  },
  {
    id: "deluxe" as const,
    name: "Deluxe",
    featured: true,
    badge: "Most Popular",
    description: "For individuals & small businesses",
    features: [
      "Everything in Free",
      "Unlimited Rent Receipts",
      "Full Tax Filing (PIT + VAT)",
      "Unlimited E‑Invoicing",
      "5 Document Renewals / Year",
      "Priority Support",
      "Compliance Reports",
    ],
    cta: "Go Deluxe",
    to: "/customer-dashboard/signup" as const,
    bg: MINT,
  },
  {
    id: "premium" as const,
    name: "Premium",
    featured: false,
    description: "For enterprises & high volume",
    features: [
      "Everything in Deluxe",
      "Unlimited Document Renewals",
      "Dedicated Account Manager",
      "Audit Defense Support",
      "API Access",
      "24/7 Priority Support",
    ],
    cta: "Select Premium",
    to: "/customer-dashboard/signup" as const,
    bg: "#f5f2ec",
  },
];

interface UnifiedPricingProps {
  theme?: unknown;
  headerTitle?: string;
  headerSubtitle?: string;
}

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function UnifiedPricing({
  headerTitle = "Pricing Plans",
  headerSubtitle = "Plans designed to scale with your financial journey.",
}: UnifiedPricingProps) {
  const user = useAuth((s) => s.user);
  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>("monthly");
  const rm = Boolean(useReducedMotion());

  useEffect(() => {
    if (user?.planBillingCycle) {
      setBillingCycle(user.planBillingCycle);
    }
  }, [user?.planBillingCycle]);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      <div
        className="h-px w-full absolute top-0"
        style={{ backgroundColor: PENCIL, opacity: 0.3 }}
      />

      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-10">
        {/* ── Header ── */}
        <div className="text-center mb-14 space-y-5">
          <motion.div
            {...rev(rm, 14, 0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: YELLOW,
              color: INK,
              fontFamily: "'Roboto Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            {headerTitle}
          </motion.div>

          <motion.h2
            {...rev(rm, 20, 0.06)}
            className="leading-none"
            style={{
              fontFamily:
                "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
              fontSize: "clamp(2.2rem, 5vw, 3.4rem)",
              fontWeight: 800,
              letterSpacing: "-0.01em",
              color: INK,
              lineHeight: 1.05,
            }}
          >
            Simple,{" "}
            <span
              style={{
                backgroundColor: YELLOW,
                padding: "0 6px 3px",
                borderRadius: 3,
              }}
            >
              transparent
            </span>{" "}
            pricing
          </motion.h2>

          <motion.p
            {...rev(rm, 12, 0.1)}
            className="text-base md:text-lg max-w-xl mx-auto"
            style={{
              color: INK,
              opacity: 0.55,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            {headerSubtitle}
          </motion.p>

          {/* Billing toggle with spring animation */}
          <motion.div
            {...rev(rm, 10, 0.14)}
            className="inline-flex items-center justify-center"
          >
            <div
              className="inline-flex items-center gap-1 rounded-full border p-1"
              style={{ borderColor: "rgba(26,51,0,0.20)", color: INK }}
            >
              {(["monthly", "annual"] as const).map((cycle) => {
                const active = billingCycle === cycle;
                return (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className="relative px-5 py-2 rounded-full text-sm transition-colors duration-200"
                    style={{
                      fontFamily: "Inter, system-ui, sans-serif",
                      color: active ? CREAM : INK,
                    }}
                  >
                    {active && (
                      <motion.span
                        layoutId="pricing-toggle"
                        className="absolute inset-0 rounded-full"
                        style={{ backgroundColor: INK }}
                        transition={
                          rm
                            ? { duration: 0 }
                            : { type: "spring", stiffness: 380, damping: 30 }
                        }
                      />
                    )}
                    <span className="relative z-10 font-medium capitalize">
                      {cycle}
                    </span>
                  </button>
                );
              })}
            </div>
          </motion.div>

          {user?.planBillingCycle && (
            <p
              className="text-sm"
              style={{
                color: INK,
                opacity: 0.55,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Your current subscription is billed{" "}
              {user.planBillingCycle === "annual" ? "annually" : "monthly"}.
            </p>
          )}
        </div>

        {/* ── Cards ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {plans.map((plan, index) => {
            const price = getPlanPrice(plan.id, billingCycle);
            return (
              <motion.div
                key={plan.name}
                {...rev(rm, 28, index * 0.09)}
                whileHover={
                  rm
                    ? undefined
                    : {
                        y: -5,
                        transition: {
                          type: "spring",
                          stiffness: 320,
                          damping: 22,
                        },
                      }
                }
                className="flex flex-col"
              >
                <div
                  className="relative flex flex-col rounded-xl overflow-hidden flex-1 transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(26,51,0,0.10)]"
                  style={{
                    backgroundColor: plan.bg,
                    border: `1px solid ${plan.featured ? INK : PENCIL}`,
                    boxShadow: plan.featured
                      ? `4px 4px 0px 0px ${INK}`
                      : "rgba(0,0,0,0.05) 0px 1px 2px",
                  }}
                >
                  {plan.featured && (
                    <div
                      className="h-1.5 w-full"
                      style={{ backgroundColor: INK }}
                    />
                  )}

                  {plan.badge && (
                    <div className="absolute top-4 right-4">
                      <span
                        className="text-[11px] font-medium px-3 py-1 rounded-full"
                        style={{
                          backgroundColor: INK,
                          color: CREAM,
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        {plan.badge}
                      </span>
                    </div>
                  )}

                  <div className="p-7 md:p-8 flex flex-col flex-1">
                    <div className="mb-6">
                      <p
                        className="text-xs font-medium uppercase tracking-widest mb-1"
                        style={{
                          color: INK,
                          opacity: plan.featured ? 0.7 : 0.45,
                          fontFamily: "'Roboto Mono', monospace",
                        }}
                      >
                        {plan.name}
                      </p>
                      <p
                        className="text-sm"
                        style={{
                          color: INK,
                          opacity: 0.5,
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        {plan.description}
                      </p>
                    </div>

                    <div
                      className="flex items-end gap-1.5 mb-8 pb-6"
                      style={{ borderBottom: "1px solid rgba(26,51,0,0.15)" }}
                    >
                      <span
                        className="text-4xl md:text-5xl font-bold leading-none"
                        style={{
                          color: INK,
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        {price}
                      </span>
                      <span
                        className="text-sm mb-1"
                        style={{
                          color: INK,
                          opacity: 0.4,
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        /month
                      </span>
                    </div>

                    {billingCycle === "annual" && plan.id !== "free" && (
                      <p
                        className="text-xs mb-4"
                        style={{
                          color: INK,
                          opacity: 0.5,
                          fontFamily: "Inter, system-ui, sans-serif",
                        }}
                      >
                        Billed annually
                      </p>
                    )}

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feat) => (
                        <li
                          key={feat}
                          className="flex items-start gap-3 text-sm"
                        >
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                            style={{
                              backgroundColor: plan.featured ? INK : "#e8e5df",
                              border: `1px solid ${plan.featured ? INK : PENCIL}`,
                            }}
                          >
                            <Check
                              className="w-3 h-3"
                              style={{ color: plan.featured ? CREAM : INK }}
                            />
                          </div>
                          <span
                            style={{
                              color: INK,
                              opacity: 0.7,
                              fontFamily: "Inter, system-ui, sans-serif",
                            }}
                          >
                            {feat}
                          </span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      to={plan.to}
                      className="w-full py-3.5 rounded-md text-center text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-[0.97]"
                      style={
                        plan.featured
                          ? {
                              backgroundColor: INK,
                              color: CREAM,
                              fontFamily: "Inter, system-ui, sans-serif",
                              boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px",
                            }
                          : {
                              backgroundColor: "transparent",
                              color: INK,
                              border: `1px solid ${INK}`,
                              fontFamily: "Inter, system-ui, sans-serif",
                            }
                      }
                    >
                      {plan.cta}
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        <motion.div {...rev(rm, 8, 0.1)} className="mt-8 flex justify-center">
          <p
            className="text-center text-sm max-w-3xl px-4 md:px-0"
            style={{
              color: INK,
              opacity: 0.35,
              fontFamily: "Inter, system-ui, sans-serif",
              lineHeight: 1.8,
            }}
          >
            No credit card required · Cancel anytime · FIRS & LIRS Compliant
          </p>
        </motion.div>
      </div>
    </section>
  );
}
