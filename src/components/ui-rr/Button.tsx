import type { ButtonHTMLAttributes, ReactNode } from "react";

type V = "primary" | "ghost" | "danger" | "subtle" | "secondary";
const styles: Record<V, string> = {
  primary: "bg-primary text-primary-foreground hover:opacity-90 shadow-lg shadow-primary/10",
  secondary: "bg-secondary text-foreground hover:bg-muted",
  ghost: "border border-border text-foreground hover:bg-secondary",
  danger: "bg-destructive text-destructive-foreground hover:opacity-90",
  subtle: "text-muted-foreground hover:text-foreground",
};

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: V;
  children: ReactNode;
}

export default function Button({ variant = "primary", className = "", children, ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`relative inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

