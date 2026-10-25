import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  ShieldCheck,
  QrCode,
  Fingerprint,
  ArrowRight,
  ChevronDown,
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Layers,
  HelpCircle,
  Database,
  RefreshCw,
  Send,
  Sparkles,
} from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const PENCIL = "#b6b6b6";
const MINT = "#d5f5c2";

const turnoverTable = [
  {
    tier: "Large",
    turnover: "₦5 billion and above",
    status: "Live. Enforcement and compliance monitoring under way",
    badge: "bg-emerald-100 text-emerald-900 border-emerald-300",
  },
  {
    tier: "Medium",
    turnover: "₦1 billion – ₦5 billion",
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

const howItWorks = [
  {
    n: "01",
    title: "Register.",
    desc: "Give us your business details and TIN. We handle onboarding.",
  },
  {
    n: "02",
    title: "Connect or create.",
    desc: "Raise invoices in MyTaxFiling, or link your existing accounting, ERP or billing system.",
  },
  {
    n: "03",
    title: "Validate.",
    desc: "We check mandatory fields and formats before submission so errors are caught early.",
  },
  {
    n: "04",
    title: "Submit and stamp.",
    desc: "One click sends the invoice to the NRS platform. We retrieve your IRN, cryptographic stamp and QR code.",
  },
  {
    n: "05",
    title: "Send and store.",
    desc: "Download the approved invoice, send it to your customer, and keep a secure, audit-ready record.",
  },
];

const whatYouGet = [
  {
    title: "Fewer rejected invoices",
    desc: "Pre-submission checks catch missing or mismatched data before the NRS sees it.",
  },
  {
    title: "Works with your systems",
    desc: "No need to replace your current software. Simple integrations for accounting tools.",
  },
  {
    title: "Safe, searchable records",
    desc: "Every invoice and its verification status organized in one secure audit vault.",
  },
  {
    title: "Deadline and status alerts",
    desc: "Know immediately what is pending, accepted, or rejected by buyers or tax offices.",
  },
  {
    title: "Cleaner VAT reporting",
    desc: "Validated transaction data flows straight into your regular input and output VAT returns.",
  },
  {
    title: "Local support",
    desc: "Nigerian tax and compliance specialists on call, not a detached overseas chatbot.",
  },
];

const whyItMatters = [
  "Avoid the penalties and enforcement action that apply to non-compliance",
  "Protect your customers' input VAT claims and your commercial relationships",
  "Cut manual paperwork, errors and payment disputes",
  "Get ready now instead of scrambling near your deadline",
];

const faqs = [
  {
    q: "Is e-invoicing mandatory in Nigeria?",
    a: "Yes. It's being introduced by turnover band under the NRS's national e-invoicing and Electronic Fiscal System.",
  },
  {
    q: "Who regulates it?",
    a: "The Nigeria Revenue Service (formerly FIRS), under the Nigeria Tax Administration Act and the Nigeria Tax Act.",
  },
  {
    q: "Do I need special software?",
    a: "You need a system that can produce and transmit compliant invoices. Most businesses use an approved Access Point Provider or integrator, like MyTaxFiling, rather than building their own connection.",
  },
  {
    q: "What happens if my invoice is rejected?",
    a: "You'll see the exact reason in MyTaxFiling, correct it and resubmit, or cancel and reissue immediately.",
  },
  {
    q: "Can I keep my accounting software?",
    a: "In most cases, yes. We connect directly to leading accounting packages, ERPs, or you can generate invoices right inside MyTaxFiling.",
  },
  {
    q: "I'm below ₦1 billion turnover. Should I wait?",
    a: "You have until 2027, but starting early avoids a last-minute scramble, and corporate enterprise customers may mandate compliant invoices much sooner.",
  },
  {
    q: "How much does it cost?",
    a: "We offer clear, transparent pricing with a free start tier and volume-based packages for high-frequency billing. Contact our team for an enterprise quote.",
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

export default function EInvoicingPageContent() {
  const rm = Boolean(useReducedMotion());
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = "E-Invoicing in Nigeria: Get NRS-Compliant with MyTaxFiling";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "Nigeria's e-invoicing mandate is rolling out by turnover. MyTaxFiling helps you issue, validate and submit compliant invoices without the technical headache.");
    }
  }, []);

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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <motion.div
                {...rev(rm, 12, 0)}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  backgroundColor: YELLOW,
                  color: INK,
                  fontFamily: "'Roboto Mono', monospace",
                  letterSpacing: "0.08em",
                  border: "1px solid rgba(26,51,0,0.14)",
                }}
              >
                NRS MERCHANT BUYER SOLUTION (MBS)
              </motion.div>

              <motion.h1
                {...rev(rm, 20, 0.08)}
                className="font-extrabold text-4xl sm:text-5xl md:text-6xl tracking-tight leading-[1.08]"
                style={{
                  fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                  color: INK,
                }}
              >
                E-invoicing that keeps you{" "}
                <span
                  style={{
                    backgroundColor: YELLOW,
                    padding: "0 10px 4px",
                    borderRadius: 6,
                    display: "inline-block",
                  }}
                >
                  compliant, not confused
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
                Every invoice you issue in Nigeria is moving onto the Nigeria Revenue Service's
                national e-invoicing platform. MyTaxFiling connects you to it so each invoice is
                validated, stamped and ready to send, without building anything yourself.
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
                  Get started
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
                <Link
                  to="/contact"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white active:scale-[0.98]"
                  style={{
                    borderColor: INK,
                    color: INK,
                    backgroundColor: "rgba(255,255,255,0.6)",
                  }}
                >
                  Talk to our team
                </Link>
              </motion.div>
            </div>

            {/* Visual: Live Invoice Card with IRN, Stamp, QR */}
            <motion.div {...rev(rm, 24, 0.2)} className="lg:col-span-5">
              <div
                className="rounded-2xl p-6 relative overflow-hidden"
                style={{
                  backgroundColor: TEAL,
                  border: `1.5px solid ${INK}`,
                  boxShadow: "5px 5px 0px 0px #1a3300",
                }}
              >
                <div className="flex items-center justify-between pb-4 border-b border-[#1a3300]/20 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-mono font-bold uppercase tracking-wider" style={{ color: INK }}>
                      NRS MBS Compliant
                    </span>
                  </div>
                  <span className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-white/70 border border-[#1a3300]/15" style={{ color: INK }}>
                    LIVE DEMO
                  </span>
                </div>

                <div className="bg-white/90 rounded-xl p-5 border border-[#1a3300]/15 space-y-4">
                  <div>
                    <p className="text-[10px] font-mono uppercase text-gray-500">Official Invoice Identifier</p>
                    <p className="text-sm font-mono font-extrabold text-[#1a3300]">IRN: 2026-NRS-84920-F7B1</p>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200">
                    <div className="flex items-center gap-2.5">
                      <Fingerprint className="w-5 h-5 text-emerald-800" />
                      <div>
                        <p className="text-xs font-bold text-emerald-950">Cryptographic Stamp</p>
                        <p className="text-[10px] text-emerald-700 font-mono">ECDSA-SHA256 Verified</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-200 text-emerald-900">
                      STAMPED
                    </span>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <div className="w-16 h-16 rounded-lg bg-white p-1.5 border border-[#1a3300]/20 flex items-center justify-center shrink-0">
                      <QrCode className="w-full h-full text-[#1a3300]" />
                    </div>
                    <div className="text-xs leading-snug" style={{ color: INK }}>
                      <p className="font-bold">Instant Buyer Verification</p>
                      <p className="text-[11px] opacity-70 mt-0.5">
                        Scannable QR code links directly to NRS MBS registry for instant tax verification.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs font-mono opacity-70" style={{ color: INK }}>
                  <span>UBL 2.1 XML Ready</span>
                  <span>Instant Audit-Ready Sync</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── 2. What is e-invoicing in Nigeria? ── */}
      <section className="py-20 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-3xl mb-12 space-y-4">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              REGULATORY FOUNDATION
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              What is e-invoicing in Nigeria?
            </h2>
            <p className="text-base sm:text-lg opacity-80 leading-relaxed" style={{ color: INK }}>
              E-invoicing means your invoices are no longer just PDFs sent by email. Each one is created
              in a structured digital format and checked by the Nigeria Revenue Service (NRS) through its
              Merchant Buyer Solution (MBS) before it counts as valid.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 shadow-sm space-y-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: YELLOW, color: INK, border: `1px solid ${INK}` }}
              >
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                Invoice Reference Number (IRN)
              </h3>
              <p className="text-sm opacity-70 leading-relaxed" style={{ color: INK }}>
                Its unique official ID assigned directly upon pre-validation through the MBS gateway.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 shadow-sm space-y-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: TEAL, color: INK, border: `1px solid ${INK}` }}
              >
                <Fingerprint className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                Cryptographic Stamp
              </h3>
              <p className="text-sm opacity-70 leading-relaxed" style={{ color: INK }}>
                Government-certified digital signature proving the invoice was securely validated and untampered.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 shadow-sm space-y-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: MINT, color: INK, border: `1px solid ${INK}` }}
              >
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                Verified QR Code
              </h3>
              <p className="text-sm opacity-70 leading-relaxed" style={{ color: INK }}>
                High-density digital 2D barcode enabling instant scanning and authentication by buyers and auditors.
              </p>
            </div>
          </div>

          <div
            className="p-5 rounded-2xl bg-[#1a3300] text-[#fcfaf5] text-sm sm:text-base leading-relaxed"
          >
            <strong>The result:</strong> Invoices that are traceable, verifiable and audit-ready, which means
            fewer fake invoices, fewer disputes and cleaner VAT records for both suppliers and corporate buyers.
          </div>
        </div>
      </section>

      {/* ── 3. Does it apply to my business? (Turnover table) ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: CREAM }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-3xl mb-12 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: YELLOW, color: INK }}
            >
              TURNOVER TIMELINE &amp; THRESHOLDS
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Does it apply to my business?
            </h2>
            <p className="text-base sm:text-lg opacity-70" style={{ color: INK }}>
              Yes, in phases based on annual turnover under the Nigeria Revenue Service directives:
            </p>
          </div>

          <div
            className="rounded-2xl p-7 sm:p-9 border mb-8 bg-[#f5f2ec]"
            style={{ borderColor: PENCIL, boxShadow: "4px 4px 0px 0px #1a3300" }}
          >
            <div className="overflow-x-auto rounded-xl border border-[#1a3300]/15 bg-white">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-[#f5f2ec] border-b border-[#1a3300]/15">
                    <th className="py-4 px-5 font-bold text-xs uppercase" style={{ color: INK }}>
                      Business size
                    </th>
                    <th className="py-4 px-5 font-bold text-xs uppercase" style={{ color: INK }}>
                      Annual turnover
                    </th>
                    <th className="py-4 px-5 font-bold text-xs uppercase" style={{ color: INK }}>
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1a3300]/10">
                  {turnoverTable.map((row) => (
                    <tr key={row.tier} className="hover:bg-stone-50">
                      <td className="py-4 px-5 font-extrabold text-base" style={{ color: INK }}>
                        {row.tier}
                      </td>
                      <td className="py-4 px-5 font-semibold" style={{ color: INK }}>
                        {row.turnover}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-block text-xs font-medium px-3 py-1.5 rounded-md border ${row.badge}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Buyer pressure warning callout */}
            <div
              className="mt-6 p-4 rounded-xl flex items-start gap-3 border text-xs sm:text-sm leading-relaxed"
              style={{
                backgroundColor: "rgba(255, 233, 92, 0.4)",
                borderColor: "rgba(26,51,0,0.18)",
                color: INK,
              }}
            >
              <AlertTriangle className="w-5 h-5 shrink-0 text-amber-800 mt-0.5" />
              <div>
                <strong>Commercial reality:</strong> Even if your date is further away, your customers may not be.
                Large buyers are expected to accept only invoices carrying a valid IRN, so smaller suppliers feel the pressure early.
              </div>
            </div>
          </div>

          <p className="text-xs font-mono opacity-60" style={{ color: INK }}>
            Timelines are based on NRS public notices and may change. Always confirm current requirements with the NRS.
          </p>
        </div>
      </section>

      {/* ── 4. How invoices are handled & Why compliance is hard ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="max-w-3xl mb-14 space-y-3">
            <span
              className="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full inline-block"
              style={{ backgroundColor: TEAL, color: INK, border: `1px solid ${INK}` }}
            >
              WORKFLOW &amp; PROTOCOLS
            </span>
            <h2
              className="text-3xl sm:text-4xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How invoices are handled
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-emerald-800">01 · B2B and B2G</span>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                Pre-Validation Clearance
              </h3>
              <p className="text-sm opacity-75 leading-relaxed" style={{ color: INK }}>
                The invoice is validated by the NRS before it goes to your customer. Your buyer needs a validated
                invoice to support its input VAT claims, so a non-compliant invoice can cost them money.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-amber-800">02 · B2C Transactions</span>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                High-Value Reporting
              </h3>
              <p className="text-sm opacity-75 leading-relaxed" style={{ color: INK }}>
                High-value sales (above ₦50,000) are reported to the platform shortly after issue, and a
                QR-coded stamp comes back for the transaction record.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-[#1a3300]/15 space-y-3">
              <span className="text-xs font-mono font-bold uppercase text-sky-800">03 · Review Window</span>
              <h3 className="font-extrabold text-lg" style={{ color: INK }}>
                Buyer Acceptance Window
              </h3>
              <p className="text-sm opacity-75 leading-relaxed" style={{ color: INK }}>
                Buyers can accept or reject an invoice within a set period after it is issued. Once that window closes,
                the invoice is final. MyTaxFiling tracks this for you so rejected invoices don't slip through.
              </p>
            </div>
          </div>

          {/* Why compliance is hard to do alone */}
          <div
            className="rounded-2xl p-8 sm:p-10 border"
            style={{
              backgroundColor: INK,
              color: CREAM,
              boxShadow: "4px 4px 0px 0px #ffe95c",
            }}
          >
            <div className="max-w-3xl space-y-4">
              <span
                className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                THE TECHNICAL HURDLE
              </span>
              <h3
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ color: CREAM, fontFamily: "'Bricolage Grotesque', sans-serif" }}
              >
                Why compliance is hard to do alone
              </h3>
              <p className="text-base sm:text-lg opacity-85 leading-relaxed">
                The technical bar is high: structured UBL-based formats, many mandatory data fields, digital signatures,
                secure authentication and API connections to a government platform. Most businesses shouldn't build and
                maintain that themselves, and don't need to. The NRS lets businesses connect through approved Access Point
                Providers and system integrators like MyTaxFiling.
              </p>
            </div>
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
              5 SIMPLE STEPS
            </span>
            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              How MyTaxFiling works
            </h2>
            <p className="text-base sm:text-lg opacity-70" style={{ color: INK }}>
              Seamless issuance, validation, and compliance tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {howItWorks.map((step) => (
              <div
                key={step.n}
                className="p-6 rounded-2xl border flex flex-col justify-between bg-[#f5f2ec] hover:-translate-y-1 transition-all duration-200"
                style={{ borderColor: PENCIL }}
              >
                <div>
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs mb-4"
                    style={{ backgroundColor: YELLOW, color: INK, border: `1px solid ${INK}` }}>
                    {step.n}
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: INK }}>
                    {step.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed opacity-75" style={{ color: INK }}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. What you get & Why it matters ── */}
      <section className="py-24 border-t border-[#1a3300]/15" style={{ backgroundColor: "#f5f2ec" }}>
        <div className="max-w-[1200px] mx-auto px-5 md:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mb-14">
            {/* What you get (6 items) */}
            <div
              className="lg:col-span-7 rounded-2xl p-8 sm:p-10 border bg-white flex flex-col justify-between"
              style={{ borderColor: PENCIL, boxShadow: "4px 4px 0px 0px #1a3300" }}
            >
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: TEAL, color: INK, border: `1px solid ${INK}` }}
                >
                  FEATURES &amp; VALUE
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-6"
                  style={{ color: INK, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  What you get
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {whatYouGet.map((item) => (
                    <div
                      key={item.title}
                      className="p-4 rounded-xl bg-[#f5f2ec] border border-[#1a3300]/10 space-y-1"
                    >
                      <h4 className="font-bold text-sm" style={{ color: INK }}>
                        • {item.title}
                      </h4>
                      <p className="text-xs leading-relaxed opacity-75" style={{ color: INK }}>
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Why it matters (4 items) */}
            <div
              className="lg:col-span-5 rounded-2xl p-8 sm:p-10 flex flex-col justify-between"
              style={{
                backgroundColor: INK,
                color: CREAM,
                boxShadow: "4px 4px 0px 0px #a8e5e5",
              }}
            >
              <div>
                <span
                  className="text-xs font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full inline-block mb-4"
                  style={{ backgroundColor: YELLOW, color: INK }}
                >
                  BUSINESS IMPACT
                </span>
                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-6"
                  style={{ color: CREAM, fontFamily: "'Bricolage Grotesque', sans-serif" }}
                >
                  Why it matters
                </h3>

                <ul className="space-y-4">
                  {whyItMatters.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-sm leading-snug">
                      <div
                        className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: TEAL, color: INK }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <span style={{ color: CREAM, opacity: 0.9 }}>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6 mt-6 border-t border-white/15 text-xs font-mono text-[#a8e5e5]">
                Avoid penalties · Preserve client trust
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
              Got questions about e-invoicing?
            </h2>
            <p className="text-base opacity-70" style={{ color: INK }}>
              Everything you need to know about the NRS mandate and integration options.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
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
      <section className="py-20 border-t border-[#1a3300]/15" style={{ backgroundColor: TEAL }}>
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
              NRS READINESS
            </span>

            <h2
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold"
              style={{
                fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                color: CREAM,
              }}
            >
              Ready to get e-invoicing sorted?
            </h2>

            <p className="text-base sm:text-lg max-w-xl mx-auto opacity-80 leading-relaxed">
              Register your business or book a free readiness check. We'll tell you where you stand and what to do next.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/customer-dashboard/signup"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                style={{ backgroundColor: YELLOW, color: INK }}
              >
                Start now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
              <Link
                to="/contact"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold border transition-all duration-200 hover:bg-white/10 active:scale-[0.98]"
                style={{ borderColor: CREAM, color: CREAM }}
              >
                Book a free consultation
              </Link>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="text-center max-w-2xl mx-auto mt-12 text-xs leading-relaxed opacity-60" style={{ color: INK }}>
            <strong>Disclaimer:</strong> This page is general information, not tax or legal advice.
            Regulations and timelines may change. Please confirm current requirements with the Nigeria Revenue Service.
          </div>
        </div>
      </section>
    </div>
  );
}
