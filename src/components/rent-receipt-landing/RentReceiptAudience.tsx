import { Link } from "react-router-dom";
import { User, Building2, Briefcase, ArrowUpRight } from "lucide-react";

const INK = "#1a3300"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2"; const TEAL = "#a8e5e5";

const audiences = [
  { Icon: User, title: "Individual Landlords", desc: "Rent out your property? Generate professional receipts for each tenant and keep tidy records for your tax returns.", bg: MINT, cta: "I'm a Landlord" },
  { Icon: Building2, title: "Property Managers", desc: "Managing multiple properties and tenants? Bulk generate receipts, send via email, and manage everything in one dashboard.", bg: TEAL, cta: "I Manage Properties" },
  { Icon: Briefcase, title: "Employees & Tenants", desc: "Need housing allowance claims for your employer? Get a LIRS-approved receipt your HR department will accept.", bg: YELLOW, cta: "I'm a Tenant" },
];

export default function RentReceiptAudience() {
  return (
    <section className="relative py-24 md:py-28 overflow-hidden" style={{ backgroundColor: "#f5f2ec" }}>
      <div className="h-px w-full absolute top-0" style={{ backgroundColor: PENCIL, opacity: 0.35 }} />
      <div className="max-w-[1200px] mx-auto px-5 md:px-10">
        <div className="text-center mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
            Who It's For
          </div>
          <h2 className="cx-heading leading-none" style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 800, letterSpacing: "0.04em", color: INK, lineHeight: 1.05 }}>
            Built for every side{" "}
            <span style={{ backgroundColor: YELLOW, padding: "0 6px 3px", borderRadius: 3 }}>of the lease</span>
          </h2>
        </div>
        <div className="cx-cards-row grid grid-cols-1 md:grid-cols-3 gap-5">
          {audiences.map(({ Icon, title, desc, bg, cta }) => (
            <div key={title} className="cx-card rounded-xl p-7 flex flex-col transition-all duration-300 hover:-translate-y-1"
              style={{ backgroundColor: bg, border: `1.5px solid ${INK}`, boxShadow: "rgba(0,0,0,0.05) 0px 1px 2px" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ backgroundColor: INK }}>
                <Icon className="w-5.5 h-5.5" style={{ color: CREAM }} strokeWidth={1.75} />
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{title}</h3>
              <p className="text-sm leading-relaxed flex-grow mb-6" style={{ color: INK, opacity: 0.60, fontFamily: "Inter,system-ui,sans-serif" }}>{desc}</p>
              <Link to="/customer-dashboard/signup"
                className="mt-auto flex items-center gap-1.5 text-sm font-semibold pt-5"
                style={{ borderTop: `1px solid rgba(26,51,0,0.18)`, color: INK, fontFamily: "Inter,system-ui,sans-serif", textDecoration: "none" }}>
                {cta} <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
