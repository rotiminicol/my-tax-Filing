import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import firsLogo from "@/assets/firs.png";
import fctLogo from "@/assets/fct.png";

const CREAM = "#fcfaf5";
const INK = "#18623f";
const YELLOW = "#ffe95c";
const TEAL = "#a8e5e5";
const BLUSH = "#f6d0ff";
const DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};
const CREAM_DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.08) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

const perks = [
  "File PIT, VAT & WHT returns online",
  "Auto-generated FIRS-compliant invoices",
  "Document renewal alerts via WhatsApp",
  "Rent receipt with LIRS stamp in 60s",
];

interface Props {
  children: ReactNode;
  mobileBrand?: ReactNode;
}

export default function SignupLayout({ children }: Props) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row" style={{ backgroundColor: CREAM }}>
      <aside
        className="hidden md:flex md:w-[44%] lg:w-[42%] flex-col justify-between p-10 lg:p-14 relative overflow-hidden"
        style={{ backgroundColor: INK, ...DOT_BG }}
      >
        <Link to="/" className="relative z-10">
          <span
            className="text-xl font-black uppercase tracking-tight text-white"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
          >
            My Tax Filing
          </span>
        </Link>

        <div className="relative z-10 flex flex-col gap-10">
          <div>
            <p
              className="text-[10px] font-black uppercase tracking-[0.25em] mb-4"
              style={{ fontFamily: "'Roboto Mono', monospace", color: YELLOW }}
            >
              Nigeria's #1 Tax Platform
            </p>
            <h2
              className="text-4xl lg:text-5xl font-black uppercase leading-[1.05] text-white"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif" }}
            >
              Full Tax
              <br />
              Compliance.
              <br />
              <span style={{ color: YELLOW }}>No Stress.</span>
            </h2>
          </div>

          <div className="flex flex-col gap-3">
            {perks.map((perk) => (
              <div key={perk} className="flex items-start gap-3">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: TEAL }} />
                <span className="text-sm font-semibold text-white/80">{perk}</span>
              </div>
            ))}
          </div>

          <div
            className="p-6 rounded-xl"
            style={{ backgroundColor: BLUSH, borderRadius: 12 }}
          >
            <p
              className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 opacity-60"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              Customer Story
            </p>
            <p className="text-sm font-semibold leading-relaxed italic" style={{ color: INK }}>
              "Filing taxes used to take a whole month. With My Tax Filing, I finished PIT and VAT returns in under 15 minutes."
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black text-white"
                style={{ backgroundColor: INK }}
              >
                CO
              </div>
              <div>
                <p className="text-xs font-black" style={{ color: INK }}>Chidi Okoro</p>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.15em] opacity-60"
                  style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
                >
                  CEO, TechFrontier
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-5 opacity-50">
          <img src={firsLogo} alt="FIRS" className="h-7 object-contain brightness-200" />
          <img src={fctLogo} alt="FCT-IRS" className="h-7 object-contain brightness-200" />
        </div>
      </aside>

      <section
        className="flex-1 flex flex-col"
        style={{ backgroundColor: CREAM, ...CREAM_DOT_BG }}
      >
        <header
          className="md:hidden flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1.5px solid rgba(26,51,0,0.10)" }}
        >
          <Link to="/">
            <span
              className="text-lg font-black uppercase tracking-tight"
              style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
            >
              My Tax Filing
            </span>
          </Link>
          <Link
            to="/customer-dashboard/login"
            className="text-[11px] font-black uppercase tracking-[0.18em] hover:opacity-60 transition-opacity"
            style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
          >
            Log In
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 py-10">
          {children}
        </div>

        <footer
          className="px-6 py-5 text-center"
          style={{ borderTop: "1.5px solid rgba(26,51,0,0.10)" }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40"
            style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
          >
            © {new Date().getFullYear()} My Tax Filing. Regulated by Nigerian Tax Authorities.
          </p>
        </footer>
      </section>
    </div>
  );
}
