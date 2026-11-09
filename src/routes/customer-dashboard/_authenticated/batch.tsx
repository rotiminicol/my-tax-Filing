import { useState, useEffect } from "react";
import DashboardShell from "@/components/layout/DashboardShell";
import { useReceiptsStore } from "@/store/receipts";
import { notify } from "@/components/Toaster";
import AppSelect from "@/components/ui/AppSelect";
import UpgradeGate from "@/components/subscription/UpgradeGate";
import {
  Upload,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Database,
  ShieldCheck,
  ChevronDown,
  Check,
  RefreshCw,
  AlertTriangle,
  FileCheck,
  FileX,
} from "lucide-react";
import { formatNaira } from "@/lib/rr/format";

// CSV column mapping defaults
const CSV_COLUMNS = [
  "Full Name",
  "TIN",
  "Annual rent",
  "Address",
  "Claim Period",
  "Landlord Name",
  "Landlord Phone",
];
const SCHEMA_FIELDS = [
  { key: "taxpayerName", label: "Taxpayer Name" },
  { key: "taxId", label: "Taxpayer TIN" },
  { key: "annualRent", label: "Annual Rental Amount" },
  { key: "propertyAddress", label: "Property Address" },
  { key: "claimYear", label: "Claim Year" },
  { key: "landlordName", label: "Landlord Full Name" },
];

// Mock parsed validation rows
const MOCK_ROWS = [
  {
    id: 1,
    name: "Emeka Ofor",
    tin: "12-34567890",
    amount: 1500000,
    address: "9 Garki Rd, Abuja",
    status: "success",
    errors: {},
  },
  {
    id: 2,
    name: "Fatima Yusuf",
    tin: "",
    amount: 1800000,
    address: "14 Maitama St, Abuja",
    status: "failed",
    errors: { tin: "TIN field is empty" },
  },
  {
    id: 3,
    name: "Oluwaseun Alabi",
    tin: "22-11112222",
    amount: 2400000,
    address: "3 Ring Road, Abuja",
    status: "success",
    errors: {},
  },
  {
    id: 4,
    name: "Chinedu Okafor",
    tin: "44-55556666",
    amount: 0,
    address: "18 Gwarinpa Way, Abuja",
    status: "failed",
    errors: { amount: "Amount must be greater than ₦0" },
  },
  {
    id: 5,
    name: "Zainab Ibrahim",
    tin: "99-88889999",
    amount: 1200000,
    address: "10 Asokoro Crescent, Abuja",
    status: "success",
    errors: {},
  },
];

function BatchPage() {
  const { receipts } = useReceiptsStore();
  const [step, setStep] = useState(0); // 0: Upload, 1: Mapping, 2: Parsing Progress, 3: Validation Report
  const [dragging, setDragging] = useState(false);
  const [fileName, setFileName] = useState("");
  const [mappings, setMappings] = useState<Record<string, string>>({
    taxpayerName: "Full Name",
    taxId: "TIN",
    annualRent: "Annual rent",
    propertyAddress: "Address",
    claimYear: "Claim Period",
    landlordName: "Landlord Name",
  });
  const [progress, setProgress] = useState(0);

  const handleFile = (e: React.DragEvent | React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setDragging(false);

    let file: File | undefined;
    if (e.type === "drop") {
      const de = e as React.DragEvent;
      file = de.dataTransfer.files[0];
    } else {
      const ce = e as React.ChangeEvent<HTMLInputElement>;
      file = ce.target.files?.[0];
    }

    if (file) {
      if (!file.name.endsWith(".csv") && !file.name.endsWith(".xlsx")) {
        notify.error("Invalid File Format", "Please upload a CSV or XLSX spreadsheet.");
        return;
      }
      setFileName(file.name);
      setStep(1); // Proceed to column mapping
      notify.success("File Loaded", `Successfully read ${file.name}`);
    }
  };

  // Start parsing simulator
  const startParsing = () => {
    setStep(2);
    setProgress(0);
  };

  useEffect(() => {
    if (step === 2) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setStep(3); // Go to report
              notify.success("Validation Complete", "Report is ready for review.");
            }, 500);
            return 100;
          }
          return prev + 10;
        });
      }, 150);
      return () => clearInterval(interval);
    }
    return undefined;
  }, [step]);

  const handleImportRecords = () => {
    notify.success(
      "Import Complete",
      "3 verified records successfully integrated into your receipts ledger.",
    );
    setStep(0);
    setFileName("");
  };

  return (
    <DashboardShell title="Batch Operations">
      <div className="flex flex-col gap-6 lg:gap-10">
        {/* Header Block */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-1.5">
              Bulk uploads portal
            </p>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-foreground uppercase leading-none">
              Batch Import
            </h2>
          </div>
          <div className="w-10 h-10 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-foreground border border-border shrink-0 select-none">
            <Upload className="w-4 h-4" />
          </div>
        </div>

        <UpgradeGate feature="batch-receipts">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Main workspace container */}
            <div className="lg:col-span-8 bg-card border border-border p-5 sm:p-8 rounded-lg shadow-sm">
              {/* STEP 0: Drag & Drop Zone */}
              {step === 0 && (
                <div className="space-y-6">
                  <div
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleFile}
                    className={`
                    relative border-2 border-dashed rounded-lg p-8 sm:p-14 lg:p-16 flex flex-col items-center text-center transition-all duration-300
                    ${dragging ? "border-primary bg-slate-50 dark:bg-slate-900/10" : "border-border hover:border-primary/50 bg-slate-50/20 dark:bg-slate-900/5"}
                  `}
                  >
                    <div className="w-14 h-14 rounded bg-card border border-border flex items-center justify-center mb-5 shadow-sm select-none">
                      <FileSpreadsheet className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-sm font-black mb-1 uppercase tracking-tight text-foreground">
                      Drop housing records CSV here
                    </p>
                    <p className="text-xs font-bold text-muted-foreground mb-6 max-w-xs leading-relaxed">
                      Upload your raw taxpayer or agency records. Maximum supported batch size is
                      500 rows.
                    </p>

                    <label className="cursor-pointer inline-flex items-center px-4 py-2.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm">
                      Browse Local File
                      <input
                        type="file"
                        className="hidden"
                        accept=".csv,.xlsx"
                        onChange={handleFile}
                      />
                    </label>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 sm:gap-4 border-t border-border pt-6 mt-4">
                    {[
                      { label: "Compliance Checks", icon: ShieldCheck },
                      { label: "Format Auditing", icon: Database },
                      { label: "Instantly Verified", icon: CheckCircle2 },
                    ].map((feature, i) => (
                      <div key={i} className="flex flex-col items-center text-center">
                        <div className="w-8 h-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-2 text-slate-400 select-none">
                          <feature.icon className="w-4 h-4" />
                        </div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">
                          {feature.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STEP 1: Column Mapping */}
              {step === 1 && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="pb-4 border-b border-border">
                    <h3 className="text-xs font-black uppercase text-foreground">
                      Column Mapping Setup
                    </h3>
                    <p className="text-[11px] text-muted-foreground mt-1">
                      Map the columns of{" "}
                      <span className="font-bold text-foreground font-mono">{fileName}</span> to the
                      correct recipient database fields.
                    </p>
                  </div>

                  <div className="space-y-3 max-w-lg">
                    {SCHEMA_FIELDS.map((field) => (
                      <div
                        key={field.key}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-3 border border-border rounded-lg bg-slate-50/20 dark:bg-slate-900/5"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-foreground">{field.label}</p>
                          <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-wider mt-0.5">
                            Required
                          </p>
                        </div>

                        <AppSelect
                          size="sm"
                          className="w-full sm:min-w-[160px] sm:w-auto"
                          value={mappings[field.key] || "__ignore__"}
                          onValueChange={(v) =>
                            setMappings((prev) => ({
                              ...prev,
                              [field.key]: v === "__ignore__" ? "" : v,
                            }))
                          }
                          placeholder="Map column"
                          options={[
                            { value: "__ignore__", label: "— Ignore —" },
                            ...CSV_COLUMNS.map((col) => ({ value: col, label: col })),
                          ]}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        setStep(0);
                        setFileName("");
                      }}
                      className="px-4 py-2.5 rounded border border-border bg-card text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={startParsing}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 transition-all shadow-sm cursor-pointer"
                    >
                      Confirm Mapping &amp; Validate <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Processing Validator Progress */}
              {step === 2 && (
                <div className="py-12 flex flex-col items-center justify-center text-center animate-in fade-in duration-300">
                  <div className="relative w-12 h-12 mb-6">
                    <RefreshCw className="w-12 h-12 text-slate-300 animate-spin" />
                    <div className="absolute inset-0 grid place-items-center font-mono text-[10px] font-black text-foreground">
                      {progress}%
                    </div>
                  </div>

                  <h3 className="text-sm font-black uppercase tracking-tight text-foreground mb-1">
                    Validating Records
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xs leading-relaxed mb-6">
                    Analyzing CSV data formats, checking TIN syntax rules, and checking compliance
                    standards...
                  </p>

                  <div className="w-64 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-foreground transition-all duration-200"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Validation Report Dashboard */}
              {step === 3 && (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Statistics Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                    <div className="bg-slate-50 dark:bg-slate-900/10 border border-border p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">
                          Total Rows
                        </p>
                        <h4 className="text-base font-black mt-1 text-foreground">5 Records</h4>
                      </div>
                      <FileSpreadsheet className="w-4 h-4 text-slate-400" />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/10 border border-border p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          Succeeded
                        </p>
                        <h4 className="text-base font-black mt-1 text-emerald-600 dark:text-emerald-400">
                          3 Verified
                        </h4>
                      </div>
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/10 border border-border p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                          Failed Checks
                        </p>
                        <h4 className="text-base font-black mt-1 text-rose-600 dark:text-rose-400">
                          2 Warnings
                        </h4>
                      </div>
                      <AlertCircle className="w-4 h-4 text-rose-500" />
                    </div>
                  </div>

                  {/* Validation Table */}
                  <div className="border border-border rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[500px] text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50 dark:bg-slate-900/20 border-b border-border font-bold text-muted-foreground text-[10px] uppercase">
                          <th className="py-2.5 px-4 w-12 text-center">Row</th>
                          <th className="py-2.5 px-3">Taxpayer Name</th>
                          <th className="py-2.5 px-3">Tax TIN</th>
                          <th className="py-2.5 px-3 text-right">Annual rent</th>
                          <th className="py-2.5 px-4 w-28 text-center">Result</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {MOCK_ROWS.map((row) => (
                          <tr
                            key={row.id}
                            className={`hover:bg-slate-50/40 dark:hover:bg-slate-800/10 transition-colors ${
                              row.status === "failed" ? "bg-rose-500/5" : ""
                            }`}
                          >
                            <td className="py-3 px-4 text-center font-mono text-[10px] font-bold text-muted-foreground">
                              {row.id}
                            </td>
                            <td className="py-3 px-3 font-semibold text-foreground">{row.name}</td>
                            <td
                              className={`py-3 px-3 font-mono ${row.errors.tin ? "bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold" : "text-muted-foreground"}`}
                            >
                              {row.tin || "MISSING"}
                              {row.errors.tin && (
                                <span className="block text-[8px] font-bold text-rose-500 uppercase tracking-wide mt-0.5">
                                  {row.errors.tin}
                                </span>
                              )}
                            </td>
                            <td
                              className={`py-3 px-3 text-right font-bold ${row.errors.amount ? "bg-rose-500/10 text-rose-600 dark:text-rose-400" : "text-foreground"}`}
                            >
                              {row.amount > 0 ? formatNaira(row.amount) : "₦0"}
                              {row.errors.amount && (
                                <span className="block text-[8px] font-bold text-rose-500 uppercase tracking-wide mt-0.5">
                                  {row.errors.amount}
                                </span>
                              )}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                  row.status === "success"
                                    ? "bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400"
                                    : "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400"
                                }`}
                              >
                                {row.status === "success" ? (
                                  <FileCheck className="w-2.5 h-2.5" />
                                ) : (
                                  <FileX className="w-2.5 h-2.5" />
                                )}
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <button
                      onClick={() => setStep(0)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded border border-border bg-card text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Upload Different File
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          notify.success(
                            "Downloaded Error Log",
                            "Saving batch-warnings-log.csv to local device.",
                          )
                        }
                        className="px-4 py-2.5 rounded border border-rose-100 dark:border-rose-950/50 bg-card text-rose-500 text-xs font-semibold hover:bg-rose-50 dark:hover:bg-rose-950/10 transition-all cursor-pointer"
                      >
                        Download Error Log
                      </button>
                      <button
                        onClick={handleImportRecords}
                        className="px-5 py-2.5 rounded bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-sm transition-all cursor-pointer"
                      >
                        Import Verified Records
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right sidebar info panel */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-slate-50 dark:bg-slate-900/10 border border-border rounded-lg p-5">
                <h3 className="text-xs font-black uppercase text-foreground mb-4">
                  Export Database
                </h3>
                <p className="text-xs font-bold text-muted-foreground leading-relaxed mb-6">
                  Archive and backup your active ledger records by saving them directly as a
                  standard, encrypted bulk CSV file.
                </p>

                <button
                  onClick={() =>
                    notify.info(
                      "Download Ready",
                      `Exporting ${receipts.length} total receipt records.`,
                    )
                  }
                  className="w-full h-11 rounded border border-border hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer bg-card shadow-sm"
                >
                  <Download className="w-4 h-4 text-slate-400" /> Save Secure CSV
                </button>
              </div>

              <div className="p-5 border border-border bg-slate-50/20 dark:bg-slate-900/5 rounded-lg">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-3">
                  Download Import Template
                </h4>
                <p className="text-xs font-medium text-muted-foreground leading-relaxed mb-6">
                  Use our standardized columns mapping layout schema template to format your CSV
                  records correctly before uploading.
                </p>
                <button
                  onClick={() =>
                    notify.success(
                      "Download Initialized",
                      "MyRentReceipt CSV template saved successfully.",
                    )
                  }
                  className="w-full h-11 rounded bg-primary text-primary-foreground text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer"
                >
                  Download CSV Template
                </button>
              </div>
            </div>
          </div>
        </UpgradeGate>
      </div>
    </DashboardShell>
  );
}

export default BatchPage;
