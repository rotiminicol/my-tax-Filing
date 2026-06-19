import { Check, X, ArrowRight, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";

const tiers = [
  {
    id: "free",
    label: "FREE",
    price: "₦0",
    cadence: "/yr",
    headline: "Perfect for individuals starting out",
    sub: "Basic access to all compliance services",
    cta: "Get started",
    featured: false,
    features: [true, true, true, true, true, false, false, false],
  },
  {
    id: "deluxe",
    label: "DELUXE",
    price: "₦100,000",
    cadence: "/yr",
    headline: "Ideal for high-earning individuals",
    sub: "Complete solution for small businesses",
    cta: "Go Deluxe",
    featured: true,
    features: [true, true, true, true, true, true, true, true, false],
  },
  {
    id: "premium",
    label: "PREMIUM",
    price: "₦200,000",
    cadence: "/yr",
    headline: "Complete solution for corporations",
    sub: "Full-scale compliance with dedicated support",
    cta: "Get Premium",
    featured: false,
    features: [true, true, true, true, true, true, true, true, true],
  },
];

const featuresList = [
  "5 Rent Receipts / Month",
  "Basic PIT Filing",
  "5 E-Invoices / Month",
  "1 Document Renewal / Year",
  "Email Support",
  "Unlimited Rent Receipts",
  "Full Tax Filing (PIT + VAT)",
  "Unlimited E-Invoicing",
  "5 Document Renewals / Year",
  "Priority Support",
  "Compliance Reports",
  "Unlimited Document Renewals",
  "Dedicated Account Manager",
  "Audit Defense Support",
  "API Access",
  "24/7 Priority Support",
];

export default function Pricing() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 bg-black overflow-hidden">

      {/* ── Animated Cloud Layer ── */}
      <div className="absolute inset-0 pointer-events-none select-none" aria-hidden="true">

        {/* Cloud 1   large, top-left drift */}
        <div className="cloud-1 absolute top-[8%] opacity-[0.07]">
          <svg width="520" height="180" viewBox="0 0 520 180" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="200" cy="130" rx="200" ry="60"/>
            <ellipse cx="280" cy="100" rx="150" ry="70"/>
            <ellipse cx="360" cy="115" rx="120" ry="55"/>
            <ellipse cx="120" cy="120" rx="110" ry="50"/>
            <ellipse cx="200" cy="80"  rx="100" ry="60"/>
            <ellipse cx="310" cy="70"  rx="90"  ry="55"/>
          </svg>
        </div>

        {/* Cloud 2   medium, mid height */}
        <div className="cloud-2 absolute top-[35%] opacity-[0.05]">
          <svg width="380" height="130" viewBox="0 0 380 130" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="140" cy="95" rx="140" ry="45"/>
            <ellipse cx="200" cy="70" rx="110" ry="55"/>
            <ellipse cx="280" cy="85" rx="100" ry="42"/>
            <ellipse cx="80"  cy="88" rx="80"  ry="38"/>
            <ellipse cx="170" cy="55" rx="80"  ry="48"/>
          </svg>
        </div>

        {/* Cloud 3   small, near bottom */}
        <div className="cloud-3 absolute top-[65%] opacity-[0.06]">
          <svg width="300" height="110" viewBox="0 0 300 110" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="110" cy="80" rx="110" ry="38"/>
            <ellipse cx="165" cy="58" rx="90"  ry="48"/>
            <ellipse cx="230" cy="72" rx="80"  ry="35"/>
            <ellipse cx="60"  cy="72" rx="65"  ry="32"/>
          </svg>
        </div>

        {/* Cloud 4   very large, slow drift top */}
        <div className="cloud-4 absolute top-[-5%] opacity-[0.04]">
          <svg width="680" height="220" viewBox="0 0 680 220" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="280" cy="160" rx="280" ry="75"/>
            <ellipse cx="400" cy="120" rx="210" ry="90"/>
            <ellipse cx="520" cy="145" rx="170" ry="68"/>
            <ellipse cx="160" cy="148" rx="160" ry="65"/>
            <ellipse cx="310" cy="90"  rx="150" ry="78"/>
            <ellipse cx="450" cy="80"  rx="130" ry="70"/>
          </svg>
        </div>

        {/* Cloud 5   medium, lower third */}
        <div className="cloud-5 absolute top-[50%] opacity-[0.05]">
          <svg width="420" height="140" viewBox="0 0 420 140" fill="white" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="160" cy="105" rx="160" ry="48"/>
            <ellipse cx="230" cy="78"  rx="130" ry="60"/>
            <ellipse cx="320" cy="95"  rx="110" ry="45"/>
            <ellipse cx="90"  cy="98"  rx="90"  ry="42"/>
            <ellipse cx="195" cy="60"  rx="100" ry="52"/>
          </svg>
        </div>

      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Section Header */}
        <div className="mb-12 max-w-xl">
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1] text-white mb-3">
            Online filing options.
          </h2>
          <p className="text-sm text-white font-bold leading-relaxed">
            Choose the plan that fits your filing needs. Upgrade or cancel anytime.
          </p>
        </div>

        {/* ── MOBILE: Stacked Cards ──────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-3 lg:hidden">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className={`relative flex flex-col rounded-2xl border p-6 transition-shadow ${
                tier.featured
                  ? "bg-white text-black border-white shadow-2xl"
                  : "bg-white/5 border-white/10 shadow-sm"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black text-white text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 shadow-sm">
                  <Star className="h-2.5 w-2.5 fill-white" /> Most Popular
                </div>
              )}

              <div className="mb-5">
                <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${tier.featured ? "text-black/60" : "text-white"}`}>
                  {tier.label}
                </p>
                <div className={`text-3xl font-black tracking-tighter ${tier.featured ? "text-black" : "text-white"}`}>
                  {tier.price}
                </div>
                <p className={`text-[10px] font-black mt-0.5 ${tier.featured ? "text-black/50" : "text-white"}`}>
                  {tier.cadence}
                </p>
              </div>

              <Link
                to="/customer-dashboard/signup"
                className={`flex items-center justify-center gap-2 h-10 rounded-xl text-xs font-black mb-5 transition-opacity hover:opacity-90 ${
                  tier.featured
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                {tier.cta} <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <p className={`text-[11px] font-black mb-1 ${tier.featured ? "text-black" : "text-white"}`}>
                {tier.headline}
              </p>
              <p className={`text-[10px] font-bold leading-relaxed mb-5 ${tier.featured ? "text-black/60" : "text-white"}`}>
                {tier.sub}
              </p>

              <ul className="space-y-2.5 mt-auto">
                {featuresList.map((feat, i) => (
                  <li key={i} className="flex items-start gap-2">
                    {tier.features[i] ? (
                      <div className={`mt-0.5 h-4 w-4 shrink-0 rounded-[3px] grid place-items-center ${tier.featured ? "bg-black" : "bg-white"}`}>
                        <Check className={`h-2.5 w-2.5 ${tier.featured ? "text-white" : "text-black"}`} strokeWidth={4} />
                      </div>
                    ) : (
                      <X className={`mt-0.5 h-4 w-4 shrink-0 ${tier.featured ? "text-black/30" : "text-white"}`} strokeWidth={4} />
                    )}
                    <span className={`text-[10px] font-bold leading-tight ${tier.featured ? "text-black/70" : "text-white"} ${!tier.features[i] ? "line-through opacity-40" : ""}`}>
                      {feat}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ── DESKTOP: Comparison Table ──────────────────────────── */}
        <div className="hidden lg:block rounded-2xl border border-border overflow-hidden shadow-sm">
          
          {/* Tier Headers */}
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-white/5">
            <div className="p-8 border-r border-white/10">
              <p className="text-xs text-white font-black">Compare plans</p>
            </div>
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className={`p-8 text-center border-r last:border-r-0 border-white/10 ${tier.featured ? "bg-white" : ""}`}
              >
                <p className={`text-[9px] font-black uppercase tracking-widest mb-2 ${tier.featured ? "text-black/50" : "text-white"}`}>
                  {tier.label}
                </p>
                <div className={`text-3xl font-black tracking-tighter mb-0.5 ${tier.featured ? "text-black" : "text-white"}`}>
                  {tier.price}
                </div>
                <p className={`text-[10px] font-black mb-5 ${tier.featured ? "text-black/50" : "text-white"}`}>
                  {tier.cadence}
                </p>
                <Link
                  to="/customer-dashboard/signup"
                  className={`inline-flex items-center justify-center gap-1.5 w-full h-9 rounded-xl text-[11px] font-black transition-opacity hover:opacity-90 ${
                    tier.featured ? "bg-black text-white" : "bg-white text-black"
                  }`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          {/* Feature Rows */}
          {featuresList.map((feature, i) => (
            <div key={i} className={`grid grid-cols-[2fr_1fr_1fr_1fr] border-t border-white/10 ${i % 2 === 0 ? "bg-transparent" : "bg-white/5"}`}>
              <div className="px-8 py-4 flex items-center border-r border-white/10">
                <span className="text-sm font-black text-white">{feature}</span>
              </div>
              {tiers.map((tier, j) => (
                <div key={j} className={`px-8 py-4 flex items-center justify-center border-r last:border-r-0 border-white/10 ${tier.featured ? "bg-white" : ""}`}>
                  {tier.features[i] ? (
                    <div className={`h-5 w-5 rounded-[4px] grid place-items-center ${tier.featured ? "bg-black" : "bg-white"}`}>
                      <Check className={`h-3 w-3 ${tier.featured ? "text-white" : "text-black"}`} strokeWidth={4} />
                    </div>
                  ) : (
                    <X className={`h-4 w-4 ${tier.featured ? "text-black/30" : "text-white"}`} strokeWidth={4} />
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
