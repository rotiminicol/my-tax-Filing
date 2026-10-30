import { useState } from "react";
import { Download, FileText, FileCheck, CheckCircle2, X, Loader2 } from "lucide-react";

const SB = {
  forestInk: "#18623f",
  cream: "#fcfaf5",
  yellow: "#ffe95c",
  pencilGray: "#b6b6b6",
  whisperGray: "#f1f1f1",
  cardBorder: "rgba(26,51,0,0.10)",
};

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ExportModal({ isOpen, onClose }: ExportModalProps) {
  const [selectedFormat, setSelectedFormat] = useState<"pdf" | "excel" | "csv">("pdf");
  const [selectedDateRange, setSelectedDateRange] = useState<"all" | "last30" | "last90">("all");
  const [isExporting, setIsExporting] = useState(false);

  const formats = [
    {
      id: "pdf" as const,
      label: "PDF Bundle",
      desc: "Combined receipt documents in a single PDF",
      icon: FileText,
      color: "#E67700",
    },
    {
      id: "excel" as const,
      label: "Excel Spreadsheet",
      desc: "Structured data with formulas",
      icon: FileCheck,
      color: "#2B8A3E",
    },
    {
      id: "csv" as const,
      label: "CSV Data",
      desc: "Raw data for accounting systems",
      icon: FileText,
      color: "#3B5BDB",
    },
  ];

  const dateRanges = [
    { id: "all" as const, label: "All receipts", desc: "Export entire history" },
    { id: "last30" as const, label: "Last 30 days", desc: "Recent receipts only" },
    { id: "last90" as const, label: "Last 90 days", desc: "Quarterly export" },
  ];

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      onClose();
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto border"
        style={{ backgroundColor: "#ffffff", borderColor: SB.cardBorder }}
      >
        {/* Header */}
        <div
          className="p-6 border-b"
          style={{ borderColor: SB.cardBorder }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold" style={{ color: SB.forestInk }}>
                Export Receipts
              </h3>
              <p className="text-sm mt-1" style={{ color: SB.pencilGray }}>
                Choose export format and date range
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-[#fcfaf5] transition-colors"
            >
              <X className="w-5 h-5" style={{ color: SB.pencilGray }} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Format Selection */}
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-widest mb-3 block"
              style={{ color: SB.pencilGray }}
            >
              Export Format
            </label>
            <div className="space-y-3">
              {formats.map((format) => {
                const Icon = format.icon;
                const isSelected = selectedFormat === format.id;
                return (
                  <button
                    key={format.id}
                    onClick={() => setSelectedFormat(format.id)}
                    className="w-full p-4 rounded-xl border-2 text-left transition-all"
                    style={{
                      borderColor: isSelected ? SB.forestInk : SB.cardBorder,
                      backgroundColor: isSelected ? SB.cream : "#ffffff",
                    }}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${format.color}20`, color: format.color }}
                      >
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold" style={{ color: SB.forestInk }}>
                          {format.label}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: SB.pencilGray }}>
                          {format.desc}
                        </p>
                      </div>
                      {isSelected && (
                        <CheckCircle2 className="w-5 h-5 ml-auto shrink-0" style={{ color: SB.forestInk }} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date Range Selection */}
          <div>
            <label
              className="text-[11px] font-bold uppercase tracking-widest mb-3 block"
              style={{ color: SB.pencilGray }}
            >
              Date Range
            </label>
            <div className="grid grid-cols-3 gap-3">
              {dateRanges.map((range) => {
                const isSelected = selectedDateRange === range.id;
                return (
                  <button
                    key={range.id}
                    onClick={() => setSelectedDateRange(range.id)}
                    className="p-3 rounded-lg border-2 text-center transition-all"
                    style={{
                      borderColor: isSelected ? SB.forestInk : SB.cardBorder,
                      backgroundColor: isSelected ? SB.cream : "#ffffff",
                    }}
                  >
                    <p className="text-xs font-bold" style={{ color: SB.forestInk }}>
                      {range.label}
                    </p>
                    <p className="text-[9px] mt-1" style={{ color: SB.pencilGray }}>
                      {range.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Export Summary */}
          <div
            className="p-4 rounded-lg border"
            style={{ backgroundColor: SB.cream, borderColor: SB.cardBorder }}
          >
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4" style={{ color: SB.forestInk, opacity: 0.5 }} />
              <span className="text-xs font-bold" style={{ color: SB.forestInk }}>
                Export Summary
              </span>
            </div>
            <div className="space-y-1 text-xs" style={{ color: SB.pencilGray }}>
              <p>Format: {formats.find((f) => f.id === selectedFormat)?.label}</p>
              <p>Range: {dateRanges.find((r) => r.id === selectedDateRange)?.label}</p>
              <p>Estimated receipts: 1,247</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t flex gap-3" style={{ borderColor: SB.cardBorder }}>
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 rounded-md border text-xs font-bold transition-colors hover:bg-[#fcfaf5]"
            style={{ borderColor: SB.cardBorder, color: SB.forestInk }}
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 px-4 py-2.5 rounded-md font-bold text-xs transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: SB.forestInk, color: "#fcfaf5" }}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Export Now
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
