import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUp, ChevronRight, Mail, MapPin, Phone } from "lucide-react";
import FiscalBrand from "./FiscalBrand";

const INK = "#18623f";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function rev(rm: boolean, y = 16, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function FiscalFooter() {
  const year = new Date().getFullYear();
  const rm = Boolean(useReducedMotion());

  return (
    <footer
      className="relative overflow-hidden"
      style={{ backgroundColor: INK, borderTop: `1px solid ${INK}` }}
    >
      <div className="relative max-w-[1200px] mx-auto px-5 md:px-10 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-10 mb-12">
          {/* ── Brand ── */}
          <motion.div {...rev(rm, 16, 0)} className="lg:col-span-2 space-y-5">
            <FiscalBrand />
            <p
              className="text-sm leading-relaxed max-w-sm"
              style={{
                color: CREAM,
                opacity: 0.75,
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.8,
              }}
            >
              Automating tax compliance and document management for the modern
              Nigerian professional.
            </p>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{
                backgroundColor: YELLOW,
                color: INK,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Trusted by 15,000+ Nigerians
            </div>
          </motion.div>

          {/* ── Features ── */}
          <motion.div {...rev(rm, 16, 0.06)}>
            <h4
              className="text-xs font-bold mb-5 uppercase tracking-widest"
              style={{
                color: CREAM,
                opacity: 0.35,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Features
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/rent-relief", label: "Rent Relief (for Individuals)" },
                { to: "/e-invoicing", label: "E‑Invoicing (for Businesses)" },
                { to: "/taxes", label: "Tax Filing" },
                { to: "/document-renewal", label: "Document Renewal" },
              ].map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1 text-sm py-0.5 opacity-75 hover:opacity-100 transition-opacity duration-200"
                    style={{
                      color: CREAM,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    <ChevronRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{ color: YELLOW }}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Company ── */}
          <motion.div {...rev(rm, 16, 0.1)}>
            <h4
              className="text-xs font-bold mb-5 uppercase tracking-widest"
              style={{
                color: CREAM,
                opacity: 0.35,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { to: "/contact", label: "Contact Us" },
                { to: "/legal/privacy", label: "Privacy Policy" },
                { to: "/legal/terms", label: "Terms of Use" },
                { to: "/news", label: "Tax Updates" },
              ].map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group flex items-center gap-1 text-sm py-0.5 opacity-75 hover:opacity-100 transition-opacity duration-200"
                    style={{
                      color: CREAM,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    <ChevronRight
                      className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all duration-200"
                      style={{ color: YELLOW }}
                    />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {l.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* ── Contact ── */}
          <motion.div {...rev(rm, 16, 0.14)}>
            <h4
              className="text-xs font-bold mb-5 uppercase tracking-widest"
              style={{
                color: CREAM,
                opacity: 0.35,
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              Contact
            </h4>
            <ul
              className="space-y-4 text-sm"
              style={{
                color: CREAM,
                opacity: 0.75,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              <li className="flex items-start gap-3">
                <Mail
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: YELLOW }}
                />
                <span>hello@taxfiling.com.ng</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: YELLOW }}
                />
                <span>+234 (0) 1 234 5678</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin
                  className="w-4 h-4 mt-0.5 shrink-0"
                  style={{ color: YELLOW }}
                />
                <span>Victoria Island, Lagos, Nigeria</span>
              </li>
            </ul>
          </motion.div>
        </div>

        {/* ── Bottom bar ── */}
        <motion.div
          {...rev(rm, 8, 0.1)}
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1px solid rgba(252,250,245,0.10)" }}
        >
          <div className="max-w-2xl">
            <p
              className="text-xs font-medium"
              style={{
                color: CREAM,
                opacity: 0.85,
                fontFamily: "Inter, system-ui, sans-serif",
                lineHeight: 1.75,
              }}
            >
              © 2026 MyTaxFiling. taxfiling.com.ng
            </p>
            <p
              className="text-[11px] mt-1.5 leading-relaxed"
              style={{
                color: CREAM,
                opacity: 0.5,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              General information only, not tax or legal advice. Tax rules, thresholds and procedures may change. Please confirm current requirements with the Nigeria Revenue Service or a qualified tax adviser.
            </p>
          </div>
          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-md transition-all duration-200 hover:-translate-y-0.5 hover:opacity-90 active:scale-[0.95]"
            aria-label="Back to top"
            style={{ backgroundColor: YELLOW, border: `1px solid ${YELLOW}` }}
          >
            <ArrowUp className="w-4 h-4" style={{ color: INK }} />
          </button>
        </motion.div>
      </div>
    </footer>
  );
}
