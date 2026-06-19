const steps = [
  {
    n: "01",
    title: "Connect your records",
    desc: "Upload statements, link your bank or pull invoices straight from your software.",
  },
  {
    n: "02",
    title: "We do the math",
    desc: "Our engine computes taxes, applies reliefs, and flags anything that looks off.",
  },
  {
    n: "03",
    title: "Review and approve",
    desc: "A clean summary of every line. Approve once and we file with the registry.",
  },
  {
    n: "04",
    title: "Stay ahead",
    desc: "Track deadlines, renewals and obligations from a single calendar.",
  },
] as const;

export default function StepsSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">How it works</p>
          <h2 className="mt-3 font-serif text-4xl tracking-tight text-foreground md:text-5xl">
            From shoebox to filed,<br/>
            <span className="italic text-accent">in four moves.</span>
          </h2>
          <p className="mt-5 max-w-md text-foreground/70">
            No tax jargon. No spreadsheets. Just a guided flow that handles the heavy lifting so you can focus on your business.
          </p>
        </div>
        <ol className="space-y-4">
          {steps.map((s) => (
            <li
              key={s.n}
              className="flex gap-6 rounded-2xl border border-foreground/10 bg-card p-6 transition hover:border-accent/40"
            >
              <span className="font-serif text-3xl text-accent">{s.n}</span>
              <div>
                <h3 className="font-serif text-xl text-foreground">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-foreground/65">{s.desc}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
