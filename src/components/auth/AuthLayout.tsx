import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/brand/Logo";
import heroImage from "@/assets/hero.png";
import firsLogo from "@/assets/firs.png";
import fctLogo from "@/assets/fct.png";

interface Props {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  image?: string;
}

export default function AuthLayout({ title, subtitle, eyebrow, children, footer, image }: Props) {
  return (
    <div className="h-screen flex flex-col bg-white relative overflow-hidden">
      <main className="relative z-10 flex-1 grid lg:grid-cols-2 items-stretch">
        {/* Left: Image (Full height/width cover) */}
        <div className="hidden lg:block relative overflow-hidden bg-muted">
          <img
            src={image || heroImage}
            alt="Authentication"
            className="absolute inset-0 w-full h-full object-cover object-center grayscale"
            loading="eager"
          />
        </div>

        {/* Right: Form */}
        <div className="h-screen overflow-y-auto bg-white hide-scrollbar relative">
          {/* Fixed Top Navigation */}
          <div className="sticky top-0 left-0 right-0 p-8 flex justify-between items-center bg-white/80 backdrop-blur-md z-20">
            <Link to="/" className="text-[10px] font-black uppercase tracking-[0.25em] text-muted-foreground hover:text-black transition-colors">
              ← Back
            </Link>
            <Link to="/" className="hover:opacity-80 transition-opacity flex items-center justify-center" aria-label="MyRentReceipt home">
              <Logo to="" size={42} />
            </Link>
          </div>

          <div className="min-h-[calc(100%-80px)] flex flex-col items-center justify-center px-6 pb-20">
            <div className="w-full max-w-md">
              <h1 className="font-display text-4xl text-foreground font-black tracking-tighter uppercase">{title}</h1>
              {subtitle && <p className="mt-2 text-xs font-bold text-muted-foreground uppercase tracking-widest leading-relaxed">{subtitle}</p>}

              <div className="mt-12">{children}</div>

              {footer && <div className="mt-10 text-sm font-bold text-muted-foreground text-center">{footer}</div>}

              <div className="mt-16 pt-8 border-t border-border/50 flex flex-col items-center gap-4">
                <p className="text-[10px] font-black tracking-[0.25em] text-muted-foreground uppercase text-center">
                  Protected by FCT-IRS Section 57 NTAA
                </p>
                <div className="flex items-center gap-6">
                  <img src={firsLogo} alt="FIRS" className="h-7 object-contain" />
                  <img src={fctLogo} alt="FCT-IRS" className="h-7 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}