import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff } from "lucide-react";
import { fiscal } from "@/components/fiscal-landing/tokens";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
}

const inputClass =
  "w-full border-0 border-b-4 border-black bg-transparent p-4 text-base font-bold transition-all duration-200 outline-none";

const inputStyle = {
  color: "black",
};

export function signupInputFocus(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "black";
  e.target.style.borderBottomWidth = "4px";
}

export function signupInputBlur(e: React.FocusEvent<HTMLInputElement>) {
  e.target.style.borderColor = "black";
  e.target.style.borderBottomWidth = "4px";
}

export default function SignupField({ label, error, hint, type = "text", id, className = "", ...rest }: Props) {
  const [show, setShow] = useState(false);
  const isPwd = type === "password";
  const realType = isPwd ? (show ? "text" : "password") : type;
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1 w-full">
      <label htmlFor={fieldId} className="text-sm font-bold" style={{ color: "black" }}>
        {label}
      </label>
      <div className="relative">
        <input
          {...rest}
          id={fieldId}
          type={realType}
          onFocus={signupInputFocus}
          onBlur={signupInputBlur}
          className={`${inputClass} ${isPwd ? "pr-12" : ""} ${className}`}
          style={inputStyle}
        />
        {isPwd && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: fiscal.outline }}
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {hint && !error && <div className="mt-1">{hint}</div>}
      {error && <p className="text-[11px] font-semibold mt-1 text-red-600">{error}</p>}
    </div>
  );
}
