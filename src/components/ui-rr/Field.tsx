import type { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

export function Label({ children, required }: { children: ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
      {children}{required && <span className="text-primary ml-1">*</span>}
    </label>
  );
}

export function ErrorText({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return <p className="mt-2 text-xs font-semibold text-destructive">{children}</p>;
}

const inputStyles = "w-full text-sm text-foreground outline-none transition-all placeholder:text-muted-foreground/30";
const roundedStyles = "bg-gray-50/50 border border-border rounded-xl px-4 py-3 focus:bg-background focus:ring-2 focus:ring-primary/5 focus:border-primary";
const underlineStyles = "bg-transparent border-b-[3px] border-black px-0 py-2 focus:border-black/60 rounded-none";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  invalid?: boolean;
  mono?: boolean;
  variant?: "rounded" | "underline";
}

export function Input({ invalid, mono, variant = "rounded", className = "", ...rest }: InputProps) {
  const baseClass = variant === "rounded" ? roundedStyles : underlineStyles;
  return (
    <input 
      {...rest} 
      className={`${inputStyles} ${baseClass} ${mono ? "font-mono" : ""} ${invalid ? "border-destructive focus:border-destructive" : ""} ${className}`} 
    />
  );
}

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> { 
  invalid?: boolean;
  variant?: "rounded" | "underline";
}

export function Textarea({ invalid, variant = "rounded", className = "", ...rest }: TextareaProps) {
  const baseClass = variant === "rounded" ? roundedStyles : underlineStyles;
  return (
    <textarea 
      {...rest} 
      className={`${inputStyles} ${baseClass} resize-none ${invalid ? "border-destructive focus:border-destructive" : ""} ${className}`} 
    />
  );
}

export function CurrencyInput({ value, onChange, invalid, variant = "rounded", ...rest }: { value: number | undefined; onChange: (n: number) => void; invalid?: boolean; variant?: "rounded" | "underline" } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const display = value ? value.toLocaleString("en-NG") : "";
  const baseClass = variant === "rounded" ? roundedStyles : underlineStyles;
  return (
    <div className={`flex items-center gap-2 ${inputStyles} ${baseClass} ${invalid ? "border-destructive focus-within:border-destructive" : ""}`}>
      <span className={`font-black ${variant === 'underline' ? 'text-black' : 'text-muted-foreground'}`}>₦</span>
      <input
        {...rest}
        inputMode="numeric"
        value={display}
        onChange={(e) => onChange(Number(e.target.value.replace(/[^\d]/g, "")) || 0)}
        className="flex-1 bg-transparent outline-none font-black text-lg"
      />
    </div>
  );
}

export function TaxIdInput({ value, onChange, variant = "rounded", ...rest }: { value: string; onChange: (s: string) => void; variant?: "rounded" | "underline" } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const baseClass = variant === "rounded" ? roundedStyles : underlineStyles;
  return (
    <input
      {...rest}
      value={value}
      onChange={(e) => {
        const d = e.target.value.replace(/\D/g, "").slice(0, 10);
        onChange(d.length <= 2 ? d : d.slice(0, 2) + "-" + d.slice(2));
      }}
      placeholder="XX-XXXXXXXX"
      className={`${inputStyles} ${baseClass} font-mono tracking-wider uppercase font-black text-lg`}
    />
  );
}

