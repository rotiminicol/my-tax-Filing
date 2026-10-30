import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, Zap } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const INK = "#18623f";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

const TRUST_ITEMS = [
  "FIRS Compliant",
  "LIRS Approved",
  "256‑bit SSL",
  "15,000+ Users",
];

export default function HeroSection() {
  const rm = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  // Gentle scroll-linked parallax on the dashboard mockup
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 30]);

  // Helper: page-load entrance props. When rm is true, returns {} so the
  // motion.* element renders immediately with no animation.
  function ent(delay: number, y = 20) {
    if (rm) return {} as object;
    return {
      initial: { opacity: 0, y },
      animate: { opacity: 1, y: 0 },
      transition: {
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1] as number[],
        delay,
      },
    };
  }

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden flex flex-col items-center"
      style={{ backgroundColor: CREAM, paddingTop: 140, paddingBottom: 0 }}
    >
      {/* Subtle dot-grid texture — same opacity as original */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />

      {/* ── Tagline badge ── */}
      <motion.div
        {...ent(0.04, 12)}
        className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-8"
        style={{
          backgroundColor: YELLOW,
          color: INK,
          fontFamily: "'Roboto Mono', monospace",
          letterSpacing: "0.06em",
          border: "1px solid rgba(26,51,0,0.12)",
        }}
      >
        <Zap className="w-3.5 h-3.5" fill={INK} />
        Nigeria's All-in-One Fiscal Platform
      </motion.div>

      {/* ── Headline ── */}
      <motion.h1
        {...ent(0.1, 28)}
        className="relative z-10 text-center font-extrabold max-w-3xl mx-auto px-5"
        style={{
          fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
          fontSize: "clamp(3.25rem, 8.5vw, 5.75rem)",
          letterSpacing: "-0.02em",
          color: INK,
          lineHeight: 1.0,
        }}
      >
        Taxes. Receipts.
        <br />
        <span
          style={{
            backgroundColor: YELLOW,
            padding: "0 10px 5px",
            borderRadius: 5,
            display: "inline-block",
            marginTop: "0.06em",
          }}
        >
          Simplified.
        </span>
      </motion.h1>

      {/* ── Subtext ── */}
      <motion.p
        {...ent(0.18, 18)}
        className="relative z-10 mt-7 text-center max-w-[560px] px-5"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 17.5,
          color: INK,
          opacity: 0.62,
          lineHeight: 1.65,
        }}
      >
        Rent receipts, tax filing, document renewal, and e‑invoicing — all in
        one platform built for Nigerian individuals and businesses.
      </motion.p>

      {/* ── CTAs ── */}
      <motion.div
        {...ent(0.24, 14)}
        className="relative z-10 flex flex-col sm:flex-row items-center gap-3 mt-9 px-5"
      >
        <Link
          to="/customer-dashboard/signup"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-[0.9375rem] font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
          style={{
            backgroundColor: INK,
            color: CREAM,
            fontFamily: "Inter, system-ui, sans-serif",
            boxShadow:
              "0 2px 8px rgba(26,51,0,0.14), 0 1px 2px rgba(26,51,0,0.08)",
          }}
        >
          → Get Started Free
        </Link>
        <Link
          to="/taxes"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-[0.9375rem] font-semibold border transition-all duration-200 hover:-translate-y-0.5 hover:bg-stone-50 active:scale-[0.97]"
          style={{
            color: INK,
            borderColor: "rgba(26,51,0,0.18)",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          See How It Works
        </Link>
      </motion.div>

      {/* ── Microcopy ── */}
      <motion.p
        {...ent(0.3, 0)}
        className="relative z-10 mt-3.5 text-sm"
        style={{ color: PENCIL, fontFamily: "Inter, system-ui, sans-serif" }}
      >
        No credit card required. Free forever plan.
      </motion.p>

      {/* ── Trust strip ── */}
      <motion.div
        {...ent(0.36, 10)}
        className="relative z-10 flex flex-wrap items-center justify-center gap-6 mt-9 px-5"
      >
        {TRUST_ITEMS.map((text) => (
          <div
            key={text}
            className="flex items-center gap-1.5 text-sm font-medium"
            style={{
              color: INK,
              opacity: 0.45,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            {text}
          </div>
        ))}
      </motion.div>

      {/* ── Dashboard mockup ── */}
      <motion.div
        {...ent(0.44, 40)}
        style={{ y: mockupY }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-5 mt-14"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: `1px solid ${PENCIL}`,
            boxShadow:
              "0 4px 24px rgba(26,51,0,0.08), 0 1px 3px rgba(26,51,0,0.05)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-1.5 px-3 py-2.5 border-b"
            style={{ backgroundColor: "#f5f5f0", borderColor: PENCIL }}
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ff5f57" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#ffbd2e" }}
            />
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "#28c840" }}
            />
            <div
              className="ml-3 flex-1 h-6 rounded flex items-center px-3 text-[11px] truncate"
              style={{
                backgroundColor: "#ece8e0",
                color: "#999",
                fontFamily: "'Roboto Mono', monospace",
              }}
            >
              app.mytaxfiling.ng
            </div>
          </div>
          <div style={{ backgroundColor: CREAM }}>
            <DashboardMockup />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
