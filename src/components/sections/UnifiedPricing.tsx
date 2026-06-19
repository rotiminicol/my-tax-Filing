import { Link } from "@tanstack/react-router";

interface UnifiedPricingProps {
  headerTitle?: string;
  headerSubtitle?: string;
  theme?: { accent?: string };
}

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    desc: "For individuals filing personal returns.",
    features: ["3 filings / year", "Rent receipts", "Basic support"],
    highlight: false,
  },
  {
    name: "Professional",
    price: "$29",
    period: "/month",
    desc: "For freelancers and small businesses.",
    features: ["Unlimited filings", "E-invoicing", "VAT & PAYE", "Priority support"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$89",
    period: "/month",
    desc: "For growing teams with complex needs.",
    features: ["Everything in Pro", "Multi-entity", "Audit logs", "Dedicated manager"],
    highlight: false,
  },
] as const;

export default function UnifiedPricing({
  headerTitle = "Pricing",
  headerSubtitle = "Plans designed to scale with your financial journey.",
}: UnifiedPricingProps) {
  return (
    <section className="border-y border-foreground/10" style={{ backgroundColor: "#f4efe4" }}>
      <div className="mx-auto max-w-7xl px-6 py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">Pricing</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">{headerTitle}</h2>
          <p className="mt-4 text-foreground/70">{headerSubtitle}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`flex flex-col rounded-2xl border p-8 transition ${
                p.highlight
                  ? "border-accent/40 bg-primary text-primary-foreground shadow-xl"
                  : "border-foreground/10 bg-card text-foreground"
              }`}
            >
              <h3 className="font-serif text-2xl">{p.name}</h3>
              <p className={`mt-2 text-sm ${p.highlight ? "text-primary-foreground/70" : "text-foreground/65"}`}>{p.desc}</p>
              <div className="mt-6 flex items-baseline gap-1">
                <span className="font-serif text-5xl">{p.price}</span>
                <span className={`text-sm ${p.highlight ? "text-primary-foreground/70" : "text-foreground/60"}`}>{p.period}</span>
              </div>
              <ul className="mt-6 flex-1 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className={p.highlight ? "text-accent" : "text-accent"}>✓</span>
                    <span className={p.highlight ? "text-primary-foreground/85" : "text-foreground/75"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/"
                className={`mt-8 rounded-full px-5 py-3 text-center text-sm font-medium transition ${
                  p.highlight
                    ? "bg-accent text-accent-foreground hover:opacity-90"
                    : "border border-foreground/20 text-foreground hover:bg-foreground/5"
                }`}
              >
                Choose {p.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
