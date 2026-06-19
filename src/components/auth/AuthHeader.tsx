import { Link } from "react-router-dom";
import FiscalBrand from "@/components/fiscal-landing/FiscalBrand";
import { fiscal } from "@/components/fiscal-landing/tokens";

export type AuthHeaderVariant = "simple" | "login" | "forgot" | "reset";

interface Props {
  variant?: AuthHeaderVariant;
}

export default function AuthHeader({ variant = "simple" }: Props) {
  return (
    <header
      className="sticky top-0 z-50 border-b shadow-sm h-20 flex items-center backdrop-blur-md"
      style={{ backgroundColor: "rgba(248, 249, 255, 0.8)", borderColor: `${fiscal.outlineVariant}4D` }}
    >
      <div className="flex justify-between items-center w-full px-4 md:px-10 max-w-[1280px] mx-auto">
        <FiscalBrand />

        {variant === "forgot" && (
          <Link
            to="/customer-dashboard/login"
            className="text-sm font-bold hover:opacity-80"
            style={{ color: fiscal.primary }}
          >
            Log In
          </Link>
        )}

        {variant === "reset" && (
          <div className="hidden md:flex items-center gap-4">
            <Link to="/" className="text-sm hover:underline" style={{ color: fiscal.onSurfaceVariant }}>
              Home
            </Link>
            <Link
              to="/customer-dashboard/login"
              className="text-sm font-bold hover:opacity-80"
              style={{ color: fiscal.primary }}
            >
              Log In
            </Link>
            <Link
              to="/customer-dashboard/signup"
              className="text-sm font-bold px-6 py-2.5 rounded-lg text-white hover:opacity-90 transition-all"
              style={{ backgroundColor: fiscal.primary }}
            >
              Get Started
            </Link>
          </div>
        )}

        {variant === "simple" && (
          <div className="hidden md:flex items-center gap-4 text-sm" style={{ color: fiscal.onSurfaceVariant }}>
            <span>Having trouble?</span>
            <Link to="/contact" className="font-bold hover:underline" style={{ color: fiscal.primary }}>
              Contact Support
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
