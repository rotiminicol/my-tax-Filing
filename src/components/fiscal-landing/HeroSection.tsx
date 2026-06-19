import { Link } from "@tanstack/react-router";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-60" style={{
        backgroundImage:
          "radial-gradient(60% 50% at 80% 10%, rgba(214,150,80,0.18), transparent), radial-gradient(50% 40% at 10% 90%, rgba(80,90,120,0.12), transparent)",
      }} />
      <div className="mx-auto max-w-7xl px-6 pb-24 pt-20 md:pt-28">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-white/60 px-3 py-1 text-xs font-medium uppercase tracking-widest text-foreground/70">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Compliance, simplified
            </span>
            <h1 className="mt-6 font-serif text-5xl leading-[1.05] tracking-tight text-foreground md:text-6xl lg:text-7xl">
              Tax filing that<br />
              <span className="italic text-accent">actually feels</span><br />
              effortless.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-foreground/70">
              File taxes, issue e-invoices, generate rent receipts and renew documents — all from one elegant workspace built for individuals, landlords and businesses.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/" className="rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
                Start filing free
              </Link>
              <Link to="/taxes" className="rounded-full border border-foreground/20 px-6 py-3 text-sm font-medium text-foreground transition hover:bg-foreground/5">
                Explore products →
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6 text-xs text-foreground/60">
              <div><span className="text-2xl font-serif text-foreground">12k+</span><br/>Filings processed</div>
              <div className="h-10 w-px bg-foreground/15" />
              <div><span className="text-2xl font-serif text-foreground">99.98%</span><br/>Uptime</div>
              <div className="h-10 w-px bg-foreground/15" />
              <div><span className="text-2xl font-serif text-foreground">4.9★</span><br/>Customer rating</div>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-3xl border border-foreground/10 bg-card p-6 shadow-[0_20px_60px_-30px_rgba(60,40,20,0.25)]">
              <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-widest text-foreground/50">Filing summary</p>
                  <p className="mt-1 font-serif text-2xl text-foreground">Q2 — 2026</p>
                </div>
                <span className="rounded-full bg-accent/15 px-3 py-1 text-xs font-medium text-accent">Ready</span>
              </div>
              <dl className="mt-5 space-y-4">
                {[
                  ["Revenue declared", "$ 84,210.00"],
                  ["VAT collected", "$ 12,631.50"],
                  ["PAYE withheld", "$ 6,180.00"],
                  ["Net due", "$ 18,811.50"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between text-sm">
                    <dt className="text-foreground/60">{k}</dt>
                    <dd className="font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>
              <button className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-medium text-primary-foreground">
                File return
              </button>
            </div>
            <div className="absolute -bottom-6 -left-6 hidden rounded-2xl border border-foreground/10 bg-card px-5 py-4 shadow-lg md:block">
              <p className="text-xs text-foreground/60">Auto-saved</p>
              <p className="text-sm font-medium text-foreground">3 seconds ago</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
