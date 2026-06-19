import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import firsLogo from "@/assets/firs.png";
import fctLogo from "@/assets/fct.png";

const CREAM = "#fcfaf5";
const INK = "#1a3300";
const DOT_BG = {
  backgroundImage: "radial-gradient(circle, rgba(26,51,0,0.08) 1.5px, transparent 1.5px)",
  backgroundSize: "22px 22px",
};

interface Props {
  children: ReactNode;
  headerVariant?: "simple" | "login" | "forgot" | "reset";
  showFooter?: boolean;
}

export default function AuthFocusedLayout({ children, headerVariant = "login", showFooter = true }: Props) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: CREAM, color: INK, ...DOT_BG }}>
      <header
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-10"
        style={{
          height: 64,
          backgroundColor: CREAM,
          borderBottom: "1.5px solid rgba(26,51,0,0.10)",
        }}
      >
        <Link
          to="/"
          className="flex items-center gap-2 group"
          aria-label="Home"
        >
          <span
            className="text-[11px] font-black uppercase tracking-[0.22em] transition-opacity group-hover:opacity-60"
            style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
          >
            ← Back
          </span>
        </Link>

        <Link to="/" className="absolute left-1/2 -translate-x-1/2">
          <span
            className="text-lg font-black uppercase tracking-tight"
            style={{ fontFamily: "'Bricolage Grotesque', sans-serif", color: INK }}
          >
            My Tax Filing
          </span>
        </Link>

        <div className="flex items-center gap-4">
          {headerVariant === "forgot" && (
            <Link
              to="/customer-dashboard/login"
              className="text-[11px] font-black uppercase tracking-[0.18em] hover:opacity-60 transition-opacity"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              Log In
            </Link>
          )}
          {headerVariant === "reset" && (
            <>
              <Link
                to="/customer-dashboard/login"
                className="text-[11px] font-black uppercase tracking-[0.18em] hover:opacity-60 transition-opacity"
                style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
              >
                Log In
              </Link>
              <Link
                to="/customer-dashboard/signup"
                className="text-[11px] font-black uppercase tracking-[0.18em] px-4 py-2 transition-colors hover:opacity-80"
                style={{
                  fontFamily: "'Roboto Mono', monospace",
                  backgroundColor: "#ffe95c",
                  color: INK,
                  borderRadius: 6,
                }}
              >
                Sign Up
              </Link>
            </>
          )}
          {headerVariant === "simple" && (
            <Link
              to="/contact"
              className="text-[11px] font-black uppercase tracking-[0.18em] hover:opacity-60 transition-opacity"
              style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
            >
              Support
            </Link>
          )}
          {headerVariant === "login" && (
            <Link
              to="/customer-dashboard/signup"
              className="text-[11px] font-black uppercase tracking-[0.18em] px-4 py-2 transition-colors hover:opacity-80"
              style={{
                fontFamily: "'Roboto Mono', monospace",
                backgroundColor: "#ffe95c",
                color: INK,
                borderRadius: 6,
              }}
            >
              Sign Up
            </Link>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col relative">{children}</main>

      {showFooter && (
        <footer
          className="px-6 md:px-10 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
          style={{ borderTop: "1.5px solid rgba(26,51,0,0.10)" }}
        >
          <p
            className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50"
            style={{ fontFamily: "'Roboto Mono', monospace", color: INK }}
          >
            © {new Date().getFullYear()} My Tax Filing. Regulated by Nigerian Tax Authorities.
          </p>
          <div className="flex items-center gap-5 opacity-60">
            <img src={firsLogo} alt="FIRS" className="h-6 object-contain" />
            <img src={fctLogo} alt="FCT-IRS" className="h-6 object-contain" />
          </div>
        </footer>
      )}
    </div>
  );
}
