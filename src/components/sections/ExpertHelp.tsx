import { Check, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import expertImg from "@/assets/expert-help.png";
import expertImg2 from "@/assets/experthelp.png";

export default function ExpertHelp() {
  return (
    <section className="relative z-10 py-24 px-4 sm:px-6 bg-background overflow-hidden">
      
      {/* ── Ambient Support Layer ── */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden" aria-hidden="true">
        {/* Floating Orbs */}
        <div className="expert-orb absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-foreground/5 rounded-full blur-[80px]" />
        <div className="expert-orb absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-foreground/5 rounded-full blur-[100px]" style={{ animationDelay: "-4s" }} />
        <div className="expert-orb absolute top-[30%] right-[10%] w-[200px] h-[200px] bg-foreground/3 rounded-full blur-[60px]" style={{ animationDelay: "-9s" }} />

        {/* Connection Mesh (SVG) */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 1000 1000" preserveAspectRatio="none">
           <path d="M0,200 Q250,150 500,200 T1000,200" fill="none" stroke="currentColor" strokeWidth="1" />
           <path d="M0,500 Q250,450 500,500 T1000,500" fill="none" stroke="currentColor" strokeWidth="1" />
           <path d="M0,800 Q250,750 500,800 T1000,800" fill="none" stroke="currentColor" strokeWidth="1" />
           <line x1="200" y1="0" x2="200" y2="1000" stroke="currentColor" strokeWidth="0.5" />
           <line x1="500" y1="0" x2="500" y2="1000" stroke="currentColor" strokeWidth="0.5" />
           <line x1="800" y1="0" x2="800" y2="1000" stroke="currentColor" strokeWidth="0.5" />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">

        {/* Headline */}
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter leading-[1.05] text-foreground text-center mb-8">
          File on your own but{" "}
          <span className="underline underline-offset-4 decoration-[3px] italic">never</span>{" "}
          alone
        </h2>

        {/* Two Cards   items-stretch ensures equal height */}
        <div className="grid md:grid-cols-2 gap-4 items-stretch">

          {/* ══════════════════════════════════
              LEFT CARD   Expert Help (Dark)
          ══════════════════════════════════ */}
          <div className="bg-foreground rounded-[1.75rem] overflow-hidden flex flex-col">

            {/* ── Image zone: fixed height, centered ── */}
            <div className="relative flex items-center justify-center px-8 pt-6 pb-2 overflow-hidden h-[220px]">
              <div className="relative z-10 w-40 h-40 rounded-2xl overflow-hidden shadow-md bg-white">
                <img
                  src={expertImg}
                  alt="Expert advisor"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>

            {/* ── Text content ── */}
            <div className="px-8 pb-8 pt-6 text-center flex flex-col flex-1">
              <h3 className="text-2xl font-black tracking-tight text-white mb-3">
                Unlimited expert help
              </h3>

              {/* Badge row */}
              <div className="flex items-center justify-center gap-2 mb-4 h-6">
                <Check className="h-4 w-4 text-white shrink-0" strokeWidth={3} />
                <p className="text-[11px] font-black text-white uppercase tracking-wider">
                  Included with Deluxe &amp; Premium
                </p>
              </div>

              {/* Body copy   flex-1 pushes button to bottom */}
              <p className="text-[13px] text-white/70 leading-relaxed max-w-xs mx-auto flex-1">
                Get unlimited compliance support, AI-powered guidance, and live help   so you can file your receipts with confidence.
              </p>

              <Link
                to="/customer-dashboard/signup"
                className="mt-6 block w-full py-4 rounded-full bg-white text-foreground text-sm font-black text-center hover:opacity-90 transition-opacity"
              >
                Start my filing
              </Link>
            </div>
          </div>

          {/* ══════════════════════════════════
              RIGHT CARD   Pro Review (White + elevated)
          ══════════════════════════════════ */}
          <div
            className="rounded-[1.75rem] overflow-hidden flex flex-col"
            style={{
              backgroundColor: "#ffffff",
              boxShadow:
                "0 4px 6px -1px rgba(0,0,0,0.07), 0 12px 40px -4px rgba(0,0,0,0.12)",
            }}
          >

            {/* ── Image zone: same fixed height as left card ── */}
            <div className="relative flex items-center justify-center px-8 pt-6 pb-2 overflow-hidden h-[220px]">

              {/* Handwriting watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
                <svg viewBox="0 0 300 200" className="w-full h-full opacity-[0.05]" fill="none">
                  <path d="M20,100 Q80,40 140,100 Q200,160 260,100" stroke="currentColor" strokeWidth="8" strokeLinecap="round" className="text-foreground" />
                  <path d="M40,140 Q100,80 160,140 Q220,200 280,140" stroke="currentColor" strokeWidth="6" strokeLinecap="round" className="text-foreground" />
                  <path d="M10,70 Q70,110 130,70 Q190,30 250,70" stroke="currentColor" strokeWidth="5" strokeLinecap="round" className="text-foreground" />
                </svg>
              </div>

              {/* Framed photo */}
              <div className="relative z-10 w-40 h-40 rounded-2xl overflow-hidden shadow-md bg-white">
                <img
                  src={expertImg2}
                  alt="Pro reviewer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            {/* ── Text content   mirrors left card exactly ── */}
            <div className="px-8 pb-8 pt-6 text-center flex flex-col flex-1">
              <h3 className="text-2xl font-black tracking-tight text-foreground mb-3">
                Pro Receipt Review
              </h3>

              {/* Invisible spacer   matches badge row height on left card */}
              <div className="h-6 mb-4" aria-hidden="true" />

              {/* Body copy */}
              <p className="text-[13px] text-muted-foreground leading-relaxed max-w-xs mx-auto flex-1">
                File your receipts yourself, then have a certified pro review them for{" "}
                <span className="text-foreground font-black underline underline-offset-2 decoration-foreground/40">
                  100% FCT-IRS accuracy
                </span>{" "}
                  guaranteed.{" "}
                <span className="text-muted-foreground/60">
                  You can add Pro Review to any filing plan, at any time in the process.
                </span>
              </p>

              <Link
                to="/customer-dashboard/signup"
                className="mt-6 block w-full py-4 rounded-full border-2 border-foreground text-foreground text-sm font-black text-center hover:bg-foreground hover:text-background transition-all"
              >
                Explore Pro Review
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}