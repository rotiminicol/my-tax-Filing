import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  FileSpreadsheet,
  ReceiptText,
  Scale,
} from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";
const MINT = "#d5f5c2";
const TEAL = "#a8e5e5";
const BLUSH = "#f6d0ff";

const tools = [
  {
    title: "Tax Filing",
    sub: "For Individuals & Businesses",
    description:
      "File PIT, VAT, and corporate tax returns fully compliant with FIRS and LIRS — without leaving your browser. Our AI pre-fills 90% of your forms.",
    Icon: Scale,
    href: "/taxes",
    badge: "Most Popular",
    stat1: "40+ hrs saved / year",
    stat2: "FIRS Approved",
    featured: true,
    bg: TEAL,
  },
  {
    title: "Rent Receipts",
    sub: "For Landlords & Tenants",
    description:
      "Generate legally-compliant Nigerian rent receipts in under 60 seconds.",
    Icon: ReceiptText,
    href: "/rent-receipt",
    badge: undefined as string | undefined,
    stat1: "< 60 seconds",
    stat2: "LIRS Format",
    featured: false,
    bg: MINT,
  },
  {
    title: "Document Renewal",
    sub: "For Vehicle & Business Owners",
    description:
      "Smart reminders and renewal for vehicle papers, business permits, and more.",
    Icon: Clock,
    href: "/document-renewal",
    badge: "New" as string | undefined,
    stat1: "Auto Reminders",
    stat2: "Multi-doc",
    featured: false,
    bg: BLUSH,
  },
  {
    title: "E‑Invoicing",
    sub: "For Freelancers & SMEs",
    description:
      "Create FIRS-compliant invoices with automatic VAT calculations and PDF export.",
    Icon: FileSpreadsheet,
    href: "/e-invoicing",
    badge: undefined as string | undefined,
    stat1: "Auto VAT calc",
    stat2: "PDF Export",
    featured: false,
    bg: YELLOW,
  },
];

const MARQUEE_ITEMS = [
  "Tax Filing",
  "Rent Receipts",
  "E‑Invoicing",
  "Document Renewal",
  "FIRS Compliant",
  "LIRS Approved",
  "15k+ Users",
  "VAT Returns",
];

// Scroll-reveal helper — returns props object or {} for reduced-motion users
function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.18 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function ToolsSection() {
  const rm = Boolean(useReducedMotion());
  const featured = tools.filter((t) => t.featured);
  const regular = tools.filter((t) => !t.featured);

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: CREAM }}
    >
      <div
        className="h-px w-full"
        style={{ backgroundColor: PENCIL, opacity: 0.3 }}
      />

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 pt-20">
        {/* ── Header ── */}
        <div className="mb-14">
          <motion.div
            {...rev(rm, 14, 0)}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{
              backgroundColor: YELLOW,
              color: INK,
              fontFamily: "'Roboto Mono', monospace",
              letterSpacing: "0.04em",
            }}
          >
            Smart Solutions
          </motion.div>

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <motion.h2
              {...rev(rm, 20, 0.06)}
              className="leading-none max-w-lg"
              style={{
                fontFamily:
                  "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                fontWeight: 800,
                letterSpacing: "-0.01em",
                color: INK,
                lineHeight: 1.05,
              }}
            >
              Every Nigerian{" "}
              <span
                style={{
                  backgroundColor: YELLOW,
                  padding: "0 6px 3px",
                  borderRadius: 3,
                  display: "inline",
                }}
              >
                fiscal tool
              </span>{" "}
              in one place
            </motion.h2>

            <motion.p
              {...rev(rm, 12, 0.12)}
              className="text-base max-w-xs"
              style={{
                color: INK,
                opacity: 0.5,
                fontFamily: "Inter, system-ui, sans-serif",
              }}
            >
              Tailored for individuals and businesses navigating Nigerian
              compliance.
            </motion.p>
          </div>
        </div>

        {/* ── Bento grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Featured card */}
          {featured.map((tool) => (
            <motion.div
              key={tool.title}
              {...rev(rm, 28, 0)}
              whileHover={
                rm
                  ? undefined
                  : {
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      },
                    }
              }
              className="lg:col-span-2"
            >
              <Link
                to={tool.href}
                className="group relative flex flex-col rounded-xl p-7 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(26,51,0,0.12)]"
                style={{
                  backgroundColor: tool.bg,
                  border: `1px solid ${INK}`,
                  boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px",
                }}
              >
                {tool.badge && (
                  <span
                    className="absolute top-5 right-5 text-[11px] font-medium px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: INK,
                      color: CREAM,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {tool.badge}
                  </span>
                )}

                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: "rgba(26,51,0,0.12)",
                    border: "1px solid rgba(26,51,0,0.20)",
                  }}
                >
                  <tool.Icon
                    className="w-5 h-5"
                    style={{ color: INK }}
                    strokeWidth={1.75}
                  />
                </div>

                <p
                  className="text-xs font-medium uppercase tracking-widest mb-1.5"
                  style={{
                    color: INK,
                    opacity: 0.55,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {tool.sub}
                </p>
                <h3
                  className="text-2xl md:text-3xl font-bold mb-3"
                  style={{
                    color: INK,
                    fontFamily: "Inter, system-ui, sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tool.title}
                </h3>
                <p
                  className="text-sm md:text-base leading-relaxed mb-7 max-w-md"
                  style={{
                    color: INK,
                    opacity: 0.65,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {tool.description}
                </p>

                <div className="flex gap-2.5 mb-7">
                  {[tool.stat1, tool.stat2].map((s) => (
                    <span
                      key={s}
                      className="text-xs font-medium px-3 py-1.5 rounded-full"
                      style={{
                        backgroundColor: "rgba(26,51,0,0.10)",
                        color: INK,
                        border: "1px solid rgba(26,51,0,0.18)",
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-auto flex items-center gap-1.5 text-sm font-semibold pt-5"
                  style={{
                    borderTop: "1px solid rgba(26,51,0,0.18)",
                    color: INK,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Start Filing Free
                  <ArrowUpRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}

          {/* Regular cards */}
          {regular.map((tool, index) => (
            <motion.div
              key={tool.title}
              {...rev(rm, 28, (index + 1) * 0.08)}
              whileHover={
                rm
                  ? undefined
                  : {
                      y: -5,
                      transition: {
                        type: "spring",
                        stiffness: 320,
                        damping: 22,
                      },
                    }
              }
            >
              <Link
                to={tool.href}
                className="group relative flex flex-col rounded-xl p-6 overflow-hidden transition-shadow duration-300 hover:shadow-[0_8px_28px_rgba(26,51,0,0.10)]"
                style={{
                  backgroundColor: tool.bg,
                  border: `1px solid ${INK}`,
                  boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px",
                }}
              >
                {tool.badge && (
                  <span
                    className="absolute top-4 right-4 text-[11px] font-medium px-2.5 py-1 rounded-full"
                    style={{
                      backgroundColor: INK,
                      color: CREAM,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    {tool.badge}
                  </span>
                )}

                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{
                    backgroundColor: "rgba(26,51,0,0.12)",
                    border: "1px solid rgba(26,51,0,0.20)",
                  }}
                >
                  <tool.Icon
                    className="w-5 h-5"
                    style={{ color: INK }}
                    strokeWidth={1.75}
                  />
                </div>

                <p
                  className="text-[10px] font-medium uppercase tracking-widest mb-1"
                  style={{
                    color: INK,
                    opacity: 0.5,
                    fontFamily: "'Roboto Mono', monospace",
                  }}
                >
                  {tool.sub}
                </p>
                <h3
                  className="text-lg font-bold mb-2"
                  style={{
                    color: INK,
                    fontFamily: "Inter, system-ui, sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {tool.title}
                </h3>
                <p
                  className="text-sm leading-relaxed flex-grow mb-5"
                  style={{
                    color: INK,
                    opacity: 0.6,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  {tool.description}
                </p>

                <div className="flex gap-2 mb-5">
                  {[tool.stat1, tool.stat2].map((s) => (
                    <span
                      key={s}
                      className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{
                        backgroundColor: "rgba(26,51,0,0.10)",
                        color: INK,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                <div
                  className="mt-auto flex items-center gap-1.5 text-xs font-semibold pt-4"
                  style={{
                    borderTop: "1px solid rgba(26,51,0,0.18)",
                    color: INK,
                    fontFamily: "Inter, system-ui, sans-serif",
                  }}
                >
                  Get Started
                  <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Marquee strip ── */}
        <motion.div
          {...rev(rm, 10, 0.1)}
          className="mt-8 overflow-hidden rounded-xl"
          style={{ border: `1px solid ${PENCIL}`, backgroundColor: "#f5f2ec" }}
        >
          <motion.div
            className="flex w-max"
            animate={rm ? undefined : { x: ["0%", "-50%"] }}
            transition={{
              duration: 24,
              ease: "linear",
              repeat: Infinity,
              repeatType: "loop",
            }}
          >
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span
                key={i}
                className="flex items-center gap-2.5 px-5 py-3 text-xs font-medium whitespace-nowrap"
                style={{
                  color: INK,
                  opacity: 0.45,
                  fontFamily: "Inter, system-ui, sans-serif",
                }}
              >
                <span
                  className="w-1 h-1 rounded-full flex-shrink-0"
                  style={{ backgroundColor: INK }}
                />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
