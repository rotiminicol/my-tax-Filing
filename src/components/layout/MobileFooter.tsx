import { Link } from "react-router-dom";

export default function MobileFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="md:hidden px-4 pt-10 pb-32 text-center">
      <div className="mx-auto max-w-sm rounded-2xl border border-border/60 bg-secondary/40 px-5 py-6">
        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">
          MyTaxFiling
        </p>
        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
          Comprehensive tax and business services, all in one place.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] font-bold">
          <Link to="/contact" className="text-muted-foreground hover:text-foreground">Contact</Link>
          <Link to="/legal/terms" className="text-muted-foreground hover:text-foreground">Terms</Link>
          <Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground">Privacy</Link>
        </div>
        <p className="mt-4 text-[10px] text-muted-foreground/80 font-mono tracking-widest">
          © {year} MyTaxFiling · ALL RIGHTS RESERVED
        </p>
      </div>
    </footer>
  );
}