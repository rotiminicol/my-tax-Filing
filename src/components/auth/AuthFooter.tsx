import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { fiscal } from "@/components/fiscal-landing/tokens";

const footerLinks = [
  { to: "/legal/privacy", label: "Privacy Policy" },
  { to: "/legal/terms", label: "Terms of Service" },
];

export default function AuthFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full" style={{ backgroundColor: fiscal.tertiary }}>
      <div className="w-full py-8 px-4 md:px-10 max-w-[1280px] mx-auto flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <FiscalBrand inverted />
          <nav className="flex flex-wrap gap-6">
            {footerLinks.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-xs font-semibold uppercase tracking-wider hover:text-white hover:underline transition-all"
                style={{ color: fiscal.tertiaryFixedDim }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t pt-4 text-center md:text-left" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
          <p className="text-sm opacity-70" style={{ color: fiscal.tertiaryFixedDim }}>
            © {year} My Tax Filing. Regulated by Nigerian Tax Authorities. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
