import { cn } from "@/lib/utils";

/** Shared visual language for Select, DropdownMenu, and AppSelect. */
export const dropdownStyles = {
  trigger: {
    base: cn(
      "group flex w-full items-center justify-between gap-3 text-left",
      "rounded-xl border bg-white font-medium text-[#0b1c30]",
      "shadow-[0_1px_2px_rgba(11,28,48,0.04)]",
      "transition-all duration-200 ease-out",
      "hover:border-[#064e3b]/35 hover:shadow-[0_4px_16px_rgba(11,28,48,0.08)]",
      "focus:outline-none focus:border-[#064e3b] focus:ring-[3px] focus:ring-[#064e3b]/15",
      "data-[state=open]:border-[#064e3b] data-[state=open]:ring-[3px] data-[state=open]:ring-[#064e3b]/15",
      "data-[state=open]:shadow-[0_8px_24px_rgba(11,28,48,0.1)]",
      "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:shadow-none",
      "[&>span]:line-clamp-1 data-[placeholder]:text-[#404944]/75",
    ),
    sm: "min-h-9 px-3 py-2 text-xs",
    md: "min-h-11 px-4 py-2.5 text-sm",
    lg: "min-h-12 px-4 py-3 text-base",
  },
  chevron: cn(
    "flex shrink-0 items-center justify-center rounded-lg",
    "bg-[#eff4ff] text-[#003527]",
    "transition-transform duration-200",
    "group-data-[state=open]:rotate-180 group-data-[state=open]:bg-[#b0f0d6]",
  ),
  chevronSm: "h-6 w-6",
  chevronMd: "h-7 w-7",
  chevronLg: "h-8 w-8",
  panel: cn(
    "z-[100] overflow-hidden rounded-2xl border border-[#e2e8f0] bg-white",
    "shadow-[0_16px_48px_rgba(11,28,48,0.14),0_4px_12px_rgba(11,28,48,0.06)]",
    "data-[state=open]:animate-in data-[state=closed]:animate-out",
    "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
    "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
    "data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2",
  ),
  viewport: "p-1.5",
  item: cn(
    "relative flex w-full cursor-pointer select-none items-center rounded-xl",
    "py-2.5 pl-3 pr-10 text-sm font-medium text-[#0b1c30] outline-none",
    "transition-colors duration-150",
    "data-[highlighted]:bg-[#eff4ff] data-[highlighted]:text-[#003527]",
    "data-[state=checked]:bg-[#b0f0d6]/35 data-[state=checked]:text-[#003527] data-[state=checked]:font-semibold",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
  ),
  itemIndicator: cn(
    "absolute right-3 flex h-5 w-5 items-center justify-center rounded-full",
    "bg-[#064e3b] text-white",
  ),
  label: "px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-[#404944]/80",
  separator: "my-1 h-px bg-[#e2e8f0]",
  menuItem: cn(
    "relative flex cursor-pointer select-none items-center gap-2 rounded-xl px-3 py-2.5",
    "text-sm font-medium text-[#0b1c30] outline-none transition-colors duration-150",
    "focus:bg-[#eff4ff] focus:text-[#003527] data-[highlighted]:bg-[#eff4ff] data-[highlighted]:text-[#003527]",
    "data-[disabled]:pointer-events-none data-[disabled]:opacity-40",
  ),
} as const;

export type DropdownSize = "sm" | "md" | "lg";

export function dropdownTriggerClass(size: DropdownSize = "md", className?: string) {
  const sizeClass =
    size === "sm" ? dropdownStyles.trigger.sm : size === "lg" ? dropdownStyles.trigger.lg : dropdownStyles.trigger.md;
  return cn(dropdownStyles.trigger.base, sizeClass, className);
}

export function dropdownChevronClass(size: DropdownSize = "md") {
  const iconSize =
    size === "sm" ? dropdownStyles.chevronSm : size === "lg" ? dropdownStyles.chevronLg : dropdownStyles.chevronMd;
  return cn(dropdownStyles.chevron, iconSize);
}
