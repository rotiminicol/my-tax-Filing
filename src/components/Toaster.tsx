import { Toaster as Sonner, toast } from "sonner";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";

export function AppToaster() {
  return (
    <Sonner
      position="top-right"
      gap={8}
      offset={24}
      duration={5000}
      visibleToasts={5}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "group relative w-[380px] max-w-[92vw] flex items-center gap-4 rounded-2xl border border-black/10 bg-white/95 backdrop-blur-xl px-5 py-4 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] text-black font-sans",
          title: "text-sm font-black tracking-tight leading-none mb-1",
          description: "text-[11px] text-black/50 font-bold leading-relaxed",
          actionButton:
            "ml-auto text-[10px] font-black tracking-widest uppercase text-white bg-black px-4 py-2 rounded-xl hover:opacity-90 transition-all",
          cancelButton:
            "text-[10px] font-black tracking-widest uppercase text-black/40 hover:text-black transition-all",
          closeButton:
            "absolute top-3 right-3 text-black/20 hover:text-black transition-colors",
        },
      }}
      icons={{
        success: (
          <div className="flex items-center gap-3 shrink-0">
            <LogoMark size={80} />
            <div className="w-px h-6 bg-black/10" />
            <CheckCircle2 className="h-5 w-5 text-black shrink-0" />
          </div>
        ),
        error: (
          <div className="flex items-center gap-3 shrink-0">
            <LogoMark size={80} />
            <div className="w-px h-6 bg-black/10" />
            <XCircle className="h-5 w-5 text-black shrink-0" />
          </div>
        ),
        warning: (
          <div className="flex items-center gap-3 shrink-0">
            <LogoMark size={80} />
            <div className="w-px h-6 bg-black/10" />
            <AlertTriangle className="h-5 w-5 text-black shrink-0" />
          </div>
        ),
        info: (
          <div className="flex items-center gap-3 shrink-0">
            <LogoMark size={80} />
            <div className="w-px h-6 bg-black/10" />
            <Info className="h-5 w-5 text-black shrink-0" />
          </div>
        ),
      }}
      closeButton
    />
  );
}

export const notify = {
  success: (title: string, description?: ReactNode) =>
    toast.success(title, { description }),
  error: (title: string, description?: ReactNode) =>
    toast.error(title, { description }),
  info: (title: string, description?: ReactNode) =>
    toast.info(title, { description }),
  warning: (title: string, description?: ReactNode) =>
    toast.warning(title, { description }),
};

export { X };