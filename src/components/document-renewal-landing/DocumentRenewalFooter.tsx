import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { dr } from "./tokens";

export default function DocumentRenewalFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full mt-8" style={{ backgroundColor: dr.inverseSurface }}>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8 py-12 px-4 md:px-10 max-w-[1280px] mx-auto">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <FiscalBrand inverted />
          <p className="text-sm opacity-60 max-w-xs" style={{ color: dr.onTertiaryContainer }}>
            Simplifying compliance for Nigerians everywhere.
          </p>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-xs uppercase tracking-widest opacity-40 text-white">Company Info</h5>
          <ul className="space-y-3">
            {[
              { to: "/contact", label: "About Us" },
              { to: "/contact", label: "Careers" },
              { to: "/contact", label: "Press Kit" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm hover:text-white transition-all" style={{ color: dr.onTertiaryContainer }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-xs uppercase tracking-widest opacity-40 text-white">Quick Links</h5>
          <ul className="space-y-3">
            {[
              { to: "/customer-dashboard/receipts", label: "Dashboard" },
              { to: "/customer-dashboard/subscription", label: "Wallet" },
              { to: "/customer-dashboard/support", label: "Support" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm hover:text-white transition-all" style={{ color: dr.onTertiaryContainer }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-xs uppercase tracking-widest opacity-40 text-white">Features</h5>
          <ul className="space-y-3">
            <li>
              <Link
                to="/document-renewal"
                className="text-sm font-bold hover:underline"
                style={{ color: dr.secondaryContainer }}
              >
                Renewal Service
              </Link>
            </li>
            {[
              { to: "/taxes", label: "Tax Filing" },
              { to: "/taxes", label: "Audit Assist" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm hover:text-white transition-all" style={{ color: dr.onTertiaryContainer }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-4">
          <h5 className="font-bold text-xs uppercase tracking-widest opacity-40 text-white">Legal</h5>
          <ul className="space-y-3">
            {[
              { to: "/legal/privacy", label: "Privacy Policy" },
              { to: "/legal/terms", label: "Terms of Service" },
              { to: "/taxes", label: "Compliance" },
            ].map((l) => (
              <li key={l.label}>
                <Link to={l.to} className="text-sm hover:text-white transition-all" style={{ color: dr.onTertiaryContainer }}>
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-8 px-4 md:px-10 max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
        <p className="text-sm opacity-60" style={{ color: dr.onTertiaryContainer }}>
          © {year} My Tax Filing. All rights reserved. Registered with the Federal Inland Revenue Service (FIRS).
        </p>
      </div>
    </footer>
  );
}
