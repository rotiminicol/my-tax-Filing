import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

export default function DeadlineBanner() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  
  return (
    <div className="w-full bg-black text-white py-2.5 flex items-center justify-between px-6 xl:px-12">
      <div className="flex items-center gap-2.5">
        <AlertTriangle className="h-4 w-4 shrink-0" />
        <div className="text-[13px] font-black tracking-tight uppercase">
          Deadline: 31 May 2026   File on time to avoid penalties.
        </div>
      </div>
      <button 
        onClick={() => setOpen(false)} 
        className="text-white hover:opacity-70 transition-opacity ml-4 shrink-0" 
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
