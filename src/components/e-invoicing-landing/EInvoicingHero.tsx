import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const INK = "#1a3300"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const MINT = "#d5f5c2";

const RETRO_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.09) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

const lineItems = [
  { desc: "Brand Strategy & Identity Design", qty: 1, unit: 450_000 },
  { desc: "Website Redesign (5 pages)",       qty: 1, unit: 200_000 },
  { desc: "Social Media Setup & Templates",   qty: 1, unit: 80_000  },
];

const subtotal = lineItems.reduce((s, l) => s + l.qty * l.unit, 0);
const vat      = Math.round(subtotal * 0.075);
const wht      = Math.round(subtotal * 0.05);
const total    = subtotal + vat - wht;

const naira = (n: number) => "₦" + n.toLocaleString("en-NG");

export default function EInvoicingHero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ backgroundColor: CREAM, ...RETRO_BG, paddingTop: 100, paddingBottom: 64 }}
    >
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-stretch">

          {/* ── Left: Copy ── */}
          <div className="flex flex-col justify-center space-y-6 py-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium w-fit"
              style={{ backgroundColor: YELLOW, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.04em" }}>
              E‑Invoicing
            </div>

            <h1 className="leading-none font-extrabold"
              style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2.6rem,5.5vw,4.2rem)", letterSpacing: "0.04em", color: INK, lineHeight: 1.06 }}>
              Professional Invoices{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 8px 4px", borderRadius: 4, display: "inline-block" }}>with Auto VAT</span>
            </h1>

            <p className="text-lg leading-relaxed"
              style={{ color: INK, opacity: 0.60, fontFamily: "Inter,system-ui,sans-serif", maxWidth: "42ch" }}>
              Create FIRS-compliant invoices for Nigerian businesses in seconds. Automatic VAT &amp; WHT calculations, professional PDF export, and client management built in.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[["Auto","VAT 7.5%"],["< 2 min","Per invoice"],["FIRS","Compliant"]].map(([v,l]) => (
                <div key={l} className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: CREAM, border: `1px solid ${PENCIL}` }}>
                  <p className="text-sm font-bold" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{v}</p>
                  <p className="text-xs" style={{ color: INK, opacity: 0.45, fontFamily: "Inter,system-ui,sans-serif" }}>{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {["FIRS Compliant", "Auto VAT & WHT", "PDF Export"].map(b => (
                <span key={b} className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full"
                  style={{ border: `1px solid ${PENCIL}`, color: INK, opacity: 0.65, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                  <ShieldCheck className="w-3.5 h-3.5" style={{ color: INK }} />{b}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/customer-dashboard/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium hover:opacity-90 active:scale-95"
                style={{ backgroundColor: INK, color: CREAM, fontFamily: "Inter,system-ui,sans-serif" }}>
                Create Free Invoice <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium border"
                style={{ color: INK, borderColor: INK, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                See Pricing
              </Link>
            </div>
          </div>

          {/* ── Right: Full invoice on mint background ── */}
          <div className="flex flex-col justify-center">
            <div
              className="relative rounded-2xl p-5 w-full"
              style={{ backgroundColor: MINT, border: `1.5px solid ${INK}`, boxShadow: `5px 5px 0px 0px ${INK}` }}
            >
              {/* Corner dots */}
              {["top-3 left-3","top-3 right-3","bottom-3 left-3","bottom-3 right-3"].map(pos => (
                <div key={pos} className={`absolute ${pos} w-2 h-2 rounded-full`} style={{ backgroundColor: INK, opacity: 0.18 }} />
              ))}

              {/* Full invoice paper — full green container */}
              <div style={{
                backgroundColor: "transparent",
                borderRadius: 22,
                boxShadow: "none",
                overflow: "hidden",
                fontFamily: "Inter,system-ui,sans-serif",
                width: "100%",
                border: "none",
              }}>
                {/* Invoice header band */}
                <div style={{ backgroundColor: "rgba(255,255,255,0.12)", padding: "18px 22px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <p style={{ fontSize: 9, color: "rgba(10,55,22,0.75)", fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.14em", marginBottom: 3 }}>
                      MY TAX FILING · E-INVOICING
                    </p>
                    <p style={{ fontSize: 22, fontWeight: 900, color: INK, letterSpacing: "0.03em", lineHeight: 1 }}>INVOICE</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: 11, color: "rgba(10,55,22,0.7)", fontFamily: "'Roboto Mono',monospace" }}>#INV-2025-00089</p>
                    <p style={{ fontSize: 9, color: "rgba(10,55,22,0.55)", marginTop: 3 }}>Issued: 01 Jun 2025</p>
                    <div style={{ marginTop: 7, backgroundColor: YELLOW, borderRadius: 5, padding: "3px 9px", display: "inline-block" }}>
                      <p style={{ fontSize: 8, fontWeight: 900, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.06em" }}>DUE: 30 JUN 2025</p>
                    </div>
                  </div>
                </div>

                {/* From / Bill To */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", borderBottom: "1px solid rgba(255,255,255,0.35)" }}>
                  <div style={{ padding: "14px 18px", borderRight: "1px solid rgba(255,255,255,0.35)" }}>
                    <p style={{ fontSize: 8, color: "rgba(10,55,22,0.7)", letterSpacing: "0.12em", fontFamily: "'Roboto Mono',monospace", marginBottom: 6 }}>FROM</p>
                    <p style={{ fontSize: 12, fontWeight: 800, color: INK, lineHeight: 1.2 }}>Lagos Creative Agency Ltd</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)", marginTop: 3 }}>RC: 1234567</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)" }}>VAT: 21234567-0001</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)", marginTop: 2 }}>5 Baderinwa Str, Victoria Island</p>
                  </div>
                  <div style={{ padding: "14px 18px" }}>
                    <p style={{ fontSize: 8, color: "rgba(10,55,22,0.7)", letterSpacing: "0.12em", fontFamily: "'Roboto Mono',monospace", marginBottom: 6 }}>BILL TO</p>
                    <p style={{ fontSize: 12, fontWeight: 800, color: INK, lineHeight: 1.2 }}>Zenith Bank PLC</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)", marginTop: 3 }}>Procurement Department</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)" }}>Plot 84, Ajose Adeogun, V.I.</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)", marginTop: 2 }}>Lagos, Nigeria</p>
                  </div>
                </div>

                {/* Items table header */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 36px 90px", gap: 4, padding: "7px 18px 5px", backgroundColor: "rgba(255,255,255,0.12)", borderBottom: "1px solid rgba(255,255,255,0.28)" }}>
                  {["DESCRIPTION","QTY","AMOUNT"].map((h,i) => (
                    <p key={h} style={{ fontSize: 8, fontWeight: 700, color: "rgba(10,55,22,0.7)", fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.08em", textAlign: i > 0 ? "right" : "left" }}>{h}</p>
                  ))}
                </div>

                {/* Line items */}
                {lineItems.map((item, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 36px 90px", gap: 4, padding: "8px 18px", borderBottom: "1px solid rgba(255,255,255,0.18)", alignItems: "center" }}>
                    <p style={{ fontSize: 11, color: "rgba(10,55,22,0.88)", fontWeight: 500, lineHeight: 1.3 }}>{item.desc}</p>
                    <p style={{ fontSize: 11, color: "rgba(10,55,22,0.75)", textAlign: "right" }}>{item.qty}</p>
                    <p style={{ fontSize: 11, color: INK, fontWeight: 700, textAlign: "right" }}>{naira(item.unit)}</p>
                  </div>
                ))}

                {/* Totals block */}
                <div style={{ padding: "12px 18px", backgroundColor: "rgba(255,255,255,0.14)", borderTop: "1.5px solid rgba(255,255,255,0.28)" }}>
                  {[
                    ["Subtotal",   naira(subtotal), false],
                    ["VAT (7.5%)", naira(vat),      false],
                    ["WHT (5%)",  `-${naira(wht)}`, false],
                  ].map(([l,v]) => (
                    <div key={String(l)} style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: "rgba(10,55,22,0.75)" }}>{String(l)}</span>
                      <span style={{ fontSize: 11, color: INK, fontWeight: 600 }}>{String(v)}</span>
                    </div>
                  ))}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "2px solid rgba(255,255,255,0.32)" }}>
                    <span style={{ fontSize: 11, fontWeight: 900, color: INK }}>TOTAL DUE</span>
                    <span style={{ fontSize: 18, fontWeight: 900, color: INK, letterSpacing: "-0.01em" }}>{naira(total)}</span>
                  </div>
                </div>

                {/* Bank + compliance */}
                <div style={{ padding: "10px 18px 12px", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(255,255,255,0.32)" }}>
                  <div>
                    <p style={{ fontSize: 8, color: "rgba(10,55,22,0.72)", fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.10em", marginBottom: 4 }}>PAYMENT DETAILS</p>
                    <p style={{ fontSize: 11, color: INK, fontWeight: 700 }}>Guaranty Trust Bank</p>
                    <p style={{ fontSize: 10, color: "rgba(10,55,22,0.78)" }}>Acc: 0123456789 · Lagos Creative Agency Ltd</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "flex-end" }}>
                      <ShieldCheck className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />
                      <p style={{ fontSize: 10, color: "#16a34a", fontWeight: 700 }}>FIRS Compliant</p>
                    </div>
                    <p style={{ fontSize: 9, color: "rgba(10,55,22,0.7)", fontFamily: "'Roboto Mono',monospace", marginTop: 2 }}>mytaxfiling.ng</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
