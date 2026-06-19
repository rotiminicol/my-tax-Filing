import { Shield, ScrollText, Gavel, TrendingUp } from "lucide-react";

const INK = "#1a3300"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6";

const values = [
  { Icon: Shield, title: "FIRS & LIRS Certified", desc: "Our filing formats are vetted and accepted by the Federal Inland Revenue Service and all state boards.", stat: "100% Accepted" },
  { Icon: ScrollText, title: "Save 40+ Hours Yearly", desc: "Stop manually computing taxes in spreadsheets. Our platform pre-fills 90% of your return automatically.", stat: "40+ hrs saved" },
  { Icon: Gavel, title: "Zero Penalty Risk", desc: "Automated deadline reminders ensure you never miss a filing date. We alert you 30, 14, and 7 days before.", stat: "Zero penalties" },
  { Icon: TrendingUp, title: "Maximize Deductions", desc: "Our engine automatically identifies all allowable deductions from your uploads — most users save more than the cost of the plan.", stat: "Avg 28% savings" },
];

export default function TaxesValueSection() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.30 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
              Why Choose Us
            </div>
            <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
              Stop using{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>Excel</span>{" "}
              for taxes
            </h2>
            <p className="text-base leading-relaxed max-w-md" style={{ color: INK, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif" }}>
              Nigerian tax compliance has been unnecessarily complicated. We built the platform we wished existed when we were filing our own returns.
            </p>
          </div>
          <div className="cx-cards-row grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map(({ Icon, title, desc, stat }) => (
              <div key={title} className="cx-card rounded-xl p-5 transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundColor: "#f5f2ec", border: `1px solid ${PENCIL}`, boxShadow: "rgba(0,0,0,0.04) 0px 1px 2px" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: YELLOW, border: `1px solid ${INK}` }}>
                    <Icon className="w-4.5 h-4.5" style={{ color: INK }} strokeWidth={1.75} />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{title}</p>
                    <p className="text-[10px] font-semibold mt-0.5" style={{ color: INK, opacity: 0.55, fontFamily: "'Roboto Mono',monospace" }}>{stat}</p>
                  </div>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: INK, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
