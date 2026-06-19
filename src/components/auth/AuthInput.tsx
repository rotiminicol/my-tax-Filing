import { useState, type InputHTMLAttributes, type ReactNode } from "react";
import { Eye, EyeOff, User } from "lucide-react";
import { fiscal } from "@/components/fiscal-landing/tokens";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: ReactNode;
  trailingIcon?: "person" | "password";
}

const inputBase =
  "w-full h-12 px-4 border-0 border-b-4 border-black bg-transparent text-base font-bold transition-all duration-200 outline-none";

export default function AuthInput({
  label,
  error,
  hint,
  trailingIcon,
  type = "text",
  id,
  className = "",
  ...rest
}: Props) {
  const [show, setShow] = useState(false);
  const isPwd = type === "password" || trailingIcon === "password";
  const realType = isPwd ? (show ? "text" : "password") : type;
  const fieldId = id || label.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-2 w-full group">
      {label && (
        <label htmlFor={fieldId} className="text-sm font-bold" style={{ color: "black" }}>
          {label}
        </label>
      )}
      <div className="relative">
        <input
          {...rest}
          id={fieldId}
          type={realType}
          className={`${inputBase} ${isPwd || trailingIcon ? "pr-12" : ""} ${className}`}
          style={{ color: "black" }}
        />
        {trailingIcon === "person" && (
          <User
            className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none transition-colors group-focus-within:text-[#003527]"
            style={{ color: fiscal.outline }}
          />
        )}
        {isPwd && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors hover:text-[#003527]"
            style={{ color: fiscal.outline }}
            aria-label={show ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        )}
      </div>
      {hint && !error && <div>{hint}</div>}
      {error && <p className="text-[11px] font-semibold text-red-600">{error}</p>}
    </div>
  );
}
