import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import FiscalFooter from "@/components/fiscal-landing/FiscalFooter";

interface AppShellProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const navLinks = [
  { to: "/taxes", label: "Taxes" },
  { to: "/e-invoicing", label: "E-Invoicing" },
  { to: "/rent-receipt", label: "Rent Receipts" },
  { to: "/document-renewal", label: "Documents" },
  { to: "/news", label: "News" },
  { to: "/contact", label: "Contact" },
] as const;

export default function AppShell({ children, hideFooter }: AppShellProps) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#fcfaf5" }}>
      <header className="sticky top-0 z-40 border-b border-foreground/10 backdrop-blur" style={{ backgroundColor: "rgba(252,250,245,0.85)" }}>
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-serif text-lg">M</span>
            <span className="font-serif text-lg tracking-tight text-foreground">My Tax Filing</span>
          </Link>
          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="text-sm text-foreground/70 transition hover:text-foreground"
                activeProps={{ className: "text-foreground font-medium" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden text-sm text-foreground/70 hover:text-foreground sm:block">Sign in</Link>
            <Link to="/" className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition hover:opacity-90">
              Get started
            </Link>
          </div>
        </div>
      </header>
      {children}
      {!hideFooter && <FiscalFooter />}
    </div>
  );
}
