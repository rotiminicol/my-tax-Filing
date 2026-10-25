import { useRef, useEffect } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Link } from "react-router-dom";
import { ShieldCheck, UserCheck, Building2, ArrowRight } from "lucide-react";
import DashboardMockup from "./DashboardMockup";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

const TRUST_ITEMS = [
  "Nigeria Tax Act 2025 Ready",
  "NRS E-Invoicing Compliant",
  "256-bit Bank-Grade SSL",
  "15,000+ Nigerian Filers",
];

export default function LandingHero() {
  const rm = Boolean(useReducedMotion());
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    document.title = "MyTaxFiling | Nigeria Tax Compliance, Simplified";
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
      metaDesc.setAttribute("content", "MyTaxFiling helps Nigerian tenants claim rent relief and helps businesses meet the NRS e-invoicing requirements, with the paperwork handled in one place.");
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const mockupY = useTransform(scrollYProgress, [0, 1], [0, rm ? 0 : 30]);

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
      style={{ backgroundColor: CREAM, paddingTop: 130, paddingBottom: 40 }}
    >
      {/* Subtle dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(${INK} 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
        }}
      />


      {/* Headline */}
      <motion.h1
        {...ent(0.1, 28)}
        className="relative z-10 text-center font-extrabold max-w-4xl mx-auto px-5"
        style={{
          fontFamily: "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
          fontSize: "clamp(2.75rem, 6.8vw, 5.25rem)",
          letterSpacing: "-0.02em",
          color: INK,
          lineHeight: 1.08,
        }}
      >
        Pay the tax you owe.
        <br />
        <span
          style={{
            backgroundColor: YELLOW,
            padding: "0 14px 6px",
            borderRadius: 6,
            display: "inline-block",
            marginTop: "0.08em",
          }}
        >
          Keep the relief you are due.
        </span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        {...ent(0.18, 18)}
        className="relative z-10 mt-7 text-center max-w-2xl px-5"
        style={{
          fontFamily: "Inter, system-ui, sans-serif",
          fontSize: 18,
          color: INK,
          opacity: 0.72,
          lineHeight: 1.65,
        }}
      >
        MyTaxFiling helps Nigerian tenants claim rent relief and helps businesses meet
        the NRS e-invoicing requirements, with the paperwork handled in one place.
      </motion.p>

      {/* Hero Buttons: Two paths */}
      <motion.div
        {...ent(0.24, 14)}
        className="relative z-10 flex flex-col sm:flex-row items-center gap-3.5 mt-9 px-5 w-full sm:w-auto"
      >
        <a
          href="#for-individuals"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-[0.9375rem] font-bold transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.97]"
          style={{
            backgroundColor: INK,
            color: CREAM,
            fontFamily: "Inter, system-ui, sans-serif",
            boxShadow: "0 2px 8px rgba(26,51,0,0.18)",
          }}
        >
          <UserCheck className="w-4 h-4 text-[#ffe95c]" />
          I'm an individual
          <ArrowRight className="w-4 h-4 ml-0.5" />
        </a>
        <a
          href="#for-businesses"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-lg text-[0.9375rem] font-bold border transition-all duration-200 hover:-translate-y-0.5 hover:bg-white active:scale-[0.97]"
          style={{
            color: INK,
            borderColor: INK,
            backgroundColor: "rgba(255,255,255,0.7)",
            fontFamily: "Inter, system-ui, sans-serif",
          }}
        >
          <Building2 className="w-4 h-4" />
          I run a business
          <ArrowRight className="w-4 h-4 ml-0.5 opacity-60" />
        </a>
      </motion.div>

      {/* Trust strip */}
      <motion.div
        {...ent(0.32, 10)}
        className="relative z-10 flex flex-wrap items-center justify-center gap-6 mt-9 px-5"
      >
        {TRUST_ITEMS.map((text) => (
          <div
            key={text}
            className="flex items-center gap-1.5 text-xs sm:text-sm font-medium"
            style={{
              color: INK,
              opacity: 0.65,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            {text}
          </div>
        ))}
      </motion.div>

      {/* Dashboard Preview / Mockup */}
      <motion.div
        {...ent(0.40, 30)}
        style={{ y: mockupY }}
        className="relative z-10 w-full max-w-[1100px] mx-auto px-5 mt-12"
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: `1.5px solid ${INK}`,
            boxShadow: "0 12px 36px rgba(26,51,0,0.10)",
          }}
        >
          {/* Browser chrome */}
          <div
            className="flex items-center gap-1.5 px-4 py-3 border-b"
            style={{ backgroundColor: "#f5f5f0", borderColor: PENCIL }}
          >
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <div
              className="ml-4 flex-1 h-7 rounded-md flex items-center px-3 text-[11px] font-mono truncate"
              style={{
                backgroundColor: "#ece8e0",
                color: INK,
                opacity: 0.8,
              }}
            >
              https://taxfiling.com.ng · Unified Compliance Portal
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
