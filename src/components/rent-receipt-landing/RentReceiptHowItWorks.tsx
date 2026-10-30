import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6";

const steps = [
  { n: "01", title: "Enter property & tenant details", desc: "Fill in the landlord name, tenant name, property address, rental period, and amount. Takes under a minute." },
  { n: "02", title: "Customize and preview", desc: "Add your logo, adjust the receipt number, and preview exactly how the document will look before downloading." },
  { n: "03", title: "Download or send", desc: "Export a PDF instantly or send it directly to your tenant's email from within the platform." },
];

export default function RentReceiptHowItWorks() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: CREAM }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.30 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
              How It Works
            </div>
            <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
              Ready in{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>3 steps</span>
            </h2>
            <p className="text-base" style={{ color: INK, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif", lineHeight: 1.6 }}>
              No software to install, no design experience needed. Just fill the form and your receipt is ready.
            </p>
            <Link to="/customer-dashboard/signup"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-90"
              style={{ backgroundColor: INK, color: CREAM, fontFamily: "Inter,system-ui,sans-serif" }}>
              Try It Free <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="cx-cards-row relative space-y-0">
            <div className="absolute left-[26px] top-10 bottom-10 w-px hidden sm:block" style={{ background: `linear-gradient(to bottom, ${INK}, transparent)`, opacity: 0.12 }} />
            {steps.map((step, idx) => (
              <div key={step.n} className="cx-card flex gap-5 py-7" style={{ borderBottom: idx < steps.length - 1 ? `1px solid rgba(26,51,0,0.10)` : "none" }}>
                <div className="shrink-0 mt-0.5">
                  <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-sm font-bold"
                    style={{ backgroundColor: YELLOW, border: `1.5px solid ${INK}`, color: INK, fontFamily: "'Roboto Mono',monospace" }}>
                    {step.n}
                  </div>
                </div>
                <div className="pt-0.5 flex-1">
                  <h4 className="text-base font-bold mb-1.5" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{step.title}</h4>
                  <p className="text-sm leading-relaxed" style={{ color: INK, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif" }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
