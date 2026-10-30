import { Upload, Bell, MousePointerClick } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6";

const steps = [
  { Icon: Upload, n: "01", title: "Upload Your Documents", desc: "Scan or photograph your existing documents and upload them to your secure vault. We extract the expiry dates automatically." },
  { Icon: Bell, n: "02", title: "Set Your Preferences", desc: "Choose how and when you want to be reminded — email, SMS, or WhatsApp. Set lead times from 90 days down to 1 day before expiry." },
  { Icon: MousePointerClick, n: "03", title: "Renew with One Click", desc: "When it's time to renew, follow our guided process with direct links to the right FRSC, CAC, or state government portal." },
];

export default function DocumentRenewalProcess() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f2ec" }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.35 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            How It Works
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Up and running{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>in minutes</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 md:grid-cols-3 gap-5">
          {steps.map(({ Icon, n, title, desc }) => (
            <div key={n} className="cx-card rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: CREAM, border: `1px solid ${PENCIL}`, boxShadow: "rgba(0,0,0,0.04) 0px 1px 2px" }}>
              <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5" style={{ backgroundColor: YELLOW, border: `1.5px solid ${INK}` }}>
                <Icon className="w-6 h-6" style={{ color: INK }} strokeWidth={1.5} />
                <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center"
                  style={{ backgroundColor: INK, color: CREAM, fontFamily: "'Roboto Mono',monospace" }}>{n.slice(-1)}</span>
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
