import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck } from "lucide-react";

const INK = "#18623f"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const TEAL = "#a8e5e5";

const RETRO_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.09) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

function calcPIT(gross: number) {
  const brackets: [number, number][] = [[300000,7],[300000,11],[500000,15],[500000,19],[1600000,21],[Infinity,24]];
  let tax = 0; let rem = Math.max(0, gross - 200000);
  for (const [cap, rate] of brackets) { const t = Math.min(rem, cap); tax += t*(rate/100); rem -= t; if (rem<=0) break; }
  return { annual: Math.round(tax), monthly: Math.round(tax/12), rate: gross>0?((tax/gross)*100).toFixed(1):"0.0" };
}

function fmt(n: number) {
  if (n >= 1_000_000) return `₦${(n/1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n/1_000).toFixed(0)}k`;
  return `₦${n}`;
}

export default function TaxesHero() {
  const [income, setIncome] = useState(2_400_000);
  const pit = calcPIT(income);

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
              Tax Filing
            </div>

            <h1 className="leading-none font-extrabold"
              style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2.6rem,5.5vw,4.2rem)", letterSpacing: "0.04em", color: INK, lineHeight: 1.06 }}>
              Nigerian Tax{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 8px 4px", borderRadius: 4, display: "inline-block" }}>Filing</span>
              {" "}Made Simple
            </h1>

            <p className="text-lg leading-relaxed"
              style={{ color: INK, opacity: 0.60, fontFamily: "Inter,system-ui,sans-serif", maxWidth: "42ch" }}>
              File PIT, VAT, and corporate tax returns fully compliant with FIRS and LIRS requirements. Save 40+ hours every tax year.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[["40+ hrs","Saved per year"],["99%","Accuracy rate"],["FIRS","Approved"]].map(([v,l]) => (
                <div key={l} className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: CREAM, border: `1px solid ${PENCIL}` }}>
                  <p className="text-lg font-bold" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{v}</p>
                  <p className="text-xs" style={{ color: INK, opacity: 0.45, fontFamily: "Inter,system-ui,sans-serif" }}>{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <Link to="/customer-dashboard/signup"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium hover:opacity-90 active:scale-95"
                style={{ backgroundColor: INK, color: CREAM, fontFamily: "Inter,system-ui,sans-serif" }}>
                Start Filing Free <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium border"
                style={{ color: INK, borderColor: INK, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                See Pricing
              </Link>
            </div>

            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" style={{ color: PENCIL }} />
              <p className="text-xs" style={{ color: PENCIL, fontFamily: "Inter,system-ui,sans-serif" }}>
                FIRS &amp; LIRS compliant · 15,000+ active filers
              </p>
            </div>
          </div>

          {/* ── Right: Full iPhone mockup on teal ── */}
          <div className="flex flex-col justify-center">
            <div
              className="relative flex flex-col items-center justify-center rounded-2xl py-10 px-6 w-full"
              style={{
                backgroundColor: TEAL,
                backgroundImage: "radial-gradient(circle at top left, rgba(255,255,255,0.14), transparent 220px), linear-gradient(180deg, rgba(255,255,255,0.10), rgba(255,255,255,0.02))",
                border: "1.5px solid rgba(255,255,255,0.24)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.12)",
              }}
            >
              {/* Live label */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2"
                style={{ backgroundColor: "rgba(26,51,0,0.12)", borderRadius: 20, padding: "4px 14px" }}>
                <p style={{ fontSize: 9, fontWeight: 600, color: INK, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.08em" }}>
                  LIVE CALCULATOR
                </p>
              </div>

              {/* Complete iPhone */}
              <div style={{ position: "relative", width: "100%" }}>
                {/* Left buttons */}
                <div style={{ position: "absolute", left: -11, top: 78, width: 4, height: 32, borderRadius: "2px 0 0 2px", backgroundColor: "rgba(26,51,0,0.35)" }} />
                <div style={{ position: "absolute", left: -11, top: 120, width: 4, height: 32, borderRadius: "2px 0 0 2px", backgroundColor: "rgba(26,51,0,0.35)" }} />
                <div style={{ position: "absolute", left: -11, top: 162, width: 4, height: 32, borderRadius: "2px 0 0 2px", backgroundColor: "rgba(26,51,0,0.35)" }} />
                {/* Right button */}
                <div style={{ position: "absolute", right: -11, top: 110, width: 4, height: 56, borderRadius: "0 2px 2px 0", backgroundColor: "rgba(26,51,0,0.35)" }} />

                {/* Phone body */}
                <div style={{
                  width: "100%",
                  borderRadius: 52,
                  border: `10px solid ${TEAL}`,
                  backgroundColor: TEAL,
                  boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.16), 0 18px 40px rgba(0,0,0,0.10)",
                  overflow: "hidden",
                }}>
                  {/* Notch area */}
                  <div style={{ backgroundColor: "rgba(255,255,255,0.08)", paddingTop: 14, paddingBottom: 8, display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <div style={{ width: 108, height: 30, borderRadius: 15, backgroundColor: "rgba(255,255,255,0.12)", border: "1.5px solid rgba(255,255,255,0.18)" }} />
                  </div>

                  {/* Status bar */}
                  <div style={{ backgroundColor: "rgba(255,255,255,0.05)", padding: "0 20px 12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.9)", fontFamily: "Inter,system-ui,sans-serif" }}>9:41</span>
                    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
                      {/* Signal bars */}
                      <div style={{ display: "flex", gap: 1.5, alignItems: "flex-end", height: 9 }}>
                        {[3,5,7,9].map((h,i) => (
                          <div key={i} style={{ width: 2.5, height: h, backgroundColor: i < 3 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)", borderRadius: 1 }} />
                        ))}
                      </div>
                      {/* WiFi */}
                      <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                        <path d="M6.5 7.5C7.05 7.5 7.5 7.95 7.5 8.5S7.05 9.5 6.5 9.5 5.5 9.05 5.5 8.5 5.95 7.5 6.5 7.5Z" fill="rgba(255,255,255,0.9)"/>
                        <path d="M3.8 5.5C4.7 4.6 5.5 4 6.5 4C7.5 4 8.3 4.6 9.2 5.5" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                        <path d="M1.5 3C3 1.5 4.6 0.5 6.5 0.5C8.4 0.5 10 1.5 11.5 3" stroke="rgba(255,255,255,0.9)" strokeWidth="1.3" strokeLinecap="round" fill="none"/>
                      </svg>
                      {/* Battery */}
                      <div style={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <div style={{ width: 20, height: 10, borderRadius: 2.5, border: "1.2px solid rgba(255,255,255,0.55)", position: "relative", overflow: "hidden" }}>
                          <div style={{ width: "78%", height: "100%", backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 1.5 }} />
                        </div>
                        <div style={{ width: 2, height: 5, borderRadius: "0 1px 1px 0", backgroundColor: "rgba(255,255,255,0.6)" }} />
                      </div>
                    </div>
                  </div>

                  {/* Screen content */}
                  <div style={{ backgroundColor: "rgba(255,255,255,0.14)", padding: "18px 18px 16px", minHeight: 540, display: "grid", gap: 16 }}>
                    {/* App header */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14, marginBottom: 18 }}>
                      <div>
                        <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(26,51,0,0.78)", fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 5 }}>
                          My Tax Filing
                        </p>
                        <p style={{ fontSize: 18, fontWeight: 900, color: INK, fontFamily: "Inter,system-ui,sans-serif", lineHeight: 1.05, marginBottom: 6 }}>
                          PIT Calculator
                        </p>
                        <p style={{ fontSize: 10, color: "rgba(26,51,0,0.68)", fontFamily: "Inter,system-ui,sans-serif" }}>
                          2024 tax year · FIRS rates
                        </p>
                      </div>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.26)", display: "grid", placeItems: "center" }}>
                        <span style={{ fontSize: 14, color: INK, fontWeight: 800 }}>
                          ₦
                        </span>
                      </div>
                    </div>

                    {/* Income card */}
                    <div style={{ backgroundColor: "rgba(255,255,255,0.24)", borderRadius: 22, padding: "20px 18px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.30)" }}>
                      <p style={{ fontSize: 9, color: "rgba(26,51,0,0.72)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Roboto Mono',monospace", marginBottom: 10 }}>
                        Annual gross income
                      </p>
                      <p style={{ fontSize: 32, fontWeight: 900, color: INK, fontFamily: "Inter,system-ui,sans-serif", lineHeight: 1.05, marginBottom: 18 }}>
                        {fmt(income)}
                      </p>
                      <input
                        type="range" min="500000" max="20000000" step="100000" value={income}
                        onChange={e => setIncome(+e.target.value)}
                        style={{ width: "100%", accentColor: YELLOW, height: 4, cursor: "pointer", marginTop: 6, display: "block", backgroundColor: "rgba(255,255,255,0.18)" }}
                      />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, color: "rgba(26,51,0,0.62)", fontSize: 9, fontFamily: "Inter,system-ui,sans-serif" }}>
                        <span>₦500k</span>
                        <span>₦20M</span>
                      </div>
                    </div>

                    {/* Tax summary */}
                    <div style={{ display: "grid", gap: 12 }}>
                      <div style={{ backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 20, padding: "18px 18px", border: "1px solid rgba(255,255,255,0.30)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                          <p style={{ fontSize: 8, color: "rgba(26,51,0,0.72)", letterSpacing: "0.08em", textTransform: "uppercase", fontFamily: "'Roboto Mono',monospace", margin: 0 }}>
                            Tax summary
                          </p>
                          <span style={{ fontSize: 10, fontWeight: 700, color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>
                            {pit.rate}% effective
                          </span>
                        </div>
                        {[
                          ["Annual tax", `₦${pit.annual.toLocaleString()}`],
                          ["Monthly deduction", `₦${pit.monthly.toLocaleString()}`],
                        ].map(([label, value]) => (
                          <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                            <span style={{ fontSize: 11, color: "rgba(26,51,0,0.72)", fontFamily: "Inter,system-ui,sans-serif" }}>{label}</span>
                            <span style={{ fontSize: 13, fontWeight: 800, color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{value}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 16, padding: "14px 14px" }}>
                          <p style={{ fontSize: 8, color: "rgba(26,51,0,0.7)", fontFamily: "'Roboto Mono',monospace", marginBottom: 6 }}>
                            Effective rate
                          </p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{pit.rate}%</p>
                        </div>
                        <div style={{ backgroundColor: "rgba(255,255,255,0.22)", borderRadius: 16, padding: "14px 14px" }}>
                          <p style={{ fontSize: 8, color: "rgba(26,51,0,0.7)", fontFamily: "'Roboto Mono',monospace", marginBottom: 6 }}>
                            Monthly payment
                          </p>
                          <p style={{ fontSize: 18, fontWeight: 900, color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>₦{pit.monthly.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Allowances */}
                    <div style={{ backgroundColor: "rgba(255,255,255,0.16)", borderRadius: 20, padding: "16px 16px", border: "1px solid rgba(255,255,255,0.24)" }}>
                      <p style={{ fontSize: 8, color: "rgba(26,51,0,0.72)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "'Roboto Mono',monospace", marginBottom: 10, margin: 0 }}>
                        Allowances applied
                      </p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
                        {['CRA ₦200k','Housing','Transport','NHIS','NHF'].map(a => (
                          <span key={a} style={{
                            fontSize: 9, fontWeight: 700, padding: "6px 10px", borderRadius: 9999,
                            backgroundColor: "rgba(255,255,255,0.22)", color: INK, fontFamily: "Inter,system-ui,sans-serif"
                          }}>{a}</span>
                        ))}
                      </div>
                    </div>

                    {/* CTA */}
                    <div style={{ display: "grid", gap: 10 }}>
                      <div style={{ backgroundColor: "rgba(255,255,255,0.96)", borderRadius: 22, padding: "18px 18px", textAlign: "center", border: "1px solid rgba(255,255,255,0.36)", boxShadow: "inset 0 1px 2px rgba(26,51,0,0.05)" }}>
                        <p style={{ fontSize: 12, fontWeight: 900, color: INK, fontFamily: "Inter,system-ui,sans-serif", margin: 0 }}>
                          File my return in minutes →
                        </p>
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, padding: "0 2px", color: "rgba(26,51,0,0.72)", fontSize: 9, fontFamily: "Inter,system-ui,sans-serif" }}>
                        <span style={{ lineHeight: 1.4 }}>Ready in just a few easy steps.</span>
                        <span style={{ backgroundColor: "rgba(255,255,255,0.24)", color: INK, fontWeight: 700, borderRadius: 9999, padding: "6px 10px" }}>
                          FIRS-ready
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Home indicator */}
                  <div style={{ backgroundColor: "rgba(255,255,255,0.06)", paddingTop: 14, paddingBottom: 18, display: "flex", justifyContent: "center" }}>
                    <div style={{ width: 88, height: 4, borderRadius: 9999, backgroundColor: "rgba(255,255,255,0.24)" }} />
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
