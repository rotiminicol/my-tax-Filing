import { Link } from "@tanstack/react-router";

interface ComingSoonProps {
  eyebrow: string;
  title: string;
  blurb: string;
}

export default function ComingSoon({ eyebrow, title, blurb }: ComingSoonProps) {
  return (
    <main className="mx-auto max-w-3xl px-6 py-32 text-center" style={{ backgroundColor: "#fcfaf5" }}>
      <p className="text-xs font-semibold uppercase tracking-widest text-foreground/60">{eyebrow}</p>
      <h1 className="mt-4 font-serif text-5xl tracking-tight text-foreground md:text-6xl">{title}</h1>
      <p className="mx-auto mt-5 max-w-xl text-foreground/70">{blurb}</p>
      <p className="mt-8 text-sm text-foreground/60">This page is part of the full app — paste the component files when ready and it'll be wired up.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-90">
        ← Back to home
      </Link>
    </main>
  );
}
