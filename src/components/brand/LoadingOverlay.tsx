import { useLoadingStore } from "@/store/loading";
import { LogoMark } from "@/components/brand/Logo";

export default function LoadingOverlay() {
  const { isLoading, message } = useLoadingStore();

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center backdrop-blur-md animate-in fade-in duration-300" style={{ backgroundColor: "rgba(7,16,10,0.92)" }}>
      <div className="relative flex flex-col items-center max-w-xs text-center p-6">
        
        {/* Ring & Logo Container */}
        <div className="relative w-28 h-28 flex items-center justify-center">
          {/* Animated Glow Backing */}
          <div className="absolute inset-0 bg-primary/5 dark:bg-primary/10 rounded-full blur-xl animate-pulse" />
          
          {/* Outer Spin Ring */}
          <div className="absolute inset-0 rounded-full border-[3px] border-slate-100 dark:border-neutral-900" />
          <div className="absolute inset-0 rounded-full border-[3px] border-t-black dark:border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin duration-1000" />
          
          {/* Logo Mark – reduced to 100px */}
          <div className="relative scale-110 animate-pulse duration-[2000ms]">
            <LogoMark size={100} />
          </div>
        </div>
      </div>
    </div>
  );
}