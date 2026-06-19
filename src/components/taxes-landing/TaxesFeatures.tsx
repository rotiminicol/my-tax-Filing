import { Calculator, Building2, FolderOpen, TrendingUp, FileText, ShieldCheck } from "lucide-react";

const INK = "#1a3300"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2"; const TEAL = "#a8e5e5"; const BLUSH = "#f6d0ff";

const features = [
  { Icon: Calculator, title: "Personal Income Tax (PIT)", desc: "Auto-calculate your PIT using FIRS graduated rates. Pre-filled from your payslips and income sources.", bg: TEAL, featured: true },
  { Icon: Building2, title: "Corporate Tax Filing", desc: "Company income tax returns prepared and filed directly from your financial statements." , bg: "#f5f2ec" },
  { Icon: FolderOpen, title: "VAT Returns", desc: "Monthly VAT returns filed on time with automatic computation from your invoices and expenses.", bg: MINT },
  { Icon: TrendingUp, title: "PAYE Management", desc: "Manage employee PAYE deductions, generate schedules, and file monthly with LIRS effortlessly.", bg: "#f5f2ec" },
  { Icon: FileText, title: "Document Management", desc: "All your tax documents — payslips, receipts, assessments — organized and accessible in one vault.", bg: BLUSH },
  { Icon: ShieldCheck, title: "Audit Defense", desc: "We keep detailed audit trails for every filing. If FIRS queries you, your documentation is bulletproof.", bg: "#f5f2ec" },
];

export default function TaxesFeatures() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f2ec" }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.35 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Features
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Every tax type{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>covered</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, desc, bg, featured }) => (
            <div key={title} className={`cx-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1 ${featured ? "sm:col-span-2 lg:col-span-1" : ""}`}
              style={{ backgroundColor: bg, border: featured ? `1.5px solid ${INK}` : `1px solid ${PENCIL}`, boxShadow: featured ? `3px 3px 0px 0px ${INK}` : "rgba(0,0,0,0.04) 0px 1px 2px" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: INK }}>
                <Icon className="w-5 h-5" style={{ color: "#fcfaf5" }} strokeWidth={1.75} />
              </div>
              <h3 className="text-base font-bold mb-2" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: INK, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
