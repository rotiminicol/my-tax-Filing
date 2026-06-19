import { Link } from "@tanstack/react-router";

const groups = [
  {
    title: "Products",
    links: [
      { to: "/taxes", label: "Taxes" },
      { to: "/e-invoicing", label: "E-Invoicing" },
      { to: "/rent-receipt", label: "Rent Receipts" },
      { to: "/document-renewal", label: "Document Renewal" },
    ],
  },
  {
    title: "Company",
    links: [
      { to: "/news", label: "News" },
      { to: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "/legal/terms", label: "Terms" },
      { to: "/legal/privacy", label: "Privacy" },
    ],
  },
] as const;

export default function FiscalFooter() {
  return (
    <footer className="border-t border-foreground/10" style={{ backgroundColor: "#f4efe4" }}>
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-serif text-lg">M</span>
            <span className="font-serif text-lg text-foreground">My Tax Filing</span>
          </div>
          <p className="mt-4 max-w-xs text-sm text-foreground/70">
            The modern compliance portal for taxes, invoicing and document renewals.
          </p>
        </div>
        {groups.map((g) => (
          <div key={g.title}>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-foreground/60">{g.title}</h4>
            <ul className="mt-4 space-y-3">
              {g.links.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm text-foreground/80 transition hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-foreground/60 md:flex-row">
          <p>© {new Date().getFullYear()} My Tax Filing. All rights reserved.</p>
          <p>Built for compliance teams that move fast.</p>
        </div>
      </div>
    </footer>
  );
}
