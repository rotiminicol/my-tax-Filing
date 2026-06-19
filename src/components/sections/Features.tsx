import { ShieldCheck, FileDown, Lock, Layers, CheckCircle2 } from "lucide-react";

export default function Features() {
  const circles = [
    {
      icon: ShieldCheck,
      title: "Section 57 NTAA",
      description: "Every FCT-IRS requirement hardcoded. Zero guesswork.",
      badge: "Live Validation",
      dark: true,
      size: "h-72 w-72",
    },
    {
      icon: FileDown,
      title: "Instant PDF",
      description: "Download print-ready A4 receipts the moment you're done.",
      badge: null,
      dark: false,
      size: "h-72 w-72",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "Data stays in your browser. No servers. Ever.",
      badge: null,
      dark: true,
      size: "h-72 w-72",
    },
    {
      icon: Layers,
      title: "Batch Generation",
      description: "Upload a CSV. Generate hundreds in one click.",
      badge: null,
      dark: false,
      size: "h-72 w-72",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 px-5 sm:px-6 border-y border-border/40 overflow-hidden">
      
      <div className="mx-auto max-w-7xl relative z-10">

        {/* Header */}
        <div className="text-center mb-10 sm:mb-16 max-w-xl mx-auto">
          <h2 className="text-[2rem] sm:text-5xl font-black tracking-tighter leading-[0.95] mb-4">
            Everything you need for perfect compliance.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">Built to the letter of NTAA Section 57 for FCT-IRS.</p>
        </div>

        {/* Mobile: stacked cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {circles.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.title}
                className={`rounded-3xl p-6 ${c.dark ? "bg-foreground text-background" : "bg-white border border-border"}`}
              >
                <Icon className="h-6 w-6 mb-3" />
                <p className="text-base font-black leading-tight mb-1.5">{c.title}</p>
                <p className={`text-sm leading-relaxed ${c.dark ? "opacity-70" : "text-muted-foreground"}`}>
                  {c.description}
                </p>
                {c.badge && (
                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-bold opacity-80">
                    <CheckCircle2 className="h-3 w-3" /> {c.badge}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop: overlapping circles   centered row */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="flex items-center">
            {circles.map((c, i) => {
              const Icon = c.icon;
              return (
                <div
                  key={c.title}
                  style={{ 
                    marginLeft: i === 0 ? 0 : "-1.5rem", 
                    zIndex: i % 2 === 0 ? 20 : 10 
                  }}
                  className={`
                    h-80 w-80 rounded-full flex flex-col items-center justify-center text-center p-10 shrink-0
                    transition-all duration-500 hover:scale-110 hover:z-30 cursor-default
                    ${c.dark
                      ? "bg-foreground text-background shadow-2xl"
                      : "bg-white text-foreground border-2 border-border shadow-lg"
                    }
                  `}
                >
                  <Icon className="h-7 w-7 mx-auto mb-4" />
                  <p className="text-lg font-black leading-tight mb-2 px-2">{c.title}</p>
                  <p className={`text-[13px] leading-relaxed max-w-[200px] ${c.dark ? "opacity-80" : "text-muted-foreground"}`}>
                    {c.description}
                  </p>
                  {c.badge && (
                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider opacity-90">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {c.badge}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}