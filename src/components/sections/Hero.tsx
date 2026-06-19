import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Calculator, Home, History, User, Check, Info } from "lucide-react";
import fccpcLogo from "@/assets/FCCPC.png";
import fctLogo from "@/assets/fct.png";
import firsLogo from "@/assets/firs.png";
import tinLogo from "@/assets/tin.png";

// ─── Tax logic ────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return "₦" + Math.round(n).toLocaleString("en-NG");
}

function calcPayeTax(income: number) {
  // Rough estimate based on Nigerian 2025 tax rules (approximate for demo)
  const relief = Math.max(200_000, 0.01 * income) + 0.2 * income;
  const taxable = Math.max(0, income - relief);
  const bands: [number, number][] = [
    [300_000, 0.07],
    [300_000, 0.11],
    [500_000, 0.15],
    [500_000, 0.19],
    [1_600_000, 0.21],
    [Infinity, 0.24],
  ];
  let tax = 0;
  let rem = taxable;
  for (const [band, rate] of bands) {
    const chunk = Math.min(rem, band);
    tax += chunk * rate;
    rem -= chunk;
    if (rem <= 0) break;
  }
  return { relief, taxable, tax, rate: income > 0 ? (tax / income) * 100 : 0 };
}

function getCitTier(turnover: number) {
  if (turnover <= 25_000_000) return { rate: 0, label: "0% CIT (Micro)", tag: "Micro   Exempt" };
  if (turnover <= 50_000_000) return { rate: 0, label: "0% CIT (Small)", tag: "Small   Exempt" };
  if (turnover <= 100_000_000) return { rate: 0.2, label: "20% CIT (Medium)", tag: "Medium   20%" };
  return { rate: 0.3, label: "30% CIT (Large)", tag: "Large   30%" };
}

// ─── iPhone Tax Calculator ────────────────────────────────────────────────────

export function IPhoneTaxCalculator({ isDarkBg = false }: { isDarkBg?: boolean } = {}) {
  const [tab, setTab] = useState<"paye" | "cit">("paye");
  const [income, setIncome] = useState("");
  const [expenses, setExpenses] = useState("");
  const [result, setResult] = useState<any>(null);
  const [calculating, setCalculating] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000 * 60);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = currentTime.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: false,
  });

  const handleCalculate = () => {
    setCalculating(true);
    setTimeout(() => {
      const val = parseFloat(income.replace(/,/g, "")) || 0;
      if (tab === "paye") {
        setResult({ ...calcPayeTax(val), income: val });
      } else {
        const exp = parseFloat(expenses.replace(/,/g, "")) || 0;
        const profit = Math.max(0, val - exp);
        const tier = getCitTier(val);
        setResult({ turnover: val, expenses: exp, profit, tax: profit * tier.rate, tier });
      }
      setCalculating(false);
    }, 600);
  };

  return (
    <div className="animate-fade-in">
      <div className="relative mx-auto w-full max-w-[310px] aspect-[1/1.9] animate-vibrate">
        {/* Ringing waves effect */}
        <div className={`absolute inset-0 rounded-[3rem] animate-ping-slow -z-10 ${isDarkBg ? 'bg-white/5' : 'bg-black/5'}`} />
        <div className={`absolute inset-0 rounded-[3rem] animate-ping-slow -z-10 [animation-delay:1s] ${isDarkBg ? 'bg-white/5' : 'bg-black/5'}`} />

        {/* iPhone Frame */}
        <div className={`absolute inset-0 rounded-[3rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.4)] overflow-hidden ${
          isDarkBg ? 'bg-white ring-1 ring-black/10' : 'bg-[#0a0a0a] ring-1 ring-white/10'
        }`}>
        {/* Screen */}
        <div className="absolute inset-[6px] bg-white rounded-[2.6rem] overflow-hidden flex flex-col">
          {/* Dynamic Island */}
          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-50 flex items-center justify-center">
            <div className="w-1 h-1 bg-white/10 rounded-full ml-10" />
          </div>

          {/* Status Bar */}
          <div className="pt-6 px-8 flex justify-between items-center bg-white z-40">
            <span className="text-[11px] font-bold text-black">{formattedTime}</span>
            <div className="flex gap-1 items-center scale-90">
              <div className="w-4 h-2 bg-black rounded-[1px]" />
              <div className="w-1.5 h-1.5 bg-black/30 rounded-full" />
            </div>
          </div>

          {/* App Header */}
          <div className="px-6 pt-4 pb-2 bg-white border-b border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 bg-black rounded-xl flex items-center justify-center text-white shadow-lg shadow-black/20">
                <Calculator className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-[13px] font-black text-black leading-tight">Quick Tax Calculator</h4>
                <p className="text-[9px] text-gray-500 font-medium">Nigeria Tax Act 2025 • Estimate</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              {(["paye", "cit"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => { setTab(t); setResult(null); }}
                  className={`flex-1 py-3 rounded-md text-[10px] font-bold transition-all ${
                    tab === t ? "bg-black text-white shadow-sm" : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {t === "paye" ? "PAYE / PIT" : "CIT"}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50/50 p-6">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black text-black uppercase tracking-wider mb-2 block">
                  {tab === "paye" ? "Annual Gross Income (₦)" : "Annual Turnover (₦)"}
                </label>
                <div className="relative group">
                  <input
                    type="text"
                    placeholder={tab === "paye" ? "e.g. 5,000,000" : "e.g. 50,000,000"}
                    value={income}
                    onChange={(e) => { setIncome(e.target.value); setResult(null); }}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                </div>
              </div>

              {tab === "cit" && (
                <div>
                  <label className="text-[10px] font-black text-black uppercase tracking-wider mb-2 block">
                    Allowable Expenses (₦)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 10,000,000"
                    value={expenses}
                    onChange={(e) => { setExpenses(e.target.value); setResult(null); }}
                    className="w-full h-11 bg-white border border-gray-200 rounded-xl px-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-black transition-all"
                  />
                </div>
              )}

              <button
                onClick={handleCalculate}
                disabled={calculating || !income}
                className="w-full h-13 bg-black text-white rounded-xl text-[11px] font-black hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-black/10"
              >
                {calculating ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>Calculate Tax <ArrowRight className="h-3.5 w-3.5" /></>
                )}
              </button>

              <p className="text-[9px] text-gray-400 text-center px-4 leading-relaxed font-medium">
                This is a quick estimate only. Sign up for detailed deductions and FCT-IRS filing.
              </p>

              {/* Result Card */}
              {result && (
                <div className="animate-in slide-in-from-top-4 duration-500 bg-white border border-black/[0.08] rounded-2xl p-5 shadow-sm overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-2 opacity-5">
                    <Calculator className="h-12 w-12" />
                  </div>
                  
                  {tab === "cit" && (
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-black text-white text-[8px] font-bold mb-3">
                      <Check className="h-2 w-2" /> {result.tier.tag}
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-500 font-medium">
                        {tab === "paye" ? "Total Tax Payable" : "CIT Payable"}
                      </span>
                      <span className="text-[14px] font-black text-black">
                        {fmt(result.tax)}
                      </span>
                    </div>
                    
                    <div className="h-px bg-gray-100 my-1" />
                    
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] text-gray-500">Effective Rate</span>
                      <span className="text-[10px] font-bold text-black">
                        {tab === "paye" ? result.rate.toFixed(1) + "%" : result.tier.label.split(" (")[0]}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Nav Mockup */}
          <div className="px-8 py-4 bg-white border-t border-gray-100 flex justify-between items-center opacity-40">
            <Home className="h-4 w-4 text-black" />
            <History className="h-4 w-4" />
            <User className="h-4 w-4" />
          </div>
          
          {/* Home Indicator */}
          <div className="h-1 w-20 bg-black/10 rounded-full mx-auto mb-2" />
        </div>
      </div>
      
      {/* Phone Hardware Details */}
      <div className={`absolute left-[-2px] top-24 w-[2px] h-12 rounded-l-sm ${isDarkBg ? 'bg-neutral-300' : 'bg-black'}`} />
      <div className={`absolute left-[-2px] top-40 w-[2px] h-16 rounded-l-sm ${isDarkBg ? 'bg-neutral-300' : 'bg-black'}`} />
      <div className={`absolute right-[-2px] top-32 w-[2px] h-20 rounded-r-sm ${isDarkBg ? 'bg-neutral-300' : 'bg-black'}`} />
    </div>
    </div>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-12 lg:pt-20 pb-12">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="mx-auto max-w-7xl px-5 sm:px-6 grid lg:grid-cols-2 gap-12 lg:gap-24 items-center">
        
        {/* Left: Content */}
        <div className="flex flex-col z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-[11px] font-black uppercase tracking-wider mb-6 lg:mb-8 animate-fade-in w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            Updated for 2026 Tax Act
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[0.9] tracking-tighter mb-4 lg:mb-5">
            MY RENT RECEIPT,<br />
            <span className="text-muted-foreground italic">Done Right.</span>
          </h1>

          <p className="text-[14px] sm:text-base text-muted-foreground max-w-md mb-5 lg:mb-6 leading-relaxed font-medium">
            Generate, validate, and submit FCT-IRS compliant rent allowance receipts in minutes. Precise, secure, and ready for official filing.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 mb-6 lg:mb-8">
            <Link
              to="/customer-dashboard/signup"
              className="h-14 px-8 rounded-2xl bg-black text-white text-sm font-black flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-xl shadow-black/10 active:scale-95 group"
            >
              Start Generating
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Social Proof */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6 lg:gap-8 pt-4 lg:pt-6 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[fccpcLogo, fctLogo, firsLogo, tinLogo].map((src, i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden grid place-items-center shadow-sm relative z-[1] hover:z-10 hover:scale-110 transition-transform">
                    <img src={src} alt="Trusted Partner" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-black text-black" />
                  ))}
                </div>
                <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
                  Trusted by <span className="text-foreground">2,000+</span> Pros
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Right: Interactive Mockup */}
        <div className="relative">
          {/* Decorative Ring */}
          <div className="absolute inset-0 bg-primary/5 rounded-full blur-[100px] -z-10 animate-pulse" />
          
          <IPhoneTaxCalculator />
          
        </div>

      </div>
    </section>
  );
}