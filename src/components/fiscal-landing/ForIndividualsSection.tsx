import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  CreditCard,
  Stamp,
  FolderCheck,
  Check,
  ArrowRight,
  TrendingDown,
  Info,
} from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const MINT = "#d5f5c2";
const PENCIL = "#b6b6b6";

const steps = [
  {
    num: "1",
    title: "Create your agreement.",
    body: "A simple tenancy agreement between you and your landlord, signed electronically.",
    icon: FileText,
  },
  {
    num: "2",
    title: "Pay and get a receipt.",
    body: "Pay rent through MyTaxFiling, or upload proof of payment. Your receipt is stored with your agreement.",
    icon: CreditCard,
  },
  {
    num: "3",
    title: "Stamp duty, where it applies.",
    body: "Many residential leases are exempt. Where a lease is chargeable, we handle the stamping.",
    icon: Stamp,
  },
  {
    num: "4",
    title: "Claim your relief.",
    body: "Declare your rent with a complete, claim-ready file of documents.",
    icon: FolderCheck,
  },
];

const tiers = [
  { rent: "₦600,000", relief: "₦120,000", tag: "20% deduction" },
  { rent: "₦1,500,000", relief: "₦300,000", tag: "20% deduction" },
  { rent: "₦4,000,000 and above", relief: "₦500,000 (capped)", tag: "Statutory Cap" },
];

const benefits = [
  "A ready-to-sign tenancy agreement in plain language",
  "E-signature for you and your landlord",
  "A payment record and receipt stored safely online",
  "A claim-ready file if the tax authority asks for evidence",
  "Support from Nigerian tax specialists",
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

export default function ForIndividualsSection() {
  const rm = Boolean(useReducedMotion());

  return (
    <section
      id="for-individuals"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Header */}
        <div className="max-w-3xl mb-16 space-y-4">
          <motion.div
            {...rev(rm, 12, 0)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: YELLOW,
              color: INK,
              fontFamily: "'Roboto Mono', monospace",
              letterSpacing: "0.08em",
            }}
          >
            FOR INDIVIDUALS
          </motion.div>

          <motion.h2
            {...rev(rm, 18, 0.06)}
            className="font-extrabold text-3xl sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
              color: INK,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Turn the rent you already pay into a{" "}
            <span
              style={{
                backgroundColor: YELLOW,
                padding: "0 8px 3px",
                borderRadius: 4,
              }}
            >
              tax saving
            </span>
          </motion.h2>

          <motion.p
            {...rev(rm, 14, 0.12)}
            className="text-base sm:text-lg leading-relaxed pt-2"
            style={{
              color: INK,
              opacity: 0.72,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Under the Nigeria Tax Act 2025, tenants can deduct 20% of annual rent, up to ₦500,000,
            from taxable income. The relief is not automatic. You must be able to prove what you
            paid, and that is where MyTaxFiling helps.
          </motion.p>
        </div>

        {/* How It Works - 4 steps */}
        <div className="mb-20">
          <h3
            className="text-xl sm:text-2xl font-bold mb-8 flex items-center gap-2.5"
            style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: INK }} />
            How it works
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {steps.map((step, idx) => (
              <motion.div
                key={step.num}
                {...rev(rm, 20, idx * 0.08)}
                className="rounded-2xl p-6 relative flex flex-col justify-between transition-all duration-300 hover:shadow-md"
                style={{
                  backgroundColor: "#f5f2ec",
                  border: `1.5px solid ${PENCIL}`,
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm"
                      style={{
                        backgroundColor: YELLOW,
                        color: INK,
                        border: `1px solid ${INK}`,
                      }}
                    >
                      0{step.num}
                    </div>
                    <step.icon className="w-5 h-5 opacity-40" style={{ color: INK }} />
                  </div>
                  <h4
                    className="font-bold text-base sm:text-lg mb-2"
                    style={{ color: INK, fontFamily: "Inter, sans-serif" }}
                  >
                    {step.title}
                  </h4>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: INK, opacity: 0.65, fontFamily: "Inter, sans-serif" }}
                  >
                    {step.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* 2-Column: What it could be worth (Table) & Why choose MyTaxFiling */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
          {/* Table column */}
          <motion.div
            {...rev(rm, 24, 0.1)}
            className="lg:col-span-7 rounded-2xl p-7 sm:p-9 flex flex-col justify-between"
            style={{
              backgroundColor: MINT,
              border: `1.5px solid ${INK}`,
              boxShadow: "4px 4px 0px 0px #1a3300",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5" style={{ color: INK }} />
                <h3
                  className="text-2xl font-extrabold"
                  style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  What it could be worth
                </h3>
              </div>
              <p className="text-sm opacity-70 mb-6" style={{ color: INK }}>
                Sample deductions based on 20% annual rent under the Nigeria Tax Act 2025.
              </p>

              {/* Styled Table */}
              <div className="overflow-x-auto rounded-xl border border-[#1a3300]/20 bg-white/70">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-[#1a3300]/15 bg-[#1a3300]/5">
                      <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: INK }}>
                        Annual rent
                      </th>
                      <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider" style={{ color: INK }}>
                        Relief you can claim
                      </th>
                      <th className="py-3.5 px-4 font-bold text-xs uppercase tracking-wider text-right" style={{ color: INK }}>
                        Calculation
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a3300]/10">
                    {tiers.map((t) => (
                      <tr key={t.rent} className="hover:bg-white/90 transition-colors">
                        <td className="py-4 px-4 font-bold" style={{ color: INK }}>
                          {t.rent}
                        </td>
                        <td className="py-4 px-4 font-extrabold text-base text-emerald-900">
                          {t.relief}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <span
                            className="text-xs px-2.5 py-1 rounded-full font-mono font-semibold"
                            style={{
                              backgroundColor: "rgba(26,51,0,0.08)",
                              color: INK,
                            }}
                          >
                            {t.tag}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div
              className="mt-6 pt-5 flex items-start gap-2.5 border-t text-xs leading-relaxed"
              style={{ borderColor: "rgba(26,51,0,0.15)", color: INK, opacity: 0.75 }}
            >
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                The relief reduces your taxable income, so your actual saving depends on your tax band.
                This is an illustration, not tax advice.
              </span>
            </div>
          </motion.div>

          {/* Why choose MyTaxFiling */}
          <motion.div
            {...rev(rm, 24, 0.16)}
            className="lg:col-span-5 rounded-2xl p-7 sm:p-9 flex flex-col justify-between"
            style={{
              backgroundColor: INK,
              color: CREAM,
              border: `1.5px solid ${INK}`,
              boxShadow: "4px 4px 0px 0px #ffe95c",
            }}
          >
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                TENANT ADVANTAGE
              </span>
              <h3
                className="text-2xl font-extrabold mb-6"
                style={{ color: CREAM, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Why choose MyTaxFiling
              </h3>

              <ul className="space-y-4">
                {benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm leading-snug">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: YELLOW, color: INK }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span style={{ color: CREAM, opacity: 0.9 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-8 mt-6 border-t border-white/15">
              <p className="text-xs text-white/60 mb-2">
                Eligible under Section 134 &amp; personal relief guidelines.
              </p>
              <span className="text-xs font-mono text-[#ffe95c]">Ready in minutes online</span>
            </div>
          </motion.div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#1a3300]/15">
          <Link
            to="/customer-dashboard/signup"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
            style={{
              backgroundColor: INK,
              color: CREAM,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Start my rent relief claim
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>

          <Link
            to="/rent-relief"
            className="text-sm font-bold hover:underline inline-flex items-center gap-1.5"
            style={{ color: INK }}
          >
            Read the full rent relief guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
