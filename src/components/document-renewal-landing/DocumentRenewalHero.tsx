import { Link } from "react-router-dom";
import { ArrowUpRight, ShieldCheck, Bell, AlertTriangle, CheckCircle2, Clock } from "lucide-react";

const INK = "#1a3300"; const CREAM = "#fcfaf5"; const YELLOW = "#ffe95c"; const PENCIL = "#b6b6b6"; const BLUSH = "#f6d0ff";

const RETRO_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.09) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

const docs = [
  { name: "CAC Annual Return",  due: "Overdue",  status: "danger",  icon: "🏛️" },
  { name: "Vehicle License",    due: "12 days",  status: "warning", icon: "🚗" },
  { name: "Business Permit",    due: "45 days",  status: "warning", icon: "📋" },
  { name: "Driver's License",   due: "6 months", status: "good",    icon: "🪪" },
  { name: "Insurance Policy",   due: "2 months", status: "good",    icon: "🛡️" },
];

const STATUS = {
  good:    { bar: "#16a34a", badge: "rgba(22,163,74,0.12)",  text: "#15803d", border: "#16a34a" },
  warning: { bar: "#d97706", badge: "rgba(217,119,6,0.12)",  text: "#b45309", border: "#d97706" },
  danger:  { bar: "#dc2626", badge: "rgba(220,38,38,0.14)",  text: "#b91c1c", border: "#dc2626" },
};

export default function DocumentRenewalHero() {
  const overdue  = docs.filter(d => d.status === "danger").length;
  const expiring = docs.filter(d => d.status === "warning").length;
  const safe     = docs.filter(d => d.status === "good").length;

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
              Document Renewal
            </div>

            <h1 className="leading-none font-extrabold"
              style={{ fontFamily: "'Bricolage Grotesque','Archivo Black',ui-sans-serif", fontSize: "clamp(2.6rem,5.5vw,4.2rem)", letterSpacing: "0.04em", color: INK, lineHeight: 1.06 }}>
              Never Miss a{" "}
              <span style={{ backgroundColor: YELLOW, padding: "0 8px 4px", borderRadius: 4, display: "inline-block" }}>Renewal</span>
              {" "}Deadline Again
            </h1>

            <p className="text-lg leading-relaxed"
              style={{ color: INK, opacity: 0.60, fontFamily: "Inter,system-ui,sans-serif", maxWidth: "42ch" }}>
              Track, renew, and manage all your Nigerian documents in one place. Smart alerts before your vehicle papers, business permits, and licences expire.
            </p>

            <div className="grid grid-cols-3 gap-3">
              {[["90 Days","Early alerts"],["6 Types","Supported"],["WhatsApp","& Email"]].map(([v,l]) => (
                <div key={l} className="rounded-xl p-3 text-center"
                  style={{ backgroundColor: CREAM, border: `1px solid ${PENCIL}` }}>
                  <p className="text-sm font-bold" style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>{v}</p>
                  <p className="text-xs" style={{ color: INK, opacity: 0.45, fontFamily: "Inter,system-ui,sans-serif" }}>{l}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {["Smart Alerts", "Multi-document", "FRSC Approved"].map(b => (
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
                Track My Documents <ArrowUpRight className="w-4 h-4" />
              </Link>
              <Link to="#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-md text-sm font-medium border"
                style={{ color: INK, borderColor: INK, fontFamily: "Inter,system-ui,sans-serif", backgroundColor: CREAM }}>
                View Plans
              </Link>
            </div>
          </div>

          {/* ── Right: Elevated dashboard on blush ── */}
          <div className="flex flex-col justify-center">
            <div className="flex flex-col rounded-2xl overflow-hidden w-full"
              style={{ backgroundColor: BLUSH, border: `1.5px solid ${INK}`, boxShadow: `5px 5px 0px 0px ${INK}` }}>

              {/* Header */}
              <div className="px-6 pt-6 pb-5" style={{ borderBottom: `1px solid rgba(26,51,0,0.10)` }}>
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p style={{ fontSize: 9, color: INK, opacity: 0.40, fontFamily: "'Roboto Mono',monospace", letterSpacing: "0.12em", marginBottom: 2 }}>
                      DOCUMENT VAULT
                    </p>
                    <p style={{ fontSize: 18, fontWeight: 800, color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>
                      Renewal Dashboard
                    </p>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ backgroundColor: INK }}>
                      <Bell className="w-4.5 h-4.5" style={{ color: CREAM }} />
                    </div>
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold"
                      style={{ backgroundColor: "#dc2626", color: "#fff", fontFamily: "Inter,system-ui,sans-serif" }}>
                      {overdue + expiring}
                    </div>
                  </div>
                </div>

                {/* Summary stats */}
                <div className="grid grid-cols-3 gap-2.5">
                  {[
                    { label: "Overdue",    count: overdue,  ...STATUS.danger  },
                    { label: "Expiring",   count: expiring, ...STATUS.warning },
                    { label: "Up to date", count: safe,     ...STATUS.good    },
                  ].map(s => (
                    <div key={s.label} className="rounded-2xl p-3 text-center"
                      style={{ backgroundColor: s.badge, border: `1px solid ${s.border}22` }}>
                      <p style={{ fontSize: 26, fontWeight: 900, color: s.text, fontFamily: "Inter,system-ui,sans-serif", lineHeight: 1 }}>{s.count}</p>
                      <p style={{ fontSize: 10, fontWeight: 600, color: s.text, opacity: 0.80, fontFamily: "Inter,system-ui,sans-serif", marginTop: 2 }}>{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Document list */}
              <div className="px-6 py-4 space-y-2.5 flex-1">
                {docs.map(doc => {
                  const s = STATUS[doc.status as keyof typeof STATUS];
                  return (
                    <div key={doc.name}
                      className="flex items-center rounded-xl overflow-hidden"
                      style={{ backgroundColor: "rgba(255,255,255,0.65)", border: `1px solid rgba(26,51,0,0.07)` }}>
                      {/* Color bar */}
                      <div style={{ width: 4, alignSelf: "stretch", backgroundColor: s.bar, flexShrink: 0 }} />
                      <div className="flex items-center gap-2.5 flex-1 py-3 px-3">
                        <span className="text-base leading-none flex-shrink-0">{doc.icon}</span>
                        <p className="flex-1 text-xs font-semibold truncate"
                          style={{ color: INK, fontFamily: "Inter,system-ui,sans-serif" }}>
                          {doc.name}
                        </p>
                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          {doc.status === "good"    && <CheckCircle2 className="w-3.5 h-3.5" style={{ color: s.bar }} />}
                          {doc.status === "warning" && <Clock        className="w-3.5 h-3.5" style={{ color: s.bar }} />}
                          {doc.status === "danger"  && <AlertTriangle className="w-3.5 h-3.5" style={{ color: s.bar }} />}
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full"
                            style={{ backgroundColor: s.badge, color: s.text, fontFamily: "Inter,system-ui,sans-serif", whiteSpace: "nowrap" }}>
                            {doc.due}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* WhatsApp alert footer */}
              <div className="px-6 pb-6 pt-2">
                <div className="flex items-center gap-3 rounded-2xl p-4"
                  style={{ backgroundColor: "rgba(220,38,38,0.08)", border: `1px solid rgba(220,38,38,0.20)` }}>
                  <div className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "rgba(220,38,38,0.12)" }}>
                    <Bell className="w-4 h-4" style={{ color: "#b91c1c" }} />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: "#b91c1c", fontFamily: "Inter,system-ui,sans-serif" }}>
                      WhatsApp alert sent
                    </p>
                    <p style={{ fontSize: 10, color: "#b91c1c", opacity: 0.70, fontFamily: "Inter,system-ui,sans-serif" }}>
                      CAC Annual Return is overdue — action required
                    </p>
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
