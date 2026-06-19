import { useRef, useState, useEffect } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Database,
  Info,
  Lock,
  Network,
  Printer,
  ShieldCheck,
  TrendingUp,
  UserCheck,
} from "lucide-react";
import LegalToc from "./LegalToc";
import SectionHeading from "./SectionHeading";
import { useScrollSpy } from "@/components/fiscal-landing/hooks/useScrollSpy";

const SB = {
  ink: "#1a3300",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  pencil: "#b6b6b6",
  muted: "#6b6b6b",
  cardBorder: "rgba(26,51,0,0.10)",
  white: "#ffffff",
};

const TOC = [
  { id: "introduction", label: "1. Introduction" },
  { id: "data-collection", label: "2. Data Collection" },
  { id: "usage", label: "3. How We Use Data" },
  { id: "security", label: "4. Security Infrastructure" },
  { id: "user-rights", label: "5. Your Legal Rights" },
  { id: "compliance", label: "6. Regulatory Compliance" },
];

function useScrollAnimation(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setIsVisible(true); observer.unobserve(entry.target); }
      },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, isVisible };
}

export default function PrivacyPolicyContent() {
  const activeId = useScrollSpy(TOC.map((t) => t.id));
  const headerRef = useScrollAnimation(0.1);
  const articleRef = useScrollAnimation(0.1);

  return (
    <main className="relative overflow-hidden" style={{ backgroundColor: SB.cream }}>
      {/* Dot grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.025]">
        <div
          className="absolute inset-0"
          style={{ backgroundImage: `radial-gradient(${SB.ink} 1px, transparent 1px)`, backgroundSize: "36px 36px" }}
        />
      </div>

      <div className="max-w-[1280px] mx-auto px-5 md:px-10 py-12 md:py-20 relative z-10">
        {/* Header banner */}
        <section ref={headerRef.ref} className="mb-10 md:mb-14">
          <div
            className={`rounded-2xl overflow-hidden relative p-8 md:p-16 text-center transition-all duration-1000 ${
              headerRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ backgroundColor: SB.ink, color: SB.cream }}
          >
            <div
              className="absolute inset-0 opacity-10 pointer-events-none"
              style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }}
            />
            <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: SB.yellow }} />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: SB.mint }} />
            <div className="relative z-10">
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 opacity-90" />
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
              <p className="text-lg max-w-2xl mx-auto opacity-80">
                Transparency is the bedrock of fiscal trust. Learn how we safeguard your financial data in
                compliance with Nigerian regulatory standards.
              </p>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                {["Effective: January 2024", "Version 2.1"].map((badge) => (
                  <span
                    key={badge}
                    className="px-4 py-1 rounded-full text-xs font-semibold uppercase tracking-wide"
                    style={{ backgroundColor: "rgba(255,255,255,0.15)", color: SB.cream }}
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Sidebar */}
          <aside className="lg:col-span-3 hidden lg:block">
            <LegalToc
              items={TOC}
              activeId={activeId}
              footer={
                <div
                  className="mt-12 p-6 rounded-xl border shadow-sm"
                  style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
                >
                  <ShieldCheck className="w-10 h-10 mb-2" style={{ color: SB.ink }} />
                  <h4 className="text-xl font-semibold mb-2" style={{ color: SB.ink }}>
                    Certified Secure
                  </h4>
                  <p className="text-sm" style={{ color: SB.muted }}>
                    Our systems are audited by federal financial bodies for NDPR compliance.
                  </p>
                </div>
              }
            />
          </aside>

          {/* Article */}
          <article
            ref={articleRef.ref}
            className={`lg:col-span-9 space-y-12 [&_section]:scroll-mt-28 transition-all duration-1000 ${
              articleRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            {/* 1. Introduction */}
            <section id="introduction">
              <SectionHeading icon={Info}>1. Introduction</SectionHeading>
              <div className="rounded-xl p-6 md:p-8 border shadow-sm" style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}>
                <p className="mb-4" style={{ color: SB.muted }}>
                  Welcome to My Tax Filing. Your privacy is paramount to our mission of providing a secure,
                  reliable fiscal management environment. This policy describes how we collect, protect, and
                  handle your sensitive financial information when you use our services.
                </p>
                <p style={{ color: SB.muted }}>
                  By accessing our platform, you agree to the terms outlined in this document. We operate under
                  the strict guidelines of the Nigerian Data Protection Regulation (NDPR) and other applicable
                  financial laws.
                </p>
              </div>
            </section>

            {/* 2. Data Collection */}
            <section id="data-collection">
              <SectionHeading icon={Database}>2. Data Collection</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "Personal Identity",
                    items: ["Full Legal Name", "Tax Identification Number (TIN)", "BVN (Verified via Secure Gateways)", "Government Issued ID"],
                  },
                  {
                    title: "Financial Data",
                    items: ["Annual Income Statements", "Bank Transaction History", "Asset Declarations", "Deduction Proofs"],
                  },
                ].map((col, idx) => (
                  <div
                    key={col.title}
                    className="p-6 rounded-xl border hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    style={{ backgroundColor: SB.white, borderColor: SB.cardBorder, transitionDelay: `${idx * 100}ms` }}
                  >
                    <h4 className="text-xl font-bold mb-3" style={{ color: SB.ink }}>{col.title}</h4>
                    <ul className="space-y-2">
                      {col.items.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm" style={{ color: SB.muted }}>
                          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: SB.ink }} />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. How We Use Data */}
            <section id="usage">
              <SectionHeading icon={TrendingUp}>3. How We Use Data</SectionHeading>
              <div className="rounded-xl border overflow-hidden shadow-sm" style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}>
                <table className="w-full text-left">
                  <thead style={{ backgroundColor: SB.cream }}>
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm" style={{ color: SB.ink }}>Purpose</th>
                      <th className="px-6 py-4 font-bold text-sm" style={{ color: SB.ink }}>Legal Basis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: SB.cardBorder }}>
                    {[
                      ["Tax Calculation & Filing", "Contractual Necessity"],
                      ["Identity Verification (KYC)", "Regulatory Requirement"],
                      ["Security & Fraud Prevention", "Legitimate Interest"],
                      ["Customer Support", "Contractual Necessity"],
                    ].map(([purpose, basis]) => (
                      <tr key={purpose}>
                        <td className="px-6 py-4 text-sm font-medium" style={{ color: SB.ink }}>{purpose}</td>
                        <td className="px-6 py-4 text-sm" style={{ color: SB.muted }}>{basis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 4. Security Infrastructure */}
            <section id="security">
              <SectionHeading icon={Lock}>4. Security Infrastructure</SectionHeading>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { icon: Lock, title: "AES-256", desc: "Bank-grade encryption for all data at rest and in transit." },
                  { icon: ShieldCheck, title: "Audit Logs", desc: "Comprehensive tracking of every data access event." },
                  { icon: Network, title: "Isolated Tunnels", desc: "Private connections to tax authorities for direct filing." },
                ].map(({ icon: Icon, title, desc }, idx) => (
                  <div
                    key={title}
                    className="text-center p-6 rounded-xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
                    style={{ backgroundColor: SB.white, borderColor: SB.cardBorder, border: `1px solid ${SB.cardBorder}`, transitionDelay: `${idx * 100}ms` }}
                  >
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                      style={{ backgroundColor: SB.mint }}
                    >
                      <Icon className="w-8 h-8" style={{ color: SB.ink }} />
                    </div>
                    <h5 className="text-xl font-bold mb-2" style={{ color: SB.ink }}>{title}</h5>
                    <p className="text-sm" style={{ color: SB.muted }}>{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 5. Your Legal Rights */}
            <section id="user-rights">
              <SectionHeading icon={UserCheck}>5. Your Legal Rights</SectionHeading>
              <div className="rounded-xl p-6 md:p-8 border space-y-6 shadow-sm" style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}>
                <p style={{ color: SB.muted }}>
                  Under Nigerian data laws, you possess the following rights regarding your personal information:
                </p>
                {[
                  { title: "Right to Access", desc: "You can request a full copy of all personal data we hold about you at any time." },
                  { title: "Right to Rectification", desc: "You have the power to correct any inaccurate or incomplete tax records in our system." },
                  { title: "Right to Erasure", desc: "You may request the deletion of your account, subject to mandatory federal record-keeping periods." },
                ].map((r) => (
                  <div key={r.title} className="flex gap-4">
                    <CheckCircle2 className="w-6 h-6 shrink-0" style={{ color: "#1a5c3a" }} />
                    <div>
                      <h6 className="font-bold" style={{ color: SB.ink }}>{r.title}</h6>
                      <p className="text-sm mt-1" style={{ color: SB.muted }}>{r.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 6. Regulatory Compliance */}
            <section id="compliance" className="py-8 border-y" style={{ borderColor: SB.cardBorder }}>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="w-full md:w-1/2">
                  <div
                    className="rounded-2xl p-8 md:p-12 flex items-center justify-center border aspect-video"
                    style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                  >
                    <div className="text-center space-y-6">
                      <div className="inline-flex p-6 rounded-full shadow-md" style={{ backgroundColor: SB.mint }}>
                        <ShieldCheck className="w-12 h-12 md:w-16 md:h-16" style={{ color: SB.ink }} />
                      </div>
                      <h4 className="text-2xl font-bold" style={{ color: SB.ink }}>24/7 SOC</h4>
                      <p className="text-sm max-w-xs mx-auto" style={{ color: SB.muted }}>
                        Real-time threat monitoring and automated intrusion detection systems.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full md:w-1/2">
                  <h3 className="text-3xl font-bold mb-4" style={{ color: SB.ink }}>
                    Dedicated Security Operations
                  </h3>
                  <p className="mb-6" style={{ color: SB.muted }}>
                    Our 24/7 Security Operations Center (SOC) monitors for threats in real-time, ensuring that
                    your tax data never falls into the wrong hands.
                  </p>
                  <button
                    type="button"
                    className="flex items-center gap-2 font-bold hover:underline transition-all duration-200 hover:gap-3"
                    style={{ color: SB.ink }}
                  >
                    Read our Security Whitepaper
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </section>

            {/* Footer */}
            <div className="pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 border-t" style={{ borderColor: SB.cardBorder }}>
              <p className="text-xs uppercase tracking-wide" style={{ color: SB.pencil }}>
                Last updated: April 12, 2024
              </p>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg text-sm font-medium hover:bg-[#fcfaf5] transition-colors active:scale-95"
                style={{ borderColor: SB.cardBorder, color: SB.ink }}
              >
                <Printer className="w-4 h-4" />
                Print Policy
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
