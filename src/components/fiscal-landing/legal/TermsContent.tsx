import { useRef, useState, useEffect } from "react";
import { Calendar, Download, Receipt, Wallet, Shield, ArrowRight } from "lucide-react";
import { useScrollSpy, scrollToSection } from "@/components/fiscal-landing/hooks/useScrollSpy";
import { notify } from "@/components/Toaster";

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
  { id: "acceptance", label: "1. Acceptance of Terms" },
  { id: "usage", label: "2. Service Usage" },
  { id: "payment", label: "3. Payments & Fees" },
  { id: "liability", label: "4. Limitation of Liability" },
  { id: "compliance", label: "5. Regulatory Compliance" },
  { id: "termination", label: "6. Termination" },
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

function SectionTitle({ num, children }: { num: string; children: React.ReactNode }) {
  return (
    <h2 className="text-2xl font-bold flex items-center gap-3 mb-6 scroll-mt-28" style={{ color: SB.ink }}>
      <span
        className="text-sm px-2 py-1 rounded-lg font-bold"
        style={{ backgroundColor: SB.ink, color: SB.yellow }}
      >
        {num}
      </span>
      {children}
    </h2>
  );
}

export default function TermsContent() {
  const activeId = useScrollSpy(TOC.map((t) => t.id), 150);
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
        {/* Header */}
        <header
          ref={headerRef.ref}
          className={`mb-12 md:mb-16 text-center max-w-3xl mx-auto transition-all duration-1000 ${
            headerRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
          }`}
        >
          <span className="text-xs font-bold uppercase tracking-widest mb-4 block" style={{ color: SB.ink, opacity: 0.4 }}>
            Legal Agreement
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mb-6" style={{ color: SB.ink }}>
            Terms and Conditions
          </h1>
          <p className="text-base md:text-lg" style={{ color: SB.muted }}>
            Please read these terms carefully before using the My Tax Filing platform. By using our services,
            you agree to be bound by these regulations.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm" style={{ color: SB.muted }}>
            <Calendar className="w-5 h-5" style={{ color: SB.ink }} />
            Last Updated: June 15, 2024
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12 relative">
          {/* Table of Contents */}
          <aside className="lg:w-1/4 hidden lg:block">
            <nav
              className="sticky top-32 flex flex-col gap-3 border-l-2 pl-6"
              style={{ borderColor: SB.mint }}
            >
              {TOC.map((item) => {
                const active = activeId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => scrollToSection(item.id, 120)}
                    className="text-left text-sm transition-all duration-200 px-3 py-1.5 rounded-lg"
                    style={{
                      color: active ? SB.ink : SB.muted,
                      backgroundColor: active ? SB.mint : "transparent",
                      fontWeight: active ? 700 : 500,
                    }}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Article content */}
          <article
            ref={articleRef.ref}
            className={`lg:w-3/4 rounded-2xl border p-6 md:p-12 shadow-sm space-y-10 transition-all duration-1000 ${
              articleRef.isVisible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
            }`}
            style={{ backgroundColor: SB.white, borderColor: SB.cardBorder }}
          >
            <section id="acceptance">
              <SectionTitle num="01">Acceptance of Terms</SectionTitle>
              <p className="leading-relaxed mb-4" style={{ color: SB.muted }}>
                By accessing or using the My Tax Filing website, mobile application, or any service provided by
                My Tax Filing (collectively, the &quot;Service&quot;), you agree to be bound by these Terms and
                Conditions. If you do not agree to all of the terms and conditions, you may not access or use the
                Service.
              </p>
              <p className="leading-relaxed" style={{ color: SB.muted }}>
                These terms constitute a legally binding agreement between you and My Tax Filing, regulated by
                the Federal Inland Revenue Service (FIRS) and other relevant Nigerian tax authorities.
              </p>
            </section>

            <section id="usage">
              <SectionTitle num="02">Service Usage</SectionTitle>
              <p className="leading-relaxed mb-6" style={{ color: SB.muted }}>
                The Service is designed to assist Nigerian citizens and businesses in calculating and filing
                their taxes accurately. You are responsible for ensuring that all information provided to us is
                accurate, complete, and up-to-date.
              </p>
              <div
                className="p-6 rounded-xl my-6 border-l-4 shadow-sm"
                style={{ backgroundColor: SB.cream, borderLeftColor: SB.ink }}
              >
                <h4 className="font-bold mb-3" style={{ color: SB.ink }}>Prohibited Actions:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm" style={{ color: SB.muted }}>
                  <li>Submitting false or fraudulent financial records.</li>
                  <li>Attempting to circumvent any security measures of the platform.</li>
                  <li>Using the service for money laundering or illegal financial activities.</li>
                  <li>Reverse engineering any part of the My Tax Filing proprietary software.</li>
                </ul>
              </div>
            </section>

            <section id="payment">
              <SectionTitle num="03">Payments &amp; Fees</SectionTitle>
              <p className="leading-relaxed mb-6" style={{ color: SB.muted }}>
                My Tax Filing charges processing fees for various tax filing services. All fees are displayed
                clearly before you commit to a transaction. Payments are processed through secure,
                Nigerian-regulated payment gateways.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  {
                    icon: Receipt,
                    title: "Fee Structure",
                    desc: "Fees may vary based on the complexity of your tax profile (e.g., PIT, VAT, or Corporate Tax).",
                  },
                  {
                    icon: Wallet,
                    title: "Refund Policy",
                    desc: "Processing fees are non-refundable once the filing has been transmitted to government authorities.",
                  },
                ].map(({ icon: Icon, title, desc }) => (
                  <div
                    key={title}
                    className="p-5 rounded-xl border shadow-sm"
                    style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
                  >
                    <Icon className="w-6 h-6 mb-3" style={{ color: SB.ink }} />
                    <h5 className="font-bold mb-1" style={{ color: SB.ink }}>{title}</h5>
                    <p className="text-xs" style={{ color: SB.muted }}>{desc}</p>
                  </div>
                ))}
              </div>
            </section>

            <section id="liability">
              <SectionTitle num="04">Limitation of Liability</SectionTitle>
              <p className="leading-relaxed mb-4" style={{ color: SB.muted }}>
                While we strive for 100% accuracy, My Tax Filing provides tools for tax preparation based on the
                data you provide. We are not a substitute for legal advice or a certified tax professional in
                complex scenarios.
              </p>
              <p className="leading-relaxed font-semibold italic" style={{ color: SB.muted }}>
                In no event shall My Tax Filing be liable for any penalties, interest, or additional taxes levied
                by the FIRS due to inaccurate data entry or delayed submission by the user.
              </p>
            </section>

            <section id="compliance">
              <SectionTitle num="05">Regulatory Compliance</SectionTitle>
              <p className="leading-relaxed mb-6" style={{ color: SB.muted }}>
                My Tax Filing operates under the laws of the Federal Republic of Nigeria. We cooperate with law
                enforcement and tax authorities when required by law to provide information about filed returns
                or financial transactions.
              </p>
              <div
                className="flex items-center gap-4 p-6 rounded-xl"
                style={{ backgroundColor: SB.mint }}
              >
                <Shield className="w-10 h-10 shrink-0" style={{ color: SB.ink }} />
                <div>
                  <p className="text-sm font-bold" style={{ color: SB.ink }}>Official Regulation</p>
                  <p className="text-xs mt-1" style={{ color: SB.muted }}>
                    Our platform is routinely audited for compliance with the NDPR (Nigeria Data Protection Regulation).
                  </p>
                </div>
              </div>
            </section>

            <section id="termination">
              <SectionTitle num="06">Termination</SectionTitle>
              <p className="leading-relaxed" style={{ color: SB.muted }}>
                We reserve the right to suspend or terminate your account at our sole discretion, without notice,
                for conduct that we believe violates these Terms or is harmful to other users, us, or third
                parties, or for any other reason.
              </p>
            </section>

            {/* Footer */}
            <div
              className="pt-12 mt-6 border-t flex flex-col sm:flex-row items-center justify-between gap-6"
              style={{ borderColor: SB.cardBorder }}
            >
              <div>
                <p className="font-bold" style={{ color: SB.ink }}>Questions about our Terms?</p>
                <p className="text-sm" style={{ color: SB.muted }}>
                  Contact our legal team at legal@mytaxfiling.ng
                </p>
              </div>
              <button
                type="button"
                onClick={() => notify.info("Download", "PDF version will be available soon.")}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                style={{ backgroundColor: SB.ink, color: SB.cream }}
              >
                <Download className="w-5 h-5" />
                Download PDF Version
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </article>
        </div>
      </div>
    </main>
  );
}
