import { Link } from "@tanstack/react-router";

const tools = [
  {
    to: "/taxes",
    eyebrow: "01",
    title: "Tax filing",
    desc: "PAYE, VAT, withholding — calculated, validated and filed in minutes.",
  },
  {
    to: "/e-invoicing",
    eyebrow: "02",
    title: "E-Invoicing",
    desc: "Issue compliant invoices and accept payments without juggling tools.",
  },
  {
    to: "/rent-receipt",
    eyebrow: "03",
    title: "Rent receipts",
    desc: "Generate, sign and share rent receipts your tenants and accountants love.",
  },
  {
    to: "/document-renewal",
    eyebrow: "04",
    title: "Document renewal",
    desc: "VIN, driver's license and more — never miss a renewal deadline again.",
  },
] as const;

export default function ToolsSection() {
  return (
    <section className="border-y border-foreground/10" style={{ backgroundColor: "#f7f1e3" }}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">The toolkit</p>
            <h2 className="mt-3 max-w-2xl font-serif text-4xl tracking-tight text-foreground md:text-5xl">
              Every compliance task, one calm workspace.
            </h2>
          </div>
          <Link to="/taxes" className="text-sm font-medium text-foreground underline-offset-4 hover:underline">
            See all products →
          </Link>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="group flex flex-col rounded-2xl border border-foreground/10 bg-card p-6 transition hover:border-foreground/30 hover:shadow-lg"
            >
              <span className="font-serif text-sm text-accent">{t.eyebrow}</span>
              <h3 className="mt-6 font-serif text-2xl text-foreground">{t.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-foreground/65">{t.desc}</p>
              <span className="mt-6 text-sm font-medium text-foreground transition group-hover:translate-x-1">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
