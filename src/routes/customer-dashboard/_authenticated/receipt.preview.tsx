import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import { z } from "zod";
import FiscalDashboardShell from "@/components/dashboard/FiscalDashboardShell";
import ReceiptDocument from "@/components/receipt/ReceiptDocument";
import { useReceiptsStore } from "@/store/receipts";
import { exportToPdf } from "@/lib/rr/pdf";
import { notify } from "@/components/Toaster";
import { emitAppNotification } from "@/lib/events";
import { Download, Printer, Mail, FileX, Trash2, X, Pencil, ArrowLeft } from "lucide-react";
import { fiscal } from "@/components/fiscal-landing/tokens";

function Preview() {
  const [_searchParams] = useSearchParams();
  const id = _searchParams.get("id");
  const receipts = useReceiptsStore((s) => s.receipts);
  const receipt = receipts.find((r) => r.id === id) ?? receipts[0];
  const ref = useRef<HTMLDivElement>(null);

  // Mobile sidebar toggle
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Digital Signature & Date States
  const [sigMode, setSigMode] = useState<"draw" | "type">("draw");
  const [signatureData, setSignatureData] = useState<string>("");
  const [typedName, setTypedName] = useState<string>("");
  const [certifiedDateStr, setCertifiedDateStr] = useState<string>(
    new Date().toISOString().split("T")[0]
  );

  // Canvas Drawing States
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    if (!receipt) return;

    setTypedName((prev) => prev || receipt.typedSignature || receipt.taxpayer.fullName || "");
    setSignatureData((prev) => prev || receipt.signatureData || "");
    setSigMode((prev) => prev || receipt.sigMode || "draw");
    setCertifiedDateStr((prev) => prev || receipt.certifiedDate || new Date().toISOString().split("T")[0]);
  }, [receipt]);

  if (!receipt) {
    return (
      <FiscalDashboardShell title="Receipt Preview">
        <div className="mx-auto max-w-xl px-6 py-24 text-center select-none">
          <FileX className="h-12 w-12 mx-auto text-slate-400 animate-bounce" />
          <h1 className="mt-4 font-sans font-black uppercase text-xl tracking-wider text-foreground">No receipt found</h1>
          <p className="mt-2 text-xs text-muted-foreground">Generate a certified receipt first to view it here.</p>
          <Link 
            to="/customer-dashboard/receipt/new" 
            className="mt-6 inline-flex h-10 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold uppercase tracking-widest items-center justify-center hover:opacity-90 transition-all cursor-pointer"
          >
            Generate Receipt
          </Link>
        </div>
      </FiscalDashboardShell>
    );
  }

  // Signature Pad Drawing Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.beginPath();
    ctx.moveTo(x, y);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = ("touches" in e) ? e.touches[0].clientX - rect.left : e.clientX - rect.left;
    const y = ("touches" in e) ? e.touches[0].clientY - rect.top : e.clientY - rect.top;

    ctx.lineTo(x, y);
    ctx.lineWidth = 2.5;
    ctx.lineCap = "round";
    ctx.strokeStyle = "#000000";
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (canvas) {
      setSignatureData(canvas.toDataURL());
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setSignatureData("");
  };

  const formattedCertifiedDate = (() => {
    if (!certifiedDateStr) return "";
    const d = new Date(certifiedDateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
  })();

  const navigate = useNavigate();

  const hasSignature = sigMode === "draw" ? !!signatureData : typedName.trim().length > 0;

  const getSignedReceipt = () => ({
    ...receipt,
    signatureData,
    typedSignature: typedName,
    sigMode,
    certifiedDate: formattedCertifiedDate,
  });

  const saveReceipt = () => {
    if (!hasSignature) {
      emitAppNotification({ level: "warning", title: "Sign first", description: "Please certify the receipt before saving." });
      return;
    }

    useReceiptsStore.getState().add(getSignedReceipt());
    emitAppNotification({ level: "success", title: "Receipt saved", description: `${receipt.taxpayer.fullName} • Ref ${receipt.id}` });
    navigate("/customer-dashboard/receipts");
  };

  const download = async () => {
    if (!hasSignature) {
      emitAppNotification({ level: "warning", title: "Sign first", description: "Please certify the receipt before downloading." });
      return;
    }
    if (!ref.current) return;

    const signedReceipt = getSignedReceipt();
    useReceiptsStore.getState().add(signedReceipt);

    try {
      await exportToPdf(
        ref.current,
        `MyRentReceipt_${receipt.taxpayer.fullName.replace(/\s+/g, "_")}_${receipt.employer.claimYear}.pdf`,
      );
      emitAppNotification({ level: "success", title: "Download started", description: `Preparing ${receipt.taxpayer.fullName} • Ref ${receipt.id}` });
      setTimeout(() => navigate("/customer-dashboard/receipts"), 150);
    } catch (error) {
      emitAppNotification({ level: "error", title: "Download failed", description: "There was an issue generating the PDF. Please try again." });
      console.error(error);
    }
  };

  const print = () => {
    if (!hasSignature) {
      emitAppNotification({ level: "warning", title: "Sign first", description: "Please certify the receipt before printing." });
      return;
    }
    window.print();
  };

  const share = async () => {
    if (!hasSignature) {
      emitAppNotification({ level: "warning", title: "Sign first", description: "Please certify the receipt before sharing." });
      return;
    }

    const title = `Rent Allowance Claim Certificate Ref: ${receipt.id}`;
    const text = `Certified tax compliance receipt ${receipt.id} generated for ${receipt.taxpayer.fullName} (PAYE Claim Year ${receipt.employer.claimYear}).`;

    if (navigator.share) {
      try {
        await navigator.share({ title, text });
        return;
      } catch {
        // fallback to mailto if share is canceled or unsupported
      }
    }

    const subj = encodeURIComponent(title);
    const body = encodeURIComponent(text);
    window.location.href = `mailto:?subject=${subj}&body=${body}`;
  };

  return (
    <FiscalDashboardShell 
      title="Receipt Preview"
      actions={
        <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl shadow-slate-900/5 backdrop-blur-sm">
          <button
            type="button"
            onClick={saveReceipt}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white shadow-lg shadow-emerald-800/20 transition hover:bg-emerald-500"
          >
            <Download className="w-4 h-4" /> Save Receipt
          </button>
          <button
            type="button"
            onClick={download}
            disabled={!hasSignature}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-lg transition ${
              hasSignature
                ? "bg-slate-950 text-white shadow-slate-900/10 hover:bg-slate-800"
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Download className="w-4 h-4" /> Download PDF
          </button>
          <button
            type="button"
            onClick={print}
            disabled={!hasSignature}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm transition ${
              hasSignature
                ? "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Printer className="w-4 h-4" /> Print
          </button>
          <button
            type="button"
            onClick={share}
            disabled={!hasSignature}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] shadow-sm transition ${
              hasSignature
                ? "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-slate-100"
                : "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed shadow-none"
            }`}
          >
            <Mail className="w-4 h-4" /> Share
          </button>
          <div className="ml-auto hidden sm:inline-flex items-center rounded-full bg-slate-100 px-3 py-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            Ref: {receipt.id}
          </div>
        </div>
      }
    >
      <div className="mx-auto max-w-full py-2 grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-8">
        
        {/* Sidebar – hidden on mobile, shown on lg or when toggled */}
        <aside 
          className={`
            ${sidebarOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950 p-6 overflow-y-auto' : 'hidden'} 
            lg:block lg:relative lg:z-0 space-y-6
          `}
        >
          {/* Close button for mobile overlay */}
          {sidebarOpen && (
            <button 
              onClick={() => setSidebarOpen(false)}
              className="mb-4 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center lg:hidden"
            >
              <X className="w-4 h-4" />
            </button>
          )}

          {/* Reference Info Card */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
            <p className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-black">Receipt Reference</p>
            <p className="mt-1.5 font-mono text-xs font-bold text-foreground break-all select-all">{receipt.id}</p>
            <p className="mt-1.5 text-[10px] text-muted-foreground">Issued: {new Date(receipt.createdAt).toLocaleString("en-NG")}</p>
          </div>

          {/* Interactive Digital Signature Creator */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm space-y-4">
            <div>
              <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase font-black block border-b border-border pb-1.5">Taxpayer Certification</span>
              <p className="text-[10px] text-muted-foreground mt-1">Select signature mode and sign below to instantly emboss it onto the tax certificate.</p>
            </div>

            {/* Mode Toggle Button Grid */}
            <div className="flex border border-border rounded overflow-hidden p-0.5 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setSigMode("draw")}
                className={`flex-1 py-1 text-[9px] uppercase font-black tracking-widest transition-all rounded cursor-pointer ${
                  sigMode === "draw"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Draw Signature
              </button>
              <button
                onClick={() => setSigMode("type")}
                className={`flex-1 py-1 text-[9px] uppercase font-black tracking-widest transition-all rounded cursor-pointer ${
                  sigMode === "type"
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Type Signature
              </button>
            </div>

            {/* Draw Mode Canvas */}
            {sigMode === "draw" && (
              <div className="space-y-2">
                <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-black block">Sign in Box below</label>
                <div className="border border-dashed border-border rounded-lg overflow-hidden bg-white dark:bg-slate-950">
                  <canvas
                    ref={canvasRef}
                    width={260}
                    height={110}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                    className="w-full cursor-crosshair block"
                  />
                </div>
                <button
                  onClick={clearCanvas}
                  className="w-full py-1.5 rounded border border-border bg-slate-50 hover:bg-slate-100 dark:bg-slate-900/40 dark:hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Trash2 className="w-3 h-3" /> Clear Signature Pad
                </button>
              </div>
            )}

            {/* Type Mode Text Input */}
            {sigMode === "type" && (
              <div className="space-y-2">
                <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-black block">Type Legal Name</label>
                <input
                  type="text"
                  value={typedName}
                  onChange={(e) => setTypedName(e.target.value)}
                  placeholder="e.g. Adewale Yusuf"
                  className="w-full h-10 px-3 border border-border bg-background text-foreground rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <div className="p-3 border border-border bg-slate-50/20 dark:bg-slate-900/10 rounded flex flex-col items-center justify-center min-h-[60px] select-none">
                  <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase block mb-1">Cursive Output</span>
                  <span 
                    className="text-base font-bold text-foreground italic leading-none"
                    style={{ fontFamily: "cursive, sans-serif" }}
                  >
                    {typedName || "No Name Entered"}
                  </span>
                </div>
              </div>
            )}

            {/* Interactive Certification Date Picker */}
            <div className="space-y-1.5 pt-2 border-t border-border">
              <label className="text-[9px] font-mono tracking-widest text-slate-400 uppercase font-black block">Certification Date</label>
              <input
                type="date"
                value={certifiedDateStr}
                onChange={(e) => setCertifiedDateStr(e.target.value)}
                className="w-full h-10 px-3 border border-border bg-background text-foreground rounded text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer uppercase font-mono"
              />
            </div>
          </div>

          {/* Guidelines info card */}
          <div className="bg-card border border-border p-5 rounded-lg shadow-sm">
            <span className="font-mono text-[9px] tracking-widest text-slate-400 uppercase font-black block mb-2">FCT-IRS Filing Guide</span>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium">
              This certificate is fully optimized for <strong className="text-foreground font-bold">Section 57 NTAA</strong> compliance. Submit this document to your employer's PAYE tax office on or before <strong className="text-foreground font-bold">31st May 2026</strong>.
            </p>
          </div>
        </aside>

        {/* Receipt Document Canvas */}
        <div className="overflow-x-auto bg-slate-50/50 dark:bg-slate-900/5 border border-border p-4 sm:p-10 rounded-lg flex justify-center items-start">
          <div ref={ref} className="w-full max-w-[820px] shrink-0 shadow-lg">
            <ReceiptDocument 
              receipt={receipt} 
              signatureData={signatureData}
              typedSignature={typedName}
              sigMode={sigMode}
              certifiedDate={formattedCertifiedDate}
            />
          </div>
        </div>

      </div>
    </FiscalDashboardShell>
  );
}

export default Preview;
