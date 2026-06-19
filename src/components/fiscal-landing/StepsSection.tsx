import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { Zap } from "lucide-react";

const INK = "#1a3300";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";
const PENCIL = "#b6b6b6";

const STEPS_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCktWB19Rann8yGdZsskhXZbGGcSW2jBLYnUG16DdD-7_8EnzKoqwFNGN4CrYVMVqnMrm0MMwA6gfddvCk_hldFhnsfwGfLx4gT9g6vzjtXLAnDBtQnmj9AqQ7ZpMB0lArWd6pTaQ82wVTJMbBdtvYyAGWSYmn2gwK_fUsVSq4gL6iMdDvZkOr0Omr9d3ku1llszDyC106A37ajmA4E7bOV6hBk7hfxUS60eFWGWsF9GKtyLCHb4vgSm7xt9yX79pcsStcsoaPzLeUT";

const steps = [
  {
    n: "01",
    title: "Create your account",
    body: "Sign up with your BVN or Tax ID to securely initialize your digital tax vault.",
  },
  {
    n: "02",
    title: "Upload documents",
    body: "Snap or upload your payslips, invoices, and expense receipts. Our AI categorizes them automatically.",
  },
  {
    n: "03",
    title: "Get your filing done",
    body: "Review auto‑generated tax forms and submit directly to relevant authorities with one click.",
  },
];

function rev(rm: boolean, y = 20, delay = 0) {
  if (rm) return {} as object;
  return {
    initial: { opacity: 0, y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.2 },
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as number[], delay },
  };
}

export default function StepsSection() {
  const rm = Boolean(useReducedMotion());
  const imgRef = useRef<HTMLDivElement>(null);

  // Gentle parallax on the right image as user scrolls
  const { scrollYProgress } = useScroll({
    target: imgRef,
    offset: ["start end", "end start"],
  });
  const imgY = useTransform(
    scrollYProgress,
    [0, 1],
    [rm ? 0 : -14, rm ? 0 : 14],
  );

  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{ backgroundColor: "#f5f2ec" }}
    >
      <div
        className="h-px w-full absolute top-0 left-0 right-0"
        style={{ backgroundColor: PENCIL, opacity: 0.35 }}
      />
      <div
        className="h-px w-full absolute bottom-0 left-0 right-0"
        style={{ backgroundColor: PENCIL, opacity: 0.35 }}
      />

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          {/* ── Left: Steps ── */}
          <div className="space-y-10">
            <div className="space-y-5">
              <motion.div
                {...rev(rm, 14, 0)}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: YELLOW,
                  color: INK,
                  fontFamily: "'Roboto Mono', monospace",
                  letterSpacing: "0.04em",
                }}
              >
                How It Works
              </motion.div>

              <motion.h2
                {...rev(rm, 22, 0.06)}
                className="leading-none"
                style={{
                  fontFamily:
                    "'Bricolage Grotesque', 'Archivo Black', ui-sans-serif",
                  fontSize: "clamp(2.2rem, 4.5vw, 3.4rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.01em",
                  color: INK,
                  lineHeight: 1.08,
                }}
              >
                Get compliant{" "}
                <span
                  style={{
                    backgroundColor: YELLOW,
                    padding: "0 6px 3px",
                    borderRadius: 3,
                  }}
                >
                  in 3 steps
                </span>
              </motion.h2>
            </div>

            <div className="relative space-y-0">
              {/* Vertical connector line */}
              <div
                className="absolute left-[26px] top-12 bottom-12 w-px hidden sm:block"
                style={{
                  background: `linear-gradient(to bottom, ${INK}, transparent)`,
                  opacity: 0.15,
                }}
              />

              {steps.map((step, idx) => (
                <motion.div
                  key={step.n}
                  initial={rm ? false : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{
                    duration: 0.45,
                    ease: [0.22, 1, 0.36, 1] as [
                      number,
                      number,
                      number,
                      number,
                    ],
                    delay: rm ? 0 : 0.1 + idx * 0.1,
                  }}
                  className="group flex gap-5 py-7 cursor-default"
                  style={{
                    borderBottom:
                      idx < steps.length - 1
                        ? "1px solid rgba(26,51,0,0.10)"
                        : "none",
                  }}
                >
                  <div className="relative shrink-0 mt-0.5">
                    <div
                      className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-sm font-bold transition-transform duration-300 group-hover:scale-110"
                      style={{
                        backgroundColor: YELLOW,
                        border: `1.5px solid ${INK}`,
                        color: INK,
                        fontFamily: "'Roboto Mono', monospace",
                      }}
                    >
                      {step.n}
                    </div>
                  </div>

                  <div className="pt-0.5 flex-1">
                    <h4
                      className="text-base md:text-lg font-bold mb-2"
                      style={{
                        color: INK,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {step.title}
                    </h4>
                    <p
                      className="text-sm leading-relaxed"
                      style={{
                        color: INK,
                        opacity: 0.55,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── Right: Visual ── */}
          <motion.div ref={imgRef} {...rev(rm, 24, 0.1)} className="relative">
            <div
              className="relative aspect-square rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${PENCIL}` }}
            >
              <motion.img
                src={STEPS_IMAGE}
                alt="Professional accountant in modern office"
                className="w-full h-full object-cover"
                style={{ opacity: 0.85, y: imgY }}
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to bottom, transparent 50%, rgba(245,242,236,0.85) 100%)",
                }}
              />

              {/* Floating stat card */}
              <motion.div
                initial={rm ? false : { opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.5,
                  ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
                  delay: rm ? 0 : 0.4,
                }}
                className="absolute bottom-6 left-6 right-6 rounded-xl p-5"
                style={{
                  backgroundColor: CREAM,
                  border: `1px solid ${PENCIL}`,
                  boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px",
                }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{
                      backgroundColor: YELLOW,
                      border: `1px solid ${INK}`,
                    }}
                  >
                    <Zap
                      className="w-5 h-5"
                      style={{ color: INK }}
                      fill={INK}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-semibold mb-0.5"
                      style={{
                        color: INK,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      90% Faster Filing
                    </p>
                    <p
                      className="text-xs"
                      style={{
                        color: INK,
                        opacity: 0.55,
                        fontFamily: "Inter, system-ui, sans-serif",
                      }}
                    >
                      Users save 40+ hours per tax season
                    </p>
                  </div>
                </div>
                <div
                  className="flex items-center gap-1.5 mt-3 pt-3"
                  style={{ borderTop: "1px solid rgba(26,51,0,0.12)" }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: INK, opacity: 0.4 }}
                  />
                  <span
                    className="text-[11px]"
                    style={{
                      color: INK,
                      opacity: 0.45,
                      fontFamily: "Inter, system-ui, sans-serif",
                    }}
                  >
                    Based on real user data · 15k+ customers
                  </span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
