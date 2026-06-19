import { Car, IdCard, Building2, Landmark, Shield, Truck } from "lucide-react";

const INK = "#1a3300"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const CREAM = "#fcfaf5";

const docTypes = [
  { Icon: Car, title: "Vehicle License", bg: "#a8e5e5" },
  { Icon: IdCard, title: "Driver's License", bg: "#d5f5c2" },
  { Icon: Building2, title: "CAC Annual Return", bg: "#f6d0ff" },
  { Icon: Landmark, title: "Business Permit", bg: YELLOW },
  { Icon: Truck, title: "Hackney Permit", bg: "#a8e5e5" },
  { Icon: Shield, title: "Insurance Policies", bg: "#d5f5c2" },
];

export default function DocumentRenewalSupported() {
  return (
    <section className="relative py-20 md:py-24 overflow-hidden" style={{ backgroundColor: "#f5f2ec" }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.35 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Supported Documents
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(1.8rem,3.5vw,2.6rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Track every document{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>that matters</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {docTypes.map(({ Icon, title, bg }) => (
            <div key={title} className="cx-card rounded-xl p-4 text-center transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: bg, border: `1.5px solid ${INK}`, boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px" }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ backgroundColor: INK }}>
                <Icon className="w-5 h-5" style={{ color: CREAM }} strokeWidth={1.75} />
              </div>
              <h3 className="text-xs font-bold" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
