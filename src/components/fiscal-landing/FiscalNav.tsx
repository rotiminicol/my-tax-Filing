import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import FiscalBrand from "./FiscalBrand";

const links = [
  { to: "/rent-relief", label: "For individuals" },
  { to: "/e-invoicing", label: "For businesses" },
  { to: "/contact", label: "Contact" },
] as const;

const INK = "#1a3300";
const PENCIL = "#b6b6b6";
const CREAM = "#fcfaf5";
const YELLOW = "#ffe95c";

export default function FiscalNav() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const rm = Boolean(useReducedMotion());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={rm ? false : { opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="hidden md:block fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(252,250,245,0.88)" : CREAM,
        backdropFilter: scrolled ? "blur(10px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(10px)" : "none",
        paddingTop: scrolled ? 10 : 16,
        paddingBottom: scrolled ? 10 : 16,
      }}
    >
      <nav className="w-full flex items-center justify-between px-6 md:px-10 max-w-[1200px] mx-auto">
        {/* Logo */}
        <FiscalBrand />

        {/* Pill nav */}
        <div
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-2xl"
          style={{ border: `1px solid ${PENCIL}`, backgroundColor: CREAM }}
        >
          {links.map((link) => {
            const active =
              pathname === link.to ||
              (link.to === "/rent-relief" && pathname === "/rent-receipt") ||
              pathname.startsWith(`${link.to}/`);
            return (
              <Link
                key={link.to}
                to={link.to}
                className="relative px-4 py-1.5 rounded-xl text-sm transition-colors duration-150"
                style={{
                  color: INK,
                  fontFamily: "Inter, system-ui, sans-serif",
                  fontWeight: active ? 600 : 500,
                  zIndex: 1,
                }}
              >
                {/* Animated active pill — spring slides between nav items */}
                {active && (
                  <motion.span
                    layoutId="fiscal-nav-pill"
                    className="absolute inset-0 rounded-xl"
                    style={{ backgroundColor: YELLOW, zIndex: -1 }}
                    transition={
                      rm
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 380, damping: 30 }
                    }
                  />
                )}
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Auth / CTA */}
        <div className="flex items-center gap-3">
          <Link
            to="/customer-dashboard/login"
            className="text-sm font-medium px-4 py-2 rounded-md border transition-all duration-200 hover:bg-stone-50 active:scale-[0.97]"
            style={{
              color: INK,
              borderColor: INK,
              fontFamily: "Inter, system-ui, sans-serif",
            }}
          >
            Log In
          </Link>
          <Link
            to="/contact"
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-md text-sm font-medium transition-all duration-200 hover:-translate-y-px hover:shadow-md active:scale-[0.97]"
            style={{
              backgroundColor: INK,
              color: CREAM,
              fontFamily: "Inter, system-ui, sans-serif",
              boxShadow: "0 1px 3px rgba(26,51,0,0.10)",
            }}
          >
            Contact us
          </Link>
        </div>
      </nav>

      {/* Bottom hairline — fades in on scroll */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
        style={{ backgroundColor: PENCIL, opacity: scrolled ? 0.4 : 0 }}
      />
    </motion.header>
  );
}
