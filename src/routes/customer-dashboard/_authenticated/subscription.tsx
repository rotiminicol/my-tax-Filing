import { useMemo, useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { notify } from "@/components/Toaster";
import { useAuth } from "@/store/auth";
import type { PlanBillingCycle, PlanTier } from "@/store/auth";
import { formatNaira } from "@/lib/rr/format";
import { getPlanPerks, planDisplayName } from "@/lib/planConfig";
import {
  CheckCircle2,
  CreditCard,
  Download,
  Plus,
  X,
  Zap,
  Shield,
  Star,
} from "lucide-react";

const SB = {
  ink: "#1a3300",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  blush: "#f6d0ff",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const PLAN_MONTHLY_AMOUNTS: Record<string, Record<string, number>> = {
  deluxe: { monthly: 12500, annual: 120000 },
  premium: { monthly: 45000, annual: 432000 },
  free: { monthly: 0, annual: 0 },
};

const PLAN_DISPLAY_PRICES: Record<string, Record<string, string>> = {
  free: { monthly: "₦0", annual: "₦0" },
  deluxe: { monthly: "₦12,500 /mo", annual: "₦10,000 /mo" },
  premium: { monthly: "₦45,000 /mo", annual: "₦36,000 /mo" },
};

const PLAN_ANNUAL_TOTALS: Record<string, Record<string, string>> = {
  free: { monthly: "", annual: "" },
  deluxe: { monthly: "", annual: "₦120,000 billed annually" },
  premium: { monthly: "", annual: "₦432,000 billed annually" },
};

type CardEntry = { brand: string; last4: string; exp: string };

function generateBillingHistory(
  plan: PlanTier | null,
  billing: PlanBillingCycle | null | undefined,
  startDate: string,
) {
  if (!plan || plan === "free") return [];
  const b = billing || "monthly";
  const cycleMs = b === "annual" ? 365 * 24 * 60 * 60 * 1000 : 30 * 24 * 60 * 60 * 1000;
  const amount = PLAN_MONTHLY_AMOUNTS[plan]?.[b] ?? 0;
  const start = new Date(startDate);
  const records: { id: string; date: string; description: string; amount: number }[] = [];

  for (let i = 0; i < 4; i++) {
    const d = new Date(start.getTime() - i * cycleMs);
    if (d.getTime() > Date.now()) continue;
    if (d.getFullYear() < 2020) break;
    records.push({
      id: `#INV-${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`,
      date: d.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
      description: `${planDisplayName(plan)} ${b === "annual" ? "Annual" : "Monthly"} Subscription`,
      amount,
    });
  }

  if (records.length === 0 && amount > 0) {
    records.push({
      id: `#INV-${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, "0")}`,
      date: start.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" }),
      description: `${planDisplayName(plan)} ${b === "annual" ? "Annual" : "Monthly"} Subscription — Activation`,
      amount,
    });
  }
  return records;
}

function SubscriptionPage() {
  const user = useAuth((s) => s.user);
  const updatePlan = useAuth((s) => s.updatePlan);

  const [billingCycle, setBillingCycle] = useState<PlanBillingCycle>(
    user?.planBillingCycle ?? "monthly",
  );
  const [cards, setCards] = useState<CardEntry[]>([
    { brand: "Visa", last4: "4242", exp: "12/26" },
  ]);
  const [addingCard, setAddingCard] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [mounted, setMounted] = useState(false);
  const [upgrading, setUpgrading] = useState<PlanTier | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const currentPlan = user?.plan ?? "free";
  const billing = billingCycle;

  const billingHistory = useMemo(
    () => generateBillingHistory(user?.plan ?? null, user?.planBillingCycle, user?.planStartDate ?? new Date().toISOString()),
    [user?.plan, user?.planBillingCycle, user?.planStartDate],
  );

  const perks = useMemo(
    () => getPlanPerks(currentPlan, user?.accountType),
    [currentPlan, user?.accountType],
  );

  const renewalDate = useMemo(() => {
    if (!user?.planExpiresAt) return "—";
    return new Date(user.planExpiresAt).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [user?.planExpiresAt]);

  const handleUpgrade = (plan: PlanTier) => {
    if (plan === currentPlan) return;
    setUpgrading(plan);
    setTimeout(() => {
      updatePlan(plan, { billingCycle: billing });
      setUpgrading(null);
      notify.success(
        "Plan updated!",
        `Switched to ${planDisplayName(plan)} · ${billing === "annual" ? "Annual" : "Monthly"} billing.`,
      );
    }, 800);
  };

  const handleAddCard = () => {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 13 || digits.length > 19) {
      notify.error("Invalid card", "Please enter a valid card number.");
      return;
    }
    if (!cardExp.match(/^\d{2}\/\d{2}$/)) {
      notify.error("Invalid expiry", "Use MM/YY format.");
      return;
    }
    const last4 = digits.slice(-4);
    const brand = digits.startsWith("4") ? "Visa" : digits.startsWith("5") ? "Mastercard" : "Card";
    setCards((c) => [...c, { brand, last4, exp: cardExp }]);
    setAddingCard(false);
    setCardNumber("");
    setCardExp("");
    notify.success("Card added", "Your payment method has been saved.");
  };

  const PLANS: Array<{
    id: PlanTier;
    name: string;
    icon: typeof Zap;
    desc: string;
    highlight?: boolean;
    featured?: boolean;
    perks: string[];
  }> = [
    {
      id: "free",
      name: "Starter",
      icon: Zap,
      desc: "Simple personal filing for individuals.",
      perks: ["Basic PIT filing", "Receipt storage (50MB)", "Email support (48h)"],
    },
    {
      id: "deluxe",
      name: "Deluxe",
      icon: Shield,
      desc: "Unlimited filing for freelancers & SMEs.",
      highlight: true,
      perks: ["Unlimited VAT & PIT filing", "Audit-ready documentation", "Priority chat support", "TIN verification"],
    },
    {
      id: "premium",
      name: "Premium",
      icon: Star,
      desc: "Enterprise compliance at scale.",
      featured: true,
      perks: ["Everything in Deluxe", "Dedicated Tax Consultant", "WHT automation", "API & payroll access", "Health-checks"],
    },
  ];

  return (
    <DashboardShell title="Subscription">
      <div className="space-y-10">
        {/* Header */}
        <div
          className={`flex flex-col md:flex-row md:items-end justify-between gap-4 transition-all duration-500 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div>
            <h2 className="text-2xl font-extrabold" style={{ color: SB.ink }}>
              Subscription & Billing
            </h2>
            <p className="text-sm mt-1" style={{ color: SB.muted }}>
              Manage your plan, payment methods and billing history.
            </p>
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border"
            style={{ backgroundColor: SB.mint, borderColor: "rgba(26,51,0,0.12)" }}
          >
            <CheckCircle2 className="w-5 h-5" style={{ color: SB.ink }} />
            <span className="text-sm font-bold" style={{ color: SB.ink }}>
              Status: Compliant
            </span>
          </div>
        </div>

        {/* Current plan card + payment methods */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 transition-all duration-500 delay-100 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Current plan */}
          <div
            className="lg:col-span-8 rounded-2xl border p-6 md:p-8 relative overflow-hidden"
            style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
          >
            <div
              className="absolute top-0 right-0 w-40 h-40 rounded-bl-full opacity-50"
              style={{ backgroundColor: SB.mint }}
            />
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest"
                  style={{ backgroundColor: SB.ink, color: SB.yellow }}
                >
                  {planDisplayName(currentPlan)} Plan
                </span>
                <span className="text-xs" style={{ color: SB.muted }}>
                  Active since{" "}
                  {new Date(user?.planStartDate ?? Date.now()).toLocaleDateString("en-NG", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="text-4xl font-extrabold mb-1" style={{ color: SB.ink }}>
                {PLAN_DISPLAY_PRICES[currentPlan]?.[billing] ?? "—"}
              </div>
              {currentPlan !== "free" && (
                <p className="text-xs mb-5" style={{ color: SB.muted }}>
                  {PLAN_ANNUAL_TOTALS[currentPlan]?.[billing] || `Billed ${billing === "annual" ? "annually" : "monthly"}`}
                </p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 mb-6">
                {[
                  { label: "Renewal Date", value: renewalDate },
                  {
                    label: "Payment Method",
                    value: cards[0] ? `${cards[0].brand} •••• ${cards[0].last4}` : "No card",
                  },
                  {
                    label: "Billing Cycle",
                    value: billing === "annual" ? "Annual" : "Monthly",
                  },
                ].map((b) => (
                  <div
                    key={b.label}
                    className="p-3.5 rounded-xl border"
                    style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                  >
                    <p
                      className="text-[10px] font-bold uppercase tracking-widest mb-1"
                      style={{ color: SB.pencil }}
                    >
                      {b.label}
                    </p>
                    <p className="text-sm font-bold" style={{ color: SB.ink }}>
                      {b.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: SB.pencil }}>
                  Your {planDisplayName(currentPlan)} benefits
                </p>
                <div className="flex flex-wrap gap-2">
                  {perks.perks.map((p) => (
                    <span
                      key={p}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
                      style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder, color: SB.ink }}
                    >
                      <CheckCircle2 className="w-3 h-3" style={{ color: "#1a5c3a" }} />
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Payment methods */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div
              className="rounded-2xl border p-6 flex-1"
              style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
            >
              <h4
                className="text-xs font-bold uppercase tracking-widest mb-4"
                style={{ color: SB.pencil }}
              >
                Payment Methods
              </h4>

              <div className="space-y-3">
                {cards.map((c, i) => (
                  <div
                    key={`${c.brand}-${c.last4}-${i}`}
                    className="flex items-center justify-between p-3 rounded-xl border"
                    style={{ borderColor: SB.cardBorder, backgroundColor: SB.cream }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-6 rounded flex items-center justify-center text-[9px] font-extrabold italic text-white"
                        style={{ backgroundColor: c.brand === "Visa" ? "#1A1F71" : "#252525" }}
                      >
                        {c.brand.toUpperCase().slice(0, 4)}
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: SB.ink }}>
                          {c.brand} ···· {c.last4}
                        </p>
                        <p className="text-xs" style={{ color: SB.muted }}>
                          Exp {c.exp}
                        </p>
                      </div>
                    </div>
                    <CreditCard className="w-4 h-4" style={{ color: SB.pencil }} />
                  </div>
                ))}

                {/* Add card form */}
                {addingCard ? (
                  <div
                    className="p-4 rounded-xl border space-y-3"
                    style={{ borderColor: SB.cardBorder, backgroundColor: SB.cream }}
                  >
                    <input
                      type="text"
                      placeholder="Card number"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
                        setCardNumber(v);
                      }}
                      className="w-full p-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[#1a3300]/20"
                      style={{ backgroundColor: SB.white, borderColor: SB.cardBorder, color: SB.ink }}
                    />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      maxLength={5}
                      value={cardExp}
                      onChange={(e) => {
                        const v = e.target.value.replace(/\D/g, "").replace(/^(\d{2})(\d)/, "$1/$2");
                        setCardExp(v);
                      }}
                      className="w-full p-2.5 rounded-lg text-sm border outline-none focus:ring-2 focus:ring-[#1a3300]/20"
                      style={{ backgroundColor: SB.white, borderColor: SB.cardBorder, color: SB.ink }}
                    />
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={handleAddCard}
                        className="flex-1 py-2 rounded-lg text-sm font-bold"
                        style={{ backgroundColor: SB.ink, color: SB.cream }}
                      >
                        Save Card
                      </button>
                      <button
                        type="button"
                        onClick={() => setAddingCard(false)}
                        className="p-2 rounded-lg border"
                        style={{ borderColor: SB.cardBorder, color: SB.muted }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-sm font-bold transition-colors hover:bg-[#fcfaf5]"
                    style={{ borderColor: SB.cardBorder, color: SB.muted }}
                    onClick={() => setAddingCard(true)}
                  >
                    <Plus className="w-4 h-4" />
                    Add New Card
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Plan comparison */}
        <div
          className={`transition-all duration-500 delay-200 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <h3 className="text-xl font-extrabold" style={{ color: SB.ink }}>
                Compare Plans
              </h3>
              <p className="text-sm mt-1" style={{ color: SB.muted }}>
                Choose the right level of support for your financial needs.
              </p>
            </div>
            {/* Billing toggle */}
            <div
              className="inline-flex rounded-xl border p-1 gap-1"
              style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
            >
              {(["monthly", "annual"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setBillingCycle(c)}
                  className="px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                  style={
                    billingCycle === c
                      ? { backgroundColor: SB.ink, color: SB.cream }
                      : { color: SB.muted }
                  }
                >
                  {c === "monthly" ? "Monthly" : "Annual"}
                  {c === "annual" && (
                    <span
                      className="ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full font-extrabold"
                      style={{ backgroundColor: SB.yellow, color: SB.ink }}
                    >
                      −20%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(({ id, name, icon: Icon, desc, highlight, featured, perks: planPerks }) => {
              const isActive = id === currentPlan;
              const isUpgrading = upgrading === id;
              return (
                <div
                  key={id}
                  className={`rounded-2xl border p-6 flex flex-col transition-all duration-300 hover:shadow-lg ${
                    featured ? "ring-2" : ""
                  }`}
                  style={{
                    backgroundColor: featured ? SB.ink : SB.white,
                    borderColor: highlight && !featured ? SB.ink : featured ? SB.ink : SB.cardBorder,
                    color: featured ? SB.cream : SB.ink,
                    ...(featured ? { boxShadow: "0 20px 40px rgba(26,51,0,0.20), 0 0 0 2px #ffe95c" } : {}),
                  }}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: featured ? "rgba(255,255,255,0.12)" : SB.mint }}
                    >
                      <Icon className="w-5 h-5" style={{ color: featured ? SB.yellow : SB.ink }} />
                    </div>
                    <div>
                      <p className="font-extrabold">{name}</p>
                      {highlight && !featured && (
                        <span
                          className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: SB.yellow, color: SB.ink }}
                        >
                          Popular
                        </span>
                      )}
                    </div>
                  </div>

                  <p
                    className="text-xs mb-4"
                    style={{ color: featured ? "rgba(252,250,245,0.65)" : SB.muted }}
                  >
                    {desc}
                  </p>

                  <div className="mb-4">
                    <p className="text-2xl font-extrabold">
                      {PLAN_DISPLAY_PRICES[id]?.[billingCycle] ?? "—"}
                    </p>
                    {id !== "free" && billingCycle === "annual" && (
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: featured ? "rgba(252,250,245,0.5)" : SB.muted }}
                      >
                        {PLAN_ANNUAL_TOTALS[id]?.annual}
                      </p>
                    )}
                  </div>

                  <ul className="space-y-2 flex-1 mb-6">
                    {planPerks.map((perk) => (
                      <li key={perk} className="flex items-start gap-2 text-xs">
                        <CheckCircle2
                          className="w-3.5 h-3.5 mt-0.5 shrink-0"
                          style={{ color: featured ? SB.mint : "#1a5c3a" }}
                        />
                        <span style={{ color: featured ? "rgba(252,250,245,0.85)" : SB.muted }}>
                          {perk}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {isActive ? (
                    <div
                      className="w-full py-2.5 rounded-xl font-bold text-center text-sm"
                      style={{
                        backgroundColor: featured ? "rgba(255,255,255,0.12)" : SB.mint,
                        color: featured ? SB.cream : SB.ink,
                      }}
                    >
                      ✓ Current Plan
                    </div>
                  ) : (
                    <button
                      type="button"
                      disabled={isUpgrading !== null}
                      onClick={() => handleUpgrade(id)}
                      className="w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95 disabled:opacity-60"
                      style={{
                        backgroundColor: featured ? SB.yellow : "transparent",
                        color: featured ? SB.ink : SB.ink,
                        border: featured ? "none" : `2px solid ${SB.cardBorder}`,
                      }}
                    >
                      {isUpgrading ? "Switching…" : id === "free" ? "Downgrade" : `Switch to ${name}`}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Billing history */}
        <div
          className={`rounded-2xl border overflow-hidden transition-all duration-500 delay-300 ${
            mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
        >
          <div
            className="px-6 py-4 border-b flex items-center justify-between"
            style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
          >
            <h3 className="text-base font-extrabold" style={{ color: SB.ink }}>
              Billing History
            </h3>
            {billingHistory.length > 0 && (
              <button
                type="button"
                className="flex items-center gap-2 text-sm font-bold"
                style={{ color: SB.ink }}
                onClick={() => notify.success("Downloaded", "Billing records exported as CSV.")}
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            )}
          </div>

          {billingHistory.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm" style={{ color: SB.muted }}>
                No billing records yet. Upgrade to a paid plan to see invoice history here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr style={{ borderBottom: `1px solid ${SB.cardBorder}` }}>
                    {["Invoice ID", "Date", "Description", "Amount", ""].map((h) => (
                      <th
                        key={h || "action"}
                        className="px-6 py-3 text-[10px] font-bold uppercase tracking-widest"
                        style={{ color: SB.pencil }}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((inv) => (
                    <tr
                      key={inv.id}
                      className="border-t hover:bg-[#fcfaf5] transition-colors"
                      style={{ borderColor: SB.cardBorder }}
                    >
                      <td className="px-6 py-4 text-sm font-mono font-bold" style={{ color: SB.ink }}>
                        {inv.id}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: SB.muted }}>
                        {inv.date}
                      </td>
                      <td className="px-6 py-4 text-sm" style={{ color: SB.ink }}>
                        {inv.description}
                      </td>
                      <td className="px-6 py-4 text-sm font-bold" style={{ color: SB.ink }}>
                        {formatNaira(inv.amount)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          className="text-xs font-bold px-3 py-1.5 rounded-lg border hover:bg-[#fcfaf5] transition-colors"
                          style={{ borderColor: SB.cardBorder, color: SB.ink }}
                          onClick={() => notify.success("Downloaded", `Invoice ${inv.id} downloaded as PDF.`)}
                        >
                          PDF
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

export default SubscriptionPage;
