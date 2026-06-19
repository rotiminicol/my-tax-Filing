import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, TrendingUp, Users } from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

const stats = [
  { label: "Active Users", value: "15,000+", Icon: Users },
  { label: "Tax Filings Done", value: "120,000+", Icon: TrendingUp },
  { label: "Compliance Rate", value: "99.8%", Icon: Shield },
];

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function FinalCtaSection() {
  const rm = Boolean(useReducedMotion());

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
        {/* ── Stats row ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-16 md:mb-20">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              {...rev(rm, 24, index * 0.1)}
              className="text-center rounded-xl p-8"
              style={{
                backgroundColor: "#f5f2ec",
                border: `1px solid ${PENCIL}`,
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: YELLOW, border: `1px solid ${INK}` }}
              >
                <stat.Icon className="w-5 h-5" style={{ color: INK }} />
              </div>
              <div
                className="text-4xl font-bold mb-1"
                style={{
                  color: INK,
                  fontFamily: "Inter, system-ui, sans-serif",
                  letterSpacing: "-0.02em",
                }}
              >
                {stat.value}
              </div>
              <p
                className="text-sm font-medium"
                style={{
                  color: INK,
                  opacity: 0.5,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* ── CTA card ── */}
        <motion.div
          initial={rm ? false : { opacity: 0, y: 32, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
          }}
          className="relative overflow-hidden rounded-2xl p-12 md:p-16 text-center"
          style={{ backgroundColor: INK, border: `1px solid ${INK}` }}
        >
          {/* Subtle grid pattern */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full opacity-[0.04]"
            aria-hidden="true"
          >
            <defs>
              <pattern
                id="cta-grid"
                width="48"
                height="48"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 48 0 L 0 0 0 48"
                  fill="none"
                  stroke="#fcfaf5"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>

          <div className="relative z-10 space-y-6">
            <motion.div
              {...rev(rm, 14, 0.1)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium"
              style={{
                backgroundColor: YELLOW,
                color: INK,
                fontFamily: "'Roboto Mono', monospace",
                letterSpacing: "0.04em",
              }}
            >
              Join 15,000+ Nigerians
            </motion.div>

            <motion.h2
              {...rev(rm, 22, 0.16)}
              className="max-w-3xl mx-auto leading-none"
              style={{
                fontFamily:
                  "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 3.8rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: CREAM,
                lineHeight: 1.05,
              }}
            >
              Ready to simplify your{" "}
              <span
                style={{
                  backgroundColor: YELLOW,
                  color: INK,
                  padding: "0 8px 4px",
                  borderRadius: 4,
                }}
              >
                taxes?
              </span>
            </motion.h2>

            <motion.p
              {...rev(rm, 14, 0.22)}
              className="text-base md:text-lg max-w-xl mx-auto leading-relaxed"
              style={{
                color: CREAM,
                opacity: 0.65,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Join thousands of Nigerians who have automated their compliance
              and claimed their financial sovereignty.
            </motion.p>

            <motion.div
              {...rev(rm, 12, 0.28)}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2"
            >
              <Link
                to="/customer-dashboard/signup"
                className="group inline-flex items-center justify-center gap-2 px-10 py-4 rounded-md text-base font-medium transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-[0.97]"
                style={{
                  backgroundColor: YELLOW,
                  color: INK,
                  fontFamily: "Inter, system-ui, sans-serif",
                  boxShadow: "rgba(0,0,0,0.15) 0px 2px 6px",
                }}
              >
                Start for free
                <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <p
                className="text-sm"
                style={{
                  color: CREAM,
                  opacity: 0.4,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                No credit card required · Free forever plan
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
