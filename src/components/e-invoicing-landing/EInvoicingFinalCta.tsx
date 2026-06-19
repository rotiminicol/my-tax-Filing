import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const INK = "#1a3300"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c";

export default function EInvoicingFinalCta() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: INK }}>
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 md:px-10 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Start Invoicing
          </div>
          <h2 className="leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2.4rem,5vw,3.8rem)", fontWeight: 800, letterSpacing: "0.04em", color: CREAM, lineHeight: 1.05 }}>
            Your first invoice{" "}
            <span style={{ backgroundColor: YELLOW, color: INK, padding: "0 8px 4px", borderRadius: 4, display: "inline-block" }}>is free</span>
          </h2>
          <p className="text-lg" style={{ color: CREAM, opacity: 0.55, fontFamily: "Inter,system-ui,sans-serif" }}>
            No templates, no design skills needed. Just enter your details and send.
          </p>
          <div className="flex flex-wrap gap-4 justify-center pt-2">
            <Link to="/customer-dashboard/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ backgroundColor: YELLOW, color: INK, fontFamily: "Inter,system-ui,sans-serif", boxShadow: "rgba(0,0,0,0.15) 0px 2px 6px" }}>
              Create Free Invoice <ArrowUpRight className="w-4 h-4" />
            </Link>
            <Link to="#pricing" className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-medium border"
              style={{ color: CREAM, borderColor: "rgba(252,250,245,0.30)", fontFamily: "Inter,system-ui,sans-serif" }}>
              View Pricing
            </Link>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-5 pt-2">
            {["FIRS Compliant","Auto VAT calc","Free forever plan"].map(t => (
              <span key={t} className="flex items-center gap-1.5 text-xs" style={{ color: CREAM, opacity: 0.35, fontFamily: "Inter,system-ui,sans-serif" }}>
                <ShieldCheck className="w-3.5 h-3.5" style={{ color: YELLOW }} />{t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
