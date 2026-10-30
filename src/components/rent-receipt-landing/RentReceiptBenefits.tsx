import { Zap, ShieldCheck, Cloud, Bell, FileText, Scale } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2"; const BLUSH = "#f6d0ff";

const benefits = [
  { Icon: Zap, title: "Generate in 60 Seconds", desc: "Fill in 5 fields and download a professional PDF rent receipt immediately. No templates, no design skills needed.", bg: YELLOW },
  { Icon: ShieldCheck, title: "LIRS Compliant Format", desc: "Every receipt follows the Lagos Internal Revenue Service approved format, accepted for housing allowance claims.", bg: MINT },
  { Icon: Cloud, title: "Cloud Storage", desc: "All your receipts are stored securely in your account. Access them from any device, anytime.", bg: BLUSH },
  { Icon: Bell, title: "Tenant Reminders", desc: "Set up automatic rent reminders via email or WhatsApp so you never chase late payments again.", bg: CREAM },
  { Icon: FileText, title: "Bulk Generation", desc: "Managing multiple properties? Generate receipts for all tenants in one batch — minutes, not hours.", bg: CREAM },
  { Icon: Scale, title: "Legal Protection", desc: "Properly documented receipts protect both landlords and tenants in any dispute or court proceeding.", bg: CREAM },
];

export default function RentReceiptBenefits() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f2ec" }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.35 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Benefits
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Everything you need for{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>proper receipts</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {benefits.map(({ Icon, title, desc, bg }) => (
            <div key={title} className="cx-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: bg, border: `1px solid ${PENCIL}`, boxShadow: "rgba(0,0,0,0.04) 0px 1px 2px" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: INK, border: `1px solid ${INK}` }}>
                <Icon className="w-5 h-5" style={{ color: CREAM }} strokeWidth={1.75} />
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
