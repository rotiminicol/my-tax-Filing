import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";
import ReceiptDocument from "@/components/receipt/ReceiptDocument";
import type { Receipt } from "@/lib/rr/types";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2";

const RETRO_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.09) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

const MOCK_RECEIPT: Receipt = {
  id: "RR-2026-00142",
  createdAt: "2026-06-01T00:00:00Z",
  status: "generated",
  taxpayer: {
    fullName: "Chidi Emmanuel Okafor",
    taxId: "22-12345678",
    propertyAddress: "24B Admiralty Way, Lekki Phase 1, Lagos",
    annualRentalAmount: 1800000,
    allowanceClaimed: 1935000,
  },
  landlord: {
    fullName: "Mrs. Funke Adeleke",
    type: "landlord",
    address: "12 Victoria Island Drive, Lagos",
    phone: "+234 803 111 2222",
    email: "funke@adeleke.ng",
    taxId: "11-87654321",
  },
  employer: {
    companyName: "Standard Chartered Bank Nigeria",
    taxId: "13-22334455",
    taxOffice: "FCT-IRS Maitama Office",
    claimYear: "2026",
  },
  declaration: true,
};

export default function RentReceiptHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: CREAM, ...RETRO_BG, paddingTop: 100, paddingBottom: 64 }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col justify-center space-y-6 py-2 lg:py-10">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
              style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}
            >
              Rent Receipts
            </div>

            <h1
              className="leading-none font-extrabold"
              style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2.6rem,5.5vw,4.2rem)", letterSpacing: "0.04em", color: INK, lineHeight: 1.06 }}
            >
              Professional Rent{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 8px 4px", borderRadius: 4, display: "inline-block" }}>Receipts</span>
              {" "}in 60 Seconds
            </h1>

            <p className="text-lg leading-relaxed" style={{ color: INK, opacity: 0.60, fontFamily: "Inter,system-ui,sans-serif", maxWidth: "42ch" }}>
              Generate legally-compliant Nigerian rent receipts instantly — for landlords, property managers, and tenants claiming housing allowance.
            </p>

            <div className="flex flex-wrap gap-2">
              {["LIRS Approved Format", "256-bit SSL", "Instant PDF"].map(b => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ border: `1px solid ${PENCIL}`, color: INK, opacity: 0.65, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: INK }} />{b}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/customer-dashboard/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium transition-all duration-200 hover:opacity-90 active:scale-95"
                style={{ backgroundColor: INK, color: CREAM, fontFamily: "Inter,system-ui,sans-serif" }}>
                Create Free Receipt <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium border"
                style={{ color: INK, borderColor: INK, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                View Pricing
              </Link>
            </div>

            <p className="text-xs" style={{ color: PENCIL, fontFamily: "Inter,system-ui,sans-serif" }}>
              Trusted by 15,000+ Nigerian landlords &amp; tenants
            </p>
          </div>

          {/* ── Right: Receipt fills the green card ── */}
          <div className="flex flex-col justify-start">
            <div
              className="relative rounded-2xl overflow-hidden w-full"
              style={{ backgroundColor: MINT, border: `1.5px solid ${INK}`, boxShadow: `5px 5px 0px 0px ${INK}` }}
            >
              {/* Retro corner dots */}
              {[["top-3 left-3"],["top-3 right-3"],["bottom-3 left-3"],["bottom-3 right-3"]].map(([pos]) => (
                <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full z-20`} style={{ backgroundColor: INK, opacity: 0.20 }} />
              ))}

              {/* Label badge — floats over receipt */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                <span className="text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full" style={{ backgroundColor: INK, color: CREAM, fontFamily: "'Roboto Mono',monospace" }}>
                  Live Receipt Sample
                </span>
              </div>

              {/* Receipt fills the entire container */}
              <div style={{ height: 560, position: "relative", overflow: "hidden" }}>
                <div style={{
                  transform: "scale(0.53)",
                  transformOrigin: "top left",
                  width: `${100 / 0.53}%`,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  userSelect: "none",
                }}>
                  <ReceiptDocument
                    receipt={MOCK_RECEIPT}
                    className="!bg-[#d5f5c2] !border-0 !shadow-none !max-w-none !rounded-none"
                  />
                </div>

                {/* Fade bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none z-10" style={{
                  background: `linear-gradient(to bottom, transparent, ${MINT})`
                }} />
                <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center pb-3 pointer-events-none z-20">
                  <span className="text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(26,51,0,0.10)", color: INK, fontFamily: "'Roboto Mono',monospace" }}>
                    FCT-IRS · NTAA Compliant · Section 57
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
