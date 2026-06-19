import { Link } from "@tanstack/react-router";

export default function FinalCtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="overflow-hidden rounded-3xl bg-primary px-8 py-20 text-center text-primary-foreground md:px-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary-foreground/70">Ready when you are</p>
        <h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl tracking-tight md:text-6xl">
          Stop dreading filing season.
          <br/>
          <span className="italic text-accent">Start owning it.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-primary-foreground/70">
          Join thousands who've replaced spreadsheets, late nights and last-minute panic with a calm, modern workflow.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-foreground transition hover:opacity-90">
            Create free account
          </Link>
          <Link to="/contact" className="rounded-full border border-primary-foreground/30 px-6 py-3 text-sm font-medium text-primary-foreground transition hover:bg-primary-foreground/10">
            Talk to sales
          </Link>
        </div>
      </div>
    </section>
  );
}
