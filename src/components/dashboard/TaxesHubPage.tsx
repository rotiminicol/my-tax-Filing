import { useState, useEffect } from "react";
import {
  Building2,
  Calendar,
  CheckCircle2,
  ExternalLink,
  FileText,
  Lock,
  Mail,
  Shield,
  Sparkles,
  Clock,
} from "lucide-react";
import { notify } from "@/components/Toaster";

const SB = {
  ink: "#1a3300",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  blush: "#f6d0ff",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const FEATURES = [
  {
    icon: FileText,
    title: "Automated PIT Filing",
    desc: "Direct integration with FIRS e-Filing portal for seamless personal income tax returns.",
    color: SB.mint,
  },
  {
    icon: Building2,
    title: "Corporate Tax Portal",
    desc: "Company income tax (CIT) submissions, assessments and compliance tracking in one place.",
    color: SB.teal,
  },
  {
    icon: Calendar,
    title: "Live Deadline Sync",
    desc: "Real-time deadline tracker synchronized with the FIRS official fiscal calendar.",
    color: SB.yellow,
  },
  {
    icon: Shield,
    title: "TCC Applications",
    desc: "Tax Clearance Certificate requests processed directly within your dashboard.",
    color: SB.blush,
  },
  {
    icon: CheckCircle2,
    title: "WHT Automation",
    desc: "Withholding tax computation, deduction scheduling and remittance management.",
    color: SB.mint,
  },
  {
    icon: Lock,
    title: "Audit Shield",
    desc: "Automated audit-ready documentation and FIRS correspondence management.",
    color: SB.teal,
  },
];

const TIMELINE = [
  { label: "Phase 1", status: "completed", title: "Platform Infrastructure", desc: "Core dashboard, rent receipts, and document management — live." },
  { label: "Phase 2", status: "in-progress", title: "E-Invoicing & Payments", desc: "VAT-compliant digital invoicing and payment tracking — live now." },
  { label: "Phase 3", status: "upcoming", title: "FIRS Tax Integration", desc: "Direct FIRS API integration, automated filing and TCC requests — coming Q3 2025." },
  { label: "Phase 4", status: "upcoming", title: "Advanced Analytics", desc: "AI-driven tax insights, compliance forecasting and benchmarking." },
];

export default function TaxesHubPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const handleNotify = () => {
    if (!email.trim() || !email.includes("@")) {
      notify.error("Invalid email", "Please enter a valid email address.");
      return;
    }
    setSubmitted(true);
    notify.success("You're on the list!", "We'll notify you as soon as Tax Management launches.");
  };

  return (
    <div className="space-y-12">
      {/* Hero */}
      <section
        className={`relative overflow-hidden rounded-2xl transition-all duration-700 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
        }`}
        style={{ backgroundColor: SB.ink }}
      >
        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(rgba(252,250,245,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Glow blobs */}
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: SB.mint }} />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full blur-3xl opacity-20" style={{ backgroundColor: SB.yellow }} />

        <div className="relative z-10 px-8 md:px-16 py-14 md:py-20">
          <div className="flex flex-col md:flex-row md:items-center gap-10">
            {/* Left text */}
            <div className="flex-1">
              {/* Badge */}
              <div
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
                style={{ backgroundColor: SB.yellow, color: SB.ink }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                Coming Soon
              </div>

              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 leading-tight" style={{ color: SB.cream }}>
                Tax Management
                <br />
                <span style={{ color: SB.yellow }}>FIRS Integration</span>
              </h1>

              <p className="text-base md:text-lg leading-relaxed mb-8 max-w-xl" style={{ color: "rgba(252,250,245,0.75)" }}>
                My Rent Receipt is actively integrating with the <strong style={{ color: SB.cream }}>Federal Inland Revenue Service (FIRS)</strong>{" "}
                digital tax portal to bring seamless, automated Nigerian tax management directly to your dashboard.
              </p>

              {/* Notify form */}
              {!submitted ? (
                <div className="flex flex-col sm:flex-row gap-3 max-w-md">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" style={{ color: SB.pencil }} />
                    <input
                      type="email"
                      placeholder="Enter your email for early access"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleNotify()}
                      className="w-full pl-10 pr-4 py-3 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#ffe95c]/50"
                      style={{ backgroundColor: "rgba(252,250,245,0.12)", color: SB.cream, border: "1px solid rgba(252,250,245,0.20)" }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleNotify}
                    className="px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                    style={{ backgroundColor: SB.yellow, color: SB.ink }}
                  >
                    Notify Me
                  </button>
                </div>
              ) : (
                <div
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold"
                  style={{ backgroundColor: SB.mint, color: SB.ink }}
                >
                  <CheckCircle2 className="w-5 h-5" />
                  You're on the early access list!
                </div>
              )}

              <p className="text-xs mt-3 opacity-50" style={{ color: SB.cream }}>
                No spam. We'll only contact you for the launch announcement.
              </p>
            </div>

            {/* Right: Gov emblem visual */}
            <div className="flex-shrink-0 flex items-center justify-center">
              <div
                className="w-48 h-48 md:w-56 md:h-56 rounded-full flex items-center justify-center border-4 relative"
                style={{ borderColor: "rgba(252,250,245,0.15)", backgroundColor: "rgba(252,250,245,0.06)" }}
              >
                <div
                  className="w-36 h-36 md:w-44 md:h-44 rounded-full flex flex-col items-center justify-center border-2"
                  style={{ borderColor: "rgba(252,250,245,0.12)", backgroundColor: "rgba(252,250,245,0.06)" }}
                >
                  <Shield className="w-16 h-16 md:w-20 md:h-20 mb-1" style={{ color: SB.yellow, opacity: 0.9 }} />
                  <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-center leading-tight px-4" style={{ color: "rgba(252,250,245,0.6)" }}>
                    FIRS
                    <br />
                    Nigeria
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4 mt-10 pt-10 border-t" style={{ borderColor: "rgba(252,250,245,0.10)" }}>
            {[
              { value: "Q3 2025", label: "Expected Launch" },
              { value: "FIRS API", label: "Direct Integration" },
              { value: "100% Compliant", label: "NDPR & CBN Standards" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-lg md:text-2xl font-extrabold" style={{ color: SB.yellow }}>{value}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(252,250,245,0.55)" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section>
        <div className={`mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="text-xl font-bold" style={{ color: SB.ink }}>What's Coming</h2>
          <p className="text-sm mt-1" style={{ color: SB.muted }}>
            A full suite of Nigerian federal tax tools, fully integrated with FIRS systems.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map(({ icon: Icon, title, desc, color }, idx) => (
            <div
              key={title}
              className={`rounded-xl border p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-500 ${
                mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{
                backgroundColor: SB.white,
                borderColor: SB.cardBorder,
                transitionDelay: mounted ? `${150 + idx * 60}ms` : "0ms",
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: color }}
              >
                <Icon className="w-6 h-6" style={{ color: SB.ink }} />
              </div>
              <h3 className="font-bold mb-1.5" style={{ color: SB.ink }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: SB.muted }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap timeline */}
      <section
        className={`rounded-2xl border p-6 md:p-8 transition-all duration-700 delay-200 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Clock className="w-5 h-5" style={{ color: SB.ink, opacity: 0.5 }} />
          <h2 className="text-lg font-bold" style={{ color: SB.ink }}>Product Roadmap</h2>
        </div>

        <div className="space-y-0">
          {TIMELINE.map((item, idx) => {
            const isLast = idx === TIMELINE.length - 1;
            const isCompleted = item.status === "completed";
            const isActive = item.status === "in-progress";
            return (
              <div key={item.label} className="flex gap-5">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold text-xs border-2 transition-all"
                    style={{
                      backgroundColor: isCompleted ? SB.mint : isActive ? SB.yellow : SB.cream,
                      borderColor: isCompleted ? "#1a5c3a" : isActive ? SB.ink : SB.cardBorder,
                      color: isCompleted ? "#1a5c3a" : SB.ink,
                    }}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                  </div>
                  {!isLast && (
                    <div
                      className="w-0.5 flex-1 my-1"
                      style={{ backgroundColor: isCompleted ? SB.mint : SB.cardBorder, minHeight: 28 }}
                    />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-6 flex-1 ${isLast ? "" : ""}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full"
                      style={{
                        backgroundColor: isCompleted ? SB.mint : isActive ? SB.yellow : SB.cream,
                        color: SB.ink,
                      }}
                    >
                      {item.label}
                    </span>
                    {isActive && (
                      <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#b45309" }}>
                        ● In Progress
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm" style={{ color: SB.ink }}>{item.title}</h4>
                  <p className="text-xs mt-0.5" style={{ color: SB.muted }}>{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FIRS official note */}
      <section
        className={`rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 border transition-all duration-700 delay-300 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
        style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
      >
        <div>
          <p className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: SB.pencil }}>While you wait</p>
          <h3 className="text-xl font-bold mb-1" style={{ color: SB.ink }}>Access the FIRS Portal Directly</h3>
          <p className="text-sm" style={{ color: SB.muted }}>
            For immediate tax filing needs, visit the official Federal Inland Revenue Service portal.
          </p>
        </div>
        <a
          href="https://www.firs.gov.ng"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all"
          style={{ backgroundColor: SB.ink, color: SB.cream }}
        >
          Visit FIRS Portal
          <ExternalLink className="w-4 h-4" />
        </a>
      </section>
    </div>
  );
}
