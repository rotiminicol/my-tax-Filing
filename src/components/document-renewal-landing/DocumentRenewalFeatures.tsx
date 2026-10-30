import { Bell, CloudUpload, RefreshCw, MessageCircle, FileText, Shield } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const BLUSH = "#f6d0ff";

const features = [
  { Icon: Bell, title: "Smart Expiry Alerts", desc: "Get notified via email and SMS 90, 30, 14, and 7 days before any document expires. Never be caught off-guard.", featured: true },
  { Icon: CloudUpload, title: "Digital Document Vault", desc: "Upload scans of all your documents. Access them anytime, from any device, completely secure." },
  { Icon: RefreshCw, title: "Assisted Renewal", desc: "We guide you through the exact renewal process for each document type, with links to the right government portals." },
  { Icon: MessageCircle, title: "WhatsApp Alerts", desc: "Receive renewal reminders directly on WhatsApp — the way most Nigerians prefer to be reached." },
  { Icon: FileText, title: "Renewal History", desc: "Full history of all your past renewals with dates, costs, and receipts stored in your account." },
  { Icon: Shield, title: "Compliance Dashboard", desc: "One-glance view of your entire document compliance status — green, amber, and red statuses at a glance." },
];

export default function DocumentRenewalFeatures() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.30 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Features
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Stay ahead of{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>every deadline</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map(({ Icon, title, desc, featured }) => (
            <div key={title} className="cx-card rounded-xl p-6 transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: featured ? BLUSH : "#f5f2ec", border: featured ? `1.5px solid ${INK}` : `1px solid ${PENCIL}`, boxShadow: featured ? `3px 3px 0px 0px ${INK}` : "rgba(0,0,0,0.04) 0px 1px 2px" }}>
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
