import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState, useMemo } from "react";
import gsap from "gsap";
import FiscalDashboardShell from "@/components/dashboard/FiscalDashboardShell";
import StepIndicator from "@/components/ui-rr/StepIndicator";
import {
  Label,
  Input,
  Textarea,
  ErrorText,
  CurrencyInput,
  TaxIdInput,
} from "@/components/ui-rr/Field";
import { useDraft } from "@/store/draft";
import { useReceiptsStore } from "@/store/receipts";
import { useLoadingStore } from "@/store/loading";
import { generateReceiptId, formatNaira } from "@/lib/rr/format";
import { FCT_TAX_OFFICES } from "@/lib/rr/taxOffices";
import type { Receipt } from "@/lib/rr/types";
import ReceiptDocument from "@/components/receipt/ReceiptDocument";
import { exportToPdf } from "@/lib/rr/pdf";
import {
  ArrowRight,
  ArrowLeft,
  Pencil,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  Upload,
  FileText,
  Sparkles,
  AlertTriangle,
  Printer,
  Download,
  Share2,
  ImageIcon,
  File,
  X,
} from "lucide-react";
import AppSelect from "@/components/ui/AppSelect";
import { notify } from "@/components/Toaster";

// Autocomplete Preset Vendors
const VENDOR_PRESETS = [
  {
    name: "Abuja Properties Ltd",
    taxId: "12-34567890",
    phone: "+234 803 111 2222",
    email: "billing@abujaproperties.com",
    address: "12 Garki Road, Wuse II, Abuja",
    type: "agent" as const,
  },
  {
    name: "Rent & Shelter Group",
    taxId: "22-98765432",
    phone: "+234 812 333 4444",
    email: "finance@rentandshelter.ng",
    address: "4 Maitama Way, Asokoro, Abuja",
    type: "landlord" as const,
  },
  {
    name: "Premium Leasing Agency",
    taxId: "32-11112222",
    phone: "+234 905 555 6666",
    email: "support@premiumleasing.com",
    address: "18 Ring Road, Garki, Abuja",
    type: "agent" as const,
  },
];

const CATEGORIES = ["Rent", "Service Charge", "Caution Deposit", "Parking Fee"];

interface LineItem {
  id: string;
  description: string;
  category: string;
  amount: number;
}

interface AttachedFile {
  file: File;
  previewUrl: string | null; // object URL for images, null for non-image
}

function FilePreview({
  attached,
  onRemove,
  label,
}: {
  attached: AttachedFile;
  onRemove: () => void;
  label: string;
}) {
  const isImage = attached.file.type.startsWith("image/");
  return (
    <div className="relative border border-border rounded-lg overflow-hidden bg-slate-50 dark:bg-slate-900/10">
      {isImage && attached.previewUrl ? (
        <img
          src={attached.previewUrl}
          alt={attached.file.name}
          className="w-full h-32 object-cover"
        />
      ) : (
        <div className="w-full h-32 flex flex-col items-center justify-center gap-2">
          <File className="w-8 h-8 text-slate-400" />
          <p className="text-[10px] font-bold text-muted-foreground text-center px-3 truncate max-w-[180px]">
            {attached.file.name}
          </p>
        </div>
      )}
      <div className="absolute top-2 right-2">
        <button
          onClick={onRemove}
          className="h-6 w-6 rounded-full bg-white/90 dark:bg-slate-800/90 border border-border flex items-center justify-center hover:bg-rose-50 hover:text-rose-500 transition-all cursor-pointer"
        >
          <X className="w-3 h-3" />
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 px-2 py-1 bg-black/40 text-white">
        <p className="text-[9px] font-bold truncate">{label}</p>
      </div>
    </div>
  );
}

function UploadZone({
  onFile,
  dragging,
  onDragOver,
  onDragLeave,
  onDrop,
  children,
}: {
  onFile: (f: File) => void;
  dragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  children?: React.ReactNode;
}) {
  return (
    <div
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={`relative border-2 border-dashed rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300
        ${dragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 bg-slate-50/20 dark:bg-slate-900/5"}
      `}
    >
      <div className="w-9 h-9 rounded-lg bg-card border border-border flex items-center justify-center mb-2 shadow-sm select-none">
        <Upload className="w-4 h-4 text-slate-400" />
      </div>
      {children}
      <label className="mt-2 cursor-pointer inline-flex items-center px-3 py-1.5 rounded bg-primary text-primary-foreground text-[9px] font-bold uppercase tracking-wider hover:opacity-90 transition-all shadow-sm">
        Browse File
        <input
          type="file"
          className="hidden"
          accept=".pdf,.docx,.png,.jpg,.jpeg,.webp"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />
      </label>
    </div>
  );
}

function NewReceipt() {
  const navigate = useNavigate();
  const {
    draft,
    patchTaxpayer,
    patchLandlord,
    patchEmployer,
    setDeclaration,
    setStep,
    setLastGenerated,
    reset,
  } = useDraft();
  const add = useReceiptsStore((s) => s.add);

  const STEP_LABELS = ["Details", "Line Items", "Documents", "Receipt Preview"];
  const [step, setLocalStep] = useState(draft.step || 0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showPresets, setShowPresets] = useState(false);

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", category: "Rent", amount: 0 },
  ]);

  // Tax state
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(7.5);
  const [discountAmount, setDiscountAmount] = useState(0);

  // Document upload state
  const [receiptFile, setReceiptFile] = useState<AttachedFile | null>(null);
  const [leaseFile, setLeaseFile] = useState<AttachedFile | null>(null);
  const [receiptDragging, setReceiptDragging] = useState(false);
  const [leaseDragging, setLeaseDragging] = useState(false);
  const [statedReceiptAmount, setStatedReceiptAmount] = useState(0);

  const [stamping, setStamping] = useState(false);

  const slideRef = useRef<HTMLDivElement>(null);
  const stampRef = useRef<HTMLDivElement>(null);
  const receiptDocRef = useRef<HTMLDivElement>(null);

  const goStep = (n: number) => {
    if (!slideRef.current) {
      setLocalStep(n);
      setStep(n);
      return;
    }
    const dir = n > step ? 1 : -1;
    gsap.to(slideRef.current, {
      x: -30 * dir,
      opacity: 0,
      duration: 0.2,
      ease: "power2.in",
      onComplete: () => {
        setLocalStep(n);
        setStep(n);
        requestAnimationFrame(() => {
          gsap.fromTo(
            slideRef.current,
            { x: 30 * dir, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.3, ease: "power3.out" },
          );
        });
      },
    });
  };

  const subtotal = useMemo(
    () => lineItems.reduce((sum, item) => sum + item.amount, 0),
    [lineItems],
  );
  const taxAmount = useMemo(
    () => (taxEnabled ? Math.round(subtotal * (taxRate / 100)) : 0),
    [subtotal, taxEnabled, taxRate],
  );
  const grandTotal = useMemo(
    () => subtotal + taxAmount - discountAmount,
    [subtotal, taxAmount, discountAmount],
  );

  const priceMismatch =
    statedReceiptAmount > 0 && Math.abs(statedReceiptAmount - grandTotal) > 0;

  useEffect(() => {
    patchTaxpayer({
      allowanceClaimed: grandTotal,
      annualRentalAmount: subtotal,
    });
  }, [subtotal, grandTotal]);

  const validateStep = (): boolean => {
    const e: Record<string, string> = {};
    const t = draft.taxpayer,
      l = draft.landlord,
      em = draft.employer;

    if (step === 0) {
      if (!t.fullName?.trim()) e.fullName = "Required";
      if (!t.taxId || t.taxId.length < 8)
        e.tTaxId = "Enter a valid TIN (8-12 digits)";
      if (!t.propertyAddress?.trim()) e.propertyAddress = "Required";
      if (!l.fullName?.trim()) e.lFullName = "Required";
      if (!l.address?.trim()) e.lAddress = "Required";
      if (!l.phone) e.lPhone = "Required";
      if (!em.companyName?.trim()) e.companyName = "Required";
      if (!em.taxId || em.taxId.length < 8)
        e.eTaxId = "Enter a valid Employer TIN";
    }

    if (step === 1) {
      if (lineItems.length === 0)
        e.lineItems = "Please add at least one line item";
      lineItems.forEach((item, idx) => {
        if (!item.description.trim())
          e[`item_${idx}_desc`] = "Description is required";
        if (item.amount <= 0) e[`item_${idx}_amt`] = "Must be greater than 0";
      });
    }

    if (step === 2) {
      if (taxRate < 0 || taxRate > 100) e.taxRate = "Invalid tax percentage";
      if (discountAmount < 0 || discountAmount > subtotal)
        e.discountAmount = "Cannot exceed subtotal";
    }

    if (step === 3 && !draft.declaration) {
      e.declaration = "You must accept the certification statement";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const next = () => {
    if (validateStep()) goStep(Math.min(step + 1, 3));
  };
  const back = () => goStep(Math.max(step - 1, 0));

  const applyPreset = (preset: (typeof VENDOR_PRESETS)[0]) => {
    patchLandlord({
      fullName: preset.name,
      taxId: preset.taxId,
      phone: preset.phone,
      email: preset.email,
      address: preset.address,
      type: preset.type,
    });
    setShowPresets(false);
    notify.success(
      "Vendor Preset Applied",
      `Loaded ${preset.name} automatically.`,
    );
  };

  const addLineRow = () => {
    setLineItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        description: "",
        category: "Rent",
        amount: 0,
      },
    ]);
  };

  const updateLineRow = (id: string, field: keyof LineItem, val: any) => {
    setLineItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  const removeLineRow = (id: string) => {
    if (lineItems.length === 1) {
      notify.warning(
        "Minimum Row Limit",
        "At least one line item is required.",
      );
      return;
    }
    setLineItems((prev) => prev.filter((item) => item.id !== id));
  };

  const attachFile = (file: File): AttachedFile => {
    const isImage = file.type.startsWith("image/");
    return { file, previewUrl: isImage ? URL.createObjectURL(file) : null };
  };

  const handleReceiptFile = (file: File) => {
    setReceiptFile(attachFile(file));
    notify.success("Receipt attached", `${file.name} linked to draft.`);
  };

  const handleLeaseFile = (file: File) => {
    setLeaseFile(attachFile(file));
    notify.success("Lease Agreement attached", `${file.name} linked to draft.`);
  };

  // Step 4 actions
  const previewReceipt: Receipt = useMemo(
    () => ({
      id: generateReceiptId(),
      createdAt: new Date().toISOString(),
      status: "generated",
      taxpayer: {
        fullName: draft.taxpayer.fullName || "",
        taxId: draft.taxpayer.taxId || "",
        propertyAddress: draft.taxpayer.propertyAddress || "",
        annualRentalAmount: subtotal,
        allowanceClaimed: grandTotal,
      },
      landlord: {
        fullName: draft.landlord.fullName || "",
        type: draft.landlord.type || "agent",
        address: draft.landlord.address || "",
        phone: draft.landlord.phone || "",
        email: draft.landlord.email,
        taxId: draft.landlord.taxId,
      },
      employer: {
        companyName: draft.employer.companyName || "",
        taxId: draft.employer.taxId || "",
        taxOffice: draft.employer.taxOffice || "",
        claimYear: draft.employer.claimYear || "",
      },
      declaration: draft.declaration,
    }),
    [draft, subtotal, grandTotal],
  );

  const printReceipt = () => window.print();
  const downloadReceipt = async () => {
    if (!receiptDocRef.current) return;
    await exportToPdf(
      receiptDocRef.current,
      `RentReceipt_${draft.taxpayer.fullName?.replace(/\s+/g, "_") || "draft"}.pdf`,
    );
  };
  const shareReceipt = () => {
    const subj = encodeURIComponent(
      `Rent Receipt — ${draft.taxpayer.fullName}`,
    );
    const body = encodeURIComponent(
      `Please find attached the rent receipt for ${draft.taxpayer.fullName}.`,
    );
    window.location.href = `mailto:?subject=${subj}&body=${body}`;
  };

  const generate = () => {
    if (!validateStep()) return;
    const receipt: Receipt = { ...previewReceipt };
    useLoadingStore.getState().showLoader("Generating Security Stamp...");
    setStamping(true);
    requestAnimationFrame(() => {
      if (stampRef.current) {
        gsap.fromTo(
          stampRef.current,
          { scale: 3, rotate: -22, opacity: 0 },
          {
            scale: 1,
            rotate: -8,
            opacity: 1,
            duration: 0.55,
            ease: "back.out(2.4)",
            onComplete: () => {
              add(receipt);
              setLastGenerated(receipt.id);
              setTimeout(() => {
                reset();
                useLoadingStore.getState().hideLoader();
                navigate("/customer-dashboard/receipt/preview");
              }, 500);
            },
          },
        );
      } else {
        add(receipt);
        setLastGenerated(receipt.id);
        setTimeout(() => {
          reset();
          useLoadingStore.getState().hideLoader();
          navigate("/customer-dashboard/receipt/preview");
        }, 500);
      }
    });
  };

  useEffect(() => {
    setLocalStep(draft.step || 0);
  }, []);

  const t = draft.taxpayer,
    l = draft.landlord,
    em = draft.employer;

  return (
    <FiscalDashboardShell
      title="New Receipt"
      actions={
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold cursor-pointer transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        </div>
      }
    >
      <div className="max-w-3xl mx-auto">
        <div className="bg-card border border-border p-5 sm:p-8 rounded-lg shadow-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                Receipt Creator Wizard
              </p>
              <h2 className="text-lg font-black tracking-tight text-foreground uppercase leading-none">
                Configure Record
              </h2>
            </div>

            {step === 0 && (
              <div className="relative">
                <button
                  onClick={() => setShowPresets((prev) => !prev)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer border border-primary/10"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Preset Vendors
                </button>
                {showPresets && (
                  <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[220px] bg-card border border-border rounded-lg shadow-lg overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-3.5 py-1 select-none border-b border-border mb-1">
                      Load preset vendors
                    </p>
                    {VENDOR_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="w-full px-3.5 py-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-left transition-colors cursor-pointer block"
                      >
                        <p className="text-[11px] font-bold text-foreground leading-snug">
                          {preset.name}
                        </p>
                        <p className="text-[9px] text-muted-foreground font-semibold mt-0.5 uppercase tracking-wider">
                          {preset.type} · TIN: {preset.taxId}
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={printReceipt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={downloadReceipt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Save PDF
                </button>
                <button
                  onClick={shareReceipt}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-[10px] font-bold transition-all cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Share
                </button>
              </div>
            )}
          </div>

          <StepIndicator current={step} steps={STEP_LABELS} />

          <div ref={slideRef} className="mt-8">
            {/* ── STEP 0: Details ── */}
            {step === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                <div className="md:col-span-2">
                  <Label required>Full Name of Taxpayer</Label>
                  <Input
                    variant="underline"
                    value={t.fullName ?? ""}
                    invalid={!!errors.fullName}
                    onChange={(e) =>
                      patchTaxpayer({ fullName: e.target.value })
                    }
                    placeholder="e.g. Adaeze Okonkwo"
                  />
                  <ErrorText>{errors.fullName}</ErrorText>
                </div>
                <div>
                  <Label required>Tax ID (TIN)</Label>
                  <TaxIdInput
                    variant="underline"
                    value={t.taxId ?? ""}
                    onChange={(v) => patchTaxpayer({ taxId: v })}
                  />
                  <ErrorText>{errors.tTaxId}</ErrorText>
                </div>
                <div>
                  <Label required>Address of Rented Property</Label>
                  <Input
                    variant="underline"
                    value={t.propertyAddress ?? ""}
                    invalid={!!errors.propertyAddress}
                    onChange={(e) =>
                      patchTaxpayer({ propertyAddress: e.target.value })
                    }
                    placeholder="House no., street, district, FCT"
                  />
                  <ErrorText>{errors.propertyAddress}</ErrorText>
                </div>

                <div className="md:col-span-2 h-px bg-border my-2" />

                <div className="md:col-span-2">
                  <Label required>Full Name of Landlord / Agent</Label>
                  <Input
                    variant="underline"
                    value={l.fullName ?? ""}
                    invalid={!!errors.lFullName}
                    onChange={(e) =>
                      patchLandlord({ fullName: e.target.value })
                    }
                    placeholder="e.g. Abuja Properties Ltd"
                  />
                  <ErrorText>{errors.lFullName}</ErrorText>
                </div>
                <div>
                  <Label>Relationship</Label>
                  <div className="inline-flex rounded-lg border border-border p-0.5 bg-slate-100 dark:bg-slate-800">
                    {(["landlord", "agent"] as const).map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => patchLandlord({ type: opt })}
                        className={`px-4 py-1.5 rounded text-[9px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                          l.type === opt
                            ? "bg-card text-foreground shadow-sm"
                            : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <Label required>Phone Number</Label>
                  <Input
                    variant="underline"
                    value={l.phone ?? ""}
                    invalid={!!errors.lPhone}
                    onChange={(e) => patchLandlord({ phone: e.target.value })}
                    placeholder="+234 803 111 2222"
                  />
                  <ErrorText>{errors.lPhone}</ErrorText>
                </div>
                <div className="md:col-span-2">
                  <Label required>
                    {l.type === "agent"
                      ? "Office Address"
                      : "Residential Address"}
                  </Label>
                  <Textarea
                    variant="underline"
                    rows={2}
                    value={l.address ?? ""}
                    invalid={!!errors.lAddress}
                    onChange={(e) => patchLandlord({ address: e.target.value })}
                    placeholder="Enter primary vendor legal address details"
                  />
                  <ErrorText>{errors.lAddress}</ErrorText>
                </div>

                <div className="md:col-span-2 h-px bg-border my-2" />

                <div>
                  <Label required>Company / Employer Name</Label>
                  <Input
                    variant="underline"
                    value={em.companyName ?? ""}
                    invalid={!!errors.companyName}
                    onChange={(e) =>
                      patchEmployer({ companyName: e.target.value })
                    }
                    placeholder="e.g. Standard Corporate Services"
                  />
                  <ErrorText>{errors.companyName}</ErrorText>
                </div>
                <div>
                  <Label required>Employer Tax ID</Label>
                  <TaxIdInput
                    variant="underline"
                    value={em.taxId ?? ""}
                    onChange={(v) => patchEmployer({ taxId: v })}
                  />
                  <ErrorText>{errors.eTaxId}</ErrorText>
                </div>
                <div>
                  <Label>FCT Tax Office</Label>
                  <AppSelect
                    size="sm"
                    value={em.taxOffice ?? ""}
                    onValueChange={(v) => patchEmployer({ taxOffice: v })}
                    placeholder="Select office..."
                    options={FCT_TAX_OFFICES.map((o) => ({
                      value: o,
                      label: o,
                    }))}
                  />
                </div>
                <div>
                  <Label>Claim Year</Label>
                  <AppSelect
                    size="sm"
                    value={em.claimYear ?? ""}
                    onValueChange={(v) => patchEmployer({ claimYear: v })}
                    placeholder="Select year..."
                    options={["2024", "2025", "2026"].map((y) => ({
                      value: y,
                      label: y,
                    }))}
                  />
                </div>
              </div>
            )}

            {/* ── STEP 1: Line Items ── */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-1">
                    Line Item Builder
                  </h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    List individual payments (e.g. rent installments, deposits).
                    All amounts are in Nigerian Naira (₦).
                  </p>
                  <ErrorText>{errors.lineItems}</ErrorText>
                </div>

                <div className="space-y-3">
                  {lineItems.map((item, idx) => (
                    <div
                      key={item.id}
                      className="p-4 border border-border bg-slate-50/50 dark:bg-slate-900/10 rounded-lg"
                    >
                      <div className="flex items-start gap-3">
                        {/* Row number */}
                        <div className="shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-[10px] font-black flex items-center justify-center mt-1 select-none">
                          {idx + 1}
                        </div>

                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-[1fr_140px_160px] gap-3 min-w-0">
                          {/* Description */}
                          <div>
                            <Label required>Description</Label>
                            <Input
                              variant="underline"
                              value={item.description}
                              invalid={!!errors[`item_${idx}_desc`]}
                              onChange={(e) =>
                                updateLineRow(
                                  item.id,
                                  "description",
                                  e.target.value,
                                )
                              }
                              placeholder="e.g. Annual Rent 2026"
                            />
                            <ErrorText>{errors[`item_${idx}_desc`]}</ErrorText>
                          </div>

                          {/* Category */}
                          <div>
                            <Label>Category</Label>
                            <AppSelect
                              size="sm"
                              value={item.category}
                              onValueChange={(v) =>
                                updateLineRow(item.id, "category", v)
                              }
                              options={CATEGORIES.map((cat) => ({
                                value: cat,
                                label: cat,
                              }))}
                            />
                          </div>

                          {/* Amount (NGN) */}
                          <div>
                            <Label required>Amount (₦)</Label>
                            <CurrencyInput
                              variant="underline"
                              value={item.amount || undefined}
                              invalid={!!errors[`item_${idx}_amt`]}
                              onChange={(n) =>
                                updateLineRow(item.id, "amount", n)
                              }
                            />
                            <ErrorText>{errors[`item_${idx}_amt`]}</ErrorText>
                          </div>
                        </div>

                        <button
                          onClick={() => removeLineRow(item.id)}
                          className="shrink-0 mt-5 h-8 w-8 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/20 text-slate-400 hover:text-rose-500 transition-all border border-transparent hover:border-rose-100 flex items-center justify-center cursor-pointer"
                          title="Delete Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={addLineRow}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-dashed border-border hover:border-primary text-foreground text-xs font-bold transition-all cursor-pointer w-full justify-center bg-card shadow-sm"
                >
                  <Plus className="w-4 h-4 text-primary" /> Add Line Item Row
                </button>

                {/* Totals preview */}
                {subtotal > 0 && (
                  <div className="border border-border rounded-lg p-4 bg-slate-50/50 dark:bg-slate-900/10 space-y-2">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-3">
                      Line Items Summary
                    </p>
                    <div className="flex justify-between text-xs font-medium text-muted-foreground">
                      <span>Subtotal ({lineItems.length} items)</span>
                      <span className="font-bold text-foreground">
                        {formatNaira(subtotal)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── STEP 2: Tax & Documents ── */}
            {step === 2 && (
              <div className="space-y-6">
                {/* Tax settings row */}
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                    Taxes & Deductions
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 border border-border bg-slate-50/50 dark:bg-slate-900/10 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Apply VAT Tax</Label>
                        <input
                          type="checkbox"
                          checked={taxEnabled}
                          onChange={(e) => setTaxEnabled(e.target.checked)}
                          className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                        />
                      </div>
                      {taxEnabled && (
                        <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                          <Label>VAT Rate (%)</Label>
                          <div className="flex items-center gap-3">
                            <input
                              type="range"
                              min="0"
                              max="20"
                              step="0.5"
                              value={taxRate}
                              onChange={(e) =>
                                setTaxRate(Number(e.target.value))
                              }
                              className="flex-1 accent-primary cursor-pointer h-1 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none"
                            />
                            <span className="font-mono text-xs font-black text-foreground bg-card border border-border px-2 py-1 rounded w-12 text-center shrink-0">
                              {taxRate}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-4 border border-border bg-slate-50/50 dark:bg-slate-900/10 rounded-lg space-y-3">
                      <Label>Discount (Optional)</Label>
                      <CurrencyInput
                        variant="underline"
                        value={discountAmount || undefined}
                        onChange={(n) => setDiscountAmount(n)}
                        placeholder="Enter discount"
                      />
                      {discountAmount > 0 && (
                        <p className="text-[10px] text-muted-foreground">
                          -{formatNaira(discountAmount)} applied
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Totals */}
                  <div className="mt-4 p-4 border border-border rounded-lg bg-card space-y-2">
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Totals
                    </p>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="font-bold text-foreground">
                        {formatNaira(subtotal)}
                      </span>
                    </div>
                    {taxEnabled && (
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>VAT ({taxRate}%)</span>
                        <span className="font-bold text-foreground">
                          +{formatNaira(taxAmount)}
                        </span>
                      </div>
                    )}
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-xs text-rose-500">
                        <span>Discount</span>
                        <span className="font-bold">
                          -{formatNaira(discountAmount)}
                        </span>
                      </div>
                    )}
                    <div className="border-t border-border pt-2 flex justify-between text-sm font-black text-foreground">
                      <span>Grand Total</span>
                      <span className="text-primary">
                        {formatNaira(grandTotal)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="h-px bg-border" />

                {/* Document Attachments */}
                <div>
                  <h3 className="text-xs font-bold text-foreground uppercase tracking-widest mb-4">
                    Document Attachments
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Receipt Attachment */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Receipt Document
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Attach the receipt from your landlord
                          </p>
                        </div>
                        {receiptFile && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Attached
                          </span>
                        )}
                      </div>

                      {receiptFile ? (
                        <FilePreview
                          attached={receiptFile}
                          label={receiptFile.file.name}
                          onRemove={() => setReceiptFile(null)}
                        />
                      ) : (
                        <UploadZone
                          onFile={handleReceiptFile}
                          dragging={receiptDragging}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setReceiptDragging(true);
                          }}
                          onDragLeave={() => setReceiptDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setReceiptDragging(false);
                            const f = e.dataTransfer.files[0];
                            if (f) handleReceiptFile(f);
                          }}
                        >
                          <p className="text-xs font-bold text-foreground">
                            Drop receipt here
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            PDF, image up to 10MB
                          </p>
                        </UploadZone>
                      )}

                      {/* Stated amount on receipt */}
                      <div className="space-y-1.5">
                        <Label>Stated Amount on Receipt (₦)</Label>
                        <CurrencyInput
                          variant="underline"
                          value={statedReceiptAmount || undefined}
                          onChange={(n) => setStatedReceiptAmount(n)}
                          placeholder="Enter amount shown on receipt"
                        />
                        {priceMismatch && (
                          <div className="flex items-start gap-2 p-3 rounded-lg border border-amber-300 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-800 text-amber-800 dark:text-amber-300 animate-in fade-in duration-200">
                            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-[10px] font-black uppercase tracking-wider mb-0.5">
                                Price Mismatch Detected
                              </p>
                              <p className="text-[10px] leading-relaxed">
                                Receipt states{" "}
                                <strong>
                                  {formatNaira(statedReceiptAmount)}
                                </strong>{" "}
                                but computed total is{" "}
                                <strong>{formatNaira(grandTotal)}</strong>.
                                Difference:{" "}
                                {formatNaira(
                                  Math.abs(statedReceiptAmount - grandTotal),
                                )}
                                . Please verify before proceeding.
                              </p>
                            </div>
                          </div>
                        )}
                        {statedReceiptAmount > 0 && !priceMismatch && (
                          <p className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold">
                            <CheckCircle2 className="w-3 h-3" /> Amount matches
                            computed total
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Lease Agreement Attachment */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-foreground">
                            Lease Agreement
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            Attach your tenancy agreement
                          </p>
                        </div>
                        {leaseFile && (
                          <span className="flex items-center gap-1 text-[9px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 px-2 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Attached
                          </span>
                        )}
                      </div>

                      {leaseFile ? (
                        <FilePreview
                          attached={leaseFile}
                          label={leaseFile.file.name}
                          onRemove={() => setLeaseFile(null)}
                        />
                      ) : (
                        <UploadZone
                          onFile={handleLeaseFile}
                          dragging={leaseDragging}
                          onDragOver={(e) => {
                            e.preventDefault();
                            setLeaseDragging(true);
                          }}
                          onDragLeave={() => setLeaseDragging(false)}
                          onDrop={(e) => {
                            e.preventDefault();
                            setLeaseDragging(false);
                            const f = e.dataTransfer.files[0];
                            if (f) handleLeaseFile(f);
                          }}
                        >
                          <p className="text-xs font-bold text-foreground">
                            Drop lease agreement here
                          </p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">
                            PDF, DOCX, image up to 10MB
                          </p>
                        </UploadZone>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── STEP 3: Receipt Preview ── */}
            {step === 3 && (
              <div className="space-y-6">
                {/* Instruction banner */}
                <div className="p-4 rounded-lg border border-primary/20 bg-primary/5 text-sm text-foreground">
                  <p className="font-black text-[10px] uppercase tracking-widest text-primary mb-1">
                    Review & Finalise
                  </p>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    This is your final receipt. Review all details carefully —
                    go back to any step to make changes. Once you are satisfied,
                    sign and click{" "}
                    <strong className="text-foreground">
                      Generate Final Receipt
                    </strong>
                    .
                  </p>
                </div>

                {/* Action buttons bar */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={printReceipt}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" /> Print
                  </button>
                  <button
                    onClick={downloadReceipt}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" /> Save PDF
                  </button>
                  <button
                    onClick={shareReceipt}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-border bg-card hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold transition-all cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" /> Share
                  </button>
                  <div className="ml-auto flex items-center gap-1.5 text-[10px] text-muted-foreground">
                    <Pencil className="w-3 h-3" />
                    <span>Go back to any step to edit details</span>
                  </div>
                </div>

                {/* The actual receipt document */}
                <div className="overflow-x-auto border border-border rounded-lg bg-slate-50/50 dark:bg-slate-900/5 p-4 sm:p-8 flex justify-center">
                  <div className="w-full max-w-[820px] shadow-lg">
                    <ReceiptDocument
                      ref={receiptDocRef}
                      receipt={previewReceipt}
                    />
                  </div>
                </div>

                {/* FCT-IRS warning */}
                <div className="p-4 rounded-lg border border-red-200 bg-red-50/10 text-red-700 dark:bg-red-950/10 dark:text-red-400 dark:border-red-900/30 space-y-2 select-none">
                  <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-red-800 dark:text-red-300">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-600 animate-pulse shrink-0" />
                    FCT-IRS Audit & Clawback Warning (NTAA Sec. 57)
                  </div>
                  <p className="text-[11px] font-medium leading-relaxed">
                    Under FCT-IRS regulations, all rent allowance claims must be
                    compiled and submitted on or before{" "}
                    <strong className="font-extrabold text-red-900 dark:text-red-200">
                      31st May, 2026
                    </strong>
                    . Where the Service determines that any claim submitted by
                    employee is false, misleading, or inaccurate, the applicable
                    tax relief shall immediately cease to apply, and any tax
                    benefit previously enjoyed shall be recovered/clawed back
                    from the employee's salary in the month immediately
                    following formal notification to the employer.
                  </p>
                </div>

                {/* Declaration checkbox */}
                <div className="pt-2">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      checked={draft.declaration}
                      onChange={(e) => setDeclaration(e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-border accent-primary cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                      I confirm all information provided is accurate and
                      complete in accordance with{" "}
                      <span className="text-foreground font-bold underline underline-offset-4 decoration-primary/20">
                        Section 57 of the NTAA regulations
                      </span>
                      .
                    </span>
                  </label>
                  <ErrorText>{errors.declaration}</ErrorText>
                </div>
              </div>
            )}
          </div>

          {/* Navigation buttons */}
          <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
            <button
              onClick={back}
              disabled={step === 0}
              className={`flex items-center gap-1 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                step === 0
                  ? "opacity-0 pointer-events-none"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <ArrowLeft className="h-4 w-4" /> Previous Step
            </button>

            {step < 3 ? (
              <button
                onClick={next}
                className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:opacity-90 shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                Next Step <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={generate}
                className="h-11 px-6 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:opacity-90 shadow-md flex items-center gap-1.5 cursor-pointer active:scale-95 transition-all"
              >
                Generate Final Receipt <Save className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Stamp animation overlay */}
      {stamping && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl transition-all duration-300">
          <div ref={stampRef} className="relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-3xl" />
            <svg
              viewBox="0 0 200 200"
              className="w-60 h-60 relative text-primary"
            >
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                cx="100"
                cy="100"
                r="76"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeDasharray="4 6"
                opacity="0.2"
              />
              <text
                x="100"
                y="92"
                textAnchor="middle"
                fontWeight="900"
                fontSize="22"
                fill="currentColor"
                className="tracking-tighter uppercase font-sans"
              >
                Certified
              </text>
              <text
                x="100"
                y="120"
                textAnchor="middle"
                fontWeight="bold"
                fontSize="12"
                fill="currentColor"
                className="tracking-[0.4em] opacity-50 uppercase font-sans"
              >
                FCT-IRS 2026
              </text>
            </svg>
          </div>
        </div>
      )}
    </FiscalDashboardShell>
  );
}

export default NewReceipt;
