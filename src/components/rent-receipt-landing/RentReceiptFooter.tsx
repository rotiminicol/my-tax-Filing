import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { rr } from "./tokens";

export default function RentReceiptFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-8" style={{ backgroundColor: rr.inverseSurface }}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 py-12 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="col-span-2 space-y-4">
          <FiscalBrand inverted />
          <p className="text-sm pr-4 leading-relaxed max-w-xs opacity-70" style={{ color: rr.onTertiaryContainer }}>
            Simplifying tax compliance and financial documentation for every Nigerian citizen and business.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Company Info</h4>
          <ul className="space-y-2">
            {[
              { to: "/contact", label: "About Us" },
              { to: "/contact", label: "Careers" },
              { to: "/contact", label: "Press Kit" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: rr.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Features</h4>
          <ul className="space-y-2">
            <li>
              <Link
                to="/rent-receipt"
                className="text-sm font-bold hover:underline transition-all"
                style={{ color: rr.secondaryContainer }}
              >
                Rent Receipts
              </Link>
            </li>
            {[
              { to: "/taxes", label: "VAT Filing" },
              { to: "/taxes", label: "PIT Calculator" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: rr.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-xs uppercase tracking-widest">Legal</h4>
          <ul className="space-y-2">
            {[
              { to: "/legal/privacy", label: "Privacy Policy" },
              { to: "/legal/terms", label: "Terms of Service" },
              { to: "/taxes", label: "FIRS Guidelines" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: rr.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="border-t border-white/10 py-6 px-4 md:px-10 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4"
      >
        <p className="text-xs opacity-40 text-center md:text-left" style={{ color: rr.onTertiaryContainer }}>
          © {year} My Tax Filing. All rights reserved. Registered with the Federal Inland Revenue Service (FIRS).
        </p>
        <div className="flex gap-4">
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 text-white">Secured by SSL</span>
          <span className="text-[10px] uppercase font-bold tracking-widest opacity-40 text-white">
            CBN Licensed Partner
          </span>
        </div>
      </div>
    </footer>
  );
}
