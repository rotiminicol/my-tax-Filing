import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { tax } from "./tokens";

export default function TaxesFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-8" style={{ backgroundColor: tax.inverseSurface }}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 py-12 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="col-span-2 space-y-4">
          <FiscalBrand inverted />
          <p className="text-sm pr-4 leading-relaxed" style={{ color: tax.onTertiaryContainer }}>
            Simplifying compliance for the modern Nigerian professional and enterprise. Secure, accurate, and
            always on time.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm">Features</h4>
          <ul className="space-y-2">
            {["PIT Filing", "VAT Returns", "Corporate Tax", "Tax Calculator"].map((label) => (
              <li key={label}>
                <Link
                  to="/taxes"
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: tax.onTertiaryContainer }}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm">Company</h4>
          <ul className="space-y-2">
            {[
              { to: "/contact", label: "About Us" },
              { to: "/contact", label: "Careers" },
              { to: "/taxes", label: "Compliance" },
              { to: "/contact", label: "Press" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: tax.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm">Legal</h4>
          <ul className="space-y-2">
            {[
              { to: "/legal/privacy", label: "Privacy Policy" },
              { to: "/legal/terms", label: "Terms of Service" },
              { to: "/legal/terms", label: "Audit Rights" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white hover:underline transition-all"
                  style={{ color: tax.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 px-4 md:px-10 max-w-[1280px] mx-auto text-center">
        <p className="text-sm" style={{ color: tax.onTertiaryContainer }}>
          © {year} My Tax Filing. All rights reserved. Registered with the Federal Inland Revenue Service (FIRS).
        </p>
      </div>
    </footer>
  );
}
