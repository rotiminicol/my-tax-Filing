import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import step01Image from "@/assets/step-01-enter-details.svg?raw";
import step02Image from "@/assets/step-02-review-confirm.svg?raw";
import step03Image from "@/assets/step-03-generate-file.svg?raw";

export default function HowItWorks() {
  const steps = [
    { n: "01", t: "Enter Details", d: "Fill guided wizard. Live validation flags issues before you submit." },
    { n: "02", t: "Review & Confirm", d: "See full FCT-IRS receipt rendered exactly as it will be printed." },
    { n: "03", t: "Generate & File", d: "Download a signed-ready A4 PDF instantly to your device." },
  ];

  return (
    <section className="py-24 px-6">
      <div className="mx-auto max-w-7xl">
        <div className="reveal text-center mb-20">
          <h2 className="text-4xl sm:text-5xl tracking-tight">Three steps to compliance.</h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((s) => (
            <div key={s.n} className="reveal relative">
              <span className="text-[8rem] font-extrabold text-muted leading-none absolute -top-16 -left-4 -z-10 opacity-50">{s.n}</span>
              <h3 className="text-2xl mb-4 mt-4">{s.t}</h3>
              <p className="text-muted-foreground leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
        
        <div className="reveal mt-24 text-center">
          <Link to="/customer-dashboard/signup" className="inline-flex items-center gap-2 px-10 py-5 rounded-2xl bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-all shadow-xl shadow-primary/20">
            Start Your First Receipt <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
