import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-background pt-4 md:pt-12 pb-4 md:pb-8 px-0 md:px-6 xl:px-12 overflow-hidden relative">
      <div className="w-full bg-background border-y border-border md:border md:border-border md:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] md:rounded-[3rem] p-6 md:p-10 lg:p-12 relative z-10 overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-12 gap-x-8 lg:gap-16 mb-10">
          <div className="col-span-1 md:col-span-2">
            <Logo size={140} />
            <p className="mt-6 text-sm lg:text-base text-muted-foreground max-w-2xl leading-relaxed font-medium">
              MyTaxFiling provides comprehensive tax and business services   everything you need in one place.
            </p>
          </div>
        </div>

        <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <p className="text-sm font-bold text-muted-foreground">
            © {year} MyTaxFiling. All rights reserved.
          </p>
          <div className="flex gap-8 text-sm font-bold">
            <Link to="/legal/terms" className="text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border">Terms of Service</Link>
            <Link to="/legal/privacy" className="text-muted-foreground hover:text-foreground underline underline-offset-4 decoration-border">Privacy Policy</Link>
          </div>
        </div>

        {/* Giant Footer Text   edge to edge */}
        <div className="select-none pointer-events-none -mx-6 md:-mx-10 lg:-mx-12 -mb-6 md:-mb-10 lg:-mb-12 mt-4 md:mt-0">
          <svg
            viewBox="0 0 1000 120"
            preserveAspectRatio="none"
            className="w-full"
            style={{ height: 'clamp(50px, 12vw, 150px)' }}
            aria-hidden="true"
          >
            <text
              x="500"
              y="115"
              textAnchor="middle"
              fontFamily="'Montserrat', sans-serif"
              fontWeight="900"
              fontSize="120"
              letterSpacing="-2"
              textLength="1000"
              lengthAdjust="spacingAndGlyphs"
              fill="currentColor"
              className="text-black uppercase"
            >
              MyTaxFiling
            </text>
          </svg>
        </div>
      </div>
    </footer>
  );
}