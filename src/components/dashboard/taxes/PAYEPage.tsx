import { useState } from "react";
import { Link } from "react-router-dom";
import { Calculator, DollarSign, Info, Save, TrendingUp } from "lucide-react";
import { inputBg } from "@/components/dashboard/dashboardTokens";
import { formatNaira } from "@/lib/rr/format";
import { calculatePAYE, NIGERIA_PIT_BRACKETS } from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { notify } from "@/components/Toaster";
import {
  TaxPageHeader,
  fiscalInputClass,
  fiscalInputStyle,
  glassCard,
} from "@/components/dashboard/taxes/taxShared";

const SB = {
  forestInk: "#1a3300",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  cream: "#fcfaf5",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

export default function PAYEPage() {
  const addFiling = useTaxesStore((s) => s.addFiling);
  const [monthlyGross, setMonthlyGross] = useState("");
  const [allowances, setAllowances] = useState("");
  const [result, setResult] = useState<ReturnType<typeof calculatePAYE> | null>(null);

  const handleCalculate = () => {
    const gross = parseFloat(monthlyGross) || 0;
    const allow = parseFloat(allowances) || 0;
    if (gross <= 0) {
      notify.error("Enter income", "Monthly gross income must be greater than zero.");
      return;
    }
    setResult(calculatePAYE(gross, allow));
  };

  const handleSaveEstimate = () => {
    if (!result) return;
    const year = new Date().getFullYear();
    const due = `${year}-03-31`;
    addFiling({
      category: "paye",
      title: `PAYE estimate — ${year}`,
      period: `Jan – Dec ${year}`,
      amount: result.annualTax,
      authority: "FIRS",
      dueDate: due,
      notes: `Monthly gross ₦${result.monthlyGross.toLocaleString()}; monthly PAYE ₦${result.monthlyTax.toLocaleString()}`,
      status: "draft",
    });
    notify.success("Saved", "PAYE estimate added to your filings as a draft.");
  };

  return (
    <div className="space-y-6">
      <TaxPageHeader
        icon={<Calculator className="w-6 h-6" />}
        title="PAYE Calculator"
        description="Estimate Pay As You Earn tax using Nigerian personal income tax brackets. Save results as a draft filing for your records."
      />

      <div className="rounded-xl p-6" style={glassCard}>
        <h3 className="text-base font-bold mb-5 flex items-center gap-2" style={{ color: SB.forestInk }}>
          <DollarSign className="w-4 h-4" style={{ color: SB.forestInk, opacity: 0.5 }} />
          Income details
        </h3>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: SB.forestInk }}>
              Monthly gross income (₦)
            </label>
            <input
              type="number"
              value={monthlyGross}
              onChange={(e) => setMonthlyGross(e.target.value)}
              placeholder="e.g. 500000"
              className={fiscalInputClass}
              style={fiscalInputStyle(inputBg)}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2" style={{ color: SB.forestInk }}>
              Monthly allowances (₦)
            </label>
            <input
              type="number"
              value={allowances}
              onChange={(e) => setAllowances(e.target.value)}
              placeholder="e.g. 50000"
              className={fiscalInputClass}
              style={fiscalInputStyle(inputBg)}
            />
          </div>
        </div>

        <div
          className="mt-6 p-4 rounded-xl flex items-start gap-3"
          style={{ backgroundColor: SB.cream, border: `1px solid ${SB.cardBorder}` }}
        >
          <Info className="w-5 h-5 mt-0.5 shrink-0" style={{ color: SB.forestInk, opacity: 0.5 }} />
          <div className="text-sm">
            <p className="font-semibold mb-1" style={{ color: SB.forestInk }}>
              Common reliefs (enter in allowances if applicable)
            </p>
            <ul className="list-disc list-inside space-y-1" style={{ color: SB.pencilGray }}>
              <li>Consolidated relief: ₦200,000 + 20% of gross</li>
              <li>Pension, NHF, and life assurance deductions</li>
            </ul>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          className="w-full mt-6 py-3 font-bold rounded-md transition-opacity hover:opacity-90 active:scale-[0.99]"
          style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
        >
          Calculate PAYE
        </button>
      </div>

      {result && (
        <div className="rounded-xl p-6" style={glassCard}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h3 className="text-base font-bold flex items-center gap-2" style={{ color: SB.forestInk }}>
              <TrendingUp className="w-4 h-4" style={{ color: SB.forestInk, opacity: 0.5 }} />
              Results
            </h3>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleSaveEstimate}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm"
                style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
              >
                <Save className="w-4 h-4" />
                Save as draft filing
              </button>
              <Link
                to="/customer-dashboard/taxes/filing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md font-bold text-sm border transition-opacity hover:opacity-70"
                style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
              >
                View filings
              </Link>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Monthly gross", value: result.monthlyGross, bg: SB.cream },
              { label: "Annual gross", value: result.annualGross, bg: SB.cream },
              { label: "Monthly PAYE", value: result.monthlyTax, bg: "#fff1f2", textColor: "#991b1b" },
              { label: "Monthly net", value: result.monthlyNet, bg: SB.mint },
            ].map((item) => (
              <div key={item.label} className="p-4 rounded-xl" style={{ backgroundColor: item.bg, border: `1px solid ${SB.cardBorder}` }}>
                <p className="text-xs font-medium mb-1" style={{ color: SB.pencilGray }}>{item.label}</p>
                <p className="text-xl font-bold" style={{ color: item.textColor ?? SB.forestInk }}>
                  {formatNaira(item.value)}
                </p>
              </div>
            ))}
          </div>

          <div
            className="mt-6 p-5 rounded-xl flex justify-between items-center flex-wrap gap-4"
            style={{ backgroundColor: SB.mint, border: `1px solid ${SB.cardBorder}` }}
          >
            <div>
              <p className="text-xs font-medium" style={{ color: SB.pencilGray }}>Effective tax rate</p>
              <p className="text-2xl font-bold" style={{ color: SB.forestInk }}>{result.effectiveRate}%</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium" style={{ color: SB.pencilGray }}>Annual tax</p>
              <p className="text-xl font-bold" style={{ color: SB.forestInk }}>{formatNaira(result.annualTax)}</p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="text-sm font-bold mb-3" style={{ color: SB.forestInk }}>Breakdown by bracket</h4>
            <div className="space-y-2">
              {NIGERIA_PIT_BRACKETS.map((bracket, index) => {
                const taxableInBracket = Math.max(0, Math.min(result.taxableIncome, bracket.max) - bracket.min);
                if (taxableInBracket <= 0) return null;
                const taxInBracket = taxableInBracket * bracket.rate;
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 rounded-lg"
                    style={{ backgroundColor: SB.whisperGray }}
                  >
                    <span className="text-sm" style={{ color: SB.forestInk }}>
                      ₦{bracket.min.toLocaleString()} –{" "}
                      {bracket.max === Infinity ? "above" : bracket.max.toLocaleString()}
                    </span>
                    <span className="text-sm font-semibold" style={{ color: SB.forestInk }}>
                      {(bracket.rate * 100).toFixed(0)}% · {formatNaira(Math.round(taxInBracket))}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
