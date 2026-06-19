import { useState, type InputHTMLAttributes } from "react";
import { Eye, EyeOff } from "lucide-react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
}

export default function AuthField({ label, error, hint, type = "text", ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  const realType = isPwd ? (show ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1 w-full">
      <label className="flex justify-between items-end px-0">
        <span className="font-bold text-sm text-black uppercase">
          {label}
        </span>
        {hint && !error && (
          <span className="text-[9px] font-black text-muted-foreground/60 uppercase tracking-widest">
            {hint}
          </span>
        )}
      </label>
      
      <div className="relative group">
        <input
          {...rest}
          type={realType}
          className={`
            w-full h-12 px-0 rounded-none text-base font-bold transition-all outline-none
            bg-transparent text-black border-b-4 border-black
            placeholder:text-black/30
            focus:border-black
            ${error ? "border-red-500 focus:border-red-500" : ""}
            ${isPwd ? "pr-12" : ""}
          `}
        />
        
        {isPwd && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-black hover:bg-slate-100 transition-colors"
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error && (
        <p className="px-1 text-[11px] font-bold text-red-500 animate-in fade-in slide-in-from-top-1">
          {error}
        </p>
      )}
    </div>
  );
}