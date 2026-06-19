import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { ei } from "./tokens";

export default function EInvoicingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full" style={{ backgroundColor: ei.inverseSurface }}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 py-12 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="col-span-2 space-y-4">
          <FiscalBrand inverted />
          <p className="text-sm pr-4 leading-relaxed max-w-xs" style={{ color: ei.onTertiaryContainer }}>
            The gold standard for digital tax and invoicing compliance in Nigeria. Built for ambitious businesses.
          </p>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm">Features</h4>
          <ul className="space-y-2">
            {[
              { to: "/e-invoicing", label: "E-Invoicing" },
              { to: "/taxes", label: "VAT Filing" },
              { to: "/taxes", label: "Audit Logs" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: ei.onTertiaryContainer }}
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
              { to: "/taxes", label: "FIRS Compliance" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: ei.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h4 className="text-white font-bold text-sm">Contact</h4>
          <ul className="space-y-2">
            {[
              { to: "/contact", label: "Support Center" },
              { to: "/contact", label: "Office Locations" },
              { to: "/contact", label: "Partner Portal" },
            ].map((l) => (
              <li key={l.label}>
                <Link
                  to={l.to}
                  className="text-sm hover:text-white transition-colors"
                  style={{ color: ei.onTertiaryContainer }}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div
        className="border-t border-white/10 py-8 px-4 md:px-10 max-w-[1280px] mx-auto text-center text-xs"
        style={{ color: ei.onTertiaryContainer }}
      >
        © {year} My Tax Filing. All rights reserved. Registered with the Federal Inland Revenue Service (FIRS).
      </div>
    </footer>
  );
}
