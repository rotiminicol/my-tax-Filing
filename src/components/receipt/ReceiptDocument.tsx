import { forwardRef } from "react";
import type { Receipt } from "@/lib/rr/types";
import { formatNaira } from "@/lib/rr/format";
import logoUrl from "@/assets/logo.png";

function Row({ k, v, isMono = false }: { k: string; v?: string | number; isMono?: boolean }) {
  return (
    <div className="grid grid-cols-[180px_1fr] gap-4 py-2 border-b border-slate-100 last:border-0">
      <dt className="text-[9px] font-mono uppercase tracking-widest text-slate-500 font-semibold flex items-center select-none">{k}</dt>
      <dd className={`text-xs font-bold text-black leading-relaxed ${isMono ? "font-mono tracking-tight" : "font-sans"}`}>{v || " "}</dd>
    </div>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section className="mb-6 last:mb-0">
      <header className="flex items-center gap-3 mb-3 select-none">
        <span className="font-mono text-[9px] tracking-widest text-slate-400 font-bold uppercase">Section {id}</span>
        <h3 className="font-sans font-black uppercase text-[10px] tracking-widest text-black">{title}</h3>
        <span className="flex-1 h-px bg-slate-200" />
      </header>
      <dl>{children}</dl>
    </section>
  );
}

interface Props { 
  receipt: Receipt;
  signatureData?: string;
  typedSignature?: string;
  sigMode?: "draw" | "type";
  certifiedDate?: string;
  className?: string;
}

const ReceiptDocument = forwardRef<HTMLDivElement, Props>(({ 
  receipt, 
  signatureData, 
  typedSignature, 
  sigMode = "draw", 
  certifiedDate,
  className,
}, ref) => {
  const t = receipt.taxpayer, l = receipt.landlord, e = receipt.employer;
  return (
    <div ref={ref} className={`bg-white border border-slate-200 shadow-sm relative w-full max-w-[820px] mx-auto p-8 sm:p-12 text-black select-text ${className ?? ""}`}>

      <div className="relative z-10">
        {/* Document Header */}
        <header className="flex items-center justify-between gap-4 mb-4 select-none">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="My Tax Filing Logo" className="h-12 w-auto object-contain" style={{ imageRendering: "crisp-edges" }} />
            <div className="flex flex-col">
              <span className="font-black text-base tracking-tight text-black leading-none">My Tax Filing</span>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase">Official Tax Document</span>
            </div>
          </div>
          <div className="text-right font-mono text-[9px] tracking-widest text-slate-500 uppercase leading-normal">
            <div>Ref: <span className="text-black font-bold font-sans">{receipt.id}</span></div>
            <div className="mt-0.5">Date: <span className="text-black font-bold font-sans">{new Date(receipt.createdAt).toLocaleDateString("en-NG", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase()}</span></div>
          </div>
        </header>

        {/* Title */}
        <div className="text-center mb-8 select-none">
          <div className="h-px bg-slate-200 mb-4" />
          <h1 className="font-sans font-black uppercase text-lg sm:text-xl text-black tracking-widest">
            Rent Receipt{t.fullName ? ` for ${t.fullName}` : ""}
          </h1>
          <p className="text-[9px] tracking-widest font-mono uppercase text-slate-400 mt-1">FCT-IRS · Section 57 Compliance · NTAA Certified</p>
          <div className="h-px bg-slate-200 mt-4" />
        </div>

        {/* Section A: Taxpayer */}
        <Section id="A" title="Taxpayer Details">
          <Row k="Full Name of Taxpayer" v={t.fullName} />
          <Row k="Tax ID of Taxpayer (TIN)" v={t.taxId} isMono={true} />
          <Row k="Address of Rented Property" v={t.propertyAddress} />
        </Section>

        {/* Section B: Allowance */}
        <Section id="B" title="Allowance & Rental Claims">
          <Row k="Annual Rental Amount" v={formatNaira(t.annualRentalAmount)} isMono={true} />
          <Row k="Amount of Allowance Claimed" v={formatNaira(t.allowanceClaimed)} isMono={true} />
          <Row k="Period of Claim" v={e.claimYear} isMono={true} />
        </Section>

        {/* Section C: Landlord/Agent */}
        <Section id="C" title={l.type === "agent" ? "Agent / Landlord Details" : "Landlord Details"}>
          <Row k="Full Name of Landlord/Agent" v={l.fullName} />
          <Row k={l.type === "agent" ? "Office Address of Agent" : "Residential Address of Landlord"} v={l.address} />
          <Row k="Contact Phone Number" v={l.phone} isMono={true} />
          <Row k="Contact Email Address" v={l.email} />
          <Row k="Tax ID (where applicable)" v={l.taxId} isMono={true} />
        </Section>

        {/* Section D: Employer */}
        <Section id="D" title="Employer Details">
          <Row k="Full Corporate Name" v={e.companyName} />
          <Row k="Employer ID / Tax ID" v={e.taxId} isMono={true} />
          <Row k="Registered FCT Tax Office" v={e.taxOffice} />
        </Section>

        {/* Section E: Regulatory compliance */}
        <Section id="E" title="FCT-IRS Regulatory Compliance Notice">
          <div className="text-xs text-slate-700 space-y-4 leading-relaxed font-sans pt-2">
            <p>
              In accordance with the provisions of <span className="font-black text-black">Section 57 of the Nigeria Tax Administration Act (NTAA)</span>, the taxpayer is required to submit this certified document along with all relevant supporting tenancy agreements and rental transaction documents to the registered employer's tax office on or before the statutory deadline of <span className="font-black text-black">31st May, 2026</span>.
            </p>
            
            <div className="p-4 border border-black bg-slate-50 text-black rounded select-none">
              <span className="font-mono uppercase text-[9px] tracking-widest block font-black border-b border-black/10 pb-1.5 mb-2">
                Warning: Salary Clawback & Relief Cessation Clause
              </span>
              <p className="text-[10px] leading-normal font-medium text-slate-800">
                Where the Service determines that any claim submitted by an employee is false, misleading, or inaccurate, the applicable tax relief shall immediately cease to apply. Furthermore, any tax benefit previously enjoyed as a result of such claim shall be recovered from the employee's salary in the month immediately following formal notification by the Service to the employer.
              </p>
            </div>
          </div>
        </Section>

        {/* Section F: Signatures */}
        <Section id="F" title="Declaration & Certification">
          <p className="text-xs text-slate-700 leading-relaxed pt-2">
            I, <span className="font-bold text-black">{t.fullName || " "}</span>, hereby declare that the information furnished
            above is true, accurate, and correct in accordance with <span className="font-bold text-black">Section 57 of the Nigerian Tax
            Administration Act (NTAA)</span>. I understand that any false declaration will result in immediate clawbacks and legal penalties under FCT-IRS rules.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 select-none">
            <div>
              <div className="border-b border-black h-12 flex items-end justify-center pb-1">
                {sigMode === "draw" && signatureData ? (
                  <img src={signatureData} alt="Signature" className="h-10 max-w-full object-contain brightness-0" />
                ) : sigMode === "type" && typedSignature ? (
                  <span 
                    className="text-lg font-bold text-black pb-1 select-all"
                    style={{ fontFamily: "cursive, sans-serif", fontStyle: "italic" }}
                  >
                    {typedSignature}
                  </span>
                ) : (
                  <div className="text-[10px] text-slate-300 italic select-none">Not yet certified</div>
                )}
              </div>
              <p className="text-[8px] tracking-widest text-slate-500 font-mono uppercase mt-1">Taxpayer Signature</p>
            </div>
            <div>
              <div className="border-b border-black h-12 flex items-end justify-center pb-2">
                {certifiedDate ? (
                  <span className="text-xs font-mono font-bold text-black uppercase">{certifiedDate}</span>
                ) : (
                  <div className="text-[10px] text-slate-300 italic select-none">Not yet dated</div>
                )}
              </div>
              <p className="text-[8px] tracking-widest text-slate-500 font-mono uppercase mt-1">Date Certified</p>
            </div>
          </div>
        </Section>

        {/* Document Footer */}
        <footer className="mt-10 pt-4 border-t border-slate-200 flex items-center justify-between text-[8px] tracking-widest font-mono text-slate-400 uppercase select-none">
          <div className="flex items-center gap-2">
            <img src={logoUrl} alt="Logo" className="h-4 w-auto object-contain opacity-40" />
            <span>MyRentReceipt</span>
          </div>
          <span>FCT-IRS Compliant · Section 57, NTAA</span>
        </footer>
      </div>
    </div>
  );
});

ReceiptDocument.displayName = "ReceiptDocument";
export default ReceiptDocument;
