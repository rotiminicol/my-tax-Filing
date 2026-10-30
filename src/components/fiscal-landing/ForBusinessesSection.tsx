import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Link2,
  CheckCircle2,
  Send,
  Building,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Check,
  FileCheck2,
} from "lucide-react";

const INK = "#18623f";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const PENCIL = "#b6b6b6";

const turnoverTiers = [
  {
    tier: "Large",
    turnover: "₦5 billion and above",
    status: "Live. Compliance monitoring under way",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  {
    tier: "Medium",
    turnover: "₦1 billion to ₦5 billion",
    status: "Live from 1 July 2026. Enforcement expected from early 2027",
    badge: "bg-amber-100 text-amber-900 border-amber-300",
  },
  {
    tier: "Emerging",
    turnover: "Below ₦1 billion",
    status: "Go-live 1 July 2027. Enforcement expected from 2028",
    badge: "bg-sky-100 text-sky-900 border-sky-300",
  },
];

const businessSteps = [
  {
    step: "Connect",
    desc: "Link your accounting, ERP or billing system, or raise invoices directly in MyTaxFiling.",
    icon: Link2,
  },
  {
    step: "Validate",
    desc: "Mandatory fields and formats are checked before submission, so errors are caught early.",
    icon: CheckCircle2,
  },
  {
    step: "Submit and store",
    desc: "Get your IRN, stamp and QR code, then keep a secure, audit-ready record of every invoice.",
    icon: Send,
  },
];

const b2bBenefits = [
  "Fewer rejected invoices through pre-submission checks",
  "Works with your existing systems seamlessly",
  "Status tracking for pending, accepted and rejected invoices",
  "Cleaner VAT records from validated data",
  "Local support from Nigerian tax and compliance specialists",
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

export default function ForBusinessesSection() {
  const rm = Boolean(useReducedMotion());

  return (
    <section
      id="for-businesses"
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#f5f2ec" }}
    >
      <div
        className="h-px w-full absolute top-0"
        style={{ backgroundColor: PENCIL, opacity: 0.35 }}
      />

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
            FOR BUSINESSES
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
            E-invoicing that keeps you{" "}
            <span
              style={{
                backgroundColor: YELLOW,
                padding: "0 8px 3px",
                borderRadius: 4,
              }}
            >
              compliant, not confused
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
            Nigeria is moving invoicing onto the Nigeria Revenue Service's Merchant Buyer Solution,
            in phases by turnover. Each approved invoice carries an Invoice Reference Number,
            a cryptographic stamp and a QR code, which makes it traceable, verifiable and audit-ready.
          </motion.p>
        </div>

        {/* Turnover Table: Where does your business stand? */}
        <motion.div
          {...rev(rm, 20, 0.08)}
          className="rounded-2xl p-7 sm:p-9 mb-16"
          style={{
            backgroundColor: CREAM,
            border: `1.5px solid ${INK}`,
            boxShadow: "4px 4px 0px 0px #18623f",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3
                className="text-2xl font-extrabold"
                style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Where does your business stand?
              </h3>
              <p className="text-sm opacity-70 mt-1" style={{ color: INK }}>
                Phased rollout schedule defined by the Nigeria Revenue Service (NRS).
              </p>
            </div>
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-full w-fit"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              MBS MANDATE PHASES
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[#18623f]/20 bg-white">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#18623f]/15 bg-[#f5f2ec]">
                  <th className="py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: INK }}>
                    Business size
                  </th>
                  <th className="py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: INK }}>
                    Annual turnover
                  </th>
                  <th className="py-3.5 px-5 font-bold text-xs uppercase tracking-wider" style={{ color: INK }}>
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#18623f]/10">
                {turnoverTiers.map((row) => (
                  <tr key={row.tier} className="hover:bg-stone-50 transition-colors">
                    <td className="py-4 px-5 font-extrabold text-base" style={{ color: INK }}>
                      {row.tier}
                    </td>
                    <td className="py-4 px-5 font-medium" style={{ color: INK }}>
                      {row.turnover}
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-block text-xs font-medium px-3 py-1.5 rounded-md border ${row.badge}`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Callout box */}
          <div
            className="mt-6 p-4 rounded-xl flex items-start gap-3 border text-xs sm:text-sm leading-relaxed"
            style={{
              backgroundColor: "rgba(255, 233, 92, 0.25)",
              borderColor: "rgba(26,51,0,0.18)",
              color: INK,
            }}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 text-amber-700 mt-0.5" />
            <div>
              <strong>Important note:</strong> Even if your date is further away, your customers may not be.
              Large buyers are expected to accept only invoices carrying a valid IRN, so smaller suppliers feel the pressure early.
            </div>
          </div>
        </motion.div>

        {/* 2-Column: How it works & Why choose MyTaxFiling */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-14">
          {/* How it works (3 steps) */}
          <motion.div
            {...rev(rm, 24, 0.1)}
            className="rounded-2xl p-7 sm:p-9 flex flex-col justify-between"
            style={{
              backgroundColor: TEAL,
              border: `1.5px solid ${INK}`,
              boxShadow: "4px 4px 0px 0px #18623f",
            }}
          >
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileCheck2 className="w-5 h-5" style={{ color: INK }} />
                <h3
                  className="text-2xl font-extrabold"
                  style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  How it works
                </h3>
              </div>
              <p className="text-sm opacity-70 mb-6" style={{ color: INK }}>
                Three simple stages from invoice draft to certified submission.
              </p>

              <div className="space-y-4">
                {businessSteps.map((s, idx) => (
                  <div
                    key={s.step}
                    className="p-5 rounded-xl bg-white/70 border border-[#18623f]/15 flex items-start gap-4"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0"
                      style={{ backgroundColor: INK, color: CREAM }}
                    >
                      0{idx + 1}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-base mb-1" style={{ color: INK }}>
                        {s.step}
                      </h4>
                      <p className="text-sm leading-relaxed" style={{ color: INK, opacity: 0.75 }}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 text-xs font-mono opacity-60" style={{ color: INK }}>
              Pre-submission format checks · IRN &amp; QR auto-embedded
            </div>
          </motion.div>

          {/* Why choose MyTaxFiling */}
          <motion.div
            {...rev(rm, 24, 0.16)}
            className="rounded-2xl p-7 sm:p-9 flex flex-col justify-between"
            style={{
              backgroundColor: INK,
              color: CREAM,
              border: `1.5px solid ${INK}`,
              boxShadow: "4px 4px 0px 0px #a8e5e5",
            }}
          >
            <div>
              <span
                className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                style={{ backgroundColor: TEAL, color: INK }}
              >
                ENTERPRISE &amp; SME STRENGTH
              </span>
              <h3
                className="text-2xl font-extrabold mb-6"
                style={{ color: CREAM, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Why choose MyTaxFiling
              </h3>

              <ul className="space-y-4 mb-6">
                {b2bBenefits.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-sm leading-snug">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: TEAL, color: INK }}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <span style={{ color: CREAM, opacity: 0.9 }}>{b}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 border-t border-white/15">
              <p className="text-xs text-white/60 leading-relaxed mb-2">
                Timelines are based on NRS public notices and may change. Confirm current requirements with the NRS.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-[#a8e5e5]">
                <ShieldCheck className="w-4 h-4" />
                Audit-ready archival &amp; tracking
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-[#18623f]/15">
          <a
            href="#contact"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg text-base font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
            style={{
              backgroundColor: INK,
              color: CREAM,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Talk to us about e-invoicing
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>

          <Link
            to="/e-invoicing"
            className="text-sm font-bold hover:underline inline-flex items-center gap-1.5"
            style={{ color: INK }}
          >
            Read the full e-invoicing guide →
          </Link>
        </div>
      </div>
    </section>
  );
}
