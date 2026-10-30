import { Calculator, PenLine, Contact, Upload, Webhook, FileText } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2"; const TEAL = "#a8e5e5";

const features = [
  { Icon: Calculator, title: "Auto VAT Calculation", desc: "Nigerian VAT (7.5%) and WHT automatically applied. Configurable per client and service type.", badge: "Auto", bg: TEAL },
  { Icon: PenLine, title: "Custom Branding", desc: "Add your logo, business address, and payment terms. Your invoices look as professional as you are.", bg: "#f5f2ec" },
  { Icon: Contact, title: "Client Management", desc: "Save client details and generate new invoices in one click. Manage all clients from your dashboard.", bg: MINT },
  { Icon: Upload, title: "PDF & Email Delivery", desc: "Download PDFs instantly or send invoices directly to clients from within the platform.", bg: "#f5f2ec" },
  { Icon: Webhook, title: "Recurring Invoices", desc: "Set up automatic recurring invoices for retainer clients. We send them on schedule without any action from you.", bg: YELLOW },
  { Icon: FileText, title: "Invoice History", desc: "Full history of all invoices with payment status tracking. See which invoices are paid, overdue, or pending.", bg: "#f5f2ec" },
];

export default function EInvoicingFeatures() {
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
            Everything for{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>professional invoicing</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, desc, badge, bg }) => (
            <div key={title} className="cx-card relative rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: bg, border: `1px solid ${PENCIL}`, boxShadow: "rgba(0,0,0,0.04) 0px 1px 2px" }}>
              {badge && (
                <span className="absolute top-4 right-4 text-[10px] font-medium px-2.5 py-1 rounded-full"
                  style={{ backgroundColor: INK, color: CREAM, fontFamily: "Inter,system-ui,sans-serif" }}>{badge}</span>
              )}
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ backgroundColor: INK }}>
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
