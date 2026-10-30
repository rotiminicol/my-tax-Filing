import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight, Home, ReceiptText, Sparkles, Building2, CheckCircle2 } from "lucide-react";

const INK = "#18623f";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const MINT = "#d5f5c2";
const TEAL = "#a8e5e5";
const PENCIL = "#b6b6b6";

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.15 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function ChoosePathSection() {
  const rm = Boolean(useReducedMotion());

  return (
    <section
      id="choose-path"
      className="relative py-20 md:py-28 overflow-hidden"
      style={{ backgroundColor: "#f5f2ec" }}
    >
      <div
        className="h-px w-full absolute top-0"
        style={{ backgroundColor: PENCIL, opacity: 0.35 }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-4">
          <motion.div
            {...rev(rm, 12, 0)}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold"
            style={{
              backgroundColor: YELLOW,
              color: INK,
              fontFamily: "'Roboto Mono', monospace",
              letterSpacing: "0.06em",
              border: "1px solid rgba(26,51,0,0.12)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            CHOOSE YOUR PATH
          </motion.div>

          <motion.h2
            {...rev(rm, 18, 0.08)}
            className="font-extrabold text-3xl sm:text-4xl md:text-5xl"
            style={{
              fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
              color: INK,
              letterSpacing: "-0.01em",
              lineHeight: 1.1,
            }}
          >
            Built for Nigeria's modern{" "}
            <span
              style={{
                backgroundColor: YELLOW,
                padding: "0 8px 3px",
                borderRadius: 4,
              }}
            >
              tax ecosystem
            </span>
          </motion.h2>

          <motion.p
            {...rev(rm, 12, 0.14)}
            className="text-base sm:text-lg"
            style={{
              color: INK,
              opacity: 0.65,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Select your profile to explore dedicated compliance tools, calculators, and automated workflows.
          </motion.p>
        </div>

        {/* 2 Path Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Card A: Individuals and Tenants */}
          <motion.div
            {...rev(rm, 24, 0.05)}
            whileHover={
              rm
                ? undefined
                : {
                    y: -6,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }
            }
            className="flex flex-col"
          >
            <Link
              to="/rent-relief"
              className="group relative flex flex-col justify-between rounded-2xl p-8 md:p-10 flex-1 transition-all duration-300"
              style={{
                backgroundColor: MINT,
                border: `1.5px solid ${INK}`,
                boxShadow: "4px 4px 0px 0px #18623f",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: INK,
                      color: CREAM,
                    }}
                  >
                    <Home className="w-7 h-7" />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                    style={{
                      backgroundColor: CREAM,
                      color: INK,
                      border: `1px solid ${INK}`,
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                  >
                    Card A · B2C
                  </span>
                </div>

                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{
                    color: INK,
                    opacity: 0.65,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  Individuals and tenants
                </p>

                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-4"
                  style={{
                    color: INK,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    lineHeight: 1.15,
                  }}
                >
                  Claim up to ₦500,000 in rent relief
                </h3>

                <p
                  className="text-base sm:text-lg leading-relaxed mb-6"
                  style={{
                    color: INK,
                    opacity: 0.75,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Sign your tenancy agreement, record your rent and keep the proof you need to claim. See how it works.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {[
                    "Standard e-signed tenancy agreement",
                    "Automated digital rent receipt trail",
                    "Claim-ready document vault for the tax office",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: INK }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pt-5 flex items-center justify-between border-t"
                style={{ borderColor: "rgba(26,51,0,0.18)" }}
              >
                <span
                  className="font-bold text-base group-hover:underline inline-flex items-center gap-2"
                  style={{ color: INK }}
                >
                  See how it works
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="text-xs font-mono font-semibold" style={{ color: INK, opacity: 0.6 }}>
                  /rent-relief →
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Card B: Businesses */}
          <motion.div
            {...rev(rm, 24, 0.12)}
            whileHover={
              rm
                ? undefined
                : {
                    y: -6,
                    transition: { type: "spring", stiffness: 300, damping: 20 },
                  }
            }
            className="flex flex-col"
          >
            <Link
              to="/e-invoicing"
              className="group relative flex flex-col justify-between rounded-2xl p-8 md:p-10 flex-1 transition-all duration-300"
              style={{
                backgroundColor: TEAL,
                border: `1.5px solid ${INK}`,
                boxShadow: "4px 4px 0px 0px #18623f",
              }}
            >
              <div>
                <div className="flex items-center justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{
                      backgroundColor: INK,
                      color: CREAM,
                    }}
                  >
                    <Building2 className="w-7 h-7" />
                  </div>
                  <span
                    className="text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
                    style={{
                      backgroundColor: CREAM,
                      color: INK,
                      border: `1px solid ${INK}`,
                      fontFamily: "'Roboto Mono', monospace",
                    }}
                  >
                    Card B · B2B
                  </span>
                </div>

                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{
                    color: INK,
                    opacity: 0.65,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  Businesses
                </p>

                <h3
                  className="text-2xl sm:text-3xl font-extrabold mb-4"
                  style={{
                    color: INK,
                    fontFamily: "'Bricolage Grotesque', sans-serif",
                    lineHeight: 1.15,
                  }}
                >
                  Issue NRS-compliant e-invoices
                </h3>

                <p
                  className="text-base sm:text-lg leading-relaxed mb-6"
                  style={{
                    color: INK,
                    opacity: 0.75,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Validate, stamp and submit invoices without building your own integration. See how it works.
                </p>

                <ul className="space-y-2.5 mb-8">
                  {[
                    "Automated Invoice Reference Number (IRN) generation",
                    "Cryptographic stamp and verified QR code embedding",
                    "Compatible with ERP, accounting software, and direct billing",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-sm font-medium" style={{ color: INK }}>
                      <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className="pt-5 flex items-center justify-between border-t"
                style={{ borderColor: "rgba(26,51,0,0.18)" }}
              >
                <span
                  className="font-bold text-base group-hover:underline inline-flex items-center gap-2"
                  style={{ color: INK }}
                >
                  See how it works
                  <ArrowUpRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="text-xs font-mono font-semibold" style={{ color: INK, opacity: 0.6 }}>
                  /e-invoicing →
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
