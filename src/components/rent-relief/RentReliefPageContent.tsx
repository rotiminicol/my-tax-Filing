import { useState, useMemo, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  CreditCard,
  Receipt,
  Stamp,
  FolderCheck,
  Check,
  ArrowRight,
  Calculator,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  AlertCircle,
  Building,
  UserCheck,
} from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const MINT = "#d5f5c2";
const PENCIL = "#b6b6b6";

const SAVINGS_TABLE = [
  { rent: "₦600,000", pct: "₦120,000", relief: "₦120,000" },
  { rent: "₦1,500,000", pct: "₦300,000", relief: "₦300,000" },
  { rent: "₦3,500,000", pct: "₦700,000", relief: "₦500,000 (capped)" },
  { rent: "₦4,000,000 and above", pct: "₦800,000+", relief: "₦500,000 (capped)" },
];

const ELIGIBILITY = [
  "You are an individual who pays rent for your home in Nigeria",
  "You are subject to Nigerian personal income tax",
  "You can show proof that you paid the rent",
  "If you share a property, you claim only the part of the rent you personally pay",
  "If your rent runs across two calendar years, you claim only the portion that falls in each year",
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Create your tenancy agreement.",
    body: "We prepare a simple agreement between you and your landlord, ready for both of you to sign electronically.",
    icon: FileText,
  },
  {
    n: "02",
    title: "Pay your rent.",
    body: "Pay through MyTaxFiling, or upload proof of payment you have already made. Either way, you end up with a clear payment record.",
    icon: CreditCard,
  },
  {
    n: "03",
    title: "Get your receipt.",
    body: "You receive a copy of your rent receipt, stored with your agreement.",
    icon: Receipt,
  },
  {
    n: "04",
    title: "Stamp duty, where it applies.",
    body: "Many residential leases fall below the threshold for stamp duty and need no stamping. Where a lease is chargeable, we handle the stamping so the agreement is valid.",
    icon: Stamp,
  },
  {
    n: "05",
    title: "Claim your relief.",
    body: "With your agreement, receipt and payment record together, you declare your rent and claim up to 20%, capped at ₦500,000.",
    icon: FolderCheck,
  },
];

const WHAT_YOU_GET = [
  "A ready-to-sign tenancy agreement, written in plain language",
  "E-signature for you and your landlord, with no printing or meetings",
  "A payment record and receipt stored safely online",
  "Stamp duty handled where your lease requires it",
  "A claim-ready file with everything the tax authority may ask for",
  "Support from Nigerian tax specialists",
];

const FAQS = [
  {
    q: "Is rent relief automatic?",
    a: "No. You must declare your rent and provide supporting documents such as your agreement and payment receipt.",
  },
  {
    q: "What is the maximum I can claim?",
    a: "The relief is 20% of your annual rent, up to ₦500,000 a year, whichever is lower.",
  },
  {
    q: "Is it the same as a 20% tax refund?",
    a: "No. It is a deduction from your taxable income, so your saving is the relief multiplied by your tax rate.",
  },
  {
    q: "Does it replace the old Consolidated Relief Allowance?",
    a: "Yes. The Consolidated Relief Allowance ended when the new tax laws took effect on 1 January 2026.",
  },
  {
    q: "Do I need to pay stamp duty on my tenancy agreement?",
    a: "Not always. Lease agreements below the annual value threshold in the Nigeria Tax Act are exempt. We check your lease and handle stamping where it applies.",
  },
  {
    q: "I share a flat. Can both of us claim?",
    a: "Yes, but each tenant claims relief only on the share of rent they actually pay.",
  },
  {
    q: "I already have a tenancy agreement. Can I still use MyTaxFiling?",
    a: "Yes. You can upload your existing agreement and receipts, or create a fresh electronic agreement with your landlord.",
  },
  {
    q: "What if I pay rent in instalments or across two years?",
    a: "Only the rent attributable to the tax year counts for that year. We help you split it correctly across calendar tax cycles.",
  },
  {
    q: "How much does it cost?",
    a: "You can start free with standard receipt and document organization. Upgraded plans are available for priority support and full filing assistance.",
  },
];

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function RentReliefPageContent() {
  const rm = Boolean(useReducedMotion());

  // Interactive Calculator State
  const [rentInput, setRentInput] = useState<number>(1500000);
  const [taxRate, setTaxRate] = useState<number>(18);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "Rent Relief in Nigeria: Claim Up to ₦500,000 with MyTaxFiling";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Under the Nigeria Tax Act 2025, tenants can deduct 20% of annual rent, up to ₦500,000, from taxable income. MyTaxFiling prepares the paperwork you need to claim it.");
    }
  }, []);

  const calc = useMemo(() => {
    const raw20 = rentInput * 0.2;
    const relief = Math.min(raw20, 500000);
    const estimatedSaving = relief * (taxRate / 100);
    return { raw20, relief, estimatedSaving };
  }, [rentInput, taxRate]);

  return (
    <div className="font-sans" style={{ backgroundColor: CREAM }}>
      {/* ── 1. Hero ── */}
      <section
        className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28"
        style={{
          backgroundColor: CREAM,
          backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.06) 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-3xl space-y-6">

            <motion.h1
              {...rev(rm, 20, 0.08)}
              className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08]"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                color: INK,
              }}
            >
              Pay less tax on the rent you{" "}
              <span
                style={{
                  backgroundColor: YELLOW,
                  padding: "0 10px 4px",
                  borderRadius: 6,
                  display: "inline-block",
                }}
              >
                already pay
              </span>
            </motion.h1>

            <motion.p
              {...rev(rm, 14, 0.14)}
              className="text-lg sm:text-xl leading-relaxed"
              style={{
                color: INK,
                opacity: 0.75,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Since 1 January 2026, Nigerian tenants can deduct 20% of their yearly rent, up to ₦500,000,
              before their income tax is calculated. The catch: you have to prove it. MyTaxFiling gives
              you the agreement, the payment record and the receipt in one place, so your claim is ready
              when you need it.
            </motion.p>

            <motion.div
              {...rev(rm, 12, 0.2)}
              className="flex flex-col sm:flex-row items-center gap-4 pt-3"
            >
              <Link
                to="/customer-dashboard/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.98]"
                style={{
                  backgroundColor: INK,
                  color: CREAM,
                  boxShadow: "0 3px 10px rgba(26,51,0,0.18)",
                }}
              >
                Claim your rent relief
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <a
                href="#calculator"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white active:scale-[0.98]"
                style={{
                  borderColor: INK,
                  color: INK,
                  backgroundColor: "rgba(255,255,255,0.6)",
                }}
              >
                <Calculator className="w-4 h-4" />
                Check how much you could save
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. What is rent relief? ── */}
      <section className="py-20 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5 space-y-4">
              <span
                className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                LEGAL PROVISION
              </span>
              <h2
                className="text-3xl sm:text-4xl font-extrabold"
                style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                What is rent relief?
              </h2>
            </div>
            <div className="lg:col-span-7 space-y-6">
              <p
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: INK, opacity: 0.8 }}
              >
                Rent relief is a deduction introduced by the Nigeria Tax Act 2025. It replaced the old
                Consolidated Relief Allowance, which every taxpayer received automatically. Rent relief
                is different: it goes only to people who actually pay rent, and only when they can
                document it.
              </p>

              <div className="space-y-3.5">
                {[
                  "You can deduct 20% of the rent you pay in a year.",
                  "The most you can deduct is ₦500,000.",
                  "It lowers your taxable income, so your tax bill falls by the deduction multiplied by your tax rate.",
                ].map((item) => (
                  <div
                    key={item}
                    className="p-4 rounded-xl flex items-center gap-3.5 bg-white border border-[#1a3300]/12"
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: YELLOW, color: INK }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span className="font-semibold text-sm sm:text-base" style={{ color: INK }}>
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. How much could I save? (Table + Interactive Calculator) ── */}
      <section id="calculator" className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: CREAM }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-2xl mb-12 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: MINT, color: INK, border: `1px solid ${INK}` }}
            >
              TAX SAVINGS ESTIMATOR
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How much could I save?
            </h2>
            <p className="text-base sm:text-lg opacity-70" style={{ color: INK }}>
              Compare standard rental thresholds or simulate your personalized annual deduction below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
            {/* Table */}
            <div
              className="lg:col-span-6 rounded-2xl p-7 border bg-white"
              style={{ borderColor: PENCIL, boxShadow: "4px 4px 0px 0px #1a3300" }}
            >
              <h3 className="font-extrabold text-xl mb-4" style={{ color: INK }}>
                Statutory Benchmark Table
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#1a3300]/15">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-[#f5f2ec] border-b border-[#1a3300]/15">
                      <th className="py-3.5 px-4 font-bold text-xs uppercase" style={{ color: INK }}>
                        Annual rent
                      </th>
                      <th className="py-3.5 px-4 font-bold text-xs uppercase" style={{ color: INK }}>
                        20% of rent
                      </th>
                      <th className="py-3.5 px-4 font-bold text-xs uppercase" style={{ color: INK }}>
                        Relief you can claim
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a3300]/10">
                    {SAVINGS_TABLE.map((row) => (
                      <tr key={row.rent} className="hover:bg-amber-50/40">
                        <td className="py-3.5 px-4 font-bold" style={{ color: INK }}>
                          {row.rent}
                        </td>
                        <td className="py-3.5 px-4" style={{ color: INK, opacity: 0.75 }}>
                          {row.pct}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-emerald-900">
                          {row.relief}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Interactive Calculator */}
            <div
              className="lg:col-span-6 rounded-2xl p-7 sm:p-8"
              style={{
                backgroundColor: MINT,
                border: `1.5px solid ${INK}`,
                boxShadow: "4px 4px 0px 0px #1a3300",
              }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5" style={{ color: INK }} />
                <h3 className="font-extrabold text-xl" style={{ color: INK }}>
                  Interactive Rent Relief Calculator
                </h3>
              </div>

              <div className="space-y-5">
                {/* Rent slider / input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider" style={{ color: INK }}>
                      Your Annual Rent (₦)
                    </label>
                    <span className="font-mono font-extrabold text-base" style={{ color: INK }}>
                      ₦{rentInput.toLocaleString("en-NG")}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="300000"
                    max="6000000"
                    step="50000"
                    value={rentInput}
                    onChange={(e) => setRentInput(Number(e.target.value))}
                    className="w-full accent-[#1a3300] cursor-pointer"
                  />
                  <div className="flex justify-between text-[11px] font-mono opacity-50 mt-1">
                    <span>₦300k</span>
                    <span>₦2.5M</span>
                    <span>₦6.0M+</span>
                  </div>
                </div>

                {/* Tax band selector */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider block mb-1.5" style={{ color: INK }}>
                    Estimated Top Tax Rate
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[11, 15, 18, 24].map((rate) => (
                      <button
                        key={rate}
                        type="button"
                        onClick={() => setTaxRate(rate)}
                        className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                          taxRate === rate
                            ? "bg-[#1a3300] text-[#fcfaf5] border-[#1a3300]"
                            : "bg-white text-[#1a3300] border-[#1a3300]/20 hover:border-[#1a3300]"
                        }`}
                      >
                        {rate}% Band
                      </button>
                    ))}
                  </div>
                </div>

                {/* Result Cards */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="p-4 rounded-xl bg-white/80 border border-[#1a3300]/15">
                    <p className="text-xs font-mono uppercase opacity-60 mb-1" style={{ color: INK }}>
                      Relief Deduction
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-emerald-900">
                      ₦{calc.relief.toLocaleString("en-NG")}
                    </p>
                    <p className="text-[10px] opacity-60 mt-0.5">
                      {calc.raw20 > 500000 ? "Capped at ₦500,000 maximum" : "20% of your rent"}
                    </p>
                  </div>

                  <div className="p-4 rounded-xl bg-[#1a3300] text-[#fcfaf5]">
                    <p className="text-xs font-mono uppercase text-[#ffe95c] mb-1">
                      Estimated Tax Saved
                    </p>
                    <p className="text-xl sm:text-2xl font-black text-[#ffe95c]">
                      ~₦{Math.round(calc.estimatedSaving).toLocaleString("en-NG")}
                    </p>
                    <p className="text-[10px] text-white/60 mt-0.5">
                      At {taxRate}% top marginal tax rate
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className="p-4 rounded-xl bg-[#f5f2ec] border border-[#1a3300]/15 text-xs sm:text-sm leading-relaxed"
            style={{ color: INK }}
          >
            <strong>Note:</strong> The relief reduces your taxable income, so your actual tax saving depends on your
            tax band. For example, ₦500,000 of relief for someone taxed at 18% on their top slice of income saves
            about ₦90,000. This is an illustration, not a guarantee. Your result depends on your full income and other reliefs.
          </div>
        </div>
      </section>

      {/* ── 4. Who can claim it? ── */}
      <section className="py-20 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-3xl mb-10 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              ELIGIBILITY CRITERIA
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Who can claim it?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {ELIGIBILITY.map((item, idx) => (
              <div
                key={idx}
                className="p-5 rounded-xl bg-white border border-[#1a3300]/15 flex items-start gap-3.5 shadow-sm"
              >
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ backgroundColor: INK, color: CREAM }}
                >
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
                <span className="font-semibold text-sm sm:text-base leading-snug" style={{ color: INK }}>
                  {item}
                </span>
              </div>
            ))}
          </div>

          <div
            className="p-5 rounded-2xl flex items-center gap-3 border"
            style={{
              backgroundColor: "rgba(255, 233, 92, 0.4)",
              borderColor: "rgba(26,51,0,0.20)",
              color: INK,
            }}
          >
            <AlertCircle className="w-5 h-5 shrink-0 text-amber-900" />
            <p className="text-sm font-bold">
              The relief is for tenants only. Homeowners and landlords cannot claim it on property they own.
            </p>
          </div>
        </div>
      </section>

      {/* ── 5. How MyTaxFiling works (5 steps) ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: CREAM }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              5-STEP COMPLIANCE JOURNEY
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How MyTaxFiling works
            </h2>
            <p className="text-base sm:text-lg opacity-70" style={{ color: INK }}>
              From tenancy agreement to an audit-ready tax claim folder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {HOW_IT_WORKS.map((step) => (
              <div
                key={step.n}
                className="p-6 rounded-2xl border flex flex-col justify-between bg-[#f5f2ec] hover:-translate-y-1 transition-all duration-200"
                style={{ borderColor: PENCIL }}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs"
                      style={{ backgroundColor: YELLOW, color: INK, border: `1px solid ${INK}` }}
                    >
                      {step.n}
                    </span>
                    <step.icon className="w-5 h-5 opacity-40" style={{ color: INK }} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: INK }}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-75" style={{ color: INK }}>
                    {step.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. Why the paperwork matters & What you get ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Why paperwork matters */}
            <div
              className="lg:col-span-5 rounded-2xl p-8 sm:p-10 flex flex-col justify-between"
              style={{
                backgroundColor: INK,
                color: CREAM,
                boxShadow: "4px 4px 0px 0px #ffe95c",
              }}
            >
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  AUDIT READINESS
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-5"
                  style={{ color: CREAM, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Why the paperwork matters
                </h3>
                <p className="text-sm sm:text-base leading-relaxed opacity-85">
                  Rent relief is not automatic. Tax authorities expect evidence such as a signed tenancy
                  agreement, rent receipts or bank transfer records showing what you paid. Many tenants rent
                  informally, with no written agreement and cash payments, and they risk losing the relief.
                  A proper agreement and a payment trail protect your claim if you are ever asked to back it up.
                </p>
              </div>

              <div className="pt-6 mt-8 border-t border-white/15 flex items-center gap-2 text-xs font-mono text-[#ffe95c]">
                <ShieldCheck className="w-4 h-4" />
                Zero informal risk · Fully legally defensible
              </div>
            </div>

            {/* What you get */}
            <div
              className="lg:col-span-7 rounded-2xl p-8 sm:p-10 border bg-white flex flex-col justify-between"
              style={{ borderColor: PENCIL, boxShadow: "4px 4px 0px 0px #1a3300" }}
            >
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: MINT, color: INK, border: `1px solid ${INK}` }}
                >
                  WHAT YOU GET
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-6"
                  style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Complete compliance file in one place
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {WHAT_YOU_GET.map((item) => (
                    <div
                      key={item}
                      className="p-4 rounded-xl bg-[#f5f2ec] border border-[#1a3300]/10 flex items-start gap-3"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: INK, color: CREAM }}
                      >
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold leading-snug" style={{ color: INK }}>
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#1a3300]/10 flex justify-between items-center text-xs font-mono opacity-60">
                <span>Section 134 compliance check included</span>
                <span>Plain-language legal drafts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. FAQs (Accordion) ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: CREAM }}>
        <div className="max-w-[860px] mx-auto px-5 md:px-10">
          <div className="text-center mb-14 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              FREQUENTLY ASKED QUESTIONS
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Got questions about rent relief?
            </h2>
            <p className="text-base opacity-70" style={{ color: INK }}>
              Everything you need to know about the Nigeria Tax Act 2025 deduction.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={faq.q}
                  className="rounded-2xl border transition-all overflow-hidden bg-white"
                  style={{ borderColor: isOpen ? INK : PENCIL }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 font-bold text-base sm:text-lg"
                    style={{ color: INK }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-emerald-800" : "opacity-40"
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-6 sm:px-6 text-sm sm:text-base leading-relaxed opacity-80 border-t border-[#1a3300]/10 pt-4" style={{ color: INK }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 8. Closing Call to Action & Disclaimer ── */}
      <section className="py-20 border-t border-[#1a3300]/15" style={{ backgroundColor: MINT }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div
            className="rounded-3xl p-10 sm:p-14 text-center max-w-4xl mx-auto space-y-6"
            style={{
              backgroundColor: INK,
              color: CREAM,
              border: `2px solid ${INK}`,
              boxShadow: "6px 6px 0px 0px #ffe95c",
            }}
          >
            <span
              className="text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              TAKE ACTION TODAY
            </span>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                color: CREAM,
              }}
            >
              Don't leave your relief unclaimed
            </h2>

            <p className="text-base sm:text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
              If you pay rent, you may be entitled to deduct up to ₦500,000 from your taxable income.
              Start your agreement today and keep every document you need in one place.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/customer-dashboard/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                Start my rent relief claim
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                style={{ borderColor: CREAM, color: CREAM }}
              >
                Talk to a tax specialist
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center max-w-2xl mx-auto mt-12 text-xs leading-relaxed opacity-60" style={{ color: INK }}>
            <strong>Disclaimer:</strong> This page is general information, not tax or legal advice.
            Tax rules, thresholds and procedures may change. Please confirm current requirements with
            the Nigeria Revenue Service or a qualified tax adviser.
          </div>
        </div>
      </section>
    </div>
  );
}
