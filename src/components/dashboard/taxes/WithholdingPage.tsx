import { useMemo, useState } from "react";
import { Building2, Calculator, Receipt, Trash2, TrendingDown } from "lucide-react";
import { inputBg } from "@/components/dashboard/dashboardTokens";
import AppSelect from "@/components/ui/AppSelect";
import { formatNaira } from "@/lib/rr/format";
import { WHT_RATES, WHT_TYPE_LABELS, calculateWHT } from "@/lib/taxes";
import { useTaxesStore } from "@/store/taxes";
import { notify } from "@/components/Toaster";
import {
  TaxEmptyState,
  TaxPageHeader,
  fiscalInputClass,
  fiscalInputStyle,
  glassCard,
} from "@/components/dashboard/taxes/taxShared";

const SB = {
  forestInk: "#1a3300",
  yellow: "#ffe95c",
  mint: "#d5f5c2",
  teal: "#a8e5e5",
  cream: "#fcfaf5",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

export default function WithholdingPage() {
  const whtPayments = useTaxesStore((s) => s.whtPayments);
  const addWHTPayment = useTaxesStore((s) => s.addWHTPayment);
  const removeWHTPayment = useTaxesStore((s) => s.removeWHTPayment);

  const [calculator, setCalculator] = useState({
    type: "rent",
    amount: "",
    recipient: "",
    description: "",
    paymentDate: new Date().toISOString().slice(0, 10),
  });
  const [calcResult, setCalcResult] = useState<ReturnType<typeof calculateWHT> & { amount: number } | null>(
    null,
  );

  const totals = useMemo(
    () => ({
      wht: whtPayments.reduce((s, p) => s + p.whtAmount, 0),
      gross: whtPayments.reduce((s, p) => s + p.amount, 0),
      count: whtPayments.length,
    }),
    [whtPayments],
  );

  const whtOptions = useMemo(
    () =>
      Object.entries(WHT_RATES).map(([key, rate]) => ({
        value: key,
        label: `${WHT_TYPE_LABELS[key] ?? key} — ${rate}%`,
      })),
    [],
  );

  const handleCalculate = () => {
    const amount = parseFloat(calculator.amount) || 0;
    if (amount <= 0) {
      notify.error("Enter amount", "Payment amount must be greater than zero.");
      return;
    }
    setCalcResult({ amount, ...calculateWHT(amount, calculator.type) });
  };

  const handleRecord = () => {
    if (!calcResult) {
      handleCalculate();
      return;
    }
    if (!calculator.recipient.trim()) {
      notify.error("Recipient required", "Enter the payee name to record this deduction.");
      return;
    }
    addWHTPayment({
      type: calculator.type,
      description:
        calculator.description.trim() || (WHT_TYPE_LABELS[calculator.type] ?? calculator.type),
      recipient: calculator.recipient.trim(),
      amount: calcResult.amount,
      paymentDate: calculator.paymentDate,
    });
    notify.success("Recorded", "WHT deduction saved.");
    setCalcResult(null);
    setCalculator((c) => ({ ...c, amount: "", description: "" }));
  };

  return (
    <div className="space-y-6">
      <TaxPageHeader
        icon={<Receipt className="w-6 h-6" />}
        title="Withholding tax (WHT)"
        description="Calculate WHT on vendor payments and keep a record of deductions for remittance to FIRS."
      />

      <div className="grid md:grid-cols-3 gap-4">
        {[
          { label: "Total WHT deducted", value: formatNaira(totals.wht), icon: TrendingDown },
          { label: "Gross payments", value: formatNaira(totals.gross), icon: Building2 },
          { label: "Transactions", value: String(totals.count), icon: Calculator },
        ].map((card) => (
          <div key={card.label} className="rounded-xl p-6" style={glassCard}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm" style={{ color: SB.pencilGray }}>
                {card.label}
              </span>
              <card.icon className="w-5 h-5" style={{ color: SB.forestInk, opacity: 0.4 }} />
            </div>
            <p className="text-3xl font-bold" style={{ color: SB.forestInk }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-xl p-6" style={glassCard}>
          <h3 className="text-base font-bold mb-6 flex items-center gap-2" style={{ color: SB.forestInk }}>
            <Calculator className="w-5 h-5" style={{ opacity: 0.5 }} />
            WHT calculator
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Transaction type</label>
              <AppSelect
                value={calculator.type}
                onValueChange={(type) => setCalculator({ ...calculator, type })}
                options={whtOptions}
                placeholder="Type"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment amount (₦)</label>
              <input
                type="number"
                value={calculator.amount}
                onChange={(e) => setCalculator({ ...calculator, amount: e.target.value })}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <input
                value={calculator.description}
                onChange={(e) => setCalculator({ ...calculator, description: e.target.value })}
                placeholder="e.g. Office rent Q1"
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Recipient</label>
              <input
                value={calculator.recipient}
                onChange={(e) => setCalculator({ ...calculator, recipient: e.target.value })}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Payment date</label>
              <input
                type="date"
                value={calculator.paymentDate}
                onChange={(e) => setCalculator({ ...calculator, paymentDate: e.target.value })}
                className={fiscalInputClass}
                style={fiscalInputStyle(inputBg)}
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCalculate}
                className="flex-1 py-3 font-bold rounded-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
              >
                Calculate
              </button>
              <button
                type="button"
                onClick={handleRecord}
                className="flex-1 py-3 font-bold rounded-md transition-opacity hover:opacity-90"
                style={{ backgroundColor: SB.yellow, color: SB.forestInk }}
              >
                Record
              </button>
            </div>
          </div>

          {calcResult && (
            <div className="mt-6 p-4 rounded-xl space-y-3" style={{ backgroundColor: SB.cream, border: `1px solid ${SB.cardBorder}` }}>
              <div className="flex justify-between text-sm">
                <span style={{ color: SB.pencilGray }}>Gross</span>
                <span className="font-semibold">{formatNaira(calcResult.amount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span style={{ color: SB.pencilGray }}>Rate</span>
                <span className="font-semibold">{calcResult.rate}%</span>
              </div>
              <div className="flex justify-between text-sm" style={{ color: "#991b1b" }}>
                <span className="font-medium">WHT</span>
                <span className="font-bold">−{formatNaira(calcResult.whtAmount)}</span>
              </div>
              <div
                className="flex justify-between text-sm pt-3 border-t"
                style={{ borderColor: SB.cardBorder, color: "#1a5c3a" }}
              >
                <span className="font-medium">Net to payee</span>
                <span className="font-bold">{formatNaira(calcResult.netAmount)}</span>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-xl p-6" style={glassCard}>
          <h3 className="text-base font-bold mb-6" style={{ color: SB.forestInk }}>
            Recent deductions
          </h3>
          {whtPayments.length === 0 ? (
            <TaxEmptyState
              title="No WHT records"
              description="Use the calculator and tap Record to log withholding deductions."
            />
          ) : (
            <div className="space-y-4 max-h-[480px] overflow-y-auto">
              {whtPayments.map((payment) => (
                <div
                  key={payment.id}
                  className="p-4 rounded-xl"
                  style={{ backgroundColor: SB.cream, border: `1px solid ${SB.cardBorder}` }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold" style={{ color: SB.forestInk }}>{payment.description}</p>
                      <p className="text-sm" style={{ color: SB.pencilGray }}>
                        {payment.recipient}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full font-bold"
                        style={{ backgroundColor: SB.teal, color: SB.forestInk }}
                      >
                        {payment.rate}%
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          removeWHTPayment(payment.id);
                          notify.info("Removed", payment.description);
                        }}
                        aria-label="Remove"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm mt-3 pt-3 border-t" style={{ borderColor: SB.cardBorder }}>
                    <div>
                      <p style={{ color: SB.pencilGray }}>Gross {formatNaira(payment.amount)}</p>
                      <p style={{ color: "#991b1b" }}>WHT −{formatNaira(payment.whtAmount)}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold" style={{ color: "#1a5c3a" }}>
                        Net {formatNaira(payment.amount - payment.whtAmount)}
                      </p>
                      <p className="text-xs" style={{ color: SB.pencilGray }}>
                        {new Date(payment.paymentDate).toLocaleDateString("en-GB")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl p-6" style={{ backgroundColor: SB.cream, border: `1.5px solid ${SB.cardBorder}` }}>
        <h3 className="text-base font-bold mb-4" style={{ color: SB.forestInk }}>
          Applicable rates
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.entries(WHT_RATES).map(([type, rate]) => (
            <div
              key={type}
              className="p-3 rounded-lg border"
              style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
            >
              <p className="text-xs mb-1" style={{ color: SB.pencilGray }}>
                {WHT_TYPE_LABELS[type]}
              </p>
              <p className="text-xl font-bold" style={{ color: SB.forestInk }}>
                {rate}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
